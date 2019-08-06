import go from 'gojs';
import state from './state.js';
import actions from './actions.js';
import config from './config.js';
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

    state.diagram.nodeTemplateMap.add("",
        make(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: config.nodeResizeAdornmentTemplate },
            make(go.Shape, "Ellipse",
                new go.Binding("figure", "figure"),
                new go.Binding("fill", "name"),
                new go.Binding("stroke", "stroke"),
                new go.Binding("width", "width"),
                new go.Binding("height", "height")
            ),
            make(go.TextBlock,
                {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    font: "bold 9pt Helvetica, Arial, sans-serif",
                    name: "TEXT",
                    textEdited: (a, b, c) => actions.reloadLinks()
                },
                new go.Binding("text", "name").makeTwoWay()
            )
        )
    );

    state.diagram.groupTemplate =
        make(go.Group, "Vertical",
            {
                mouseDragEnter: (e, group, prev) => actions.highlightGroup(e, group, true),
                mouseDragLeave: (e, group, next) => actions.highlightGroup(e, group, false),
                mouseDrop: (e, node) => actions.finishDrop(e, node),
                selectionObjectName: "PANEL",
                computesBoundsAfterDrag: true,
                handlesDragDropForMembers: true,
                ungroupable: true,
                layout:
                    make(go.GridLayout,
                        {
                            wrappingColumn: 1, alignment: go.GridLayout.Position,
                            cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                        })
            },
            new go.Binding("background", "isHighlighted", isHighlighted => isHighlighted ? "rgba(255,0,0,0.2)" : "transparent").ofObject(),
            make(go.TextBlock,
                {
                    font: "bold 19px sans-serif",
                    isMultiline: false,
                    editable: true,
                    background: "rgb(240,240,240)"
                },
                new go.Binding("text", "name").makeTwoWay()),
            make(go.Panel, "Auto",
                { name: "PANEL" },
                make(go.Shape, "Rectangle",
                    { fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3 }),
                make(go.Placeholder, { padding: 15 })
            )
        );
}
