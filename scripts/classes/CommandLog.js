/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

define(function()
{
    console.log('CommandLog Class loaded');

    const CommandLog = function()
    {
        this.log  = [];

    }; // end constructor
    
    CommandLog.prototype = 
    {
        record(command)
        {
            this.log.push(command);
        },

        undo()
        {
            return this.log.pop();
        }
    };

    return CommandLog;
});