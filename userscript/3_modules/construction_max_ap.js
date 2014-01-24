Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'construction_max_ap',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
        },

        action: {
            load: function() {
                var change_ap = function() {
                    if (!D2N.is_on_page_in_city('buildings')) {
                        return;
                    }

                    D2N.get_number_of_ap(function(ap) {
                        JS.wait_for_selector('tr.banner.root_wall1', function() {
                            var fields = document.querySelectorAll('div[id^="moreForm_"] form input[type="text"]');
                            var fields_length = fields.length;

                            for (var i = 0; i < fields_length; ++i) {
                                fields[i].value = ap;
                            }
                        });
                    });
                };

                document.addEventListener('d2n_apchange', function() {
                    change_ap();
                }, false);
            }
        }

    };
})());
