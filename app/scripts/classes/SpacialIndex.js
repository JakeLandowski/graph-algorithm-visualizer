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

import { isUndefined } from '../utils/Utilities.js';

/**
 * Class to manage a logical 2D grid of cells for
 * registering basic rectangle bounding boxes to 
 * query hit/click detection.
 * @class
 * @constructor
 * @param {string} label - the unique label for this spacial index
 * @param {number} cellWidth - width of each cell 
 * @param {number} cellHeight - height of each cell
 * @param {number} cellRatio - number of cells per row/column
 */
const SpacialIndex = function(label, cellWidth, cellHeight, cellRatio)
{
    this.cellsLabel = label + '_cells';
    this.cellWidth  = cellWidth;
    this.cellHeight = cellHeight;
    this.cellRatio  = cellRatio;
    this._initIndex();
};

SpacialIndex.prototype = 
{
    /**
     * Register the entity, registers to each cell it lies on. 
     * Requires an upperLeft/lowerRight bound set.
     * @param {object} entity - the object to register
     * @throws {TypeError} if entity given is missing 
     * upperLeft/lowerRight bounding box properties
     * @example
     * let entity = {
     *     id: 'vertex1',
     *     upperLeft: {x: 0, y: 0},
     *     lowerRight: {x: 10, y: 10}
     * };
     * //
     * spacialIndex.add(entity); 
     */
    add(entity)
    {
        this._assertBoundingBox(entity);

        const startX = this._cellRow(entity.upperLeft.x);
        const startY = this._cellCol(entity.upperLeft.y);
        const endX   = this._cellRow(entity.lowerRight.x);
        const endY   = this._cellCol(entity.lowerRight.y);

        const cellsProp = this.cellsLabel;

        // For removing from cells later
        if(!entity[cellsProp]) entity[cellsProp] = [];

        let cell;
        
        for(let x = startX; x <= endX; x++)
        {
            for(let y = startY; y <= endY; y++)
            {
                cell = this._cellFromIndex(x, y);
                
                if(cell) 
                {
                    cell[entity.id] = entity;
                    entity[cellsProp].push({x: x, y: y});
                }
            }   
        }
    },

    /**
     *  Unregister the entity in this SpacialIndex 
     */
    remove(entity)
    {
        let cells = entity[this.cellsLabel];

        if(cells)
        {
            let cell;
            let keep;

            cells = cells.filter(function(cellIndices)
            {
                cell = this._cellFromIndex(cellIndices.x, cellIndices.y);   
                if(cell && cell[entity.id]) 
                {
                    delete cell[entity.id];
                    keep = false;
                }

                return keep;

            }.bind(this));

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
        const cell = this._cell(x, y);

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

    //=========== Private ===========//

    _cell(x, y)
    {
        // this will fail for the point at the max width, max height fyi
        return this._cellFromIndex(this._cellRow(x), this._cellCol(y));
    },
    _cellFromIndex(x, y)
    {
        return x >= this.cellRatio || y >= this.cellRatio || x < 0 || y < 0 ? undefined : this.index[x][y];
    },

    _cellRow(x)
    {
        return Math.floor(x / this.cellWidth);
    },

    _cellCol(y)
    {
        return Math.floor(y / this.cellHeight);
    },

    _assertBoundingBox(entity)
    {
        if(isUndefined(entity.upperLeft)    ||
           isUndefined(entity.upperLeft.x)  ||
           isUndefined(entity.upperLeft.y)  ||
           isUndefined(entity.lowerRight)   ||
           isUndefined(entity.lowerRight.x) ||
           isUndefined(entity.lowerRight.y))
        {
            throw new TypeError('entity given is missing bounding properties.');
        }

        if(isUndefined(entity.id))
            throw new TypeError('entity given is missing a unique id property.');
    },

    _initIndex()
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
    }
};

export default SpacialIndex;