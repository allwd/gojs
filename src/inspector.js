import state from './state';

export default function initInspector() {
    new Inspector('editable', state.diagram, {
        showAllProperties: false,
        includesOwnProperties: false,
        properties: {
            'name': {
                type: 'select',
                choices: [
                    'Red', 'Green', 'Blue'
                ],
                show: Inspector.showIfNode
            },
            'figure': {
                type: 'select',
                choices: [
                    'RoundedRectangle',
                    'Square',
                    'TriangleUp'
                ],
                show: Inspector.showIfNode
            },
            'color': {
                type: 'color',
                show: Inspector.showIfNode
            }
        }
    })
}