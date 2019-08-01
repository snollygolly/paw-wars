import React, { Component, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import axios from 'axios';
import { Container, ListGroup } from 'react-bootstrap';

import './Obituary.scss';

interface Params {
  id: string;
}

export class Obituary extends Component<RouteComponentProps<Params>, {}> {
  public state = {
    pastLife: {
      name: '',
      starting: {
        location: {
          country: ''
        }
      },
      current: {
        location: {
          country: ''
        },
        turn: 0,
        finance: {
          cash: 0,
          debt: 0,
          savings: 0
        },
        storage: {
          available: 0,
          total: 0
        },
        police: {
          awareness: 0
        }
      },
      eulogy: {
        simple: ''
      },
      actions: [],
      obituary: {
        memories: '',
        stashFlavor: '',
        heat: ''
      },
      health: {
        description: ''
      }
    }
  };

  public componentWillMount(): void {
    axios
      .get(`http://localhost:5050/records/obituary/${this.props.match.params.id}`)
      .then((res): void => this.setState({ ...res.data }));
  }

  public render(): ReactElement {
    const { pastLife } = this.state;

    return (
      <>
        <GithubCorner
          href="https://github.com/snollygolly/paw-wars"
          direction="left"
          bannerColor="#0079d8"
          className="d-none d-sm-block"
        />
        <Container>
          <h2>
            This is the obituary for the late <i>{pastLife.name}</i>
          </h2>
          <p className="lead">
            <i>{pastLife.name}</i> started off life in {pastLife.starting.location.country} and lived{' '}
            {pastLife.current.turn} turns before dying in {pastLife.current.location.country}. They{' '}
            {pastLife.eulogy.simple}.
          </p>
          <ListGroup className="mb-4">
            <ListGroup.Item variant="dark">
              <h5>Trip Memories</h5>
              <p>
                <q>{pastLife.obituary.memories}</q>
              </p>
              <small className="text-muted">
                We found a small bit of <i>{pastLife.name}&apos;s</i> notebook, here it is.
              </small>
            </ListGroup.Item>
          </ListGroup>
          <ListGroup>
            <ListGroup.Item>
              <h5>Health Report</h5>
              <p>
                Before <i>{pastLife.name}</i> died, they were feeling {pastLife.health.description}.
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Financial Report</h5>
              <p>
                <i>{pastLife.name}</i> died{' '}
                {pastLife.current.finance.cash && `with $${pastLife.current.finance.cash} in cash`}
                {!pastLife.current.finance.cash && 'without any cash'}
                on them and had{' '}
                {pastLife.current.finance.savings && `$${pastLife.current.finance.savings} sitting in the bank.`}
                {!pastLife.current.finance.savings && 'no savings at all.'}
                {pastLife.current.finance.debt && ` They had an outstanding loan of $${pastLife.current.finance.debt}`}
                {!pastLife.current.finance.debt &&
                  " They were in good standing with the bank and didn't have any debt"}{' '}
                when they died.
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Stash Report</h5>
              <p className="mb-1">
                <i>{pastLife.name}</i> had {pastLife.current.storage.total - pastLife.current.storage.available} units
                of contraband in their stash when they died. {pastLife.obituary.stashFlavor}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Police Report</h5>
              <p>{pastLife.obituary.heat}</p>
            </ListGroup.Item>
          </ListGroup>
        </Container>
      </>
    );
  }
}
