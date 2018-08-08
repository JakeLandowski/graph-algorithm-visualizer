/**
 *  @author Jake Landowski
 *  8/7/18
 *  Rectangle.js
 * 
 *  For representing Rectangles in the RenderingEngine.
 */

'use strict';
define(function()
{
    const Rectangle = function(x, y, width, height, context)
    {
        this.id = 'rect' + this.nextId++;
        this.x  = x;
        this.y  = y;
        this.width   = width;
        this.height  = height;
        this.context = context;
    };

    Rectangle.prototype = 
    {
        nextId: 0,
        render()
        {
            const ctx = this.context;
            ctx.lineWidth   = this.lineWidth   || 1;
            ctx.fillStyle   = this.fillStyle   || '#fff';
            ctx.strokeStyle = this.strokeStyle || '#000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    
    return Rectangle;
});