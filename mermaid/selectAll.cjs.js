'use strict';

var mermaid_core = require('./mermaid.core.cjs.js');

function selectAll(selector) {
  return typeof selector === "string"
      ? new mermaid_core.Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new mermaid_core.Selection([mermaid_core.array(selector)], mermaid_core.root);
}

exports.selectAll = selectAll;
