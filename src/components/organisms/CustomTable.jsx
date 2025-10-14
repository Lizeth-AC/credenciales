import React, { useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

import CustomTableRow from '../molecules/CustomTableRow';

const CustomTable = ({
  columns = [],
  rows = [],
  onClickRow,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const displayRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: '.5rem' }}>
      <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ width: column.width || 100, fontWeight: 'bold' }}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayRows.map((row) => (
            <CustomTableRow
              key={row.id}
              columns={columns}
              row={row}
              onClickRow={onClickRow}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage='Filas por página:'
      />
    </TableContainer>
  );
};

export default CustomTable;
