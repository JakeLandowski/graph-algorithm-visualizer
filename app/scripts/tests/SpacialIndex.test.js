/**
 *  @author Jake Landowski
 *  11/13/18
 *  SpacialIndex.test.js
 * 
 *  Unit tests for SpacialIndex.js
 */

'use strict';

import SpacialIndex from '../classes/SpacialIndex.js';

// 0-99 | 100-199 | 200-299 | 300-399 | 400-499 
const spacialName = 'testSpacial';
const injectedCellsName = `${spacialName}_cells`;
const width  = 500;
const height = 500;
const ratio  = 5;
const cellWidth = width/ratio;
const cellHeight = height/ratio;
let spacial, oneCellEntity, twoCellEntity, 
    fourCellEntity, allCellEntity, entities;

    //=========== Helpers ===========//

const callOnAllEntities = (method) => 
{
    return () => entities.forEach(entity => spacial[method](entity))
};

const removeAllEntities = callOnAllEntities('remove');
const addAllEntities = callOnAllEntities('add');
const updateAllEntities = callOnAllEntities('update');

const spacialEntity = (id, ulx, uly, lrx, lry) =>
{
    return {
        id: id,
        upperLeft:  { x: ulx, y: uly }, 
        lowerRight: { x: lrx, y: lry } 
    };
}

    //=========== Tests ===========//

beforeEach(() => 
{
    spacial = new SpacialIndex(spacialName, cellWidth , cellHeight, ratio);
    oneCellEntity  = spacialEntity('A', 5, 15, 80, 90);
    twoCellEntity  = spacialEntity('B', 150, 120, 240, 180);
    fourCellEntity = spacialEntity('C', 100, 280, 280, 399);
    allCellEntity  = spacialEntity('D', 45, 25, 415, 450);
   
    entities = 
    [
        oneCellEntity,
        twoCellEntity,
        fourCellEntity,
        allCellEntity  
    ];
});

describe('Testing object construction', () => 
{
    test('Fields were set properly.', () => 
    {
        expect(spacial.cellWidth).toBe(cellWidth);
        expect(spacial.cellHeight).toBe(cellHeight);
        expect(spacial.cellRatio).toBe(ratio);   
    });

    test('internal index structure was created correctly.', () => 
    {
        expect(typeof spacial.index).toBe('object');
        expect(spacial.index.length).toBe(5);
        spacial.index.forEach(row => 
        {
            expect(row.length).toBe(5);
            row.forEach(hash =>
            { 
                expect(typeof hash).toBe('object');
            });
        });   
    });
});

describe('Testing add() method', () => 
{
    const addEntitiesThenTestCellsFor = (expectCallback) => 
    {
        addAllEntities();

        const expectForCells = (entity, fromX, toX, fromY, toY) => 
        {
            for(let row = fromX; row <= toX; row++)
            {
                for(let col = fromY; col <= toY; col++)
                {
                    expectCallback(entity, row, col);
                }
            }
        };

        expectForCells(oneCellEntity,  0, 0, 0, 0);
        expectForCells(twoCellEntity,  1, 2, 1, 1);
        expectForCells(fourCellEntity, 1, 2, 2, 3);
        expectForCells(allCellEntity,  0, 4, 0, 4);
    };

    test('Adding invalid object should throw error.', () => 
    {
        expect( () => spacial.add({}) ).toThrow();
        expect( () => spacial.add(spacialEntity(undefined, 0, 0, 0, 0)) ).toThrow();
    });

    test('All cells store appropriate entities after adding', () => 
    {
        const cellHasEntities = (entity, row, col) => 
        {
            expect(spacial.index[row][col][entity.id]).toBe(entity);
        };

        addEntitiesThenTestCellsFor(cellHasEntities);
    });

    test('All entities have appropriate cell references after adding', () => 
    {
        const entityHasCellRef = (entity, row, col) => 
        {
            expect(entity[injectedCellsName]).toContainEqual({x: row, y: col});
        };

        addEntitiesThenTestCellsFor(entityHasCellRef);
    });

    test(`Adding an entity with incorrect bounds doesn't break and ' + 
    'doesn't get cell references.`, () => 
    {
        const fakeEntity = spacialEntity('fake', -100, 0, -100, 0);
        spacial.add(fakeEntity);

        expect(fakeEntity[injectedCellsName]).toBeUndefined();
    });

    test(`Adding an entity with existing cell references doesn't add a new array.`, () => 
    {
        const fakeEntity = spacialEntity('fake', -100, 0, -100, 0);
        fakeEntity[injectedCellsName] = true;
        spacial.add(fakeEntity);

        expect(fakeEntity[injectedCellsName]).not.toEqual([]);
    });
});

describe('Testing remove() method', () => 
{
    beforeEach(() => 
    {
        addAllEntities();
        removeAllEntities();
    });

    test('remove() removes entities from internal cells.', () => 
    {
        entities.forEach(entity => 
        { 
            for(let i = 0; i < spacial.index.length; i++)
            {
                for(let j = 0; j < spacial.index[i].length; j++)
                {
                    expect(spacial.index[i][j][entity.id]).toBeUndefined();
                }
            }
        });
    });

    test('remove() removes injected cell references in the entities.', () => 
    {
        entities.forEach(entity => 
        { 
            expect(entity[injectedCellsName].length).toBe(0);
        });
    });

    test(`Removing an entity with incorrect cell references doesn't break`, () => 
    {
        const fakeEntity = {id: 'fake'};
        fakeEntity[injectedCellsName] = [{x: -1, y: -1}];

        spacial.remove(fakeEntity);

        expect(fakeEntity[injectedCellsName].length).toBe(0);
    });
});

describe('Testing update() method', () => 
{
    test('Correctly calls remove() then add()', () => 
    {
        const removeMethodSpy = jest.spyOn(spacial, 'remove');
        const addMethodSpy = jest.spyOn(spacial, 'add');

        updateAllEntities();

        expect(removeMethodSpy).toHaveBeenCalledTimes(4);
        expect(addMethodSpy).toHaveBeenCalledTimes(4);

        entities.forEach(entity => 
        {
            expect(removeMethodSpy).toHaveBeenCalledWith(entity);
            expect(addMethodSpy).toHaveBeenCalledWith(entity);
        });
    });
});

describe('Testing getEntity() method', () => 
{
    beforeEach(() => addAllEntities());

    test('Adding entities and clicking on an empty cell should return null.', () => 
    {
        expect(spacial.getEntity(415, 451)).toBe(null);
        expect(spacial.getEntity(550, 550)).toBe(null);
        expect(spacial.getEntity(4, 14)).toBe(null);
    });

    test('Adding entities and clicking on an full cell should retrieve a valid entity.', () => 
    {
        expect([oneCellEntity, allCellEntity]).toContain(spacial.getEntity(25, 50));
        expect([twoCellEntity, allCellEntity]).toContain(spacial.getEntity(180, 135));
        expect([fourCellEntity, allCellEntity]).toContain(spacial.getEntity(210, 399));
        expect(spacial.getEntity(405, 250)).toBe(allCellEntity);
    });
});

describe('Testing forEach on rows/cells.', () => 
{
    const checkRowOrColumn = (arr, marked, colIndex) => 
    {
        console.log(colIndex);
        arr.forEach(slot => 
        {
            if(typeof colIndex !== 'undefined') slot = slot[colIndex];
            expect(slot.marked).toBe(marked);
        });
    };

    const checkColumn = (marked, colIndex=0) => checkRowOrColumn(spacial.index, marked, colIndex);
    const checkRow    = (marked) => checkRowOrColumn(spacial.index[0], marked);

    describe.each(
    [
        ['forEachCellInRow', 'row',    checkRow,    (cell) => cell.marked    = true], 
        ['forEachCellInCol', 'column', checkColumn, (cell) => cell[0].marked = true]
    ])
    ('%s()', (method, thing, check, callback) => 
    {
        beforeEach(() => 
        {
            spacial[method](0, callback);
        });
        
        test(`should only touch each cell in a ${thing} given.`, () => 
        {
            check(true);
        });

        test(`should not touch any other ${thing}.`, () => 
        {
            for(let i = 1; i < spacial.index.length; i++)
            {
                check(false, i);
            }
        });
    });
});