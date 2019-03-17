import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik, Field } from 'formik';
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
  Collapse,
  Label
} from 'reactstrap';
import {
  DatePicker,
  RadioButtonGroup,
  RadioButton
} from 'components/common/Fields';
import Common from 'components/common';

class RegisterForm extends PureComponent {
  state = { collapse: false };

  _toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  _generateValidateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: {
            isEmpty,
            minLength,
            maxLength,
            isEmail,
            isUsername,
            hasNoSpace,
            isMatch
          }
        }
      }
    } = Common;

    return {
      username: [
        [value => !isEmpty(value), 'Tên đăng nhập không được để trống!'],
        [value => minLength(value, 5), 'Tên đăng nhập tối thiểu 5 ký tự!'],
        [value => maxLength(value, 25), 'Tên đăng nhập tối đa 25 ký tự!'],
        [value => isUsername(value), 'Tên đăng nhập không hợp lệ!']
      ],
      displayName: [
        [value => !isEmpty(value), 'Tên hiển thị không được để trống!']
      ],
      password: [
        [value => !isEmpty(value), 'Mật khẩu không được để trống!'],
        [value => minLength(value, 8), 'Mật khẩu tối thiểu 8 ký tự!'],
        [value => maxLength(value, 25), 'Mật khẩu tối đa 25 ký tự!'],
        [value => hasNoSpace(value), 'Mật khẩu không được có khoảng trắng!']
      ],
      confirm_password: [
        [value => !isEmpty(value), 'Mật khẩu xác nhận không được để trống!'],
        [value => minLength(value, 8), 'Mật khẩu xác nhận tối thiểu 8 ký tự!'],
        [value => maxLength(value, 25), 'Mật khẩu xác nhận tối đa 25 ký tự!'],
        [
          value => hasNoSpace(value),
          'Mật khẩu xác nhận không được có khoảng trắng!'
        ],
        [
          value => isMatch(value, values.password),
          'Mật khẩu xác nhận không trùng khớp!'
        ]
      ],
      email: [
        [value => isEmpty(value) || isEmail(value), 'Email không hợp lệ!']
      ]
    };
  };

  render() {
    const { register, initialValues, saveNewValue } = this.props;
    const {
      commonProps: {
        validate: { check }
      }
    } = Common;

    return (
      <Formik
        initialValues={initialValues}
        validate={check(this._generateValidateSchema)}
        onSubmit={values => {
          saveNewValue(values, () =>
            register({
              variables: { user: values }
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
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label className="login-form__label">Tên đăng nhập</Label>
              <Input
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                invalid={touched.username && !!errors.username}
              />
              <FormFeedback>{touched.username && errors.username}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label className="login-form__label">Tên hiển thị</Label>
              <Input
                type="text"
                name="displayName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.displayName}
                invalid={touched.displayName && !!errors.displayName}
              />
              <FormFeedback>
                {touched.displayName && errors.displayName}
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
            <FormGroup>
              <Label className="login-form__label">Nhập lại mật khẩu</Label>
              <Input
                type="password"
                name="confirm_password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirm_password}
                invalid={touched.confirm_password && !!errors.confirm_password}
              />
              <FormFeedback>
                {touched.confirm_password && errors.confirm_password}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Button
                color="primary"
                onClick={this._toggleCollapse}
                style={{ marginBottom: '1rem' }}
              >
                Thông tin khác
              </Button>
              <Collapse isOpen={this.state.collapse}>
                <FormGroup>
                  <Label className="login-form__label">Họ và tên đệm</Label>
                  <div className="position-relative">
                    <Input
                      type="text"
                      name="lastname"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastname}
                      invalid={touched.lastname && !!errors.lastname}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.lastname && errors.lastname}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Tên</Label>
                  <div className="position-relative">
                    <Input
                      type="text"
                      name="firstname"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstname}
                      invalid={touched.firstname && !!errors.firstname}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.firstname && errors.firstname}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Bút danh</Label>
                  <div className="position-relative">
                    <Input
                      type="text"
                      name="nickname"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nickname}
                      invalid={touched.nickname && !!errors.nickname}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.nickname && errors.nickname}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Địa chỉ email</Label>
                  <Input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    invalid={touched.email && !!errors.email}
                  />
                  <FormFeedback>{touched.email && errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Địa chỉ liên hệ</Label>
                  <div className="position-relative">
                    <Input
                      type="text"
                      name="address"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                      invalid={touched.address && !!errors.address}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.address && errors.address}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Điện thoại</Label>
                  <div className="">
                    <Input
                      type="text"
                      name="phoneNumber"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phoneNumber}
                      invalid={touched.phoneNumber && !!errors.phoneNumber}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.phoneNumber && errors.phoneNumber}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Số CMND</Label>
                  <div className="position-relative">
                    <Input
                      type="text"
                      name="identifyNumber"
                      className="user-form__input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.identifyNumber}
                      invalid={
                        touched.identifyNumber && !!errors.identifyNumber
                      }
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.identifyNumber && errors.identifyNumber}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Ngày sinh</Label>
                  <div className="position-relative">
                    <DatePicker
                      name="birthDate"
                      className="user-form__input"
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      value={values.birthDate}
                      invalid={touched.birthDate && !!errors.birthDate}
                    />
                    <span className="line" />
                  </div>
                  <FormFeedback>
                    {touched.birthDate && errors.birthDate}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="login-form__label">Giới tính</Label>
                  <RadioButtonGroup
                    id="gender"
                    className="login-form__radio"
                    value={values.gender}
                    error={errors.gender}
                    touched={touched.gender}
                  >
                    <Field
                      component={RadioButton}
                      name="gender"
                      id="MALE"
                      label="Nam"
                    />
                    <Field
                      component={RadioButton}
                      name="gender"
                      id="FEMALE"
                      label="Nữ"
                    />
                    <Field
                      component={RadioButton}
                      name="gender"
                      id="OTHERS"
                      label="Khác"
                    />
                  </RadioButtonGroup>
                </FormGroup>
              </Collapse>
            </FormGroup>
            <FormGroup className="note-description">
              <span className="note-text">
                Bằng việc nhấn vào đăng kí, bạn đã đồng ý với
                <span to="/" className="redirect-link">
                  Điều khoản sử dụng
                </span>{' '}
                và
                <span to="/" className="redirect-link">
                  Chính sách bảo mật
                </span>{' '}
                của <b>Bobia</b>
              </span>
            </FormGroup>
            <FormGroup>
              <Button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmitting}
              >
                Đăng ký
              </Button>
            </FormGroup>
            <FormGroup>
              <span className="note">
                Đã có tài khoản?
                <span
                  className="redirect-link"
                  onClick={this.props.toggleFlip()}
                >
                  Đăng nhập!
                </span>
              </span>
            </FormGroup>
          </Form>
        )}
      />
    );
  }
}

export default class RegisterModal extends PureComponent {
  state = {
    initialValues: {
      username: '',
      email: '',
      displayName: '',
      nickname: '',
      firstname: '',
      lastname: '',
      password: '',
      confirm_password: '',
      phoneNumber: '',
      address: '',
      birthDate: '',
      identifyNumber: '',
      gender: ''
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
          <Mutation mutation={mutation.register}>
            {(_handleRegister, { loading, error, data }) => {
              if (loading) {
                return <CommonLoading />;
              }

              if (error && error.networkError) {
                return <Page500 error={error.networkError} />;
              }

              if (data && data.register && data.register.success === true) {
                context.changeLoggedInState(
                  {
                    isLoggedIn: data.register.success,
                    banner: data.register.banner,
                    user: data.register.user
                  },
                  () => {
                    if (data.register.token && window.localStorage) {
                      window.localStorage.setItem('token', data.register.token);
                    }
                    notify.success('Đăng ký thành công!');
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
                        <RegisterForm
                          register={_handleRegister}
                          initialValues={this.state.initialValues}
                          saveNewValue={this._handleNewValue}
                          toggleFlip={context.toggleAuthenFlip}
                        />
                        {error &&
                        error.graphQLErrors &&
                        error.graphQLErrors.length > 0 ? (
                          <CommonMessage
                            type="error"
                            messages={error.graphQLErrors.map(error => {
                              return error.message.includes(
                                'duplicate key error'
                              )
                                ? 'Tên đăng nhập hoặc email đã tồn tại!'
                                : error.message;
                            })}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <LoginSocial {...this.props} />
                </>
              );
            }}
          </Mutation>
        )}
      </Subscribe>
    );
  }
}
