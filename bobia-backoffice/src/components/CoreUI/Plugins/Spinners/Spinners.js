import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import './Spinners.scss';

class Spinners extends Component {
  render() {
    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="fa fa-spinner fa-spin" /> Spinners - SpinKit{' '}
            <a
              href="https://coreui.io/pro/react/"
              className="badge badge-danger"
            >
              CoreUI Pro Component
            </a>
            <div className="card-header-actions">
              <a
                href="https://github.com/tobiasahlin/SpinKit"
                rel="noopener noreferrer"
                target="_blank"
                className="card-header-action"
              >
                <small className="text-muted">docs</small>
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <p>
              Simple loading spinners animated with CSS. SpinKit uses hardware
              accelerated (translate and opacity) CSS animations to create
              smooth and easily customizable animations.
            </p>
          </CardBody>
        </Card>
        <Row>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Rotating plane
              </CardHeader>
              <CardBody>
                <div className="sk-rotating-plane" />
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Double bounce
              </CardHeader>
              <CardBody>
                <div className="sk-double-bounce">
                  <div className="sk-child sk-double-bounce1" />
                  <div className="sk-child sk-double-bounce2" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader className="card-header">
                <i className="fa fa-spinner" /> Wave
              </CardHeader>
              <CardBody>
                <div className="sk-wave">
                  <div className="sk-rect sk-rect1" />
                  &nbsp;
                  <div className="sk-rect sk-rect2" />
                  &nbsp;
                  <div className="sk-rect sk-rect3" />
                  &nbsp;
                  <div className="sk-rect sk-rect4" />
                  &nbsp;
                  <div className="sk-rect sk-rect5" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Wandering cubes
              </CardHeader>
              <CardBody>
                <div className="sk-wandering-cubes">
                  <div className="sk-cube sk-cube1" />
                  <div className="sk-cube sk-cube2" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Pulse
              </CardHeader>
              <CardBody>
                <div className="sk-spinner sk-spinner-pulse" />
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Chasing dots
              </CardHeader>
              <CardBody>
                <div className="sk-chasing-dots">
                  <div className="sk-child sk-dot1" />
                  <div className="sk-child sk-dot2" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Three bounce
              </CardHeader>
              <CardBody>
                <div className="sk-three-bounce">
                  <div className="sk-child sk-bounce1" />
                  <div className="sk-child sk-bounce2" />
                  <div className="sk-child sk-bounce3" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Circle
              </CardHeader>
              <CardBody>
                <div className="sk-circle">
                  <div className="sk-circle1 sk-child" />
                  <div className="sk-circle2 sk-child" />
                  <div className="sk-circle3 sk-child" />
                  <div className="sk-circle4 sk-child" />
                  <div className="sk-circle5 sk-child" />
                  <div className="sk-circle6 sk-child" />
                  <div className="sk-circle7 sk-child" />
                  <div className="sk-circle8 sk-child" />
                  <div className="sk-circle9 sk-child" />
                  <div className="sk-circle10 sk-child" />
                  <div className="sk-circle11 sk-child" />
                  <div className="sk-circle12 sk-child" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Cube grid
              </CardHeader>
              <CardBody>
                <div className="sk-cube-grid">
                  <div className="sk-cube sk-cube1" />
                  <div className="sk-cube sk-cube2" />
                  <div className="sk-cube sk-cube3" />
                  <div className="sk-cube sk-cube4" />
                  <div className="sk-cube sk-cube5" />
                  <div className="sk-cube sk-cube6" />
                  <div className="sk-cube sk-cube7" />
                  <div className="sk-cube sk-cube8" />
                  <div className="sk-cube sk-cube9" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Fading circle
              </CardHeader>
              <CardBody>
                <div className="sk-fading-circle">
                  <div className="sk-circle1 sk-circle" />
                  <div className="sk-circle2 sk-circle" />
                  <div className="sk-circle3 sk-circle" />
                  <div className="sk-circle4 sk-circle" />
                  <div className="sk-circle5 sk-circle" />
                  <div className="sk-circle6 sk-circle" />
                  <div className="sk-circle7 sk-circle" />
                  <div className="sk-circle8 sk-circle" />
                  <div className="sk-circle9 sk-circle" />
                  <div className="sk-circle10 sk-circle" />
                  <div className="sk-circle11 sk-circle" />
                  <div className="sk-circle12 sk-circle" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="3" lg="4" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-spinner" /> Folding Cube
              </CardHeader>
              <CardBody>
                <div className="sk-folding-cube">
                  <div className="sk-cube1 sk-cube" />
                  <div className="sk-cube2 sk-cube" />
                  <div className="sk-cube4 sk-cube" />
                  <div className="sk-cube3 sk-cube" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Spinners;
