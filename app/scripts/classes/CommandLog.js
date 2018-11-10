/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphView.js
 * 
 *  Represents the rendering logic for the Graph class.
 */

'use strict';

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
        console.log(this);
        console.log(JSON.parse(JSON.stringify(this)));
        return JSON.stringify(this);
    },

    parse(jsonData)
    {
        const data = JSON.parse(jsonData);
        this.undoLog = data.undoLog;
        this.redoLog = data.redoLog;
    }
};

export default CommandLog;