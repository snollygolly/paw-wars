import React, { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuestion } from '@fortawesome/free-solid-svg-icons';

import './Login.scss';
import logo from '../images/paw-wars-logo.png';

const Login: React.FC = (): ReactElement => {
  return (
    <Container>
      <img src={logo} className="logo" alt="Paw Wars" />
      <p className="lead">
        Login or create an account with the social provider of your choice (or a username and password if you prefer) to
        resume your life as a cat mobster in case you have to leave.
        <br />
        Don&apos;t intend on going anywhere until you&apos;re filthy rich or dead and don&apos;t care about the fame?
        Play as a guest to get started right away, but without being able to resume your progress or set a name for the
        leaderboards.
      </p>
      <Button variant="primary" block size="lg">
        <FontAwesomeIcon icon={faStar} />
        &nbsp;Sign In / Create Account
      </Button>
      <Button variant="secondary" block size="lg">
        <FontAwesomeIcon icon={faQuestion} />
        &nbsp;Play as a guest
      </Button>
    </Container>
  );
};

export default Login;
