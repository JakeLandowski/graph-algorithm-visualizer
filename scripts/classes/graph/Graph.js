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

    const Graph = function(twoConfig={})
    {
        this.two = new Two
        ({
            fullscreen: twoConfig.fullscreen || false,
            type:       twoConfig.type       || Two.Types.canvas,
            width:      twoConfig.width      || 100,
            height:     twoConfig.height     || 100
        });

        this.config = Object.create(null); // non-inheriting object
        this.initConfig();
        
        this.model = new GraphModel(this.two.width, this.two.height);
        this.view  = new GraphView(this.model, this.two, this.config);
        this.initHandlers();
        
        this.symbols = ['A', 'B', 'C', 'D', 'E', 
                        'F', 'G', 'H', 'I', 'J', 
                        'K', 'L', 'M', 'N', 'O', 
                        'P', 'Q', 'R', 'S', 'T', 
                        'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.symbolCounter = 0;
    };

    Graph.prototype = 
    {

//====================== Initialization ===========================//
        initConfig()
        {
            this.config.vertexSize =  12;
            this.config.vertexOutlineSize =  3;
            this.config.edgeWidth = 1;
        },

        initHandlers()
        {
            // On Click
            this.view.onCanvasClicked.attach(function(_, params)
            {
                console.log(params);
                if(this.symbolCounter < this.symbols.length)
                    this.model.addVertex(this.symbols[this.symbolCounter++], params.x, params.y);

            }.bind(this));

            // On Mouse Down
            this.view.onCanvasMouseDown.attach(function(_, params)
            {
                console.log('mouse down');
                console.log(this.model.spacialIndex.cell(params.x, params.y));

            }.bind(this));

            // On Mouse Up
            this.view.onCanvasMouseUp.attach(function(_, params)
            {
                console.log('mouse up');

            }.bind(this));

            // On Mouse Move
            this.view.onCanvasMouseMove.attach(function(_, params)
            {
                console.log('mouse move');

            }.bind(this));
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
        },

        render()
        {
            this.two.update();
        },

        appendTo(container)
        {
            this.container = container;
            this.two.appendTo(container);
            this.canvas = container.getElementsByTagName('canvas')[0];
            this.initCanvasHandlers();
        },
        
        initCanvasHandlers()
        {
            this.canvas.addEventListener('click',     this.view.createOnClickHandler());
            this.canvas.addEventListener('mousedown', this.view.createOnMouseDownHandler());
            this.canvas.addEventListener('mouseup',   this.view.createOnMouseUpHandler());
            this.canvas.addEventListener('mousemove', this.view.createOnMouseMoveHandler());
        },

        // Just for testing
        showGraphData()
        {
            console.log('Adjacency List:');
            console.log('[\n');
            for(let data in this.model.adjList)
            {
                console.log('\t' + data + ' => [' + this.model.adjList[data] + '],');
            }
            console.log(']');
        }
        // methods
    };

    return Graph;
 });