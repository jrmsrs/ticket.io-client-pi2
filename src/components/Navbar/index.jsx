import {
  LogoutTwoTone,
  PersonOffTwoTone,
  PermIdentityTwoTone
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import Logo from "../svg/Logo";
import "./style.css";

function Navbar() {
  const { user } = useContext(AuthGoogleContext);

  return (
    <header className="navbar navbar-dark sticky-top bg-primary container-fluid p-0">
      <div className="d-flex d-sm-none collapsed mx-1">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <Link
        to="/"
        className="navbar-brand d-none d-sm-block px-2"
        style={{ height: "2em", paddingTop: "2px" }}
      >
        <Logo dark={true} />
      </Link>
      <div className="navbar-nav">
        <div className="icon-props nav-item text-nowrap d-flex mx-2">
          <div className="icon-props text-light text-end user-select-none py-2">
            <span style={{ color: "white" }}>
              {user
                ? user.displayName ||
                  (user.localData ? user.localData.name : "")
                : "Não autenticado"}
            </span>
            {user ? (
              <PermIdentityTwoTone
                style={{ color: "white" }}
                className="user mx-2"
              />
            ) : (
              <PersonOffTwoTone
                style={{ color: "white" }}
                className="user mx-2"
              />
            )}
          </div>
          {user && (
            <Link
              to="login"
              data-bs-toggle="modal"
              data-bs-target="#logoutModal"
              className="icon-props nav-link px-2"
            >
              <LogoutTwoTone style={{ color: "white" }} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
