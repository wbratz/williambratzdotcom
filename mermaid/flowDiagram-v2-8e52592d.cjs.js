'use strict';

var flowDb52e24d17 = require('./flowDb-52e24d17.cjs.js');
var styles26373982 = require('./styles-26373982.cjs.js');
var mermaid_core = require('./mermaid.core.cjs.js');
require('./layout.cjs.js');
require('./createText-1f5f8f92.cjs.js');
require('./index-5219d011.cjs.js');
require('./edges-2e77835f.cjs.js');
require('./svgDraw-2526cba0.cjs.js');
require('./line.cjs.js');
require('./array.cjs.js');
require('./path.cjs.js');
require('./selectAll.cjs.js');

const diagram = {
  parser: flowDb52e24d17.parser$1,
  db: flowDb52e24d17.flowDb,
  renderer: styles26373982.flowRendererV2,
  styles: styles26373982.flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    mermaid_core.setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    styles26373982.flowRendererV2.setConf(cnf.flowchart);
    flowDb52e24d17.flowDb.clear();
    flowDb52e24d17.flowDb.setGen("gen-2");
  }
};

exports.diagram = diagram;
