/**
 * @file Utilities.js : Contains utility functions
 * @author Jake Landowski <jakelandowski@gmail.com>
 * @version 1.0 
 * 7/16/18
 */

'use strict';

/**
 * Returns a random int between min and max given, inclusive.
 * @param {number} min - lower bound number
 * @param {number} max - upper bound number
 */
export function rand(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Stagger a callback to only trigger on last event call 
 * based on delay given. 
 * @param {function} callback - function to run at the last trigger
 * @param {number} delay - how long to wait before triggering
 * @returns {function} callback decorated with a setTimeout closure
 */
export function stagger(callback, delay)
{
    let timer;

    return function(event)
    {
        if(timer) clearTimeout(timer);
        timer = setTimeout(callback, delay, event);
    };
}

/**
 * Throttles a function to freeze after being called,
 * unfreezes when not called for the allotted time given.
 * @param {function} callback - the function to call 
 * @param {number} cooldown - time in milliseconds function
 * must not be called before it unfreezes
 * @returns {function} callback decorated with a setTimeout closure
 */
export function throttle(callback, freezeDuration) 
{
    let activate = true;

    return function()
    {
        if(activate) 
        {
            callback.apply(this, arguments);
            activate = false;
            setTimeout(function()
            {
                activate = true;
            }, freezeDuration);
        }
    };
}

/**
 * Abstract Object.assign() to copy an object.
 * @param {object} object - the object to copy
 * @returns {object} a copy of the object given 
 */
export function copy(object)
{
    return Object.assign({}, object);
}

/**
 * Appends a string of html to a given DOM element.
 * @param {Element} element - the DOM element to append to
 * @param {string} htmlString - the string of HTML to append
 */
export function appendHtml(element, htmlString)
{
    if(element.insertAdjacentHTML)
        element.insertAdjacentHTML('beforeend', htmlString);
    else
        element.innerHTML += htmlString;
}

/**
 * Calculates the angle between 2 points given in radians.
 * @param {number} x1 - point 1 x coordinates
 * @param {number} y1 - point 1 y coordinates
 * @param {number} x2 - point 2 x coordinates
 * @param {number} y2 - point 2 y coordinates
 * @returns {number} the angle in radians
 */
export function calcAngle(x1, y1, x2, y2)
{
    return Math.atan2((y2 - y1), (x2 - x1));
}

/**
 * Calculates the opposite angle between 2 points given 
 * in radians.
 * @param {number} x1 - point 1 x coordinates
 * @param {number} y1 - point 1 y coordinates
 * @param {number} x2 - point 2 x coordinates
 * @param {number} y2 - point 2 y coordinates
 * @returns {number} the angle in radians
 */
export function calcFlippedAngle(x1, y1, x2, y2)
{
    return Math.atan2(-(y2 - y1), -(x2 - x1));
}

/**
 * Converts radians to degrees.
 * @param {number} angle - angle in radians
 * @returns {number} the angle in degrees 
 */
export function toDegrees(angle)   
{
    angle *= (180 / Math.PI); 
    return angle < 0 ? angle + 360 : angle; 
}

/**
 * Converts degrees to radians.
 * @param {number} angle - angle in degrees
 * @returns {number} the angle in radians 
 */
export function toRadians(angle)   
{ 
    return angle * (Math.PI / 180); 
}

/**
 * Assigns a new property to an object given with
 * enumeration turned off, so iterators skip it.
 * @param {object} obj - the object to assign a new property 
 * @param {string} prop - the property key
 * @param {any} value - the property value
 */
export function nonEnumerableProperty(obj, prop, value)
{
    Object.defineProperty(obj, prop, {value: value, enumerable: false});
}

/**
 * Checks to see if a value given is undefined.
 * @param {any} thing - checked if undefined 
 * @returns {boolean} - true if thing was undefined
 */
export function isUndefined(thing)
{
    return typeof thing === 'undefined';
}