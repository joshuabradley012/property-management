import React from 'react'
import {
  AppBar as MuiAppBar,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  Menu,
} from '@material-ui/icons'

const AppBar = ({ appName, classes, handleDrawerToggle }) => (
  <MuiAppBar position="fixed" className={classes.appBar}>
    <Toolbar>
      <Hidden mdUp implementation="css">
        <IconButton
          aria-label="menu"
          className={classes.menuButton}
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <Menu />
        </IconButton>
      </Hidden>
      <Typography variant="h6">{appName}</Typography>
    </Toolbar>
  </MuiAppBar>
)

export default AppBar