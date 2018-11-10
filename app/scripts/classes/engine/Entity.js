/**
 *  @author Jake Landowski
 *  8/8/18
 *  Entity.js
 * 
 *  Superclass for shape classes to extend, just a conglomeration
 *  of shared properties and functions.
 */

'use strict';

const Entity = function(context, engine, level)
{
    this.context = context;
    this.engine  = engine;
    this.level   = level;
    this.styles  = Object.create(null);
};

Entity.prototype = 
{
    delete()
    {
        this.engine.deleteEntity(this.id);
    },
    
    sendToLayer(newLevel)
    {
        this.engine.moveEntityToLayer(this.id, this.level, newLevel);
        this.level = newLevel;
    },

    sendToFront()
    {
        this.sendToLayer(this.engine.maxLayer());
    },

    sendToBack()
    {
        this.sendToLayer(0);
    }
};

export default Entity;