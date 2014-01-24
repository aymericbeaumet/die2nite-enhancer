Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'shortcuts',
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        config: {
            enabled: false,
            bind: {
                // This bind has to be pressed first
                main: 71, // 'G'
                // Page specific bind (have to be preceded by a 'main' bind stoke)
                overview: 79, // 'O'
                home: 72, // 'H'
                well: 87, // 'W'
                bank: 66, // 'B'
                citizens: 67, // 'C'
                buildings: 68, // 'D'
                doors: 71, // 'G'
                upgrades: 80, // 'P'
                tower: 84, // 'T'
                refine: 77, // 'M'
                guard: 76 // 'L'
            }
        },

        action: {
            load: function() {
                JS.keydown_event(function(keycode, previous_keycode) {
                    if (previous_keycode !== this.bind.main) {
                        return;
                    }

                    for (var bind in this.bind) {
                        if (this.bind[bind] === keycode) {
                            return D2N.go_to_city_page(bind);
                        }
                    }
                });
            }
        }

    };
})());
