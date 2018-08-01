/**
 *  @author Jake Landowski
 *  7/16/18
 *  Util.js
 * 
 *  Contains rand(), stagger()
 */

'use strict';
define(function()
{
    return {

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

        /**
         *  Get {x, y} position of a given line, 
         *  true for ending point
         *  false for starting point.
         * 
         *  @param line 
         *  @param end true if wanting position for ending point
         */
        linePosition(line, end=true)
        {
            return {
                x: line.vertices[end ? 0 : 1].x + line.translation.x,
                y: line.vertices[end ? 0 : 1].y + line.translation.y
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
        }

    }; // end module
});