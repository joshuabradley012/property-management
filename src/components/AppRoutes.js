import React, {
  Suspense,
  lazy,
} from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import useAuth from '../contexts/AuthContext'
import AppShell from './AppShell'
const Login = lazy(() => import('./Login'))

const AppRoutes = ({ classes }) => {
  const auth = useAuth()

  return (
    <Router>
      <Suspense fallback={<div></div>}>
        <Switch>
          <Route exact path="/">
            {auth.isLoggedIn ? <AppShell classes={classes} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            <Login classes={classes} />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  )
}

export default AppRoutes