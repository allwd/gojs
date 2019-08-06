import go from 'gojs';
import state from './state.js';
import actions from './actions.js';
import templates from './templates.js';
const make = go.GraphObject.make;

export default function initDiagram() {
    state.diagram = make(go.Diagram, "workspace", {
        "commandHandler.archetypeGroupData": { isGroup: true, category: "OfNodes" },
        "undoManager.isEnabled": true,
        "ModelChanged": (e) => {
            if (e && e.modelChange === "nodeDataArray") {
                actions.reloadLinks();
            }
        }
    })

    state.diagram.nodeTemplate = templates.nodeTemplate;
    state.diagram.groupTemplate = templates.groupTemplate
}
