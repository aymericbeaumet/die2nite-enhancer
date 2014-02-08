Module.register(function() {

    var MODULE_NAME = 'forum_include_images';

    /******************
     * Module context *
     ******************/

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Replace the images link by the image';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'In the forum posts, replace the images link by the image.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Remplacer les liens d\'image par des images';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur le forum, remplace les liens d\'images par les images en question.';

        I18N.set(i18n);
    }

    /**
     * Replace images in forum posts.
     * @param DOMNode[] posts The posts list
     */
    function replace_images_in_forum_posts(posts)
    {
        posts.forEach(function(post) {
            var links = JS.nodelist_to_array(post.querySelectorAll('.tid_editorContent a[href]'));

            // for each link, replace by an image if justified
            links.forEach(function(link) {
                if (/\.(?:jpe?g|png|gif|bmp)(?:\?.+)?$/.test(link.href)) { // if an image
                    // create the node img
                    var new_node = document.createElement('img');
                    new_node.src = link.href;
                    new_node.classList.add('d2ne_injected');

                    // insert the image before and remove the link
                    JS.insert_after(link, new_node);
                    JS.remove_DOM_node(link);
                }
            });
        });
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.FORUM,
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
                    'img.d2ne_injected {' +
                        'max-width: 100%;' +
                        'margin-top: 16px;' +
                    '}'
                );

                document.addEventListener('d2n_forum_topic', function(event) {
                    replace_images_in_forum_posts(event.detail.posts);
                });
            }
        }

    };
});
