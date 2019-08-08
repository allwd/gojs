import go from 'gojs';

const sizeToString = (w, h) => go.Size.stringify(new go.Size(w, h));

const palette = [
    { figure: 'RoundedRectangle', name: 'Green', size: sizeToString(150, 75) },
    { figure: 'Square', name: 'Blue', size: sizeToString(120, 120) },
    { figure: 'TriangleUp', name: 'Red', size: sizeToString(120, 75) },
    { figure: 'Group', category: 'Group', name: '', isGroup: true }
];

const sample = [
    { 'figure': 'Group', 'category': 'Group', 'isGroup': true, 'name': 'Test', 'key': -4, 'loc': '-259 -40' },
    { 'fill': 'Red', 'figure': 'TriangleUp', 'color': 'Blue', 'category': 'TriangleUp', 'name': 'Red', 'key': -3, 'loc': '-219 -40' },
    { 'fill': 'blue', 'figure': 'Square', 'category': 'Square', 'name': 'Blue', 'key': -2, 'loc': '-211 -150' }
];

const font = 'bold 9pt Helvetica, Arial, sans-serif';

export default {
    sample,
    palette,
    font
}