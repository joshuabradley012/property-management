import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import {
  MoreVert,
} from '@material-ui/icons'
import {
  deleteData,
  fetchData,
  postData
} from '../utils/auth'
const SortableTable = lazy(() => import('./SortableTable'))

const propertiesHeader = [
  { id: 'name', label: 'Address', format: 'string'},
  { id: 'city', label: 'City', format: 'string'},
  { id: 'state', label: 'State', format: 'string'},
  { id: 'edit', label: '', format: 'html'},
]

const OptionButton = ({ buttonId }) => {
  const [optionEl, setOptionEl] = React.useState(null)

  const handleOptionOpen = event => {
    setOptionEl(event.currentTarget)
  }

  const handleOptionClose = () => {
    setOptionEl(null)
  }

  return (
    <div>
      <IconButton
        size="small"
        aria-label="options"
        aria-controls={buttonId}
        aria-haspopup="true"
        onClick={handleOptionOpen}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={buttonId}
        anchorEl={optionEl}
        keepMounted
        open={Boolean(optionEl)}
        onClose={handleOptionClose}
      >
        <MenuItem onClick={handleOptionClose}>Edit</MenuItem>
        <MenuItem onClick={handleOptionClose}>Delete</MenuItem>
      </Menu>
    </div>
  )
}

{
  properties: [
    {
      ownerId: 1234,
      ownerName: 'Vicky Nigra',
      isMultiBuilding: true,
      propertyId: 5678,
      propertyName: 'Colorado Boulevard',
      buildings: [
        {
          buildingId: 9012,
          buildingAddress: 'Colorado Boulevard 1',
          buildingCity: 'Los Angeles',
          buildingState: 'CA',
        },
        {
          buildingId: 3456,
          buildingAddress: 'Colorado Boulevard 2',
          buildingCity: 'Los Angeles',
          buildingState: 'CA',
        }
      ],
    },
  ]
}

const Properties = ({ classes }) => {
  const [propertiesData, setPropertiesData] = useState({ properties: [] })
  const [modalOpen, setModalOpen] = React.useState(false)

  const [addressError, setAddressError] = useState(false)
  const [addressErrorLabel, setAddressErrorLabel] = useState('')
  const [address, setAddress] = useState('')

  const [cityError, setCityError] = useState(false)
  const [cityErrorLabel, setCityErrorLabel] = useState('')
  const [city, setCity] = useState('')

  const [stateError, setStateError] = useState(false)
  const [stateErrorLabel, setStateErrorLabel] = useState('')
  const [state, setState] = useState('')

  const [owner, setOwner] = useState('')
  const [isMultiBuilding, setIsMultiBuilding] = useState('false')

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleAddPropertyButton = () => {
    setModalOpen(true)
  }

  const handleRowEdit = () => {
    return false
  }

  const handleRowDelete = () => {
    return false
  }

  const handleAddressChange = event => {
    setAddress(event.target.value)
  }

  const handleCityChange = event => {
    setCity(event.target.value)
  }

  const handleStateChange = event => {
    setState(event.target.value)
  }

  const handleOwnerChange = event => {
    setOwner(event.target.value)
  }

  const handleMultiBuildingChange = event => {
    setIsMultiBuilding(event.target.value)
  }

  const handleAddProperty = () => {
    event.preventDefault()
    postData('insert=property', {
      address: address,
      city: city,
      state: state,
    },
    (data) => {
      console.log(data)
    })
  }

  const handlePropertiesData = data => {
    data.properties.forEach(row => {
      const buttonId = 'row-options-' + row.id
      row.edit = <OptionButton buttonNum={buttonId} />
    })
    setPropertiesData(data)
  }

  useEffect(() => {
    fetchData('fields=properties', handlePropertiesData)
  }, [])

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" p={1.5} px={[0, 1.5]} pb={0}>
        <Box pl={2}>
          <Typography variant="h5">Properties</Typography>
        </Box>
        <Box px={[1.5, 0]}>
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 'auto' }}
            onClick={handleAddPropertyButton}
          >Add Property</Button>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="add-property"
            aria-describedby="add-property-to-dashboard"
          >
            <Paper className={classes.modalBody}>
              <Box p={1.5}>
                <Typography variant="subtitle1">Property Information</Typography>
                <form autoComplete="off" onSubmit={handleAddProperty}>
                  <FormControl
                    variant="outlined"
                    margin="normal"
                    size="small"
                    fullWidth={true}
                  >
                    <InputLabel id="owner-select-label">Owner</InputLabel>
                    <Select
                      labelId="owner-select-label"
                      id="owner-select"
                      value={owner}
                      onChange={handleOwnerChange}
                      label="Owner"
                    >
                      <MenuItem value={10}>Rebecca Themelis</MenuItem>
                      <MenuItem value={20}>Vicky Nigra</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    component="fieldset"
                    margin="normal"
                    size="small"
                    fullWidth={true}
                  >
                    <FormLabel component="legend">Is multi-building</FormLabel>
                    <RadioGroup
                      aria-label="multibuilding"
                      name="multibuilding"
                      value={isMultiBuilding}
                      onChange={handleMultiBuildingChange}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                  { isMultiBuilding === 'true' ?
                    <Fragment>
                      <TextField
                        id="property-name"
                        label="Property Name"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={address}
                        onChange={handleAddressChange}
                        error={addressError}
                      />
                      <Typography variant="subtitle2">Building 1</Typography>
                      <TextField
                        id="address"
                        label="Address"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={address}
                        onChange={handleAddressChange}
                        error={addressError}
                      />
                      <TextField
                        id="city"
                        label="City"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={city}
                        onChange={handleCityChange}
                        error={cityError}
                      />
                      <TextField
                        id="state"
                        label="State"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={state}
                        onChange={handleStateChange}
                        error={stateError}
                      />
                      <Typography variant="subtitle2">Building 2</Typography>
                      <TextField
                        id="address"
                        label="Address"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={address}
                        onChange={handleAddressChange}
                        error={addressError}
                      />
                      <TextField
                        id="city"
                        label="City"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={city}
                        onChange={handleCityChange}
                        error={cityError}
                      />
                      <TextField
                        id="state"
                        label="State"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={state}
                        onChange={handleStateChange}
                        error={stateError}
                      />
                      <Typography variant="subtitle2">Building 3</Typography>
                      <TextField
                        id="address"
                        label="Address"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={address}
                        onChange={handleAddressChange}
                        error={addressError}
                      />
                      <TextField
                        id="city"
                        label="City"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={city}
                        onChange={handleCityChange}
                        error={cityError}
                      />
                      <TextField
                        id="state"
                        label="State"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={state}
                        onChange={handleStateChange}
                        error={stateError}
                      />
                    </Fragment>
                    :
                    <Fragment>
                      <TextField
                        id="address"
                        label="Address"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={address}
                        onChange={handleAddressChange}
                        error={addressError}
                      />
                      <TextField
                        id="city"
                        label="City"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={city}
                        onChange={handleCityChange}
                        error={cityError}
                      />
                      <TextField
                        id="state"
                        label="State"
                        fullWidth={true}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        value={state}
                        onChange={handleStateChange}
                        error={stateError}
                      />
                    </Fragment>
                  }
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">Add Property</Button>
                  </Box>
                </form>
              </Box>
            </Paper>
          </Modal>
        </Box>
      </Box>
      <Suspense fallback={<div></div>}>
        <Box p={1.5} px={[0, 1.5]}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SortableTable
                classes={classes}
                headCells={propertiesHeader}
                initOrderBy="address"
                rows={propertiesData.properties}
                title="Properties"
              />
            </Grid>
          </Grid>
        </Box>
      </Suspense>
    </Fragment>
  )
}

export default Properties