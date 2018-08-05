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
            

        }
     };
 });