import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Menu } from '@mui/material';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/ic_flag_de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src={LANGS[0].icon} alt={LANGS[0].label} />
      </IconButton>

        <Menu
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            // Migration vers slotProps (plus de PaperProps en 2026)
            slotProps={{
                paper: {
                    sx: {
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        p: 1, // On met le padding ici pour que le MenuList soit bien encadré
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                            gap: 0, // On réinitialise le gap si tu utilises sx sur l'image
                        },
                    },
                },
            }}
        >
            <Stack spacing={0.75}>
                {LANGS.map((option) => (
                    <MenuItem
                        key={option.value}
                        selected={option.value === LANGS[0].value}
                        onClick={() => handleClose()}
                    >
                        <Box
                            component="img"
                            alt={option.label}
                            src={option.icon}
                            sx={{ width: 28, mr: 2 }}
                        />
                        {option.label}
                    </MenuItem>
                ))}
            </Stack>
        </Menu>
    </>
  );
}
