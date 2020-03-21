import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { signOut } from '../utils/auth'

const SignOutButton = () => {
  const history = useHistory()

  const handleSignOut = () => {
    signOut()
    history.push('/login')
  }

  return (
    <Button
      color="primary"
      variant="contained"
      size="small"
      style={{ marginLeft: 'auto' }}
      onClick={handleSignOut}
    >Sign out</Button>
  )
}

export default SignOutButton
