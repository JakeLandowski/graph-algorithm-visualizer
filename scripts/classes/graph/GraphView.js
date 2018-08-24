/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

'use strict';
define(['classes/engine/RenderingEngine', 
        'classes/Event',
        'utils/Util'], function(RenderingEngine, Event, Util)
{
    const GraphView = function(container, model, config)
    {
        this.container = container;
        this.model     = model;
        this.config    = config;
        this.engine    = new RenderingEngine(config);

        this.VERTEX_LAYER   = 1;
        this.EDGE_LAYER     = 0;
        this.TRACKING_LAYER = 0;

        // For mapping data in model to their view shape equivalent
        this.vertexMap = Object.create(null);
        this.edgeMap   = Object.create(null);

        this.onCanvasMouseClick  = new Event(this);
        this.onCanvasMouseDown   = new Event(this);
        this.onCanvasMouseUp     = new Event(this);
        this.onCanvasMouseMove   = new Event(this);
        this.onCanvasMouseDrag   = new Event(this);

        this.onEdgeFormSubmitted = new Event(this);

        this.onUndo              = new Event(this);
        this.onRedo              = new Event(this);

        this.mouseMoved = false;
        this.mouseDown  = false;
        this.mouseJustPutDownDelay = 150;

        this.initHandlers();
        this.appendTo(container);


    }; // end constructor
    
    GraphView.prototype = 
    {
        initHandlers()
        {

//========= Vertex Listeners ===========//

            // Vertex Added
            this.model.onVertexAdded.attach('createVertex', function(_, params)
            {
                const vertex = this.engine.createCircle(params.x, params.y, this.config.vertexSize, this.VERTEX_LAYER, 
                {
                    fillStyle:   this.config.backgroundColor,
                    strokeStyle: this.config.strokeColor,
                    lineWidth:   this.config.vertexOutlineSize,
                    shadowBlur:  16,
                    shadowColor: '#ff9a00'
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

            }.bind(this));

            // Vertex Removed
            this.model.onVertexRemoved.attach('deleteVertex', function(_, params)
            {
                if(this.vertexMap[params.data])
                {
                    const circle = this.vertexMap[params.data].circle;
                    const text   = this.vertexMap[params.data].text;
                    circle.delete();
                    text.delete();
                    delete this.vertexMap[params.data];
                }

            }.bind(this));

            // Vertex Moved
            this.model.onVertexMoved.attach('moveVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data];
                if(vertex)
                {
                    vertex.circle.center(params.x, params.y);
                    vertex.text.center(params.x, params.y);
                }

            }.bind(this));

            // Vertex Selected
            this.model.onVertexSelected.attach('selectVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data];
                if(vertex)
                {
                    vertex.circle.styles.strokeStyle = this.config.vertexSelectColor;
                    vertex.circle.styles.shadowColor = this.config.vertexSelectColor;
                }
            
            }.bind(this));

            // Vertex Deselected
            this.model.onVertexDeselected.attach('deselectVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data];
                if(vertex)
                {
                    vertex.circle.styles.strokeStyle = this.config.vertexOutlineColor;
                    vertex.circle.styles.shadowColor = this.config.vertexOutlineColor;
                }                 

            }.bind(this));

            // Vertex Hovered
            this.model.onVertexHovered.attach('hoverVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data]; 
                if(vertex)
                {
                    document.body.style.cursor = 'pointer';
                    vertex.circle.styles.strokeStyle = this.config.vertexHoverColor;
                    vertex.circle.styles.shadowColor = this.config.vertexHoverColor;
                }                 

            }.bind(this));

            // Vertex Not Hovered
            this.model.onVertexNotHovered.attach('unhoverVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data]; 
                if(vertex)
                {
                    document.body.style.cursor = 'auto';
                    vertex.circle.styles.strokeStyle = this.config.vertexOutlineColor;
                    vertex.circle.styles.shadowColor = this.config.vertexOutlineColor;
                }                 

            }.bind(this));

            //========= Edge Listeners ===========//

            // Tracking Edge Added
            this.model.onTrackingEdgeAdded.attach('trackingEdgeAdded', function(_, params)
            {
                const start = params.start;
                const end   = params.end;

                this.trackingEdge = this.engine.createLine(start.x, start.y, end.x, end.y, this.TRACKING_LAYER, 
                {
                    strokeStyle: this.config.trackingEdgeColor,
                    lineWidth:   this.config.edgeWidth,
                    shadowBlur:  20,
                    shadowColor: this.config.trackingEdgeColor
                });

            }.bind(this));

            // Tracking Edge Moved
            this.model.onTrackingEdgeMoved.attach('trackingEdgeMoved', function(_, params)
            {
                this.trackingEdge.setEnd(params.x, params.y);

            }.bind(this));

            // Tracking Edge Removed
            this.model.onTrackingEdgeRemoved.attach('trackingEdgeRemoved', function(_, params)
            {
                if(this.trackingEdge)
                {
                    this.trackingEdge.delete()
                    delete this.trackingEdge;                               
                }

            }.bind(this));

            // Edge Added
            this.model.onEdgeAdded.attach('createEdge', function(_, params)
            {
                let grd = this.engine.context.createRadialGradient(params.center.x, params.center.y, 10, params.center.x,
                    params.center.y, 20);
                grd.addColorStop(.3, this.config.backgroundColor);
                grd.addColorStop(.7, "transparent");
                grd.addColorStop(1, this.config.backgroundColor);

                // Set other existing edge to curve
                const otherEdge = this.edgeMap[ [params.to, params.from] ];
                if(otherEdge) 
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
                }
                    
                const edge =  
                {
                    line: this.engine.createLine(params.fromPoint.x, params.fromPoint.y, 
                          params.toPoint.x, params.toPoint.y, this.EDGE_LAYER,
                          {
                              curveDirection: otherEdge ? 90 : 0, // the angle, 0 = none
                              curveOffset:    this.config.edgeCurveOffset,
                              strokeStyle:    this.config.edgeLineColor,
                              lineWidth:      this.config.edgeWidth,
                              shadowBlur:     16,
                              shadowColor:    this.config.edgeLineColor
                          }),
                };

                edge.box = this.engine.createRectangle(otherEdge ? edge.line.curveCenterX : params.center.x,
                otherEdge ? edge.line.curveCenterY : params.center.y, 
                this.config.edgeBoxSize, this.config.edgeBoxSize, this.EDGE_LAYER, 
                {
                    strokeStyle: this.config.edgeBoxOutlineColor,
                    fillStyle:   grd,
                    background:  this.config.edgeBoxBackgroundColor
                }),

                edge.text = this.engine.createText(params.weight, 
                otherEdge ? edge.line.curveCenterX : params.center.x, 
                otherEdge ? edge.line.curveCenterY : params.center.y, this.EDGE_LAYER, 
                {
                    fillStyle:   this.config.edgeTextColor,
                    shadowBlur:  16,
                    shadowColor: this.config.edgeTextColor,
                    font:        '16px monospace'
                }),
                
                edge.arrow = this.engine.createArrow(otherEdge ? edge.line.curveArrowX : params.fromPoint.x, 
                otherEdge ? edge.line.curveArrowY : params.fromPoint.y, 
                params.toPoint.x, params.toPoint.y, this.EDGE_LAYER,
                {
                    leftCurveDirection:  otherEdge ? -90 : 0, // the angle, 0 = none
                    rightCurveDirection: otherEdge ? -90 : 0, // the angle, 0 = none
                    leftCurveOffset:     5,
                    rightCurveOffset:    5,
                    length:              30,
                    angle:               30,
                    endOfLine:           true,
                    offset:              this.config.vertexSize,
                    strokeStyle:         this.config.edgeArrowColor,
                    lineWidth:           this.config.edgeWidth,
                    shadowBlur:          16,
                    shadowColor:         this.config.edgeArrowColor
                }),

                this.edgeMap[ [params.from, params.to] ] = edge;

            }.bind(this));

            // Edge Removed
            this.model.onEdgeRemoved.attach('removeEdge', function(_, params)
            {                
                const edge = this.edgeMap[ [params.from, params.to] ];
                edge.line.delete();
                edge.box.delete();
                edge.text.delete();
                edge.arrow.delete();
                delete this.edgeMap[ [params.from, params.to] ];

                const otherEdge = this.edgeMap[ [params.to, params.from] ];
                if(otherEdge)
                {
                    otherEdge.line.styles.curveDirection = 0;
                    otherEdge.line.changed = true;
                    otherEdge.arrow.styles.leftCurveDirection = 0;
                    otherEdge.arrow.styles.rightCurveDirection = 0;
                    otherEdge.arrow.changed = true;
                    otherEdge.arrow.calcArrowPoints(params.toPoint.x, params.toPoint.y,
                                                    params.fromPoint.x, params.fromPoint.y);
                }

            }.bind(this));

            // Edge Moved
            this.model.onEdgeMoved.attach('moveEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];
                const otherEdge = this.edgeMap[ [params.to, params.from] ];

                edge.line.setStart(params.fromPoint.x, params.fromPoint.y);
                edge.line.setEnd(params.toPoint.x,     params.toPoint.y);
                edge.box.center(otherEdge ? edge.line.curveCenterX : params.center.x,
                                otherEdge ? edge.line.curveCenterY : params.center.y);
                edge.text.center(otherEdge ? edge.line.curveCenterX : params.center.x,
                                 otherEdge ? edge.line.curveCenterY : params.center.y);

                const fromX = otherEdge ? edge.line.curveArrowX : params.fromPoint.x;
                const fromY = otherEdge ? edge.line.curveArrowY : params.fromPoint.y;

                edge.arrow.calcArrowPoints(fromX, fromY, params.toPoint.x, params.toPoint.y);

            }.bind(this));
            
            // Edge Hovered
            this.model.onEdgeHovered.attach('hoverEdge', function(_, params)
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
                
            }.bind(this));
            
            // Edge Not Hovered
            this.model.onEdgeNotHovered.attach('unhoverEdge', function(_, params)
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
                
            }.bind(this));

            // Edge Edit Started
            this.model.onEdgeEditStarted.attach('startEdittingEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];
                if(edge)
                {
                    const container = this.container;
                    const form = '<form id="edit-edge-form" style="z-index: 100;position: absolute; background-color:white; left:' + params.center.x + 'px; top:' + params.center.y + 'px;">' +
                                    '<input id="edit-edge-weight-field" type="text"/>' +
                                    '<input type="submit" value="Done" />' +
                                 '</form>'; 
                    Util.appendHtml(container, form);

                    const field = container.querySelector('#edit-edge-weight-field');
                    this.edgeEditForm = container.querySelector('#edit-edge-form');
                    
                    this.edgeEditForm.addEventListener('submit', function(event)
                    {
                        event.preventDefault();
                        this.onEdgeFormSubmitted.notify({ weight: field.value });
                        
                    }.bind(this));
                }                 
                
            }.bind(this));

            // Edge Weight Editted
            this.model.onEdgeWeightEditted.attach('changeEdgeWeight', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];
                if(edge) edge.text.content = params.weight;
                
            }.bind(this));
            
            // Edge Weight Editted
            this.model.onEdgeEditingFinished.attach('clearEdgeEdit', function(_, params)
            {
                this.container.removeChild(this.edgeEditForm);
                this.edgeEditForm = null;
                
            }.bind(this));
        },

//========= Mouse Event Interception ===========//

        appendTo(container)
        {
            this.container = container;
            this.engine.appendTo(container);
            this.initCanvasHandlers();
            this.initResize();
            this.engine.start();
        },

        initCanvasHandlers()
        {
            this.engine.canvas.addEventListener('mousedown', function(event)
            {
                event.preventDefault();
                this.mouseDown = true;
                this.mouseJustPutDown = true;
                this.onCanvasMouseDown.notify({x: event.offsetX, y: event.offsetY});
                setTimeout(function(){ this.mouseJustPutDown = false; }.bind(this), this.mouseJustPutDownDelay);
            
            }.bind(this));

            this.engine.canvas.addEventListener('mouseup', function(event)
            {
                event.preventDefault();
                this.onCanvasMouseUp.notify({x: event.offsetX, y: event.offsetY});
                if(this.mouseJustPutDown) this.onCanvasMouseClick.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            this.engine.canvas.addEventListener('mousemove', function(event)
            { 
                event.preventDefault();
                if(this.mouseDown) this.onCanvasMouseDrag.notify({x: event.offsetX, y: event.offsetY});
                this.onCanvasMouseMove.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            window.addEventListener('keydown', function(event)
            {
                // stops ALL keybinds on window
                // event.preventDefault();
                const key = event.keyCode;

                if(event.ctrlKey)
                { 
                    if(key === 90)
                    {
                        if(event.shiftKey) this.onRedo.notify();
                        else               this.onUndo.notify();
                    }
                    else if(key === 89) this.onRedo.notify();
                }

            }.bind(this));
        },

        initResize()
        {
            window.addEventListener('resize', Util.stagger(function(event)
            {
                event.preventDefault();
                this.engine.resize();
                this.model.resize(this.engine.canvas.width, this.engine.canvas.height);

            }.bind(this), 400));
        }, 

    };

    return GraphView;
});