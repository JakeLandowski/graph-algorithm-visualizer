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

    const GraphView = function(model, two)
    {
        this.two = two;
        this.model = model; // attach events to the model
        // create events here that Graph class (controller) will reference
        // Graph class will then trigger data changes in model from user events 

        this.vertexGroup = this.two.makeGroup();
        this.edgeGroup = this.two.makeGroup();
        this.edgeRenderingGroup = this.two.makeGroup();
        
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

    };

    return GraphView;
});