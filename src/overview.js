import go from 'gojs';
import state from './state';
const make = go.GraphObject.make;

export default function initOverview() {
    make(go.Overview, "overview", {
        observed: state.diagram,
        contentAlignment: go.Spot.Center
    })
}