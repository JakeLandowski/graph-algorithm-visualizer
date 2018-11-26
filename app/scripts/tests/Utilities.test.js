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

describe('Testing copy().', () => 
{
    test('Copied object is a new object with same properties.', () => 
    {
        const toBeCopied = {prop1: true, prop2: 'text', prop3: 5};
        expect(Utilities.copy(toBeCopied)).not.toBe(toBeCopied);
        expect(Utilities.copy(toBeCopied)).toEqual(toBeCopied);
    });
});

describe('Testing appendHtml().', () => 
{
    const appendingString = 'Blah';
    
    const callFunctionAndTestInnerHTML = (element) => 
    {
        Utilities.appendHtml(element, appendingString);
        expect(element.innerHTML).toBe(appendingString);
        return element;
    };

    test('Successfully appends a string to a DOM element.', () => 
    {
        callFunctionAndTestInnerHTML(document.createElement('div'));
    });

    test('Element without insertAdjacentHTML() method uses innerHTML property.', () => 
    {
        callFunctionAndTestInnerHTML({ innerHTML: '' });
    });

    test('Element with insertAdjacentHTML() method uses the method.', () => 
    {
        const mockWithMethod = callFunctionAndTestInnerHTML(
        { 
            innerHTML: '',
            insertAdjacentHTML: jest.fn(function(_, string){ this.innerHTML += string; })  
        });
        
        expect(mockWithMethod.insertAdjacentHTML).toHaveBeenCalledTimes(1);
        expect(mockWithMethod.insertAdjacentHTML).toHaveBeenCalledWith('beforeend', appendingString);
    });
});

describe.each([['calcAngle', 45, 15, 15],['calcFlippedAngle', 135, -15, -15]])
('Testing %s() with 2 points that have %d degree angle.', (fn, deg, x, y) => 
{
    test('Should calculate ~0.785398 radians.', () => 
    {
        expect(Utilities[fn](0, 0, x, y)).toBeCloseTo(0.785398, 6);
    });
});

describe('Testing toDegrees()', () => 
{
    test('0.785398 radians should convert to ~45 degrees.', () => 
    {
        expect(Utilities.toDegrees(0.785398)).toBeCloseTo(45, 2);
    });

    test('-0.785398 radians should convert to ~315 degrees.', () => 
    {
        expect(Utilities.toDegrees(-0.785398)).toBeCloseTo(315, 2);
    });
});

describe('Testing toRadians()', () => 
{
    test('45 degrees should convert to ~0.785398 radians.', () => 
    {
        expect(Utilities.toRadians(45)).toBeCloseTo(0.785398, 6);
    });
});

describe('Testing nonEnumerableProperty()', () => 
{
    let object;
    beforeEach(() => 
    {
        object = {};
        Utilities.nonEnumerableProperty(object, 'prop', 5);
    });

    test('Successfully assigns properties and nothing else.', () => 
    {
        expect(object).toBe(object);
        expect(object.prop).toBe(5);
    });

    test(`Property assign doesn't get looped over.`, () => 
    {
        for(const prop in object)
        {
            delete object[prop];
        }

        expect(object.prop).toBeDefined();
    });
});

describe('Testing isUndefined()', () => 
{
    test('Passing undefined returns true.', () => 
    {
        expect(Utilities.isUndefined(undefined)).toBe(true);
    });

    test('Passing 5 returns false.', () => 
    {
        expect(Utilities.isUndefined(5)).toBe(false);
    });
});