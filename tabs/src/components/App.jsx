import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import TabConfig from "./TabConfig";
import "./App.css";
import Rest from "./Rest";
import StageUI from "./MeetingUIComponent/StageUI";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  return (
    <Router>
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/termsofuse" component={TermsOfUse} />
      <Route exact path="/config" component={TabConfig} />
      {/* <Route exact path="/tab" component={Tab} /> */}
      <Route exact path="/tab" component={Rest} />
      <Route exact path="/stageView" component={StageUI} />
      <Route exact path="/rest" component={Rest} />
    </Router>
  );
}
