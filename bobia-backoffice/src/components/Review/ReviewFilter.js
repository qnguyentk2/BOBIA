import React, { Component } from 'react';
import { Form, FormGroup, Row, Col, Label, Input } from 'reactstrap';

export default class ReviewFilter extends Component {
  render() {
    return (
      <Form className="filter-form">
        <Row>
          <Col sm="4 pd-right-10">
            <FormGroup>
              <Label className="filter-form__label">Tựa đề sách</Label>
              <div className="position-relative">
                <Input
                  type="text"
                  name="bookTitle"
                  className="filter-form__input"
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  // value={values.username || ''}
                  // invalid={touched.username && !!errors.username}
                  // disabled={oldUsername ? true : false}
                />
                <span className="line" />
              </div>
            </FormGroup>
          </Col>
          <Col sm="4 pd-right-10">
            <FormGroup>
              <Label className="filter-form__label">Tựa đề chương</Label>
              <div className="position-relative">
                <Input
                  type="text"
                  name="chapterTitle"
                  className="filter-form__input"
                  // onChange={handleChange}
                  // onBlur={handleBlur}
                  // value={values.username || ''}
                  // invalid={touched.username && !!errors.username}
                  // disabled={oldUsername ? true : false}
                />
                <span className="line" />
              </div>
            </FormGroup>
          </Col>
          <Col sm="2 pd-right-10">
            <FormGroup>
              <Label className="filter-form__label">Tình Trạng</Label>
              <div className="position-relative">
                <select
                  className="form-control"
                  // onChange={this.filter('state')}
                  // value={
                  //   this.state.variables.filters
                  //     ? this.state.variables.filters.state
                  //     : 'ALL'
                  // }
                >
                  <option value="ALL">---select---</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PENDING">Đang chờ duyệt</option>
                  <option value="PUBLISHED">Đã thông qua</option>
                  <option value="REFUSED">Không thông qua</option>
                </select>
                <span className="line" />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="filter-form__button-group">
          <button className="btn btn-submit btn-primary">Search</button>
          <button className="btn btn-submit btn-secondary">Reset</button>
        </Row>
      </Form>
    );
  }
}
