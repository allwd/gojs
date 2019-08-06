import go from 'gojs';
const make = go.GraphObject.make;

const palette = [
    { figure: "RoundedRectangle", name: "Green", width: 150, height: 70 },
    { figure: "Square", name: "Blue", width: 75, height: 75 },
    { figure: "TriangleUp", name: "Red", width: 120, height: 90 },
    { figure: "Group", category: "Group", name: "", isGroup: true }
]

const sample = [
    { "figure": "Group", "category": "Group", "isGroup": true, "name": "Test", "key": -4, "loc": "-259 -40" },
    { "fill": "Teal", "figure": "TriangleUp", "category": "TriangleUp", "name": "Teal", "key": -3, "loc": "-219.9186046511627 -40.284883720930225" },
    { "fill": "blue", "figure": "Cube", "category": "Cube", "name": "Blue", "key": -2, "loc": "-211 -150" }
]

const nodeResizeAdornmentTemplate =
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

export default {
    sample,
    nodeResizeAdornmentTemplate,
    palette
}