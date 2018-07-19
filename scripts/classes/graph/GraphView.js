/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

define(['classes/Event'], function(Event)
{
    console.log('GraphView Class loaded');

    const GraphView = function(model, two, config)
    {
        this.config = config;
        this.two = two;
        this.model = model; // attach events to the model
        // create events here that Graph class (controller) will reference
        // Graph class will then trigger data changes in model from user events 

        this.vertexGroup = this.two.makeGroup();
        this.vertexRenderingGroup = this.two.makeGroup();

        this.edgeGroup = this.two.makeGroup();
        this.edgeRenderingGroup = this.two.makeGroup();

        this.graphGroup = this.two.makeGroup();
        this.graphGroup.add(this.vertexGroup, this.vertexRenderingGroup,
                            this.edgeGroup,   this.edgeRenderingGroup);

        this.vertexMap = Object.create(null);
        this.edgeMap   = Object.create(null);

        this.onCanvasClicked   = new Event(this);
        this.onCanvasMouseDown = new Event(this);
        this.onCanvasMouseUp   = new Event(this);
        this.onCanvasMouseMove = new Event(this);

        this.initHandlers();
        
        // this.model.onSet.attach(function()
        // {
        //     this.show();
        // });

        // this.element.addEventListener('change', function(event)
        // {
        //     this.onChanged.notify(event.target.value);
        // });
    };

    GraphView.prototype = 
    {
        initHandlers()
        {
            // Vertex Added
            this.model.onVertexAdded.attach(function(_, params)
            {
                // Create new vertex shape and store it
                let vertex = this.two.makeCircle(params.x, params.y, this.config.vertexSize);
                vertex.fill = "#9911ff";
                vertex.linewidth = this.config.vertexOutlineSize;
                this.vertexGroup.add(vertex);

                this.vertexMap[params.data] = vertex;

            }.bind(this));

            // Edge Added
            this.model.onEdgeAdded.attach(function(_, params)
            {
                // Create new edge line and store it
                let edge = this.two.makeLine(0, 0, 200, 200);
                edge.stroke = "black";
                edge.linewidth = this.config.edgeWidth;

                this.edgeMap[ [params.to, params.from] ] = edge;
            
            }.bind(this));

            // Vertex Moved
            this.model.onVertexMoved.attach(function(_, params)
            {
                this.vertexMap[params.data].translate.x = params.x;
                this.vertexMap[params.data].translate.y = params.y;

            }.bind(this));
        },

        createOnClickHandler(event)
        {
            let onCanvasClicked = this.onCanvasClicked;

            return function(event)
            {
                onCanvasClicked.notify({x: event.offsetX, y: event.offsetY});
            };
        },

        createOnMouseDownHandler(event)
        {
            let onCanvasMouseDown = this.onCanvasMouseDown;

            return function(event)
            {
                onCanvasMouseDown.notify({x: event.offsetX, y: event.offsetY});
            };
        },

        createOnMouseUpHandler(event)
        {
            let onCanvasMouseUp = this.onCanvasMouseUp;

            return function(event)
            {
                onCanvasMouseUp.notify({x: event.offsetX, y: event.offsetY});
            };
        },

        createOnMouseMoveHandler(event)
        {
            let onCanvasMouseMove = this.onCanvasMouseMove;

            return function(event)
            {
                onCanvasMouseMove.notify({x: event.offsetX, y: event.offsetY});
            };
        },
    };

    return GraphView;
});