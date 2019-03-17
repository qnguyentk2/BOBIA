import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
// import LoginSocial from './LoginSocial';
import BobiaLogo from 'assets/images/logo.png';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  // CardFooter,
  Button,
  Input,
  Form,
  FormFeedback,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

class LoginForm extends Component {
  validateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: {
            isEmpty,
            minLength,
            maxLength,
            isEmail,
            isUsername,
            hasNoSpace
          }
        }
      }
    } = Common;

    return {
      usernameOrEmail: [
        [
          value => !isEmpty(value),
          'Tên đăng nhập hoặc email không được để trống!'
        ],
        [
          value => minLength(value, 5),
          'Tên đăng nhập hoặc email tối thiểu 5 ký tự!'
        ],
        [
          value => maxLength(value, 25),
          'Tên đăng nhập hoặc email tối đa 25 ký tự!'
        ],
        [
          value => isUsername(value) || isEmail(value),
          'Tên đăng nhập hoặc email không hợp lệ!'
        ]
      ],
      password: [
        [value => !isEmpty(value), 'Mật khẩu không được để trống!'],
        [value => minLength(value, 8), 'Mật khẩu tối thiểu 8 ký tự!'],
        [value => maxLength(value, 25), 'Mật khẩu tối đa 25 ký tự!'],
        [value => hasNoSpace(value), 'Mật khẩu không được có khoảng trắng!']
      ]
    };
  };

  render() {
    const { login, initialValues, saveNewValue } = this.props;

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
            login({
              variables: { portal: 'OFFICE', ...values }
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
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="icon-user" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                name="usernameOrEmail"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.usernameOrEmail}
                invalid={touched.usernameOrEmail && !!errors.usernameOrEmail}
              />
              <FormFeedback>
                {touched.usernameOrEmail && errors.usernameOrEmail}
              </FormFeedback>
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="icon-lock" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                invalid={touched.password && !!errors.password}
              />
              <FormFeedback>{touched.password && errors.password}</FormFeedback>
            </InputGroup>
            <Row>
              <Col xs="12">
                <Label className="check-label">
                  <Input
                    type="checkbox"
                    name="remember_me"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="checkbox checkbox-button"
                  />
                  Ghi nhớ đăng nhập
                </Label>
              </Col>
            </Row>
            <Row>
              <Col xs="6">
                <Button
                  type="submit"
                  color="primary"
                  className="px-4"
                  disabled={isSubmitting}
                >
                  Đăng nhập
                </Button>
              </Col>
              <Col xs="6" className="text-right">
                <Button color="link" className="px-0">
                  Quên mật khẩu?
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      />
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: {
        usernameOrEmail: '',
        password: '',
        remember_me: false
      }
    };
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  render() {
    const { history } = this.props;

    const {
      commonProps: {
        queries: { mutation },
        validate
      },
      commonComps: { CommonLoading, CommonMessage, CommonRedirect, Page500 }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (context.state.isLoggedIn) {
            return <Redirect to="/" />;
          }

          return (
            <Mutation mutation={mutation.login}>
              {(login, { loading, error, data }) => {
                if (loading) {
                  return <CommonLoading />;
                }
                if (error && error.networkError) {
                  return <Page500 />;
                }
                if (data && data.login && data.login.success === true) {
                  if (data.login.token) {
                    localStorage.setItem('token', data.login.token);
                  }
                  return (
                    <CommonRedirect
                      history={history}
                      message="Đăng nhập thành công"
                    />
                  );
                }
                return (
                  <div className="app flex-row align-items-center">
                    <Container>
                      <Row className="justify-content-center">
                        <Col md="8">
                          <Card className="p-4">
                            <CardHeader>
                              <img
                                src={BobiaLogo}
                                className="logo-img"
                                alt="Bobia logo"
                              />
                            </CardHeader>
                            <CardBody>
                              <LoginForm
                                login={login}
                                validate={validate}
                                initialValues={this.state.initialValues}
                                saveNewValue={this.handleNewValue}
                              />
                              {error &&
                              error.graphQLErrors &&
                              error.graphQLErrors.length > 0 ? (
                                <CommonMessage
                                  type="error"
                                  messages={error.graphQLErrors.map(
                                    error => error.message
                                  )}
                                />
                              ) : null}
                            </CardBody>
                            {/* <CardFooter className="p-4">
                        <LoginSocial {...this.props} />
                      </CardFooter> */}
                          </Card>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Subscribe>
    );
  }
}

export default Login;
