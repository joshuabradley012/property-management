import React from 'react'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core'

const SortableTableHead = ({ handleRequestSort, headCells, order, orderBy }) => (
  <TableHead>
    <TableRow>
      {headCells.map(headCell => (
        <TableCell
          key={headCell.id}
          align={headCell.numeric ? 'right': 'left'}
          sortDirection={orderBy === headCell.id ? order : false}
        >
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={() => handleRequestSort(headCell.id)}
          >
            {headCell.label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
)

export default SortableTableHead