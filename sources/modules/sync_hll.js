Module.register(function() {

    var MODULE_NAME = 'sync_hll';

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
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Affiche les informations Hordes La Loi d\'un citoyen';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Permet d\'afficher les recommandations et plaintes d\'un citoyen sur le site externe Hordes La Loi.';

        I18N.set(i18n);
    }

    function add_citizens_note(response){
        var parser = new DOMParser();
        console.log(response);
        var xmlDoc = parser.parseFromString(response.responseText, "text/xml");

    }

    function network_failure(){

    }

    function extract_citizens_id(selector)
    {
        var citizens_link = document.querySelectorAll(selector);
        var ret = [];
        var regex = /uid=(\d+)/;
        var regex_results;

        for (var i = 0, max = citizens_link.length; i < max; i++) {
            regex_results = regex.exec(citizens_link[i].href);
            if (regex_results.length > 1) {
                ret.push(regex_results[1]);
            }
        }

        return ret;
    }

    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.CITIZENS,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!D2N.is_on_page_in_city('citizens')) {
                        return;
                    }

                    JS.wait_for_selector('div.citizens', function(el) {
                        var citizens = extract_citizens_id('a.tid_user[href^="/#ghost/city?go=ghost/user?uid="]');

                        console.log("Network request for citizens on the @ " + "https://hordes-la-loi.fr/xml/users/search.xml:" + citizens.join(','));
                        JS.network_request(
                            "GET",
                            "https://hordes-la-loi.fr/xml/users/search.xml:" + citizens.join(','),
                            null,
                            null,
                            add_citizens_note,
                            network_failure
                        );
                    });
                }, false);
            }
        }

    };
});
