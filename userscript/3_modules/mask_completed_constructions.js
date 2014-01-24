Module.register((function() {

    var MODULE_NAME = 'mask_completed_constructions';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Allow to mask completed constructions'; 
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'While on the construction page, add a link to mask all the completed constructions.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Permettre de cacher les constructions finies';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute un lien dans la page constructions permettant de cacher les constructions finies.';

        I18N.set(i18n);
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false,
            hide_completed_constructions: false
        },

        configurable: {
            enabled: {
                type: Module.PROPERTIES.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            init: function() {
                add_i18n();
            },

            load: function() {
                if (!D2N.is_in_city()) {
                    return;
                }

                // Hide constructions if needed | Add the link
                var add_link = function() {
                    // Abort if not on the building page
                    if (!D2N.is_on_page_in_city('buildings')) {
                        return;
                    }

                    // Hide the constructions if needed
                    if (configuration_.hide_completed_constructions) {
                        JS.injectCSS(
                            'tr.building.done {' +
                                'display: none;' +
                            '}'
                        );
                    // Else show the constructions
                    } else {
                        JS.injectCSS(
                            'tr.building.done {' +
                                'display: table-row;' +
                            '}'
                        );
                    }

                    JS.wait_for_class('tinyAction', function(nodes) {
                        // if the two links are already present, then abort
                        if (nodes[0].childNodes.length > 1) {
                            return;
                        }

                        var right_link = nodes[0].firstChild;

                        // Clone node and set the wanted properties (to keep the
                        // right link behaviour)
                        var link = right_link.cloneNode(false);
                        link.style.cssFloat = 'left';
                        link.textContent = configuration_.hide_completed_constructions ? i18n_.show_completed_constructions : i18n_.hide_completed_constructions;
                        link.addEventListener('click', function() {
                            configuration_.hide_completed_constructions = !configuration_.hide_completed_constructions;
                            save_configuration();
                        }, false);

                        nodes[0].insertBefore(link, nodes[0].firstChild);
                    });
                };
                add_link();

                // Add the link again on each page reload
                document.addEventListener('d2n_gamebody_reload', function() {
                    add_link();
                }, false);
            }
        }

    };
})());
