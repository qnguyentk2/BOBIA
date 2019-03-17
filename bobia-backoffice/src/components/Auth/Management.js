import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Formik, Field } from 'formik';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  FormGroup,
  Form,
  Button
} from 'reactstrap';
import { CheckboxGroup, Checkbox } from '../common/Fields';
import SortableTree from 'react-sortable-tree';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

class AuthManagementForm extends Component {
  render() {
    const { updatePermissionForRole, initialValues, saveNewValue } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          saveNewValue(values, () =>
            updatePermissionForRole({
              variables: {
                roleId: initialValues.roleId,
                listAPI: values.currentAPIs
              }
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
          if (!values.roleId) {
            values.roleId = initialValues.roleId;
            if (
              initialValues.currentAPIs.length > 0 &&
              values.currentAPIs.length === 0
            ) {
              values.currentAPIs = initialValues.currentAPIs;
            }
          } else {
            if (initialValues.roleId !== values.roleId) {
              values.roleId = initialValues.roleId;
              values.currentAPIs = initialValues.currentAPIs;
            }
          }

          return (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm="12">
                  <CheckboxGroup
                    style={{ height: '70vh', overflow: 'auto' }}
                    className="form-check"
                    id="currentAPIs"
                    label={
                      initialValues.roleTitle
                        ? `Quyền của ${initialValues.roleTitle}`
                        : 'Tất cả quyền'
                    }
                    value={values.currentAPIs}
                    error={errors.currentAPIs}
                    touched={touched.currentAPIs}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    list={true}
                  >
                    {values.allApis.map(el => (
                      <Field
                        inputClassName="form-check-input"
                        labelClassName="form-check-label"
                        key={`api-${el.id}`}
                        component={Checkbox}
                        name="currentAPIs"
                        id={`${el.id}`}
                        label={el.name}
                      />
                    ))}
                  </CheckboxGroup>
                </Col>
              </Row>
              <FormGroup className="text-right">
                <Button
                  color="primary"
                  type="submit"
                  className="btn btn-submit user-form__button"
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

export default class AuthManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: {
        roleId: null,
        roleTitle: null,
        currentAPIs: []
      }
    };
  }

  getApisFromRole(role) {
    const {
      client,
      commonProps: {
        queries: { query },
        notify
      }
    } = Common;

    client
      .query({
        query: query.getPermissionByRole,
        variables: {
          roleId: role.id
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.getPermissionByRole &&
          data.getPermissionByRole.success === true
        ) {
          this.setState({
            initialValues: {
              roleId: role.id,
              roleTitle: role.title,
              currentAPIs: data.getPermissionByRole.listAPI.map(api =>
                api.id.toString()
              )
            }
          });
        }
      })
      .catch(() => {
        notify.error('Có lỗi xảy ra, xin vui lòng thử lại');
      });
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  mergeNewState = data => {
    let newState = Object.assign({}, this.state.initialValues);
    if (data) {
      if (data.allApis) {
        newState.allApis = data.allApis;
      }
    }
    return newState;
  };

  render() {
    const {
      commonProps: {
        queries: { query, mutation },
        notify,
        validate
      },
      commonComps: { CommonLoading, CommonRedirect, CommonMessage, Page500 }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (!context.state.isLoggedIn) {
            return (
              <CommonRedirect redirectTo="/login" message="Chưa đăng nhập" />
            );
          }

          return (
            <Row>
              <Col sm="12" xl="6">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify" />
                    <strong>Danh sách vai trò</strong>
                  </CardHeader>
                  <CardBody>
                    <ListGroup>
                      <Query
                        query={query.getAllRoles}
                        variables={{
                          options: { limit: 0, orderBy: 'name', dir: 'asc' }
                        }}
                      >
                        {({ loading, error, data }) => {
                          if (loading) {
                            return <CommonLoading />;
                          }
                          if (error && error.networkError) {
                            return <Page500 />;
                          }
                          if (
                            data &&
                            data.getAllRoles &&
                            data.getAllRoles.success === true
                          ) {
                            if (data.getAllRoles.roles.docs === 0) {
                              return <span>Chưa có vai trò nào </span>;
                            }

                            return (
                              <div style={{ height: '76vh' }}>
                                <SortableTree
                                  treeData={data.getAllRoles.roles.docs.map(
                                    el => ({
                                      title: el.name,
                                      subtitle: el.description,
                                      id: el.id
                                    })
                                  )}
                                  generateNodeProps={rowInfo => {
                                    let nodeProps = {
                                      onClick: event =>
                                        this.getApisFromRole(rowInfo.node)
                                    };
                                    if (
                                      this.state.initialValues.roleId &&
                                      this.state.initialValues.roleId ===
                                        rowInfo.node.id
                                    ) {
                                      nodeProps.style = { color: 'red' };
                                    }
                                    return nodeProps;
                                  }}
                                  onChange={treeData =>
                                    this.setState({ treeData })
                                  }
                                />
                              </div>
                            );
                          }
                        }}
                      </Query>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12" xl="6">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify" />
                    <strong>Danh sách quyền</strong>
                  </CardHeader>
                  <CardBody>
                    <Query
                      query={query.getAllApis}
                      variables={{
                        options: { limit: 0, orderBy: 'name', dir: 'asc' }
                      }}
                    >
                      {({ loading, error, data }) => {
                        if (loading) {
                          return <CommonLoading />;
                        }
                        if (error && error.networkError) {
                          return <Page500 />;
                        }
                        if (
                          data &&
                          data.getAllApis &&
                          data.getAllApis.success === true
                        ) {
                          if (data.getAllApis.apis.docs.length === 0) {
                            return <span>Chưa có quyền nào</span>;
                          }

                          const allApis = data.getAllApis.apis.docs;

                          return (
                            <Mutation
                              mutation={mutation.updatePermissionForRole}
                              onCompleted={data => {
                                notify.success(
                                  'Cập nhật quyền cho vai trò thành công!'
                                );
                              }}
                            >
                              {(
                                updatePermissionForRole,
                                { loading, error, data }
                              ) => {
                                if (loading) {
                                  return <CommonLoading />;
                                }
                                if (error && error.networkError) {
                                  return <Page500 />;
                                }
                                return (
                                  <div className="user-form">
                                    <AuthManagementForm
                                      updatePermissionForRole={
                                        updatePermissionForRole
                                      }
                                      validate={validate}
                                      initialValues={this.mergeNewState({
                                        allApis
                                      })}
                                      saveNewValue={this.handleNewValue}
                                      {...this.props}
                                    />
                                    {error &&
                                    error.graphQLErrors &&
                                    error.graphQLErrors.length > 0 ? (
                                      <CommonMessage
                                        type="error"
                                        messages={error.graphQLErrors.map(
                                          error => {
                                            return error.message;
                                          }
                                        )}
                                      />
                                    ) : null}
                                  </div>
                                );
                              }}
                            </Mutation>
                          );
                        }
                      }}
                    </Query>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          );
        }}
      </Subscribe>
    );
  }
}
