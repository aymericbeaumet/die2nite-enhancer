Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_footer',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    '#tid_bar_down {' +
                        'display: none;' +
                    '}' +
                    '#fbAd {' +
                        'height: 0;' +
                        'overflow: hidden;' +
                    '}'
                );
            }
        }

    };
})());
