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
        this.setDimensions(width, height);

        this.adjList      = Object.create(null); // non-inheriting object
        this.vertexSpacialIndex = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);
        this.vertexId = 0;

        this.onVertexAdded   = new Event(this);
        this.onVertexRemoved = new Event(this);
        this.onEdgeAdded     = new Event(this);
        // may not need model to handle this
        // this.onVertexMoved   = new Event(this);
    };

    GraphModel.prototype = 
    {
        addVertex(data, x, y)
        {
            if(!this.adjList[data]) 
            {
                let radius = this.config.vertexSize + this.config.vertexOutlineSize;

                let vertex =
                {
                    id: 'vertex' + this.vertexId++,
                    data: data,
                    neighbors: Object.create(null),
                    x: x,
                    y: y,
                    upperLeft:  {x: x - radius, y: y - radius},
                    lowerRight: {x: x + radius, y: y + radius}
                };

                this.adjList[data] = vertex;
                this.vertexSpacialIndex.add(vertex);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
            }
        },

        removeVertex(vertex)
        {
            let data = vertex.data;

            if(this.adjList[data])
            {
                let removed = this.adjList[data];
                delete this.adjList[data];

                this.vertexSpacialIndex.remove(vertex);

                // NEED TO CLEANUP EDGE REFERENCES LATER

                this.onVertexRemoved.notify({ data: data });
            }
        },

        // NEEDS REWORK FOR EDGE OBJECTS AND SUCH
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
                // need to have key reference object not key again
                list[to].neighors[from] = from;
                list[from].neighors[to] = to;
                this.onEdgeAdded.notify({ to: to, from: from });
            }
        },

        moveVertex(data, x, y)
        {
            if(this.adjList[data])
            {
                this.adjList[data].x = x;
                this.adjList[data].y = y;
                // this.onVertexMoved.notify({ data: data, x: x, y: y });
            }
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
        }
    };

    return GraphModel;
 });
