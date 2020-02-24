import {
  createMuiTheme,
} from '@material-ui/core/styles'

const baseTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 720,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const theme = createMuiTheme({
  breakpoints: baseTheme.breakpoints,
  palette: {
    primary: {
      main: '#212121',
    },
    background: {
      default: '#f1f3f4',
    },
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: 48,
      },
    },
    MuiToolbar: {
      gutters: {
        [baseTheme.breakpoints.up('sm')]: {
          paddingLeft: baseTheme.spacing(2),
          paddingRight: baseTheme.spacing(2),
        }
      },
    },
    MuiTable: {
      root: {
        minWidth: 600,
      },
    },
    MuiGrid: {
      container: {
        [baseTheme.breakpoints.down('xs')]: {
          '&$spacing-xs-3': {
            width: '100%',
            marginRight: 0,
            marginLeft: 0,

            '& > $item': {
              paddingLeft: 0,
              paddingRight: 0,

              '& .MuiPaper-rounded': {
                borderRadius: 0,
              },

              '& .MuiPaper-outlined': {
                border: 0,
              },
            },
          },
        },
      },
    },
  },
})

export default theme