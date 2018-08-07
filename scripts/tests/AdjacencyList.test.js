/**
 *  @author Jake Landowski
 *  8/4/18
 *  AdjacencyList.test.js
 * 
 *  Unit tests for AdjacencyList class.
 */

'use strict';
 define(['classes/graph/AdjacencyList'], function(AdjacencyList)
 {
     return {
        run(assertEquals)
        {
            console.log('Testing AdjacencyList...');
            
            const directedAdjList   = new AdjacencyList(false);
            
            const vertex1 = { data: 'vertex1', toNeighbors: {}, fromNeighbors: {} };
            const vertex2 = { data: 'vertex2', toNeighbors: {}, fromNeighbors: {} };
            const edge1   = { from: 'vertex1', to: 'vertex2'};
            directedAdjList.insertVertex(vertex1);

            assertEquals(directedAdjList.vertexMap['vertex1'], vertex1, 
                         'insertVertex() on directed adjacency list should' + 
                         ' correctly store the vertex in the vertexMap using' + 
                         ' its data as the key.');
            assertEquals(directedAdjList.vertexMap['vertex1'].data, 'vertex1', 
                         'vertex stored at key: [data] in the vertexMap should' + 
                         ' have .data property that is equal to data.');
            
            directedAdjList.insertVertex(vertex2);
            directedAdjList.insertEdge(edge1);

            assertEquals(directedAdjList.edgeMap[ ['vertex1', 'vertex2'] ], edge1, 
                         'edgeMap should have the same edge that was inserted when' + 
                         ' gotted by the same from and to data.');

            const undirectedAdjList = new AdjacencyList(true);

            const vertex3 = { data: 'vertex3', toNeighbors: {}, fromNeighbors: {} };
            const vertex4 = { data: 'vertex4', toNeighbors: {}, fromNeighbors: {} };
            const edge2   = { from: 'vertex3', to: 'vertex4'};

            undirectedAdjList.insertVertex(vertex3);
            undirectedAdjList.insertVertex(vertex4);
            undirectedAdjList.insertEdge(edge2);
            
            let count = 0;
            undirectedAdjList.forEachEdge(function()
            {
                count++;
            });

            assertEquals(count, 1, 'forEachEdge on vertex inside undirected graph' + 
                         ' with only 1 registered edge object should have only ' + 
                         'looped one time.');
        }
     };
 });