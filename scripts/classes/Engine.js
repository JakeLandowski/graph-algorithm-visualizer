/**
 *  @author Jake Landowski
 *  7/16/18
 *  Engine.js
 * 
 *  Runs the logic for the graph logic and update loop.
 */

define(['two'], function(Two)
{
    let two = new Two
    ({
        fullscreen: true,
        type: Two.Types.canvas
    });
    
    const Engine = 
    {
        updates: [],
        two : two,

        init: function()
        {
            this.main = document.getElementById('main');
            two.appendTo(main);
            this.canvas = main.getElementsByTagName('canvas')[0];
        },

        play: function()
        {
            for(let updater in updaters)
            {
                this.two.bind('update', updater);
            }
            this.two.play(); 
        },

        assign: function(updater)
        {
            this.updates.push(updater);
        },

        graphInit: function()
        {
            this.vertexSize =  12;
            this.vertexOutlineSize =  vertexSize / 4;
            this.edgeWidth =  vertexOutlineSize / 4;

            this.edgeRenderingGroup =  this.two.makeGroup();
            this.edgeGroup =  this.two.makeGroup();
            this.edges =  edgeGroup.children;

            this.vertexGroup =  this.two.makeGroup();
            this.vertices =  vertexGroup.children;
        }
    };

    return Engine;
});