import {useState} from 'react';
// @mui
import {alpha} from '@mui/material/styles';
import {Avatar, Box, Divider, IconButton, MenuItem, Menu, Stack, Typography} from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import {useNavigate} from "react-router-dom";
import AuthService from "../../../services/auth.service.js";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    path: '/home'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    path: '/profile'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    path: '/settings'
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  // Use the "lazy initializer" pattern for useState.
  // This function runs ONLY ONCE during the initial render.
  const [user] = useState(() => {
    const localUsername = localStorage.getItem('userUsername');
    const localEmail = localStorage.getItem('userEmail');
    return {
      username: localUsername || '',
      email: localEmail || ''
    };
  });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleRedirect = (path) => {
    navigate(path);
    handleClose();
  }

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  }

  return (
    <>
      <IconButton
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
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Menu
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          // Migration slotProps (MUI v6+)
          slotProps={{
            paper: {
              sx: {
                p: 0,
                mt: 1.5,
                ml: 0.75,
                width: 180,
                '& .MuiMenuItem-root': {
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            },
          }}
      >
        {/* Header : On garde le Box mais il est rendu à l'intérieur du MenuList */}
        <Box sx={{ my: 1.5, px: 2.5, outline: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* On peut garder le Stack pour le padding, le MenuList gérera les MenuItem à l'intérieur */}
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
              <MenuItem
                  key={option.label}
                  onClick={() => {
                    handleRedirect(option.path);
                    handleClose();
                  }}
              >
                {option.label}
              </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
            onClick={() => {
              handleLogout();
              handleClose();
            }}
            sx={{ m: 1 }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
