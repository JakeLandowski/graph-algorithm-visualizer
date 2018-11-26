/**
 *  @author Jake Landowski
 *  11/25/18
 *  Utilities.test.js
 * 
 *  Unit tests for Utilities.js
 */

import * as Utilities from '../utils/Utilities.js';

describe('Testing rand().', () => 
{
    test('rand(1, 1) returns 1 because the max is inclusive.', () => 
    {
        expect(Utilities.rand(1, 1)).toBe(1);
    });

    describe.each([[1], [5], [10], [25]])
    ('Random distribution is approximately spread out evenly when', (numSlots) => 
    {
        test(`Testing with ${numSlots} slots`, () => 
        {
            const numTries = 100000
            const slots = new Array(numSlots).fill(0);
    
            for(let i = 0; i < numTries; i++)
            {
                slots[Utilities.rand(0, numSlots-1)]++;
            }
    
            slots.forEach((count) => 
            {
                expect(count).toBeGreaterThanOrEqual(numTries/numSlots - numTries/100);
                expect(count).toBeLessThanOrEqual(numTries/numSlots + numTries/100);
            });
        });
    });
});

describe('Testing callback utility functions.', () => 
{
    const executeCallbackEvery100ms = (delay, decoration, param) => 
    {
        const callback = jest.fn();
        const decoratedCallback = Utilities[decoration](callback, delay);

        let count = 0;
        let stop = 10;
        const interval = setInterval(() => 
        {
            decoratedCallback(param);
            count++;
            if(count == stop) clearInterval(interval);

        }, 100);

        jest.runAllTimers();

        return callback;
    };

    beforeEach(() => jest.useFakeTimers());
    
    test('Event param is successfully passed to staggered callback.', () => 
    {
        const callback = executeCallbackEvery100ms(100, 'stagger', 'Theoretical Event');
        expect(callback).toHaveBeenCalledWith('Theoretical Event');
    });

    test('Event param is successfully passed to throttled callback.', () => 
    {
        const callback = executeCallbackEvery100ms(100, 'throttle', 'Theoretical Event');
        expect(callback).toHaveBeenCalledWith('Theoretical Event');
    });
    
    const describeEachCallbackTest = describe.each(
    [
        ['stagger', 101, 1],  ['stagger', 99, 10],
        ['throttle', 99, 10], ['throttle', 100, 1], ['throttle', 500, 1]
    ]);
    
    describeEachCallbackTest('Called 10 times every 100ms', 
    (decoration, delay, timesRan) => 
    {
        test(`${decoration} callback with a ${delay}ms cooldown ` + 
        `was called ${timesRan} times.`, () => 
        {
            const callback = executeCallbackEvery100ms(delay, 'throttle');
            expect(callback).toHaveBeenCalledTimes(timesRan);
        });
    });
});
