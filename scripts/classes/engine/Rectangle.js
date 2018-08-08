/**
 *  @author Jake Landowski
 *  8/7/18
 *  Rectangle.js
 * 
 *  For representing Rectangles in the RenderingEngine.
 */

'use strict';
define(['classes/engine/Entity'], function(Entity)
{
    const Rectangle = function(x, y, width, height, context, engine)
    {
        Entity.call(this, context, engine); // super
        this.id = 'rect' + Rectangle.nextId++;
        this.x  = x;
        this.y  = y;
        this.width   = width;
        this.height  = height;
    };

    Rectangle.nextId = 0;
    Rectangle.prototype = Object.create(Entity.prototype); // extend Entity
    Rectangle.prototype.constructor = Rectangle; // reset constructor
    Object.assign(Rectangle.prototype, // mixin normal Rectangle methods
    {
        render()
        {
            const ctx = this.context;
            ctx.lineWidth   = this.lineWidth   || 1;
            ctx.fillStyle   = this.fillStyle   || '#fff';
            ctx.strokeStyle = this.strokeStyle || '#000';
            ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        },

        center(x, y)
        {
            this.x = x;
            this.y = y;
        }
    });
    
    return Rectangle;
});