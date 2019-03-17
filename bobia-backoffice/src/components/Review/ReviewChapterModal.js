import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import { Button, Form, FormFeedback, FormGroup, Row, Col } from 'reactstrap';
import { RichEditor } from '../common/Fields';
import Common from 'components/common';

class ReviewForm extends Component {
  validateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: { isEmpty }
        }
      }
    } = Common;

    let outputSchema = {
      name: [[value => !isEmpty(value), 'Tên tag không được để trống!']]
    };

    return outputSchema;
  };

  render() {
    const {
      refuseChapter,
      initialValues,
      saveNewValue,
      closeModal
    } = this.props;

    const {
      commonProps: {
        validate: { check }
      }
    } = Common;

    return (
      <Formik
        initialValues={initialValues}
        validate={check(this.validateSchema)}
        onSubmit={values => {
          saveNewValue(values, () =>
            refuseChapter({
              variables: { chapter: values }
            })
          );
        }}
        render={({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <div className="position-relative">
                      <RichEditor
                        className="create-chapter__editor-container"
                        name="refusedReason"
                        placeholder="Viết gì đó..."
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        value={values.refusedReason}
                      />
                      <FormFeedback>
                        {touched.refusedReason && errors.refusedReason}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="text-right">
                <Button
                  className="btn btn-black-invert user-form__button"
                  onClick={closeModal}
                >
                  Hủy
                </Button>
                <Button
                  color="danger"
                  type="submit"
                  className="btn btn-submit user-form__button"
                  disabled={isSubmitting}
                >
                  Lưu
                </Button>
              </FormGroup>
            </Form>
          );
        }}
      />
    );
  }
}

class ReviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: {
        ...this.props.reviewData
      }
    };
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  mergeNewState = tag => {
    let newState = Object.assign({}, this.state.initialValues);
    return newState;
  };

  render() {
    const { closeModal, refresh } = this.props;

    const {
      commonProps: {
        queries: { mutation },
        notify,
        validate
      },
      commonComps: { CommonLoading, CommonMessage, Page500 }
    } = Common;

    return (
      <Mutation
        mutation={mutation.refuseChapter}
        onCompleted={data => {
          notify.success('Không thông qua tác phẩm thành công!');
          closeModal();
          refresh();
        }}
      >
        {(refuseChapter, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 />;
          }
          return (
            <div className="user-form">
              <ReviewForm
                refuseChapter={refuseChapter}
                validate={validate}
                initialValues={this.state.initialValues}
                saveNewValue={this.handleNewValue}
                closeModal={closeModal}
                {...this.props}
              />
              {error &&
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 ? (
                <CommonMessage
                  type="error"
                  messages={error.graphQLErrors.map(error => {
                    return error.message;
                  })}
                />
              ) : null}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default ReviewModal;
