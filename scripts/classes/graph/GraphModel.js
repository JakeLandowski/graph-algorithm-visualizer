/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphModel.js
 * 
 *  Represents the data structure for the Graph class..
 */

define(['classes/Event', 'classes/graph/Vertex', 'classes/graph/Edge', 'classes/SpacialIndex', 'classes/CommandLog'], 
function(Event, Vertex, Edge, SpacialIndex, CommandLog)
{
    console.log('GraphModel Class loaded');

    const GraphModel = function(width, height, config)
    {
        // Shape size/styling information
        this.config = config;
        Vertex.prototype.config = config;

        // SpacialIndex needed information
        this.cellRatio  = 5;
        this.setDimensions(width, height);

        this.adjList      = Object.create(null); // non-inheriting object
        this.edgeMap      = Object.create(null); 
        this.edgeSpacialIndex   = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);
        this.vertexSpacialIndex = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);
        this.vertexId = 0;

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
        this.onEdgePointMoved      = new Event(this);
 
        this.userCommands = new CommandLog();
    };

    GraphModel.prototype = 
    {
        dispatch(command)
        {
            if(this[command.type])
            {
                this[command.type](command.data);
            }
            else throw 'Tried to run non-existant command ' + command.type;

            this.userCommands.record(command);
        },

        undo()
        {
            let command = this.userCommands.undo();
            if(command && this[command.undo])
                this[command.undo](command.data);
        },

        addVertex(args={})
        {
            if(args.symbol === undefined || args.x === undefined || args.y === undefined)
                throw 'Missing arguments for addVertex command';

            let data = args.symbol;
            let x = args.x;
            let y = args.y;

            if(!this.adjList[data]) 
            {
                let vertex = new Vertex(data, x, y);

                this.adjList[data] = vertex;
                this.vertexSpacialIndex.add(vertex);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
            }
        },

        removeVertex(args={})
        {
            if(args.symbol === undefined)
                throw 'Missing arguments for removeVertex command';

            let data = args.symbol;
            let removed = this.adjList[data];

            if(removed)
            {
                // Clean up edges
                removed.forEachEdge(function(edge)
                {
                    this.dispatch
                    ({
                        type: 'removeEdge',
                        data: 
                        {
                            from: edge.fromVertex, 
                            to: edge.toVertex,
                        },
                        undo: 'addEdge'
                    });

                }.bind(this), this.edgeMap);

                this.vertexSpacialIndex.remove(removed);
                delete this.adjList[data];

                if(args.returnSymbol) args.returnSymbol(data);

                this.onVertexRemoved.notify({ data: data });
            }
        },

        // NEEDS REWORK FOR EDGE OBJECTS AND SUCH
        addEdge(args={})
        {
            const from = args.from;
            const to   = args.to;

            if(from === undefined || to === undefined)
                throw 'Missing arguments for addEdge command';
            else if(this.adjList[from.data] === undefined || this.adjList[to.data] === undefined)
                throw 'Missing vertices in adjList for addEdge command';
            else if(!this.edgeExists(from.data, to.data))
            {
                this.adjList[from.data].neighbors[to.data] = to.data;
                // this.adjList[to.data].neighbors[from.data] = from.data;
                
                let edge = new Edge(args.from.data, args.to.data, this.config.edgeBoxSize, this.adjList);
                this.edgeMap[ [from.data, to.data] ] = edge;
                this.edgeSpacialIndex.add(edge);
                
                this.onEdgeAdded.notify
                ({ 
                    from:      from.data,
                    to:        to.data, 
                    fromPoint: { x: from.x, y: from.y },
                    toPoint:   { x: to.x,   y: to.y   },
                    center:    { x: edge.x, y: edge.y }    
                });
            }
        },

        removeEdge(args={})
        {
            const from = args.from;
            const to   = args.to;

            if(from === undefined || to === undefined)
                throw 'Missing arguments for removeEdge command';
            else if(this.adjList[from] === undefined || this.adjList[to] === undefined)
                throw 'Missing vertices in adjList for removeEdge command';
            else
            {
                let edge = this.edgeMap[ [from, to] ];
                
                if(edge === undefined)
                    throw 'edge was not found for removeEdge';
                else
                {
                    this.edgeSpacialIndex.remove(edge);
                    delete this.edgeMap[ [edge.fromVertex.data, edge.toVertex.data] ];
        
                    this.onEdgeRemoved.notify
                    ({ 
                        from:      from.data,
                        to:        to.data, 
                        fromPoint: { x: from.x, y: from.y },
                        toPoint:   { x: to.x,   y: to.y   },
                        center:    { x: edge.x, y: edge.y }    
                    });
                }
            }
        },

        moveVertex(vertex, x, y)
        {
            // Update Vertex Position
            vertex.setPoints(x, y);
            this.onVertexMoved.notify({ data: vertex.data, x: x, y: y });
            
            // Update Vertex's Edge Positions
            vertex.forEachEdge(function(edge)
            {
                edge.setPoints();

                let pointMoved = edge.toVertex.data === vertex.data ? 'to' : 'from';

                this.onEdgePointMoved.notify
                ({ 
                    pointMoved: pointMoved, 
                    x: x, 
                    y: y,
                    center: { x: edge.x, y: edge.y } 
                });

            }.bind(this), this.edgeMap);
        },

        updateVertexSpatial(vertex, x, y)
        {
            this.vertexSpacialIndex.update(vertex);

            vertex.forEachEdge(function(edge)
            {
                this.edgeSpacialIndex.update(edge);

            }.bind(this), this.edgeMap);

            this.moveVertex(vertex, x, y);
        },

        selectVertex(vertex)
        {
            this.selectedVertex = vertex;
            this.onVertexSelected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
        },

        deselectVertex()
        {
            let vertex = this.selectedVertex;
            this.onVertexDeselected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
            this.selectedVertex = null;
        },

        addTrackingEdge(x, y)
        {
            // MAY NOT NEED THIS OBJECT
            this.trackingEdge = 
            {
                x: x,
                y: y
            };

            this.onTrackingEdgeAdded.notify
            ({ 
                start: { x: this.selectedVertex.x, y: this.selectedVertex.y },
                end:   { x: x, y: y }, 
            });
        },

        updateTrackingEdge(x, y)
        {
            // MAY NOT NEED THIS OBJECT
            this.trackingEdge.x = x;
            this.trackingEdge.y = y;

            this.onTrackingEdgeMoved.notify({ x: x, y: y });
        },

        releaseTrackingEdge()
        {
            // MAY NOT NEED THIS OBJECT
            this.trackingEdge = null;

            this.onTrackingEdgeRemoved.notify({});
        },

        resize(width, height)
        {
            this.setDimensions(width, height);
            this.vertexSpacialIndex = new SpacialIndex(width, height, this.cellRatio);
            for(let vertexKey in this.adjList)
            {
                this.vertexSpacialIndex.add(this.adjList[vertexKey]);
            }
        },

        setDimensions(width, height)
        {
            this.width      = width;
            this.cellWidth  = this.width / this.cellRatio;
            this.height     = height;
            this.cellHeight = this.height / this.cellRatio;
        },

        vertexAt(x, y)
        {
            return this.vertexSpacialIndex.getEntity(x, y);
        },

        edgeAt(x, y)
        {
            return this.edgeSpacialIndex.getEntity(x, y);
        },

        edgeExists(from, to)
        {
            return this.edgeMap[ [from, to] ] ? true : false;
        }
    };

    return GraphModel;
 });
