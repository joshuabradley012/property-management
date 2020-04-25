import React, { lazy, Suspense } from 'react'
import {
  Hidden,
  Drawer,
} from '@material-ui/core'
const Menu = lazy(() => import('./Menu'))

const ResponsiveDrawer = ({ appName, classes, handleDrawerToggle, menu, mobileOpen }) => (
  <nav className={classes.drawer}>
    <Hidden mdUp implementation="css">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{ paper: classes.drawerPaper }}
        ModalProps={{ keepMounted: true }}
      >
        <Suspense fallback={<div></div>}>
          <Menu appName={appName} menu={menu} />
        </Suspense>
      </Drawer>
    </Hidden>
    <Hidden smDown implementation="css">
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        variant="permanent"
        open
      >
        <Suspense fallback={<div></div>}>
          <Menu appName={appName} menu={menu} classes={classes} />
        </Suspense>
      </Drawer>
    </Hidden>
  </nav>
)

export default ResponsiveDrawer