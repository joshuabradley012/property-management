import React, {
  Fragment,
  Suspense,
  lazy,
  useState
} from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import {
  Container,
  Toolbar,
} from '@material-ui/core'
import AppBar from './AppBar'
import PrivateRoute from './PrivateRoute'
import ResponsiveDrawer from './ResponsiveDrawer'
const Dashboard = lazy(() => import('./Dashboard'))
const Properties = lazy(() => import('./Properties'))

const appName = 'Property Management'

const menu = [
  { name: 'Overview', icon: 'dashboard', route: '/' },
  { name: 'Properties', icon: 'apartment', route: '/properties' },
  { name: 'Tenants', icon: 'people', route: '/tenants' },
  { name: 'Reports', icon: 'insertChart', route: '/reports' },
]

const AppShell = ({ classes }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Fragment>
      <AppBar
        appName={appName}
        classes={classes}
        handleDrawerToggle={handleDrawerToggle}
      />
      <ResponsiveDrawer
        appName={appName}
        classes={classes}
        handleDrawerToggle={handleDrawerToggle}
        menu={menu}
        mobileOpen={mobileOpen}
      />
      <Container className={classes.content}>
        <Toolbar />
        <Suspense fallback={<div></div>}>
          <Switch>
            <PrivateRoute exact path="/">
              <Dashboard classes={classes} />
            </PrivateRoute>
            <PrivateRoute path="/properties">
              <Properties classes={classes} />
            </PrivateRoute>
            <PrivateRoute path="/tenants">
              <div>Tenants</div>
            </PrivateRoute>
            <PrivateRoute path="/reports">
              <div>Reports</div>
            </PrivateRoute>
          </Switch>
        </Suspense>
      </Container>
    </Fragment>
  )
}

export default AppShell
