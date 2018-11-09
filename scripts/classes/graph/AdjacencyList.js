/**
 *  @author Jake Landowski
 *  8/1/18
 *  AdjacencyList.js
 * 
 *  Abstraction of an adjacency list for the Graph class
 */

'use strict';

/**
 * Abstraction of an adjacency list for the Graph class
 * @class
 * @constructor
 * @param {boolean} undirected - whether the AdjacencyList is undirected
 */
const AdjacencyList = function(undirected)
{
    this.undirected = undirected;
    this.vertexMap  = Object.create(null);
    this.edgeMap    = Object.create(null);
};

AdjacencyList.prototype = 
{
    /**
     * Tests if a vertex indentified by a given symbol exists.
     * @param {string} symbol - symbol for this vertex
     * @returns {boolean} true if this vertex exists
     * @example
     * adjList.insertVertex('A');
     * adjList.vertexExists('A'); // true
     * adjList.vertexExists('B'); // false
     */
    vertexExists(symbol)
    {
        const vertex = this.vertexMap[symbol];
        return vertex !== undefined && vertex !== null;
    },

    /**
     * Inserts a Vertex object using its symbol as a key.
     * @param {Vertex} vertex - the Vertex object to insert
     * @example
     * let vertex = new Vertex('A', 0, 0);
     * adjList.insertVertex(vertex);
     */
    insertVertex(vertex)
    {
        this.vertexMap[vertex.data] = vertex;
    },

    /**
     * Retrieves the stored Vertex object with the given symbol as a key.
     * @param {string} symbol - the symbol of the wanted Vertex
     * @returns {Vertex} the stored Vertex object with this symbol or undefined
     * @example
     * let vertex = new Vertex('A', 0, 0);
     * adjList.insertVertex(vertex);
     * 
     * let sameVertex = adjList.getVertex('A');
     * console.log(vertex === sameVertex); // true   
     */
    getVertex(symbol)
    {
        return this.vertexMap[symbol];
    },

    /**
     * Deletes the reference to a stored Vertex object
     * with a given symbol.
     * @param {string} symbol - the symbol of the stored Vertex
     * @example
     * let vertex = new Vertex('A', 0, 0);
     * adjList.insertVertex(vertex);
     * console.log(adjList.vertexExists('A')); // true
     * 
     * adjList.deleteVertex('A');
     * console.log(adjList.vertexExists('A')); // false 
     */
    deleteVertex(symbol)
    { 
        delete this.vertexMap[symbol];
    },

    /**
     * Inserts an Edge object, will access the stored to and 
     * from vertices for this edge and have them reference each other.
     * If undirected, will register this edge in both directions.
     * @param {Edge} edge - the Edge object to insert
     * @throws {ReferenceError} if the AdjacencyList doesn't have
     * the edge's to and from vertices stored
     * @example
     * 
     * let adjList = new AdjacencyList(false); // directed
     * 
     * let vertexOne = new Vertex('A', 0, 0);
     * let vertexTwo = new Vertex('B', 0, 0);
     * adjList.insertVertex(vertexOne);
     * adjList.insertVertex(vertexTwo);
     * 
     * let edge = new Edge('A', 'B');
     * adjList.insertEdge(edge);
     * 
     * console.log(adjList.getEdge('A', 'B')); // Edge {from: "A", to: "B"}
     * console.log(vertexOne.toNeighbors); // {"B" : vertexTwo}
     * console.log(vertexTwo.fromNeighbors); // {"A" : vertexOne}
     * 
     * let invalidEdge = new Edge('A', 'C');
     * adjList.insert(invalidEdge); // throw ReferenceError 
     */
    insertEdge(edge)
    {
        const from = edge.from;
        const to   = edge.to;
        
        this.vertexMap[from].pointToNeighbor(to);
        this.vertexMap[to].pointFromNeighbor(from);
        this._registerEdge(from, to, edge);
        
        if(this.undirected) 
        {
            this._registerEdge(to, from, edge);
            this.vertexMap[from].pointFromNeighbor(to);
            this.vertexMap[to].pointToNeighbor(from);
        }
    },

    /**
     * Retrieve a stored Edge object from the given
     * from and to vertex symbols as its key.
     * @param {string} from - the from vertex symbol
     * @param {string} to - the to vertex symbol
     * @returns {Edge} the Edge object stored or undefined
     */
    getEdge(from, to)
    {
        return this.edgeMap[[from, to]];
    },

    /**
     * Deletes all references being used to represent this edge.
     * @param {string} from - data value of the from vertex 
     * @param {string} to - data value of the to vertex
     * @example
     * adjList.insertEdge('A', 'B');
     * adjList.edgeExists('A', 'B'); // true
     * 
     * adjList.deleteEdge('A', 'B');
     * adjList.edgeExists('A', 'B'); // false
     */
    deleteEdge(from, to)
    { 
        this._unregisterEdge(from, to);
        if(this.undirected) this._unregisterEdge(to, from);

        this.vertexMap[from].unregisterToNeighbor(to);
        this.vertexMap[to].unregisterFromNeighbor(from);
    },

    edgeExists(from, to)
    {
        const edge = this.edgeMap[[from, to]];
        return edge !== undefined && edge !== null;
    },

    forEachVertex(action)
    {
        const map = this.vertexMap;
        for(const vertexData in map)
            action(map[vertexData]);
    },

    forEachEdge(action)
    {
        const map = this.vertexMap;
        let vertex, toNeighbors, edge;

        for(const symbol in map)
        {
            vertex = map[symbol];
            toNeighbors = vertex.toNeighbors;

            for(const neighbor in toNeighbors)
            {
                edge = this.edgeMap[ [vertex.data, neighbor] ];
                if(edge.to === neighbor && edge.from === symbol)
                    action(edge);
            }
        }
    },

    //=========== Private ===========//

    _registerEdge(from, to, edge)
    {
        this.edgeMap[[from, to]] = edge;
    },

    _unregisterEdge(from, to)
    {
        delete this.edgeMap[[from, to]];
    }
};

export default AdjacencyList;