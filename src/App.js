import React from "react";
import "./App.css";
import Graph from "./Graph";

import { YAxisProvider } from "./YAxisContext";

const websocketBaseUrl = "wss://wiki-diff-srv.pape.dev";
const interval = "10s";
const backlog = "5m";

const App = () => {
  return (
    <>
      <h1>Change sizes of Wikipedia edits</h1>
      <YAxisProvider>
        <div className="app-wrapper">
          <div className="graph-wrapper">
            <Graph
              title="English Wikipedia"
              subtitle="Aggregated change sizes"
              websocketUrl={`${websocketBaseUrl}/en/ws?interval=${interval}&backlog=${backlog}`}
            />
          </div>
          <div className="graph-wrapper">
            <Graph
              title="German Wikipedia"
              subtitle="Aggregated change sizes"
              websocketUrl={`${websocketBaseUrl}/de/ws?interval=${interval}&backlog=${backlog}`}
            />
          </div>
        </div>
      </YAxisProvider>
    </>
  );
};

export default App;
