/**
 *  @author Jake Landowski
 *  7/16/18
 *  main.js
 * 
 *  App entry point.
 */

define(function()
{
    console.log('GraphModel Class loaded');

    const SpacialIndex = function(cellWidth, cellHeight, cellRatio)
    {
        this.cellWidth  = cellWidth;
        this.cellHeight = cellHeight;
        this.cellRatio  = cellRatio;
        this.index      = new Array(cellRatio);

        // Create 2D Grid of empty arrays
        for(let i = 0; i < cellRatio; i++)
        {
            this.index[i] = new Array(cellRatio);
            for(let j = 0; j < cellRatio; j++)
            {
                this.index[i][j] = [];
            }
        }
    };

    SpacialIndex.prototype = 
    {
        add(entity, x, y)
        {
            let cellsAdded = {};
            this.cell(x, y).push(entity);
        },

        remove(entity)
        {
            // need to use entity's size and find the cells its in based on that

            this.cell(entity.x, entity.y).filter(function(ent)
            {
                return ent.data === entity.data;
            });
        },

        update(entity, x, y)
        {
            this.remove(entity);
            this.add(entity, x, y);
        },

        cell(x, y)
        {
            // this will fail for the point at the max width, max height fyi
            return this.index[Math.floor(x / this.cellWidth)][Math.floor(y / this.cellHeight)];
        },
    };

    return SpacialIndex;
});