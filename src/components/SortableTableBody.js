import React from 'react'
import {
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'
import {
  format,
  parseISO,
} from 'date-fns'

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const SortableTableBody = ({ headCells, order, orderBy, page, rows, rowsPerPage }) => {
  const filteredRows = rows.filter((cell, index) => {
    for (const [key, value] of Object.entries(cell)) {
      if (value === null) return false
    }
    return true
  })
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage)
  return (
    <TableBody>
      {stableSort(filteredRows, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((cell, index) => (
          <TableRow key={index}>
            {headCells.map(headCell => (
              <TableCell
                key={headCell.id}
                align={headCell.format === 'numeric' || headCell.format === 'currency' ? 'right': 'left'}
              >
                {headCell.format === 'date' ? format(parseISO(cell[headCell.id]), 'MM/dd/yyyy') : (headCell.format === 'currency' ? '$' : '') + cell[headCell.id]}
              </TableCell>
            ))}
          </TableRow>
        ))
      }
      {emptyRows > 0 && (
        <TableRow style={{ height: 33 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  )
}

export default SortableTableBody