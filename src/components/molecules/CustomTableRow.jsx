import { TableCell, TableRow } from '@mui/material';

const CustomTableRow = ({
  columns = [],
  row = {},
  onClickRow,
}) => (
  <TableRow key={row.id} onClick={() => onClickRow(row)}>
    {columns.map((column) => (
      <TableCell key={`${row.id}-${column.id}`}>
        {column.render ? column.render(row) : row[column.id]}
      </TableCell>
    ))}
  </TableRow>
);

export default CustomTableRow;