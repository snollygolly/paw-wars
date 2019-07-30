import React, { ReactElement } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';
import GithubCorner from 'react-github-corner';

import logo from '../images/paw-wars-logo.png';

const Home: React.FC = (): ReactElement => {
  return (
    <div>
      <GithubCorner href="https://github.com/snollygolly/paw-wars" direction="left" bannerColor="#0079d8" />
      <Container>
        <img src={logo} className="logo" alt="Paw Wars" />
        <p className="lead">
          <strong>Paw Wars</strong> is a game that takes place in a world where dogs are the ruling class and cats are
          treated as lower class citizens. Luxury items are strictly forbidden, but a black market persists. You take on
          the role of a smuggler trying to provide contraband to cats in need. You travel the world buying and selling
          items, avoiding police, and hustling to get rich or die trying.
        </p>
        <p>
          So how do you get started? Well it&apos;s easy! You can either click on the &quot;Play&quot; button below, or
          you can read the manual online and be an expert before you even start.
        </p>
        <Row>
          <Col sm={4}>
            <Card>
              <Card.Body>
                <Card.Title>Paw Wars: The Definitive Guide</Card.Title>
                <Card.Text>Explore the mechanics of the game in detail and get an edge on your competitors.</Card.Text>
                <LinkContainer to="/manual">
                  <Button variant="primary">Read The Manual</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4}>
            <Card>
              <Card.Body>
                <Card.Title>Play now for free</Card.Title>
                <Card.Text>
                  Get started now and see if you have what it takes to thrive in the shady criminal underworld that is{' '}
                  <strong>Paw Wars</strong>.
                </Card.Text>
                <LinkContainer to="/login">
                  <Button variant="success">Play</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4}>
            <Card>
              <Card.Body>
                <Card.Title>See who&apos;s on top</Card.Title>
                <Card.Text>
                  See the richest and most powerful cats in the land and how they lived their life. Do you have what it
                  takes to beat them?
                </Card.Text>
                <LinkContainer to="/records">
                  <Button variant="primary">High Scores</Button>
                </LinkContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
