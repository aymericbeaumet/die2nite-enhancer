Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'fold_twinoid_bar',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
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

})());
