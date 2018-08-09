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

        this.onCanvasMouseClick = new Event(this);
        this.onCanvasMouseDown  = new Event(this);
        this.onCanvasMouseUp    = new Event(this);
        this.onCanvasMouseMove  = new Event(this);
        this.onCanvasMouseDrag  = new Event(this);

        this.mouseMoved = false;
        this.mouseDown  = false;
        this.mouseMoveTimer = 0;
        this.mouseMoveDelay = 0; // NEEDS WORK
        this.mouseMoveResetDelay = 200;

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
                }
            
            }.bind(this));

            // Vertex Deselected
            this.model.onVertexDeselected.attach('deselectVertex', function(_, params)
            {
                if(this.vertexMap[params.data])
                {
                    this.vertexMap[params.data].circle.styles.strokeStyle = 'rgb(255, 154, 0)';
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
                this.edgeMap[ [params.from, params.to] ] =  
                {
                    line: this.engine.createLine(params.fromPoint.x, params.fromPoint.y, 
                          params.toPoint.x, params.toPoint.y, this.EDGE_LAYER,
                          {
                              strokeStyle: 'rgb(255, 154, 0)',
                              lineWidth:   this.config.edgeWidth,
                              shadowBlur:  16,
                              shadowColor: '#ff9a00'
                          }),

                    box: this.engine.createRectangle(params.center.x, params.center.y, 
                         this.config.edgeBoxSize, this.config.edgeBoxSize, this.EDGE_LAYER, 
                         {
                             strokeStyle: 'rgb(255, 154, 0)',
                             lineWidth:   this.config.vertexOutlineSize,
                             fillStyle:   '#262626',
                             shadowBlur:  16,
                             shadowColor: '#ff9a00'
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
            
            }.bind(this));

            // Edge Removed
            this.model.onEdgeRemoved.attach('removeEdge', function(_, params)
            {                
                const edge = this.edgeMap[ [params.from, params.to] ];
                edge.line.delete();
                edge.box.delete();
                delete this.edgeMap[ [params.from, params.to] ];

            }.bind(this));

            // Edge Moved
            this.model.onEdgeMoved.attach('moveEdge', function(_, params)
            {
                const edge = this.edgeMap[ [params.from, params.to] ];

                edge.line.setStart(params.fromPoint.x, params.fromPoint.y);
                edge.line.setEnd(params.toPoint.x, params.toPoint.y);
                edge.box.center(params.center.x, params.center.y);

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
                this.mouseMoved = false;
                this.mouseDown  = true;
                this.onCanvasMouseDown.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            this.engine.canvas.addEventListener('mouseup', function(event)
            {
                event.preventDefault();
                this.onCanvasMouseUp.notify({x: event.offsetX, y: event.offsetY});
                this.mouseDown = false;
                
                if(!this.mouseMoved)
                    this.onCanvasMouseClick.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            this.engine.canvas.addEventListener('mousemove', function(event)
            { 
                event.preventDefault();
                if(this.mouseMoveTimer > this.mouseMoveDelay)
                {
                    this.mouseMoved = true;
                    this.onCanvasMouseMove.notify({x: event.offsetX, y: event.offsetY});
                }
                else this.mouseMoveTimer++;

                if(this.mouseDown)
                        this.onCanvasMouseDrag.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            // Adds a small delay before triggering a mouse move event
            this.engine.canvas.addEventListener('mousemove', Util.stagger(function(event)
            {
                event.preventDefault();
                this.mouseMoveTimer = 0;
            
            }.bind(this), this.mouseMoveResetDelay));
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