import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import { FluentProvider } from "@fluentui/react-provider";
import { webLightTheme } from "@fluentui/react-theme";

ReactDOM.render(
    <FluentProvider >
        <App />
    </FluentProvider>
, document.getElementById("root"));
