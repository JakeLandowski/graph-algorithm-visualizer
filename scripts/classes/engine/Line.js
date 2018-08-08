/**
 *  @author Jake Landowski
 *  8/7/18
 *  Line.js
 * 
 *  For representing Lines in the RenderingEngine.
 */

'use strict';
define(['classes/engine/Entity'], function(Entity)
{
    const Line = function(x1, y1, x2, y2, context, engine)
    {
        Entity.call(this, context, engine); // super
        this.id = 'line' + Line.nextId++;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    };

    Line.nextId = 0;
    Line.prototype = Object.create(Entity.prototype); // extend Entity
    Line.prototype.constructor = Line; // reset constructor
    Object.assign(Line.prototype, // mixin normal Line methods
    {
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
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
        }
    });
    
    return Line;
});