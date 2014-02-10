// In Safari, it is not possible to exclude domain from the configuration file.
// So the extension will be loaded on external tools domain (because I need to
// ask the user permission to perform Cross-Domain HTTP requests).
// Therefore, if I'm in Safari, but not on a game website, abort.
if (typeof safari !== 'undefined' && !D2N.is_on_game_website()) {
    return;
}

D2NE.init();

})();
