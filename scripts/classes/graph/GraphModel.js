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

        this.onVertexAdded = new Event(this);
        this.onEdgeAdded   = new Event(this);
        this.onVertexMoved = new Event(this);
    };

    GraphModel.prototype = 
    {
        addVertex(data, x, y)
        {
            if(!this.adjList[data]) 
            {
                let radius = (this.config.vertexSize / 2) + this.config.vertexOutlineSize;
                let vertex =
                {
                    data: data,
                    neighbors: [],
                    x: x,
                    y: y,
                    // 4 points left, right, top, bottom of circle
                    spacialBounds: [x - radius, x + radius, y - radius, y + radius]
                };

                this.adjList[data] = vertex;
                this.spacialIndex.add(vertex, x, y);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
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
