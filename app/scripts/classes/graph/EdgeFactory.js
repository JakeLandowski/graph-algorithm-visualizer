/**
 *  @author Jake Landowski
 *  7/30/18
 *  EdgeFactory.js
 * 
 *  Represents the data structure for the Edge class..
 */

'use strict';

/**
 * Object to represent Edges in the Graph class.
 * @class
 * @constructor
 * @param {string} from - the from vertex symbol
 * @param {string} to - the to vertex symbol 
 * @param {number} boxSize - the size of the edge weight box
 * @param {number} weight - the edge weight value
 * @param {AdjacencyList} adjList - the AdjacencyList to query 
 */
const Edge = function(from, to, boxSize, weight, adjList)
{
    this._storeAdjacencyList(adjList);
    this.from    = from;
    this.to      = to;
    this.weight  = weight;
    this.id      = '' + from + ',' + to,
    this.boxSize = boxSize;
    this.setPoints();
};

Edge.prototype = 
{
    /**
     * Sets the center point x and y based on the position
     * of the from and to vertices.
     * @example
     * edge.setPoints();
     */
    setPoints()
    {
        // HitBox Coordinates
        this.x = (this.fromVertex.x + this.toVertex.x) / 2;
        this.y = (this.fromVertex.y + this.toVertex.y) / 2;
        this._setBounds(); 
    },

    /**
     * Gets the Vertex associated with this Edge's origin.
     * @returns {Vertex} the from Vertex object
     * @example
     * let vertex = edge.fromVertex;
     */
    get fromVertex()
    {
        return this.adjList.getVertex(this.from);
    },

    /**
     * Gets the Vertex associated with this Edge's destination.
     * @returns {Vertex} the to Vertex object
     * @example
     * let vertex = edge.toVertex;
     */
    get toVertex()
    {
        return this.adjList.getVertex(this.to);
    },

    //=========== Private ===========//

    _setBounds()
    {
        this.upperLeft  = { x: this.x - this.boxSize, y: this.y - this.boxSize };
        this.lowerRight = { x: this.x + this.boxSize, y: this.y + this.boxSize };
    },

    // Stop adjList from being stringified
    _storeAdjacencyList(adjList)
    {
        Object.defineProperty(this, 'adjList', {value: adjList, enumerable : false});
    }
};

//=========== Factory ===========//

/**
 * Factory for creating Edge objects, subscribes to a given
 * AdjacencyList for querying Vertex objects for convenience.
 * @class
 * @constructor
 * @param {AdjacencyList} adjacencyList - the AdjacencyList to query from
 */
const EdgeFactory = function(adjacencyList)
{
    this.adjList = adjacencyList
};

EdgeFactory.prototype = 
{
    /**
     * Factory function to create an Edge object.
     * @param {string} from - the from vertex symbol
     * @param {string} to - the to vertex symbol 
     * @param {number} boxSize - the size of the edge weight box
     * @param {number} weight - the edge weight value
     * @returns {Edge} the created Edge object
     * @example
     * let adjList = new AdjacencyList();
     * let edgeFactory = new EdgeFactory(adjList);
     * let edge = edgeFactory.create('A', 'B', 10, 10); 
     */
    create(from, to, boxSize=0, weight=0)
    {
        return new Edge(from, to, boxSize, weight, this.adjList);
    }
};

export default EdgeFactory;