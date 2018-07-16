/**
 *  @author Jake Landowski
 *  7/16/18
 *  Model.js
 * 
 *  Prototype for a simple Model to be customized by various components.
 */

 define(function()
 {
    const Model = function(data)
    {
        this.data = data;
        // this.onSet = new Event(this);
    };

    Model.prototype = 
    {
        get() 
        { 
            return this.data; 
        },

        set(data)
        {
            this.data = data;
            // this.onSet.notify({ data: data });
        }
    };

    return Model;
 });
