import React, { Component, ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import { Link, NavLink, Route, RouteComponentProps } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

import { Sidenav } from '../Sidenav';

import logo from '../images/paw-wars-logo.png';

interface ManualState {
  HOW_TO_PLAY: string;
  HOTEL: string;
  MARKET: string;
  AIRPORT: string;
  BANK: string;
  EVENTS: string;
  VENDORS: string;
  POLICE: string;
  ITEMS: string;
  PLACES: string;
}

interface LinkProps {
  href: string;
  children: string;
}

const RENDERERS = {
  link: function linkRenderer(props: LinkProps): ReactElement {
    return <Link to={props.href}>{props.children}</Link>;
  }
};

export class Manual extends Component<RouteComponentProps, ManualState> {
  public state = {
    HOW_TO_PLAY: '',
    HOTEL: '',
    MARKET: '',
    AIRPORT: '',
    BANK: '',
    EVENTS: '',
    VENDORS: '',
    POLICE: '',
    ITEMS: '',
    PLACES: ''
  };

  public componentWillMount(): void {
    axios.get('http://localhost:5050/manual/how_to_play').then((res): void => this.setState({ HOW_TO_PLAY: res.data }));
    axios.get('http://localhost:5050/manual/hotel').then((res): void => this.setState({ HOTEL: res.data }));
    axios.get('http://localhost:5050/manual/market').then((res): void => this.setState({ MARKET: res.data }));
    axios.get('http://localhost:5050/manual/airport').then((res): void => this.setState({ AIRPORT: res.data }));
    axios.get('http://localhost:5050/manual/bank').then((res): void => this.setState({ BANK: res.data }));
    axios.get('http://localhost:5050/manual/vendors').then((res): void => this.setState({ VENDORS: res.data }));
    axios.get('http://localhost:5050/manual/events').then((res): void => this.setState({ EVENTS: res.data }));
    axios.get('http://localhost:5050/manual/police').then((res): void => this.setState({ POLICE: res.data }));
    axios.get('http://localhost:5050/manual/items').then((res): void => this.setState({ ITEMS: res.data }));
    axios.get('http://localhost:5050/manual/places').then((res): void => this.setState({ PLACES: res.data }));
  }

  public render(): ReactElement {
    return (
      <>
        <GithubCorner
          href="https://github.com/snollygolly/paw-wars"
          direction="right"
          bannerColor="#0079d8"
          className="d-none d-sm-block"
        />
        <Sidenav
          sidenav={
            <div className="sidenav-container">
              <NavLink
                to="/manual"
                className="sidenav-link sidenav-main-header border-bottom"
                activeClassName="selected"
              >
                Paw Wars: The Definitive Guide
              </NavLink>
              <nav className="sidenav-nav">
                <NavLink to="/manual/how_to_play" className="sidenav-link" activeClassName="selected">
                  How To Play
                </NavLink>
                <div className="header">Game Mechanics</div>
                <NavLink to="/manual/hotel" className="sidenav-link" activeClassName="selected">
                  Hotel
                </NavLink>
                <NavLink to="/manual/market" className="sidenav-link" activeClassName="selected">
                  Market
                </NavLink>
                <NavLink to="/manual/airport" className="sidenav-link" activeClassName="selected">
                  Airport
                </NavLink>
                <NavLink to="/manual/bank" className="sidenav-link" activeClassName="selected">
                  Bank
                </NavLink>
                <div className="header">Encounters</div>
                <NavLink to="/manual/vendors" className="sidenav-link" activeClassName="selected">
                  Vendors
                </NavLink>
                <NavLink to="/manual/events" className="sidenav-link" activeClassName="selected">
                  Events
                </NavLink>
                <NavLink to="/manual/police" className="sidenav-link" activeClassName="selected">
                  Police
                </NavLink>
                <div className="header">Glossary</div>
                <NavLink to="/manual/items" className="sidenav-link" activeClassName="selected">
                  Items
                </NavLink>
                <NavLink to="/manual/places" className="sidenav-link" activeClassName="selected">
                  Places
                </NavLink>
              </nav>
            </div>
          }
          main={
            <Container>
              <Route
                path={`${this.props.match.path}/how_to_play`}
                render={(): ReactElement => <ReactMarkdown source={this.state.HOW_TO_PLAY} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/hotel`}
                render={(): ReactElement => <ReactMarkdown source={this.state.HOTEL} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/market`}
                render={(): ReactElement => <ReactMarkdown source={this.state.MARKET} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/airport`}
                render={(): ReactElement => <ReactMarkdown source={this.state.AIRPORT} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/bank`}
                render={(): ReactElement => <ReactMarkdown source={this.state.BANK} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/vendors`}
                render={(): ReactElement => <ReactMarkdown source={this.state.VENDORS} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/events`}
                render={(): ReactElement => <ReactMarkdown source={this.state.EVENTS} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/police`}
                render={(): ReactElement => <ReactMarkdown source={this.state.POLICE} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/items`}
                render={(): ReactElement => <ReactMarkdown source={this.state.ITEMS} renderers={RENDERERS} />}
              />
              <Route
                path={`${this.props.match.path}/places`}
                render={(): ReactElement => <ReactMarkdown source={this.state.PLACES} renderers={RENDERERS} />}
              />
              <Route
                exact
                path={this.props.match.path}
                render={(): ReactElement => {
                  return (
                    <>
                      <img src={logo} className="img-fluid" alt="Paw Wars" />
                      <p>
                        <strong>Paw Wars</strong> is a game that takes place in a world where dogs are the ruling class
                        and cats are treated as lower class citizens. Luxury items are strictly forbidden, but a black
                        market persists. You take on the role of a smuggler trying to provide contraband to cats in
                        need. You travel the world buying and selling items, avoiding police, and hustling to get rich
                        or die trying.
                      </p>
                    </>
                  );
                }}
              />
            </Container>
          }
        />
      </>
    );
  }
}
