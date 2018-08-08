/**
 *  @author Jake Landowski
 *  8/7/18
 *  RenderingEngine.js
 * 
 *  For managing HTML5 canvas and all shape entity rendering.
 */

'use strict';
define(function()
{
    const RenderingEngine = function(container, config={}) 
    {
        this.config = 
        {
            backgroundColor: config.backgroundColor || '#222'
        };

        this.container  = container;
        this.canvas     = document.createElement('canvas');
        this.context    = this.canvas.getContext('2d');
        this.calcPixelRatio();
        
        this.canvas.style.background = this.config.backgroundColor;
        container.appendChild(this.canvas);
        this.resize(); 

        // this.frameCount = 0;
        this.entities   = Object.create(null);
    };

    RenderingEngine.prototype = 
    {
        requestAnimationFrame: window.requestAnimationFrame.bind(window) || 
                               function(callback){ window.setTimeout(callback, 16) },

        calcPixelRatio()
        {
            const ctx = this.context;
            const DPR = window.devicePixelRatio || 1;
            const BSR = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio    ||
                        ctx.msBackingStorePixelRatio     ||
                        ctx.oBackingStorePixelRatio      ||
                        ctx.backingStorePixelRatio       ||
                        1;
            this.pixelRatio = DPR / BSR;
        },

        resize()
        {
            const width  = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.canvas.width  = width  * this.pixelRatio;
            this.canvas.height = height * this.pixelRatio;
            this.canvas.style.width  = width  + 'px';
            this.canvas.style.height = height + 'px';
            this.context.scale(this.pixelRatio, this.pixelRatio);
        },

        // update()
        // {
        //     this.entities.forEach(function(entity)
        //     {
        //         entity.update();

        //     }.bind(this));
        // },

        render()
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const entities = this.entities;
            let entity;

            for(const entityId in entities)
            {
                entity = entities[entityId];
                this.context.beginPath();
                this.context.save();
                entity.render();
                this.context.restore();
            }
        },

        frame() 
        {
            // this.update();
            this.render();
            // this.frameCount++;
            this.requestAnimationFrame(this.frame.bind(this));
        },

        start()
        {
            this.frame();
        },

        createCircle(x, y, radius)
        {
            let circ = new Circle(x, y, radius, this.context);
            this.entities[circ.id] = circ;
        },

        createRect(x, y, width, height, radius)
        {
            let rect = new Rectangle(x, y, width, height, this.context);
            this.entities[rect.id] = rect;
        },

        createLine(x1, y1, x2, y2)
        {
            let line = new Line(x1, y1, x2, y2, this.context);
            this.entities[line.id] = line;
        },

        deleteEntity(id)
        {
            delete this.entities[id];
        }
    };
    
    return RenderingEngine;
});