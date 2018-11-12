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

describe('Testing Edge Class', () =>
{
    test('construction works', () => 
    {
        expect(edgeFactory.adjList).toBe(adjList);
        expect(edge.from).toBe('A');
        expect(edge.to).toBe('B');
        expect(edge.boxSize).toBe(10);
        expect(edge.weight).toBe(10);
        expect(typeof edge.x).toBe('number');
        expect(typeof edge.y).toBe('number');
        expect(typeof edge.upperLeft).toBe('object');
        expect(typeof edge.lowerRight).toBe('object');
        expect(typeof edge.upperLeft.x).toBe('number');
        expect(typeof edge.upperLeft.y).toBe('number');
        expect(typeof edge.lowerRight.x).toBe('number');
        expect(typeof edge.lowerRight.y).toBe('number');
        expect(mockGetVertex).toBeCalledTimes(4);
    }); 
    
    test('setPoints() works', () => 
    {
        const mockSetBounds = jest.fn();
        edge._setBounds = mockSetBounds
        edge.setPoints();
        expect(mockSetBounds).toBeCalledTimes(1);
    }); 
});
