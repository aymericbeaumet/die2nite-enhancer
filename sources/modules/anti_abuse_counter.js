Module.register(function() {

    var MODULE_NAME = 'anti_abuse_counter';

    /******************
     * Module context *
     ******************/

    var ANTI_ABUSE_NOTIFIER_ID = 'd2ne_abuse_counter';

    var _time_interval = null;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Prevent bank abuse';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Display a an anti-abuse counter on the bank page';
        i18n[I18N.LANG.EN][MODULE_NAME + '_label'] = 'Anti-abuse counter:';
        i18n[I18N.LANG.EN][MODULE_NAME + '_reset_in'] = 'reset in';
        i18n[I18N.LANG.EN][MODULE_NAME + '_prevent'] = 'Please wait until the end of the countdown before to try again.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le compteur anti-abus';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur la page de la banque, affiche un compteur pour prévenir les abus et empêche de prendre plus de 5 objets toutes les 15 minutes.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_label'] = 'Compteur anti-abus :';
        i18n[I18N.LANG.FR][MODULE_NAME + '_reset_in'] = 'reset dans';
        i18n[I18N.LANG.FR][MODULE_NAME + '_prevent'] = 'Il serait préférable d\'attendre la fin du décompte avant d\'essayer à nouveau.';


        I18N.set(i18n);
    }

    function get_notifier_div()
    {
        var current_time = Math.floor(+new Date() / 1000);
        var time_left = this.properties.end_of_abuse - current_time + 1;
        var hour_left = Math.floor(time_left / 60);
        var min_left = Math.floor(time_left % 60);

        return JS.jsonToDOM(["div", { "id": ANTI_ABUSE_NOTIFIER_ID, "class": "extractCpt" },
            ["img", { "src": "/gfx/icons/tag_1.gif" }],
            ' ' + I18N.get(MODULE_NAME + '_label') + ' ',
            ["strong", {},
                this.properties.attempt_left
            ],
            " (" + I18N.get(MODULE_NAME + '_reset_in') + ' ',
            ["strong", {},
                ((this.properties.end_of_abuse > 0) ? ('' + hour_left + ':' + ((min_left < 10) ? '0' : '') + min_left) : '∞')
            ],
            ")"
        ], document);
    }

    function refresh_notifier()
    {
        var div = document.getElementById(ANTI_ABUSE_NOTIFIER_ID);
        if (JS.is_defined(div)) {
            div.parentNode.replaceChild(get_notifier_div.call(this), div);
        }
    }

    function on_object_click(event)
    {
        // The click must occur on the object icon, the object number or the
        // link
        if (['IMG', 'SPAN', 'A'].indexOf(event.target.nodeName) < 0) {
            return;
        }
        if (this.properties.attempt_left < 1) {
            event.cancelBubble = true;
            event.stopPropagation();
            event.preventDefault();
            alert(I18N.get(MODULE_NAME + '_prevent'));
            return;
        }
        this.properties.attempt_left -= 1;
        if (this.properties.attempt_left < 0) {
            this.properties.attempt_left = 0;
        }
        this.properties.end_of_abuse = (+new Date() / 1000) + (15 * 60);
        this.save_properties();
        refresh_notifier.call(this);
    }

    function inject_click_listener()
    {
        // Add listener
        document.querySelector('.tools.stocks.cityInv').addEventListener('click', on_object_click.bind(this), true);
    }

    function on_each_second(event)
    {
        var current_time = Math.floor(+new Date() / 1000);
        if (current_time > this.properties.end_of_abuse) {
            this.properties.attempt_left = this.properties.max_attemps;
            this.properties.end_of_abuse = 0;
            this.save_properties();
        }
        refresh_notifier.call(this);
    }

    function inject_notifier()
    {
        // Add notifier
        JS.wait_for_selector('div.right', function(el) {
            el.insertBefore(get_notifier_div.call(this), el.firstChild);

            if (_time_interval === null) {
                _time_interval = setInterval(on_each_second.bind(this), 1000);
            }
        }.bind(this));
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false,
            max_attemps: 5
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.BANK,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                add_i18n();
            },

            load: function() {
                JS.injectCSS(
                    '#' + ANTI_ABUSE_NOTIFIER_ID + ' {' +
                        'cursor: auto;' +
                    '}');

                if(document.getElementsByClassName("chaos").length !== 0){
                    this.properties.max_attemps = 10;
                }

                if (JS.is_defined(this.properties.attempt_left) !== true) {
                    this.properties.attempt_left = this.properties.max_attemps;
                }
                if (JS.is_defined(this.properties.end_of_abuse) !== true) {
                    this.properties.end_of_abuse = 0;
                }
                this.save_properties();

                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!D2N.is_on_page_in_city('bank')) {
                        return;
                    }

                    if (JS.is_defined(document.getElementById(ANTI_ABUSE_NOTIFIER_ID))) {
                        return;
                    }

                    inject_notifier.call(this);
                    inject_click_listener.call(this);
                }.bind(this), false);
            }
        }

    };
});
