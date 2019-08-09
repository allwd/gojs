import go from 'gojs';
import initDiagram from './diagram';
import initPalette from './palette';
import initInspector from './inspector';
import initOverview from './overview';
import state from './state';
import actions from './actions';
import config from './config';

/*
 - check if resize is on left or right edge
 - if it is on the left edge, check most left element and position of right boundary
 - min width will be rightBoundary - leftElementX - strokeWidth
 - similar for height on top
 - on right side min width rightElementX - leftBoundary - strokeWidth
 - similar for height on bottom
 */

window.onload = function () {
    initDiagram();
    initPalette();
    initOverview();
    initInspector();

    state.diagram.model = new go.GraphLinksModel(config.sample);
    state.diagram.select(state.diagram.nodes.first());
    state.diagram.toolManager.resizingTool.resize = function(object) {
        const diagram = this.diagram;
        if (diagram === null) {
            return;
        }

        const resize = (rect) => go.ResizingTool.prototype.resize.call(this, rect);

        const obj = this.adornedObject;
        const part = obj.part;
        actions.resizeParentGroups(part.key)
        if (part.data.isGroup) {
            actions.ensureGroupBounds(object, part, resize)
        } else {
            resize()
        }
    };


    state.diagram.toolManager.linkingTool.linkValidation = actions.validateConnection
}

window.onresize = function () {
    if (typeof state.diagram !== 'undefined') {
        state.diagram.requestUpdate();
    }
}

window.app = {
    state,
    actions
}
