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

        remove(entity)
        {
            if(entity.cells)
            {
                entity.cells.forEach(function(cell)
                {   
                    if(cell[entity.id])
                    {
                        delete cell[entity.id];
                    }

                }.bind(this));

                entity.cells = [];
            }
        },

        update(entity, x, y)
        {
            this.remove(entity);
            this.add(entity, x, y);
        },

        getEntity(x, y)
        {
            let cell = this.cell(x, y);

            for(let entityId in cell)
            {
                let entity     = cell[entiyId];
                let upperLeft  = entity.upperLeft;
                let lowerRight = entity.lowerRight;
                
                // calculate point in rectangle here
                if(x > upperLeft.x && x < lowerRight.x &&
                   y > upperLeft.y && y < lowerRight.y)
                {
                    return entity;
                }
            } 
        },

        cell(x, y)
        {
            // this will fail for the point at the max width, max height fyi
            return this.index[this.cellRow(x)][this.cellCol(y)];
        },

        cellFromIndex(x, y)
        {
            return x >= this.cellRatio || y >= this.cellRatio ? undefined : this.index[x][y];
        },

        cellId(x, y)
        {
            return '' + this.cellRow(x) + this.cellCol(y);
        },

        cellRow(x)
        {
            return Math.floor(x / this.cellWidth);
        },

        cellCol(y)
        {
            return Math.floor(y / this.cellHeight);
        }
    };

    return SpacialIndex;
});