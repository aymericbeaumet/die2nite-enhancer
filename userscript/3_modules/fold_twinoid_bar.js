Module.register(function() {

    var MODULE_NAME = 'fold_twinoid_bar';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Fold Twinoid bar'; 
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Fold the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Replier la barre Twinoid';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Replie la barre Twinoid en haut de l\'écran. Rapprochez votre souris du bord supérieur de l\'écran pour l\'afficher de nouveau.';

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
                JS.injectCSS(
                    '#tid_bar {' +
                        'display: none;' +
                        'position: fixed;' +
                        'z-index: 15;' +
                    '}' +
                    '#gamebody div.infoBar {' +
                        'top: 111px;' +
                    '}' +
                    'a#backReboot {' +
                        'top: 178px;' +
                    '}'
                );

                JS.wait_for_id('tid_bar', function(node) {
                    var tid_cache = node;
                    var tid_hidden = true;
                    JS.wait_for_tag('tid_sidePanel', function(nodes) {
                        var show_tid = function() {
                            tid_cache.style.display = 'block';
                            tid_hidden = false;
                        };

                        var hide_tid = function() {
                            tid_cache.style.display = 'none';
                            tid_hidden = true;
                        };

                        document.body.addEventListener('mousemove', function(event) {
                            // if on the top of the screen, display the bar
                            if (tid_hidden && event.clientY <= 5) {
                                show_tid();
                            }
                            // if not on the top of the screen, hide the bar if the
                            // lateral panels are not visible
                            else if (!tid_hidden && event.clientY > 32) {
                                var tid_side_panels = document.getElementsByClassName('tid_sidePanel');
                                var tid_side_panels_length = tid_side_panels.length;

                                for (var i = 0; i < tid_side_panels_length; ++i) {
                                    var style = getComputedStyle(tid_side_panels[i]);

                                    if (style['visibility'] === 'visible') {
                                        return;
                                    }
                                }
                                hide_tid();
                            }
                        }, false);
                    });
                });
            }
        }

    };

});
