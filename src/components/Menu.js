import React, { Fragment } from 'react'
import {
  Link,
} from 'react-router-dom'
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
} from '@material-ui/core'
import styles from '../styles'
import MenuIcon from './MenuIcon'

const Menu = ({ appName, classes, menu }) => (
  <Fragment>
    <Toolbar>
      <Typography variant="h6">{appName}</Typography>
    </Toolbar>
    <Divider />
    <List>
      {menu.map((menuItem, index) => (
        <Link to={menuItem.route} key={menuItem.name} className={classes ? classes.menuLink : null}>
          <ListItem button>
            <ListItemIcon><MenuIcon icon={menuItem.icon} /></ListItemIcon>
            <ListItemText primary={menuItem.name} />
          </ListItem>
        </Link>
      ))}
    </List>
  </Fragment>
)

export default Menu