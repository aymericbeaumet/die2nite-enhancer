Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'mask_completed_constructions',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
            hide_completed_constructions: false
        },

        action: {
            load: function() {
                if (!D2N.is_in_city()) {
                    return;
                }

                // Hide constructions if needed | Add the link
                var add_link = function() {
                    // Abort if not on the building page
                    if (!D2N.is_on_page_in_city('buildings')) {
                        return;
                    }

                    // Hide the constructions if needed
                    if (configuration_.hide_completed_constructions) {
                        JS.injectCSS(
                            'tr.building.done {' +
                                'display: none;' +
                            '}'
                        );
                    // Else show the constructions
                    } else {
                        JS.injectCSS(
                            'tr.building.done {' +
                                'display: table-row;' +
                            '}'
                        );
                    }

                    JS.wait_for_class('tinyAction', function(nodes) {
                        // if the two links are already present, then abort
                        if (nodes[0].childNodes.length > 1) {
                            return;
                        }

                        var right_link = nodes[0].firstChild;

                        // Clone node and set the wanted properties (to keep the
                        // right link behaviour)
                        var link = right_link.cloneNode(false);
                        link.style.cssFloat = 'left';
                        link.textContent = configuration_.hide_completed_constructions ? i18n_.show_completed_constructions : i18n_.hide_completed_constructions;
                        link.addEventListener('click', function() {
                            configuration_.hide_completed_constructions = !configuration_.hide_completed_constructions;
                            save_configuration();
                        }, false);

                        nodes[0].insertBefore(link, nodes[0].firstChild);
                    });
                };
                add_link();

                // Add the link again on each page reload
                document.addEventListener('d2n_gamebody_reload', function() {
                    add_link();
                }, false);
            }
        }

    };
})());
