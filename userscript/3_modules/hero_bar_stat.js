Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'hero_bar_stat',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                JS.injectCSS(
                    'div.heroUpBar div.hfront {' +
                        'padding-left: 6px;' +
                        'text-align: center;' +
                        'font-family: "Century Gothic", "Arial", "Trebuchet MS", Verdana, sans-serif;' +
                        'font-size: 16pt;' +
                        'padding-top: 10px;' +
                        'color: #f0d79e;' +
                        'text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;' +
                    '}'
                );

                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!(D2N.is_on_page('ghost') || D2N.is_on_page('ghost_exp'))) {
                        return;
                    }

                    JS.wait_for_selector('#ghostImg img', function(node) {
                        // abort if not hero
                        if (node.alt !== 'ghost red') {
                            return;
                        }

                        JS.wait_for_selector('#ghost_pages img.hbar', function(node) {
                            var width = parseFloat(node.style.width);
                            // Notes:
                            //   0 day -> 0px
                            var max_width = 583;
                            var percent = width / max_width * 100;

                            var fill_bar = function() {
                                JS.wait_for_selector('div.heroUpBar div.hfront', function(node) {
                                    node.textContent = parseInt(percent) + '%';
                                });
                            };
                            fill_bar();
                        });
                    });
                }, false);
            }
        }

    };
})());
