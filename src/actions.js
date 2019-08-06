import go from 'gojs';
import state from './state';

/**
 *   @example
 *   // updates node with key -2's name to green 
 *   app.actions.updateData(app.state.diagram.findNodeForKey("-2"), "name", "Green")
 */
function updateData(node, key, value) {
    state.diagram.model.commit(model => {
        model.set(node.data, key, value);
    }, `change ${key} to ${String(value)}`)
}

function save() {
    document.getElementById("savedModel").value = state.diagram.model.toJson();
    state.diagram.isModified = false;
}

function load() {
    state.diagram.model = go.Model.fromJson(document.getElementById("savedModel").value);
}

function exportToSvg() {
    var svgWindow = window.open();

    if (!svgWindow) {
        return;
    }

    var size = new go.Size(700, 960);
    var bounds = state.diagram.documentBounds;
    var x = bounds.x;
    var y = bounds.y;

    while (y < bounds.bottom) {
        while (x < bounds.right) {
            var svg = state.diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: size });
            svgWindow.document.body.appendChild(svg);
            x += size.width;
        }

        x = bounds.x;
        y += size.height;
    }
}

function finishDrop(event, group) {
    const ok = group !== null
        ? group.addMembers(group.diagram.selection, true)
        : event.diagram.commandHandler.addTopLevelParts(event.diagram.selection, true);

    if (!ok) {
        event.diagram.currentTool.doCancel();
    }
}

function highlightGroup(event, group, show) {
    if (!group) {
        return;
    }
    event.handled = true;
    if (show) {
        // cannot depend on the group.diagram.selection in the case of external drag-and-drops;
        // instead depend on the DraggingTool.draggedParts or .copiedParts
        var tool = group.diagram.toolManager.draggingTool;
        var map = tool.draggedParts || tool.copiedParts;  // this is a Map
        // now we can check to see if the Group will accept membership of the dragged Parts
        if (group.canAddMembers(map.toKeySet())) {
            group.isHighlighted = true;
            return;
        }
    }

    group.isHighlighted = false;
}

async function reloadLinks(event = null) {
    const exclude = []
    const nodes = state.diagram.model.nodeDataArray.filter(node => {
        if (String(node.name).toLowerCase() === "green") {
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
    exportToSvg,
    save,
    load,
    finishDrop,
    highlightGroup,
    reloadLinks,
    updateData
}
