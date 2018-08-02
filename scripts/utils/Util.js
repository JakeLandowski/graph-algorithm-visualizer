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
         *  Get end {x, y} point of a given line.
         * 
         *  @param line
         */
        lineStartPoint(line)
        {
            return {
                x: line.vertices[0].x + line.translation.x,
                y: line.vertices[0].y + line.translation.y
            };
        },

        /**
         *  Get start {x, y} point of a given line.
         * 
         *  @param line
         */
        lineEndPoint(line)
        {
            return {
                x: line.vertices[1].x + line.translation.x,
                y: line.vertices[1].y + line.translation.y
            };
        },

        /**
         *  Set the end {x, y} point of a given line.
         * 
         *  @param line
         */
        setLineEndPoint(line, x, y)
        {
            line.vertices[1].x = x - line.translation.x;
            line.vertices[1].y = y - line.translation.y;
        },

        /**
         *  Set the start {x, y} point of a given line.
         * 
         *  @param line
         */
        setLineStartPoint(line, x, y)
        {
            line.vertices[0].x = x - line.translation.x;
            line.vertices[0].y = y - line.translation.y;
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