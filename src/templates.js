import go from 'gojs';
import actions from './actions.js';
const make = go.GraphObject.make;

const resizeAdornmentTemplate =
    make(go.Adornment, "Spot",
        { locationSpot: go.Spot.Right },
        make(go.Placeholder),
        make(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        make(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        make(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        make(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        make(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        make(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        make(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        make(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
    );

const nodeTemplate = make(go.Node, "Auto",
    {
        locationSpot: go.Spot.Center
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate },
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
            name: "TEXT"
        },
        new go.Binding("text", "name").makeTwoWay()
    )
)

const groupTemplate = make(go.Group, "Vertical",
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
            background: "rgb(240,240,240)",
            alignment: new go.Spot(0, 0),
            minSize: new go.Size(50, 22)
        },
        new go.Binding("text", "name").makeTwoWay()),
    make(go.Panel, "Auto",
        { name: "PANEL" },
        make(go.Shape, "Rectangle",
            { fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3, minSize: new go.Size(100, 100) }),
        make(go.Placeholder, { padding: 15 })
    )
);

export default {
    groupTemplate,
    nodeTemplate,
    resizeAdornmentTemplate
}