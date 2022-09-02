import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutInitiate } from "../../redux/actions";
import { getCurrentUser } from "../../redux/store/selectors/getCurrentUser";

import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser());
  const logout = () => {
    if (currentUser) {
      dispatch(logoutInitiate());
    }
  };

  return (
    <div className="header">
      <Container>
        <div className="top-line">
          {currentUser?.displayName && (
            <span className="greetings">
              Hi {currentUser.displayName}, welcome to visit!
            </span>
          )}

          {!currentUser?.displayName && (
            <>
              <button type="button" className="btn btn-login btn-left">
                <Link className="link" to="/signup">
                  SignUp <VpnKeyIcon className="icon" />
                </Link>
              </button>
              <button type="button" className="btn btn-login">
                <Link className="link" to="/login">
                  Login <LoginIcon className="icon" />
                </Link>
              </button>
            </>
          )}

          {currentUser?.displayName && (
            <button
              onClick={logout}
              type="button"
              className="btn btn-login link"
            >
              Logout
              <LogoutIcon className="icon" />
            </button>
          )}
        </div>
        <h1 className="message-header">
          You have arrived in the land of robot
        </h1>
      </Container>
    </div>
  );
};

export default Header;
