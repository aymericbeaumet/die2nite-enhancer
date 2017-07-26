Module.register(function() {

    var MODULE_NAME = 'forum_include_medias';

    /******************
     * Module context *
     ******************/

    var VIDEO_WIDTH = 400;
    var VIDEO_HEIGHT = 300;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Replace the medias link by the content';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'In the forum posts, replace the media links by the concerned media (images and YouTube, Vimeo and Dailymotion videos).';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Remplacer les liens de médias par le contenu';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Dans les posts du forum, remplace les liens de média par le média concerné (images et vidéos YouTube, Vimeo et Dailymotion).';

        I18N.set(i18n);
    }

    /**
     * Return the id from a dailymotion url.
     * @link http://stackoverflow.com/a/15942126/1071486
     * @param string video_url
     * @return integer the video id
     * @return null if can not extract it
     */
    function get_dailymotion_video_id(video_url)
    {
        var results = video_url.match(/dailymotion.com\/(?:(?:video|hub)\/([^_]+))?[^#]*(?:#video=([^_&]+))?/);

        if (!results || results.length < 2) {
            return null;
        }
        return results[2] || results[1];
    }

    /**
     * Return the id from a vimeo url.
     * @link http://stackoverflow.com/a/16841070/1071486
     * @param string video_url
     * @return integer the video id
     * @return null if can not extract it
     */
    function get_vimeo_video_id(video_url)
    {
        var results = video_url.match(/(?:https?:\/\/)?(?:www.)?(?:player.)?vimeo.com\/(?:[a-z]*\/)*([0-9]{6,11})/);

        if (!results || results.length < 2) {
            return null;
        }
        return results[1];
    }

    /**
     * Return the id from a youtube video.
     * @link http://linuxpanda.wordpress.com/2013/07/24/ultimate-best-regex-pattern-to-get-grab-parse-youtube-video-id-from-any-youtube-link-url/
     * @param string video_url
     * @return integer the video id
     * @return null if can not extract it
     */
    function get_youtube_video_id(video_url)
    {
        var results = video_url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\s*[^\w\-\s]|\s*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/i);

        if (!results || results.length < 2) {
            return null;
        }
        return results[1];
    }

    /**
     * Check if the given url is an image.
     * @param string url The URL to check
     * @return boolean true if an image url, else false
     */
    function is_image_link(url)
    {
        return (/.+\.(?:jpe?g|png|gif|bmp)(?:\?.+)?(?:#.\+)?$/).test(url);
    }

    /**
     * Check if the given url is an URL.
     * @param string url The url to check.
     * @return boolean true if an URL, else false
     */
    function is_link(url)
    {
        return (/^https?:\/\//).test(url);
    }

    /**
     * Replace medias in forum posts.
     * @param DOMNode[] posts The posts list
     */
    function replace_medias_in_forum_posts(posts)
    {
        var id;
        var embed_link;

        posts.forEach(function(post) {
            var links = JS.nodelist_to_array(post.querySelectorAll('.tid_editorContent a[href]'));

            // for each link, see if it has to be replaced
            links.forEach(function(link) {
                var new_node = null;

                // images
                if (is_image_link(link.href)) { // if an image
                    // create the node img
                    new_node = JS.jsonToDOM(['img', { "class": 'd2ne_injected', src: link.href }], document);

                // YouTube
                } else if ((id = get_youtube_video_id(link.href)) !== null) {
                    embed_link = '//www.youtube-nocookie.com/embed/' + id + '?rel=0';
                    new_node = JS.jsonToDOM(['iframe', { "class": 'd2ne_injected', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, src: embed_link, frameborder: 0, webkitallowfullscreen: '', mozallowfullscreen: '', allowfullscreen: '' }], document);

                // Vimeo
                } else if ((id = get_vimeo_video_id(link.href)) !== null) {
                    embed_link = '//player.vimeo.com/video/' + id;
                    new_node = JS.jsonToDOM(['iframe', { "class": 'd2ne_injected', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, src: embed_link, frameborder: 0, webkitallowfullscreen: '', mozallowfullscreen: '', allowfullscreen: '' }], document);

                // Dailymotion
                } else if ((id = get_dailymotion_video_id(link.href)) !== null) {
                    embed_link = '//www.dailymotion.com/embed/video/' + id;
                    new_node = JS.jsonToDOM(['iframe', { "class": 'd2ne_injected', width: VIDEO_WIDTH, height: VIDEO_HEIGHT, src: embed_link, frameborder: 0, webkitallowfullscreen: '', mozallowfullscreen: '', allowfullscreen: '', related: 0 }], document);

                // abort for this link
                } else {
                    return;
                }

                // Insert the new node if any
                if (new_node !== null) {
                    JS.insert_after(link, new_node);

                    // And hide the old node if the link is a pure URL (do not
                    // delete it to keep it in the quotes)
                    if (is_link(link.textContent)) {
                        link.style.display = 'none';
                    }
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
                        'float: left;' +
                        'margin: 0 auto;' +
                        'margin-top: 16px;' +
                        'margin-bottom: 16px;' +
                    '}' +
                    '.tid_editorContent cite, .tid_editorContent cite p {' +
                        'overflow: auto;' +
                    '}' +
                    '.tid_editorContent cite img:last-child {' +
                        'margin-bottom: 0;' +
                    '}' +
                    'iframe.d2ne_injected {' +
                        'display: block;' +
                        'margin: 0 auto;' +
                        'margin-top: 16px;' +
                        'margin-bottom: 16px;' +
                        'border: none;' +
                        'box-shadow: 0px 0px 8px black;' +
                        'border-radius: 3px;' +
                    '}' +
                    '.tid_editorContent .tid_spoil {' +
                        'clear: both;' +
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
