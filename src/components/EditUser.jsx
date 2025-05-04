import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import RoleService from "../services/role.service";
import UserService from "../services/user.service";

const EditUser = () => {

  const form = useRef();
  const checkBtn = useRef();
  const location = useLocation();

  const [id, setId] = useState(location.state.id);
  const [firstName, setFirstName] = useState(location.state.firstName);
  const [lastName, setLastName] = useState(location.state.lastName);
  const [username, setUsername] = useState(location.state.username);
  const [roles, setRoles] = useState([...location.state.roles]);
  const [listRole, setListRole] = useState([]);
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const onChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeRole = (e) => {
    const roleId = e.target.value;
    const roleIndex = roles.findIndex((role) => role.id === roleId);

    if (roleIndex !== -1) {
      const updatedRoles = [...roles];
      updatedRoles.splice(roleIndex, 1);
      setRoles(updatedRoles);
    } else {
      const updatedRoles = [...roles, { id: roleId }];
      setRoles(updatedRoles);
    }
  };

  useEffect(() => {
    RoleService.getAllRole().then((response) => {
      const updatedListRole = response.data.map((role) => ({
        ...role,
        checked: roles.some((selectedRole) => selectedRole.id === role.id),
      }));
      setListRole(updatedListRole);
    });
  }, [roles]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const data = {
      id,
      firstName,
      lastName,
      username,
      roles
    };

    setMessage("");
    setLoading(true);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      if(roles != null){
        UserService.updateUser(data);
      }
      setLoading(false);
      setMessage("Done");
    } else {
      setLoading(false);
    }
  };

  return (
    <>
        <title>Utilisateur :</title>
      <Form onSubmit={handleUpdate} ref={form}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <Input
            type="text"
            value={firstName}
            className="form-control"
            onChange={onChangeFirstName}
            name="firstName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <Input
            type="text"
            value={lastName}
            className="form-control"
            onChange={onChangeLastName}
            name="lastName"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            value={username}
            onChange={onChangeUsername}
            className="form-control"
            name="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Roles : </label>
          <FormGroup>
            {listRole.map((role) => (
              <FormControlLabel
                key={role.id}
                control={<Checkbox />}
                value={role.id}
                label={role.name}
                onChange={onChangeRole}
                checked={role.checked}
              />
            ))}
          </FormGroup>
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-block">
            <span>Mise à jour</span>
          </button>
        </div>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
    </>
  );
};

export default EditUser;
