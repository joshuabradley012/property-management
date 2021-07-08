import React from 'react'
import {
  Redirect,
  Route,
} from 'react-router-dom'
import useAuth from '../contexts/AuthContext'

const PrivateRoute = ({ children, ...rest }) => {
  const auth = useAuth()
  return (
    <Route {...rest} render={(props) => (
      auth.isLoggedIn
        ? React.cloneElement(children, { props: children.props })
        : <Redirect to="/login" />
    )} />
  )
}

export default PrivateRoute
