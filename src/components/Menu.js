import React, { Fragment } from 'react'
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
} from '@material-ui/core'
import MenuIcon from './MenuIcon'

const Menu = ({ appName, menu }) => (
  <Fragment>
    <Toolbar>
      <Typography variant="h6">{appName}</Typography>
    </Toolbar>
    <Divider />
    <List>
      {menu.map((menuItem, index) => (
        <ListItem button key={menuItem.name}>
          <ListItemIcon><MenuIcon icon={menuItem.icon} /></ListItemIcon>
          <ListItemText primary={menuItem.name} />
        </ListItem>
      ))}
    </List>
  </Fragment>
)

export default Menu