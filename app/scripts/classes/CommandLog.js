/**
 *  @author Jake Landowski
 *  7/16/18
 *  CommandLog.js
 * 
 *  Manages the recording of commands for undoing and redoing.
 */

'use strict';

/**
 * Class to manage recording of commands for undoing and redoing.
 * @class
 * @constructor
 */
const CommandLog = function()
{
    this.undoLog = [];
    this.redoLog = [];
};

CommandLog.prototype = 
{
    /**
     * Records a command for saving and future undoing, clears
     * the redo stack.
     * @param {object} command - command to log
     * @throws {TypeError} if command given is not an object 
     */
    record(command)
    {
        this._assertCommandGiven(command);
        this.undoLog.push(command);
        this.redoLog = [];
    },

    /**
     * Records a command for saving and future undoing, preserves
     * the redo stack.
     * @param {object} command - command to log
     * @throws {TypeError} if command given is not an object 
     */
    recordPreserveRedo(command)
    {
        this._assertCommandGiven(command);
        this.undoLog.push(command);
    },

    /**
     * Returns the last recorded command, and
     * if there was one, record it for future redos.
     * @returns {object} the last recorded command
     */
    undo() 
    {
        const command = this.undoLog.pop();
        if(command) this.redoLog.push(command);
        return command;
    },
    
    /**
     * Returns the last undone command.
     * @returns {object} the last undone command 
     */
    redo()
    {
        return this.redoLog.pop();
    },

    /**
     * Stringifies this CommandLog for saving.
     * @returns {string} the stringified data
     */
    serialize()
    {
        return JSON.stringify(this);
    },

    /**
     * Restores the state of this CommandLog 
     * from the given stringified CommandLog.
     * @param {string} jsonData 
     */
    parse(jsonData)
    {
        const data = JSON.parse(jsonData);
        this.undoLog = data.undoLog;
        this.redoLog = data.redoLog;
    },

    //=========== Private ===========//

    _assertCommandGiven(command)
    {
        if(typeof command !== 'object')
            throw new TypeError('Recorded Command in CommandLog was not an object.');
    }
};

export default CommandLog;