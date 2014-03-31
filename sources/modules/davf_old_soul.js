Module.register(function() {

    var MODULE_NAME = 'davf_old_soul';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Old soul design for the pictogram (by Davf)';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'More information here [fr]: http://userstyles.org/styles/97547/hordes-me-ancienne. Script by Davf, integrated with his permission.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Hordes Âme Ancienne (par Davf)';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Plus d\'information ici : http://userstyles.org/styles/97547/hordes-me-ancienne. Script par Davf, intégré avec sa permission.';

        I18N.set(i18n);
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
                category: Module.PROPERTY_CATEGORY.SOUL,
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
                    // From: http://userstyles.org/styles/97547/hordes-me-ancienne
                    // Credit: Davf, thanks to him for giving his permission to use his CSS
                    // Integrated on: Mar 18, 2014
                    '.passwidth {' +
                        'margin-top: 200px !important;' +
                    '}' +
                    'div.night {' +
                        'margin-bottom: 165px !important;' +
                    '}' +
                    '.tid_userSheet .tid_userSheetBg {' +
                        'background-color: #5c2b20 !important;' +
                        'background-image: url("http://data.twinoid.com/img/design/ugoals_bgLeft.png") !important;' +
                    '}' +
                    '.tid_userSheet .tid_userSheetBg .tid_bgRight {            ' +
                        'background-image: url("http://data.twinoid.com/img/design/ugoals_bgRight.png") !important;' +
                    '}' +
                    '.tid_userSheet .tid_header {' +
                        'background-color: #452314 !important;' +
                        'background-image: url("http://data.twinoid.com/img/design/ugoals_headerLeft.png") !important;' +
                    '}' +
                    '.tid_userSheet .tid_header .tid_headerRight {' +
                        'padding-top: 0px !important;' +
                        'background-image: url("http://data.twinoid.com/img/design/ugoals_headerRight.png") !important;' +
                    '}' +
                    '.tid_userSheet .tid_footer {' +
                            'background-color: #5c2b20 !important;' +
                            'background-image: url("http://data.twinoid.com/img/design/ugoals_footerLeft.png") !important;' +
                    '}' +
                    '.tid_footerRight {' +
                            'background-image: url("http://data.twinoid.com/img/design/ugoals_footerRight.png") !important;' +
                    '}' +
                    '.tid_userSheet.tid_mine .tid_editable:hover {' +
                        'outline: 1px dotted white !important;' +
                    '}' +
                    //'div.tid_bubble {' +
                        //'background-color: #79432b !important;' +
                        //'color: #ddab76 !important;' +
                        //'box-shadow: 0px 0px 2px #79432b !important;' +
                        //'-webkit-box-shadow: 0px 0px 2px #79432b !important;' +
                        //'border: 0px solid transparent !important;' +
                        //'border-radius: 4px;' +
                    //'}' +
                    '.tid_userSheet.tid_mine .tid_editable .tid_editIcon {' +
                        'margin-top: -6px !important;' +
                        'margin-left: -10px !important;' +
                        'background: #79432b !important;' +
                        '-moz-box-shadow: 0px 0px 3px #ddab76 !important;' +
                        '-webkit-box-shadow: 0px 0px 3px #ddab76 !important;' +
                        'box-shadow: 0px 0px 2px #ddab76 !important;' +
                        'border-radius: 4px !important;' +
                        '-moz-border-radius: 4px !important;' +
                        '-webkit-border-radius: 4px !important;' +
                        'border: 1px solid #ddab76 !important;' +
                    '}' +
                    //'.tid_userStatus .tid_bubble .tid_content .tid_editorContent a {' +
                        //'color: #ddab76 !important;' +
                    //'}' +
                    //'.tid_userStatus .tid_bubble .tid_content .tid_editorContent a:hover {' +
                        //'color: white !important;' +
                    //'}' +
                    //'.tid_bubble  a {' +
                        //'text-decoration: underline !important;' +
                    //'}' +
                    //'.tid_userStatus .tid_bubble  .tid_editorContent strong {' +
                        //'color: #afb3cf !important;' +
                        //'font-weight: bold !important;' +
                    //'}' +
                    '.tid_userSheet.tid_mine .tid_editable:hover {' +
                        'outline: 1px dotted #ddab76 !important;' +
                    '}' +
                    '.tid_userStatus .tid_arrow.tid_left {' +
                        'background-image: none !important;' +
                    '}' +
                    '.tid_userGoals .tid_userGoals_bg {' +
                        'background-image: none  !important;' +
                    '}' +
                    '.tid_userGoals .tid_userGoals_headerLeft {' +
                        'background-image: none  !important;' +
                    '}' +
                    '.tid_userGoals .tid_userGoals_headerLeft .tid_bgRight {' +
                        'background-image: none  !important;' +
                    '}    ' +
                    '.tid_userGoals .tid_userGoals_bg .tid_userGoals_bgRight {' +
                        'background-image: none  !important;' +
                    '}   ' +
                    '.tid_userGoals .tid_userGoals_footerLeft .tid_bgRight {' +
                        'background-image: none  !important;' +
                    '}   ' +
                    '.tid_userGoals .tid_userGoals_footerLeft {' +
                        'background-image: none;' +
                    '}' +
                    '.tid_userGoals .tid_bg2 {' +
                        'background-color: transparent !important;' +
                    '}' +
                    '.tid_userGoals .tid_bg1 {' +
                        'background-color: transparent !important;' +
                    '}' +
                    '.tid_userGoals .tid_bg3 {' +
                        'background-color: transparent !important;' +
                    '}' +
                    '.guser .left {' +
                        'width: 300px;' +
                        'background-image: url("/gfx/design/rewardsBg_bg.gif") !important;' +
                        'background-repeat: repeat-y !important;' +
                        'margin-bottom: auto !important;' +
                        'background-position: 20px 0px !important;' +
                    '}' +
                    '.tid_userGoals {' +
                        'background-image: url("/gfx/loc/' + D2N.get_website_language() + '/rewardsBg_header.gif") !important;' +
                        'background-repeat: no-repeat !important;' +
                        'margin-bottom: 0px !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important; ' +
                        'margin-left: auto !important;' +
                        'margin-right: auto !important;' +
                        'width: 260px !important;' +
                    '}' +
                    '.tid_userGoals_footerLeft.tid_bg2 {' +
                        'background-image: url("/gfx/design/rewardsBg_footer.gif") !important;' +
                        'height: 47px !important;' +
                        'margin-top: -22px !important;' +
                    '}' +
                    '.tid_userGoals {' +
                        'width: 260px !important;' +
                    '}' +
                    '.tid_userGoals .tid_userGoals_headerLeft .tid_bgRight {' +
                        'padding-top: 45px !important;' +
                     '}' +
                    '.tid_help.tid_tip.tid_parsed {' +
                    'padding-right: 12px !important;' +
                    '}' +
                    '.tid_userGoals .tid_userGoals_headerBorder {' +
                        'margin: 0px 3px !important;' +
                        'border-top: 0px solid transparent !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_goalListWrapper {' +
                        'max-height: none !important;' +
                        'border-top: 0px solid white !important;' +
                        'border-bottom: 0px solid white !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_reachList {' +
                        'border-top: 0px solid white !important;' +
                        'border-bottom: 0px solid white !important;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                    '}' +
                    '.tid_userGoals .tid_scrollTrack {' +
                        'display: none !important;' +
                    '}' +
                    '.tid_scrollContentWrapper {' +
                        'max-height: none !important;' +
                        'margin-right:0px !important;  ' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_goalListWrapper, .tid_userGoals .tid_goals .tid_reachList {' +
                        'max-height: none !important;      ' +
                    '}' +
                    '.tid_userGoals .tid_tabs {' +
                        'padding-right: 0px !important;' +
                        'text-align: center !important;' +
                    '}' +
                     '.tid_userGoals .tid_tabs .tid_over3:hover {' +
                        'background-color: none !important;' +
                        'color: #DDAB76 !important;' +
                     '}' +
                    '.tid_userGoals .tid_tabs a:hover {' +
                        'background-color: none !important;' +
                        'color: #f0d79e !important;' +
                     '}' +
                    '.tid_userGoals .tid_goals .tid_mode_icons .tid_goal.tid_rare {' +
                        'border: 0px solid #feb500;' +
                        'border-top-color: #FFFFB9;' +
                        '-moz-box-shadow: none !important;' +
                        '-webkit-box-shadow: none !important;' +
                        'box-shadow: none !important;' +
                        'border-radius: 0px !important;' +
                        '-moz-border-radius: 0px !important;' +
                        '-webkit-border-radius: 0px !important;' +
                        'background-color: transparent !important;' +
                    '}' +
                    '.tid_goal.tid_bg3.tid_tip.tid_rare.tid_parsed {' +
                        'background-image: url("/gfx/icons/rewardBg_rare.gif") !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_mode_icons .tid_goal .tid_count {' +
                        'margin-top: 19px !important;   ' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_top .tid_goal.tid_rare .tid_count {' +
                        'background-color: #3d2016 !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_mode_icons .tid_goal {' +
                        'border: 0px solid white !important;          ' +
                    '}' +
                    '.tid_userGoals .tid_bg1 .tid_bgRight {' +
                        'color: #f0d79e !important;' +
                        'font-variant: small-caps !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_reachList table tr {' +
                        'color: white !important;	' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_reachList table td.tid_name {' +
                        'font-variant: small-caps !important;' +
                        'font-style: normal !important;' +
                    '}' +
                    '.tid_userGoals .tid_goals .tid_reachList table td.tid_value {' +
                        'color: #f0d79e !important;' +
                    '}' +
                    '.tid_note, .tid_blockTitle {' +
                        'color: #f0d79e !important;' +
                    '}' +
                    '#tid_simpleTip > div {' +
                        'background: #5C2b20 !important;' +
                        'border: 1px solid #f0d79e !important;' +
                        'outline: 1px solid #5c2B20 !important;' +
                    '}' +
                    '#tid_simpleTip {' +
                        'background-image: url("http://uppix.net/7vuvNE.png") !important;' +
                        'background-repeat: no-repeat !important;' +
                        'background-position: 50% 100% !important;' +
                        'padding-bottom: 8px !important;' +
                    '}' +
                    '#tid_simpleTip > img {' +
                        'display: none !important;' +
                    '}'
                );
            }
        }

    };
});
