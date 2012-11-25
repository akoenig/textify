/*!
 * textify
 *
 * Copyright(c) 2012 New York City, USA - All rights reserved.
 *
 * Author: André König <andre.koenig@gmail.com>
 *
 */

define([
    'resources/colors',
    'resources/words',
    'utils/magic',
    'jquery'
], function(colors, words, magic, $) {

    'use strict';

    var privates = {};

    privates.getRandomWord = function () {
        var upper = words.length - 1;

        return words[magic.random(upper)];
    };

    privates.getRandomColor = function () {
        var upper = colors.length - 1;

        return colors[magic.random(upper)];
    };

    privates.createBalls = function (options) {
        var ball,
            balls,
            upper,
            i;

        balls = [];

        upper = magic.random(options.lower, options.upper);

        i = 0;

        for (i; i < upper; i = i + 1) {

            ball = {
                coordinates: {
                    x: magic.random(options.area.x, options.area.width),
                    y: magic.random(options.area.y, options.area.height)
                },
                color: privates.getRandomColor(),
                opacity: Math.random(),
                radius: magic.random(options.minRadius, options.maxRadius)
            };

            balls.push(ball);
        }

        return balls;
    };

    privates.drawLines = function (innerBalls, outerBalls, maxLines) {
        var i,
            max,
            destination,
            target,
            firstPoint,
            firstSegment,
            secondPoint,
            secondSegment,
            item,
            color;

        max = maxLines;

        max = magic.random(1, max);

        i = 0;

        for (i; i < max; i = i + 1) {
            destination = innerBalls[magic.random(innerBalls.length - 1)].coordinates;
            target = outerBalls[magic.random(outerBalls.length - 1)].coordinates;

            firstPoint = new paper.Point(destination.x, destination.y);
            firstSegment = new paper.Segment(firstPoint, null, new paper.Point(-destination.x * Math.random(), -destination.y * Math.random()));

            secondPoint = new paper.Point(target.x, target.y);
            secondSegment = new paper.Segment(secondPoint, new paper.Point(target.x * Math.random(), target.y * Math.random()));

            item = new paper.Path(firstSegment, secondSegment);
            color = privates.getRandomColor();
            item.strokeColor = new paper.RGBColor(color.r, color.g, color.b);
            item.opacity = Math.random();
            item.smooth();
        }
    };

    privates.render = function (maxLines, innerBalls, outerBalls, word, fontSize) {
        var i,
            count,
            data,
            item;

        // RENDER LINES
        privates.drawLines(innerBalls, outerBalls, maxLines);

        // RENDER INNER BALLS
        i = 0;
        count = innerBalls.length;

        for (i; i < count; i = i + 1) {
            data = innerBalls[i];

            item = new paper.Path.Circle(new paper.Point(data.coordinates.x, data.coordinates.y), data.radius);

            item.fillColor = new paper.RGBColor(data.color.r, data.color.g, data.color.b, data.opacity);
        }

        // RENDER OUTER BALLS
        i = 0;
        count = outerBalls.length;

        for (i; i < count; i = i + 1) {
            data = outerBalls[i];

            item = new paper.Path.Circle(new paper.Point(data.coordinates.x, data.coordinates.y), data.radius);

            item.fillColor = new paper.RGBColor(data.color.r, data.color.g, data.color.b, data.opacity);
        }

        item = new paper.PointText(
            new paper.Point(window.innerWidth / 2, (window.innerHeight / 2) + 30)
        );

        item.justification = 'center';
        item.content = word;
        item.characterStyle = {
            fontSize: fontSize,
            font: 'Helvetica',
            fillColor: 'white'
        };

        paper.view.draw();
    };

    return (function () {
        var CENTER_AREA_WIDTH  = 85, // percent
            CENTER_AREA_HEIGHT = 40, // percent
            MIN_BALLS          = 80,
            MAX_BALLS          = 200,
            MIN_BALL_RADIUS    = 10,
            MAX_BALL_RADIUS    = 60,
            MAX_LINES          = 100,
            FONT_SIZE          = 120,
            RESOLUTION_FACTOR  = 1;

        if (window.innerWidth > 1024) {
            RESOLUTION_FACTOR = 1.5;
        } else if (window.innerWidth >= 1280) {
            RESOLUTION_FACTOR = 5;
        } else if (window.innerWidth > 1280) {
            RESOLUTION_FACTOR = 9;
        }

        MAX_BALL_RADIUS = MAX_BALL_RADIUS * RESOLUTION_FACTOR;
        MIN_BALL_RADIUS = MIN_BALL_RADIUS * RESOLUTION_FACTOR;
        FONT_SIZE = FONT_SIZE * (RESOLUTION_FACTOR / 2);

        return {
            rock : function (canvas, word) {
                var area,
                    innerBalls,
                    outerBalls;

                word = word || privates.getRandomWord();

                // Init the paper.js subsystem
                paper.setup(canvas);

                // Create some balls which are "flying" around.
                // Across the complete canvas so to speak.
                area = {
                    x: 0,
                    y: 0,
                    width: canvas.width,
                    height: canvas.height
                };
                outerBalls = privates.createBalls({
                    area: area,
                    lower: 10 * RESOLUTION_FACTOR,
                    upper: 100 * RESOLUTION_FACTOR,
                    colors: colors,
                    minRadius: 10 * RESOLUTION_FACTOR,
                    maxRadius: 15 * RESOLUTION_FACTOR
                });

                // Create balls which are in the
                // centered area of the canvas.
                // See tht "constants" above for more
                // information about how this area will
                // be defined.
                area = (function () {
                    var x = Math.floor(canvas.width - Math.floor((canvas.width * CENTER_AREA_WIDTH) / 100)),
                        y = (canvas.height / 2) - ((Math.floor((canvas.height * CENTER_AREA_HEIGHT) / 100)) / 2), 
                        width = Math.floor((canvas.width * CENTER_AREA_WIDTH) / 100),
                        height = y + Math.floor((canvas.height * CENTER_AREA_HEIGHT) / 100);

                    return {
                        x: x,
                        y: y,
                        width: width, 
                        height: height
                    };
                }());

                innerBalls = privates.createBalls({
                    area: area,
                    lower: MIN_BALLS,
                    upper: MAX_BALLS,
                    colors: colors,
                    minRadius: MIN_BALL_RADIUS,
                    maxRadius: MAX_BALL_RADIUS
                });

                privates.render(MAX_LINES, innerBalls, outerBalls, word, FONT_SIZE);

                $('.loading').fadeOut('slow', function () {
                    $(canvas).fadeIn();
                });
            }
        };
    }());
});