import PropTypes from 'prop-types';
import { format, differenceInMinutes } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { TableRow, TableCell, Link } from '@mui/material';
import { PATH_LEARNING } from 'src/routes/paths';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row }) {
  const { testName, createdAt, finishedAt, mark, updatedAt, testId } = row;

  return (
    <TableRow hover>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <Link component={RouterLink} to={`${PATH_LEARNING.test.root}/${testId}`}>{testName}</Link>
      </TableCell>
      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {mark && Math.round(mark * 100) / 100}
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {differenceInMinutes(finishedAt ? new Date(finishedAt) : new Date(updatedAt), new Date(createdAt))}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {format(new Date(createdAt), 'dd/MM HH:mm:ss')}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {finishedAt && format(new Date(finishedAt), 'dd/MM HH:mm:ss')}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {updatedAt && format(new Date(updatedAt), 'dd/MM HH:mm:ss')}
      </TableCell>
    </TableRow>
  );
}
