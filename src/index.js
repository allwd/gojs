import go from 'gojs';
import initDiagram from './diagram.js';
import initPalette from './palette.js';
import initInspector from './inspector.js';
import initOverview from './overview.js';
import state from './state.js';
import actions from './actions.js';
import config from './config.js';

window.onload = function () {
    initDiagram();
    initPalette();
    initOverview();
    initInspector();

    state.diagram.model = new go.GraphLinksModel(config.sample);
    state.diagram.select(state.diagram.nodes.first());

    state.diagram.requestUpdate();
    state.palette.requestUpdate();
}

window.onresize = function () {
    if (typeof state.diagram !== "undefined") {
        state.diagram.requestUpdate();
    }
}

window.app = {
    state,
    actions
}