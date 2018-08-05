/**
 *  @author Jake Landowski
 *  8/4/18
 *  start-tests.js
 * 
 *  Imports and runs each test in the tests/ directory.
 */

'use strict';
 define(['tests/GraphModel.test', 
         'tests/AdjacencyList.test'], 
         function(GraphModelTest, AdjacencyListTest)
 {
     return {
        
        assertEquals(result, expected, error)
        {
            if(result !== expected)
                throw error;
        },

        run()
        {
            console.log('Running tests...');
            GraphModelTest.run(this.assertEquals);
            AdjacencyListTest.run(this.assertEquals);
            console.log('Tests done.');
        }
     };
 });