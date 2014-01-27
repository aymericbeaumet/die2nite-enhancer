/******************************************************************************
 *                                                                            *
 *  Module class                                                              *
 *                                                                            *
 ******************************************************************************/

/**
 * Module class constructor.
 * @param Object param The parameters to construct the module
 * @return Module The newly created module
 */
function Module(param)
{
    var f = JS.assign_attribute.bind(this);

    // Copy all the param into this
    JS.each(param, function(key, value) {
        f(key, value);
    });

    // Fill the type with the appropriate const if not defined
    this.type = (typeof param.type === 'undefined') ? Module.TYPE.UNKNOWN : param.type;

    // Fetch module properties from the Storage
    this.fetch_properties();
}


/******************
 * Public methods *
 ******************/

/**
 * Return the storage key for the module.
 * @return string The storage key
 */
Module.prototype.get_storage_key = function()
{
    return 'module.' + this.name;
};

/**
 * Disable the module.
 */
Module.prototype.disable = function()
{
    this.properties.enabled = false;
    this.save_properties();
};

/**
 * Enable the module.
 */
Module.prototype.enable = function()
{
    this.properties.enabled = true;
    this.save_properties();
};

/**
 * Toggle the module.
 */
Module.prototype.toggle = function()
{
    this.properties.enabled = !this.properties.enabled;
    this.save_properties();
};

/**
 * Check if the module is enabled.
 * @return bool true if the module is enabled, false otherwise
 */
Module.prototype.is_enabled = function()
{
    return !!this.properties.enabled;
};

/**
 * Save the module properties in the Storage.
 */
Module.prototype.save_properties = function()
{
    Storage.set(this.get_storage_key(), JSON.stringify(this.properties));
};


/**
 * Fetch the properties from the Storage. Update the module with the fetched
 * ones.
 */
Module.prototype.fetch_properties = function()
{
    // Fetch its properties from the Storage
    var storage_properties = JSON.parse(Storage.get(this.get_storage_key()));

    // Merge the storage properties into the default properties
    JS.merge(this.properties, storage_properties);
};


/*************
 * Constants *
 *************/

/**
 * The different property types.
 */

Module.PROPERTIES = {};
Module.PROPERTIES.BOOLEAN = 0;


/********************************
 * Static methods and variables *
 ********************************/

/**
 * Stores all the registered modules, before they are initialised. Never access
 * it directly.
*/
Module.registered_ = [];

/**
 * Stores all the modules. Never access it directly.
 */
Module.modules_ = {};

/**
 * Indexes all the modules by type. Never access it directly.
 */
Module.modules_by_type_ = {};

/**
 * The different module types. You can read this variable directly.
 */
Module.TYPE = {};
Module.TYPE.UNKNOWN_TYPE = 1;

/**
 * The order in which the module types should be browsed.
 */
Module.TYPE_LOADING_ORDER = [];

/**
 * Register a function returning a configuration object which will be used to
 * instanciate a new module.
 *
 *         Module.add(function() {
 *             var private_var;
 *
 *             return {
 *                 param1: 'hello',
 *                 param2: 'world'
 *             };
 *         });
 *
 * @param Function param_constructor A function returning the configuration object
 */
Module.register = function(param_constructor)
{
    Module.registered_.push(param_constructor);
};

/**
 * Allocate and initialise all the modules
 */
Module.init = function()
{
    // Loop to initialise any registered module
    Module.registered_.forEach(function(param_constructor) {
        var param = param_constructor();

        // Check if the module can run in the current environment / website
        // language
        if (typeof param === 'undefined' ||
            typeof param.actions === 'undefined' ||
            typeof param.actions.can_run !== 'function' ||
            !param.actions.can_run()) {

            return;
        }

        // Create the module
        var module = new Module(param);

        // Add module to the list
        Module.modules_[module.name] = module;

        // Insert it in the type index
        if (typeof Module.modules_by_type_[module.type] === 'undefined') {
            Module.modules_by_type_[module.type] = [];
        }
        Module.modules_by_type_[module.type].push(module);

        // Call the 'init' method if any
        if (typeof module.actions.init !== 'undefined') {
            module.actions.init.call(module);
        }
    });

    // Empty the registered modules list
    Module.registered_ = null;
};

/**
 * Return the number of modules.
 * @return integer The number of modules
 */
Module.count = function()
{
    return Object.keys(Module.modules_).length;
};

/**
 * Iterate over all the modules.
 * @param Function callback The function to call, it takes one parameter: a
 *                          module.
 */
Module.iterate = function(callback)
{
    var modules = Module.modules_;

    JS.each(modules, function(key, value) {
        callback(value);
    });
};

/**
 * Iterate over a specific module type.
 * @param Const type The module type
 * @param Function callback The function to call, it takes one parameter: a
 *                          module.
 */
Module.iterate_on_type = function(type, callback)
{

    // if the type is not defined, abort
    if (typeof Module.modules_by_type_[type] === 'undefined') {
        return;
    }

    Module.modules_by_type_[type].forEach(function(module) {
        callback(module);
    });
}

/**
 * Iterate over all the modules in the priority order.
 * @param Function callback The function to call, it takes one parameter: a
 *                          module.
 */
Module.iterate_in_priority_order = function(callback)
{
    Module.TYPE_LOADING_ORDER.forEach(function(type) {
        Module.iterate_on_type(Module.TYPE[type], callback);
    });
}

/**
 * Return a specific module from its name.
 * @param string name The module name
 * @return Module The desired module
 * @return null if the module is not found
 */
Module.get = function(name)
{
    if (Module.modules_.hasOwnProperty(name)) {
        return Module.modules_[name];
    }
    return null;
};

/**
 * Define a new module type.
 * @param string type The new type
 */
Module.add_type = function(type)
{
    var biggest = 0;

    // Obtain a unique type id by fetching the biggest id and adding one;
    for (var key in Module.TYPE) {
        biggest = (Module.TYPE[key] > biggest) ? Module.TYPE[key] : biggest;
    }

    Module.TYPE[type] = biggest + 1;
}

/**
 * Define a new types priority order.
 * @param string[] An array of module type
 */
Module.set_types_loading_order = function(new_order)
{
    Module.TYPE_LOADING_ORDER = new_order;
}
