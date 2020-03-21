import React from 'react'
import {
  CssBaseline,
} from '@material-ui/core'
import {
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles'
import { AuthProvider } from './contexts/AuthContext'
import styles from './styles'
import theme from './theme'
import AppRoutes from './components/AppRoutes'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <AuthProvider>
          <AppRoutes classes={classes} />
        </AuthProvider>
      </div>
    </ThemeProvider>
  )
}

export default App
