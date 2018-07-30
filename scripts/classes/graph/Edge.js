/**
 *  @author Jake Landowski
 *  7/30/18
 *  Edge.js
 * 
 *  Represents the data structure for the Edge class..
 */

define(function()
{
   console.log('Edge Class loaded');

   const Edge = function(toVertex, fromVertex)
   {
        this.id         = 'Edge' + Edge.edgeId++,
        this.boxSize    = 25;
        this.x          = (toVertex.x + fromVertex.x) / 2;
        this.y          = (toVertex.y + fromVertex.y) / 2; 
        this.toVertex   = toVertex;
        this.fromVertex = fromVertex;
        this.upperLeft  = { x: this.x - this.boxSize/2, y: this.y - this.boxSize/2 };
        this.lowerRight = { x: this.x + this.boxSize/2, y: this.y + this.boxSize/2 };
   };

    Edge.edgeId = 0;

   return Edge;
});
