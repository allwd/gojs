import go from 'gojs';
import actions from './actions';
import config from './config';
const make = go.GraphObject.make;

function makePort(portId, alignment, spot, fromLinkable, toLinkable) {
    const horizontal = alignment.equals(go.Spot.Top) || alignment.equals(go.Spot.Bottom);

    return make(go.Shape,
        {
            alignment,
            portId,
            fromLinkable,
            toLinkable,
            fill: "transparent",
            strokeWidth: 0,
            width: horizontal ? NaN : 8,
            height: !horizontal ? NaN : 8,
            stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
            fromSpot: spot,
            toSpot: spot,
            cursor: "pointer",
            mouseEnter: function (event, port) {
                if (!event.diagram.isReadOnly) {
                    port.fill = "rgba(255,0,255,0.5)";
                }
            },
            mouseLeave: function (_, port) {
                port.fill = "transparent";
            }
        });
}

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
        new go.Binding("width", "width"),
        new go.Binding("height", "height")
    ),
    makePort("T", go.Spot.Top, go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false),
    make(go.TextBlock,
        {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            font: config.font,
            name: "TEXT"
        },
        new go.Binding("stroke", "color"),
        new go.Binding("text", "name").makeTwoWay()
    )
)

const linkTemplate = make(go.Link,
    {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        selectionAdorned: false,
        mouseEnter: function (_, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
        mouseLeave: function (_, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
    },
    new go.Binding("points").makeTwoWay(),
    make(go.Shape,
        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
    make(go.Shape,
        { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
        new go.Binding("stroke", "isSelected", isSelected => isSelected ? "dodgerblue" : "gray").ofObject()),
    make(go.Shape,
        { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
    make(go.Panel, "Auto",
        { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
        new go.Binding("visible", "visible").makeTwoWay(),
        make(go.Shape, "RoundedRectangle",
            { fill: "#F8F8F8", strokeWidth: 0 }),
        make(go.TextBlock, "LINK NAME",
            {
                textAlign: "center",
                font: config.font,
                stroke: "#333333",
                editable: true
            },
            new go.Binding("text").makeTwoWay())
    )
);

const groupTemplate = make(go.Group, "Vertical",
    {
        mouseDragEnter: (e, group, _) => actions.highlightGroup(e, group, true),
        mouseDragLeave: (e, group, _) => actions.highlightGroup(e, group, false),
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
    linkTemplate,
    resizeAdornmentTemplate
}