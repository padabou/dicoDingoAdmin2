import React, {useEffect, useState} from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const Profile = () => {
    const [currentUser, setCurrentUser] = useState("");
    useEffect(() => {
        UserService.getUserInfo().then(
            (response) => {
                setCurrentUser(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentUser(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong>
        </h3>
      </header>
    </div>
  );
};

export default Profile;
