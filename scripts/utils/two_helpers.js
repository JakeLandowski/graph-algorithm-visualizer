/**
 *  @author Jake Landowski
 *  7/16/18
 *  two_helpers.js
 * 
 *  Helper functions for abstracting confusing Two.js details.
 */

 /**
 *  Get {x, y} position of a given line, 
 *  true for starting point
 *  false for ending point.
 * 
 *  @param line 
 *  @param start true if wanting position for starting point
 */
function linePosition(line, start=true)
{
    return {
        x: line.vertices[start ? 0 : 1].x + line.translation.x,
        y: line.vertices[start ? 0 : 1].y + line.translation.y
    };
}

define(function()
{
    return {
        linePosition: linePosition
    };
});