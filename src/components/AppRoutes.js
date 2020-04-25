import React, {
  Suspense,
  lazy,
} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AppShell from './AppShell'
const Login = lazy(() => import('./Login'))

const AppRoutes = ({ classes }) => {
  return (
    <Router>
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route path="/login">
            <Login classes={classes} />
          </Route>
          <PrivateRoute path="/">
            <AppShell classes={classes} />
          </PrivateRoute>
        </Switch>
      </Suspense>
    </Router>
  )
}

export default AppRoutes