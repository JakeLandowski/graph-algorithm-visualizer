/**
 *  @author Jake Landowski
 *  11/26/18
 *  Graph.test.js
 * 
 *  Unit tests for Graph.js 
 */

'use strict';

import Graph from '../classes/graph/Graph.js';
import GraphView from '../classes/graph/GraphView.js';
import GraphModel from '../classes/graph/GraphModel.js';
import Event from '../classes/Event.js';
import graphConfig from '../../graph_config.json';

let mockView, mockModel, graph;

const initMockView = () => 
{
    mockView = {};
    const keys = 
    [
        "onUndo",               
        "onRedo",              
        "onEdgeFormSubmitted", 
        "onEdgeCurveChanged",  
        "onCanvasMouseClick",  
        "onCanvasMouseDown",   
        "onCanvasMouseDrag",   
        "onCanvasMouseUp",     
        "onCanvasMouseMove"
    ];

    let event;
    keys.forEach(key => 
    {
        event = new Event(this);
        jest.spyOn(event, 'attach');
        mockView[key] = event
    });
};

const initMockModel = () => 
{
    mockModel = 
    {
        userCommands: {}
    };

    const methods = 
    [
        "dispatch",
        "editEdgeWeight",
        "clearEdgeEdit",
        "updateEdgeSpatial",
        "getEdge",
        "edgeAt",
        "edgeExists",
        "startEditingEdge",
        "vertexAt",
        "selectVertex",
        "deselectVertex",
        "peekSymbol",
        "hasSymbols",
        "addTrackingEdge"
    ];

    methods.forEach(method => 
    {
        mockModel[method] = jest.fn();
    });
};

initMockView();
initMockModel();

jest.mock('../classes/graph/GraphView.js', () => 
{
    return jest.fn(() => mockView);
});

jest.mock('../classes/graph/GraphModel.js', () => 
{
    return jest.fn(() => mockModel);
})

const mockContainer = { clientWidth: 10, clientHeight: 10 };
const mockConfig = {}; 

const initialize = (container = mockContainer, config = mockConfig) => 
{
    initMockView();
    initMockModel();
    graph = new Graph(container, config);
};

beforeEach(() => 
{
    GraphView.mockClear(); // for constructor tests
    GraphModel.mockClear();
    initialize();
});

describe('Testing construction.', () =>
{
    test('Invalid container throws a TypeError.', () => 
    {
        expect(() => initialize({})).toThrow();
    });

    describe.each(Object.keys(graphConfig).map(key => [key]))
    ('Config has every property from the config json.', (key) => 
    {
        test(`${key} exists.`, () => 
        {
            expect(graph.config[key]).toBeDefined();
        });
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

    describe.each([['onUndo'], ['onRedo'], ['onEdgeFormSubmitted'], 
                   ['onEdgeCurveChanged'], ['onCanvasMouseClick'], 
                   ['onCanvasMouseDown'],  ['onCanvasMouseMove']])
    ('Correct events attached functions on construction.', (event) => 
    {
        test(`${event} attach method was called.`, () => 
        {
            expect(mockView[event].attach).toHaveBeenCalledTimes(1);
            expect(mockView[event].attach)
            .toHaveBeenCalledWith(expect.any(String), expect.any(Function));
        });
    });
});

describe('Testing onEdgeFormSubmitted event.', () => 
{
    let weight;

    const expectModelGivenWeight = (called) => 
    {
        if(called)
        {
            expect(mockModel.editEdgeWeight).toHaveBeenCalledTimes(1);
            expect(mockModel.clearEdgeEdit).toHaveBeenCalledTimes(1);
            expect(mockModel.editEdgeWeight).toHaveBeenCalledWith(weight);
        }
        else
        {
            expect(mockModel.editEdgeWeight).toHaveBeenCalledTimes(0);
            expect(mockModel.clearEdgeEdit).toHaveBeenCalledTimes(0);
        }
    };

    test('Number weight passed to model.', () => 
    {
        weight = 20;
        mockView.onEdgeFormSubmitted.notify({weight: weight});
        expectModelGivenWeight(true);
    });

    test('Numeric string weight is parsed and passed to model.', () => 
    {
        weight = 20;
        mockView.onEdgeFormSubmitted.notify({weight: '' + weight});
        expectModelGivenWeight(true);
    });

    test(`Non-numeric weight doesn't pass to model.`, () => 
    {
        weight = undefined;
        mockView.onEdgeFormSubmitted.notify({weight: weight});
        expectModelGivenWeight(false);
    });
});

describe('Testing onEdgeCurveChanged event.', () => 
{
    let mockEdge, from, to, centerX, centerY;

    beforeEach(() => 
    {
        from    = 'A';
        to      = 'B';
        centerX = 15;
        centerY = 25;
        mockEdge = {
            setBounds: jest.fn()
        };
        
        graph.model.getEdge.mockImplementation(() => 
        {
            return mockEdge;
        });

        mockView.onEdgeCurveChanged.notify({
            from:    from,
            to:      to,
            centerX: centerX,
            centerY: centerY
        });
    });

    test('model.getEdge is called with correct parameters.', () => 
    {
        expect(graph.model.getEdge).toHaveBeenCalledTimes(1);
        expect(graph.model.getEdge).toHaveBeenCalledWith(from, to);
    });

    test('edge.setBounds is called.', () => 
    {
        expect(mockEdge.setBounds).toHaveBeenCalledTimes(1);
    });

    test('model.updateEdgeSpatial is called with correct parameters.', () => 
    {
        expect(graph.model.updateEdgeSpatial).toHaveBeenCalledTimes(1);
        expect(graph.model.updateEdgeSpatial).toHaveBeenCalledWith(mockEdge);
    });
});

describe('Testing onCanvasMouseClick event.', () => 
{
    let mockVertex; // set before each tests that needs it

    beforeEach(() => 
    {
        graph.model.vertexAt.mockImplementation(() => 
        {
            return mockVertex;
        });
    });

    test('model.clearEdgeEdit is called at the beginning.', () =>
    {
        graph.clickEntity({x: 5, y: 5});
        expect(mockModel.clearEdgeEdit).toHaveBeenCalledTimes(1);
    });
    
    describe('If vertex exists, a vertex is selected, and', () => 
    {
        mockModel.selectedVertex = { data: 'A' };
        mockVertex = { data: 'B' };
        
        test('they are the not the same, then ', () =>
        {
            graph.clickEntity({x: 5, y: 5});
            expect(mockModel.deselectVertex).toHaveBeenCalledTimes(1);
            expect(mockModel.selectVertex).toHaveBeenCalledTimes(1);         
        });
    });
});