Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_twitter_share_button',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    '#gameBodyLight ul.linkControl {' +
                        'display: none;' +
                    '}' +
                    '#gameBodyLight div.logControl {' +
                        'margin-top: 351px;' +
                    '}'
                );
            }
        }

    };
})());
