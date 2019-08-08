import go from 'gojs';
import state from './state';
import actions from './actions';
import templates from './templates';
const make = go.GraphObject.make;

export default function initDiagram() {
    state.diagram = make(go.Diagram, 'workspace', {
        'undoManager.isEnabled': true,
        'nodeTemplate': templates.nodeTemplate,
        'groupTemplate': templates.groupTemplate,
        'linkTemplate': templates.linkTemplate
    })
}
