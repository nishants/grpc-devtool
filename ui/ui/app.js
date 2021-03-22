import React from "react";
import WelcomeScreen from "./modules/welcome-screen";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const routes = [
  {
    path: "/welcome",
    component: Welcome
  },
  {
    path: "/projects",
    component: Projects,
    routes: [
      {
        path: "/projects/create",
        component: CreateProject
      },
      {
        path: "/projects/open",
        component: OpenProject
      }
    ]
  }
];

export default function App() {
  return (
    <WelcomeScreen/>
  );
  // return (
  //   <Router>
  //     <div>
  //       <ul>
  //         <li id="create-new">
  //           <Link id="create-new-link" to="/welcome">Welcome</Link>
  //         </li>
  //         <li id="open-new">
  //           <Link id="open-new-link" to="/projects">Projects</Link>
  //         </li>
  //       </ul>
  //
  //       <Switch>
  //         {routes.map((route, i) => (
  //           <RouteWithSubRoutes key={i} {...route} />
  //         ))}
  //       </Switch>
  //     </div>
  //   </Router>
  // );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

function Welcome() {
  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        <li id="create-new">
          <Link to="/projects/create">Create</Link>
        </li>
        <li id="open-project">
          <Link name="open-project" to="/projects/open">Open</Link>
        </li>
      </ul>

    </div>
  );
};

function Projects({ routes }) {
  return (
    <div>
      <h2>Projects</h2>
      <ul>
        <li>
          <Link to="/projects/create">Create</Link>
        </li>
        <li>
          <Link to="/projects/open">Open</Link>
        </li>
      </ul>

      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </div>
  );
}

function CreateProject() {
  return <h3>Create configuration for project</h3>;
}

function OpenProject() {
  return <h3>Select dir containing project</h3>;
}
