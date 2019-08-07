import go from 'gojs';
import state from './state';
import config from './config';
const make = go.GraphObject.make;

export default function initPalette() {
    state.palette = make(go.Palette, "palette",
        {
            nodeTemplate: state.diagram.nodeTemplate,
            groupTemplate: state.diagram.groupTemplate,
            layout: make(go.GridLayout, { wrappingColumn: 1 }),
            model: new go.GraphLinksModel(config.palette)
        }
    )
}