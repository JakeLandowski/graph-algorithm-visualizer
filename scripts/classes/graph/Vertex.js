/**
 *  @author Jake Landowski
 *  7/27/18
 *  Vertex.js
 * 
 *  Represents the data structure for the Vertex class..
 */

'use strict';
define(function()
{
    console.log('Vertex Class loaded');

    const Vertex = function(data, x, y)
    {
        this.id = 'vertex' + Vertex.vertexId++,
        this.data = data,
        this.neighbors = Object.create(null),
        this.setPoints(x, y);
    };

    Vertex.vertexId = 0;
    Vertex.prototype = 
    {
        setPoints(x, y)
        {
            let radius = this.config.vertexSize + this.config.vertexOutlineSize;
            this.x = x;
            this.y = y;
            this.upperLeft  = {x: x - radius, y: y - radius};
            this.lowerRight = {x: x + radius, y: y + radius};
        },

        forEachEdge(action)
        {
            for(let neighbor in this.neighbors)
            {
                action(Vertex.edgeMap[ [this.data, neighbor] ]);
            }
        }
    };

   return Vertex;
});
