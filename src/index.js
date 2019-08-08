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
    state.diagram.toolManager.resizingTool.resize = function(newr) {
        var diagram = this.diagram;
        if (diagram === null) return;
        var obj = this.adornedObject;
        var part = obj.part;
    
              // calculate new location
              var angle = obj.getDocumentAngle();
              var sc = obj.getDocumentScale();
        
              var radAngle = Math.PI * angle / 180;
              var angleCos = Math.cos(radAngle);
              var angleSin = Math.sin(radAngle);
        
              var angleRight = (angle > 270 || angle < 90) ? 1 : 0;
              var angleBottom = (angle > 0 && angle < 180) ? 1 : 0;
              var angleLeft = (angle > 90 && angle < 270) ? 1 : 0;
              var angleTop = (angle > 180 && angle < 360) ? 1 : 0;
        
              var deltaWidth = newr.width - obj.naturalBounds.width;
              var deltaHeight = newr.height - obj.naturalBounds.height;
        
              var pos = part.position.copy();
              pos.x += sc * ((newr.x + deltaWidth * angleLeft) * angleCos - (newr.y + deltaHeight * angleBottom) * angleSin);
              pos.y += sc * ((newr.x + deltaWidth * angleTop) * angleSin + (newr.y + deltaHeight * angleLeft) * angleCos);
        
              obj.desiredSize = newr.size;
              go.Node.prototype.move.call(part, pos);
            };
    const moveGraphObject = (object, x, y) => 
        go.Node.prototype.move.call(object, Object.assign(object.position.copy(), { x, y }), true)

    state.diagram.addDiagramListener('PartResized', (object) => {
        const group = object.subject.panel.containingGroup
        if (!group) {
            return
        }

        const { top, right, bottom, left } = object.subject.actualBounds
        console.log(top, left)
        const { width, height } = object.subject
        let {x, y} = go.Point.parse(object.subject.panel.data.loc)
        x -= width/2
        y -= height/2
        const {x: groupX, y: groupY} = go.Point.parse(group.data.loc)
        let newX = groupX
        let newY = groupY

        if (x < groupX) {
            newX = x
        }

        if (y < groupY) {
            newY = y
        }


        moveGraphObject(group, newX, newY)
        const { width: groupWidth, height: groupHeight }= go.Size.parse(group.data.size)
        const newWidth = Math.max(width, x < groupX ? groupWidth - (newX - groupX)  : groupWidth)
        const newHeight = Math.max(height, y < groupY ? groupHeight - (newY - groupY) : groupHeight)
        console.log(newWidth, newHeight)
        actions.updateData(group, 'size', `${newWidth} ${newHeight}`)

        /*
        More or less TODO:
        - on resize, get groups in that x y
        - iterate on groups and check left most side element, top most side element, right most side element and bottom most side element
        - check if current group boundaries are not smaller than elements on the edges (top, left)
        - check if currently being resized element exceeds one of boundaries
        - group with moveGroup if left or top are exceeded, set right and bottom boundaries to have the move difference
        - check if current group boundaries are not smaller than elements on the edges (right, bottom)
        - if so, update size to cover
        - call updateData with the new size
        */

        // app.state.diagram.findNodeForKey('-4').loc = new go.Point(-220, -90)
        // app.actions.updateData(app.state.diagram.findNodeForKey('-4'), 'width', width)
        // group.move(new go.Point(groupX, groupY), true)
        // app.state.diagram.findNodeForKey('-4').move(new go.Point(-320, -50))
        // app.actions.updateData(app.state.diagram.findNodeForKey('-4'), 'loc', '-220 -90')
        // actions.updateData(group.data, 'loc', `${L} ${R}`)

    })

    // state.diagram.toolManager.resizingTool.resize = (obj) => {
    //     window.test = obj
    //     console.log('resizingTool', obj)
    // }

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