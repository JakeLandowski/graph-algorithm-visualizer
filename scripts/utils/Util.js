/**
 *  @author Jake Landowski
 *  7/16/18
 *  Util.js
 * 
 *  Contains rand(), stagger()
 */

'use strict';

export default {

    /**
     *  Inclusive random integer between min and max; 
     * 
     *  @param min  
     *  @param max 
     */
    rand(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     *  Stagger a callback to only trigger on last event call based on delay given 
     * 
     *  @param callback function to run at the last trigger
     *  @param delay    how long to wait before triggering
     */
    stagger(callback, delay)
    {
        let timer;

        return function(event)
        {
            if(timer) clearTimeout(timer);
            timer = setTimeout(callback, delay, event);
        };
    },

    throttle(fn, cooldown) 
    {
        let activate = true;

        return function()
        {
            if(activate) 
            {
                fn.apply(this, arguments);
                activate = false;
                setTimeout(function()
                {
                    activate = true;
                }, cooldown);
            }
        };
    },

    /**
     *  Creates a copy of an object
     * 
     *  @param object to copy 
     */
    copy(object)
    {
        return Object.assign({}, object);
    },

    appendHtml(element, htmlString)
    {
        if(element.insertAdjacentHTML)
            element.insertAdjacentHTML('beforeend', htmlString);
        else
            element.innerHTML += htmlString;
    },

    calcAngle(x1, y1, x2, y2)
    {
        return Math.atan2(-(y2 - y1), -(x2 - x1));
    },

    toDegrees(angle)   
    {
        angle *= (180 / Math.PI); 
        return angle < 0 ? angle + 360 : angle; 
    },

    toRadians(angle)   
    { 
        return angle * (Math.PI / 180); 
    }

}; 