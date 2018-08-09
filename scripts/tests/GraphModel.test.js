/**
 *  @author Jake Landowski
 *  8/4/18
 *  GraphModel.test.js
 * 
 *  Unit tests for GraphModel class.
 */

'use strict';
 define(['classes/graph/GraphModel'], function(GraphModel)
 {
     return {
        run(assertEquals)
        {
            console.log('Testing GraphModel...');
            
            const graphModel = new GraphModel(500, 500, 
            {
                undirected:        true,
                vertexSize:        25,
                vertexOutlineSize: 3,
                edgeWidth:         5,
                edgeBoxSize:       50
            });
            
            graphModel.dispatch(graphModel.userCommands,
            { 
                type: 'addVertex',
                data: 
                {
                    symbol:        'A',
                    x:             500,
                    y:             500,
                    toNeighbors:   [], // FOR UNDO
                    fromNeighbors: [], // FOR UNDO
                    returnSymbol:  function(){},   
                    getSymbol:     function(){ return 'A'; }
                },
                undo: 'removeVertex'
            });
            
            graphModel.undo(graphModel.userCommands);
            assertEquals(graphModel.userCommands.undoLog.length, 0, 
                         'undo log should be empty after 1 command followed by 1 undo.');
            graphModel.redo(graphModel.userCommands);
            assertEquals(graphModel.userCommands.redoLog.length, 0, 
                         'redo log should be empty after 1 undo followed by 1 redo.');
            assertEquals(graphModel.userCommands.undoLog[0].type, 'addVertex', 
                         'addVertex should be back on undo log after redo did a removeVertex.');
            assertEquals(graphModel.adjList.vertexExists('A'), true, 
                         'adjacency list should have vertex A back after redo recreated it.');
        }
     };
 });