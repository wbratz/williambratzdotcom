'use strict';

var styles16907e1b = require('./styles-16907e1b.cjs.js');
var mermaid_core = require('./mermaid.core.cjs.js');
var layout = require('./layout.cjs.js');
var svgDraw2526cba0 = require('./svgDraw-2526cba0.cjs.js');
require('./line.cjs.js');
require('./array.cjs.js');
require('./path.cjs.js');

let idCache = {};
const padding = 20;
const getGraphId = function(label) {
  const foundEntry = Object.entries(idCache).find((entry) => entry[1].label === label);
  if (foundEntry) {
    return foundEntry[0];
  }
};
const insertMarkers = function(elem) {
  elem.append("defs").append("marker").attr("id", "extensionStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 1,7 L18,13 V 1 Z");
  elem.append("defs").append("marker").attr("id", "extensionEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 1,1 V 13 L18,7 Z");
  elem.append("defs").append("marker").attr("id", "compositionStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "compositionEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "aggregationStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "aggregationEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "dependencyStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "dependencyEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
};
const draw = function(text, id, _version, diagObj) {
  const conf = mermaid_core.getConfig().class;
  idCache = {};
  mermaid_core.log.info("Rendering diagram " + text);
  const securityLevel = mermaid_core.getConfig().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = mermaid_core.select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? mermaid_core.select(sandboxElement.nodes()[0].contentDocument.body) : mermaid_core.select("body");
  const diagram2 = root.select(`[id='${id}']`);
  insertMarkers(diagram2);
  const g = new layout.Graph({
    multigraph: true
  });
  g.setGraph({
    isMultiGraph: true
  });
  g.setDefaultEdgeLabel(function() {
    return {};
  });
  const classes = diagObj.db.getClasses();
  const keys = Object.keys(classes);
  for (const key of keys) {
    const classDef = classes[key];
    const node = svgDraw2526cba0.svgDraw.drawClass(diagram2, classDef, conf, diagObj);
    idCache[node.id] = node;
    g.setNode(node.id, node);
    mermaid_core.log.info("Org height: " + node.height);
  }
  const relations = diagObj.db.getRelations();
  relations.forEach(function(relation) {
    mermaid_core.log.info(
      "tjoho" + getGraphId(relation.id1) + getGraphId(relation.id2) + JSON.stringify(relation)
    );
    g.setEdge(
      getGraphId(relation.id1),
      getGraphId(relation.id2),
      {
        relation
      },
      relation.title || "DEFAULT"
    );
  });
  const notes = diagObj.db.getNotes();
  notes.forEach(function(note) {
    mermaid_core.log.debug(`Adding note: ${JSON.stringify(note)}`);
    const node = svgDraw2526cba0.svgDraw.drawNote(diagram2, note, conf, diagObj);
    idCache[node.id] = node;
    g.setNode(node.id, node);
    if (note.class && note.class in classes) {
      g.setEdge(
        note.id,
        getGraphId(note.class),
        {
          relation: {
            id1: note.id,
            id2: note.class,
            relation: {
              type1: "none",
              type2: "none",
              lineType: 10
            }
          }
        },
        "DEFAULT"
      );
    }
  });
  layout.layout(g);
  g.nodes().forEach(function(v) {
    if (v !== void 0 && g.node(v) !== void 0) {
      mermaid_core.log.debug("Node " + v + ": " + JSON.stringify(g.node(v)));
      root.select("#" + (diagObj.db.lookUpDomId(v) || v)).attr(
        "transform",
        "translate(" + (g.node(v).x - g.node(v).width / 2) + "," + (g.node(v).y - g.node(v).height / 2) + " )"
      );
    }
  });
  g.edges().forEach(function(e) {
    if (e !== void 0 && g.edge(e) !== void 0) {
      mermaid_core.log.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      svgDraw2526cba0.svgDraw.drawEdge(diagram2, g.edge(e), g.edge(e).relation, conf, diagObj);
    }
  });
  const svgBounds = diagram2.node().getBBox();
  const width = svgBounds.width + padding * 2;
  const height = svgBounds.height + padding * 2;
  mermaid_core.configureSvgSize(diagram2, height, width, conf.useMaxWidth);
  const vBox = `${svgBounds.x - padding} ${svgBounds.y - padding} ${width} ${height}`;
  mermaid_core.log.debug(`viewBox ${vBox}`);
  diagram2.attr("viewBox", vBox);
};
const renderer = {
  draw
};
const diagram = {
  parser: styles16907e1b.parser$1,
  db: styles16907e1b.db,
  renderer,
  styles: styles16907e1b.styles,
  init: (cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    styles16907e1b.db.clear();
  }
};

exports.diagram = diagram;
