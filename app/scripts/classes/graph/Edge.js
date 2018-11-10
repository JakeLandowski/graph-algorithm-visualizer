/**
 *  @author Jake Landowski
 *  7/30/18
 *  Edge.js
 * 
 *  Represents the data structure for the Edge class..
 */

'use strict';

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
    setPoints()
    {
        // HitBox Coordinates
        this.x = (this.fromVertex.x + this.toVertex.x) / 2;
        this.y = (this.fromVertex.y + this.toVertex.y) / 2;
        this.setBounds(); 
    },
    
    setBounds()
    {
        this.upperLeft  = { x: this.x - this.boxSize, y: this.y - this.boxSize };
        this.lowerRight = { x: this.x + this.boxSize, y: this.y + this.boxSize };
    },

    get fromVertex()
    {
        return Edge.adjList.getVertex(this.from);
    },

    get toVertex()
    {
        return Edge.adjList.getVertex(this.to);
    }
};

export default Edge;