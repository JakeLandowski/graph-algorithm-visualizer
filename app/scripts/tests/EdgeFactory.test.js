/**
 *  @author Jake Landowski
 *  11/10/18
 *  EdgeFactory.test.js
 * 
 *  Unit tests for EdgeFactory.js
 */

import EdgeFactory from '../classes/graph/EdgeFactory.js';

let edgeFactory, edge, adjList, mockGetVertex;

beforeEach(() => 
{
    mockGetVertex = jest.fn(() => 
    {
        return { x: 5, y : 5 };
    });

    adjList = 
    {
        getVertex : mockGetVertex
    };

    edgeFactory = new EdgeFactory(adjList);
    edge = edgeFactory.create('A', 'B', 10, 10);
});

describe('Testing edge construction.', () =>
{
    test('Default construction works.', () => 
    {
        const defaultEdge = edgeFactory.create('B', 'A');
        expect(defaultEdge.boxSize).toBe(0);
        expect(defaultEdge.weight).toBe(0);
    });

    test(`Factory's internal adjacency list is the one passed in.`, () => 
    {
        expect(edgeFactory.adjList).toBe(adjList);
    });

    test(`Edge's parameters are the ones passed to the factory create() call.`, () => 
    {
        expect(edge.from).toBe('A');
        expect(edge.to).toBe('B');
        expect(edge.boxSize).toBe(10);
        expect(edge.weight).toBe(10);
    });

    test('Center, upperLeft, and lowerRight were set with correct calculations.', () => 
    {
        expect(edge.x).toBe(5);
        expect(edge.y).toBe(5);
        expect(typeof edge.upperLeft).toBe('object');
        expect(typeof edge.lowerRight).toBe('object');
        expect(edge.upperLeft.x).toBe(-5);
        expect(edge.upperLeft.y).toBe(-5);
        expect(edge.lowerRight.x).toBe(15);
        expect(edge.lowerRight.y).toBe(15);
    });

    test(`Internal adjacency list's getVertex() method was called 4 times.`, () => 
    {
        expect(mockGetVertex).toBeCalledTimes(4);
    });

    
});

describe('Testing getters.', () => 
{
    test('toVertex and fromVertex getter properties return vertices correctly.', () => 
    {
        expect(edge.toVertex.x).toBe(5);
        expect(edge.toVertex.y).toBe(5);
        expect(edge.fromVertex.x).toBe(5);
        expect(edge.fromVertex.y).toBe(5);
    });
});

describe('Testing setters.', () => 
{
    test('setPoints() calls internal method setBounds() 1 time.', () => 
    {
        const mockSetBounds = jest.fn();
        edge.setBounds = mockSetBounds
        edge.setPoints();
        expect(mockSetBounds).toBeCalledTimes(1);
    });
});