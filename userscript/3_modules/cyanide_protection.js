Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'cyanide_protection',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false
        },

        action: {
            load: function() {
                var remove_cyanide_action = function() {
                    // if not at home or outside (the two only places where a player
                    // can use an object), abort
                    if (!(D2N.is_on_page_in_city('home') || D2N.is_outside())) {
                        return;
                    }

                    // else list all the possible objects usable by the player
                    JS.wait_for_selector_all('a.toolAction > span > strong', function(nodes) {
                        var action;

                        for (var node in nodes) {
                            // Skip the node if not a 'strong' element
                            if (nodes[node].nodeName !== 'STRONG')
                                continue;

                            // Hide the node if cyanure
                            if (/^Cyanide|Cyanure|Cianuro$/.test(nodes[node].textContent)) {
                                action = nodes[node].parentNode.parentNode;
                                action.style.display = 'none';
                            }
                        }
                    }, 5);
                };

                document.addEventListener('d2n_gamebody_reload', function() {
                    remove_cyanide_action();
                }, false);
            }
        }

    };
})());
