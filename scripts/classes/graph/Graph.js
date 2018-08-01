/**
 *  @author Jake Landowski
 *  7/16/18
 *  Graph.js
 * 
 *  Class to represent a Graph in various forms, uses Model and View
 *  to handle rendering and data logic.
 */

define(['classes/graph/GraphModel', 
        'classes/graph/GraphView',
        'two'], 
        function(GraphModel, GraphView, Two)
{
    console.log('Graph Class loaded');

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
        this.model.undirected = this.config.undirected;

        this.view  = new GraphView(this.model, this.two, this.config);
        this.initSymbols();

        this.mouseEventsLogged = [];
    };

    Graph.prototype = 
    {

//====================== Initialization ===========================//

        initSymbols()
        {
            this.symbols = ['Z', 'Y', 'X', 'W', 'V', 'U', 
                            'T', 'S', 'R', 'Q', 'P', 'O', 
                            'N', 'M', 'L', 'K', 'J', 'I', 
                            'H', 'G', 'F', 'E', 'D', 'C', 
                            'B', 'A'];
            this.usedSymbols = Object.create(null);
        },

//====================== Graph Interaction Modes ===========================//

        vertexMode()
        {
            this.clearMouseEvents();

            this.view.onCanvasMouseClick.attach('clickVertex', function(_, params)
            {
                this.mouseEventsLogged.push('clickVertex');

                // see if clicked on vertex here using model
                // if clicked on vertex tell model to delete
                let vertex = this.model.vertexAt(params.x, params.y);

                if(vertex) // REMOVE
                {
                    this.model.dispatch
                    ({
                        type: 'removeVertex',
                        data: 
                        {
                            symbol: vertex.data,
                            x: params.x,
                            y: params.y,
                            neighbors: vertex.neighbors, // necessary for command log and undos
                            returnSymbol: this.returnSymbol.bind(this)
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
                            symbol: this.getSymbol(),
                            x: params.x,
                            y: params.y,
                            neighbors: Object.create(null), // necessary for command log and undos
                            returnSymbol: this.returnSymbol.bind(this)   
                        },
                        undo: 'removeVertex'
                    });
                }

            }.bind(this));

            this.view.onCanvasMouseDown.attach('dragVertex', function(_, params)
            {
                this.mouseEventsLogged.push('dragVertex');

                // locate vertex at location
                let vertex = this.model.vertexAt(params.x, params.y);

                if(vertex)
                {
                    let offsetX = vertex.x - params.x;
                    let offsetY = vertex.y - params.y;

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
                        this.model.updateVertexSpatial(vertex, point.x + offsetX, point.y + offsetY);
                    }

                    this.view.onCanvasMouseDrag.attach('stickVertexToCursor', stickVertexToCursor.bind(this));
                    this.view.onCanvasMouseUp.attach('releaseVertexFromCursor', releaseVertexFromCursor.bind(this));
                }

            }.bind(this));
        },

        edgeMode()
        {
            this.clearMouseEvents();

            this.view.onCanvasMouseClick.attach('createEdge', function(_, params)
            {
                this.mouseEventsLogged.push('createEdge');
                
                let vertex   = this.model.vertexAt(params.x, params.y);
                let selected = this.model.selectedVertex; 

                if(vertex)
                {
                    if(selected)
                    {
                        // If not the same vertex
                        // and edge doesnt exist
                        // create edge
                        if(selected.data !== vertex.data && 
                           !this.model.edgeExists(vertex.data, selected.data))
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

                        this.model.deselectVertex();
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
                    let edge = this.model.edgeAt(params.x, params.y);
                    
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
                this.view.onCanvasMouseClick.detach('releaseEdgeFromCursor');
                this.model.releaseTrackingEdge();
            }

            this.view.onCanvasMouseMove.attach('stickEdgeToCursor', stickEdgeToCursor.bind(this));
            this.view.onCanvasMouseClick.attach('releaseEdgeFromCursor', releaseEdgeFromCursor.bind(this));
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

        render()
        {
            this.two.update();
        },

        appendTo(container)
        {
            this.view.appendTo(container);
        },

        getSymbol()
        {
            let symbol = this.symbols.pop();
            this.usedSymbols[symbol] = symbol;
            return symbol;  
        },

        returnSymbol(symbol)
        {
            this.symbols.push(symbol);
            delete this.usedSymbols[symbol];
            console.log('returned');
        },

        clearMouseEvents()
        {
            let view = this.view;
            this.mouseEventsLogged.forEach(function(eventName)
            {
                view.onCanvasMouseClick.detach(eventName);
                view.onCanvasMouseMove.detach(eventName);
                view.onCanvasMouseDrag.detach(eventName);
                view.onCanvasMouseDown.detach(eventName);
                view.onCanvasMouseUp.detach(eventName);
            });
        },

//======== DEBUG =============/
showGraphData()
{
    console.log('Adjacency List:');
    console.log('[\n');
    for(let data in this.model.adjList)
    {
        let vertex = this.model.adjList[data];
        console.log('\t' + data + ' => [' + vertex.x + ', ' + vertex.y + ', ' + vertex.id + '],');
    }
    console.log(']');
}
//======== DEBUG =============/


    };

    return Graph;
 });