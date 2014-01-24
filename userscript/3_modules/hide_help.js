Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_help',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    '#mapTips, a.button[href^="#city/exp?editor=1;sk="] + p, .helpLink, #generic_section > div > em:last-of-type, .help {' +
                        'display: none;' +
                    '}'
                );

                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!(D2N.is_on_page_in_city('guard'))) {
                        return;
                    }

                    // As the watch button is in a help div, if the help is hidden
                    // the button disappeared. So in this case the button is moved
                    // elsewhere in the DOM
                    if (configuration_['hide_help']) {
                        JS.wait_for_class('help', function(help) {
                            JS.wait_for_selector('#generic_section a.button', function(button) {
                                button.style.marginTop = '18px';
                                button.style.marginBottom = '15px';
                                help[0].parentNode.insertBefore(button, help[0]);
                            });
                        });
                    }
                }, false);
            }
        }

    };
})());
