/**
 *  @author Jake Landowski
 *  11/10/18
 *  VertexFactory.test.js
 * 
 *  Unit tests for VertexFactory.js
 */

'use strict';

import VertexFactory from '../classes/graph/VertexFactory.js';

const vertexRadius = 30;
const centerX = 150;
const centerY = 250;
let vertexFactory, vertex, mockConfig, adjList;

beforeEach(() => 
{
    mockConfig = 
    {
        vertexSize: 25, 
        vertexOutlineSize: 5
    };

    adjList = {};
    vertexFactory = new VertexFactory(adjList);
    vertex = vertexFactory.create('A', centerX, centerY, mockConfig);
});

describe('Testing construction.', () =>
{
    test('Adjacency List reference in the Factory is the same' + 
    ' one passed in on construction.', () => 
    {
        expect(vertexFactory.adjList).toBe(adjList);
    });

    test('Internal config object should be initialized with ' +
    'empty object by default if not provided one on construction.', () => 
    {
        expect(vertexFactory.create('A', 0, 0).options).toEqual({});
    });

    test('Vertex fields are correct after contruction.', () => 
    {
        expect(vertex.id).toBe('A');
        expect(vertex.data).toBe('A');
        expect(vertex.options).toBe(mockConfig);
        expect(vertex.numEdges).toBe(0);
        expect(vertex.toNeighbors).toEqual(Object.create(null));
        expect(vertex.fromNeighbors).toEqual(Object.create(null));
    });

    test('Center, upperLeft, and lowerRight points are ' + 
    'correct after setPoints() is called.', () => 
    {
        expect(vertex.x).toBe(centerX);
        expect(vertex.y).toBe(centerY);

        expect(typeof vertex.upperLeft).toBe('object');
        expect(typeof vertex.lowerRight).toBe('object');
        expect(vertex.upperLeft.x).toBe(centerX - vertexRadius);
        expect(vertex.upperLeft.y).toBe(centerY - vertexRadius);
        expect(vertex.lowerRight.x).toBe(centerX + vertexRadius);
        expect(vertex.lowerRight.y).toBe(centerY + vertexRadius);
    });
});

describe('Testing unregister methods.', () =>
{   
    const unregisterTest = (method, neighbors) => 
    {
        vertex.numEdges = 1;
        vertex[neighbors]['A'] = 'A';
        vertex[neighbors]['B'] = 'B';
        vertex[method]('A');
    };

    const describeEachNeighbor = describe.each(
    [
        ['unregisterToNeighbor', 'toNeighbors'], 
        ['unregisterFromNeighbor', 'fromNeighbors']
    ]);

    describeEachNeighbor('Testing %s().', (method, neighbors) =>
    {
        beforeEach(() => 
        {
            unregisterTest(method, neighbors);
        });

        test(`Unregistering A from ${neighbors} successfully ` + 
        `deletes its reference.`, () => 
        {
            expect(vertex[neighbors]['A']).toBeUndefined();
        });

        test('Unregistering A decrements the internal numEdges field.', () => 
        {
            expect(vertex.numEdges).toBe(0);
        });

        test(`Unregistering A doesn't delete the reference to B in ${neighbors}.`, () => 
        {
            expect(vertex[neighbors]['B']).toBe('B');
        });
    });
});

describe('Testing _decrementEdges.', () =>
{
    test('Yeah, it good.', () => 
    {
        vertex.numEdges = 1;

        vertex._decrementEdges();
        expect(vertex.numEdges).toBe(0);

        vertex._decrementEdges();
        expect(vertex.numEdges).toBe(0);
    });
});

describe('Testing vertex reference methods.', () =>
{
    const pointTestSetup = (method, neighbors) => 
    {
        vertex.numEdges = 0;
        vertex[neighbors]['B'] = 'B';
        vertex[method]('A');
    };

    const describeEachNeighbor = describe.each(
    [   
        ['pointToNeighbor', 'toNeighbors'], 
        ['pointFromNeighbor', 'fromNeighbors']
    ]);

    describeEachNeighbor('Testing %s().', (method, neighbors) =>
    {
        beforeEach(() => 
        {
            pointTestSetup(method, neighbors);
        });

        test(`Symbol A should be in ${neighbors} after ${method}() call.`, () => 
        {
            expect(vertex[neighbors]['A']).toBe('A');        
        });

        test(`Internal numEdges should be 1 after pointing to a vertex.`, () => 
        {
            expect(vertex.numEdges).toBe(1);        
        });

        test(`Calling ${method}() a second time with A should have ` + 
        `the same results as last 2 tests.`, () => 
        {
            vertex[method]('A');
            expect(vertex[neighbors]['A']).toBe('A');
            expect(vertex.numEdges).toBe(1);
        });

        test(`Pointing to A shouldn't affect symbol B in ${neighbors}.`, () => 
        {        
            expect(vertex[neighbors]['B']).toBe('B');
        });
    });
});

describe('Testing forEachEdge()', () =>
{
    const fromSymbols = ['B', 'C', 'D', 'E'];
    const toSymbols = ['B', 'G', 'H'];
    const totalEdges = fromSymbols.length + toSymbols.length;
    const edgeIds = 
    [
        ...fromSymbols.map(symbol => `${symbol},A`), 
        ...toSymbols.map(symbol => `A,${symbol}`)
    ];
    
    const mockAdjList = 
    {
        edgeExists: jest.fn((from, to) => 
        {
            return (fromSymbols.includes(from) && to === 'A') ||
                   (toSymbols.includes(to)     && from === 'A');  
        }),

        getEdge: jest.fn((first, second) => `${first},${second}`)
    };

    const addSymbols = (symbols, neighbors) => 
    {
        symbols.forEach(symbol => neighbors[symbol] = symbol);
    };

    let mockCallBack;

    beforeEach(() => 
    {
        vertex = new VertexFactory(mockAdjList).create('A', 0, 0, mockConfig);
        
        addSymbols(fromSymbols, vertex.fromNeighbors);
        addSymbols(toSymbols, vertex.toNeighbors);
        vertex.fromNeighbors['F'] = 'F'; // shouldn't be looped over
        mockCallBack = jest.fn();
        vertex.forEachEdge(mockCallBack);
    });
    
    test(`Callback should have been called ${totalEdges} times.`, () => 
    {   
        expect(mockCallBack).toHaveBeenCalledTimes(totalEdges);
    });

    test(`Callback should have been called with parameters ` + 
    `${edgeIds.join(' | ')}`, () => 
    {   
        edgeIds.forEach(edge => 
            expect(mockCallBack).toHaveBeenCalledWith(edge));
        
        expect(mockCallBack).not.toHaveBeenCalledWith('F,A');
        expect(mockCallBack).not.toHaveBeenCalledWith('A,F');
    });
});
