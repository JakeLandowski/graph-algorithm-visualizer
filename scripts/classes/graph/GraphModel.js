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

    const GraphModel = function()
    {
        this.adjList = Object.create(null); // non-inheriting object
        this.onVertexAdded = new Event(this);
        this.onEdgeAdded = new Event(this);
    };

    GraphModel.prototype = 
    {
        addVertex(data, x, y)
        {
            if(!this.adjList[data]) 
            {
                this.adjList[data] = 
                {
                    data: data,
                    neighbors: [],
                    x: x,
                    y: y
                };
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
        }
    };

    return GraphModel;
 });