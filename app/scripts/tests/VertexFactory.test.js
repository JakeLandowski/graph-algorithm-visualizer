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

describe('Testing Vertex Class', () =>
{
    test('construction works and setPoints()', () => 
    {
        expect(vertexFactory.adjList).toBe(adjList);

        expect(vertex.id).toBe('A');
        expect(vertex.data).toBe('A');
        expect(vertex.options).toBe(mockConfig);
        expect(vertex.numEdges).toBe(0);
        expect(vertex.toNeighbors).toEqual(Object.create(null));
        expect(vertex.fromNeighbors).toEqual(Object.create(null));
        
        expect(vertex.x).toBe(0);
        expect(vertex.y).toBe(0);

        expect(typeof vertex.upperLeft).toBe('object');
        expect(typeof vertex.lowerRight).toBe('object');
        expect(typeof vertex.upperLeft.x).toBe('number');
        expect(typeof vertex.upperLeft.y).toBe('number');
        expect(typeof vertex.lowerRight.x).toBe('number');
        expect(typeof vertex.lowerRight.y).toBe('number');
    }); 

    test('unregisterToNeighbor() and unregisterFromNeighbor() works', () => 
    {
        const unregisterTest = (method, neighbors) => 
        {
            vertex.numEdges = 1;
            vertex[neighbors]['A'] = 'A';
            vertex[neighbors]['B'] = 'B';
            vertex[method]('A');

            expect(vertex[neighbors]['A']).toBeUndefined;
            expect(vertex.numEdges).toBe(0);
            expect(vertex[neighbors]['B']).toBe('B');
        };

        unregisterTest('unregisterToNeighbor', 'toNeighbors');
        unregisterTest('unregisterFromNeighbor', 'fromNeighbors');
    });
    
    test('_decrementEdges() works', () => 
    {
        vertex.numEdges = 1;

        vertex._decrementEdges();
        expect(vertex.numEdges).toBe(0);

        vertex._decrementEdges();
        expect(vertex.numEdges).toBe(0);
    });

    test('pointToNeighbor() and pointFromNeighbor() works', () => 
    {
        const pointTest = (method, neighbors) => 
        {
            vertex.numEdges = 0;
            vertex[neighbors]['B'] = 'B';

            vertex[method]('A');
            expect(vertex[neighbors]['A']).toBe('A');
            expect(vertex.numEdges).toBe(1);

            vertex[method]('A');
            expect(vertex[neighbors]['A']).toBe('A');
            expect(vertex.numEdges).toBe(1);

            expect(vertex[neighbors]['B']).toBe('B');
            
        };

        pointTest('pointToNeighbor', 'toNeighbors');
        pointTest('pointFromNeighbor', 'fromNeighbors');
    });

    test('forEachEdge() works', () => 
    {
        const adjList = 
        {
            edgeExists: jest.fn(() => true),
            getEdge: jest.fn((first, second) => `${first},${second}`)
        }

        vertex = new VertexFactory(adjList).create('A', 0, 0, mockConfig);
        
        vertex.toNeighbors = 
        {
            'B': 'B'
        };

        vertex.fromNeighbors = 
        {
            'B': 'B',
            'C': 'C'
        };

        const mockCallBack = jest.fn();
        
        vertex.forEachEdge(mockCallBack);
        expect(mockCallBack).toHaveBeenCalledTimes(3);
        expect(mockCallBack).toHaveBeenCalledWith('A,B');
        expect(mockCallBack).toHaveBeenCalledWith('B,A');
        expect(mockCallBack).toHaveBeenCalledWith('C,A');
    });
});
