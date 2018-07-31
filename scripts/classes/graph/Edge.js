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

   const Edge = function(toVertex, fromVertex, boxSize)
   {
        this.id         = 'Edge' + Edge.edgeId++,
        this.toVertex   = toVertex;
        this.fromVertex = fromVertex;
        
        // HitBox Coordinates
        this.boxSize    = boxSize;
        this.x          = (toVertex.x + fromVertex.x) / 2;
        this.y          = (toVertex.y + fromVertex.y) / 2; 
        this.upperLeft  = { x: this.x - this.boxSize/2, y: this.y - this.boxSize/2 };
        this.lowerRight = { x: this.x + this.boxSize/2, y: this.y + this.boxSize/2 };
   };

    Edge.edgeId = 0;
    Edge.prototype = 
    {
        centerIfNewPoint(which, x, y)
        {
            if(which !== 'to' || which !== 'from')
                throw 'Invalid vertex option in Edge.centerIfNewPoint()';
                
            let vertex = which === 'to' ? this.toVertex : this.fromVertex;

            return { 
                x: (x + vertex.x) / 2,
                y: (y + vertex.y) / 2 
            };
        }
    };

   return Edge;
});
