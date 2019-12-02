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
        document.addEventListener('d2n_gamebody_reload', function(event) {
            js.XmlHttp._d2ne_onStart = js.XmlHttp.onStart;
            js.XmlHttp.onStart = function(ev){
                if(ev === undefined) return;
                var url = ev.url;
                if(url.startsWith('/outside/go')) {
                    var module = Module.get("external_tools_bar");
                    JS.wait_for_id(module.container_id, function(node){

                        if (module === null || !module.is_enabled()) {
                            return;
                        }

                        module.actions.refresh();
                    });
                }
                this._d2ne_onStart();
            };
        }.bind(this), true);
        /*document.addEventListener('d2n_gamebody_reload', function(event) {
            if (!D2N.is_on_page_in_city('bank') && !D2N.is_outside()) {
                return;
            }

            // En attendant d'avoir une solution pour synchro uniquement quand on se déplace
            return;

            var module = Module.get("external_tools_bar");
            JS.wait_for_id(module.container_id, function(node){

                if (module === null || !module.is_enabled()) {
                    return;
                }

                module.actions.refresh();
            });
        }.bind(this), false);*/
    }

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

        properties: {
            enabled: false,
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
                return false;
            },

            init: function(){
                add_i18n();
            },

            load: function() {
                load_module();
            }
        }

    };
});
