/**
 *  @author Jake Landowski
 *  8/20/18
 *  Arrow.js
 * 
 *  For representing Arrow in the RenderingEngine.
 */

'use strict';

import Entity from './Entity.js';
import Util from '../../utils/Util.js';

const Arrow = function(x1, y1, x2, y2, styles={}, context, engine, level)
{
    Entity.call(this, context, engine, level); // super
    this.id = 'arrow' + Arrow.nextId++;
    this.styles = 
    {
        length:              styles.length              || 30,
        offset:              styles.offset              || 0,
        endOfLine:           styles.endOfLine           || true,
        angle:               styles.angle               || 30,
        leftCurveDirection:  styles.leftCurveDirection  || 0, // -1 0 1, 0 = none
        rightCurveDirection: styles.rightCurveDirection || 0, // -1 0 1, 0 = none 
        leftCurveOffset:     styles.leftCurveOffset     || 5,
        rightCurveOffset:    styles.rightCurveOffset    || 5,
        strokeStyle:         styles.strokeStyle         || '#fff',
        fillStyle:           styles.fillStyle           || '#fff',
        lineWidth:           styles.lineWidth           || 1,
        shadowBlur:          styles.shadowBlur          || 0,
        shadowColor:         styles.shadowColor         || '#000'
    };
    this.calcArrowPoints(x1, y1, x2, y2);
};

Arrow.nextId = 0;
Arrow.prototype = Object.create(Entity.prototype); // extend Entity
Arrow.prototype.constructor = Arrow; // reset constructor
Object.assign(Arrow.prototype, // mixin normal Arrow methods
{
    calcArrowPoints(x1, y1, x2, y2)
    {
        this.changed = true;
        const end    = this.styles.endOfLine;
        const length = this.styles.length;
        const angle  = this.styles.angle;
        const offset = this.styles.offset;
        const theta  = Util.toDegrees(Util.calcAngle(x1, y1, x2, y2));

        const centerX = (end ? x2 : x1) + (offset * Math.cos(Util.toRadians(theta)));
        const centerY = (end ? y2 : y1) + (offset * Math.sin(Util.toRadians(theta)));

        this.lx = centerX + (length * Math.cos(Util.toRadians(theta - angle)));
        this.ly = centerY + (length * Math.sin(Util.toRadians(theta - angle)));  
        this.cx = centerX; 
        this.cy = centerY;
        this.rx = centerX + (length * Math.cos(Util.toRadians(theta + angle)));
        this.ry = centerY + (length * Math.sin(Util.toRadians(theta + angle)));
    },

    getCenter()
    {
        return { x: this.cx, y: this.cy };
    },

    getLeft()
    {
        return { x: this.lx, y: this.ly };
    },

    getRight()
    {
        return { x: this.rx, y: this.ry };
    },

    setCenter(x, y)
    {
        this.changed = true;
        this.cx = x;
        this.cy = y;
    },

    setLeft(x, y)
    {
        this.changed = true;
        this.lx = x;
        this.ly = y;
    },

    setRight(x, y)
    {
        this.changed = true;
        this.rx = x;
        this.ry = y;
    },

    calculateCurve()
    {
        if(this.changed)
        {
            this.changed = false;
            
            if(this.styles.leftCurveDirection !== 0)
            {
                const theta = Util.toDegrees(Util.calcAngle(this.cx, this.cy, this.lx, this.ly));
                const centerX = (this.cx + this.lx) / 2;
                const centerY = (this.cy + this.ly) / 2;
                this.leftCurveOffsetX = centerX + (this.styles.leftCurveOffset * Math.cos(Util.toRadians(theta + this.styles.leftCurveDirection)));
                this.leftCurveOffsetY = centerY + (this.styles.leftCurveOffset * Math.sin(Util.toRadians(theta + this.styles.leftCurveDirection)));   
            }

            if(this.styles.rightCurveDirection !== 0)
            {
                const theta = Util.toDegrees(Util.calcAngle(this.cx, this.cy, this.rx, this.ry));
                const centerX = (this.cx + this.rx) / 2;
                const centerY = (this.cy + this.ry) / 2;
                this.rightCurveOffsetX = centerX + (this.styles.rightCurveOffset * Math.cos(Util.toRadians(theta + this.styles.rightCurveDirection)));
                this.rightCurveOffsetY = centerY + (this.styles.rightCurveOffset * Math.sin(Util.toRadians(theta + this.styles.rightCurveDirection)));   
            }
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
        ctx.moveTo(this.cx, this.cy);

        if(this.styles.leftCurveDirection === 0)
            ctx.lineTo(this.lx, this.ly);
        else
            ctx.quadraticCurveTo(this.leftCurveOffsetX, this.leftCurveOffsetY, this.lx, this.ly);

        ctx.stroke();
        ctx.moveTo(this.cx, this.cy);

        if(this.styles.leftCurveDirection === 0)
            ctx.lineTo(this.rx, this.ry);
        else
            ctx.quadraticCurveTo(this.rightCurveOffsetX, this.rightCurveOffsetY, this.rx, this.ry);

        ctx.stroke();
    }
});

export default Arrow;