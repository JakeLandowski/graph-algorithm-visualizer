/**
 *  @author Jake Landowski
 *  7/22/18
 *  SpacialIndex.js
 * 
 *  2D Matrix Spatial Hash for click detection on shapes.
 *  Interface REQUIRES Objects given to have properties:
 *      upperLeft:  {x, y},
 *      lowerRIght: {x, y}
 */

'use strict';

const SpacialIndex = function(cellWidth, cellHeight, cellRatio)
{
    this.cellWidth  = cellWidth;
    this.cellHeight = cellHeight;
    this.cellRatio  = cellRatio;
    this.initIndex();
};

SpacialIndex.prototype = 
{
    /**
     *  Create the 2D Array representing the Grid of cell objects. 
     */
    initIndex()
    {
        this.index = new Array(this.cellRatio);

        // Create 2D Grid of empty arrays
        for(let i = 0; i < this.cellRatio; i++)
        {
            this.index[i] = new Array(this.cellRatio);
            for(let j = 0; j < this.cellRatio; j++)
            {
                this.index[i][j] = Object.create(null);
            }
        }
    },

    /**
     *  Register the entity in this spacialIndex, registers to each
     *  cell it lies on. Requires the rectangle shape to have an 
     *  upperLeft/lowerRight bound set.  
     */
    add(entity)
    {
        const startX = this.cellRow(entity.upperLeft.x);
        const startY = this.cellCol(entity.upperLeft.y);
        const endX   = this.cellRow(entity.lowerRight.x);
        const endY   = this.cellCol(entity.lowerRight.y);

        // For removing from cells later
        if(!entity.cells) entity.cells = [];

        let cell;
        
        for(let x = startX; x <= endX; x++)
        {
            for(let y = startY; y <= endY; y++)
            {
                cell = this.cellFromIndex(x, y); 
                
                if(cell) 
                {
                    cell[entity.id] = entity;
                    entity.cells.push(cell);
                }
            }   
        }
    },

    /**
     *  Unregister the entity in this SpacialIndex 
     */
    remove(entity)
    {
        if(entity.cells)
        {
            entity.cells.forEach(function(cell)
            {   
                if(cell[entity.id]) delete cell[entity.id];

            }.bind(this));

            entity.cells = [];
        }
    },

    /**
     *  Update the location of the entity in this SpacialIndex 
     */
    update(entity)
    {
        this.remove(entity);
        this.add(entity);
    },

    /**
     *  See if this x/y touched a shape, if so return it, else return null
     */
    getEntity(x, y)
    {
        const cell = this.cell(x, y);

        let entity, upperLeft, lowerRight;

        for(const entityId in cell)
        {
            entity     = cell[entityId];
            upperLeft  = entity.upperLeft;
            lowerRight = entity.lowerRight;
            
            // calculate point in rectangle here
            if(x > upperLeft.x && x < lowerRight.x &&
                y > upperLeft.y && y < lowerRight.y)
            {
                return entity;
            }
        }
        
        return null;
    },

    cell(x, y)
    {
        // this will fail for the point at the max width, max height fyi
        return this.index[this.cellRow(x)][this.cellCol(y)];
    },

    /**
     *  Get the cell located at x/y point given. Hashed 
     */
    cellFromIndex(x, y)
    {
        return x >= this.cellRatio || y >= this.cellRatio || x < 0 || y < 0 ? undefined : this.index[x][y];
    },

    /**
     *  Get a string id of the cell index at x/y 
     */
    cellId(x, y)
    {
        return '' + this.cellRow(x) + this.cellCol(y);
    },

    /**
     *  Hash an x coordinate to a cell index 
     */
    cellRow(x)
    {
        return Math.floor(x / this.cellWidth);
    },

    /**
     *  Hash an y coordinate to a cell index 
     */
    cellCol(y)
    {
        return Math.floor(y / this.cellHeight);
    }
};

export default SpacialIndex;