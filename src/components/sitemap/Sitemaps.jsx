import React, {useEffect, useState, useMemo} from "react";
import EventBus from "../../common/EventBus";
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
    Container,
    Typography,
    TableContainer,
    TablePagination, IconButton, Dialog, Button, Snackbar, Stack,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Scrollbar from "../../designComponents/scrollbar";
import {ArrayListHead, ArrayListToolbar} from "../../sections/array/index.jsx";
import Iconify from "../../designComponents/iconify";
import {useNavigate, useSearchParams} from "react-router-dom";
import SitemapService from "../../services/sitemap.service.js";

const TABLE_HEAD = [
    {id: 'loc', label: 'Loc', alignRight: false},
    {id: 'type', label: 'Type', alignRight: false},
    {id: 'lastmod', label: 'Lastmod', alignRight: false},
    {id: 'enabled', label: 'Enabled', alignRight: false},
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
        return filter(array, (_item) => _item?.loc?.toLowerCase().indexOf(query?.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Sitemaps = () => {
    const [searchParams] = useSearchParams();
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(0);
    const [editLabel, setEditLabel] = useState("");
    const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page')) : 0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState(searchParams.get('query') || '');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const navigate = useNavigate();

    const fetchSitemaps = () => {
        SitemapService.getAll().then(
            (response) => {
                setList(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setList([]);
                console.error(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    };

    useEffect(() => {
        fetchSitemaps();
    }, []);

    const filteredItems = useMemo(() => {
        return applySortFilter(list, order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy), filterName);
    }, [list, order, orderBy, filterName]);

    const isNotFound = !filteredItems.length && !!filterName;

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
            const newSelecteds = list.map((n) => n.loc);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleDelete = () => {
        SitemapService.delete(editId).then(() => {
            fetchSitemaps();
            setSnackbarMessage(`Sitemap entry ${editLabel} deleted.`);
            setSnackbarOpen(true);
        });
        setOpen(false);
        setDialogOpen(false);
    };

    const toggleSitemapEnable = (id) => {
        const item = filteredItems.find(item => item.id === id);
        if (item) {
            const updatedItem = { ...item, enabled: !item.enabled };
            SitemapService.update(id, updatedItem).then(
                () => {
                    setSnackbarOpen(true);
                    setSnackbarMessage(`Sitemap ${id} updated: enabled = ${updatedItem.enabled}`);
                    fetchSitemaps();
                },
                (error) => {
                    console.error(`Sitemap ${id} could not be updated`, error);
                }
            );
        }
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

    const createSitemap = () => {
        navigate("/sitemap/create");
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    return (
        <>
            <title> Sitemaps </title>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Sitemaps
                    </Typography>
                    <Button variant="contained" onClick={createSitemap} startIcon={<Iconify icon="eva:plus-fill"/>}>
                        New Sitemap
                    </Button>
                </Stack>

                <Card>
                    <ArrayListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        count={filteredItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <ArrayListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={list.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, loc, type, lastmod, enabled} = row;
                                        const selectedUser = selected.indexOf(loc) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, loc)}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Typography variant="subtitle2" noWrap>{loc}</Typography>
                                                </TableCell>
                                                <TableCell align="left">{type}</TableCell>
                                                <TableCell align="left">{lastmod}</TableCell>
                                                <TableCell align="left" sx={{"&:hover": {cursor: "pointer"}}} onClick={() => toggleSitemapEnable(id)}>
                                                    <Iconify icon={enabled ? 'fluent-color:checkmark-circle-20' : 'fluent-color:dismiss-circle-20'} sx={{mr: 2}}/>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id, loc)}>
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
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{ sx: { p: 1, width: 140, '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 } } }}
            >
                <MenuItem sx={{color: 'primary.main'}} onClick={() => navigate(`/sitemap/${editId}`)}>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>
                <MenuItem sx={{color: 'error.main'}} onClick={() => { setDialogOpen(true); handleCloseMenu(); }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Supprimer ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer l'entrée {editLabel} ?
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

export default Sitemaps;
