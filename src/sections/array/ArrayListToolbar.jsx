import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, TablePagination} from '@mui/material';
import Iconify from "../../designComponents/iconify";
// component

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.shadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

export const ArrayListToolbar = ({ numSelected, filterName, onFilterName, count, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => {
  ArrayListToolbar.propTypes = {
    numSelected: PropTypes.number,
    count: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    rowsPerPage: PropTypes.number,
    page: PropTypes.number,
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search ..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </StyledRoot>
  );
};
