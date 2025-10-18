// src/components/PanelistList.jsx
import { panelists } from "../data/panelists.js";

export default function PanelistList() {
    const listItems = panelists.map((panelist) => <li key={panelist}>{panelist}</li>);

    return <ul>{listItems}</ul>;
}