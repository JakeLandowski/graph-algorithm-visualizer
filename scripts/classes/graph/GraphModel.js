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

            if(this.adjList[data])
            {
                let removed = this.adjList[data];
                this.vertexSpacialIndex.remove(removed);
                delete this.adjList[data];

                if(args.returnSymbol) args.returnSymbol(data);

                // NEED TO CLEANUP EDGE REFERENCES LATER

                this.onVertexRemoved.notify({ data: data });
            }
        },

        // NEEDS REWORK FOR EDGE OBJECTS AND SUCH
        addEdge(args={})
        {
            const to   = args.to;
            const from = args.from;

            if(to === undefined || from === undefined)
                throw 'Missing arguments for addEdge command';
            else if(this.adjList[to.data] === undefined || this.adjList[from.data] === undefined)
                throw 'Missing vertices in adjList for addEdge command';
            else
            {
                this.adjList[to.data].neighbors[from.data] = from.data;
                this.adjList[from.data].neighbors[to.data] = to.data;
                
                let edge = new Edge(args.to, args.from, this.config.edgeBoxSize);
                this.edgeMap[ [to.data, from.data] ] = edge;
                this.edgeSpacialIndex.add(edge);
                
                this.onEdgeAdded.notify
                ({ 
                    to:        to.data, 
                    from:      from.data,
                    toPoint:   { x: to.x,   y: to.y   },
                    fromPoint: { x: from.x, y: from.y },
                    center:    { x: edge.x, y: edge.y }    
                });
            }
        },

        removeEdge(args={})
        {
            const to   = args.to;
            const from = args.from;

            if(to === undefined || from === undefined)
                throw 'Missing arguments for removeEdge command';
            else if(this.adjList[to.data] === undefined || this.adjList[from.data] === undefined)
                throw 'Missing vertices in adjList for removeEdge command';
            else
            {
                let edge = this.edgeMap[ [to.data, from.data] ];
                
                if(edge === undefined)
                    throw 'edge was not found for removeEdge';
                else
                {
                    this.edgeSpacialIndex.remove(edge);
                    delete this.edgeMap[ [edge.toVertex.data, edge.fromVertex.data] ];
        
                    this.onEdgeRemoved.notify
                    ({ 
                        to:        to.data, 
                        from:      from.data,
                        toPoint:   { x: to.x,   y: to.y   },
                        fromPoint: { x: from.x, y: from.y },
                        center:    { x: edge.x, y: edge.y }    
                    });
                }
            }
        },

        softMoveVertex(vertex, x, y)
        {
            this.onVertexMoved.notify({ data: vertex.data, x: x, y: y });
        },

        hardMoveVertex(vertex, x, y)
        {
            vertex.setPoints(x, y);
            this.vertexSpacialIndex.update(vertex, x, y);
            this.softMoveVertex(vertex, x, y);
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
        }
    };

    return GraphModel;
 });
