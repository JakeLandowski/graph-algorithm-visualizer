/**
 *  @author Jake Landowski
 *  8/7/18
 *  Circle.js
 * 
 *  For representing Circles in the RenderingEngine.
 */

'use strict';
import Entity from './Entity.js';
const Circle = function(x, y, radius, styles={}, context, engine, level)
{
    Entity.call(this, context, engine, level); // super
    this.id = 'circ' + Circle.nextId++;
    this.x  = x;
    this.y  = y;
    this.radius = radius;
    this.styles = 
    {
        lineWidth:   styles.lineWidth   || 1,
        fillStyle:   styles.fillStyle   || '#fff',
        strokeStyle: styles.strokeStyle || '#fff',
        shadowBlur:  styles.shadowBlur  || 0,
        shadowColor: styles.shadowColor || '#000'
    };
};

Circle.nextId = 0;
Circle.prototype = Object.create(Entity.prototype); // extend Entity
Circle.prototype.constructor = Circle; // reset constructor
Object.assign(Circle.prototype, // mixin normal Circle methods
{
    render()
    {
        const ctx = this.context;
        ctx.lineWidth    = this.styles.lineWidth; 
        ctx.fillStyle    = this.styles.fillStyle;
        ctx.strokeStyle  = this.styles.strokeStyle;
        ctx.shadowBlur   = this.styles.shadowBlur;
        ctx.shadowColor  = this.styles.shadowColor;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },

    center(x, y)
    {
        this.x = x;
        this.y = y;
    }
});

export default Circle;