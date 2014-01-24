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
    this.name = param.name;
    this.type = (typeof param.type === 'undefined') ? Module.TYPE.UNKNOWN : param.type;
    this.config = param.config;
    this.action = param.action;
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
    this.config.enabled = false;
    this.save_config();
};

/**
 * Enable the module.
 */
Module.prototype.enable = function()
{
    this.config.enabled = true;
    this.save_config();
};

/**
 * Toggle the module.
 */
Module.prototype.toggle = function()
{
    this.config.enabled = !this.config.enabled;
    this.save_config();
};

/**
 * Check if the module is enabled.
 * @return bool true if the module is enabled, false otherwise
 */
Module.prototype.is_enabled = function()
{
    return !!this.config.enabled;
};

/**
 * Save the module configuration in the Storage.
 */
Module.prototype.save_config = function()
{
    Storage.set(this.get_storage_key(), JSON.stringify(this.config));
};


/*************
 * Constants *
 *************/

/*
 * The different types of module and their loading priority order.
 */

Module.TYPE = {};
Module.TYPE.CONTAINER = 0;             // Used by the passive containers
Module.TYPE.INTERFACE_ENHANCEMENT = 1; // Used to custom the interface
Module.TYPE.EXTERNAL_TOOL = 2;         // Used to sync. external tools
Module.TYPE.UNKNOWN = 3;               // Unknown type

/*
 * The order in which the types will be loaded.
 */

Module.LOADING_PRIORITY_ORDER = [
    Module.TYPE.CONTAINER,
    Module.TYPE.INTERFACE_ENHANCEMENT,
    Module.TYPE.EXTERNAL_TOOL,
    Module.TYPE.UNKNOWN
];


/********************************
 * Static methods and variables *
 ********************************/

/**
 * Stores all the modules. Never access it directly.
 */
Module.modules_ = {};

/**
 * Indexes all the modules by type. Never access it directly.
 */
Module.type_ = {};

/**
 * Add a module to the internal list. You don't have to allocate it, for
 * example:
 *
 *         Module.add({
 *             param1: 'hello',
 *             param2: 'world'
 *         });
 *
 * If you need a private context, you can do like so:
 *
 *         Module.add((function() {
 *             var private_var;
 *
 *             return {
 *                 param1: 'hello',
 *                 param2: 'world'
 *             };
 *         )());
 *
 * @param Object param The parameters to construct the new module
 */
Module.add = function(param)
{
    // Create the module
    var module = new Module(param);

    // Add module to the list
    Module.modules_[module.name] = module;

    // Insert it in the type index
    if (typeof Module.type_[module.type] === 'undefined') {
        Module.type_[module.type] = [];
    }
    Module.type_[module.type].push(module);
};

/**
 * Return the number of modules.
 * @return integer The number of modules
 */
Module.count = function()
{
    return Module.modules_.length;
};

/**
 * Iterate over all the modules.
 * @param Function callback The function to call, it takes one parameter: a
 *                          module.
 */
Module.iterate = function(callback)
{
    var modules = Module.modules_;

    JS.each(modules, function(module) {
        callback(module);
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
    if (typeof Module.type_[type] === 'undefined') {
        return;
    }
    Module.type_[type].forEach(function(module) {
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
    Module.LOADING_PRIORITY_ORDER.forEach(function(type) {
        Module.iterate_on_type(type, callback);
    });
}
