/* jshint quotmark: double */
/* global require */

require.config({
  shim: {
    bootstrap: {
      deps: [
        "jquery"
      ]
    },
    datepicker: {
      deps: [
        "jquery", "bootstrap"
      ]
    },
    datepickerGB: {
      deps: [
        "jquery","bootstrap", "datepicker"
      ]
    },
    jquery: {
      exports: "$"
    },
    "jquery-ui": {
      deps: [
        "jquery"
      ]
    },
    "openspace": {
      deps: [],
      exports: "OpenSpace"
    }
  },
  paths: {
    jquery: "jquery-1.12.0.min",
    "jquery-ui": "jquery-ui.min",
    "bootstrap": "bootstrap.min",
    "datatables": "jquery.dataTables.min",
    // "openspace": "http://ondemandapi.ordnancesurvey.co.uk/osmapapi/openspace.js?key=wec5muru",
    "openspace": "http://openspace.ordnancesurvey.co.uk/osmapapi/openspace.js?key=15042E2CC4347A0EE0530B6CA40A2E10",
    lodash: "lodash-compat.min",
    "datepicker" : "bootstrap-datepicker",
    "datepickerGB": "locales/bootstrap-datepicker.en-GB",
    "highlight": "highlight.pack",
    "cookies" : "cookies"

   ///////
    // affix: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/affix",
    // alert: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/alert",
    // button: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/button",
    // carousel: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/carousel",
    // collapse: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/collapse",
    // dropdown: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown",
    // tab: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/tab",
    // transition: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/transition",
    // scrollspy: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy",
    // modal: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/modal",
    // tooltip: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip",
    // popover: "../bower_components_lib/bootstrap-sass-official/assets/javascripts/bootstrap/popover",
    // modernizr: "../bower_components_lib/modernizr/modernizr",
    // requirejs: "../bower_components_lib/requirejs/require",
    // sprintf: "../bower_components_lib/sprintf.js/src/sprintf",
    // json2: "../bower_components_lib/json2/json2",
    // moment: "../bower_components_lib/moment/moment",
    // "spin": "../bower_components_lib/spin.js/spin",
    // "jquery.spinjs": "../bower_components_lib/jquery.spinjs/dist/jquery.spin",
    // "jquery-ui-touch-punch": "../bower_components_lib/jquery-ui-touch-punch/jquery.ui.touch-punch.min",
    // "respond": "../bower_components_lib/respond/dest/respond.min"
  },
  packages: [
  ]
});

