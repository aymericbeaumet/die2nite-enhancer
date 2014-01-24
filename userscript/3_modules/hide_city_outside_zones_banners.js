Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hide_city_outside_zones_banners',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    'div.sectionArt {' +
                    'display: none;' +
                    '}'
                );
            }
        }

    };
})());
