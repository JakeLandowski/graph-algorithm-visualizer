/**
 *  @author Jake Landowski
 *  7/30/18
 *  Edge.js
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
 * @param {number} - the size of the edge weight box
 * @param {number} - the edge weight value 
 */
const Edge = function(from, to, boxSize=0, weight=0)
{
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
        return Edge.adjList.getVertex(this.from);
    },

    /**
     * Gets the Vertex associated with this Edge's destination.
     * @returns {Vertex} the to Vertex object
     * @example
     * let vertex = edge.toVertex;
     */
    get toVertex()
    {
        return Edge.adjList.getVertex(this.to);
    },

    //=========== Private ===========//

    _setBounds()
    {
        this.upperLeft  = { x: this.x - this.boxSize, y: this.y - this.boxSize };
        this.lowerRight = { x: this.x + this.boxSize, y: this.y + this.boxSize };
    }
};

export default Edge;