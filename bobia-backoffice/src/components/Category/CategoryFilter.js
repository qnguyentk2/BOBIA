import React, { Component } from 'react';
import { FormGroup, Row, Col, Label, Input } from 'reactstrap';

export default class CategoryFilter extends Component {
  handleInputChange = e => {
    this.props.onFilterChange(e.target);
  };
  handleSubmit = () => {
    this.props.onSearchCategory();
  };

  render() {
    const { dataFilter } = this.props;
    return (
      // <Form className="filter-form">
      <div className="filter-form">
        <Row>
          <Col sm="4 pd-right-10">
            <FormGroup>
              <Label className="filter-form__label">Tên Category</Label>
              <div className="position-relative">
                <Input
                  type="text"
                  id="categoryName"
                  className="filter-form__input"
                  onChange={this.handleInputChange}
                  value={dataFilter.name}
                />
                {dataFilter.isDel}
                <span className="line" />
              </div>
            </FormGroup>
          </Col>
          <Col sm="4 pd-right-10">
            <FormGroup>
              <div className="position-relative">
                <Input
                  type="checkbox"
                  id="isDel"
                  checked={dataFilter.isDel}
                  onChange={this.handleInputChange}
                />
                <Label className="filter-form__label">Is Deleted</Label>
              </div>
            </FormGroup>
          </Col>
        </Row>
        {/* <Row className="filter-form__button-group">
          <button
            className="btn btn-submit btn-primary"
            onClick={this.handleSubmit}
          >
            Search
          </button>
          <button className="btn btn-submit btn-secondary">Reset</button>
        </Row> */}
      </div>
      // </Form>
    );
  }
}
