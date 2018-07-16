/**
 *  @author Jake Landowski
 *  7/16/18
 *  ranodm.js
 * 
 *  Random integer function
 */

 /**
 *  Inclusive random integer between min and max; 
 * 
 *  @param min  
 *  @param max 
 */
function rand(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

define(function()
{
    return {
        rand: rand
    };
});