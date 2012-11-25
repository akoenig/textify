/*!
 * textify
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */
 
require.config({
   shim: {
   },

   paths: {
     jquery: 'vendor/jquery'
   }
});


require([
    'app'
], function(app) {
    'use strict';

    var canvas = window.document.getElementById('board');

    app.rock(canvas);
});