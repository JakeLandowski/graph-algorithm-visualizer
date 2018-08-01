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
            let fromVertex = Edge.adjList[this.from];
            let toVertex   = Edge.adjList[this.to];

            // HitBox Coordinates
            this.x          = (fromVertex.x + toVertex.x) / 2;
            this.y          = (fromVertex.y + toVertex.y) / 2; 
            this.upperLeft  = { x: this.x - this.boxSize/2, y: this.y - this.boxSize/2 };
            this.lowerRight = { x: this.x + this.boxSize/2, y: this.y + this.boxSize/2 };
        },

        // centerIfNewPoint(which, x, y)
        // {
        //     if(which !== 'to' || which !== 'from')
        //         throw 'Invalid vertex option in Edge.centerIfNewPoint()';

        //     let vertex = which === 'to' ? this.to : this.from;

        //     return { 
        //         x: (x + vertex.x) / 2,
        //         y: (y + vertex.y) / 2 
        //     };
        // }
    };

   return Edge;
});
