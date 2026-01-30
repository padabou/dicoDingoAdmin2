import React, {useEffect, useState} from "react";
import {filter} from "lodash";
import {
    Card,
    Table,
    Paper,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    IconButton, Dialog, Button, Snackbar,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Scrollbar from "../../designComponents/scrollbar";
import {ArrayListHead, ArrayListToolbar} from "../../sections/array/index.jsx";
import Iconify from "../../designComponents/iconify";
import ContactService from "../../services/contact.service.js";

const TABLE_HEAD = [
    {id: 'username', label: 'Username', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'message', label: 'Message', alignRight: false},
    {id: 'createdAt', label: 'Received', alignRight: false},
    {id: ''},
];

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const applySortFilter = (array, comparator, query) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        let order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        // Filter by username or email
        return filter(array, (_item) =>
            _item?.username?.toLowerCase().indexOf(query?.toLowerCase()) !== -1 ||
            _item?.email?.toLowerCase().indexOf(query?.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

const MessagesTable = ({ messages, onMessageUpdate, filterName, onFilterName, page, onPageChange }) => {
    const [open, setOpen] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editLabel, setEditLabel] = useState("");
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('createdAt');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isNotFound, setIsNotFound] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        const sortedAndFiltered = applySortFilter(messages, order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy), filterName);
        setFilteredItems(sortedAndFiltered);
        setIsNotFound(!sortedAndFiltered.length && !!filterName);
    }, [messages, filterName, order, orderBy]);

    const handleOpenMenu = (event, id, label) => {
        setEditId(id);
        setEditLabel(label);
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = messages.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangeRowsPerPage = (event) => {
        onPageChange(event, 0); // Reset to first page on rows per page change
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        onPageChange(event, 0); // Reset to first page on filter change
        onFilterName(event.target.value);
    };

    const handleDelete = () => {
        ContactService.delete(editId).then(() => {
            onMessageUpdate(); // Notify parent to refetch
            setSnackbarMessage(`Message ${editLabel} deleted.`);
            setSnackbarOpen(true);
        });
        setOpen(false);
        setDialogOpen(false);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const snackbarAction = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <Iconify icon={'fluent-color:dismiss-circle-20'} sx={{mr: 2}} title={'Close'}/>
        </IconButton>
    );

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - messages.length) : 0;

    return (
        <>
            <Card>
                <ArrayListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    count={filteredItems.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Scrollbar>
                    <TableContainer sx={{minWidth: 800}}>
                        <Table>
                            <ArrayListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={messages.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, username, email, createdAt, message} = row;
                                    const isSelected = selected.indexOf(id) !== -1;

                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={isSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} onChange={(event) => handleClick(event, id)}/>
                                            </TableCell>
                                            <TableCell><Typography variant="subtitle2">{username}</Typography></TableCell>
                                            <TableCell align="left">{email}</TableCell>
                                            <TableCell align="left" sx={{maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{message}</TableCell>
                                            <TableCell align="left">{createdAt}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id, username)}>
                                                    <Iconify icon={'eva:more-vertical-fill'}/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{height: 53 * emptyRows}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                            {isNotFound && (
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                            <Paper sx={{textAlign: 'center'}}>
                                                <Typography variant="h6" paragraph>Not found</Typography>
                                                <Typography variant="body2">
                                                    No results found for &nbsp;
                                                    <strong>&quot;{filterName}&quot;</strong>.
                                                    <br/> Try checking for typos or using complete words.
                                                </Typography>
                                            </Paper>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{ sx: { p: 1, width: 140, '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 } } }}
            >
                <MenuItem sx={{color: 'error.main'}} onClick={() => { setDialogOpen(true); handleCloseMenu(); }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Supprimer ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer le message de {editLabel} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="error">Fermer</Button>
                    <Button onClick={handleDelete} autoFocus>Continuer</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                action={snackbarAction}
            />
        </>
    );
};

export default MessagesTable;
