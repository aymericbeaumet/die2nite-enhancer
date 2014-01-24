Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_rp_content',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    '.ambiant, .flavor {' +
                        'display: none;' +
                    '}'
                );
            }
        }

    };
})());
