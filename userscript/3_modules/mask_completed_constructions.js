Module.register(function() {

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_link_show'] = 'Show completed constructions';
        i18n[I18N.LANG.EN][MODULE_NAME + '_link_hide'] = 'Hide completed constructions';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Permettre de cacher les constructions finies';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute un lien dans la page constructions permettant de cacher les constructions finies.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_link_show'] = 'Montrer les constructions finies';
        i18n[I18N.LANG.FR][MODULE_NAME + '_link_hide'] = 'Cacher les constructions finies';

        I18N.set(i18n);
    }

    /**
     * Call on a link click.
     */
    function on_link_click()
    {
        this.properties.hide_completed_constructions = !this.properties.hide_completed_constructions;
        this.save_properties();
    }

    /**
     * Insert hide/show link into the dom.
     */
    function insert_links_in_dom(nodes)
    {
        // if the two links are already present, then abort
        if (nodes[0].childNodes.length > 1) {
            return;
        }

        var right_link = nodes[0].firstChild;

        // Clone node and set the wanted properties (to keep the
        // right link behaviour)
        var link = right_link.cloneNode(false);
        link.style.cssFloat = 'left';
        link.textContent = this.properties.hide_completed_constructions ? I18N.get(MODULE_NAME + '_link_show') : I18N.get(MODULE_NAME + '_link_hide');

        var f = on_link_click.bind(this);
        link.addEventListener('click', function() {
            f();
        }, false);

        nodes[0].insertBefore(link, nodes[0].firstChild);
    }

    /**
     * Hide constructions if needed | Add the link.
     */
    function add_link()
    {
        // Abort if not on the building page
        if (!D2N.is_on_page_in_city('buildings')) {
            return;
        }

        // Hide the constructions if needed
        if (this.properties.hide_completed_constructions) {
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

        var f = insert_links_in_dom.bind(this);
        JS.wait_for_class('tinyAction', function(nodes) {
            f(nodes);
        });
    }

    /**
     * Mask the completed constructions (add the link to toggle this behaviour
     * in the DOM).
     * @param boolean listen_for_gamebody_reload Whether or not listen for the
     * gamebody reload event
     */
    function mask_completed_constructions(listen_for_gamebody_reload)
    {
        listen_for_gamebody_reload = listen_for_gamebody_reload || false;

        if (!D2N.is_in_city()) {
            return;
        }

        add_link.call(this);

        // Add the link again on each page reload
        if (listen_for_gamebody_reload) {
            var f = add_link.bind(this);
            document.addEventListener('d2n_gamebody_reload', function() {
                f();
            }, false);
        }
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
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                mask_completed_constructions.call(this, true);
            }
        }

    };
});
