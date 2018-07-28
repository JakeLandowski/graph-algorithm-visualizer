/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

define(['classes/Event', 'utils/Util'], function(Event, Util)
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
        

        // For mapping data in model to their view shape equivalent
        this.vertexMap = Object.create(null);
        this.edgeMap   = Object.create(null);

        this.onCanvasClicked   = new Event(this);
        this.onCanvasMouseDown = new Event(this);
        this.onCanvasMouseUp   = new Event(this);
        this.onCanvasMouseMove = new Event(this);
        this.onCanvasMouseDrag = new Event(this);

        this.mouseMoved = false;
        this.mouseDown  = false;
        this.mouseMoveTimer = 0;
        this.mouseMoveDelay = 10;

        this.initHandlers();

    }; // end constructor
    
    GraphView.prototype = 
    {

//========= Model Listeners ===========//
        initHandlers()
        {
            // Vertex Added
            this.model.onVertexAdded.attach('createVertex', function(_, params)
            {
                // Create new vertex shape and store it
                let vertex = this.two.makeCircle(params.x, params.y, this.config.vertexSize);
                vertex.fill = "#ff9a00";
                vertex.linewidth = this.config.vertexOutlineSize;

                let text = this.two.makeText(params.data, params.x, params.y);
                this.vertexGroup.add(vertex, text);

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
                    let circle = this.vertexMap[params.data].circle;
                    let text   = this.vertexMap[params.data].text;
                    this.vertexGroup.remove(circle, text);
                    circle.remove();
                    text.remove();
                    delete this.vertexMap[params.data];
                }

            }.bind(this));

            // Vertex Moved
            this.model.onVertexMoved.attach('moveVertex', function(_, params)
            {
                if(this.vertexMap[params.data])
                {
                    this.vertexMap[params.data].circle.translation.set(params.x, params.y);
                    this.vertexMap[params.data].text.translation.set(params.x, params.y);
                }

            }.bind(this));

            // Edge Added
            this.model.onEdgeAdded.attach('createEdge', function(_, params)
            {
                // Create new edge line and store it
                let edge = this.two.makeLine(0, 0, 200, 200);
                edge.stroke = "black";
                edge.linewidth = this.config.edgeWidth;

                this.edgeMap[ [params.to, params.from] ] = edge;
            
            }.bind(this));
        },

//========= Event Handlers ===========//

        appendTo(container)
        {
            this.container = container;
            this.two.appendTo(container);
            this.canvas = container.getElementsByTagName('canvas')[0];
            this.initCanvasHandlers();
            this.initResize();
        },

        initCanvasHandlers()
        {
            // MAY NEVER NEED AGAIN BAKED INTO MOUSEUP
            // this.canvas.addEventListener('click', function(event)
            // {
            //     event.preventDefault();
            //     this.onCanvasClicked.notify({x: event.offsetX, y: event.offsetY});
            
            // }.bind(this));

            this.canvas.addEventListener('mousedown', function(event)
            {
                event.preventDefault(); 
                this.mouseMoved = false;
                this.mouseDown  = true;
                this.onCanvasMouseDown.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            this.canvas.addEventListener('mouseup', function(event)
            {
                event.preventDefault();
                this.onCanvasMouseUp.notify({x: event.offsetX, y: event.offsetY});
                this.mouseDown = false;
                
                if(!this.mouseMoved)
                    this.onCanvasClicked.notify({x: event.offsetX, y: event.offsetY});
            
            }.bind(this));

            this.canvas.addEventListener('mousemove', function(event)
            {
                event.preventDefault();
                if(this.mouseMoveTimer > this.mouseMoveDelay)
                {
                    console.log('mouse moved');
                    this.mouseMoved = true;

                    if(this.mouseDown)
                        this.onCanvasMouseDrag.notify({x: event.offsetX, y: event.offsetY});
    
                    this.onCanvasMouseMove.notify({x: event.offsetX, y: event.offsetY});
                }
                else this.mouseMoveTimer++;
            
            }.bind(this));

            this.canvas.addEventListener('mousemove', Util.stagger(function(event)
            {
                event.preventDefault();
                this.mouseMoveTimer = 0;
            
            }.bind(this), 50));
        },

        initResize()
        {
            window.addEventListener('resize', Util.stagger(function(event)
            {
                event.preventDefault();
                this.model.resize(this.two.width, this.two.height);

//======== DEBUG =============/
if(window.DEBUG_MODE)
{
    this.drawSpacialIndex();
}
//======== DEBUG =============/

            }.bind(this), 400));
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
                rect.stroke = '#fff';
                group.add(rect);
                let text = this.two.makeText('' + x + y, centerX - width / 3 - 10, centerY - height / 3 - 10);
                text.stroke = '#fff'; 
                group.add(text);
            }   
        }
    }
}
//======== DEBUG =============/
 

    };

    return GraphView;
});