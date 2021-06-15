/* eslint-disable jsx-a11y/anchor-is-valid */
import "../../sass/styles.scss";
import Logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">
            <img src={Logo} alt="Logo to do list" width="112" height="28" />
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item">Inicio</a>
            <a className="navbar-item">To Do List</a>
            <a className="navbar-item">Salir</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
