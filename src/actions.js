import go from 'gojs';
import state from './state';

/**
 *   @example
 *   // updates node with key -2's name to green 
 *   app.actions.updateData(app.state.diagram.findNodeForKey('-2'), 'name', 'Green')
 *   @example
 *   // updates node's location
 *   app.actions.updateData(app.state.diagram.findNodeForKey('-3'), 'loc', '-220 -90')
 */
function updateData(node, key, value) {
    state.diagram.model.commit(model => {
        model.set(node.data, key, value);
    }, `change ${key} to ${String(value)}`)
}

const moveGraphObject = (object, x, y) => 
    go.Node.prototype.move.call(object, Object.assign(object.position.copy(), { x, y }), true)

const resizeParentGroups = (key) => {
    const { containingGroup } = state.diagram.findNodeForKey(key)
    if (containingGroup && containingGroup.memberParts.count) {
        let { top, left, right, bottom } = containingGroup.actualBounds
        containingGroup.memberParts.each(node => {
            top = Math.min(node.actualBounds.top, top)
            left = Math.min(node.actualBounds.left, left)
            right = Math.max(node.actualBounds.right, right)
            bottom = Math.max(node.actualBounds.bottom, bottom)
        })
        
        let { left: oldLeft, top: oldTop, right: oldRight, bottom: oldBottom } = containingGroup.actualBounds
        let { width, height }= go.Size.parse(containingGroup.data.size)
        
        width += right - oldRight + (oldLeft - left)
        height += bottom - oldBottom + (oldTop - top)

        if (right > oldRight) {
            width = Math.max(width, right - left - 3)
        }

        if (bottom > oldBottom) {
            height = Math.max(height, bottom - top - 3)
        }

        containingGroup.position = new go.Point(left, top)
        // containingGroup.move(Object.assign(containingGroup.position.copy(), { x: left, y: top }), false)
        // moveGraphObject(containingGroup, left, top)
        updateData(containingGroup, 'size', `${width} ${height}`)
        // containingGroup.findObject('group').setProperties({minSize: new go.Size(right - left - 2, bottom - top - 2)})

        resizeParentGroups(containingGroup.key)
    }
}

const ensureGroupBounds = (group) => {
    let [top, right, bottom, left] = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    group.memberParts.each(node => {
        top = Math.min(node.actualBounds.top, top)
        left = Math.min(node.actualBounds.left, left)
        right = Math.max(node.actualBounds.right, right)
        bottom = Math.max(node.actualBounds.bottom, bottom)
    })

    if(group.actualBounds.right < right || group.actualBounds.bottom < bottom) {
        const dataSize = go.Size.parse(group.data.size);
        group.diagram.model.setDataProperty(group.data, 'size', go.Size.stringify(new go.Size(dataSize.width + right - group.actualBounds.right, dataSize.height + bottom - group.actualBounds.bottom)))
       // group.desiredSize = new go.Size(group.desiredSize.width + right - group.actualBounds.right, group.desiredSize.height);
    }

    if (group.actualBounds.top > top) {
        group.diagram.model.setDataProperty(group.data, 'size', go.Size.stringify(new go.Size(dataSize.width + right - group.actualBounds.right, dataSize.height + bottom - group.actualBounds.bottom)))
    }

    console.log(group.actualBounds.left, left)
    if (
        group.actualBounds.left > left ||
        group.actualBounds.top > top ||
        group.actualBounds.right < right ||
        group.actualBounds.bottom < bottom
    ) {
        console.log(group.actualBounds.left > left, group.actualBounds.top > top, group.actualBounds.right < right, group.actualBounds.bottom < bottom)
    }
}

function validateConnection(fromNode, fromPort, toNode, toPort) {
    return fromNode.data.figure !== toNode.data.figure || String(fromNode.data.name).toLowerCase() === 'green'
}

function save() {
    document.getElementById('savedModel').value = state.diagram.model.toJson();
    state.diagram.isModified = false;
}

function load() {
    state.diagram.model = go.Model.fromJson(document.getElementById('savedModel').value);
}

function exportToSvg() {
    const svgWindow = window.open();

    if (!svgWindow) {
        return;
    }

    const size = new go.Size(700, 960);
    const bounds = state.diagram.documentBounds;
    let x = bounds.x;
    let y = bounds.y;

    while (y < bounds.bottom) {
        while (x < bounds.right) {
            const svg = state.diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: size });
            svgWindow.document.body.appendChild(svg);
            x += size.width;
        }

        x = bounds.x;
        y += size.height;
    }
}

function exportToJpeg() {
    const img = state.diagram.makeImageData({
        scale: 1.0,
        type: 'image/jpeg',
        background: 'white'
    })
    window.open(img);
}

function finishDrop(event, group) {
    const ok = group !== null
        ? group.addMembers(group.diagram.selection, true)
        : event.diagram.commandHandler.addTopLevelParts(event.diagram.selection, true);

    if (!ok) {
        event.diagram.currentTool.doCancel();
    } else {
        setTimeout(() => resizeParentGroups(group.diagram.selection.first().key), 1)
    }
}

function highlightGroup(event, group, show) {
    if (!group) {
        return;
    }
    event.handled = true;
    if (show) {
        const tool = group.diagram.toolManager.draggingTool;
        const map = tool.draggedParts || tool.copiedParts;
        
        if (group.canAddMembers(map.toKeySet())) {
            group.isHighlighted = true;
            return;
        }
    }

    group.isHighlighted = false;
}

async function reloadLinks(event = null) {
    if (event && event.modelChange !== 'nodeDataArray') {
        return
    }

    const exclude = []
    const nodes = state.diagram.model.nodeDataArray.filter(node => {
        if (String(node.name).toLowerCase() === 'green') {
            exclude.push(node.key)
            return true
        }

        return false
    });

    const links = state.diagram.model.linkDataArray.filter(link => !(exclude.includes(link.from) || exclude.includes(link.to)))

    let prev = null;
    for (let node of nodes) {
        if (prev) {
            links.push({
                from: prev.key,
                to: node.key
            })
        }

        prev = node
    }

    state.diagram.model.linkDataArray = links;
}

export default {
    validateConnection,
    exportToSvg,
    exportToJpeg,
    save,
    load,
    finishDrop,
    highlightGroup,
    reloadLinks,
    updateData,
    moveGraphObject,
    resizeParentGroups,
    ensureGroupBounds
}
