Module.register(function() {

    var MODULE_NAME = 'cyanide_protection';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable cyanide protection';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Avoid to eat cyanide by accident by deleting the link to use it.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Protéger contre le cyanure';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Evite de s\'empoisonner au cyanure par accident en supprimant le lien permettant son utilisation.';

        I18N.set(i18n);
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
                category: Module.PROPERTY_CATEGORY.CITIZEN,
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
                    // if not at home or outside (the two only places where a player
                    // can use an object), abort
                    if (!(D2N.is_on_page_in_city('home') || D2N.is_outside())) {
                        return;
                    }

                    // else list all the possible objects usable by the player
                    JS.wait_for_selector_all('a.toolAction > span > strong', function(nodes) {
                        var action;

                        nodes.forEach(function(node) {
                            // Skip the node if not a 'strong' element
                            if (nodes[node].nodeName !== 'STRONG') {
                                return;
                            }

                            // Hide the node if cyanure
                            if (/^Cyanide|Cyanure|Cianuro$/.test(nodes[node].textContent)) {
                                action = nodes[node].parentNode.parentNode;
                                action.style.display = 'none';
                            }
                        });
                    }, 5);
                }, false);
            }
        }

    };
});
