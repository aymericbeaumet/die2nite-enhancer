Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_rookie_mode',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    'div.block.tutorialBlock, div.expertMode {' +
                        'display: none;' +
                    '}'
                );
            }
        }

    };
})());
