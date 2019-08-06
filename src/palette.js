import go from 'gojs';
import state from './state.js'
const make = go.GraphObject.make;

export default function initPalette() {
    state.palette = make(go.Palette, "palette",
        {
            nodeTemplateMap: state.diagram.nodeTemplateMap,
            groupTemplate: state.diagram.groupTemplate,
            layout: make(go.GridLayout, { wrappingColumn: 1 }),
            model: new go.GraphLinksModel([
                { figure: "RoundedRectangle", name: "Green" },
                { figure: "Cube", name: "Blue" },
                { figure: "TriangleUp", name: "Red" },
                { figure: "Group", category: "Group", name: "", isGroup: true }
            ])
        }
    )
}