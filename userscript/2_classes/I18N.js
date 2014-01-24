/******************************************************************************
 *                                                                            *
 *  I18N class                                                                *
 *                                                                            *
 ******************************************************************************/

function I18N()
{
}


/*************
 * Constants *
 *************/

/**
 * Languages constants, you should use them when adding or retrieving
 * internationalised strings.
 */

I18N.LANG = {};
I18N.LANG.EN = 'en';
I18N.LANG.FR = 'fr';
I18N.LANG.ES = 'es';
I18N.LANG.DE = 'de';


/********************************
 * Static methods and variables *
 ********************************/

/**
 * This language will be provided if the requested language is not available.
 */
I18N.default_language_ = I18N.LANG.EN;

/**
 * This language will be used when the user does a get request without
 * specifying the language to fetch.
 */
I18N.language_ = I18N.default_language;

/**
 * Store all the keys of the extension. Use the accessors  `I18N.add` and
 * `I18N.get` to register (a) new key(s) or get key.
 */
I18N.keys_ = {};

/**
 * Set the language that will be used when strings are requested.
 * @param string language The default language
 */
I18N.set_language = function(language)
{
    I18N.language_ = language;
};

/**
 * Add some strings to the keys_ object. The `keys` should be of the following
 * form:
 *
 *     var i18n = {
 *         "say_hello": {
 *             I18N.LANG.EN: { "Hello" },
 *             I18N.LANG.FR: { "Bonjour" },
 *             I18N.LANG.ES: { "Hola" },
 *             I18N.LANG.DE: { "Hallo" }
 *         }
 *     };
 *     I18N.set(i18n);
 */
I18N.set = function(keys)
{
    I18N.keys_ = JS.merge(I18N.keys_, keys);
};

/**
 * Retrieve a internationalised string.
 * @param string key The key to fetch
 * @param string lang (optional) The lang to fetch (use the class const)
 * @return string The internationalised string
 * @return null If an error occurs (unknown language/key)
 */
I18N.get = function(key, lang)
{
    lang = (typeof lang === 'undefined') ? I18N.language_ : lang;

    if (typeof I18N.keys_[key] !== 'undefined') {
        [lang, I18N.default_language].forEach(function(lang) {
            if (typeof I18N.keys_[key][lang] === 'string') {
                return I18N.keys_[key][lang];
            }
        });
    }

    return null;
};
