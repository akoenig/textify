/*!
 * textify
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

define([

], function() {
    'use strict';

    return {
        random : function (lower, upper) {
            if (upper === undefined) {
                upper = lower;
                lower = 0;
            }

            return Math.floor(Math.random() * (upper - lower + 1)) + lower;
        }
    };
});