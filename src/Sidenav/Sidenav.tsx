import React, { useState, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Collapse, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import './Sidenav.scss';

interface SidenavProps {
  sidenav: ReactElement;
  main: ReactElement;
}

const Sidenav: React.FC<SidenavProps> = ({ sidenav, main }): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <Container fluid={true}>
      <Row className="sidenav-outer-container">
        <Col xs={12} className="sidenav-collapse d-block d-sm-none border-bottom">
          <div className="sidenav-collapse-header">
            <Button onClick={(): void => setOpen(!open)} aria-controls="collapse-sidenav" aria-expanded={open}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>
          <Collapse in={open}>
            <div id="sidenav-collapse">{sidenav}</div>
          </Collapse>
        </Col>
        <Col md={2} sm={3} className="sidenav border-right d-none d-sm-block">
          {sidenav}
        </Col>
        <Col md={10} sm={9} className="main">
          {main}
        </Col>
      </Row>
    </Container>
  );
};

Sidenav.propTypes = {
  sidenav: PropTypes.element.isRequired,
  main: PropTypes.element.isRequired
};

export default Sidenav;
