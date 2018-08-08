/**
 *  @author Jake Landowski
 *  8/7/18
 *  Circle.js
 * 
 *  For representing Circles in the RenderingEngine.
 */

'use strict';
define(function()
{
    const Circle = function(x, y, radius, context)
    {
        this.id = 'circ' + this.nextId++;
        this.x  = x;
        this.y  = y;
        this.radius  = radius;
        this.context = context;
    };

    Circle.prototype = 
    {
        nextId: 0,
        render()
        {
            const ctx = this.context;
            ctx.lineWidth   = this.lineWidth   || 1;
            ctx.fillStyle   = this.fillStyle   || '#fff';
            ctx.strokeStyle = this.strokeStyle || '#fff';
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    
    return Circle;
});