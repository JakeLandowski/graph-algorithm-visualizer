/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphModel.js
 * 
 *  Represents the data structure for the Graph class..
 */

'use strict';
define(['classes/Event', 'classes/graph/AdjacencyList', 
        'classes/graph/Vertex', 'classes/graph/Edge', 
        'classes/SpacialIndex', 'classes/CommandLog'], 
function(Event, AdjacencyList, Vertex, Edge, SpacialIndex, CommandLog)
{
    const GraphModel = function(width, height, config)
    {
        // Shape size/styling information
        this.config = config;

        // SpacialIndex needed information
        this.cellRatio  = 5;
        this.setDimensions(width, height);

        this.adjList   = new AdjacencyList(this.config.undirected)
        Edge.adjList   = this.adjList; // Edge Class Static Reference
        Vertex.adjList = this.adjList; // Vertex Class Static Reference
        
        this.edgeSpacialIndex   = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);
        this.vertexSpacialIndex = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);

        this.onVertexAdded         = new Event(this);
        this.onVertexRemoved       = new Event(this);
        this.onVertexMoved         = new Event(this);
        this.onVertexSelected      = new Event(this);
        this.onVertexDeselected    = new Event(this);

        this.onTrackingEdgeAdded   = new Event(this);
        this.onTrackingEdgeRemoved = new Event(this);
        this.onTrackingEdgeMoved   = new Event(this);
        
        this.onEdgeAdded           = new Event(this);
        this.onEdgeRemoved         = new Event(this);
        this.onEdgeMoved      = new Event(this);
 
        this.userCommands = new CommandLog();
    };

    GraphModel.prototype = 
    {

//====================== Command Handling ===========================//

        dispatch(command, clearRedo=true)
        {
            if(this[command.type])
            {
                this[command.type](command.data);
                this.userCommands.record(command, clearRedo);
            }
            else throw 'Tried to run non-existant command ' + command.type;
        },

        undo()
        {
            const command = this.userCommands.undo();
            if(command && this[command.undo])
                this[command.undo](command.data);
        },

        redo()
        {
            const command = this.userCommands.redo();
            if(command) this.dispatch(command, false);
        },

        assertArgs(args, props, error)
        {
            props.forEach(function(prop)
            {
                if(args[prop] === undefined)
                    throw error;
            });
        },

//====================== Vertex Commands ===========================//

        addVertex(args={})
        {
            this.assertArgs(args, ['symbol', 'x', 'y', 'toNeighbors', 'fromNeighbors', 'returnSymbol', 'getSymbol'], 
                            'Missing arguments for addVertex command');

            const data          = args.getSymbol();
            const x             = args.x;
            const y             = args.y;
            const toNeighbors   = args.toNeighbors;
            const fromNeighbors = args.fromNeighbors;

            if(!this.adjList.vertexExists(data)) // prevent duplicates 
            {
                const vertex = new Vertex(data, x, y, 
                { 
                    vertexSize:        this.config.vertexSize,
                    vertexOutlineSize: this.config.vertexOutlineSize
                });

                this.adjList.insertVertex(vertex);
                this.vertexSpacialIndex.add(vertex);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
 
                // For Undo
                toNeighbors.forEach(function(neighbor)
                {
                    this.addEdge({ from: data, to: neighbor });

                }.bind(this));
                
                fromNeighbors.forEach(function(neighbor)
                {
                    this.addEdge({ from: neighbor, to: data });

                }.bind(this));
            }
        },

        removeVertex(args={})
        {
            this.assertArgs(args, ['symbol', 'x', 'y', 'toNeighbors', 'fromNeighbors', 'returnSymbol', 'getSymbol'], 
                            'Missing arguments for removeVertex command');

            const data         = args.symbol;
            const returnSymbol = args.returnSymbol;
            const removed      = this.adjList.getVertex(data);

            // Clean up edges
            removed.forEachEdge(function(edge)
            {
                this.removeEdge
                ({
                    from: edge.from,
                    to:   edge.to
                });

            }.bind(this));

            this.adjList.deleteVertex(data);
            this.vertexSpacialIndex.remove(removed);
            returnSymbol(data);

            this.onVertexRemoved.notify({ data: data });
        },

//====================== Edge Commands ===========================//

        addEdge(args={})
        {
            this.assertArgs(args, ['from', 'to'], 'Missing arguments for addEdge command');
            if(!this.adjList.vertexExists(args.from) || !this.adjList.vertexExists(args.to))
                throw 'Missing vertices in adjList for addEdge command';

            const from = args.from;
            const to   = args.to;  

            if(!this.adjList.edgeExists(from, to))
            {
                const edge = new Edge(args.from, args.to, this.config.edgeBoxSize);
                
                this.adjList.insertEdge(edge);
                this.edgeSpacialIndex.add(edge);
                
                this.onEdgeAdded.notify
                ({ 
                    from:      from,
                    to:        to, 
                    fromPoint: { x: edge.fromVertex.x, y: edge.fromVertex.y },
                    toPoint:   { x: edge.toVertex.x,   y: edge.toVertex.y   },
                    center:    { x: edge.x,            y: edge.y            }    
                });
            }
        },

        removeEdge(args={})
        {
            this.assertArgs(args, ['from', 'to'], 'Missing arguments for removeEdge command');
            if(!this.adjList.vertexExists(args.from) ||  !this.adjList.vertexExists(args.to)) 
                throw 'Missing vertices in adjList for removeEdge command';
            if(!this.adjList.edgeExists(args.from, args.to)) 
                throw 'edge was not found for removeEdge';

            const from = args.from;
            const to   = args.to;
            const edge = this.adjList.getEdge(from, to);
            
            // Clean Up Spacial Index
            this.adjList.deleteEdge(from, to);
            this.edgeSpacialIndex.remove(edge);
            this.onEdgeRemoved.notify
            ({ 
                from:      from,
                to:        to, 
                fromPoint: { x: edge.fromVertex.x, y: edge.fromVertex.y },
                toPoint:   { x: edge.toVertex.x,   y: edge.toVertex.y   },
                center:    { x: edge.x,            y: edge.y            }    
            });
        },

//====================== Move Entities ===========================//

        moveVertex(vertex, x, y)
        {
            // Update Vertex Position
            vertex.setPoints(x, y);
            this.vertexSpacialIndex.update(vertex);
            this.onVertexMoved.notify({ data: vertex.data, x: x, y: y });
            
            // Update Vertex's Edge Positions
            vertex.forEachEdge(function(edge)
            {
               this.moveEdge(edge); 

            }.bind(this));
        },

        moveEdge(edge)
        {
            edge.setPoints();
            this.edgeSpacialIndex.update(edge);

            const fromVertex = edge.fromVertex;
            const toVertex   = edge.toVertex;

            this.onEdgeMoved.notify
            ({  
                from: edge.from,
                to:   edge.to,
                fromPoint: { x: fromVertex.x, y: fromVertex.y }, 
                toPoint:   { x: toVertex.x,   y: toVertex.y   },
                center:    { x: edge.x,       y: edge.y       } 
            });
        },

//====================== Vertex Selection Methods ===========================//

        selectVertex(vertex)
        {
            this.selectedVertex = vertex;
            this.onVertexSelected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
        },

        deselectVertex()
        {
            const vertex = this.selectedVertex;
            this.onVertexDeselected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
            this.selectedVertex = null;
        },

        addTrackingEdge(x, y)
        {
            this.onTrackingEdgeAdded.notify
            ({ 
                start: { x: this.selectedVertex.x, y: this.selectedVertex.y },
                end:   { x: x, y: y }, 
            });
        },

        updateTrackingEdge(x, y)
        {;
            this.onTrackingEdgeMoved.notify({ x: x, y: y });
        },

        releaseTrackingEdge()
        {
            this.onTrackingEdgeRemoved.notify({});
        },

//====================== Spatial Index API (Graph -> Model -> Spatial) ===========================//

        vertexAt(x, y)
        {
            return this.vertexSpacialIndex.getEntity(x, y);
        },

        edgeAt(x, y)
        {
            return this.edgeSpacialIndex.getEntity(x, y);
        },

        updateVertexSpatial(vertex)
        {
            this.vertexSpacialIndex.update(vertex);
            
            vertex.forEachEdge(function(edge)
            {
               this.updateEdgeSpatial(edge); 

            }.bind(this)); 
        },

        updateEdgeSpatial(edge)
        {
            this.edgeSpacialIndex.update(edge);
        },

        /**
         *  Sets the new width/height and recreates the Spatialndex,
         *  re-registering all entities hitbox locations. 
         * 
         *  @param width  width desired, should be canvas width 
         *  @param height height desired, should be canvas width
         */
        resize(width, height)
        {
            this.setDimensions(width, height);

            this.vertexSpacialIndex = new SpacialIndex(width, height, this.cellRatio);
            this.adjList.forEachVertex(function(vertex)
            {
                this.vertexSpacialIndex.add(vertex);

            }.bind(this));

            this.edgeSpacialIndex = new SpacialIndex(width, height, this.cellRatio);
            this.adjList.forEachEdge(function(edge)
            {
                this.edgeSpacialIndex.add(edge);

            }.bind(this));
        },

        /**
         *  Sets the width/height info in the model, and consequently
         *  the cell width/height. This should reflect the canvas width/height.
         * 
         *  @param width  width desired, should be canvas width 
         *  @param height height desired, should be canvas width
         */
        setDimensions(width, height)
        {
            this.width      = width;
            this.cellWidth  = this.width / this.cellRatio;
            this.height     = height;
            this.cellHeight = this.height / this.cellRatio;
        }
    };

    return GraphModel;
 });
