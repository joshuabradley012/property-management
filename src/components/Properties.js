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
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'
import { fetchData } from '../utils/auth'
const SortableTable = lazy(() => import('./SortableTable'))

const propertiesHeader = [
  { id: 'name', label: 'Address', format: 'string'},
  { id: 'city', label: 'City', format: 'string'},
  { id: 'state', label: 'State', format: 'string'},
]

const Properties = ({ classes }) => {
  const [propertiesData, setPropertiesData] = useState({ properties: [] })
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  const handleAddProperty = () => {
    setOpen(true);
  }

  useEffect(() => {
    fetchData('fields=properties', setPropertiesData)
  }, [])

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" p={1.5} px={[0, 1.5]} pb={0}>
        <Box pl={2}>
          <Typography variant="h5">Properties</Typography>
        </Box>
        <Box>
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 'auto' }}
            onClick={handleAddProperty}
          >Add Property</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-property"
            aria-describedby="add-property-to-dashboard"
          >
            <Paper className={classes.modalBody}>
              <p>Test</p>
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