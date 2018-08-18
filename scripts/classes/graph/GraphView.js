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
                    fillStyle:   '#262626',
                    strokeStyle: 'rgb(255, 154, 0)',
                    lineWidth:   this.config.vertexOutlineSize,
                    shadowBlur:  16,
                    shadowColor: '#ff9a00'
                });

                const text = this.engine.createText(params.data, params.x, params.y, this.VERTEX_LAYER, 
                {
                    fillStyle: 'rgb(255, 154, 0)',
                    font:      '24px monospace',
                    shadowBlur:  16,
                    shadowColor: '#ff9a00'
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
                if(this.vertexMap[params.data])
                {
                    this.vertexMap[params.data].circle.center(params.x, params.y);
                    this.vertexMap[params.data].text.center(params.x, params.y);
                }

            }.bind(this));

            // Vertex Selected
            this.model.onVertexSelected.attach('selectVertex', function(_, params)
            {
                if(this.vertexMap[params.data])
                {
                    this.vertexMap[params.data].circle.styles.strokeStyle = '#fffc55';
                    this.vertexMap[params.data].circle.styles.shadowColor = '#fffc55';
                }
            
            }.bind(this));

            // Vertex Deselected
            this.model.onVertexDeselected.attach('deselectVertex', function(_, params)
            {
                if(this.vertexMap[params.data])
                {
                    this.vertexMap[params.data].circle.styles.strokeStyle = 'rgb(255, 154, 0)';
                    this.vertexMap[params.data].circle.styles.shadowColor = '#ff9a00';
                }                 

            }.bind(this));

            // Vertex Hovered
            this.model.onVertexHovered.attach('hoverVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data]; 
                if(vertex)
                {
                    document.body.style.cursor = 'pointer';
                    vertex.circle.styles.strokeStyle = 'rgb(255, 255, 255)';
                    vertex.circle.styles.shadowColor = '#ffffff';
                }                 

            }.bind(this));

            // Vertex Not Hovered
            this.model.onVertexNotHovered.attach('unhoverVertex', function(_, params)
            {
                const vertex = this.vertexMap[params.data]; 
                if(vertex)
                {
                    document.body.style.cursor = 'auto';
                    vertex.circle.styles.strokeStyle = 'rgb(255, 154, 0)';
                    vertex.circle.styles.shadowColor = '#ff9a00';
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
                    strokeStyle: 'rgba(255, 255, 100, 0.5)',
                    lineWidth:   this.config.edgeWidth,
                    shadowBlur:  20,
                    shadowColor: 'rgba(255, 255, 150, 0.8)'
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
                grd.addColorStop(.3, "#262626");
                grd.addColorStop(.7, "transparent");
                grd.addColorStop(1, "#262626");

                // Set other existing edge to curve
                const otherEdge = this.edgeMap[ [params.to, params.from] ];
                if(otherEdge) 
                {
                    otherEdge.line.styles.curveDirection = 90;
                    otherEdge.line.changed = true;
                }
                    
                const edge =  
                {
                    line: this.engine.createLine(params.fromPoint.x, params.fromPoint.y, 
                          params.toPoint.x, params.toPoint.y, this.EDGE_LAYER,
                          {
                              curveDirection: otherEdge ? 90 : 0, // the angle, 0 = none
                              curveOffset:    this.config.edgeCurveOffset,
                              strokeStyle:    'rgb(255, 154, 0)',
                              lineWidth:      this.config.edgeWidth,
                              shadowBlur:     16,
                              shadowColor:    '#ff9a00'
                          }),

                    box: this.engine.createRectangle(params.center.x, params.center.y, 
                         this.config.edgeBoxSize, this.config.edgeBoxSize, this.EDGE_LAYER, 
                         {
                             strokeStyle: 'transparent',
                             fillStyle:   grd,
                             background: 'transparent'
                         }),

                    text: this.engine.createText(params.weight, params.center.x, 
                          params.center.y, this.EDGE_LAYER, 
                          {
                              fillStyle:   'rgb(255, 154, 0)',
                              shadowBlur:  16,
                              shadowColor: '#ff9a00',
                              font:        '16px monospace'
                          })
                };
                this.edgeMap[ [params.from, params.to] ] = edge;

                this.engine.createCircle(edge.line.curveCenterX,
                    edge.line.curveCenterY, 5);

// Example of arrow creation
const points = Util.calcArrowPoints
(
    edge.line.curveCenterX,
    edge.line.curveCenterY,
    params.toPoint.x,
    params.toPoint.y,
    30, // angle,
    30, //length
    this.config.vertexSize, // offset
    true // end of line
);

this.engine.createLine(points.center.x, points.center.y, 
points.left.x, points.left.y, this.EDGE_LAYER,
{
    curveDirection: otherEdge ? -90 : 0,
    curveOffset: 5,
    strokeStyle: 'rgb(255, 154, 0)',
    lineWidth:   this.config.edgeWidth,
    shadowBlur:  16,
    shadowColor: '#ff9a00'
});

this.engine.createLine(points.center.x, points.center.y, 
points.right.x, points.right.y, this.EDGE_LAYER,
{
    curveDirection: otherEdge ? -90 : 0,
    curveOffset: 5,
    strokeStyle: 'rgb(255, 154, 0)',
    lineWidth:   this.config.edgeWidth,
    shadowBlur:  16,
    shadowColor: '#ff9a00'
});


            }.bind(this));

            // Edge Removed
            this.model.onEdgeRemoved.attach('removeEdge', function(_, params)
            {                
                const edge = this.edgeMap[ [params.from, params.to] ];
                edge.line.delete();
                edge.box.delete();
                edge.text.delete();
                delete this.edgeMap[ [params.from, params.to] ];

            }.bind(this));

            // Edge Moved
            this.model.onEdgeMoved.attach('moveEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];

                edge.line.setStart(params.fromPoint.x, params.fromPoint.y);
                edge.line.setEnd(params.toPoint.x, params.toPoint.y);
                edge.box.center(params.center.x, params.center.y);
                edge.text.center(params.center.x, params.center.y);

            }.bind(this));
            
            // Edge Hovered
            this.model.onEdgeHovered.attach('hoverEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ]; 
                if(edge)
                {
                    document.body.style.cursor = 'pointer';
                    edge.box.styles.strokeStyle = 'rgb(255, 255, 255)';
                    edge.box.styles.shadowColor = '#ffffff';
                    edge.text.styles.fillStyle = 'rgb(255, 255, 255)';
                    edge.text.styles.shadowColor = '#ffffff';
                }                 
                
            }.bind(this));
            
            // Edge Not Hovered
            this.model.onEdgeNotHovered.attach('unhoverEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];
                if(edge)
                {
                    document.body.style.cursor = 'auto';
                    edge.box.styles.strokeStyle = 'rgb(255, 154, 0)';
                    edge.box.styles.shadowColor = '#ff9a00';
                    edge.text.styles.fillStyle = 'rgb(255, 154, 0)';
                    edge.text.styles.shadowColor = '#ff9a00';
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