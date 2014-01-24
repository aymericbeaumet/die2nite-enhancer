Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_hero_adds',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function(module_config) {
                JS.injectCSS(
                    '.heroMode, #ghostHeroAd, #heroContainer, .heroAd, #ghostHeroChoose, .promoBt, .sondageBg {' +
                        'display: none !important;' +
                    '}'
                );
            }
        }

    };
})());
