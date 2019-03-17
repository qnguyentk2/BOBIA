import React, { PureComponent, memo } from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import LoginSocial from './LoginSocial';
import BobiaLogo from 'assets/images/logo.png';
import {
  Button,
  Input,
  Form,
  FormFeedback,
  FormGroup,
  Label
} from 'reactstrap';
import Common from 'components/common';

const LoginForm = memo(({ login, initialValues, saveNewValue }) => {
  const _generateValidateSchema = () => {
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

  const {
    commonProps: {
      validate: { check }
    }
  } = Common;

  return (
    <Formik
      initialValues={initialValues}
      validate={check(_generateValidateSchema)}
      onSubmit={values => {
        saveNewValue(values, () =>
          login({
            variables: values
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
          <FormGroup>
            <Label className="login-form__label">
              Tên đăng nhập hoặc email
            </Label>
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
          </FormGroup>
          <FormGroup>
            <Label className="login-form__label">Mật khẩu</Label>
            <Input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              invalid={touched.password && !!errors.password}
            />
            <FormFeedback>{touched.password && errors.password}</FormFeedback>
          </FormGroup>
          <FormGroup className="login-form__forgot-pass">
            <Label className="check-block">
              <Input
                type="checkbox"
                name="remember_me"
                onChange={handleChange}
                onBlur={handleBlur}
                className="checkbox checkbox-button"
              />
              Ghi nhớ đăng nhập
            </Label>
            {/* <Link to="" className="redirect-link">
              Quên mật khẩu?
            </Link> */}
          </FormGroup>
          <FormGroup>
            <Button
              type="submit"
              className="btn btn-submit"
              disabled={isSubmitting}
            >
              Đăng nhập
            </Button>
          </FormGroup>
        </Form>
      )}
    />
  );
});

export default class LoginModal extends PureComponent {
  state = {
    initialValues: {
      usernameOrEmail: '',
      password: '',
      remember_me: false
    }
  };

  _handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  render() {
    const {
      commonProps: {
        queries: { mutation },
        notify
      },
      commonComps: { CommonLoading, CommonMessage, Page500, LazyImage }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => (
          <Mutation mutation={mutation.login}>
            {(_handleLogin, { loading, error, data }) => {
              if (loading) {
                return <CommonLoading />;
              }
              if (error && error.networkError) {
                return <Page500 error={error.networkError} />;
              }
              if (data && data.login && data.login.success === true) {
                context.changeLoggedInState(
                  {
                    isLoggedIn: data.login.success,
                    banner: data.login.banner,
                    user: data.login.user
                  },
                  () => {
                    if (data.login.token && window.localStorage) {
                      window.localStorage.setItem('token', data.login.token);
                    }
                    notify.success('Đăng nhập thành công!');
                  }
                );
              }

              return (
                <>
                  <div className="login">
                    <div className="container">
                      <Link to="/" className="logo-link">
                        <LazyImage
                          src={BobiaLogo}
                          className="logo-img"
                          alt="Bobia logo"
                        />
                      </Link>
                      <div className="login-form">
                        <LoginForm
                          login={_handleLogin}
                          initialValues={this.state.initialValues}
                          saveNewValue={this._handleNewValue}
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
                      </div>
                    </div>
                  </div>
                  <LoginSocial {...this.props} />
                  <div className="login">
                    <div className="container">
                      <FormGroup>
                        <span className="note">
                          Chưa có tài khoản
                          <span
                            className="redirect-link"
                            onClick={context.toggleAuthenFlip()}
                          >
                            Đăng ký ngay!
                          </span>
                        </span>
                      </FormGroup>
                    </div>
                  </div>
                </>
              );
            }}
          </Mutation>
        )}
      </Subscribe>
    );
  }
}
