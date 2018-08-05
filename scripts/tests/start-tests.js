/**
 *  @author Jake Landowski
 *  8/4/18
 *  start-tests.js
 * 
 *  Imports and runs each test in the tests/ directory.
 */

'use strict';
 define(['tests/AdjacencyList.test'], function(AdjacencyListTest)
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
            AdjacencyListTest.run(this.assertEquals);
            console.log('Tests done.');
        }
     };
 });