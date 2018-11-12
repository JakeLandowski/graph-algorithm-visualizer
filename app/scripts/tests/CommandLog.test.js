/**
 *  @author Jake Landowski
 *  11/11/18
 *  CommandLog.test.js
 * 
 *  Unit tests for CommandLog.js
 */

import CommandLog from '../classes/CommandLog.js';

let log;

beforeEach(() => 
{
    log = new CommandLog();
});

describe('Testing CommandLog class', () => 
{
    test('construction works', () => 
    {
        expect(log.undoLog.length).toBe(0);
        expect(log.redoLog.length).toBe(0);
    });

    test('record() and recordPreserveRedo() throws work', () => 
    { 
        expect(() => 
        {
            log.record(3)
            log.recordPreserveRedo();

        }).toThrow();
    });

    test('record() and recordPreserveRedo() work', () => 
    { 
        const recordTest = (method) => 
        {
            log = new CommandLog();

            const redoCommand = {}; 
            log.redoLog.push(redoCommand);

            const commandOne = {'a':'a'};
            const commandTwo = {'b':'b'};
            log[method](commandOne);
            log[method](commandTwo);

            expect(log.undoLog[0]).toBe(commandOne);
            expect(log.undoLog[1]).toBe(commandTwo);

            if(method === 'record')
                expect(log.redoLog.length).toBe(0);
            else
                expect(log.redoLog[0]).toBe(redoCommand);
        };

        recordTest('record');
        recordTest('recordPreserveRedo');
    });

    test('undo() works', () => 
    { 
        expect(log.undo()).toBeUndefined();
        expect(log.redoLog[0]).toBeUndefined();

        const command = {};
        log.undoLog.push(command);

        expect(log.undo()).toBe(command);
        expect(log.redoLog[0]).toBe(command);
        expect(log.undo()).toBeUndefined();
    });

    test('redo() works', () => 
    { 
        expect(log.redo()).toBeUndefined();

        const commands = [{}, {}, {}];
        
        for(let i = 0; i < commands.length; i++)
            log.redoLog[i] = commands[i];

        for(let i = commands.length - 1; i >= 0; i--)
            expect(log.redo()).toBe(commands[i]);
        
        expect(log.redo()).toBeUndefined();
    });

    test('parse() works', () => 
    { 
        const command = {data: "blah"};
        log.record(command);

        const saved = log.serialize();

        const newLog = new CommandLog();
        newLog.parse(saved);

        expect(newLog.undoLog[0]).toEqual(command);
        expect(newLog).toEqual(log);
    });
});