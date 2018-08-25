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
        this.undoLog = [];
        this.redoLog = [];

    }; // end constructor
    
    CommandLog.prototype = 
    {
        record(command, clearRedo)
        {
            this.undoLog.push(command);
            if(clearRedo) this.redoLog = [];
        },

        undo() 
        {
            const command = this.undoLog.pop();
            if(command) this.redoLog.push(command);
            return command;
        },
        
        redo()
        {
            return this.redoLog.pop();
        },

        serialize()
        {
            return JSON.stringify(this);
        }
    };

    return CommandLog;
});