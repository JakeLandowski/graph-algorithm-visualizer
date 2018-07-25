/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphModel.js
 * 
 *  Represents the data structure for the Graph class..
 */

 define(['classes/Event', 'classes/SpacialIndex'], function(Event, SpacialIndex)
 {
    console.log('GraphModel Class loaded');

    const GraphModel = function(width, height, config)
    {
        // Shape size/styling information
        this.config = config;

        // SpacialIndex needed information
        this.cellRatio  = 5;
        this.width      = width;
        this.cellWidth  = this.width / this.cellRatio;
        this.height     = height;
        this.cellHeight = this.height / this.cellRatio;

        this.adjList      = Object.create(null); // non-inheriting object
        this.spacialIndex = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);

        this.onVertexAdded   = new Event(this);
        this.onVertexRemoved = new Event(this);
        this.onEdgeAdded     = new Event(this);
        this.onVertexMoved   = new Event(this);
    };

    GraphModel.prototype = 
    {
        vertexId: 0,

        addVertex(data, x, y)
        {
            if(!this.adjList[data]) 
            {
                let radius = this.config.vertexSize + this.config.vertexOutlineSize;

                let vertex =
                {
                    id: 'vertex' + this.vertexId++,
                    data: data,
                    neighbors: [],
                    x: x,
                    y: y,
                    upperLeft:  {x: x - radius, y: y - radius},
                    lowerRight: {x: x + radius, y: y + radius}
                };

                this.adjList[data] = vertex;
                this.spacialIndex.add(vertex);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
            }
        },

        removeVertex(data)
        {
            if(this.adjList[data])
            {
                let vertex = this.adjList[data];
                this.onVertexRemoved.notify({ vertex: vertex });
            }
        },

        addEdge(to, from)
        {
            // need to create an edge object in model that contains to/from pointers
            const list = this.adjList;

            if(list[to] === undefined && list[from] === undefined) 
                throw 'Tried to create edge for 2 non-existent vertices.';
            else if(list[to] === undefined) 
                throw 'Tried to create edge to a non-existent vertex.';
            else if(list[from] === undefined) 
                throw 'Tried to create edge from a non-existent vertex.';
            else
            {
                list[to].neighors.push(from);
                list[from].neighors.push(to);
                this.onEdgeAdded.notify({ to: to, from: from });
            }
        },

        setVertexPosition(data, x, y)
        {
            if(this.adjList[data] !== undefined)
            {
                this.adjList[data].x = x;
                this.adjList[data].y = y;
                this.onVertexMoved.notify({ data: data, x: x, y: y });
            }
        }
    };

    return GraphModel;
 });
