
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "@ionic-enterprise/identity-vault.ionicnativeauth",
          "file": "plugins/@ionic-enterprise/identity-vault/www/ionicnativeauth.js",
          "pluginId": "@ionic-enterprise/identity-vault",
        "clobbers": [
          "IonicNativeAuth"
        ],
        "runs": true
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "@ionic-enterprise/identity-vault": "5.11.1"
    };
    // BOTTOM OF METADATA
    });
    