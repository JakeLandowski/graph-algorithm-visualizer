/**
 *  @author Jake Landowski
 *  7/27/18
 *  Vertex.js
 * 
 *  Represents the data structure for the Vertex class..
 */

'use strict';

const Vertex = function(data, x, y, options={})
{
    this.id            = data;
    this.data          = data,
    this.options       = options;
    this.numEdges      = 0;
    this.toNeighbors   = Object.create(null),
    this.fromNeighbors = Object.create(null),
    this.setPoints(x, y);
};

Vertex.prototype = 
{
    unregisterToNeighbor(neighbor)
    {
        delete this.toNeighbors[neighbor];
        this.decrementEdges();
    },

    unregisterFromNeighbor(neighbor)
    {
        delete this.fromNeighbors[neighbor];
        this.decrementEdges();
    },

    decrementEdges()
    {
        if(this.numEdges > 0) this.numEdges--;
    },

    pointToNeighbor(neighbor)
    {
        this.toNeighbors[neighbor] = neighbor;
        this.numEdges++;
    },

    pointFromNeighbor(neighbor)
    {
        this.fromNeighbors[neighbor] = neighbor;
        this.numEdges++;
    },

    setPoints(x, y)
    {
        const radius = this.options.vertexSize + this.options.vertexOutlineSize;
        this.x = x;
        this.y = y;
        this.upperLeft  = {x: x - radius, y: y - radius};
        this.lowerRight = {x: x + radius, y: y + radius};
    },

    forEachEdge(action)
    {
        this.forEachOutgoingEdge(action);
        this.forEachIncomingEdge(action);
    },

    forEachIncomingEdge(action)
    {
        for(const neighbor in this.fromNeighbors)
        {
            if(Vertex.adjList.edgeExists(neighbor, this.data))
                action(Vertex.adjList.getEdge(neighbor, this.data));
        }
    },

    forEachOutgoingEdge(action)
    {
        for(const neighbor in this.toNeighbors)
        {
            if(Vertex.adjList.edgeExists(this.data, neighbor))
                action(Vertex.adjList.getEdge(this.data, neighbor));
        }
    }
};

export default Vertex;