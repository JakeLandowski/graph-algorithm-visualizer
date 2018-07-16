/**
 *  @author Jake Landowski
 *  7/16/18
 *  Event.js
 * 
 *  For creating custom events to be used by Model.js and View.js
 */

define(function()
{
    const Event = function(sender)
    {
        this.sender = sender;
        this.listeners = [];
    };

    Event.prototype = 
    {
        attach(listener)
        {
            this.listeners.push(listener);
        },

        notify(args)
        {
            this.listeners.forEach(function(v, i)
            { 
                this.listeners[i](this.sender, args);
            });
        }
    };

    return Event;
});