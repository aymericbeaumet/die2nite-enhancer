var pageMod = require('sdk/page-mod');
var self = require('sdk/self');

pageMod.PageMod({
  include: [
      "http://www.die2nite.com/*",
      "http://www.hordes.fr/*",
      "http://www.zombinoia.com/*",
      "http://www.dieverdammten.de/*"
  ],
  contentScriptFile: self.data.url("die2nite_enhancer.user.js")
});
