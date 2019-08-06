import state from './state';

export default function initInspector() {
    new Inspector('editable', state.diagram, {
        showAllProperties: false
    })
}