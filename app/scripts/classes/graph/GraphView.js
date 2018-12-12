 /**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

'use strict';

import RenderingEngine from '../engine/RenderingEngine.js'
import Event from '../Event.js';
import { appendHtml } from '../../utils/Utilities.js';

const GraphView = function(container, model, config)
{
    this.container = container;
    this.setModel(model);
    this.setConfig(config);
    this.engine = new RenderingEngine(config);

    this.VERTEX_LAYER      = 4;
    this.WEIGHT_TEXT_LAYER = 3;
    this.ARROW_LAYER       = 2;
    this.WEIGHT_BOX_LAYER  = 1;
    this.EDGE_LAYER        = 0;
    this.TRACKING_LAYER    = 0;

    // For mapping data in model to their view shape equivalent
    this.initShapeMaps();

    this.onCanvasResize      = new Event(this);
    this.onCanvasMouseClick  = new Event(this);
    this.onCanvasMouseDown   = new Event(this);
    this.onCanvasMouseUp     = new Event(this);
    this.onCanvasMouseMove   = new Event(this);
    this.onCanvasMouseDrag   = new Event(this);

    this.onEdgeFormSubmitted = new Event(this);
    this.onEdgeCurveChanged  = new Event(this);

    this.onUndo              = new Event(this);
    this.onRedo              = new Event(this);

    this.mouseMoved = false;
    this.mouseDown  = false;
    this.mouseJustPutDownDelay = 150;

    this.initHandlers();
    this.appendTo(container);
};

GraphView.prototype = 
{
    createVertex(params)
    {
        const vertex = this.engine.createCircle(params.x, params.y, this.config.vertexSize, this.VERTEX_LAYER, 
        {
            fillStyle:   this.config.backgroundColor,
            strokeStyle: this.config.vertexOutlineColor,
            lineWidth:   this.config.vertexOutlineSize,
            shadowBlur:  16,
            shadowColor: this.config.vertexOutlineColor
        });

        const text = this.engine.createText(params.data, params.x, params.y, this.VERTEX_LAYER, 
        {
            fillStyle:   this.config.vertexTextColor,
            font:        '24px monospace',
            shadowBlur:  16,
            shadowColor: this.config.vertexTextColor
        });

        this.vertexMap[params.data] = 
        {
            circle: vertex,
            text:   text
        }
    },

    deleteVertex(params)
    {
        if(this.vertexMap[params.data])
        {
            const circle = this.vertexMap[params.data].circle;
            const text   = this.vertexMap[params.data].text;
            circle.delete();
            text.delete();
            delete this.vertexMap[params.data];
        }
    },

    moveVertex(params)
    {
        const vertex = this.vertexMap[params.data];
        if(vertex)
        {
            vertex.circle.center(params.x, params.y);
            vertex.text.center(params.x, params.y);
        }
    },

    selectVertex(params)
    {
        const vertex = this.vertexMap[params.data];
        if(vertex)
        {
            vertex.circle.styles.strokeStyle = this.config.vertexSelectColor;
            vertex.circle.styles.shadowColor = this.config.vertexSelectColor;
        }
    },

    deselectVertex(params)
    {
        const vertex = this.vertexMap[params.data];
        if(vertex)
        {
            vertex.circle.styles.strokeStyle = this.config.vertexOutlineColor;
            vertex.circle.styles.shadowColor = this.config.vertexOutlineColor;
        }                 
    },

    hoverVertex(params)
    {
        const vertex = this.vertexMap[params.data]; 
        if(vertex)
        {
            document.body.style.cursor = 'pointer';
            vertex.circle.styles.strokeStyle = this.config.vertexHoverColor;
            vertex.circle.styles.shadowColor = this.config.vertexHoverColor;
        }                 
    },

    unhoverVertex(params)
    {
        const vertex = this.vertexMap[params.data]; 
        if(vertex)
        {
            document.body.style.cursor = 'auto';
            vertex.circle.styles.strokeStyle = this.config.vertexOutlineColor;
            vertex.circle.styles.shadowColor = this.config.vertexOutlineColor;
        }                 
    },

    trackingEdgeAdded(params)
    {
        const start = params.start;
        const end   = params.end;

        this.trackingEdge = this.engine.createLine(start.x, start.y, end.x, end.y, this.TRACKING_LAYER, 
        {
            strokeStyle: this.config.trackingEdgeColor,
            lineWidth:   this.config.edgeWidth,
        });

    },

    trackingEdgeMoved(params)
    {
        this.trackingEdge.setEnd(params.x, params.y);
    },

    trackingEdgeRemoved(params)
    {
        if(this.trackingEdge)
        {
            this.trackingEdge.delete()
            delete this.trackingEdge;                               
        }
    },

    createEdge(params)
    {
        // Set other existing edge to curve
        const otherEdge = this.edgeMap[ [params.to, params.from] ];
        const directedAndOtherEdge = !this.config.undirected && otherEdge;
        
        if(directedAndOtherEdge) 
        {
            otherEdge.line.styles.curveDirection = 90;
            otherEdge.line.changed = true; // for forcing calculateCurve to run 
            otherEdge.line.calculateCurve();

            otherEdge.box.center(otherEdge.line.curveCenterX, otherEdge.line.curveCenterY);
            otherEdge.text.center(otherEdge.line.curveCenterX, otherEdge.line.curveCenterY);

            otherEdge.arrow.calcArrowPoints(otherEdge.line.curveArrowX, otherEdge.line.curveArrowY, 
                                            params.fromPoint.x, params.fromPoint.y);
            otherEdge.arrow.styles.leftCurveDirection  = -90;
            otherEdge.arrow.styles.rightCurveDirection = -90;
            otherEdge.arrow.calculateCurve();

            this.onEdgeCurveChanged.notify
            ({
                from: params.to,   // reversed because other edge
                to:   params.from, // reversed because other edge
                centerX: otherEdge.line.curveCenterX,
                centerY: otherEdge.line.curveCenterY
            });
        }
            
        const edge =  
        {
            line: this.engine.createLine(params.fromPoint.x, params.fromPoint.y, 
                    params.toPoint.x, params.toPoint.y, this.EDGE_LAYER,
                    {
                        curveDirection: directedAndOtherEdge ? 90 : 0, // the angle, 0 = none
                        curveOffset:    this.config.edgeCurveOffset,
                        strokeStyle:    this.config.edgeLineColor,
                        lineWidth:      this.config.edgeWidth,
                    }),
        };

        const edgeCenterX = directedAndOtherEdge ? edge.line.curveCenterX : params.center.x;
        const edgeCenterY = directedAndOtherEdge ? edge.line.curveCenterY : params.center.y;

        const weighted = this.config.weighted;

        edge.box = this.engine.createCircle(edgeCenterX, edgeCenterY,
        this.config.edgeBoxSize, this.WEIGHT_BOX_LAYER,
        {
            strokeStyle: weighted ? this.config.edgeBoxOutlineColor : 'transparent',
            fillStyle:   weighted ? this.config.backgroundColor : 'transparent',
        });

        edge.text = this.engine.createText(params.weight, edgeCenterX,
        edgeCenterY, this.WEIGHT_TEXT_LAYER,
        {
            fillStyle: weighted ? this.config.edgeTextColor : 'transparent',
            font: '16px monospace'
        });

        if(!this.config.undirected)
        {
            const arrowFromX = directedAndOtherEdge ? edge.line.curveArrowX : params.fromPoint.x;
            const arrowFromY = directedAndOtherEdge ? edge.line.curveArrowY : params.fromPoint.y;
            
            edge.arrow = this.engine.createArrow(arrowFromX, arrowFromY, 
            params.toPoint.x, params.toPoint.y, this.ARROW_LAYER,
            {
                leftCurveDirection:  otherEdge ? -90 : 0, // the angle, 0 = none
                rightCurveDirection: otherEdge ? -90 : 0, // the angle, 0 = none
                leftCurveOffset:     5,
                rightCurveOffset:    5,
                length:              15,
                angle:               30,
                endOfLine:           true,
                offset:              this.config.vertexSize,
                strokeStyle:         this.config.edgeArrowColor,
                lineWidth:           this.config.edgeWidth,
                shadowBlur:          16,
                shadowColor:         this.config.edgeArrowColor
            });
        }

        this.edgeMap[ [params.from, params.to] ] = edge;

        if(directedAndOtherEdge)
            this.onEdgeCurveChanged.notify
            ({
                from: params.from,   
                to:   params.to, 
                centerX: edge.line.curveCenterX,
                centerY: edge.line.curveCenterY
            });
    },

    removeEdge(params)
    {                
        const edge = this.edgeMap[ [params.from, params.to] ];
        edge.line.delete();
        edge.box.delete();
        edge.text.delete();
        if(!this.config.undirected) edge.arrow.delete();
        delete this.edgeMap[ [params.from, params.to] ];

        const otherEdge = this.edgeMap[ [params.to, params.from] ];
        const directedAndOtherEdge = !this.config.undirected && otherEdge;
        
        if(directedAndOtherEdge)
        {
            otherEdge.line.styles.curveDirection = 0;
            otherEdge.arrow.styles.leftCurveDirection = 0;
            otherEdge.arrow.styles.rightCurveDirection = 0;
            otherEdge.arrow.calcArrowPoints(params.toPoint.x, params.toPoint.y,
                                            params.fromPoint.x, params.fromPoint.y);
            otherEdge.box.center(otherEdge.line.cx, otherEdge.line.cy);
            otherEdge.text.center(otherEdge.line.cx, otherEdge.line.cy);

            this.onEdgeCurveChanged.notify
            ({
                from: params.to,   // reversed because other edge
                to:   params.from, // reversed because other edge
                centerX: otherEdge.line.cx,
                centerY: otherEdge.line.cy
            });
        }
    },

    moveEdge(params)
    {
        const edge = this.edgeMap[ [params.from, params.to] ];
        const otherEdge = this.edgeMap[ [params.to, params.from] ];
        const directedAndOtherEdge = !this.config.undirected && otherEdge;

        edge.line.setStart(params.fromPoint.x, params.fromPoint.y);
        edge.line.setEnd(params.toPoint.x,     params.toPoint.y);
        edge.box.center(directedAndOtherEdge ? edge.line.curveCenterX : params.center.x,
                        directedAndOtherEdge ? edge.line.curveCenterY : params.center.y);
        edge.text.center(directedAndOtherEdge ? edge.line.curveCenterX : params.center.x,
                            directedAndOtherEdge ? edge.line.curveCenterY : params.center.y);

        const fromX = directedAndOtherEdge ? edge.line.curveArrowX : params.fromPoint.x;
        const fromY = directedAndOtherEdge ? edge.line.curveArrowY : params.fromPoint.y;

        if(!this.config.undirected) edge.arrow.calcArrowPoints(fromX, fromY, params.toPoint.x, params.toPoint.y);

        if(directedAndOtherEdge)
            this.onEdgeCurveChanged.notify
            ({
                from: params.from,
                to:   params.to, 
                centerX: edge.line.curveCenterX,
                centerY: edge.line.curveCenterY
            });
    },

    hoverEdge(params)
    {
        const edge = this.edgeMap[ [params.from, params.to] ]; 
        if(edge)
        {
            document.body.style.cursor   = 'pointer';
            edge.box.styles.strokeStyle  = this.config.edgeHoverColor;
            edge.box.styles.shadowColor  = this.config.edgeHoverColor;
            edge.text.styles.fillStyle   = this.config.edgeHoverColor;
            edge.text.styles.shadowColor = this.config.edgeHoverColor;
        }                   
    },

    unhoverEdge(params)
    {
        const edge = this.edgeMap[ [params.from, params.to] ];
        if(edge)
        {
            document.body.style.cursor   = 'auto';
            edge.box.styles.strokeStyle  = this.config.edgeBoxOutlineColor;
            edge.box.styles.shadowColor  = this.config.edgeBoxOutlineColor;
            edge.text.styles.fillStyle   = this.config.edgeTextColor;
            edge.text.styles.shadowColor = this.config.edgeTextColor;
        }                 
    },

    startEdittingEdge(params)
    {
        const edge = this.edgeMap[ [params.from, params.to] ];
        if(edge)
        {
            const container = this.container;
            const form = '<form id="edit-edge-form" style="z-index: 100;position: absolute; background-color:white; left:' + params.center.x + 'px; top:' + params.center.y + 'px;">' +
                            '<input id="edit-edge-weight-field" type="text"/>' +
                            '<input type="submit" value="Done" />' +
                            '</form>'; 
            appendHtml(container, form);

            const field = container.querySelector('#edit-edge-weight-field');
            this.edgeEditForm = container.querySelector('#edit-edge-form');
            
            this.edgeEditForm.addEventListener('submit', function(event)
            {
                event.preventDefault();
                this.onEdgeFormSubmitted.notify({ weight: field.value });
                
            }.bind(this));

            field.focus();
        }                   
    },

    changeEdgeWeight(params)
    {
        const edge = this.edgeMap[ [params.from, params.to] ];
        if(edge) edge.text.content = params.weight;
    },

    clearEdgeEdit(params)
    {
        this.container.removeChild(this.edgeEditForm);
        this.edgeEditForm = null;   
    },

    initHandlers()
    {
        this.model.onVertexAdded.attach(     'createVertex',   this.createVertex.bind(this));
        this.model.onVertexRemoved.attach(   'deleteVertex',   this.deleteVertex.bind(this));
        this.model.onVertexMoved.attach(     'moveVertex',     this.moveVertex.bind(this));
        this.model.onVertexSelected.attach(  'selectVertex',   this.selectVertex.bind(this));
        this.model.onVertexDeselected.attach('deselectVertex', this.deselectVertex.bind(this));
        this.model.onVertexHovered.attach(   'hoverVertex',    this.hoverVertex.bind(this));
        this.model.onVertexNotHovered.attach('unhoverVertex',  this.unhoverVertex.bind(this));

        this.model.onTrackingEdgeAdded.attach(  'trackingEdgeAdded',   this.trackingEdgeAdded.bind(this));
        this.model.onTrackingEdgeMoved.attach(  'trackingEdgeMoved',   this.trackingEdgeMoved.bind(this));
        this.model.onTrackingEdgeRemoved.attach('trackingEdgeRemoved', this.trackingEdgeRemoved.bind(this));
        this.model.onEdgeAdded.attach(          'createEdge',          this.createEdge.bind(this));
        this.model.onEdgeRemoved.attach(        'removeEdge',          this.removeEdge.bind(this));
        this.model.onEdgeMoved.attach(          'moveEdge',            this.moveEdge.bind(this));
        this.model.onEdgeHovered.attach(        'hoverEdge',           this.hoverEdge.bind(this));
        this.model.onEdgeNotHovered.attach(     'unhoverEdge',         this.unhoverEdge.bind(this));
        this.model.onEdgeEditStarted.attach(    'startEdittingEdge',   this.startEdittingEdge.bind(this));
        this.model.onEdgeWeightEditted.attach(  'changeEdgeWeight',    this.changeEdgeWeight.bind(this));
        this.model.onEdgeEditingFinished.attach('clearEdgeEdit',       this.clearEdgeEdit.bind(this));
    },

    destroyHandlers()
    {
        this.model.onVertexAdded.detach(     'createVertex');
        this.model.onVertexRemoved.detach(   'deleteVertex');
        this.model.onVertexMoved.detach(     'moveVertex');
        this.model.onVertexSelected.detach(  'selectVertex');
        this.model.onVertexDeselected.detach('deselectVertex');
        this.model.onVertexHovered.detach(   'hoverVertex');
        this.model.onVertexNotHovered.detach('unhoverVertex');

        this.model.onTrackingEdgeAdded.detach(  'trackingEdgeAdded');
        this.model.onTrackingEdgeMoved.detach(  'trackingEdgeMoved');
        this.model.onTrackingEdgeRemoved.detach('trackingEdgeRemoved');
        this.model.onEdgeAdded.detach(          'createEdge');
        this.model.onEdgeRemoved.detach(        'removeEdge');
        this.model.onEdgeMoved.detach(          'moveEdge');
        this.model.onEdgeHovered.detach(        'hoverEdge');
        this.model.onEdgeNotHovered.detach(     'unhoverEdge');
        this.model.onEdgeEditStarted.detach(    'startEdittingEdge');
        this.model.onEdgeWeightEditted.detach(  'changeEdgeWeight');
        this.model.onEdgeEditingFinished.detach('clearEdgeEdit');
    },

    //========= Mouse Event Interception ===========//

    appendTo(container)
    {
        this.container = container;
        this.engine.appendTo(container);
        this.initCanvasHandlers();
        this.engine.start();
    },

    mouseDownHandler(event)
    {
        event.preventDefault();
        this.mouseDown = true;
        this.mouseJustPutDown = true;
        this.onCanvasMouseDown.notify({x: event.offsetX, y: event.offsetY});
        setTimeout(function(){ this.mouseJustPutDown = false; }.bind(this), this.mouseJustPutDownDelay);
    },

    mouseUpHandler(event)
    {
        event.preventDefault();
        this.onCanvasMouseUp.notify({x: event.offsetX, y: event.offsetY});
        if(this.mouseJustPutDown) this.onCanvasMouseClick.notify({x: event.offsetX, y: event.offsetY});
    },

    mouseMoveHandler(event)
    { 
        event.preventDefault();
        if(this.mouseDown) this.onCanvasMouseDrag.notify({x: event.offsetX, y: event.offsetY});
        this.onCanvasMouseMove.notify({x: event.offsetX, y: event.offsetY});
    },

    initCanvasHandlers()
    {
        this.engine.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this.engine.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        this.engine.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    },

    resize()
    {
        this.engine.resize();
        this.onCanvasResize.notify(
        {
            width: this.engine.canvas.width, 
            height: this.engine.canvas.height
        });
    },

    setModel(model)
    {
        this.model = model;
    },

    setConfig(config)
    {
        this.config = config;
    },

    initShapeMaps()
    {
        this.vertexMap = Object.create(null);
        this.edgeMap   = Object.create(null);
    }
};

export default GraphView;