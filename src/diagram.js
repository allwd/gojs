import go from 'gojs';
import state from './state';
import actions from './actions';
import templates from './templates';
const make = go.GraphObject.make;

export default function initDiagram() {
    state.diagram = make(go.Diagram, "workspace", {
        "commandHandler.archetypeGroupData": { isGroup: true, category: "OfNodes" },
        "undoManager.isEnabled": true,
        "ModelChanged": actions.reloadLinks,
        "nodeTemplate": templates.nodeTemplate,
        "groupTemplate": templates.groupTemplate,
        "linkTemplate": templates.linkTemplate
    })
}
