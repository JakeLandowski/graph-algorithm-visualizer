/**
 *  @author Jake Landowski
 *  8/7/18
 *  Line.js
 * 
 *  For representing Lines in the RenderingEngine.
 */

'use strict';
define(['classes/engine/Entity', 'utils/Util'], function(Entity, Util)
{
    const Line = function(x1, y1, x2, y2, styles={}, context, engine, level)
    {
        Entity.call(this, context, engine, level); // super
        this.id = 'line' + Line.nextId++;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.styles = 
        {
            curveDirection: styles.curveDirection || 0, // -1 0 1, 0 = none 
            curveOffset:    styles.curveOffset    || 25,
            strokeStyle:    styles.strokeStyle    || '#fff',
            fillStyle:      styles.fillStyle      || '#fff',
            lineWidth:      styles.lineWidth      || 1,
            shadowBlur:     styles.shadowBlur     || 0,
            shadowColor:    styles.shadowColor    || '#000'
        };
        this.changed = true;
        this.calculateCurve();
    };

    Line.nextId = 0;
    Line.prototype = Object.create(Entity.prototype); // extend Entity
    Line.prototype.constructor = Line; // reset constructor
    Object.assign(Line.prototype, // mixin normal Line methods
    {
        getStart()
        {
            return { x: this.x1, y: this.y1 };
        },

        getEnd()
        {
            return { x: this.x2, y: this.y2 };
        },

        setStart(x, y)
        {
            this.x1 = x;
            this.y1 = y;
            this.changed = true;
        },

        setEnd(x, y)
        {
            this.x2 = x;
            this.y2 = y;
            this.changed = true;
        },

        calculateCurve()
        {
            if(this.changed && this.styles.curveDirection !== 0)
            {
                this.changed = false;
                const theta = Util.toDegrees(Util.calcAngle(this.x1, this.y1, this.x2, this.y2));
                const centerX = (this.x2 + this.x1) / 2;
                const centerY = (this.y2 + this.y1) / 2;
                this.curveOffsetX = centerX + (this.styles.curveOffset * Math.cos(Util.toRadians(theta + this.styles.curveDirection)));
                this.curveOffsetY = centerY + (this.styles.curveOffset * Math.sin(Util.toRadians(theta + this.styles.curveDirection)));
                this.curveCenterX = centerX + (this.styles.curveOffset*0.75 * Math.cos(Util.toRadians(theta + this.styles.curveDirection)));
                this.curveCenterY = centerY + (this.styles.curveOffset*0.75 * Math.sin(Util.toRadians(theta + this.styles.curveDirection)));   
            }
        },

        render()
        {
            this.calculateCurve();

            const ctx = this.context;
            ctx.lineWidth    = this.styles.lineWidth;
            ctx.strokeStyle  = this.styles.strokeStyle;
            ctx.shadowBlur   = this.styles.shadowBlur;
            ctx.shadowColor  = this.styles.shadowColor;
            ctx.moveTo(this.x1, this.y1);

            if(this.styles.curveDirection === 0)
                ctx.lineTo(this.x2, this.y2);
            else
                ctx.quadraticCurveTo(this.curveOffsetX, this.curveOffsetY, this.x2, this.y2);

            ctx.stroke();
        }
    });
    
    return Line;
});