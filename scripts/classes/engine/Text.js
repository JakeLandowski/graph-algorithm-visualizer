/**
 *  @author Jake Landowski
 *  8/8/18
 *  Text.js
 * 
 *  For representing Text in the RenderingEngine.
 */

'use strict';
define(['classes/engine/Entity'], function(Entity)
{
    const Text = function(content, x, y, context, engine)
    {
        Entity.call(this, context, engine); // super
        this.id = 'text' + Text.nextId++;
        this.content = content;
        this.x  = x;
        this.y  = y;
    };

    Text.nextId = 0;
    Text.prototype = Object.create(Entity.prototype); // extend Entity
    Text.prototype.constructor = Text; // reset constructor
    Object.assign(Text.prototype, // mixin normal Text methods
    {
        render()
        {
            const ctx = this.context;
            ctx.font      = this.font            || '16px sans-serif';
            ctx.fillStyle = this.fillStyle       || '#fff';
            ctx.textAlign = this.textAlign       || 'center';
            ctx.textBaseline = this.textBaseline || 'middle';
            ctx.fillText(this.content, this.x, this.y);
        },

        center(x, y)
        {
            this.x = x;
            this.y = y;
        }
    });
    
    return Text;
});