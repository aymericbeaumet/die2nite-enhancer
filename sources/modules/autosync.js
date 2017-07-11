Module.register(function() {

    var MODULE_NAME = 'external_tools_bar_autosync';

    /******************
     * Module context *
     ******************/
    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_name'] = 'autosync';
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable automatic synchronization';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Allow the script to automatically update external tools at each page refresh.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_name'] = 'autosync';
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer la synchronisation automatique';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute la possibilité de synchroniser automatiquement les sites externes à chaque rafraîchissement de la page.';

        I18N.set(i18n);
    }

    /************************
     * Module configuration *
     ************************/

    /**
    * Load the module.
    */
    function load_module()
    {
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {

        });
    }

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

        properties: {
            enabled: true
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.EXTERNAL_TOOL,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function(){
                add_i18n();
            },

            load: function() {
                var loaded = false;

                if (!D2N.is_on_page_in_city('bank') && !D2N.is_outside()) {
                    return;
                }

                var module = Module.get("external_tools_bar");

                if (!module.is_enabled()) {
                    return;
                }
            }
        }

    };
});
