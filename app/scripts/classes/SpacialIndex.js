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

        let cell;
        
        for(let x = startX; x <= endX; x++)
        {
            for(let y = startY; y <= endY; y++)
            {
                cell = this._cellFromIndex(x, y);

                if(cell) 
                {
                    this._injectCellsArray(entity);
                    cell[entity.id] = entity;
                    entity[this.cellsLabel].push({x: x, y: y});
                }
            }   
        }
    },

    /**
     * Unregisters a previously registered entity. Cleans up
     * the injected cell reference in the entity object. 
     * @param {object} entity - the registered entity
     * @example
     * spacialIndex.remove(entity);
     */
    remove(entity)
    {
        let cells = entity[this.cellsLabel];

        if(cells)
        {
            let cell, exists;
            
            entity[this.cellsLabel] = cells.filter(function(cellIndices)
            {
                cell = this._cellFromIndex(cellIndices.x, cellIndices.y);
                exists = cell && cell[entity.id]; 
                if(exists)
                {
                    delete cell[entity.id];
                }
                
                return false;
                
            }.bind(this));
        }
    },

    /**
     * Updates an existing entity by removing it and adding it again
     * for when the size constraints of this SpacialIndex has changed.
     * @param {object} entity - the entity being updated 
     */
    update(entity)
    {
        this.remove(entity);
        this.add(entity);
    },

    /**
     * Returns the entity residing on the x, y point given. 
     * If multiple entities exist at this point, returns the 
     * first entity iterated on.
     * @param {number} x - x coordinate in spacial grid 
     * @param {number} y - y coordinate in spacial grid
     * @returns {object} the entity at this point
     * @example
     * let spacialIndex = new SpacialIndex()
     * let entity = {
     *     id: 'vertex1',
     *     upperLeft: {x: 0, y: 0},
     *     lowerRight: {x: 10, y: 10}
     * };
     * //
     * spacialIndex.add(entity);
     * //
     * console.log(spacialIndex.get(5, 5)); // entity
     * console.log(spacialIndex.get(11, 5)); // null
     */
    getEntity(x, y)
    {
        const cell = this._cell(x, y);

        let entity;

        for(const entityId in cell)
        {
            entity = cell[entityId];
            
            if(this._pointInsideBounds(entity, x, y))
            {
                return entity;
            }
        }
        
        return null;
    },

    //=========== Private ===========//

    _pointInsideBounds(entity, x, y)
    {
        return x >= entity.upperLeft.x && x <= entity.lowerRight.x &&
               y >= entity.upperLeft.y && y <= entity.lowerRight.y;
    },

    _cell(x, y)
    {
        return this._cellFromIndex(this._cellRow(x), this._cellCol(y));
    },
    _cellFromIndex(row, col)
    {
        return row >= this.cellRatio || col >= this.cellRatio || row < 0 || col < 0 ? undefined : this.index[row][col];
    },

    _cellRow(x)
    {
        return Math.floor(x / this.cellWidth);
    },

    _cellCol(y)
    {
        return Math.floor(y / this.cellHeight);
    },

    _injectCellsArray(entity)
    {
        if(!entity[this.cellsLabel]) entity[this.cellsLabel] = [];
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