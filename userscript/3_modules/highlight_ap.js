Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'highlight_ap',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.wait_for_id('movesCounter', function(node) {
                    var highlight = function() {
                        D2N.get_number_of_ap(function(ap) {
                            var colors = [
                                'ff0000', // 0 AP
                                'ff4700', // 1 AP
                                'ff8e00', // 2 AP
                                'ffd500', // 3 AP
                                'e3ff00', // 4 AP
                                '9cff00', // 5 AP
                                '55ff00', // 6 AP
                                '00ff00'  // 7 AP+
                            ];

                            while (ap >= colors.length) {
                                --ap;
                            }

                            JS.injectCSS(
                                '#movesCounter {' +
                                    'border: 1px solid #' + colors[ap] + ' !important;' +
                                '}'
                            );
                        });
                    };

                    // Highlight at load
                    highlight();

                    // Highlight on change
                    document.addEventListener('d2n_apchange', function() {
                        highlight();
                    }, false);
                });
            }
        }

    };
})());
