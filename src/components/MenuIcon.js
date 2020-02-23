import React from 'react'
import {
  Apartment,
  Dashboard,
  InsertChart,
  People,
} from '@material-ui/icons'

const Icons = {
  apartment: Apartment,
  dashboard: Dashboard,
  insertChart: InsertChart,
  people: People,
}

const MenuIcon = ({ icon }) => {
  const Icon = Icons[icon]
  return (
    <Icon />
  )
}

export default MenuIcon