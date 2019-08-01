import React, { Component, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import axios from 'axios';
import { Badge, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faTrophy } from '@fortawesome/free-solid-svg-icons';

import './Records.scss';

import logo from '../images/paw-wars-logo.png';

interface Score {
  _id: string;
  name: string;
  alive: boolean;
  score: number;
  guest: boolean;
}

export class Records extends Component<{}, {}> {
  public state = {
    scores: [] as Score[],
    player: {},
    life: {}
  };

  public componentWillMount(): void {
    axios.get('http://localhost:5050/records').then((res): void => this.setState({ ...res.data }));
  }

  public render(): ReactElement {
    return (
      <>
        <GithubCorner
          href="https://github.com/snollygolly/paw-wars"
          direction="left"
          bannerColor="#0079d8"
          className="d-none d-sm-block"
        />
        <Container>
          <div className="records-header-container">
            <img src={logo} className="img-fluid" alt="Paw Wars" />
            <p className="lead">
              <strong>
                These cat smugglers were the most successful at what they did, honor their memory by doing it even
                bigger!
              </strong>
            </p>
          </div>
          <Row className="justify-content-md-center">
            <Col sm={8}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">High Scores</Card.Title>
                  <ListGroup className="records-container">
                    {this.state.scores.map(
                      (score: Score, key: number): ReactElement => (
                        <ListGroup.Item key={score._id}>
                          <Link to={`/obituary/${score._id}`}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                {key <= 0 && (
                                  <Badge variant="primary" className={`medal-${key}`}>
                                    <FontAwesomeIcon icon={faTrophy} />
                                    &nbsp;#{key + 1}
                                  </Badge>
                                )}
                                <strong>{score.name}</strong>
                                {score.guest && (
                                  <Badge variant="secondary" className="guest-badge">
                                    <FontAwesomeIcon icon={faQuestion} />
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="primary">Score: {score.score}</Badge>
                            </div>
                          </Link>
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
