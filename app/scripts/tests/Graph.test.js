/**
 *  @author Jake Landowski
 *  11/26/18
 *  Graph.test.js
 * 
 *  Unit tests for Graph.js 
 */

'use strict';

const mockView = 
{
    onUndo:              { attach: jest.fn() }, 
    onRedo:              { attach: jest.fn() },
    onEdgeFormSubmitted: { attach: jest.fn() },
    onEdgeCurveChanged:  { attach: jest.fn() },
    onCanvasMouseClick:  { attach: jest.fn() },
    onCanvasMouseDown:   { attach: jest.fn() },
    onCanvasMouseDrag:   { attach: jest.fn() },
    onCanvasMouseUp:     { attach: jest.fn() },
    onCanvasMouseMove:   { attach: jest.fn() },
};

const mockModel = {};

jest.mock('../classes/graph/GraphView.js', () => 
{
    return jest.fn(() => mockView);
});

jest.mock('../classes/graph/GraphModel.js', () => 
{
    return jest.fn(() => mockModel);
})

import Graph from '../classes/graph/Graph.js';
import GraphView from '../classes/graph/GraphView.js';
import GraphModel from '../classes/graph/GraphModel.js';

let graph;
const mockContainer = {clientWidth: 10, clientHeight: 10};
const mockConfig = {};

const initialize = (container=mockContainer, config=mockConfig) => 
{
    graph = new Graph(container, config);
};

beforeEach(() => 
{
    GraphView.mockClear();
    GraphModel.mockClear();
    initialize();
});

describe('Testing construction.', () =>
{
    test('Invalid container throws a TypeError.', () => 
    {
        expect(() => initialize({})).toThrow();
    });

    describe.each([['GraphView', GraphView], ['GraphModel', GraphModel]])
    ('%s', (name, constructor) => 
    {
        test('can use new keyword.', () => 
        {
            expect(new constructor()).toBeTruthy();
        });

        test('is called only once.', () => 
        {
            expect(constructor).toHaveBeenCalledTimes(1);
        });
    });
    
    test('GraphView constructor was given correct arguments.', () => 
    {   
        expect(GraphView).toHaveBeenCalledWith(
            mockContainer, graph.model, graph.config);
    });
    
    test('GraphModel constructor was given correct arguments.', () => 
    {
        expect(GraphModel).toHaveBeenCalledWith(
            mockContainer.clientWidth, mockContainer.clientHeight, graph.config);
    });
});