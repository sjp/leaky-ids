import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";

const renderNode = document.getElementById("app");
if (renderNode) { render(<App />, renderNode); }
