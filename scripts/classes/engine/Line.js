/**
 *  @author Jake Landowski
 *  8/7/18
 *  Line.js
 * 
 *  For representing Lines in the RenderingEngine.
 */

'use strict';
define(function()
{
    const Line = function(x1, y1, x2, y2, context)
    {
        this.id = 'line' + this.nextId++;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.context = context;
    };

    Line.prototype = 
    {
        nextId: 0,
        getStart()
        {
            return {x: this.x1, y: this.y1 };
        },

        getEnd()
        {
            return {x: this.x2, y: this.y2 };
        },

        setStart(x, y)
        {
            this.x1 = x;
            this.y1 = y;
        },

        setEnd(x, y)
        {
            this.x2 = x;
            this.y2 = y;
        },

        render()
        {
            const ctx = this.context;
            ctx.lineWidth   = this.lineWidth   || 100;
            ctx.strokeStyle = this.strokeStyle || '#fff';
            ctx.moveTo(this.x1, this.x2);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
        }
    };
    
    return Line;
});