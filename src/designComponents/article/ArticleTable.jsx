import React, { useState, useMemo} from "react";
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
import ArticleService from "../../services/article.service.js";

const TABLE_HEAD = [
    {id: 'title', label: 'Title', alignRight: false},
    {id: 'type', label: 'Type', alignRight: false},
    {id: 'slug', label: 'Slug', alignRight: false},
    {id: 'enabled', label: 'Enabled', alignRight: false},
    {id: 'sitemapEnable', label: 'In SteMp', alignRight: false},
    {id: 'refreshContent', label: 'IA Refresh', alignRight: false},
    {id: 'refreshMainPicture', label: 'Picture Refresh', alignRight: false},
    {id: 'picture', label: 'Picture', alignRight: false},
    {id: 'createdAt', label: 'Updte Date', alignRight: false},
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
        return filter(array, (_item) => _item?.title?.toLowerCase().indexOf(query?.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const ArticleTable = ({ articles, onArticleUpdate, filterName, onFilterName, page, onPageChange }) => {
    const [open, setOpen] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editLabel, setEditLabel] = useState("");
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const customBaseName = import.meta.env.VITE_APP_BASENAME ? '/' + import.meta.env.VITE_APP_BASENAME : '';

    const filteredItems = useMemo(() => {
        return applySortFilter(articles, order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy), filterName);
    }, [articles, order, orderBy, filterName]);

    const isNotFound = !filteredItems.length && !!filterName;

    const handleOpenMenu = (event, id, slug, label) => {
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
            const newSelecteds = articles.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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
        ArticleService.delete(editId).then(() => {
            onArticleUpdate(); // Notify parent to refetch
            setSnackbarMessage(`Article ${editLabel} deleted.`);
            setSnackbarOpen(true);
        });
        setOpen(false);
        setDialogOpen(false);
    };

    const createToggleHandler = (field) => (id) => {
        // We can't directly mutate the state from the parent, so we just call the update handler
        // The parent will refetch the data and the table will re-render
        const item = filteredItems.find(item => item.id === id);
        if (item) {
            const formData = new FormData();
            formData.append(field, !item[field]);
            ArticleService.updatePartially(id, formData).then(
                (response) => {
                    setSnackbarOpen(true);
                    setSnackbarMessage(`Article ${id} updated: ${field} = ${response.data[field]}`);
                    onArticleUpdate(); // Notify parent to refetch
                },
                (error) => {
                    console.error(`Article ${id} could not be updated`, error);
                }
            );
        }
    };

    const toggleEnable = createToggleHandler('enabled');
    const toggleSitemapEnable = createToggleHandler('sitemapEnable');
    const toggleRefreshContent = createToggleHandler('refreshContent');
    const toggleRefreshMainPicture = createToggleHandler('refreshMainPicture');

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - articles.length) : 0;

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
                                rowCount={articles.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const {id, title, slug, type, enabled, sitemapEnable, refreshContent, picture, createdAt, refreshMainPicture} = row;
                                    const selectedUser = selected.indexOf(title) !== -1;

                                    return (
                                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, title)}/>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Typography variant="subtitle2" noWrap>{title}</Typography>
                                            </TableCell>
                                            <TableCell align="left">{type}</TableCell>
                                            <TableCell align="left">{slug}</TableCell>
                                            <TableCell align="left" sx={{"&:hover": {cursor: "pointer"}}} onClick={() => toggleEnable(id)}>
                                                <Iconify icon={enabled ? 'fluent-color:checkmark-circle-20' : 'fluent-color:dismiss-circle-20'} sx={{mr: 2}}/>
                                            </TableCell>
                                            <TableCell align="left" sx={{"&:hover": {cursor: "pointer"}}} onClick={() => toggleSitemapEnable(id)}>
                                                <Iconify icon={sitemapEnable ? 'fluent-color:checkmark-circle-20' : 'fluent-color:dismiss-circle-20'} sx={{mr: 2}}/>
                                            </TableCell>
                                            <TableCell align="left" sx={{"&:hover": {cursor: "pointer"}}} onClick={() => toggleRefreshContent(id)}>
                                                <Iconify icon={refreshContent ? 'fluent-color:checkmark-circle-20' : 'fluent-color:dismiss-circle-20'} sx={{mr: 2}}/>
                                            </TableCell>
                                            <TableCell align="left" sx={{"&:hover": {cursor: "pointer"}}} onClick={() => toggleRefreshMainPicture(id)}>
                                                <Iconify icon={refreshMainPicture ? 'fluent-color:checkmark-circle-20' : 'fluent-color:dismiss-circle-20'} sx={{mr: 2}}/>
                                            </TableCell>
                                            <TableCell align="left">{picture}</TableCell>
                                            <TableCell align="left">{createdAt}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id, slug, title)}>
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
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem sx={{color: 'primary.main'}} component="a" href={`${customBaseName}/article/${editId}`} onClick={handleCloseMenu}>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>
                <MenuItem sx={{color: 'error.main'}} onClick={() => setDialogOpen(true)}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>

            <Dialog open={dialogOpen}>
                <DialogTitle>Supprimer ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer l'article {editLabel.toLowerCase()} ?
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

export default ArticleTable;
