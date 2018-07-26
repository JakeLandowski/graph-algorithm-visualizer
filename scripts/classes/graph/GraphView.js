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
        // Shape size/styling information
        this.config = config;
        this.two = two;
        this.model = model; // attach events to the model
        // create events here that Graph class (controller) will reference
        // Graph class will then trigger data changes in model from user events 

//======== DEBUG =============/
if(window.DEBUG_MODE) 
{
    this.spacialIndexGridGroup = this.two.makeGroup();
    this.drawSpacialIndex();
}
//======== DEBUG =============/

        this.edgeGroup = this.two.makeGroup();
        this.edgeRenderingGroup = this.two.makeGroup();
        
        this.vertexGroup = this.two.makeGroup();
        this.vertexRenderingGroup = this.two.makeGroup();

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

    }; // end constructor

    GraphView.prototype = 
    {
        initHandlers()
        {
            // Vertex Added
            this.model.onVertexAdded.attach(function(_, params)
            {
                // Create new vertex shape and store it
                let vertex = this.two.makeCircle(params.x, params.y, this.config.vertexSize);
                vertex.fill = "#ff9a00";
                vertex.linewidth = this.config.vertexOutlineSize;
                this.vertexGroup.add(vertex);

                this.vertexMap[params.data] = vertex;

            }.bind(this));

            // Vertex Removed
            this.model.onVertexRemoved.attach(function(_, params)
            {
                console.log('removed a vertex : ' + params);

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

//======== DEBUG =============/
drawSpacialIndex()
{
    if(window.DEBUG_MODE)
    {
        let group = this.spacialIndexGridGroup;
        let two = this.two;
        
        // weird way to actually delete shapes
        group.children.forEach(function(shape)
        {
            shape.remove();
        });
        group.children = [];

        console.log(group.children);
        
        for(let x = 0; x < this.model.cellRatio; x++)
        {
            for(let y = 0; y < this.model.cellRatio; y++)
            {
                let width = this.model.cellWidth;
                let height = this.model.cellHeight;
                let centerX = x * width + width / 2;
                let centerY = y * height + height / 2; 
                let rect = this.two.makeRectangle(centerX, centerY, width, height);
                rect.noFill();
                group.add(rect);
                group.add(this.two.makeText('' + x + y, centerX - width / 3 - 10, centerY - height / 3 - 10));
            }   
        }
    }
}
//======== DEBUG =============/
 

    };

    return GraphView;
});