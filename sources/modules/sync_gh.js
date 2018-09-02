Module.register(function() {

    var MODULE_NAME = 'sync_gh';

    /******************
     * Module context *
     ******************/

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_name'] = "Gest'Hordes";
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Activer la synchronisation Gest'Hordes";
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Ajoute la possibilité de synchroniser avec Gest'Hordes.";

        I18N.set(i18n);
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.EXTERNAL_TOOL,

        properties: {
            enabled: false,
            tool: {
                directory_id: 199,
                api_key: null,
                update_method: 'GET',
                update_url: 'https://gest-hordes.meta-roh.com/'
            },
            isProtected: false
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
                return D2N.is_on_hordes();
            },

            init: function() {
                add_i18n();
            },

            update: function(callback_success, callback_failure) {
                JS.network_request(
                    this.properties.tool.update_method,
                    this.properties.tool.update_url,
                    'reset&code=' + this.properties.tool.api_key + '&action=force_maj',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        if(response_text != ""){
                            return callback_success();
                        }
                        return callback_failure();
                    },
                    function(xhr) {
                        return callback_failure();
                    }
                );
            }
        }

    };
});
