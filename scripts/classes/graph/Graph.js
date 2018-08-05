/**
 *  @author Jake Landowski
 *  7/16/18
 *  Graph.js
 * 
 *  Class to represent a Graph in various forms, uses Model and View
 *  to handle rendering and data logic.
 */

'use strict';
define(['classes/graph/GraphModel', 
        'classes/graph/GraphView',
        'two'], 
        function(GraphModel, GraphView, Two)
{
    const Graph = function(config={})
    {
        this.two = new Two
        ({
            fullscreen: config.fullscreen || false,
            type:       config.type       || Two.Types.canvas,
            width:      config.width      || 100,
            height:     config.height     || 100
        });

        this.config = 
        {
            undirected:        config.undirected        || true,
            vertexSize:        config.vertexSize        || 25,
            vertexOutlineSize: config.vertexOutlineSize || 3,
            edgeWidth:         config.edgeWidth         || 5,
            edgeBoxSize:       config.edgeBoxSize       || 50
        };

        this.model = new GraphModel(this.two.width, this.two.height, this.config);
        this.view  = new GraphView(this.model, this.two, this.config);

        this.symbols = ['Z', 'Y', 'X', 'W', 'V', 'U', 
                        'T', 'S', 'R', 'Q', 'P', 'O', 
                        'N', 'M', 'L', 'K', 'J', 'I', 
                        'H', 'G', 'F', 'E', 'D', 'C', 
                        'B', 'A'];
                        
        this.mouseEventsLogged = [];
    };

    Graph.prototype = 
    {

//====================== Graph Interaction Modes ===========================//

        vertexMode()
        {
            this.clearMouseEvents();

            this.mouseEventsLogged.push('clickVertex');

            this.view.onCanvasMouseClick.attach('clickVertex', function(_, params)
            {
                // see if clicked on vertex here using model
                // if clicked on vertex tell model to delete
                const vertex = this.model.vertexAt(params.x, params.y);

                if(vertex) // REMOVE
                {
                    this.model.dispatch
                    ({
                        type: 'removeVertex',
                        data: 
                        {
                            symbol:        vertex.data,
                            x:             params.x,
                            y:             params.y,
                            toNeighbors:   Object.keys(vertex.toNeighbors), // FOR UNDO
                            fromNeighbors: Object.keys(vertex.fromNeighbors), // FOR UNDO
                            returnSymbol:  this.returnSymbol.bind(this),
                            getSymbol:     this.getSymbol.bind(this)
                        },
                        undo: 'addVertex',
                    });
                }
                else if(this.symbols.length > 0) // ADD
                {   
                    this.model.dispatch
                    ({ 
                        type: 'addVertex',
                        data: 
                        {
                            symbol:        this.peekSymbol(),
                            x:             params.x,
                            y:             params.y,
                            toNeighbors:   [], // FOR UNDO
                            fromNeighbors: [], // FOR UNDO
                            returnSymbol:  this.returnSymbol.bind(this),   
                            getSymbol:     this.getSymbol.bind(this)
                        },
                        undo: 'removeVertex'
                    });
                }

            }.bind(this));
            
            this.mouseEventsLogged.push('dragVertex');

            this.view.onCanvasMouseDown.attach('dragVertex', function(_, params)
            {
                // locate vertex at location
                const vertex = this.model.vertexAt(params.x, params.y);

                if(vertex)
                {
                    const offsetX = vertex.x - params.x;
                    const offsetY = vertex.y - params.y;

                    function stickVertexToCursor(_, point)
                    {
                        // Mostly visual move
                        this.model.moveVertex(vertex, point.x + offsetX, point.y + offsetY);
                    }

                    function releaseVertexFromCursor(_, point)
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

            }.bind(this));
        },

        edgeMode()
        {
            this.clearMouseEvents();

            this.mouseEventsLogged.push('createEdge');

            this.view.onCanvasMouseClick.attach('createEdge', function(_, params)
            {
                
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
                           !this.model.adjList.edgeExists(vertex.data, selected.data))
                        {
                            this.model.dispatch
                            ({
                                type: 'addEdge',
                                data: 
                                {
                                    from: selected.data, 
                                    to:   vertex.data,
                                },
                                undo: 'removeEdge'
                            });
                        }

                        // Edge hopping
                        this.model.deselectVertex();
                        this.model.selectVertex(vertex);
                        this.trackEdgeToCursor(params.x, params.y);
                    }
                    else
                    {
                        this.model.selectVertex(vertex);
                        this.trackEdgeToCursor(params.x, params.y);
                    }
                }
                else if(selected)
                {
                    this.model.deselectVertex();
                }
                else
                {
                    const edge = this.model.edgeAt(params.x, params.y);
                    
                    if(edge)
                    {
                        this.model.dispatch
                        ({
                            type: 'removeEdge',
                            data: 
                            {
                                from: edge.from, 
                                to:   edge.to,
                            },
                            undo: 'addEdge'
                        });
                    }
                }

            }.bind(this));
        },

        trackEdgeToCursor(x, y)
        {
            this.model.addTrackingEdge(x, y);

            function stickEdgeToCursor(_, point)
            {
                this.model.updateTrackingEdge(point.x, point.y);
            }

            function releaseEdgeFromCursor(_, point)
            {
                this.view.onCanvasMouseMove.detach('stickEdgeToCursor');
                this.model.onVertexDeselected.detach('releaseEdgeFromCursor');
                this.model.releaseTrackingEdge();
            }

            this.view.onCanvasMouseMove.attach('stickEdgeToCursor', stickEdgeToCursor.bind(this));
            this.model.onVertexDeselected.attach('releaseEdgeFromCursor', releaseEdgeFromCursor.bind(this));
        },

//====================== Setters ===========================//

        set vertexSize(size)
        {
            this.config.vertexSize = size < 1 ? 1 : size;
        },

        set vertexOutlineSize(size)
        {
            this.config.vertexOutlineSize = size < 1 ? 1 : size;
        },

        set edgeWidth(width)
        {
            this.config.edgeWidth = width < 1 ? 1 : width;
        },

//====================== Methods ===========================//

        start()
        {
            this.two.play();
            this.vertexMode();
        },

        undo()
        {
            this.model.undo();
        },

        redo()
        {
            this.model.redo();
        },

        // render()
        // {
        //     this.two.update();
        // },

        appendTo(container)
        {
            this.view.appendTo(container);
        },

        getSymbol()
        {
            return this.symbols.pop();  
        },

        peekSymbol()
        {
            return this.symbols[this.symbols.length - 1];
        },

        returnSymbol(symbol)
        {
            this.symbols.push(symbol);
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
    };

    return Graph;
 });