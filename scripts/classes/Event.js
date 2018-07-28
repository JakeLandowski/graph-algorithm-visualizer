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
        this.listeners = Object.create(null);
        this.enable();
    };

    Event.prototype = 
    {
        attach(name, listener)
        {
            this.listeners[name] = listener;
        },

        detach(name)
        {
            if(this.listeners[name]) delete this.listeners[name];
        },

        notify(args)
        {
            if(this.enabled)
            {
                for(let listener in this.listeners)
                {
                    this.listeners[listener](this.sender, args);
                }
            }
        },

        disable()
        {
            this.enabled = false;
        },

        enable()
        {
            this.enabled = true;
        }
    };

    return Event;
});