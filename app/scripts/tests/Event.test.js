/**
 *  @author Jake Landowski
 *  11/11/18
 *  Event.test.js
 * 
 *  Unit tests for Event.js
 */

import Event from '../classes/Event.js';

let event, sender;

beforeEach(() => 
{
    sender = {};
    event = new Event(sender);
});

describe('Testing Event class', () => 
{
    test('construction works', () => 
    {
        expect(event.enabled).toBe(true);
        expect(event.canNotify).toBe(true);
        expect(Object.keys(event.listeners).length).toBe(0);
        expect(event.sender).toBe(sender);
    });

    test('attach() works', () => 
    {
        expect(event.listeners['name']).toBeUndefined();

        const mockCallback = jest.fn();
        event.attach('name', mockCallback);

        expect(event.listeners['name']).toBe(mockCallback);
    });

    test('detach() works', () => 
    {
        const mockCallback = jest.fn();
        event.attach('name', mockCallback);
        
        event.detach('doesnt exist');
        expect(event.listeners['name']).toBe(mockCallback);

        event.detach('name');
        expect(event.listeners['name']).toBeUndefined();
    });

    test('notify() works', () => 
    {
        const args = {};

        const mockCallbacks = 
        [
            jest.fn(),
            jest.fn(),
            jest.fn()
        ];

        for(let i = 0; i < mockCallbacks.length; i++)
            event.attach(i, mockCallbacks[i]);
        
        event.notify(args);

        mockCallbacks.forEach((callback) => 
        {
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(sender, args);
        });
    });

    function attachMock()
    {
        const mockCallback = jest.fn();
        event.attach('name', mockCallback);
        return mockCallback;
    }

    test('disable() works', () => 
    {
        const mockCallback = attachMock();

        event.notify(sender, {});

        expect(mockCallback).toHaveBeenCalledTimes(1);

        event.disable();
        event.notify(sender, {});

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('enable() works', () => 
    {
        const mockCallback = attachMock();
        
        event.notify(sender, {});
        
        event.disable();
        event.notify(sender, {});
        
        event.enable();
        event.notify(sender, {});

        expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    test('stopNextNotify() works', () => 
    {
        const mockCallback = attachMock();
        
        event.notify(sender, {});

        event.stopNextNotify();

        event.notify(sender, {});
        event.notify(sender, {});

        expect(mockCallback).toHaveBeenCalledTimes(2);
    });
});