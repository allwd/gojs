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

function initDiagram() {
    diagram = make(go.Diagram, "workspace", {
        "commandHandler.archetypeGroupData": { isGroup: true, category: "OfNodes" },
        "undoManager.isEnabled": true,
        "ModelChanged": (e) => {
            console.log("event", e.change.name)
            if (!e || e.modelChange !== "nodeDataArray") {
                return
            }
            console.log(e.getValue());
            ReloadLinks();
        }
    })

    diagram.nodeTemplateMap.add("",
        make(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
            make(go.Shape, "Ellipse",
                new go.Binding("figure", "figure"),
                new go.Binding("fill", "name"),
                new go.Binding("stroke", "stroke")
            ),
            make(go.TextBlock,
                {
                    margin: 5,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true,
                    font: "bold 9pt Helvetica, Arial, sans-serif",
                    name: "TEXT",
                    textEdited: (a, b, c) => ReloadLinks()
                },
                new go.Binding("text", "name").makeTwoWay()
            )
        )
    );

    diagram.groupTemplate =
        make(go.Group, "Vertical",
            {
                mouseDragEnter: (e, group, prev) => highlightGroup(e, group, true),
                mouseDragLeave: (e, group, next) => highlightGroup(e, group, false),
                mouseDrop: (e, node) => finishDrop(e, node),
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

function initPalette() {
    palette = make(go.Palette, "palette",
        {
            nodeTemplateMap: diagram.nodeTemplateMap,
            groupTemplate: diagram.groupTemplate,
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

function initOverview() {
    overview = make(go.Overview, "overview", {
        observed: diagram,
        contentAlignment: go.Spot.Center
    })
}

function initInspector() {
    inspector = new Inspector('editable', diagram, {
        showAllProperties: false
    })
}

function save() {
    document.getElementById("savedModel").value = diagram.model.toJson();
    diagram.isModified = false;
}

function load() {
    diagram.model = go.Model.fromJson(document.getElementById("savedModel").value);
}

function exportToSvg() {
    var svgWindow = window.open();

    if (!svgWindow) {
        return;
    }

    var size = new go.Size(700, 960);
    var bounds = diagram.documentBounds;
    var x = bounds.x;
    var y = bounds.y;

    while (y < bounds.bottom) {
        while (x < bounds.right) {
            var svg = diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: size });
            svgWindow.document.body.appendChild(svg);
            x += size.width;
        }

        x = bounds.x;
        y += size.height;
    }
}

function finishDrop(e, group) {
    console.log(e, group)
    const ok = group !== null
        ? group.addMembers(group.diagram.selection, true)
        : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
    if (!ok) e.diagram.currentTool.doCancel();
}

function highlightGroup(e, group, show) {
    if (!group) return;
    e.handled = true;
    if (show) {
        // cannot depend on the group.diagram.selection in the case of external drag-and-drops;
        // instead depend on the DraggingTool.draggedParts or .copiedParts
        var tool = group.diagram.toolManager.draggingTool;
        var map = tool.draggedParts || tool.copiedParts;  // this is a Map
        // now we can check to see if the Group will accept membership of the dragged Parts
        if (group.canAddMembers(map.toKeySet())) {
            group.isHighlighted = true;
            return;
        }
    }
    group.isHighlighted = false;
}

function ReloadLinks(e) {
    const exclude = []
    const nodes = diagram.model.nodeDataArray.filter(node => {
        if (String(node.name).toLowerCase() === "green") {
            exclude.push(node.key)
            return true
        }

        return false
    });
    
    const links = diagram.model.linkDataArray.filter(link => !(exclude.includes(link.from) || exclude.includes(link.to)))

    let prev = null;
    for(node of nodes) {
        if (prev) {
            links.push({
                from: prev.key,
                to: node.key
            })
        }

        prev = node
    }
    
    diagram.model.linkDataArray = links;
}