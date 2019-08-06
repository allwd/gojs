import go from 'gojs';
import initDiagram from './diagram';
import initPalette from './palette';
import initInspector from './inspector';
import initOverview from './overview';
import state from './state';
import actions from './actions';
import config from './config';

window.onload = function () {
    initDiagram();
    initPalette();
    initOverview();
    initInspector();

    state.diagram.model = new go.GraphLinksModel(config.sample);
    state.diagram.select(state.diagram.nodes.first());

    state.diagram.toolManager.linkingTool.linkValidation = actions.validateConnection

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