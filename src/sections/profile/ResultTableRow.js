import PropTypes from 'prop-types';
import { useState } from 'react';
import { format, differenceInMinutes } from 'date-fns';

// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Button } from '@mui/material';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import { TableMoreMenu } from '../../components/table';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onDeleteRow, onSelectRow, onPreview }) {
  const theme = useTheme();

  const { user, blurCount, createdAt, finishedAt, mark, updatedAt } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onSelectRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={selected ? 'eva:checkmark-square-2-fill' : 'eva:checkmark-square-2-outline'} />
                Chọn
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPreview();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                Xem bài làm
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Xoá
              </MenuItem>
            </>
          }
        />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={user.displayName} src={user.photoURL} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {user.displayName}
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {mark}
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {differenceInMinutes(finishedAt ? new Date(finishedAt) : new Date(updatedAt), new Date(createdAt))}
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {blurCount || 0}
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
