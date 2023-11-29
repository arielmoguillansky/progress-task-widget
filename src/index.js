import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TaskProgressContainer from "./TaskProgressContainer";

// This will be an embedded widget, get widget's placeholder by getting all elements with the widget class
const widgetDivs = document.querySelectorAll(".task-progress-widget");

// Look for all elements identified by class, and inject a new widget instance.
widgetDivs.forEach((div) => {
  ReactDOM.render(
    <React.StrictMode>
      <TaskProgressContainer symbol={div.dataset.symbol} />
    </React.StrictMode>,
    div
  );
});
