import React, {
  Fragment,
  Suspense,
  lazy,
  useState
} from 'react'
import {
  Container,
  Toolbar,
} from '@material-ui/core'
import AppBar from './AppBar'
import ResponsiveDrawer from './ResponsiveDrawer'
const Dashboard = lazy(() => import('./Dashboard'))

const appName = 'Property Management'

const menu = [
  { name: 'Overview', icon: 'dashboard' },
  { name: 'Properties', icon: 'apartment' },
  { name: 'Tenants', icon: 'people' },
  { name: 'Reports', icon: 'insertChart' },
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
          <Dashboard classes={classes} />
        </Suspense>
      </Container>
    </Fragment>
  )
}

export default AppShell
