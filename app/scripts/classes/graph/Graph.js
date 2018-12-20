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
    this.primaryColor = "#262626";
    this.secondaryColor = "#9d9b98";
    this.background = "#fff";

    if(!container.clientWidth || !container.clientHeight) 
        throw new TypeError('Need to provide a containing element for Graph to render in.');
    
    this.container = container;
    this.setConfig(config);
    this.initModel();
    this.initView();
    
    this.mouseEventsLogged  = [];
    this.hoverThrottleDelay = 30;
    this.initAlwaysOnFeatures();
    this.createMode();
};

Graph.prototype = 
{
    randomize(numVertices, edgeDensity)
    {
        this.model.randomize(numVertices, edgeDensity);
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
        this.view.onCanvasMouseMove.attach('hoverEntity', throttle(this.hoverEntity.bind(this), this.hoverThrottleDelay));
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
    },

    initModel()
    {
        this.model = new GraphModel(this.container.clientWidth, this.container.clientHeight, this.config);
    },

    initView()
    {
        this.view = new GraphView(this.container, this.model, this.config);
    },

    clear()
    {
        // this.model.clearGraph();
        this.view.destroyHandlers();
        this.clearMouseEvents();
        this.initModel();
        this.view.setConfig(this.config);
        this.view.setModel(this.model);
        this.view.initShapeMaps();
        this.view.initHandlers();
        this.createMode();
    },

    setConfig(config)
    {
        if(!this.config)
        {
            this.config = 
            {  
                backgroundColor:        [this.background],
                undirected:             true,
                weighted:               false,  
                vertexSize:             25,
                vertexOutlineSize:      1,
                vertexOutlineColor:     [this.primaryColor], 
                vertexTextColor:        [this.primaryColor],
                vertexHoverColor:       [this.secondaryColor],
                vertexSelectColor:      [this.secondaryColor],
                edgeWidth:              2,
                edgeBoxSize:            15,
                edgeCurveOffset:        100,
                edgeLineColor:          [this.primaryColor],
                edgeBoxOutlineColor:    ['transparent'],
                edgeBoxBackgroundColor: [this.background],
                edgeTextColor:          [this.primaryColor],
                edgeArrowColor:         [this.primaryColor],
                edgeHoverColor:         [this.secondaryColor],
                trackingEdgeColor:      [this.secondaryColor],
            };
        } 

        Object.assign(this.config, config); // these are arrays because it makes the colors pointers that cascade down and canvas render automatically extacts the values
        //from the array so if you decide to change the color you will need to access the array [0] and change that color

        const weighted = this.config.weighted;
        this.config.edgeBoxOutlineColor[0] = weighted ? '#fff' : 'transparent';
        this.config.edgeBoxBackgroundColor[0] = weighted ? '#fff' : 'transparent';
        this.config.edgeTextColor[0] = weighted ? '#000' : 'transparent';
        
        if(this.model) 
        {
            if(weighted) this.model.expandEdgeBoxes();
            else         this.model.shrinkEdgeBoxes();
        }
    }
};

export default Graph;