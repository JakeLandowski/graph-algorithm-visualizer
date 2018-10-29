/**
 *  @author Jake Landowski
 *  8/7/18
 *  Rectangle.js
 * 
 *  For representing Rectangles in the RenderingEngine.
 */

'use strict';

import Entity from './Entity.js';

const Rectangle = function(x, y, width, height, styles={}, context, engine, level)
{
    Entity.call(this, context, engine, level); // super
    this.id = 'rect' + Rectangle.nextId++;
    this.x  = x;
    this.y  = y;
    this.width  = width;
    this.height = height;
    this.styles = 
    {
        lineWidth:   styles.lineWidth   || 1,
        fillStyle:   styles.fillStyle   || '#fff',
        strokeStyle: styles.strokeStyle || '#000',
        shadowBlur:  styles.shadowBlur  || 0,
        shadowColor: styles.shadowColor || '#000'
    };
};

Rectangle.nextId = 0;
Rectangle.prototype = Object.create(Entity.prototype); // extend Entity
Rectangle.prototype.constructor = Rectangle; // reset constructor
Object.assign(Rectangle.prototype, // mixin normal Rectangle methods
{
    render()
    {
        const ctx = this.context;
        ctx.lineWidth    = this.styles.lineWidth;
        ctx.fillStyle    = this.styles.fillStyle;
        ctx.strokeStyle  = this.styles.strokeStyle;
        ctx.shadowBlur   = this.styles.shadowBlur;
        ctx.shadowColor  = this.styles.shadowColor;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    },

    center(x, y)
    {
        this.x = x;
        this.y = y;
    }
});

export default Rectangle;