import theme from './theme'

const drawerWidth = 240;

const styles = {
  root: {
    display: 'flex',
  },
  loginPage: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  loginForm: {
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    width: `calc(100% - ${drawerWidth}px)`,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
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
  menuLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 'auto',
    minWidth: 120,
  },
  modalBody: {
    left: '50%',
    minWidth: '400px',
    minHeight: '200px',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default styles