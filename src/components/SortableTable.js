import React, { useState } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'
import SortableTableHead from './SortableTableHead'
import SortableTableBody from './SortableTableBody'

const SortableTable = ({ classes, headCells, initOrder, initOrderBy, initRows, rows, title }) => {
  const [order, setOrder] = useState(initOrder || 'desc')
  const [orderBy, setOrderBy] = useState(initOrderBy)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initRows || 5)

  const handleRequestSort = cell => {
    const isAsc = orderBy === cell && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(cell)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  return (
    <Paper variant="outlined" className={classes.dashboardComponent}>
      <Toolbar>
        <Typography variant="subtitle1">{title}</Typography>
      </Toolbar>
      <TableContainer>
        <Table size="small" style={{ minWidth: headCells.length * 150 }}>
          <SortableTableHead
            handleRequestSort={handleRequestSort}
            headCells={headCells}
            order={order}
            orderBy={orderBy}
          />
          <SortableTableBody
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            page={page}
            rows={rows}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default SortableTable