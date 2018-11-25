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
 * @returns {function} - callback decorated with a setTimeout closure
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
 * Throttles a function to only be called once per however many
 * milliseconds is given.
 * @param {*} callback - the function to run 
 * @param {*} cooldown - the amount of time before callback 
 * can be ran again
 */
export function throttle(callback, cooldown) 
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
            }, cooldown);
        }
    };
}

/**
 *  Creates a copy of an object
 * 
 *  @param object to copy 
 */
export function copy(object)
{
    return Object.assign({}, object);
}

export function appendHtml(element, htmlString)
{
    if(element.insertAdjacentHTML)
        element.insertAdjacentHTML('beforeend', htmlString);
    else
        element.innerHTML += htmlString;
}

export function calcAngle(x1, y1, x2, y2)
{
    return Math.atan2(-(y2 - y1), -(x2 - x1));
}

export function toDegrees(angle)   
{
    angle *= (180 / Math.PI); 
    return angle < 0 ? angle + 360 : angle; 
}

export function toRadians(angle)   
{ 
    return angle * (Math.PI / 180); 
}

export function nonEnumerableProperty(obj, prop, value)
{
    Object.defineProperty(obj, prop, {value: value, enumerable: false});
}

export function isUndefined(thing)
{
    return typeof thing === 'undefined';
}