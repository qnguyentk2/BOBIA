import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import {
  Button,
  Input,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Row,
  Col
} from 'reactstrap';
import Common from 'components/common';

class ManagementForm extends Component {
  validateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: { isEmpty }
        }
      }
    } = Common;

    let outputSchema = {
      name: [[value => !isEmpty(value), 'Tên api không được để trống!']]
    };

    return outputSchema;
  };

  render() {
    const {
      saveApi,
      initialValues,
      saveNewValue,
      mode,
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
            saveApi({
              variables: { api: values }
            })
          );
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
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
                    <Label className="user-form__label">Tên api</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="name"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name || ''}
                        invalid={touched.name && !!errors.name}
                      />
                      <FormFeedback>{touched.name && errors.name}</FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Mô tả</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="description"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description || ''}
                        invalid={touched.description && !!errors.description}
                      />
                      <FormFeedback>
                        {touched.description && errors.description}
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
                  color={mode === 'create' ? 'primary' : 'success'}
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

class ManagementModal extends Component {
  constructor(props) {
    super(props);
    if (this.props.mode === 'create') {
      this.state = {
        initialValues: {
          name: '',
          description: ''
        }
      };
    } else {
      this.state = {
        initialValues: {
          ...this.props.apiData
        }
      };
    }
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  mergeNewState = api => {
    let newState = Object.assign({}, this.state.initialValues);
    return newState;
  };

  render() {
    const { mode, closeModal, refresh } = this.props;

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
        mutation={mode === 'create' ? mutation.createApi : mutation.updateApi}
        onCompleted={data => {
          mode === 'create'
            ? notify.success('Tạo api thành công!')
            : notify.success('Chỉnh sửa api thành công!');
          closeModal();
          refresh();
        }}
      >
        {(saveApi, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 />;
          }
          return (
            <div className="user-form">
              <ManagementForm
                saveApi={saveApi}
                validate={validate}
                initialValues={this.state.initialValues}
                saveNewValue={this.handleNewValue}
                mode={mode}
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

export default ManagementModal;
