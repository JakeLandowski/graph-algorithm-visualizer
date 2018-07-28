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
            let startX = this.cellRow(entity.upperLeft.x);
            let startY = this.cellCol(entity.upperLeft.y);
            let endX   = this.cellRow(entity.lowerRight.x);
            let endY   = this.cellCol(entity.lowerRight.y);

            // For removing from cells later
            if(!entity.cells) entity.cells = [];
            
            for(let x = startX; x <= endX; x++)
            {
                for(let y = startY; y <= endY; y++)
                {
                    let cell = this.cellFromIndex(x, y); 
                    
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
        update(entity, x, y)
        {
            this.remove(entity);
            this.add(entity, x, y);
        },

        /**
         *  See if this x/y touched a shape, if so return it, else return null
         */
        getEntity(x, y)
        {
            let cell = this.cell(x, y);

            for(let entityId in cell)
            {
                let entity     = cell[entityId];
                let upperLeft  = entity.upperLeft;
                let lowerRight = entity.lowerRight;
                
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

    return SpacialIndex;
});