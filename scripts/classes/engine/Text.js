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
    const Text = function(content, x, y, styles={}, context, engine)
    {
        Entity.call(this, context, engine); // super
        this.id = 'text' + Text.nextId++;
        this.content = content;
        this.x = x;
        this.y = y;
        this.styles = 
        {
            font:         styles.font         || '16px serif',
            fillStyle:    styles.fillStyle    || '#fff',
            textAlign:    styles.textAlign    || 'center',
            textBaseline: styles.textBaseline || 'middle'
        };
    };

    Text.nextId = 0;
    Text.prototype = Object.create(Entity.prototype); // extend Entity
    Text.prototype.constructor = Text; // reset constructor
    Object.assign(Text.prototype, // mixin normal Text methods
    {
        render()
        {
            const ctx = this.context;
            ctx.font         = this.styles.font;
            ctx.fillStyle    = this.styles.fillStyle;
            ctx.textAlign    = this.styles.textAlign;    
            ctx.textBaseline = this.styles.textBaseline; 
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