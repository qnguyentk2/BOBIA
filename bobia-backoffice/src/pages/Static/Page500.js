import React, { Component } from 'react';
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';

class Page500 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <span className="clearfix">
                <h1 className="float-left display-3 mr-4">500</h1>
                <h4 className="pt-3">Ui chà, có lỗi xảy ra!</h4>
                <p className="text-muted float-left">
                  Trang bạn truy cập hiện không khả dụng.
                </p>
              </span>
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input size="16" type="text" placeholder="Bạn đang tìm gì?" />
                <InputGroupAddon addonType="append">
                  <Button color="info">Tìm</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page500;
