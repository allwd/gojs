const palette = [
    { figure: "RoundedRectangle", name: "Green", width: 150, height: 70 },
    { figure: "Square", name: "Blue", width: 75, height: 75 },
    { figure: "TriangleUp", name: "Red", width: 120, height: 90 },
    { figure: "Group", category: "Group", name: "", isGroup: true }
];

const sample = [
    { "figure": "Group", "category": "Group", "isGroup": true, "name": "Test", "key": -4, "loc": "-259 -40" },
    { "fill": "Teal", "figure": "TriangleUp", "category": "TriangleUp", "name": "Teal", "key": -3, "loc": "-219 -40" },
    { "fill": "blue", "figure": "Cube", "category": "Cube", "name": "Blue", "key": -2, "loc": "-211 -150" }
];

const font = "bold 9pt Helvetica, Arial, sans-serif";

export default {
    sample,
    palette,
    font
}