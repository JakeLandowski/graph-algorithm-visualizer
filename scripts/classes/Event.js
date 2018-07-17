/**
 *  @author Jake Landowski
 *  7/16/18
 *  Event.js
 * 
 *  For creating custom events to be used by Model.js and View.js
 */

define(function()
{
    console.log('Event Class loaded');

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
            this.listeners.forEach(function(listener)
            { 
                listener(this.sender, args);
            });
        }
    };

    return Event;
});