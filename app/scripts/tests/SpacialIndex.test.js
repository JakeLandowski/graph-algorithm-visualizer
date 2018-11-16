/**
 *  @author Jake Landowski
 *  11/13/18
 *  SpacialIndex.test.js
 * 
 *  Unit tests for SpacialIndex.js
 */

import SpacialIndex from '../classes/SpacialIndex.js';

// 0-99 | 100-199 | 200-299 | 300-399 | 400-499 
const width  = 500;
const height = 500;
const ratio  = 5;
let spacial;

beforeEach(() => 
{
    spacial = new SpacialIndex('testSpacial', width/ratio , height/ratio, ratio);
});

describe('Testing SpacialIndex class', () => 
{
    test('construction works', () => 
    {
        expect(spacial.cellWidth).toBe(width);
        expect(spacial.cellHeight).toBe(height);
        expect(spacial.cellRatio).toBe(ratio);
        expect(typeof spacial.index).toBe('object');
        expect(spacial.index.length).toBe(5);
        spacial.index.forEach(hash => 
        {
            expect(typeof hash).toBe('object');
        });
    });

    function spacialEntity(id, ulx, uly, lrx, lry)
    {
        return {
            id: id,
            upperLeft: {x: ulx, y: uly}, 
            lowerRight: {x: lrx, y: lry} 
        };
    }

    test('add() works', () => 
    {
        expect( () => spacial.add({}) ).toThrow();

        const oneCellEntity  = 0;
        const twoCellEntity  = 1;
        const fourCellEntity = 2;
        const allCellEntity  = 3;
        const entities = 
        [ 
            spacialEntity('A', 5, 15, 80, 90),
            spacialEntity('B', 150, 120, 240, 180),
            spacialEntity('C', 100, 280, 280, 399),
            spacialEntity('D', 45, 25, 415, 450) 
        ];

        entities.forEach(entity => spacial.add(entity));

        const checkClicks = (entity, ulx, uly, lrx, lry) => 
        {
            for(let i = ulx; i <= lrx; i++)
            {
                for(let j = uly; i <= lry; j++)
                {
                    expect(spacial.index) 
                }
            }
        };
    });
});