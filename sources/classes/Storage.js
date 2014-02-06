/******************************************************************************
 *                                                                            *
 *  Storage class                                                       *
 *                                                                            *
 ******************************************************************************/

function Storage()
{
}


/*************
 * Constants *
 *************/


/********************************
 * Static methods and variables *
 ********************************/

/*
 * Will prefix the key every time it is used. Never modify this value directly.
 */
Storage.key_prefix = '';

/**
 * Define a new prefix. A string is mandatory, otherwise the setter aborts.
 * @param string new_prefix The new prefix
 */
Storage.set_key_prefix = function(new_prefix)
{
    if (typeof new_prefix !== "string") {
        return;
    }
    Storage.key_prefix = new_prefix;
};

/**
 * Get a value from the storage.
 * @param string key The key to fetch
 * @return string The related value
 * @return null if the key isn't found
 */
Storage.get = function(key)
{
    var ret = localStorage[Storage.key_prefix + key];

    return (typeof ret === 'undefined') ? null : ret;
};

/**
 * Set a value in the storage.
 * @param string key The key to insert or distort
 * @param mixed value The value to put in
 */
Storage.set = function(key, value)
{
    localStorage[Storage.key_prefix + key] = value + ''; // explicit string cast
};
