/**
 *  @author Jake Landowski
 *  8/7/18
 *  RenderingEngine.js
 * 
 *  For managing HTML5 canvas and all shape entity rendering.
 */

'use strict';

import Circle from './Circle.js';
import Rectangle from './Rectangle.js';
import Line from './Line.js';
import Text from './Text.js';
import Arrow from './Arrow.js';

const RenderingEngine = function(config={}) 
{
    this.config = 
    {
        backgroundColor: config.backgroundColor || '#fff'
    };

    this.canvas     = document.createElement('canvas');
    this.context    = this.canvas.getContext('2d');
    this.calcPixelRatio();
    
    // this.canvas.style.background = this.config.backgroundColor; 

    // this.frameCount = 0;
    this.layers    = []; // Layers
    this.maxLayerLevel = 0;
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
    //     this.layers.forEach(function(entity)
    //     {
    //         entity.update();

    //     }.bind(this));
    // },

    render()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const layers = this.layers;
        let entity;

        layers.forEach(function(layer)
        {
            for(const entityId in layer)
            {
                entity = layer[entityId];
                this.context.beginPath();
                this.context.save();
                entity.render();
                this.context.restore();
            }

        }.bind(this));

    },

    frame() 
    {
        // this.update();
        this.render();
        // this.frameCount++;
        this.requestAnimationFrame(this.frame.bind(this));
    },

    appendTo(container)
    {
        this.container = container;
        container.appendChild(this.canvas);
        this.resize();
    },

    start()
    {
        this.frame();
    },

    createCircle(x, y, radius, level=0, styles={})
    {
        let circ = new Circle(x, y, radius, styles, this.context, this, level);
        this.getLayer(level)[circ.id] = circ;
        return circ;
    },

    createRectangle(x, y, width, height, level=0, styles={})
    {
        let rect = new Rectangle(x, y, width, height, styles, this.context, this, level);
        this.getLayer(level)[rect.id] = rect;
        return rect;
    },

    createLine(x1, y1, x2, y2, level=0, styles={})
    {
        let line = new Line(x1, y1, x2, y2, styles, this.context, this, level);
        this.getLayer(level)[line.id] = line;
        return line;
    },

    createText(content, x, y, level=0, styles={})
    {
        let text = new Text(content, x, y, styles, this.context, this, level);
        this.getLayer(level)[text.id] = text;
        return text;
    },

    createArrow(x1, y1, x2, y2, level=0, styles={})
    {
        let arrow = new Arrow(x1, y1, x2, y2, styles, this.context, this, level);
        this.getLayer(level)[arrow.id] = arrow;
        return arrow;
    },

    deleteEntity(id)
    {
        this.layers.forEach(function(layer)
        {
            if(layer[id]) delete layer[id];

        }.bind(this));
    },

    getLayer(level)
    {
        if(!this.layers[level]) this.layers[level] = Object.create(null);
        return this.layers[level];
    },

    moveEntityToLayer(id, prevLevel, newLevel)
    {
        const layer = this.getLayer(prevLevel);
        this.getLayer(newLevel)[id] = this.layers[prevLevel][id];
                                delete this.layers[prevLevel][id];
        
        if(newLevel > this.maxLayerLevel) this.maxLayerLevel = newLevel;
    },

    maxLayer()
    {
        return this.maxLayerLevel;
    }
};

export default RenderingEngine;