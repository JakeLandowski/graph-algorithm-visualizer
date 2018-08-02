/**
 *  @author Jake Landowski
 *  7/30/18
 *  Edge.js
 * 
 *  Represents the data structure for the Edge class..
 */

'use strict';
define(function()
{
   const Edge = function(from, to, boxSize)
   {
        this.from = from;
        this.to   = to;
        this.id   = '' + from + ',' + to,
        this.boxSize = boxSize;
        this.setPoints();
   };
 
    Edge.prototype = 
    {
        setPoints()
        {
            const fromVertex = this.fromVertex;
            const toVertex   = this.toVertex;

            // HitBox Coordinates
            this.x          = (fromVertex.x + toVertex.x) / 2;
            this.y          = (fromVertex.y + toVertex.y) / 2; 
            this.upperLeft  = { x: this.x - this.boxSize/2, y: this.y - this.boxSize/2 };
            this.lowerRight = { x: this.x + this.boxSize/2, y: this.y + this.boxSize/2 };
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

   return Edge;
});
