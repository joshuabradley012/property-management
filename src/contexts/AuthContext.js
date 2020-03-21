import React, { createContext, useReducer, useContext } from 'react'
import { defaultUser, isAccessTokenValid } from '../utils/auth'

const SET_USER = 'SET_USER'
const SET_LOGIN = 'SET_LOGIN'

const AuthContext = createContext()

const initialState = {
  user: { ...defaultUser() },
  isLoggedIn: isAccessTokenValid(),
}

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: { ...action.payload },
      }
    case SET_LOGIN:
      return {
        ...state,
        isLoggedIn: isAccessTokenValid(),
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const [state, dispatch] = useContext(AuthContext)

  const setUser = user => {
    dispatch({ type: SET_USER, payload: user })
  }

  const setLoginStatus = () => {
    dispatch({ type: SET_LOGIN })
  }

  return {
    setUser,
    setLoginStatus,
    user: { ...state.user },
    isLoggedIn: state.isLoggedIn,
  }
}

export default useAuth
