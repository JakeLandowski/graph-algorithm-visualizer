
/**
 *  @author Jake Landowski
 *  11/9/18
 *  AdjacencyList.test.js
 * 
 *  Unit tests for AdjacencyList.js
 */

import AdjacencyList from '../classes/graph/AdjacencyList.js';

let undirectedAdj, directedAdj, vertex, edge;

beforeEach(() => 
{
    undirectedAdj = new AdjacencyList(true);
    directedAdj   = new AdjacencyList(false);
    vertex = { data: 'A' };
    edge = { from: 'A', to: 'B' };
});

describe('Testing construction', () => 
{
    test('Internal boolean to determine directed/undirected should match parameter', () => 
    {
        expect(undirectedAdj.undirected).toBe(true);
        expect(directedAdj.undirected).toBe(false);
    });

    test('Internal vertexMap and edgeMap should be empty at initialization.', () => 
    {
        const emptyObject = Object.create(null);
        expect(directedAdj.vertexMap).toEqual(emptyObject);
        expect(undirectedAdj.vertexMap).toEqual(emptyObject);
        expect(directedAdj.edgeMap).toEqual(emptyObject);
        expect(undirectedAdj.edgeMap).toEqual(emptyObject);
    });
});

describe('Testing vertexExists() method', () => 
{
    test('Non-existent symbol should return false.', () =>
    {
        expect(directedAdj.vertexExists('')).toBe(false);
        expect(directedAdj.vertexExists('A')).toBe(false);
    });

    test('Existing symbol should return true.', () =>
    {
        directedAdj.vertexMap['A'] = {};
        expect(directedAdj.vertexExists('A')).toBe(true);
    });
});

describe('Testing insertVertex() method', () => 
{
    beforeEach(() => directedAdj.insertVertex(vertex));

    test('Inserting vertex should leave it unchanged.', () =>
    {
        expect(vertex).toBe(vertex);
        expect(vertex.data).toBe('A');
    });

    test('Internal vertexMap should have vertex after inserting.', () =>
    {
        expect(directedAdj.vertexMap[vertex.data]).toBe(vertex);
    });
});

describe('Testing getVertex() method', () => 
{
    test('Attempting to get non-existent vertex should return undefined.', () => 
    {
        expect(directedAdj.getVertex('A')).toBeUndefined();
    });

    test('Getting existing vertex should return that vertex.', () => 
    {
        directedAdj.vertexMap[vertex.data] = vertex;
        expect(directedAdj.getVertex('A')).toBe(vertex);
    });
});

describe('Testing deleteVertex() method', () => 
{
    beforeEach(() => 
    {
        directedAdj.insertVertex(vertex);
        expect(directedAdj.getVertex('A')).toBeDefined();
        directedAdj.deleteVertex('A');
    });

    test('Vertex should not exist after being deleted.', () => 
    {   
        expect(directedAdj.getVertex('A')).toBeUndefined;
        expect(directedAdj.vertexMap['A']).toBeUndefined;
        expect(directedAdj.vertexMap).toEqual(Object.create(null));
    });

    test('Internal vertexMap should be empty after deleting the only vertex.', () => 
    {   
        expect(directedAdj.vertexMap).toEqual(Object.create(null));
    });
});

describe('Testing insertEdge() method', () => 
{
    let mockPointToNeighbor, mockPointFromNeighbor, mockVertex;

    const mockThenInsert = list => 
    {
        list.vertexMap['A'] = mockVertex;
        list.vertexMap['B'] = mockVertex;
        list.insertEdge(edge);
    };

    const insertUndirected = () => mockThenInsert(undirectedAdj);
    const insertDirected = () => mockThenInsert(directedAdj);
    const insertBoth = () => { insertUndirected(); insertDirected(); };

    beforeEach(() => 
    {
        mockPointToNeighbor = jest.fn();
        mockPointFromNeighbor = jest.fn();
        mockVertex = 
        {
            pointToNeighbor: mockPointToNeighbor,
            pointFromNeighbor: mockPointFromNeighbor
        };
    });

    test('Edge A -> B should be in both undirected and directed lists after insertion.', () => 
    {   
        insertBoth();
        expect(directedAdj.edgeMap[['A', 'B']]).toBe(edge);
        expect(undirectedAdj.edgeMap[['A', 'B']]).toBe(edge);
    });

    describe('Testing on undirected AdjacencyList.', () => 
    {
        beforeEach(() => insertUndirected());

        test('Edge A -> B reversed should be referenced in undirected list as B -> A.', () => 
        {   
            expect(undirectedAdj.edgeMap[['B', 'A']]).toBe(edge);
        });

        test('Undirected list vertex.pointFromNeighbor() should have been called with A and B.', () => 
        {
            expect(mockPointFromNeighbor).toHaveBeenCalledWith('A');   
            expect(mockPointFromNeighbor).toHaveBeenCalledWith('B');   
        });

        test('Undirected list vertex.pointToNeighbor() should have been called with A and B.', () => 
        {
            expect(mockPointToNeighbor).toHaveBeenCalledWith('B');
            expect(mockPointToNeighbor).toHaveBeenCalledWith('A');
        });

        test('Undirected list vertex.pointToNeighbor() and vertex.pointFromNeighbor() '
        + 'should have been called 2 time each.', () => 
        {
            expect(mockPointToNeighbor).toHaveBeenCalledTimes(2);
            expect(mockPointFromNeighbor).toHaveBeenCalledTimes(2);    
        });
    });

    describe('Testing on directed AdjacencyList.', () => 
    {
        beforeEach(() => insertDirected());

        test('Edge A -> B reversed should not be referenced in directed list as B -> A.', () => 
        {   
            expect(directedAdj.edgeMap[['B', 'A']]).toBeUndefined();
        });
        
        test('Directed list vertex.pointFromNeighbor() should have been called with A and not B.', () => 
        {
            expect(mockPointFromNeighbor).toHaveBeenCalledWith('A');
            expect(mockPointFromNeighbor).not.toHaveBeenCalledWith('B');   
        });
    
        test('Directed list vertex.pointToNeighbor() should have been called with B and A.', () => 
        {
            expect(mockPointToNeighbor).toHaveBeenCalledWith('B');   
            expect(mockPointToNeighbor).not.toHaveBeenCalledWith('A');
        });
    
        test('Directed list vertex.pointToNeighbor() and vertex.pointFromNeighbor() '
         + 'should have been called 1 time each.', () => 
        {
            expect(mockPointToNeighbor).toHaveBeenCalledTimes(1);
            expect(mockPointFromNeighbor).toHaveBeenCalledTimes(1);    
        });
    });
});

describe('Testing getEdge() method', () => 
{
    test('Getting an edge that exists in the internal edgeMap returns that edge correctly.', () => 
    {
        directedAdj.edgeMap[['A', 'B']] = edge;
        expect(directedAdj.getEdge('A', 'B')).toBe(edge);   
    });
});

describe('Testing deleteEdge() method', () => 
{
    let mockUnregisterToNeighbor, mockUnregisterFromNeighbor, mockVertex;

    const mockThenDelete = list => 
    {
        list.vertexMap['A'] = mockVertex;
        list.vertexMap['B'] = mockVertex;
        list.edgeMap[['A', 'B']] = edge;
        list.deleteEdge('A', 'B');
    };

    const deleteUndirected = () => mockThenDelete(undirectedAdj);
    const deleteDirected = () => mockThenDelete(directedAdj);
    const deleteBoth = () => { deleteDirected(); deleteUndirected(); };
    
    const bothMocksCalledTimes = times => 
    {
        expect(mockUnregisterToNeighbor).toHaveBeenCalledTimes(times);
        expect(mockUnregisterFromNeighbor).toHaveBeenCalledTimes(times);
    };
    
    beforeEach(() => 
    {
        mockUnregisterToNeighbor = jest.fn();
        mockUnregisterFromNeighbor = jest.fn();
        mockVertex =
        {
            unregisterToNeighbor: mockUnregisterToNeighbor,
            unregisterFromNeighbor: mockUnregisterFromNeighbor
        };
    });

    test('Edge A -> B should be undefined for both undirected and directed Adjacency Lists.', () => 
    {
        deleteBoth();
        expect(undirectedAdj.edgeMap[['A', 'B']]).toBeUndefined();
        expect(directedAdj.edgeMap[['A', 'B']]).toBeUndefined();
    });

    describe('Testing on Undirected AdjacencyList.', () => 
    {
        beforeEach(() => deleteUndirected());

        test('Edge B -> A should be undefined for undirected Adjacency List.', () => 
        {
            expect(undirectedAdj.edgeMap[['B', 'A']]).toBeUndefined();
        });

        test('vertex.unregisterToNeighbor() and vertex.unregisterFromNeighbor() ' + 
        'should have been called 2 time for undirected Adjacency List.', () => 
        {
            bothMocksCalledTimes(2);
        });
        
        test('Undirected list vertex.unregisterFromNeighbor() should have been called with A and B', () => 
        { 
            expect(mockUnregisterFromNeighbor).toHaveBeenCalledWith('A');
            expect(mockUnregisterFromNeighbor).toHaveBeenCalledWith('B');
        });

        test('Undirected list vertex.unregisterToNeighbor() should have been called with A and B', () => 
        { 
            expect(mockUnregisterToNeighbor).toHaveBeenCalledWith('A');
            expect(mockUnregisterToNeighbor).toHaveBeenCalledWith('B');
        });
    });

    describe('Testing on Directed AdjacencyList.', () => 
    {
        beforeEach(() => deleteDirected());

        test('vertex.unregisterToNeighbor() and vertex.unregisterFromNeighbor() ' + 
        'should have been called 1 time for directed Adjacency List.', () => 
        {
            bothMocksCalledTimes(1);
        });

        test('Directed list vertex.unregisterFromNeighbor() should have been called with B and not A', () => 
        {
            expect(mockUnregisterFromNeighbor).toHaveBeenCalledWith('A');
            expect(mockUnregisterFromNeighbor).not.toHaveBeenCalledWith('B');
        });

        test('Directed list vertex.unregisterToNeighbor() should have been called with B and not A', () => 
        {
            expect(mockUnregisterToNeighbor).toHaveBeenCalledWith('B');
            expect(mockUnregisterToNeighbor).not.toHaveBeenCalledWith('A');
        });
    });
});

describe('Testing edgeExists() method', () => 
{
    test('edgeExists() works', () => 
    {
        expect(directedAdj.edgeExists('A', 'B')).toBe(false);
        directedAdj.edgeMap[['A', 'B']] = edge;
        expect(directedAdj.edgeExists('A', 'B')).toBe(true);
        expect(directedAdj.edgeExists('B', 'A')).toBe(false);
    });
});

describe('Testing forEachVertex() method', () => 
{
    test('forEachVertex() works', () => 
    {
        const testSymbols = ['A', 'B', 'C', 'D', 'E', 'F'];

        testSymbols.forEach((symbol) => 
        {
             directedAdj.vertexMap[symbol] = symbol; 
        });
    
        const testFunction = jest.fn();
        directedAdj.forEachVertex(testFunction);

        expect(testFunction).toHaveBeenCalledTimes(testSymbols.length);
        
        testSymbols.forEach((symbol) => 
        {
            expect(testFunction).toHaveBeenCalledWith(symbol); 
        });
    });
});

describe('Testing forEachEdge() method', () => 
{
    test('forEachEdge() works', () => 
    {
        const edges = 
        [
            {from: 'A', to: 'B'},
            {from: 'B', to: 'C'},
            {from: 'C', to: 'D'}
        ];

        edges.forEach((edge) => 
        {
            directedAdj.edgeMap[[edge.from, edge.to]] = edge;
            undirectedAdj.edgeMap[[edge.from, edge.to]] = edge;
            undirectedAdj.edgeMap[[edge.to, edge.from]] = edge;
        });

        const directedCallBackMock = jest.fn();
        const undirectedCallBackMock = jest.fn();

        directedAdj.forEachEdge(directedCallBackMock);
        undirectedAdj.forEachEdge(undirectedCallBackMock);

        const expectDirected = expect(directedCallBackMock);
        const expectUndirected = expect(undirectedCallBackMock); 

        expectDirected.toHaveBeenCalledTimes(edges.length);
        expectUndirected.toHaveBeenCalledTimes(edges.length);

        edges.forEach((edge) => 
        {
            expectDirected.toHaveBeenCalledWith(edge);
            expectUndirected.toHaveBeenCalledWith(edge);
        });
    });
});
