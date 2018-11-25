/**
 *  @author Jake Landowski
 *  11/25/18
 *  Utilities.test.js
 * 
 *  Unit tests for Utilities.js
 */

import * as Utilities from '../utils/Utilities.js';

describe('Testing rand(min, max).', () => 
{
    test('rand(1, 1) returns 1 because the max is inclusive.', () => 
    {
        expect(Utilities.rand(1, 1)).toBe(1);
    });

    describe.each([[1], [5], [10], [25]])
    ('Testing random distribution for each amount of numbers.', (numSlots) => 
    {
        test(`Random distribution is approximately spread ` + 
        `out evenly among ${numSlots} slots.`, () => 
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

describe('Testing stagger(callback, delay).', () => 
{
    const executeCallbackEvery100ms = (staggerDelay, param) => 
    {
        const callback = jest.fn();
        const staggeredCallback = Utilities.stagger(callback, staggerDelay);

        let count = 0;
        let stop = 10;
        const interval = setInterval(() => 
        {
            staggeredCallback(param);
            count++;
            if(count == stop) clearInterval(interval);

        }, 100);

        jest.runAllTimers();

        return callback;
    };

    beforeEach(() => jest.useFakeTimers());

    test('Staggered callback with a 101ms delay threshold' + 
    ' only runs once after being called 10 times every 100ms.', () => 
    {
        const callback = executeCallbackEvery100ms(101);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('Staggered callback with a 99ms delay threshold' + 
    ' only runs 10 times after being called 10 times every 100ms.', () => 
    {
        const callback = executeCallbackEvery100ms(99);
        expect(callback).toHaveBeenCalledTimes(10);
    });

    test('Event param is successfully passed to wrapped callback.', () => 
    {
        const callback = executeCallbackEvery100ms(100, 'Theoretical Event');
        expect(callback).toHaveBeenCalledWith('Theoretical Event');
    });
});