import React, { useState } from "react";
import EventBus from "../common/EventBus";
import {
  Card,
  Table,
  Stack,
  Popover,
  Link,
  MenuItem,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Scrollbar from "../designComponents/scrollbar";
import { ArrayListHead, ArrayListToolbar } from "../sections/array/index.jsx";
import Iconify from "../designComponents/iconify";
import UserService from "../services/user.service";
import { useNavigate } from "react-router-dom";

const BoardUser = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editLabel, setEditLAbel] = useState("");
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const handleFilterByName = (event) => {
    event.preventDefault();
    const str = event.target.value;
    if (str.length >= 3) {
      UserService.getUserBySearch(event.target.value).then(
        (response) => {
          setList(response.data);
        },
        (error) => {
          const _content =
            error?.response?.data?.message || error.message || error.toString();

          setList(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
    setSearchValue(event.target.value);
  };

  const handleOpenMenu = (event, id, list) => {
    setUserInfo(list);
    setEditId(id);
    setOpen(event.currentTarget);
    setEditLAbel(`${list.username}, ${list.email}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(list.map((n) => n.firstName));
      return;
    }
    setSelected([]);
  };

  const TABLE_HEAD = [
    { id: "prenom", label: "prenom", alignCenter: false },
    { id: "nom", label: "nom", alignCenter: false },
    { id: "email", label: "email", alignCenter: false },
    { id: "" },
  ];

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/user/${editId}`, { state: userInfo });
  };

  const handleDelete = () => {
    UserService.deleteUser(editId).then(()=>{
      setList(list.filter(item => item.id !== editId));
    });
    setOpen(null);
    setDialogOpen(false);
  };

  return (
    <>
        <title> Utilisateur </title>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Utilisateurs
          </Typography>
        </Stack>

        <Card>
          <ArrayListToolbar
            filterName={searchValue}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ArrayListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={list.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {list.map((list) => (
                    <TableRow hover key={list.id} tabIndex={-1} role="checkbox">
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                          {list.firstName}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                          {list.lastName}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                          {list.email}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) =>
                            handleOpenMenu(event, list.id, list)
                          }
                        >
                          <Iconify icon={"eva:more-vertical-fill"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          <Link onClick={handleRedirect}>Edit</Link>
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          <Link onClick={() => setDialogOpen(true)}>Delete</Link>
        </MenuItem>
      </Popover>
      <Dialog open={dialogOpen}>
        <DialogTitle id="alert-dialog-title">Supprimer ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <strong>{editLabel}</strong> : Attention, êtes-vous sûr de vouloir supprimer cet utilisateur (et de ce fait, son centre,si il est propriétaire) ?
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

export default BoardUser;
