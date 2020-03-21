import React, {
  useState,
} from 'react'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core'
import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons'

const PasswordInput = (props) => {
  props = Object.assign({
    error: false,
    fullWidth: false,
    margin: 'none',
    variant: 'standard',
  }, props)

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <FormControl variant={props.variant} fullWidth={props.fullWidth} error={props.error} margin={props.margin}>
      <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
      <OutlinedInput
        id={props.id}
        label={props.label}
        type={showPassword ? 'text' : 'password'}
        value={props.value}
        onChange={props.onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={'toggle ' + props.label.toLowerCase() + ' visibility'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {props.error && props.helperText ? <FormHelperText htmlFor={props.id}>{props.helperText}</FormHelperText> : null}
    </FormControl>
  )
}

export default PasswordInput
