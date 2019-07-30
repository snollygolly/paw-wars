import React, { ReactElement } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

import logoP from '../images/paw-wars-p.png';

const AppNavbar: React.FC = (): ReactElement => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <LinkContainer to="/">
        <Navbar.Brand href="#home" className="mr-auto">
          <img src={logoP} height="35" alt="Paw Wars Logo" />
        </Navbar.Brand>
      </LinkContainer>
      <Nav>
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
};

export default AppNavbar;
