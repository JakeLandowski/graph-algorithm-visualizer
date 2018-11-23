/**
 *  @author Jake Landowski
 *  11/10/18
 *  VertexFactory.test.js
 * 
 *  Unit tests for VertexFactory.js
 */

import VertexFactory from '../classes/graph/VertexFactory.js';

let vertexFactory, vertex, mockConfig, adjList;

beforeEach(() => 
{
    mockConfig = 
    {
        vertexSize: 0, 
        vertexOutlineSize: 0
    };

    adjList = {};
    vertexFactory = new VertexFactory(adjList);
    vertex = vertexFactory.create('A', 0, 0, mockConfig);
});

describe('Testing construction.', () =>
{
    test('Adjacency List reference in the Factory is the same' + 
    ' one passed in on construction.', () => 
    {
        expect(vertexFactory.adjList).toBe(adjList);
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
        expect(vertex.x).toBe(0);
        expect(vertex.y).toBe(0);

        expect(typeof vertex.upperLeft).toBe('object');
        expect(typeof vertex.lowerRight).toBe('object');
        expect(typeof vertex.upperLeft.x).toBe('number');
        expect(typeof vertex.upperLeft.y).toBe('number');
        expect(typeof vertex.lowerRight.x).toBe('number');
        expect(typeof vertex.lowerRight.y).toBe('number');
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
    const mockAdjList = 
    {
        edgeExists: jest.fn(() => true),
        getEdge: jest.fn((first, second) => `${first},${second}`)
    };

    let mockCallBack;

    beforeEach(() => 
    {
        vertex = new VertexFactory(mockAdjList).create('A', 0, 0, mockConfig);
        
        vertex.toNeighbors['B'] = 'B';
        vertex.fromNeighbors['B'] = 'B';
        vertex.fromNeighbors['C'] = 'C';
        mockCallBack = jest.fn();
        vertex.forEachEdge(mockCallBack);
    });

    test('Callback should have been called 3 times.', () => 
    {   
        expect(mockCallBack).toHaveBeenCalledTimes(3);
    });

    test('Callback should have been called with parameters A,B | B,A | C,A.', () => 
    {   
        expect(mockCallBack).toHaveBeenCalledWith('A,B');
        expect(mockCallBack).toHaveBeenCalledWith('B,A');
        expect(mockCallBack).toHaveBeenCalledWith('C,A');
    });
});
