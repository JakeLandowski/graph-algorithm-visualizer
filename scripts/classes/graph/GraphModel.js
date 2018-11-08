/**
 *  @author Jake Landowski
 *  7/16/18
 *  GraphModel.js
 * 
 *  Represents the data structure for the Graph class..
 */

'use strict';

import Event from '../Event.js';
import AdjacencyList from './AdjacencyList.js';
import Vertex from './Vertex.js';
import Edge from './Edge.js';
import SpacialIndex from '../SpacialIndex.js';
import CommandLog from '../CommandLog.js';

const GraphModel = function(width, height, config, cellRatio=5)
{
    this.config    = config;
    this.cellRatio = cellRatio;
    this.setDimensions(width, height);

    this.adjList   = new AdjacencyList(this.config.undirected)
    Edge.adjList   = this.adjList; // Edge Class Static Reference
    Vertex.adjList = this.adjList; // Vertex Class Static Reference
    
    this.edgeSpacialIndex   = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);
    this.vertexSpacialIndex = new SpacialIndex(this.cellWidth, this.cellHeight, this.cellRatio);

    this.onVertexAdded          = new Event(this);
    this.onVertexRemoved        = new Event(this);
    this.onVertexMoved          = new Event(this);
    this.onVertexSelected       = new Event(this);
    this.onVertexDeselected     = new Event(this);
    this.onVertexHovered        = new Event(this);
    this.onVertexNotHovered     = new Event(this);

    this.onTrackingEdgeAdded    = new Event(this);
    this.onTrackingEdgeRemoved  = new Event(this);
    this.onTrackingEdgeMoved    = new Event(this);
    
    this.onEdgeAdded            = new Event(this);
    this.onEdgeRemoved          = new Event(this);
    this.onEdgeMoved            = new Event(this);
    this.onEdgeHovered          = new Event(this);
    this.onEdgeNotHovered       = new Event(this);
    this.onEdgeEditStarted      = new Event(this);
    this.onEdgeWeightEditted    = new Event(this);
    this.onEdgeEditingFinished  = new Event(this);

    this.userCommands = new CommandLog();
    this.indirectEdgeRemoveCommands = new CommandLog();

    this.symbols = ['Z', 'Y', 'X', 'W', 'V', 'U', 
                    'T', 'S', 'R', 'Q', 'P', 'O', 
                    'N', 'M', 'L', 'K', 'J', 'I', 
                    'H', 'G', 'F', 'E', 'D', 'C', 
                    'B', 'A'];
};

GraphModel.prototype = 
{

//====================== Command Handling ===========================//

    /**
     *  Execute the command given and log it for future
     *  undo's.
     * 
     *  @param command   the command object to interpret and log
     *  @param clearRedo used for redo() method to prevent redo 
     *                   stack refreshing
     */
    dispatch(log=undefined, command)
    {
        if(this[command.type])
        {
            this[command.type](command.data);
            if(log) log.record(command, true);
        }
        else throw 'Tried to run non-existant command ' + command.type;
    },

    /**
     *  Execute the inverse command method to undo the
     *  last dispatched command.
     */
    undo(log)
    {
        const command = log.undo();
        if(command && this[command.undo])
            this[command.undo](command.data);
    },

    /**
     *  Execute the command that has last been undone.
     */
    redo(log)
    {
        const command = log.redo();
        if(command && this[command.type])
        {
            this[command.type](command.data);
            log.record(command, false);
        }
    },

    saveGraph()
    {
        return this.userCommands.serialize();
    },

    loadGraph(commandJSON)
    {
        const log = this.userCommands;
        this.clearGraph();
        log.parse(commandJSON);

        log.undoLog.forEach(function(command)
        {  
            if(this[command.type])
            {
                console.log(command);
                this[command.type](command.data);
            }

        }.bind(this));
    },

    clearGraph()
    {
        let command = this.userCommands.undo();
        while(command && this[command.undo])
        {
            this[command.undo](command.data);
            command = this.userCommands.undo();
        }
    },

    /**
     *  For asserting that arguments in a given parameter object
     *  are actually set when the method is called. Otherwise
     *  throws the given message.
     *  
     *  @param args  the parameter object to test
     *  @param props the required parameters
     *  @param error the message to throw
     *  @throws String error message if one of the required parameters
     *          is missing
     */
    assertArgs(args, props, error)
    {
        props.forEach(function(prop)
        {
            if(args[prop] === undefined)
                throw error;
        });
    },

//====================== Vertex Commands ===========================//

    /**
     *  Adds a vertex with the given vertex data. Notifies everyone 
     *  of this removal, so far GraphView listens to this and 
     *  updates the visuals accordingly. 
     * 
     *  @param args an object of arguments given/required
     *              by this command method.
     *              {
     *                  symbol:        the vertex data,
     *                  x:             x coordinate of the point,
     *                  y:             y coordinate of the point,
     *                  toNeighbors:   array of incoming neighbor vertices used for undo,
     *                  fromNeighbors: array of outgoing neighbor vertices used for undo,
     *                  returnSymbol:  function to call to return generic symbol back to pool,
     *                  getSymbol:     function to call to get a new vertex symbol from pool
     *              }
     *  @throws String error message if one of the required command
     *          arguments is missing
     */
    addVertex(args={})
    {
        this.assertArgs(args, ['symbol', 'x', 'y', 'numEdges'], 
                            //    'returnSymbol', 'getSymbol'], 
                                'Missing arguments for addVertex command');

        const data          = this.getSymbol();

        const x             = args.x;
        const y             = args.y;
        const numEdges      = args.numEdges;

        if(!this.adjList.vertexExists(data)) // prevent duplicates 
        {
            const vertex = new Vertex(data, x, y, 
            { 
                vertexSize:        this.config.vertexSize,
                vertexOutlineSize: this.config.vertexOutlineSize
            });

            this.adjList.insertVertex(vertex);
            this.vertexSpacialIndex.add(vertex);
            this.onVertexAdded.notify({ data: data, x: x, y: y });

            for(let i = 0; i < numEdges; i++)
                this.undo(this.indirectEdgeRemoveCommands);
        }
    },

    /**
     *  Removes a vertex from the given vertex data. Removes all 
     *  of the vertex's incident edges as well. Notifies everyone 
     *  of this removal, so far GraphView listens to this and 
     *  updates the visuals accordingly. 
     * 
     *  @param args an object of arguments given/required
     *              by this command method.
     *              {
     *                  symbol:        the vertex data,
     *                  x:             x coordinate of the point used for undo,
     *                  y:             y coordinate of the point used for undo,
     *                  toNeighbors:   array of incoming neighbor vertices used for undo,
     *                  fromNeighbors: array of outgoing neighbor vertices used for undo,
     *                  returnSymbol:  function to call to return generic symbol back to pool,
     *                  getSymbol:     function to call to get a new vertex symbol from pool
     *              }
     *  @throws String error message if one of the required command
     *          arguments is missing
     */
    removeVertex(args={})
    {
        this.assertArgs(args, ['symbol', 'x', 'y', 'numEdges'],
                            //    'returnSymbol', 'getSymbol'], 
                                'Missing arguments for removeVertex command');

        // const returnSymbol = args.returnSymbol;

        const data         = args.symbol;
        const removed      = this.adjList.getVertex(data);

        // Clean up edges
        removed.forEachEdge(function(edge)
        {
            this.dispatch(this.indirectEdgeRemoveCommands,
            {
                type: 'removeEdge',
                data: 
                {
                    from:   edge.from, 
                    to:     edge.to,
                    weight: edge.weight
                },
                undo: 'addEdge'
            });

        }.bind(this));

        this.adjList.deleteVertex(data);
        this.vertexSpacialIndex.remove(removed);
        this.returnSymbol(data);

        if(this.selectedVertex)
        {
            this.deselectVertex();
            this.releaseTrackingEdge();
        }

        this.onVertexRemoved.notify({ data: data });
    },

//====================== Edge Commands ===========================//

    /**
     *  Adds a new edge from the from/to vertex data given..
     *  Notifies everyone of this addition, so far GraphView listens
     *  to this and updates the visuals accordingly. 
     * 
     *  @param args an object of arguments given/required
     *              by this command method.
     *              {
     *                  from: the from vertex data,
     *                  to:   the to vertex data
     *              }
     *  @throws String error message if one of the required command
     *          arguments is missing
     */
    addEdge(args={})
    {
        this.assertArgs(args, ['from', 'to', 'weight'], 'Missing arguments for addEdge command');
        if(!this.adjList.vertexExists(args.from) || !this.adjList.vertexExists(args.to))
            throw 'Missing vertices in adjList for addEdge command';

        const from   = args.from;
        const to     = args.to;
        const weight = args.weight;  

        if(!this.adjList.edgeExists(from, to))
        {
            const edge = new Edge(args.from, args.to, this.config.edgeBoxSize, weight);
            
            this.adjList.insertEdge(edge);
            this.edgeSpacialIndex.add(edge);
            
            this.onEdgeAdded.notify
            ({ 
                from:      from,
                to:        to, 
                fromPoint: { x: edge.fromVertex.x, y: edge.fromVertex.y },
                toPoint:   { x: edge.toVertex.x,   y: edge.toVertex.y   },
                center:    { x: edge.x,            y: edge.y            },
                weight:    weight   
            });
        }
    },

    /**
     *  Removes an edge based on the from/to vertex data given.
     *  Notifies everyone of this removal, so far GraphView listens
     *  to this and updates the visuals accordingly. 
     * 
     *  @param args an object of arguments given/required
     *              by this command method.
     *              {
     *                  from: the from vertex data,
     *                  to:   the to vertex data
     *              }
     *  @throws String error message if one of the required command
     *          arguments is missing
     */
    removeEdge(args={})
    {
        this.assertArgs(args, ['from', 'to', 'weight'], 'Missing arguments for removeEdge command');
        if(!this.adjList.vertexExists(args.from) ||  !this.adjList.vertexExists(args.to)) 
            throw 'Missing vertices in adjList for removeEdge command';
        if(!this.adjList.edgeExists(args.from, args.to)) 
            throw 'edge was not found for removeEdge';

        const from = args.from;
        const to   = args.to;
        const edge = this.adjList.getEdge(from, to);
        
        // Clean Up Spacial Index
        this.adjList.deleteEdge(from, to);
        this.edgeSpacialIndex.remove(edge);
        this.onEdgeRemoved.notify
        ({ 
            from:      from,
            to:        to, 
            fromPoint: { x: edge.fromVertex.x, y: edge.fromVertex.y },
            toPoint:   { x: edge.toVertex.x,   y: edge.toVertex.y   },
            center:    { x: edge.x,            y: edge.y            }    
        });
    },

//====================== Move Entities ===========================//

    /**
     *  Move the given vertex object, to this x, y point, 
     *  and notifies everyone. so far GraphView listens to 
     *  this and updates the vertex visuals accordingly. 
     * 
     *  @param vertex the vertex object
     *  @param x x coordinate of this point  
     *  @param y y coordinate of this point
     */
    moveVertex(vertex, x, y)
    {
        // Update Vertex Position
        vertex.setPoints(x, y);
        this.vertexSpacialIndex.update(vertex);
        this.onVertexMoved.notify({ data: vertex.data, x: x, y: y });
        
        // Update Vertex's Edge Positions
        vertex.forEachEdge(function(edge)
        {
            this.moveEdge(edge); 

        }.bind(this));
    },

    /**
     *  Move the given edge object, updating its start and end
     *  points according to the vertices it is connected to.
     *  Notifies everyone, so far GraphView listens to this 
     *  and updates the edge visuals accordingly. 
     * 
     *  @param edge the edge object
     */
    moveEdge(edge)
    {
        edge.setPoints();
        this.edgeSpacialIndex.update(edge);

        const fromVertex = edge.fromVertex;
        const toVertex   = edge.toVertex;

        this.onEdgeMoved.notify
        ({  
            from: edge.from,
            to:   edge.to,
            fromPoint: { x: fromVertex.x, y: fromVertex.y }, 
            toPoint:   { x: toVertex.x,   y: toVertex.y   },
            center:    { x: edge.x,       y: edge.y       } 
        });
    },

//====================== Vertex Selection Methods ===========================//

    /**
     *  Sets this vertex as the selected vertex, and notifies everyone.
     *  So far GraphView listens to this and updates accordingly.
     * 
     *  @param vertex the vertex object to select
     */
    selectVertex(vertex)
    {
        this.selectedVertex = vertex;
        this.onVertexSelected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
    },

    /**
     *  Deselects the currently selected vertex and notifies everyone.
     *  So far GraphView listens to this and updates accordingly.
     */
    deselectVertex()
    {
        const vertex = this.selectedVertex;
        this.onVertexDeselected.notify({ data: vertex.data, x: vertex.x, y: vertex.y });
        this.selectedVertex = null;
    },

    /**
     *  Notifies that the the mouse tracking edge has been added
     *  from this point. So far GraphView listens to this and 
     *  updates accordingly.
     * 
     *  @param x x coordinate of this point  
     *  @param y y coordinate of this point
     */
    addTrackingEdge(x, y)
    {
        this.currentlyTracking = true;
        this.onTrackingEdgeAdded.notify
        ({ 
            start: { x: this.selectedVertex.x, y: this.selectedVertex.y },
            end:   { x: x, y: y }, 
        });
    },

    /**
     *  Notifies that the mouse tracking edge has moved to this point.
     *  So far GraphView listens to this and updates accordingly.
     * 
     *  @param x x coordinate of this point  
     *  @param y y coordinate of this point
     */
    updateTrackingEdge(x, y)
    {;
        this.onTrackingEdgeMoved.notify({ x: x, y: y });
    },

    /**
     *  Notifies that the mouse tracking edge is removed.
     *  So far GraphView listens to this and updates accordingly.
     */
    releaseTrackingEdge()
    {
        this.currentlyTracking = false;
        this.onTrackingEdgeRemoved.notify({});
    },

//====================== Edge Edit Methods ===========================//

    startEditingEdge(edge)
    {
        this.editingEdge = edge;
        this.onEdgeEditStarted.notify
        ({
            from:   edge.from,
            to:     edge.to,
            center: { x: edge.x, y: edge.y }
        });
    },

    editEdgeWeight(weight)
    {
        const edge  = this.editingEdge;
        edge.weight = weight;

        this.onEdgeWeightEditted.notify
        ({ 
            from:   edge.from,
            to:     edge.to,
            weight: weight   
        });  
    },

    clearEdgeEdit()
    {
        if(this.editingEdge)
        {
            this.onEdgeEditingFinished.notify();
            this.editingEdge = null;
        }
    },

//====================== Hover Methods ===========================//

    hoverVertex(vertex)
    {
        if(!this.vertexHovered) 
        {
            if(!this.selectedVertex || this.selectedVertex.data !== vertex.data)
            {
                this.hoverNothing();
                this.vertexHovered = vertex;
                this.onVertexHovered.notify({ data: vertex.data });
            }
        }
    },

    hoverEdge(edge)
    {
        if(!this.edgeHovered && !this.selectedVertex)
        {
            this.hoverNothing();
            this.edgeHovered = edge;
            this.onEdgeHovered.notify({ from: edge.from, to: edge.to });
        }
    },

    hoverNothing()
    {
        if(this.vertexHovered)
        {
            this.onVertexNotHovered.notify({ data: this.vertexHovered.data });
            this.vertexHovered = null;   
        }
        
        if(this.edgeHovered)
        {
            this.onEdgeNotHovered.notify
            ({ 
                from: this.edgeHovered.from, 
                to:   this.edgeHovered.to 
            });
            this.edgeHovered = null;
        }
    },

//====================== Spatial Index API (Graph -> Model -> Spatial) ===========================//

    /**
     *  Searches the Vertex Spatial Index for an vertex object
     *  clicked at this x, y point. Will return the vertex object
     *  or null. 
     * 
     *  @param x x coordinate of this point  
     *  @param y y coordinate of this point
     */
    vertexAt(x, y)
    {
        return this.vertexSpacialIndex.getEntity(x, y);
    },

    /**
     *  Searches the Edge Spatial Index for an edge object
     *  clicked at this x, y point. Will return the edge object
     *  or null. 
     * 
     *  @param x x coordinate of this point  
     *  @param y y coordinate of this point
     */
    edgeAt(x, y)
    {
        return this.edgeSpacialIndex.getEntity(x, y);
    },

    /**
     *  Update the SpatialIndex register of a vertex object,
     *  in addition to all of the connected edges due to the 
     *  fact that this should be called when the vertex is being
     *  moved, thus the edges connected have moved. 
     * 
     *  @param vertex the vertex object to update
     */
    updateVertexSpatial(vertex)
    {
        this.vertexSpacialIndex.update(vertex);
        
        vertex.forEachEdge(function(edge)
        {
            this.updateEdgeSpatial(edge); 

        }.bind(this)); 
    },

    /**
     *  Update the SpatialIndex register of an edge object 
     * 
     *  @param edge the edge object to update
     */
    updateEdgeSpatial(edge)
    {
        this.edgeSpacialIndex.update(edge);
    },

    /**
     *  Sets the new width/height and recreates the Spatialndex,
     *  re-registering all entities hitbox locations. 
     * 
     *  @param width  width desired, should be canvas width 
     *  @param height height desired, should be canvas width
     */
    resize(width, height)
    {
        this.setDimensions(width, height);

        this.vertexSpacialIndex = new SpacialIndex(width, height, this.cellRatio);
        this.adjList.forEachVertex(function(vertex)
        {
            this.vertexSpacialIndex.add(vertex);

        }.bind(this));

        this.edgeSpacialIndex = new SpacialIndex(width, height, this.cellRatio);
        this.adjList.forEachEdge(function(edge)
        {
            this.edgeSpacialIndex.add(edge);

        }.bind(this));
    },

    /**
     *  Sets the width/height info in the model, and consequently
     *  the cell width/height. This should reflect the canvas width/height.
     * 
     *  @param width  width desired, should be canvas width 
     *  @param height height desired, should be canvas width
     */
    setDimensions(width, height)
    {
        this.width      = width;
        this.cellWidth  = this.width / this.cellRatio;
        this.height     = height;
        this.cellHeight = this.height / this.cellRatio;
    },

//====================== Symbol Pool Methods  ===========================//

    getSymbol()
    {
        return this.symbols.pop();  
    },

    peekSymbol()
    {
        return this.symbols[this.symbols.length - 1];
    },

    returnSymbol(symbol)
    {
        this.symbols.push(symbol);
    },
};

export default GraphModel;
