/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

'use strict';
define(function()
{
    const CommandLog = function()
    {
        this.log = [];
        this.undoHistory = [];

    }; // end constructor
    
    CommandLog.prototype = 
    {
        record(command)
        {
            this.log.push(command);
        },

        undo() 
        {
            const command = this.log.pop();
            if(command) this.undoHistory.push(command);
            return command;
        },
        
        redo()
        {
            return this.undoHistory.pop();
        }
    };

    return CommandLog;
});