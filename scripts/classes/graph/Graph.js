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
         'two'], function(GraphModel, GraphView, Two)
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
        this.model = new GraphModel();
        this.view  = new GraphView(this.model, this.two, this.config);
        this.initHandlers();
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
            this.view.onClickEvent.attach(function(_, params)
            {
                console.log(params);
                this.model.addVertex("test", params.x, params.y);
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

//====================== Getters ===========================//
        get vertexSize()
        {
            return this.config.vertexSize;
        },

        get vertexOutlineSize()
        {
            return this.config.vertexOutlineSize;
        },

        get edgeWidth()
        {
            return this.config.edgeWidth;
        },

//====================== Methods ===========================//
        start()
        {
            this.two.play();
        },

        appendTo(container)
        {
            this.container = container;
            this.two.appendTo(container);
            this.canvas = container.getElementsByTagName('canvas')[0];
            this.canvas.onclick = this.view.createOnClickHandler();
        },

        addVertex(data)
        {
            this.model.addVertex(data);
        },

        addEdge(to, from)
        {
            this.model.addEdge(to, from);
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