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

        const resize = () => go.ResizingTool.prototype.resize.call(this, object);

        const obj = this.adornedObject;
        const part = obj.part;
        // const angle = obj.getDocumentAngle();
        // const sc = obj.getDocumentScale();

        // const radAngle = Math.PI * angle / 180;
        // const angleCos = Math.cos(radAngle);
        // const angleSin = Math.sin(radAngle);

        // const angleRight = (angle > 270 || angle < 90) ? 1 : 0;
        // const angleBottom = (angle > 0 && angle < 180) ? 1 : 0;
        // const angleLeft = (angle > 90 && angle < 270) ? 1 : 0;
        // const angleTop = (angle > 180 && angle < 360) ? 1 : 0;

        // const deltaWidth = object.width - obj.naturalBounds.width;
        // const deltaHeight = object.height - obj.naturalBounds.height;

        // const pos = part.position.copy();
        // pos.x += sc * ((object.x + deltaWidth * angleLeft) * angleCos - (object.y + deltaHeight * angleBottom) * angleSin);
        // pos.y += sc * ((object.x + deltaWidth * angleTop) * angleSin + (object.y + deltaHeight * angleLeft) * angleCos);

        // obj.desiredSize = object.size;
        // // go.Node.prototype.move.call(part, pos);
        // window.adornedObject = obj

        // resize()
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
