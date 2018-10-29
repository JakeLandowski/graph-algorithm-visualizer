/**
 *  @author Jake Landowski
 *  7/16/18
 *  Event.js
 * 
 *  For creating custom events to be used by Model.js and View.js
 */

'use strict';

const Event = function(sender)
{
    this.sender = sender;
    this.listeners = Object.create(null);
    this.enable();
    this.canNotify = true;
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
        if(this.canNotify)
        {
            if(this.enabled)
            {
                for(const listener in this.listeners)
                {
                    this.listeners[listener](this.sender, args);
                }
            }
        }
        else this.canNotify = true;
    },

    disable()
    {
        this.enabled = false;
    },

    enable()
    {
        this.enabled = true;
    },

    stopNextNotify()
    {
        this.canNotify = false;
    }
};

export default Event;