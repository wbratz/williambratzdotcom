'use strict';

var layout = require('./layout.cjs.js');
var edges2e77835f = require('./edges-2e77835f.cjs.js');
var mermaid_core = require('./mermaid.core.cjs.js');
var createText1f5f8f92 = require('./createText-1f5f8f92.cjs.js');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return layout.baseClone(value, CLONE_SYMBOLS_FLAG);
}

function write(g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound(),
    },
    nodes: writeNodes(g),
    edges: writeEdges(g),
  };
  if (!layout.isUndefined(g.graph())) {
    json.value = clone(g.graph());
  }
  return json;
}

function writeNodes(g) {
  return layout.map(g.nodes(), function (v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node = { v: v };
    if (!layout.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!layout.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g) {
  return layout.map(g.edges(), function (e) {
    var edgeValue = g.edge(e);
    var edge = { v: e.v, w: e.w };
    if (!layout.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!layout.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

let clusterDb = {};
let descendants = {};
let parents = {};
const clear$1 = () => {
  descendants = {};
  parents = {};
  clusterDb = {};
};
const isDescendant = (id, ancenstorId) => {
  mermaid_core.log.trace("In isDecendant", ancenstorId, " ", id, " = ", descendants[ancenstorId].includes(id));
  if (descendants[ancenstorId].includes(id)) {
    return true;
  }
  return false;
};
const edgeInCluster = (edge, clusterId) => {
  mermaid_core.log.info("Decendants of ", clusterId, " is ", descendants[clusterId]);
  mermaid_core.log.info("Edge is ", edge);
  if (edge.v === clusterId) {
    return false;
  }
  if (edge.w === clusterId) {
    return false;
  }
  if (!descendants[clusterId]) {
    mermaid_core.log.debug("Tilt, ", clusterId, ",not in decendants");
    return false;
  }
  return descendants[clusterId].includes(edge.v) || isDescendant(edge.v, clusterId) || isDescendant(edge.w, clusterId) || descendants[clusterId].includes(edge.w);
};
const copy = (clusterId, graph, newGraph, rootId) => {
  mermaid_core.log.warn(
    "Copying children of ",
    clusterId,
    "root",
    rootId,
    "data",
    graph.node(clusterId),
    rootId
  );
  const nodes = graph.children(clusterId) || [];
  if (clusterId !== rootId) {
    nodes.push(clusterId);
  }
  mermaid_core.log.warn("Copying (nodes) clusterId", clusterId, "nodes", nodes);
  nodes.forEach((node) => {
    if (graph.children(node).length > 0) {
      copy(node, graph, newGraph, rootId);
    } else {
      const data = graph.node(node);
      mermaid_core.log.info("cp ", node, " to ", rootId, " with parent ", clusterId);
      newGraph.setNode(node, data);
      if (rootId !== graph.parent(node)) {
        mermaid_core.log.warn("Setting parent", node, graph.parent(node));
        newGraph.setParent(node, graph.parent(node));
      }
      if (clusterId !== rootId && node !== clusterId) {
        mermaid_core.log.debug("Setting parent", node, clusterId);
        newGraph.setParent(node, clusterId);
      } else {
        mermaid_core.log.info("In copy ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
        mermaid_core.log.debug(
          "Not Setting parent for node=",
          node,
          "cluster!==rootId",
          clusterId !== rootId,
          "node!==clusterId",
          node !== clusterId
        );
      }
      const edges = graph.edges(node);
      mermaid_core.log.debug("Copying Edges", edges);
      edges.forEach((edge) => {
        mermaid_core.log.info("Edge", edge);
        const data2 = graph.edge(edge.v, edge.w, edge.name);
        mermaid_core.log.info("Edge data", data2, rootId);
        try {
          if (edgeInCluster(edge, rootId)) {
            mermaid_core.log.info("Copying as ", edge.v, edge.w, data2, edge.name);
            newGraph.setEdge(edge.v, edge.w, data2, edge.name);
            mermaid_core.log.info("newGraph edges ", newGraph.edges(), newGraph.edge(newGraph.edges()[0]));
          } else {
            mermaid_core.log.info(
              "Skipping copy of edge ",
              edge.v,
              "-->",
              edge.w,
              " rootId: ",
              rootId,
              " clusterId:",
              clusterId
            );
          }
        } catch (e) {
          mermaid_core.log.error(e);
        }
      });
    }
    mermaid_core.log.debug("Removing node", node);
    graph.removeNode(node);
  });
};
const extractDescendants = (id, graph) => {
  const children = graph.children(id);
  let res = [...children];
  for (const child of children) {
    parents[child] = id;
    res = [...res, ...extractDescendants(child, graph)];
  }
  return res;
};
const findNonClusterChild = (id, graph) => {
  mermaid_core.log.trace("Searching", id);
  const children = graph.children(id);
  mermaid_core.log.trace("Searching children of id ", id, children);
  if (children.length < 1) {
    mermaid_core.log.trace("This is a valid node", id);
    return id;
  }
  for (const child of children) {
    const _id = findNonClusterChild(child, graph);
    if (_id) {
      mermaid_core.log.trace("Found replacement for", id, " => ", _id);
      return _id;
    }
  }
};
const getAnchorId = (id) => {
  if (!clusterDb[id]) {
    return id;
  }
  if (!clusterDb[id].externalConnections) {
    return id;
  }
  if (clusterDb[id]) {
    return clusterDb[id].id;
  }
  return id;
};
const adjustClustersAndEdges = (graph, depth) => {
  if (!graph || depth > 10) {
    mermaid_core.log.debug("Opting out, no graph ");
    return;
  } else {
    mermaid_core.log.debug("Opting in, graph ");
  }
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    if (children.length > 0) {
      mermaid_core.log.warn(
        "Cluster identified",
        id,
        " Replacement id in edges: ",
        findNonClusterChild(id, graph)
      );
      descendants[id] = extractDescendants(id, graph);
      clusterDb[id] = { id: findNonClusterChild(id, graph), clusterData: graph.node(id) };
    }
  });
  graph.nodes().forEach(function(id) {
    const children = graph.children(id);
    const edges = graph.edges();
    if (children.length > 0) {
      mermaid_core.log.debug("Cluster identified", id, descendants);
      edges.forEach((edge) => {
        if (edge.v !== id && edge.w !== id) {
          const d1 = isDescendant(edge.v, id);
          const d2 = isDescendant(edge.w, id);
          if (d1 ^ d2) {
            mermaid_core.log.warn("Edge: ", edge, " leaves cluster ", id);
            mermaid_core.log.warn("Decendants of XXX ", id, ": ", descendants[id]);
            clusterDb[id].externalConnections = true;
          }
        }
      });
    } else {
      mermaid_core.log.debug("Not a cluster ", id, descendants);
    }
  });
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    mermaid_core.log.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    mermaid_core.log.warn("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
    let v = e.v;
    let w = e.w;
    mermaid_core.log.warn(
      "Fix XXX",
      clusterDb,
      "ids:",
      e.v,
      e.w,
      "Translating: ",
      clusterDb[e.v],
      " --- ",
      clusterDb[e.w]
    );
    if (clusterDb[e.v] && clusterDb[e.w] && clusterDb[e.v] === clusterDb[e.w]) {
      mermaid_core.log.warn("Fixing and trixing link to self - removing XXX", e.v, e.w, e.name);
      mermaid_core.log.warn("Fixing and trixing - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      const specialId = e.w + "---" + e.v;
      graph.setNode(specialId, {
        domId: specialId,
        id: specialId,
        labelStyle: "",
        labelText: edge.label,
        padding: 0,
        shape: "labelRect",
        style: ""
      });
      const edge1 = JSON.parse(JSON.stringify(edge));
      const edge2 = JSON.parse(JSON.stringify(edge));
      edge1.label = "";
      edge1.arrowTypeEnd = "none";
      edge2.label = "";
      edge1.fromCluster = e.v;
      edge2.toCluster = e.v;
      graph.setEdge(v, specialId, edge1, e.name + "-cyclic-special");
      graph.setEdge(specialId, w, edge2, e.name + "-cyclic-special");
    } else if (clusterDb[e.v] || clusterDb[e.w]) {
      mermaid_core.log.warn("Fixing and trixing - removing XXX", e.v, e.w, e.name);
      v = getAnchorId(e.v);
      w = getAnchorId(e.w);
      graph.removeEdge(e.v, e.w, e.name);
      if (v !== e.v) {
        edge.fromCluster = e.v;
      }
      if (w !== e.w) {
        edge.toCluster = e.w;
      }
      mermaid_core.log.warn("Fix Replacing with XXX", v, w, e.name);
      graph.setEdge(v, w, edge, e.name);
    }
  });
  mermaid_core.log.warn("Adjusted Graph", write(graph));
  extractor(graph, 0);
  mermaid_core.log.trace(clusterDb);
};
const extractor = (graph, depth) => {
  mermaid_core.log.warn("extractor - ", depth, write(graph), graph.children("D"));
  if (depth > 10) {
    mermaid_core.log.error("Bailing out");
    return;
  }
  let nodes = graph.nodes();
  let hasChildren = false;
  for (const node of nodes) {
    const children = graph.children(node);
    hasChildren = hasChildren || children.length > 0;
  }
  if (!hasChildren) {
    mermaid_core.log.debug("Done, no node has children", graph.nodes());
    return;
  }
  mermaid_core.log.debug("Nodes = ", nodes, depth);
  for (const node of nodes) {
    mermaid_core.log.debug(
      "Extracting node",
      node,
      clusterDb,
      clusterDb[node] && !clusterDb[node].externalConnections,
      !graph.parent(node),
      graph.node(node),
      graph.children("D"),
      " Depth ",
      depth
    );
    if (!clusterDb[node]) {
      mermaid_core.log.debug("Not a cluster", node, depth);
    } else if (!clusterDb[node].externalConnections && // !graph.parent(node) &&
    graph.children(node) && graph.children(node).length > 0) {
      mermaid_core.log.warn(
        "Cluster without external connections, without a parent and with children",
        node,
        depth
      );
      const graphSettings = graph.graph();
      let dir = graphSettings.rankdir === "TB" ? "LR" : "TB";
      if (clusterDb[node] && clusterDb[node].clusterData && clusterDb[node].clusterData.dir) {
        dir = clusterDb[node].clusterData.dir;
        mermaid_core.log.warn("Fixing dir", clusterDb[node].clusterData.dir, dir);
      }
      const clusterGraph = new layout.Graph({
        multigraph: true,
        compound: true
      }).setGraph({
        rankdir: dir,
        // Todo: set proper spacing
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      mermaid_core.log.warn("Old graph before copy", write(graph));
      copy(node, graph, clusterGraph, node);
      graph.setNode(node, {
        clusterNode: true,
        id: node,
        clusterData: clusterDb[node].clusterData,
        labelText: clusterDb[node].labelText,
        graph: clusterGraph
      });
      mermaid_core.log.warn("New graph after copy node: (", node, ")", write(clusterGraph));
      mermaid_core.log.debug("Old graph after copy", write(graph));
    } else {
      mermaid_core.log.warn(
        "Cluster ** ",
        node,
        " **not meeting the criteria !externalConnections:",
        !clusterDb[node].externalConnections,
        " no parent: ",
        !graph.parent(node),
        " children ",
        graph.children(node) && graph.children(node).length > 0,
        graph.children("D"),
        depth
      );
      mermaid_core.log.debug(clusterDb);
    }
  }
  nodes = graph.nodes();
  mermaid_core.log.warn("New list of nodes", nodes);
  for (const node of nodes) {
    const data = graph.node(node);
    mermaid_core.log.warn(" Now next level", node, data);
    if (data.clusterNode) {
      extractor(data.graph, depth + 1);
    }
  }
};
const sorter = (graph, nodes) => {
  if (nodes.length === 0) {
    return [];
  }
  let result = Object.assign(nodes);
  nodes.forEach((node) => {
    const children = graph.children(node);
    const sorted = sorter(graph, children);
    result = [...result, ...sorted];
  });
  return result;
};
const sortNodesByHierarchy = (graph) => sorter(graph, graph.children());
const rect = (parent, node) => {
  mermaid_core.log.info("Creating subgraph rect for ", node.id, node);
  const shapeSvg = parent.insert("g").attr("class", "cluster" + (node.class ? " " + node.class : "")).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const useHtmlLabels = mermaid_core.evaluate(mermaid_core.getConfig().flowchart.htmlLabels);
  const label = shapeSvg.insert("g").attr("class", "cluster-label");
  const text = node.labelType === "markdown" ? createText1f5f8f92.createText(label, node.labelText, { style: node.labelStyle, useHtmlLabels }) : label.node().appendChild(edges2e77835f.createLabel$1(node.labelText, node.labelStyle, void 0, true));
  let bbox = text.getBBox();
  if (mermaid_core.evaluate(mermaid_core.getConfig().flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = mermaid_core.select(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  const width = node.width <= bbox.width + padding ? bbox.width + padding : node.width;
  if (node.width <= bbox.width + padding) {
    node.diff = (bbox.width - node.width) / 2 - node.padding / 2;
  } else {
    node.diff = -node.padding / 2;
  }
  mermaid_core.log.trace("Data ", node, JSON.stringify(node));
  rect2.attr("style", node.style).attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - width / 2).attr("y", node.y - node.height / 2 - halfPadding).attr("width", width).attr("height", node.height + padding);
  if (useHtmlLabels) {
    label.attr(
      "transform",
      // This puts the labal on top of the box instead of inside it
      "translate(" + (node.x - bbox.width / 2) + ", " + (node.y - node.height / 2) + ")"
    );
  } else {
    label.attr(
      "transform",
      // This puts the labal on top of the box instead of inside it
      "translate(" + node.x + ", " + (node.y - node.height / 2) + ")"
    );
  }
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.intersect = function(point) {
    return edges2e77835f.intersectRect$1(node, point);
  };
  return shapeSvg;
};
const noteGroup = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", "note-cluster").attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", node.width + padding).attr("height", node.height + padding).attr("fill", "none");
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.intersect = function(point) {
    return edges2e77835f.intersectRect$1(node, point);
  };
  return shapeSvg;
};
const roundedWithTitle = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", node.classes).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const label = shapeSvg.insert("g").attr("class", "cluster-label");
  const innerRect = shapeSvg.append("rect");
  const text = label.node().appendChild(edges2e77835f.createLabel$1(node.labelText, node.labelStyle, void 0, true));
  let bbox = text.getBBox();
  if (mermaid_core.evaluate(mermaid_core.getConfig().flowchart.htmlLabels)) {
    const div = text.children[0];
    const dv = mermaid_core.select(text);
    bbox = div.getBoundingClientRect();
    dv.attr("width", bbox.width);
    dv.attr("height", bbox.height);
  }
  bbox = text.getBBox();
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
  if (node.width <= bbox.width + node.padding) {
    node.diff = (bbox.width + node.padding * 0 - node.width) / 2;
  } else {
    node.diff = -node.padding / 2;
  }
  rect2.attr("class", "outer").attr("x", node.x - width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", width + padding).attr("height", node.height + padding);
  innerRect.attr("class", "inner").attr("x", node.x - width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding + bbox.height - 1).attr("width", width + padding).attr("height", node.height + padding - bbox.height - 3);
  label.attr(
    "transform",
    "translate(" + (node.x - bbox.width / 2) + ", " + (node.y - node.height / 2 - node.padding / 3 + (mermaid_core.evaluate(mermaid_core.getConfig().flowchart.htmlLabels) ? 5 : 3)) + ")"
  );
  const rectBox = rect2.node().getBBox();
  node.height = rectBox.height;
  node.intersect = function(point) {
    return edges2e77835f.intersectRect$1(node, point);
  };
  return shapeSvg;
};
const divider = (parent, node) => {
  const shapeSvg = parent.insert("g").attr("class", node.classes).attr("id", node.id);
  const rect2 = shapeSvg.insert("rect", ":first-child");
  const padding = 0 * node.padding;
  const halfPadding = padding / 2;
  rect2.attr("class", "divider").attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2).attr("width", node.width + padding).attr("height", node.height + padding);
  const rectBox = rect2.node().getBBox();
  node.width = rectBox.width;
  node.height = rectBox.height;
  node.diff = -node.padding / 2;
  node.intersect = function(point) {
    return edges2e77835f.intersectRect$1(node, point);
  };
  return shapeSvg;
};
const shapes = { rect, roundedWithTitle, noteGroup, divider };
let clusterElems = {};
const insertCluster = (elem, node) => {
  mermaid_core.log.trace("Inserting cluster");
  const shape = node.shape || "rect";
  clusterElems[node.id] = shapes[shape](elem, node);
};
const clear = () => {
  clusterElems = {};
};
const recursiveRender = (_elem, graph, diagramtype, parentCluster) => {
  mermaid_core.log.info("Graph in recursive render: XXX", write(graph), parentCluster);
  const dir = graph.graph().rankdir;
  mermaid_core.log.trace("Dir in recursive render - dir:", dir);
  const elem = _elem.insert("g").attr("class", "root");
  if (!graph.nodes()) {
    mermaid_core.log.info("No nodes found for", graph);
  } else {
    mermaid_core.log.info("Recursive render XXX", graph.nodes());
  }
  if (graph.edges().length > 0) {
    mermaid_core.log.trace("Recursive edges", graph.edge(graph.edges()[0]));
  }
  const clusters = elem.insert("g").attr("class", "clusters");
  const edgePaths = elem.insert("g").attr("class", "edgePaths");
  const edgeLabels = elem.insert("g").attr("class", "edgeLabels");
  const nodes = elem.insert("g").attr("class", "nodes");
  graph.nodes().forEach(function(v) {
    const node = graph.node(v);
    if (parentCluster !== void 0) {
      const data = JSON.parse(JSON.stringify(parentCluster.clusterData));
      mermaid_core.log.info("Setting data for cluster XXX (", v, ") ", data, parentCluster);
      graph.setNode(parentCluster.id, data);
      if (!graph.parent(v)) {
        mermaid_core.log.trace("Setting parent", v, parentCluster.id);
        graph.setParent(v, parentCluster.id, data);
      }
    }
    mermaid_core.log.info("(Insert) Node XXX" + v + ": " + JSON.stringify(graph.node(v)));
    if (node && node.clusterNode) {
      mermaid_core.log.info("Cluster identified", v, node.width, graph.node(v));
      const o = recursiveRender(nodes, node.graph, diagramtype, graph.node(v));
      const newEl = o.elem;
      edges2e77835f.updateNodeBounds(node, newEl);
      node.diff = o.diff || 0;
      mermaid_core.log.info("Node bounds (abc123)", v, node, node.width, node.x, node.y);
      edges2e77835f.setNodeElem(newEl, node);
      mermaid_core.log.warn("Recursive render complete ", newEl, node);
    } else {
      if (graph.children(v).length > 0) {
        mermaid_core.log.info("Cluster - the non recursive path XXX", v, node.id, node, graph);
        mermaid_core.log.info(findNonClusterChild(node.id, graph));
        clusterDb[node.id] = { id: findNonClusterChild(node.id, graph), node };
      } else {
        mermaid_core.log.info("Node - the non recursive path", v, node.id, node);
        edges2e77835f.insertNode(nodes, graph.node(v), dir);
      }
    }
  });
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e.v, e.w, e.name);
    mermaid_core.log.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
    mermaid_core.log.info("Edge " + e.v + " -> " + e.w + ": ", e, " ", JSON.stringify(graph.edge(e)));
    mermaid_core.log.info("Fix", clusterDb, "ids:", e.v, e.w, "Translateing: ", clusterDb[e.v], clusterDb[e.w]);
    edges2e77835f.insertEdgeLabel(edgeLabels, edge);
  });
  graph.edges().forEach(function(e) {
    mermaid_core.log.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
  });
  mermaid_core.log.info("#############################################");
  mermaid_core.log.info("###                Layout                 ###");
  mermaid_core.log.info("#############################################");
  mermaid_core.log.info(graph);
  layout.layout(graph);
  mermaid_core.log.info("Graph after layout:", write(graph));
  let diff = 0;
  sortNodesByHierarchy(graph).forEach(function(v) {
    const node = graph.node(v);
    mermaid_core.log.info("Position " + v + ": " + JSON.stringify(graph.node(v)));
    mermaid_core.log.info(
      "Position " + v + ": (" + node.x,
      "," + node.y,
      ") width: ",
      node.width,
      " height: ",
      node.height
    );
    if (node && node.clusterNode) {
      edges2e77835f.positionNode(node);
    } else {
      if (graph.children(v).length > 0) {
        insertCluster(clusters, node);
        clusterDb[node.id].node = node;
      } else {
        edges2e77835f.positionNode(node);
      }
    }
  });
  graph.edges().forEach(function(e) {
    const edge = graph.edge(e);
    mermaid_core.log.info("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(edge), edge);
    const paths = edges2e77835f.insertEdge(edgePaths, e, edge, clusterDb, diagramtype, graph);
    edges2e77835f.positionEdgeLabel(edge, paths);
  });
  graph.nodes().forEach(function(v) {
    const n = graph.node(v);
    mermaid_core.log.info(v, n.type, n.diff);
    if (n.type === "group") {
      diff = n.diff;
    }
  });
  return { elem, diff };
};
const render = (elem, graph, markers, diagramtype, id) => {
  edges2e77835f.insertMarkers$1(elem, markers, diagramtype, id);
  edges2e77835f.clear$1();
  edges2e77835f.clear();
  clear();
  clear$1();
  mermaid_core.log.warn("Graph at first:", write(graph));
  adjustClustersAndEdges(graph);
  mermaid_core.log.warn("Graph after:", write(graph));
  recursiveRender(elem, graph, diagramtype);
};

exports.render = render;
