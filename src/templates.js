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
            fill: 'transparent',
            strokeWidth: 0,
            width: horizontal ? NaN : 8,
            height: !horizontal ? NaN : 8,
            stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
            fromSpot: spot,
            toSpot: spot,
            cursor: 'pointer',
            mouseEnter: function (event, port) {
                if (!event.diagram.isReadOnly) {
                    port.fill = 'rgba(255,0,255,0.5)';
                }
            },
            mouseLeave: function (_, port) {
                port.fill = 'transparent';
            }
        });
}

const nodeTemplate = make(go.Node, 'Auto',
    {
        locationSpot: go.Spot.Center,
        resizable: true,
        resizeObjectName: 'test'
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    make(go.Shape, 'Ellipse',
        {
            name: 'test'
        },
        new go.Binding('figure', 'figure'),
        new go.Binding('fill', 'name'),
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
    ),
    makePort('T', go.Spot.Top, go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false),
    make(go.TextBlock,
        {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: 'center',
            font: config.font,
            name: 'TEXT'
        },
        new go.Binding('stroke', 'color'),
        new go.Binding('text', 'name').makeTwoWay()
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
        mouseEnter: function (_, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'; },
        mouseLeave: function (_, link) { link.findObject('HIGHLIGHT').stroke = 'transparent'; }
    },
    make(go.Shape,
        { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
    make(go.Shape,
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
        new go.Binding('stroke', 'isSelected', isSelected => isSelected ? 'dodgerblue' : 'gray').ofObject()),
    make(go.Shape,
        { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }),
    make(go.Panel, 'Auto',
        { visible: true, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
        new go.Binding('visible', 'visible').makeTwoWay(),
        make(go.Shape, 'RoundedRectangle',
            { fill: '#F8F8F8', strokeWidth: 0 }),
        make(go.TextBlock, 'LINK NAME',
            {
                textAlign: 'center',
                font: config.font,
                stroke: '#333333',
                editable: true
            },
            new go.Binding('text').makeTwoWay())
    )
);

const groupTemplate = make(go.Group, 'Auto',
    {
        resizable: true,
        ungroupable: true,
        // locationObjectName: 'group',
        resizeObjectName: 'group',
        computesBoundsAfterDrag: true,
        mouseDragEnter: (e, group, _) => actions.highlightGroup(e, group, true),
        mouseDragLeave: (e, group, _) => actions.highlightGroup(e, group, false),
        mouseDrop: (e, node) => actions.finishDrop(e, node),
    },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding('position', 'position').makeTwoWay(),
    new go.Binding('minSize', 'minSize', go.Size.parse).makeTwoWay(go.Size.stringify),
    new go.Binding('background', 'isHighlighted', isHighlighted => isHighlighted ? 'rgba(255,0,0,0.2)' : 'transparent').ofObject(),
    make(go.Panel, 'Auto',
        make(go.Shape, 'Rectangle',
        new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
            {
                name: 'group',
                desiredSize: new go.Size(100, 100),
                fill: 'rgba(128,128,128,0.2)', 
                stroke: 'gray', 
                strokeWidth: 3
            }
        ),
        make(go.TextBlock,
            {
                font: 'bold 19px sans-serif',
                isMultiline: false,
                editable: true,
                alignment: go.Spot.Top,
                alignmentFocus: go.Spot.Top
            },
            new go.Binding('text', 'name').makeTwoWay()),
    )
);

export default {
    groupTemplate,
    nodeTemplate,
    linkTemplate
}