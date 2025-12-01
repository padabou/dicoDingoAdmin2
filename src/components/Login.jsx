import React, {useEffect, useState, useActionState} from "react";
import {useNavigate} from 'react-router-dom';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import {useFormStatus} from "react-dom";
import {z} from "zod";
import {Button, Input} from "@mui/material";

const Login = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authDone, setAuthDone] = useState(false);

  // Schéma de validation avec Zod
  const schema = z.object({
    username: z.string().min(1, "L'identifiant est requis"),
    password: z.string().min(1, "Le mot de passe est requis"),
  });

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

  useEffect(() => {
    if (authDone) {
      UserService.getUserInfo().then(
        (response) => {
          localStorage.setItem('userUsername', response.data?.username);
          //localStorage.setItem('userEmail', response.data?.email);
          localStorage.setItem('userType', response.data?.type);
          navigate("/home");
          window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      })
    }
  },[authDone, navigate])

  const [state, formAction] = useActionState(handleLogin, {});
  const { pending } = useFormStatus();
   function handleLogin(prevState, formData) {


    const username = formData.get("username");
    const password = formData.get("password");

    const parsed = schema.safeParse({ username, password });

    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    AuthService.login(username, password).then(
        () => {
          setAuthDone(true);
        },
        (error) => {
          const resMessage =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
              error.message ||
              error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
    );


    return { success: true };
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
            />
              {state.errors?.username && (
                  <p className="text-red-500 text-sm">{state.errors.username}</p>
              )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
            />
              {state.errors?.password && (
                  <p className="text-red-500 text-sm">{state.errors.password}</p>
              )}
          </div>

          <Button
              type="submit"
              disabled={pending}
              className="btn btn-primary btn-block"
          >
            {pending ? "Connexion..." : "Valider"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
