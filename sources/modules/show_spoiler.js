Module.register(function() {

    var MODULE_NAME = 'show_spoiler';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Show the spoilers without mouse hover';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Show the spoilers content without hovering with your mouse.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Afficher les spoilers sans passer la souris';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Affiche le contenu des spoilers sans avoir besoin de passer la souris.';

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
                category: Module.PROPERTY_CATEGORY.FORUM,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return !D2NE.is_restricted_mode();
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                var css =
                    '.tid_editorContent .tid_spoil {';

                // If davf's module is loaded, we need to adapt the CSS rules
                var old_forum_tags = Module.get('davf_old_forum_tags');
                if (old_forum_tags !== null && old_forum_tags.is_enabled()) {
                    css +=
                        'background-image: url("/gfx/design/spoiler.gif") !important;' +
                        'background-color:transparent !important;' +
                        'color : #98a675 !important;';

                // If not loaded, just do the normal ones
                } else {
                    css +=
                        'background-image: url("http://data.twinoid.com/img/design/spoiler_hover.png");';
                }

                css +=
                    '}' +
                    '.tid_editorContent .tid_spoil *, .tid_editorContent .tid_wspoil {' +
                        'visibility: visible !important;' +
                    '}' +
                '';

                JS.injectCSS(css);
            }
        }

    };
});
