Module.register(function() {

    var MODULE_NAME = 'outside_empty_bag';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Empty the backpack in one click';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'You can empty your bagpack only one click while outside.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_tooltip'] = 'Click to drop all your objects on the ground.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_confirm'] = 'Are you sure you want to drop all your objects on the ground? Others players will be able to take them.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Permettre de vider son sac en une fois';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Lorsque vous êtes à l\'extérieur, il peut être pratique de vider votre sac en une fois. Cette option rend le bouton "Sac à Dos" cliquable et permet de vider son contenu entier dans l\'Outre-Monde.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_tooltip'] = 'Cliquez pour déposer tous vos objets par terre.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_confirm'] = 'Êtes-vous sûr de vouloir déposer vos objets par terre ? D\'autres joueurs seront en mesure d\'en prendre possession.';

        I18N.set(i18n);
    }

    /**
     * Drop the first object in the given list.
     */
    function drop_first_item()
    {
        document.removeEventListener('d2n_gamebody_reload', drop_first_item);

        // Find the first item and try to drop it
        JS.wait_for_selector('ul.tools.shortTools.bagInv > li:nth-child(n + 3):not(.clear) > a', function found(item) {
            // if it a free slot, abort
            if (item.classList.contains('freeSlot')) {
                // all items have been dropped, reload the content
                D2N.get_session_key(function(sk) {
                    JS.injectJS('js.XmlHttp.get(' + JSON.stringify('outside/refresh?sk=' + sk) + ');');
                });
                return;
            }

            var onclick = item.getAttributeNode('onclick').nodeValue;
            var url = onclick.split('\'')[1];

            JS.injectJS('js.XmlHttp.get(' + JSON.stringify(url) + ');');

            // If in camping, try to drop an item to show the MT error and abort
            if (D2N.is_camping()) {
                return;
            }

            // When the item is removed, drop the second
            document.addEventListener('d2n_gamebody_reload', drop_first_item);
        });
    }

    /**
     * Called when the user clicks on the bagpack button.
     */
    function on_bagpack_button_click()
    {
        // if the user confirms
        if (window.confirm(I18N.get(MODULE_NAME + '_confirm'))) {
            // drop his/her objects
            drop_first_item();
        }
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
                category: Module.PROPERTY_CATEGORY.OUTSIDE,
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
                JS.injectCSS(
                    'ul.tools.shortTools.bagInv > li:nth-child(2) {' +
                        'cursor: pointer;' +
                    '}');

                document.addEventListener('d2n_gamebody_reload', function() {
                    // if not outside, abort
                    if (!D2N.is_outside()) {
                        return;
                    }

                    // get bagpack and register the click event
                    var bagpack = JS.wait_for_selector('ul.tools.shortTools.bagInv > li:nth-child(2)', function(node) {
                        node.addEventListener('click', function() {
                            on_bagpack_button_click();
                        }, false);

                        // add the tooltip
                        JS.injectJS(
                            'var el = document.querySelector(\'ul.tools.shortTools.bagInv > li:nth-child(2)\');' +
                            'el.onmouseover = function(event) {' +
                                'return js.HordeTip.showSpecialTip(this, \'simpleTip\', \'\', ' + JSON.stringify(I18N.get(MODULE_NAME + '_tooltip')) + ', event);' +
                            '};' +
                            'el.onmouseout = function(event) {' +
                                'return js.HordeTip.hide(event);' +
                            '};');

                    });
                }, false);
            }
        }

    };
});

