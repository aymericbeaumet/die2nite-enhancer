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
 * Define a new prefix.
 * @param string new_prefix The new prefix
 */
Storage.set_key_prefix = function(new_prefix)
{
    Storage.key_prefix = new_prefix;
};

/**
 * Get a value from the storage.
 * @param string key The key to fetch
 * @return string The related value
 */
Storage.get = function(key)
{
    return localStorage[Storage.key_prefix + key];
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
