/**
 *  @author Jake Landowski
 *  7/16/18
 *  View.js
 * 
 *  Prototype for a simple View to be customized by various components.
 */

define(function()
{
    const View = function(model, element)
    {
        this.model = model;
        this.element = element;
        // this.onChanged = new Event(this);
        
        this.model.onSet.attach(function()
        {
            this.show();
        });

        // this.element.addEventListener('change', function(event)
        // {
        //     this.onChanged.notify(event.target.value);
        // });
    };

    View.prototype = 
    {
        show()
        {
            this.element.value = this.model.get();
        }
    };

    return View;
});