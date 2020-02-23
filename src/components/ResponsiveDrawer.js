import React from 'react'
import {
  Hidden,
  Drawer,
} from '@material-ui/core'
import Menu from './Menu'

const ResponsiveDrawer = ({ appName, classes, handleDrawerToggle, menu, mobileOpen }) => (
  <nav className={classes.drawer}>
    <Hidden smUp implementation="css">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{ paper: classes.drawerPaper }}
        ModalProps={{ keepMounted: true }}
      >
        <Menu appName={appName} menu={menu} />
      </Drawer>
    </Hidden>
    <Hidden xsDown implementation="css">
      <Drawer
        classes={{ paper: classes.drawerPaper }}
        variant="permanent"
        open
      >
        <Menu appName={appName} menu={menu} />
      </Drawer>
    </Hidden>
  </nav>
)

export default ResponsiveDrawer