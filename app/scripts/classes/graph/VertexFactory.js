/**
 *  @author Jake Landowski
 *  7/27/18
 *  VertexFactory.js
 * 
 *  Represents the data structure for the Vertex class..
 */

'use strict';

/**
 * @class
 * @constructor
 * @param {string} data - the vertex symbol
 * @param {number} x - the x coordinate position 
 * @param {number} y - the y coordinate position
 * @param {object} options - the vertex styling parameters
 * @param {AdjacencyList} adjList 
 */
const Vertex = function(data, x, y, options, adjList)
{
    this._storeAdjacencyList(adjList);
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
    /**
     * Deletes the reference to an outgoing neighbor Vertex object
     * represented with the given symbol.
     * @param {string} neighbor - the vertex symbol 
     */   
    unregisterToNeighbor(neighbor)
    {
        this._deleteNeighbor(neighbor, this.toNeighbors);
    },

    /**
     * Deletes the reference to an incoming neighbor Vertex object
     * represented with the given symbol.
     * @param {string} neighbor - the vertex symbol 
     */
    unregisterFromNeighbor(neighbor)
    {
        this._deleteNeighbor(neighbor, this.fromNeighbors);
    },

    /**
     * Logs an outgoing neighbor symbol and increments
     * the number of edges if this neighbor has not already
     * been logged.
     * @param {string} neighbor - the outgoing neighbor symbol 
     */
    pointToNeighbor(neighbor)
    {
        this._addNeighbor(neighbor, this.toNeighbors);
    },

    /**
     * Logs an incoming neighbor symbol and increments
     * the number of edges if this neighbor has not already
     * been logged.
     * @param {string} neighbor - the incoming neighbor symbol 
     */
    pointFromNeighbor(neighbor)
    {
        this._addNeighbor(neighbor, this.fromNeighbors);
    },

    /**
     * Sets the center x, y point and the upperLeft/lowerRight points
     * accordingly.
     * @param {number} x - the center x coordinate 
     * @param {number} y - the center y coordinate
     */
    setPoints(x, y)
    {
        const radius = this.options.vertexSize + this.options.vertexOutlineSize;
        this.x = x;
        this.y = y;
        this.upperLeft  = {x: x - radius, y: y - radius};
        this.lowerRight = {x: x + radius, y: y + radius};
    },

    /**
     * Calls a function for each incident Edge object 
     * @param {function} action - callback to run
     */
    forEachEdge(action)
    {
        this.forEachOutgoingEdge(action);
        this.forEachIncomingEdge(action);
    },

    /**
     * Calls a function for each incoming Edge object 
     * @param {function} action - callback to run
     */
    forEachIncomingEdge(action)
    {
        for(const neighbor in this.fromNeighbors)
        {
            this._callIfEdgeExists(neighbor, this.data, action);
        }
    },

    /**
     * Calls a function for each outgoing Edge object 
     * @param {function} action - callback to run
     */
    forEachOutgoingEdge(action)
    {
        for(const neighbor in this.toNeighbors)
        {
            this._callIfEdgeExists(this.data, neighbor, action);
        }
    },

    //=========== Private ===========//

    _callIfEdgeExists(from, to, action)
    {
        if(this.adjList.edgeExists(from, to))
            action(this.adjList.getEdge(from, to));
    },

    _deleteNeighbor(neighbor, neighbors)
    {
        delete neighbors[neighbor];
        this._decrementEdges();
    },

    _addNeighbor(neighbor, neighbors)
    {
        if(!neighbors[neighbor])
        {
            neighbors[neighbor] = neighbor;
            this.numEdges++;
        }
    },

    _decrementEdges()
    {
        if(this.numEdges > 0) this.numEdges--;
    },

    // Stop adjList from being stringified
    _storeAdjacencyList(adjList)
    {
        Object.defineProperty(this, 'adjList', {value: adjList, enumerable : false});
    }
};

//=========== Factory ===========//

/**
 * Factory for creating Vertex objects, subscribes to a given
 * AdjacencyList for querying Vertex objects for convenience.
 * @class
 * @constructor
 * @param {AdjacencyList} adjacencyList - the AdjacencyList to query from
 */
const VertexFactory = function(adjacencyList)
{
    this.adjList = adjacencyList
};

VertexFactory.prototype = 
{
    /**
     * Factory function to create an Vertex object.
     * @param {string} data - the vertex symbol
     * @param {number} x - the x coordinate position 
     * @param {number} y - the y coordinate position
     * @param {object} options - the vertex styling parameters
     * @returns {Vertex} the created Vertex object
     * @example
     * let adjList = new AdjacencyList();
     * let vertexFactory = new vertexFactory(adjList);
     * let vertex = vertexFactory.create('A', 0, 0); 
     */
    create(data, x, y, options={})
    {
        return new Vertex(data, x, y, options, this.adjList);
    }
};

export default VertexFactory;