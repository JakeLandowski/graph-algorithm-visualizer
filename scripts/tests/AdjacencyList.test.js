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
        expect(directedAdj.vertexMap).toEqual(Object.create(null));
        expect(undirectedAdj.vertexMap).toEqual(Object.create(null));
        expect(directedAdj.edgeMap).toEqual(Object.create(null));
        expect(undirectedAdj.edgeMap).toEqual(Object.create(null));
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

    test('insertEdge(edge) works', () => 
    {   
        const directedMockOne = jest.fn();
        directedAdj.vertexMap['A'] = 
        {
            pointToNeighbor: directedMockOne
        };

        const directedMockTwo = jest.fn();
        directedAdj.vertexMap['B'] = 
        {
            pointFromNeighbor: directedMockTwo
        };

        directedAdj.insertEdge(edge);
        expect(directedAdj.edgeMap[['A', 'B']]).toBe(edge);
        expect(directedAdj.edgeMap[['B', 'A']]).toBeUndefined();
        expect(directedMockOne).toHaveBeenCalledTimes(1);
        expect(directedMockOne).toHaveBeenCalledWith('B');
        expect(directedMockTwo).toHaveBeenCalledTimes(1);
        expect(directedMockTwo).toHaveBeenCalledWith('A');

        const undirectedMockOne = jest.fn();
        undirectedAdj.vertexMap['A'] = 
        {
            pointToNeighbor: undirectedMockOne
        };

        const undirectedMockTwo = jest.fn();
        undirectedAdj.vertexMap['B'] = 
        {
            pointFromNeighbor: undirectedMockTwo
        };

        undirectedAdj.insertEdge(edge);
        expect(undirectedAdj.edgeMap[['A', 'B']]).toBe(edge);
        expect(undirectedAdj.edgeMap[['B', 'A']]).toBe(edge);
        expect(undirectedMockOne).toHaveBeenCalledTimes(1);
        expect(undirectedMockOne).toHaveBeenCalledWith('B');
        expect(undirectedMockTwo).toHaveBeenCalledTimes(1);
        expect(undirectedMockTwo).toHaveBeenCalledWith('A');
    });

    test('getEdge() works', () => 
    {

    });
});