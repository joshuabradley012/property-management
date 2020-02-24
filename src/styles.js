import theme from './theme'

const drawerWidth = 240;

const styles = {
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  dashboardComponent: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 'auto',
    minWidth: 120,
  },
}

export default styles