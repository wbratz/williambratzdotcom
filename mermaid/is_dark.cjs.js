'use strict';

var mermaid_core = require('./mermaid.core.cjs.js');

/* IMPORT */
/* MAIN */
//SOURCE: https://planetcalc.com/7779
const luminance = (color) => {
    const { r, g, b } = mermaid_core.Color$1.parse(color);
    const luminance = .2126 * mermaid_core._.channel.toLinear(r) + .7152 * mermaid_core._.channel.toLinear(g) + .0722 * mermaid_core._.channel.toLinear(b);
    return mermaid_core._.lang.round(luminance);
};
/* EXPORT */
var luminance$1 = luminance;

/* IMPORT */
/* MAIN */
const isLight = (color) => {
    return luminance$1(color) >= .5;
};
/* EXPORT */
var isLight$1 = isLight;

/* IMPORT */
/* MAIN */
const isDark = (color) => {
    return !isLight$1(color);
};
/* EXPORT */
var isDark$1 = isDark;

exports.isDark = isDark$1;
