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
I18N.strings_ = {};

/**
 * Set the language that will be used when strings are requested.
 * @param string language The default language
 */
I18N.set_language = function(language)
{
    I18N.language_ = language;
};

/**
 * Add some strings to the strings_ object. The `keys` should be of the following
 * form:
 *
 *     var i18n = {};
 *     i18n[I18N.LANG.EN] = {};
 *     i18n[I18N.LANG.EN]['say_hello'] = 'Hello';
 *     i18n[I18N.LANG.FR] = {};
 *     i18n[I18N.LANG.FR]['say_hello'] = 'Bonjour';
 *     i18n[I18N.LANG.ES] = {};
 *     i18n[I18N.LANG.ES]['say_hello'] = 'Hola';
 *     i18n[I18N.LANG.DE] = {};
 *     i18n[I18N.LANG.DE]['say_hello'] = 'Hallo';
 *
 *     I18N.set(i18n);
 */
I18N.set = function(new_strings)
{
    JS.merge(I18N.strings_, new_strings);
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
    var languages = [lang, I18N.default_language_];

    for (var i = 0, max = languages.length; i < max; ++i) {
        var language = languages[i];

        if (typeof I18N.strings_[language] !== 'undefined') {
            if (typeof I18N.strings_[language][key] === 'string') {
                return I18N.strings_[language][key];
            }
        }
    }

    return null;
};
