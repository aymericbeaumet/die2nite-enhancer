Module.register(function() {

    var MODULE_NAME = 'forum_include_medias';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Replace the medias link by the content';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'In the forum posts, replace the media links by the concerned media (images and YouTube videos).';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Remplacer les liens de medias par le contenu';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Dans les posts du forum, remplace les liens de média par le média en question (images et vidéos YouTube).';

        I18N.set(i18n);
    }

    /**
     * Check if the given link is an image.
     * @param string url The URL to check
     * @return boolean true if an image, else false
     */
    function is_image_link(url)
    {
        return /\.(?:jpe?g|png|gif|bmp)(?:\?.+)?$/.test(url);
    }

    /**
     * Return the id from a YouTube video.
     * @link http://linuxpanda.wordpress.com/2013/07/24/ultimate-best-regex-pattern-to-get-grab-parse-youtube-video-id-from-any-youtube-link-url/
     * @param string video_url
     * @return integer the video id
     * @return null if can not extract it
     */
    function get_youtube_video_id(video_url)
    {
        var results = video_url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/i);

        if (results.length < 2) {
            return null;
        }
        return results[1];
    }

    /**
     * Check if the given href is a youtube link.
     * @param string url The URL to check.
     * @return boolean true if a youtube link, else false
     */
    function is_youtube_link(url)
    {
        return /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)/.test(url);
    }

    /**
     * Replace medias in forum posts.
     * @param DOMNode[] posts The posts list
     */
    function replace_medias_in_forum_posts(posts)
    {
        posts.forEach(function(post) {
            var links = JS.nodelist_to_array(post.querySelectorAll('.tid_editorContent a[href]'));

            // for each link, see if it has to be replaced
            links.forEach(function(link) {
                var new_node = null;

                // images
                if (is_image_link(link.href)) { // if an image
                    // create the node img
                    new_node = JS.jsonToDOM(['a', { href: link.href, target: '_blank' },
                        ['img', { src: link.href, class: 'd2ne_injected' } ]
                    ], document);

                // YouTube
                } else if (is_youtube_link(link.href)) {
                    var video_id = get_youtube_video_id(link.href);
                    if (video_id === null) {
                        return;
                    }
                    var embed_link = '//www.youtube-nocookie.com/embed/' + video_id + '?rel=0';
                    new_node = JS.jsonToDOM(['iframe', { width: 400, height: 300, src: embed_link, frameborder: 0, allowfullscreen: '', class: 'd2ne_injected' }], document);

                // abort for this link
                } else {
                    return;
                }

                // Insert the new node if any
                if (new_node !== null) {
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
                    'img.d2ne_injected, iframe.d2ne_injected {' +
                        'max-width: 100%;' +
                    '}' +
                    'img.d2ne_injected {' +
                        'margin-top: 16px;' +
                    '}' +
                    'iframe.d2ne_injected {' +
                        'display: block;' +
                        'margin: 0 auto;' +
                        'margin-top: 16px;' +
                        'margin-bottom: 0;' +
                        'border: none;' +
                        'box-shadow: 0px 0px 8px black;' +
                        'border-radius: 3px;' +
                    '}'
                );

                document.addEventListener('d2n_forum_topic', function(event) {
                    var posts = JS.nodelist_to_array(document.getElementsByClassName('tid_post'));
                    replace_medias_in_forum_posts(posts);
                });
            }
        }

    };
});
