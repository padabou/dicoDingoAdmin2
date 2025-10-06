import React, {useEffect, useState} from "react";
import EventBus from "../../common/EventBus";
import ArticleService from "../../services/article.service";
import {filter} from "lodash";
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, IconButton, Dialog, Select, Box, FormControl, InputLabel,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Scrollbar from "../../designComponents/scrollbar";
import {ArrayListHead, ArrayListToolbar} from "../../sections/array/index.jsx";
import Iconify from "../../designComponents/iconify";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import typeService from "../../services/type.service";

const Articles = () => {
        const [ type, setType] = useState("");
        const [searchParams, setSearchParams] = useSearchParams();
        const [list, setList] = useState([]);
        const [types, setTypes] = useState([]);
        const [open, setOpen] = useState(null);
        const [dialogOpen, setDialogOpen] = useState(false);
        const [editId, setEditId] = useState(0);
        const [editLabel, setEditLabel] = useState("");
        const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page')) : 0);
        const [order, setOrder] = useState('asc');
        const [selected, setSelected] = useState([]);
        const [orderBy, setOrderBy] = useState('name');
        const [filterName, setFilterName] = useState(searchParams.get('query'));
        const [rowsPerPage, setRowsPerPage] = useState(25);
        const [filteredItems, setFilteredItems] = useState([]);
        const [isNotFound, setIsNotFound] = useState(false);

        useEffect(() => {
            ArticleService.getAll(type ? type : searchParams.get('type') ? searchParams.get('type') : '', "FR",searchParams.get('sitemapAdded') ? searchParams.get('sitemapAdded') : '',searchParams.get('enabled') ? searchParams.get('enabled') : '').then(
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

                    setList(_content);

                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("logout");
                    }
                }
            );
        }, [type]);

    useEffect(() => {
        updateSearchParams();
    }, [filterName]);

    const updateSearchParams = () => {
        const params = new URLSearchParams();
        if(searchParams.get('sitemapAdded')) {
            params.set('sitemapAdded', searchParams.get('sitemapAdded'));
        }
        if(searchParams.get('enabled')) {
            params.set('enabled', searchParams.get('enabled'));
        }
        if(searchParams.get('type')) {
            params.set('type', searchParams.get('type'));
        }
        if(filterName) {
            params.set('query', filterName);
        }

        if(page) {
            params.set('page', page);
        }
        setSearchParams(params);
    }

    useEffect(() => {
        typeService.getAll().then(
            (response) => {
                setTypes(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setList(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    const onChangeType = (e) => {
        const params = new URLSearchParams();
        if(searchParams.get('sitemapAdded')) {
            params.set('sitemapAdded', searchParams.get('sitemapAdded'));
        }
        if(searchParams.get('enabled')) {
            params.set('enabled', searchParams.get('enabled'));
        }
        if(filterName) {
            params.set('query', filterName);
        }
        if(page) {
            params.set('page', page);
        }
        params.set('type', e.target.value);

        setSearchParams(params);
        setType(e.target.value);
    };


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
            const newSelecteds = list.map((n) => n.name);
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
        const params = new URLSearchParams();
        if(searchParams.get('sitemapAdded')) {
            params.set('sitemapAdded', searchParams.get('sitemapAdded'));
        }
        if(searchParams.get('enabled')) {
            params.set('enabled', searchParams.get('enabled'));
        }
        if(searchParams.get('type')) {
            params.set('type', searchParams.get('type'));
        }
        if(filterName) {
            params.set('query', filterName);
        }

        if(page) {
            params.set('page', newPage);
        }
        setSearchParams(params);

    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
        searchParams.set('query', searchParams.get(event.target.value));
        setIsNotFound(!filteredItems.length && !!event.target.value);
    };

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

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const emptyRows = false;//page > 0 ? Math.max(0, (1 + page) * rowsPerPage - departmentList.length) : 0;

    const TABLE_HEAD = [
        {id: 'title', label: 'title', alignRight: false},
        {id: 'type', label: 'type', alignRight: false},
        {id: 'slug', label: 'slug', alignRight: false},
        {id: 'picture', label: 'picture', alignRight: false},
        {id: 'createdAt', label: 'Updte Date', alignRight: false},
        {id: ''},
    ];

    const navigate = useNavigate();

    const createArticle = () => {
      navigate("/article/create");
    };

    const createArticles = () => {
        navigate("/article/createByList");
    };

    useEffect(() => {
        setFilteredItems(applySortFilter(list, order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy), filterName));
    }, [list, filterName, order, orderBy]);
    useEffect(() => {
        setIsNotFound(!filteredItems.length && !!filterName);
    }, [filteredItems, filterName]);

    const handleDelete = () => {
        Articles.deleteFrontDiscipline(editId).then(() => {
            setList(list.filter(item => item.id !== editId));
        });
        setOpen(false);
        setDialogOpen(false);
    }

    const handleEdit = () => {
        navigate(`/article/` + editId);
    }

  return (
      <>
          <title> Articles </title>

          <Container>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h4" gutterBottom>
                      Articles
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" width={400}>
                      <Button variant="contained" onClick={createArticle} mr={5} startIcon={<Iconify icon="eva:plus-fill"/>}>
                          New Article
                      </Button>
                      <Button variant="contained" onClick={createArticles} startIcon={<Iconify icon="eva:plus-fill"/>}>
                          New Articles
                      </Button>
                  </Stack>
              </Stack>
              <Box sx={{ minWidth: 120 }}>
                  <FormControl sx={{ m: 1, minWidth: 480 }}>
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>
                      <Select className="form-select" aria-label="Article" onChange={onChangeType} value={type} label="Type">
                          {types?.map(type => {
                              return <MenuItem value={`${type.name}`}>{type.name}</MenuItem>
                          })}
                      </Select>
                  </FormControl>
              </Box>
              <Card>
                  <ArrayListToolbar numSelected={selected.length} filterName={filterName}
                                    onFilterName={handleFilterByName}/>
                  <TablePagination
                      rowsPerPageOptions={[25, 50, 100]}
                      component="div"
                      count={list.length}
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
                                      const {id, title, slug, type, picture, createdAt} = row;
                                      const selectedUser = selected.indexOf(title) !== -1;

                                      return (
                                          <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                    selected={selectedUser}>
                                              <TableCell padding="checkbox">
                                                  <Checkbox checked={selectedUser}
                                                            onChange={(event) => handleClick(event, title)}/>
                                              </TableCell>

                                              <TableCell component="th" scope="row" padding="none">
                                                  <Typography variant="subtitle2" noWrap>
                                                      {title}
                                                  </Typography>
                                              </TableCell>
                                              <TableCell align="left">{type}</TableCell>
                                              <TableCell align="left">{slug}</TableCell>
                                              <TableCell align="left">{picture}</TableCell>
                                              <TableCell align="left">{createdAt}</TableCell>

                                              <TableCell align="right">
                                                  <IconButton size="large" color="inherit"
                                                              onClick={(event) => handleOpenMenu(event, id, slug, title)}>
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
                                              <Paper
                                                  sx={{
                                                      textAlign: 'center',
                                                  }}
                                              >
                                                  <Typography variant="h6" paragraph>
                                                      Not found
                                                  </Typography>

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

                  <TablePagination
                      rowsPerPageOptions={[25, 50, 100]}
                      component="div"
                      count={list.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                  />
              </Card>
          </Container>

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
              <MenuItem sx={{ color: 'primary.main' }}>
                  <a href={`/article/${editId}`} onClick={handleCloseMenu}>
                  <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                  Edit
                  </a>
              </MenuItem>

              <MenuItem sx={{ color: 'error.main' }} onClick={() => setDialogOpen(true)}>
                  <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                  Delete
              </MenuItem>
          </Popover>

          <Dialog
            open={dialogOpen}
          >
            <DialogTitle id="alert-dialog-title">
                Supprimer ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Êtes-vous sûr de vouloir supprimer l'article {editLabel.toLowerCase()} ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)} color="error">
                    Fermer
                </Button>
                <Button onClick={handleDelete} autoFocus>
                    Continuer
                </Button>
            </DialogActions>
          </Dialog>
      </>
  );
};

export default Articles;
