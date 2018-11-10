import AdjacencyList from '../classes/graph/AdjacencyList.js';

let undirectedAdj, directedAdj, vertex, edge;

beforeEach(() => 
{
    undirectedAdj = new AdjacencyList(true);
    directedAdj   = new AdjacencyList(false);
    vertex = { data: 'A' };
    edge = { from: 'A', to: 'B' };
});

describe('Testing Adjancency List undirected/directed', () => 
{
    test('expect vertexMap and edgeMap to be empty at start', () => 
    {
        const emptyObject = Object.create(null);
        expect(directedAdj.vertexMap).toEqual(emptyObject);
        expect(undirectedAdj.vertexMap).toEqual(emptyObject);
        expect(directedAdj.edgeMap).toEqual(emptyObject);
        expect(undirectedAdj.edgeMap).toEqual(emptyObject);
    });

    test('vertexExists() and insertVertex(vertex) works', () =>
    {
        expect(directedAdj.vertexExists('')).toBe(false);
        expect(directedAdj.vertexExists('A')).toBe(false);
        
        directedAdj.insertVertex(vertex);
        expect(directedAdj.vertexExists('A')).toBe(true);

        expect(vertex.data).toBeDefined();
        expect(vertex).toBe(vertex);
        expect(vertex.data).toBe('A');
    });

    test('getVertex() works', () => 
    {
        expect(directedAdj.getVertex('A')).toBeUndefined();
        
        directedAdj.insertVertex(vertex);

        expect(directedAdj.getVertex('A')).toBeDefined();
        expect(directedAdj.getVertex('A')).toBe(vertex);
    });

    test('deleteVertex() works', () => 
    {   
        directedAdj.insertVertex(vertex);
        expect(directedAdj.getVertex('A')).toBeDefined();

        directedAdj.deleteVertex('A');
        expect(directedAdj.getVertex('A')).toBeUndefined;
        expect(directedAdj.vertexMap['A']).toBeUndefined;
        expect(directedAdj.vertexMap).toEqual(Object.create(null));
    });

    test('insertEdge() works', () => 
    {   
        const testList = (list, undirected) => 
        {
            // Mocks
            const mockPointToNeighbor = jest.fn();
            const mockPointFromNeighbor = jest.fn();
            const mockVertex = 
            {
                pointToNeighbor: mockPointToNeighbor,
                pointFromNeighbor: mockPointFromNeighbor
            };

            list.vertexMap['A'] = mockVertex;
            list.vertexMap['B'] = mockVertex;

            // Test
            list.insertEdge(edge);
            expect(list.edgeMap[['A', 'B']]).toBe(edge);

            const expectBtoA = expect(undirectedAdj.edgeMap[['B', 'A']]);
            const expectToMock = expect(mockPointToNeighbor);
            const expectFromMock = expect(mockPointFromNeighbor); 
            
            if(undirected)
            {
                expectBtoA.toBe(edge);
                expectToMock.toHaveBeenCalledWith('A');
                expectFromMock.toHaveBeenCalledWith('B');
            }
            else
            {
                expectBtoA.toBeUndefined();
            }
            
            expectToMock.toHaveBeenCalledTimes(undirected ? 2:1);
            expectFromMock.toHaveBeenCalledTimes(undirected ? 2:1);

            expectToMock.toHaveBeenCalledWith('B');
            expectFromMock.toHaveBeenCalledWith('A');
        };

        testList(directedAdj, false);
        testList(undirectedAdj, true);
    });

    test('getEdge() works', () => 
    {
        directedAdj.edgeMap[['A', 'B']] = edge;
        expect(directedAdj.getEdge('A', 'B')).toBe(edge);   
    });

    test('deleteEdge() works', () => 
    {
        const testList = (list) =>
        {
            const mockUnregisterToNeighbor = jest.fn();
            const mockUnregisterFromNeighbor = jest.fn();
            const mockVertex =
            {
                unregisterToNeighbor: mockUnregisterToNeighbor,
                unregisterFromNeighbor: mockUnregisterFromNeighbor
            };

            list.vertexMap['A'] = mockVertex;
            list.vertexMap['B'] = mockVertex;
            list.edgeMap[['A', 'B']] = edge;

            expect(list.edgeMap[['A', 'B']]).toBe(edge);
            list.deleteEdge('A', 'B');
            expect(list.edgeMap[['A', 'B']]).toBeUndefined();

            expect(mockUnregisterToNeighbor).toHaveBeenCalledTimes(1);
            expect(mockUnregisterFromNeighbor).toHaveBeenCalledTimes(1);
            expect(mockUnregisterToNeighbor).toHaveBeenCalledWith('B');
            expect(mockUnregisterFromNeighbor).toHaveBeenCalledWith('A');
        };

        testList(directedAdj);
        testList(undirectedAdj);

        expect(undirectedAdj.edgeMap[['B', 'A']]).toBeUndefined();
    });

    test('edgeExists() works', () => 
    {
        expect(directedAdj.edgeExists('A', 'B')).toBe(false);
        directedAdj.edgeMap[['A', 'B']] = edge;
        expect(directedAdj.edgeExists('A', 'B')).toBe(true);
        expect(directedAdj.edgeExists('B', 'A')).toBe(false);
    });

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
