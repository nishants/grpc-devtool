import React from "react"
import { connect } from "react-redux"

import {
  createProject,
  loadProject,
} from "../workspace/workspace.actions"

function WelcomeScreen(props) {
  return (
    <div className="welcome-screen">
      {props.showCreateProject && <h1>Creating project</h1>}
      {props.showLoadProject && <h1>Loading project</h1>}
      <button name="load-project" onClick={() => props.loadProject()}>Load Existing Project</button>
      <button name="create-project" onClick={() => props.createProject()}>Create New Project</button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    showCreateProject: state.workspace.showCreateProject,
    showLoadProject: state.workspace.showLoadProject,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createProject: () => dispatch(createProject()),
    loadProject: () => dispatch(loadProject()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
