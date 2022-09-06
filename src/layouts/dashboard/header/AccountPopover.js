import { useState } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import MyAvatar from '../../../components/MyAvatar';
import { PATH_ADMIN } from 'src/routes/paths';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover({ user, logout }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem component={Link} to="/" onClick={handleClose}>
            Trang chủ
          </MenuItem>
          {user.isStaff && (
            <MenuItem component={Link} to={PATH_ADMIN.root} onClick={handleClose}>
              Trang admin
            </MenuItem>
          )}
          {user.id && (
            <MenuItem component={Link} to="/profile" onClick={handleClose}>
              Trang cá nhân
            </MenuItem>
          )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          sx={{ m: 1 }}
          onClick={() => {
            logout();
          }}
        >
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
