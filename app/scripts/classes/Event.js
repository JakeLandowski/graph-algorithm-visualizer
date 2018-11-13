/**
 *  @author Jake Landowski
 *  7/16/18
 *  Event.js
 * 
 *  For creating custom events to be used by Model.js and View.js
 */

'use strict';

/**
 * Creates a new Event for others to observe and be notified.
 * @class
 * @constructor
 * @param {object} sender - the object/class creating this
 */
const Event = function(sender)
{
    this.sender = sender;
    this.listeners = Object.create(null);
    this.enable();
    this.canNotify = true;
};

Event.prototype = 
{
    /**
     * Attaches a callback with an associatad name.
     * @param {string} name - the name to associate 
     * with the callback
     * @param {function} listener - the callback to 
     * execute
     */
    attach(name, listener)
    {
        this.listeners[name] = listener;
    },

    /**
     * Removes a callback identified by a name.
     * @param {string} name - the name associated with 
     * a callback 
     */
    detach(name)
    {
        if(this.listeners[name]) delete this.listeners[name];
    },

    /**
     * Notifies all listeners with given data arguments,
     * executes all callbacks.
     * @param {object} args - the data to send to listeners 
     */
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

    /**
     * Disables this event, preventing it from notifying
     * listeners.
     */
    disable()
    {
        this.enabled = false;
    },

    /**
     * Enables this event, allowing it to notify listeners.
     */
    enable()
    {
        this.enabled = true;
    },

    /**
     * Prevents the next call to notify() from doing anything.
     */
    stopNextNotify()
    {
        this.canNotify = false;
    }
};

export default Event;