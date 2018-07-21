/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphModel.js
 * 
 *  Represents the data structure for the Graph class..
 */

 define(['classes/Event'], function(Event)
 {
    console.log('GraphModel Class loaded');

    const GraphModel = function(width, height)
    {
        this.cellRatio  = 5;
        this.width      = width;
        this.cellWidth  = this.width / this.cellRatio;
        this.height     = height;
        this.cellHeight = this.height / this.cellRatio;
        this.adjList    = Object.create(null); // non-inheriting object
        
        this.initSpacialIndex();

        this.onVertexAdded = new Event(this);
        this.onEdgeAdded   = new Event(this);
        this.onVertexMoved = new Event(this);
    };

    GraphModel.prototype = 
    {
        initSpacialIndex()
        {
            let cellWidth  = this.cellWidth;
            let cellHeight = this.cellHeight;
            let cellRatio  = this.cellRatio;

            this.spacialIndex = 
            {
                index: new Array(cellRatio),
                
                add(entity, x, y)
                {
                    this.cell(x, y).push(entity);
                },

                remove(entity)
                {
                    this.cell(entity.x, entity.y).filter(function(ent)
                    {
                        return ent.data === entity.data;
                    });
                },

                update(entity, x, y)
                {
                    this.remove(entity);
                    this.add(entity, x, y);
                },

                cell(x, y)
                {
                    return this.index[Math.floor(x / cellWidth)][Math.floor(y / cellHeight)];
                }
            };

            for(let i = 0; i < this.cellRatio; i++)
            {
                this.spacialIndex.index[i] = new Array(this.cellRatio);
                for(let j = 0; j < this.cellRatio; j++)
                {
                    this.spacialIndex.index[i][j] = [];
                }
            }
        },

        addVertex(data, x, y)
        {
            if(!this.adjList[data]) 
            {
                let vertex =
                {
                    data: data,
                    neighbors: [],
                    x: x,
                    y: y
                };

                this.adjList[data] = vertex;
                this.spacialIndex.add(vertex, x, y);
                this.onVertexAdded.notify({ data: data, x: x, y: y });
            }
        },

        addEdge(to, from)
        {
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
