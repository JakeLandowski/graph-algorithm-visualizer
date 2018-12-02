/**
 *  @author Jake Landowski
 *  7/16/18
 *  Graph.js
 * 
 *  Class to represent a Graph in various forms, uses Model and View
 *  to handle rendering and data logic.
 */

'use strict';

import GraphModel from './GraphModel.js';
import GraphView from './GraphView.js';
import { rand, throttle } from '../../utils/Utilities.js';

const Graph = function(container, config={})
{
    let primaryColor = "#262626";
    let secondaryColor = "#9d9b98";
    let background = "#fff";

    if(!container.clientWidth || !container.clientHeight) 
        throw new TypeError('Need to provide a containing element for Graph to render in.');
    
    this.container = container;
    
    this.config = 
    {  
        backgroundColor:        config.backgroundColor        !== undefined ? [config.backgroundColor]        : [background],
        undirected:             config.undirected             !== undefined ? config.undirected               : true,
        weighted:               config.weighted               !== undefined ? config.weighted                 : false,
        vertexSize:             config.vertexSize             !== undefined ? config.vertexSize               : 25,
        vertexOutlineSize:      config.vertexOutlineSize      !== undefined ? config.vertexOutlineSize        : 1,
        edgeWidth:              config.edgeWidth              !== undefined ? config.edgeWidth                : 2,
        edgeBoxSize:            config.edgeBoxSize            !== undefined ? config.edgeBoxSize              : 15,
        edgeCurveOffset:        config.edgeCurveOffset        !== undefined ? config.edgeCurveOffset          : 100,
        vertexOutlineColor:     config.vertexOutlineColor     !== undefined ? [config.vertexOutlineColor]     : [primaryColor], 
        vertexTextColor:        config.vertexTextColor        !== undefined ? [config.vertexTextColor]        : [primaryColor],
        vertexHoverColor:       config.vertexHoverColor       !== undefined ? [config.vertexHoverColor]       : [secondaryColor],
        vertexSelectColor:      config.vertexSelectColor      !== undefined ? [config.vertexSelectColor]      : [secondaryColor],
        edgeLineColor:          config.edgeLineColor          !== undefined ? [config.edgeLineColor]          : [primaryColor],
        edgeBoxOutlineColor:    config.edgeBoxOutlineColor    !== undefined ? [config.edgeBoxOutlineColor]    : ['transparent'],
        edgeBoxBackgroundColor: config.edgeBoxBackgroundColor !== undefined ? [config.edgeBoxBackgroundColor] : ['transparent'],
        edgeTextColor:          config.edgeTextColor          !== undefined ? [config.edgeTextColor]          : [primaryColor],
        edgeArrowColor:         config.edgeArrowColor         !== undefined ? [config.edgeArrowColor]         : [primaryColor],
        edgeHoverColor:         config.edgeHoverColor         !== undefined ? [config.edgeHoverColor]         : [secondaryColor],
        trackingEdgeColor:      config.trackingEdgeColor      !== undefined ? [config.trackingEdgeColor]      : [secondaryColor],
    }; // these are arrays because it makes the colors pointers that cascade down and canvas render automatically extacts the values
        //from the array so if you decide to change the color you will need to access the array [0] and change that color

    this.model = new GraphModel(container.clientWidth, container.clientHeight, this.config);
    this.view  = new GraphView(container, this.model, this.config);

    // this.view.onUndo.attach('undo', function(params) { this.undo(); }.bind(this));
    // this.view.onRedo.attach('redo', function(params) { this.redo(); }.bind(this));
    
    this.mouseEventsLogged  = [];
    this.hoverThrottleDelay = 30;
    this.initAlwaysOnFeatures();
    this.createMode();
};

Graph.prototype = 
{
    randomize()
    {
        this.model.randomize();
    },

    //=========== Handlers ===========//

    editEdgeWeight(params)
    {
        let weight = Number.parseInt(params.weight);

        if(!isNaN(weight))
        {
            weight = weight < 0 ? 0 : (weight > 20 ? 20 : weight);
            this.model.editEdgeWeight(weight);
            this.model.clearEdgeEdit();
        } 
    },

    edgeSpatialCurve(params)
    {
        const edge = this.model.getEdge(params.from, params.to);
        edge.x = params.centerX;
        edge.y = params.centerY;
        edge.setBounds(); // for spatial
        this.model.updateEdgeSpatial(edge);
    },
    
    clickEntity(params)
    {
        this.model.clearEdgeEdit();

        // see if clicked on vertex here using model
        // if clicked on vertex tell model to delete
        const vertex   = this.model.vertexAt(params.x, params.y);
        const selected = this.model.selectedVertex; 

        if(vertex)
        {
            if(selected)
            {
                // If not the same vertex
                // and edge doesnt exist
                // create edge
                if(selected.data !== vertex.data && 
                   !this.model.edgeExists(selected.data, vertex.data))
                {
                    this.model.dispatch(this.model.userCommands,
                    {
                        type: 'addEdge',
                        data: 
                        {
                            from:   selected.data, 
                            to:     vertex.data,
                            weight: rand(1, 20)     
                        },
                        undo: 'removeEdge'
                    });

                    // Edge hopping
                    this.model.deselectVertex();
                    this.model.selectVertex(vertex);
                    this.trackEdgeToCursor(params.x, params.y);
                }
                else // if same vertex or edge exists already
                {
                    this.model.deselectVertex();
                }
            }
            else // no vertex selected, selected it
            {
                this.model.selectVertex(vertex);
                this.trackEdgeToCursor(params.x, params.y);
            }
        }
        else if(selected) // no vertex clicked
        {
            this.model.deselectVertex();
        }
        else
        {
            const edge = this.model.edgeAt(params.x, params.y);
            
            if(edge) // edit edge
            {
                this.model.startEditingEdge(edge);
            }
            else if(this.model.hasSymbols()) // symbols left? Add vertex!
            {   
                this.model.dispatch(this.model.userCommands,
                { 
                    type: 'addVertex',
                    data: 
                    {
                        symbol:   this.model.peekSymbol(),
                        x:        params.x,
                        y:        params.y,
                        numEdges: 0
                    },
                    undo: 'removeVertex'
                });
            }
        }
    },

    dragVertex(params)
    {
        // locate vertex at location
        const vertex = this.model.vertexAt(params.x, params.y);

        if(vertex && !this.model.selectedVertex)
        {
            const offsetX = vertex.x - params.x;
            const offsetY = vertex.y - params.y;

            function stickVertexToCursor(point)
            {
                // Mostly visual move
                this.model.moveVertex(vertex, point.x + offsetX, point.y + offsetY);
            }

            function releaseVertexFromCursor(point)
            {
                // Final movement, updates spatial information
                this.view.onCanvasMouseDrag.detach('stickVertexToCursor');
                this.view.onCanvasMouseUp.detach('releaseVertexFromCursor');
                this.model.moveVertex(vertex, point.x + offsetX, point.y + offsetY);
                this.model.updateVertexSpatial(vertex);
            }

            this.view.onCanvasMouseDrag.attach('stickVertexToCursor', stickVertexToCursor.bind(this));
            this.view.onCanvasMouseUp.attach('releaseVertexFromCursor', releaseVertexFromCursor.bind(this));
        }
    },

    removeEntity(params)
    {
        const vertex = this.model.vertexAt(params.x, params.y);

        if(vertex) // REMOVE
        {
            this.model.dispatch(this.model.userCommands, 
            {
                type: 'removeVertex',
                data: 
                {
                    symbol:   vertex.data,
                    x:        params.x,
                    y:        params.y,
                    numEdges: vertex.numEdges
                },
                undo: 'addVertex',
            });
        }
        else
        {
            const edge = this.model.edgeAt(params.x, params.y);

            if(edge)
            {
                this.model.dispatch(this.model.userCommands,
                {
                    type: 'removeEdge',
                    data: 
                    {
                        from:   edge.from, 
                        to:     edge.to,
                        weight: edge.weight
                    },
                    undo: 'addEdge'
                });
            }
        }

    },

    hoverEntity(params)
    {
        const vertex = this.model.vertexAt(params.x, params.y);

        if(vertex)
        {
            this.model.hoverVertex(vertex);
        }
        else
        {
            const edge = this.model.edgeAt(params.x, params.y);

            if(edge) this.model.hoverEdge(edge);
            else     this.model.hoverNothing();
        }

    },

    //=========== Graph Interaction Modes ===========//

    initAlwaysOnFeatures()
    {
        this.enableHover();
        this.view.onEdgeFormSubmitted.attach('editEdgeWeight', this.editEdgeWeight.bind(this));
        this.view.onEdgeCurveChanged.attach('edgeSpatialCurve', this.edgeSpatialCurve.bind(this));
        this.view.onCanvasResize.attach('resizeModel', this.resizeModel.bind(this));
    },

    createMode()
    {
        this.clearMouseEvents();

        // For when changing modes while tracking 
        // edge exists and a vertex is selected
        if(this.model.selectedVertex)
        {
            this.model.deselectVertex();
            this.model.releaseTrackingEdge();
        }

        this.mouseEventsLogged.push('clickEntity');
        this.view.onCanvasMouseClick.attach('clickEntity', this.clickEntity.bind(this));
        
        this.mouseEventsLogged.push('dragVertex');
        this.view.onCanvasMouseDown.attach('dragVertex', this.dragVertex.bind(this));
    },

    eraseMode()
    {
        this.clearMouseEvents();
        
        this.mouseEventsLogged.push('removeEntity');
        this.view.onCanvasMouseClick.attach('removeEntity', this.removeEntity.bind(this));
    },

    enableHover()
    {
        this.view.onCanvasMouseMove.attach('hoverEntity', throttle(this.hoverEntity.bind(this), this.hoverThrottleDelay));
    },

    trackEdgeToCursor(x, y)
    {
        this.model.addTrackingEdge(x, y);

        function stickEdgeToCursor(point)
        {
            this.model.updateTrackingEdge(point.x, point.y);
        }

        function releaseEdgeFromCursor(point)
        {
            this.view.onCanvasMouseMove.detach('stickEdgeToCursor');
            this.model.onVertexDeselected.detach('releaseEdgeFromCursor');
            this.model.releaseTrackingEdge();
        }

        this.view.onCanvasMouseMove.attach('stickEdgeToCursor', stickEdgeToCursor.bind(this));
        this.model.onVertexDeselected.attach('releaseEdgeFromCursor', releaseEdgeFromCursor.bind(this));
    },

    //=========== Other ===========//

    save()
    {
        localStorage.setItem('graph', this.model.saveGraph());
    },

    load()
    {
        const commandJSON = localStorage.getItem('graph');

        if(commandJSON)
        {
            this.model.loadGraph(commandJSON);
        }
    },

    undo()
    {
        this.model.undo(this.model.userCommands);
    },

    redo()
    {
        this.model.redo(this.model.userCommands);
    },

    clearMouseEvents()
    {
        const view = this.view;
        this.mouseEventsLogged.forEach(function(eventName)
        {
            view.onCanvasMouseClick.detach(eventName);
            view.onCanvasMouseMove.detach(eventName);
            view.onCanvasMouseDrag.detach(eventName);
            view.onCanvasMouseDown.detach(eventName);
            view.onCanvasMouseUp.detach(eventName);
        });
    },

    resize()
    {
        this.view.resize();   
    },
    
    resizeModel(params)
    {
        this.model.resize(params.width, params.height);   
    }
};

export default Graph;