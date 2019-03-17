import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { Formik, Field } from 'formik';
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
import {
  DatePicker,
  RadioButtonGroup,
  RadioButton,
  DropdownList,
  FileUpload
} from '../common/Fields';
import Common from 'components/common';
import avatarDefaultUrl from 'assets/images/users/avatar-default.png';

class UpdateProfileForm extends Component {
  validateSchema = values => {
    const {
      initialValues: { password }
    } = this.props;

    const {
      commonProps: {
        validate: {
          rules: {
            isEmpty,
            isMatch,
            minLength,
            maxLength,
            isEmail,
            isUsername,
            hasNoSpace
          }
        }
      }
    } = Common;

    let outputSchema = {
      username: [
        [
          value =>
            !isEmpty(value) ||
            isEmpty(values.newPassword) ||
            !isEmpty(values.email),
          'Tên đăng nhập không được để trống!'
        ],
        [value => minLength(value, 5), 'Tên đăng nhập tối thiểu 5 ký tự!'],
        [value => maxLength(value, 25), 'Tên đăng nhập tối đa 25 ký tự!'],
        [value => isUsername(value), 'Tên đăng nhập không hợp lệ!']
      ],
      email: [
        [
          value =>
            !isEmpty(value) ||
            isEmpty(values.newPassword) ||
            !isEmpty(values.username),
          'Email không được để trống!'
        ],
        [value => isEmpty(value) || isEmail(value), 'Email không hợp lệ!']
      ],
      oldPassword: [
        [
          value => minLength(value, 8) || isEmpty(value),
          'Mật khẩu cũ tối thiểu 8 ký tự!'
        ],
        [value => maxLength(value, 25), 'Mật khẩu cũ tối đa 25 ký tự!'],
        [
          value => hasNoSpace(value) || isEmpty(value),
          'Mật khẩu cũ không được có khoảng trắng!'
        ]
      ],
      newPassword: [
        [
          value => minLength(value, 8) || isEmpty(value),
          'Mật khẩu mới tối thiểu 8 ký tự!'
        ],
        [value => maxLength(value, 25), 'Mật khẩu mới tối đa 25 ký tự!'],
        [
          value => hasNoSpace(value) || isEmpty(value),
          'Mật khẩu mới không được có khoảng trắng!'
        ]
      ],
      confirm_newPassword: [
        [
          value => minLength(value, 8) || isEmpty(value),
          'Mật khẩu xác nhận tối thiểu 8 ký tự!'
        ],
        [value => maxLength(value, 25), 'Mật khẩu xác nhận tối đa 25 ký tự!'],
        [
          value => hasNoSpace(value) || isEmpty(value),
          'Mật khẩu xác nhận không được có khoảng trắng!'
        ],
        [
          value => isMatch(value, values.newPassword) || isEmpty(value),
          'Mật khẩu xác nhận không trùng khớp!'
        ]
      ]
    };

    if (password !== 'true') {
      outputSchema.newPassword.unshift([
        value =>
          (!isEmpty(value) || isEmpty(values.username)) &&
          (!isEmpty(value) || isEmpty(values.email)),
        'Mật khẩu mới không được để trống!'
      ]);
    }

    return outputSchema;
  };

  render() {
    const { updateProfile, initialValues, saveNewValue } = this.props;

    const {
      commonProps: {
        validate: { check }
      }
    } = Common;

    const oldUsername = initialValues.username;
    const oldPassword = initialValues.password === 'true';

    return (
      <Formik
        initialValues={initialValues}
        validate={check(this.validateSchema)}
        onSubmit={values => {
          if (typeof values.newDisplayName === 'object') {
            values.displayName = values.newDisplayName.value;
          }

          saveNewValue(values, () =>
            updateProfile({
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
        }) => {
          let displayNameOptions = [];
          // if (values.displayName) {
          //   if (typeof values.displayName === 'object') {
          //     displayNameOptions.push(values.displayName);
          //   } else {
          //     displayNameOptions.push({
          //       value: values.displayName,
          //       label: `${values.displayName} (tên hiển thị)`
          //     });
          //   }
          // }

          if (values.displayName) {
            displayNameOptions.push({
              value: values.displayName,
              label: `${values.displayName} (tên hiển thị)`
            });
          }

          if (values.nickname) {
            displayNameOptions.push({
              value: values.nickname,
              label: `${values.nickname} (bút danh)`
            });
          }

          if (values.firstname && values.lastname) {
            displayNameOptions.push({
              value: `${values.lastname} ${values.firstname}`,
              label: `${values.lastname} ${values.firstname} (tên thật)`
            });
          }

          return (
            <Form onSubmit={handleSubmit}>
              <div className="user-avatar">
                <span className="user-avatar__title">Quản lý tài khoản</span>
                <div className="user-avatar__block">
                  <FileUpload
                    type="image-single"
                    name="profileUrl"
                    className="user-avatar__block__input"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    initialValue={values.profileUrl}
                  />
                  <div className="user-avatar__block__upload">
                    <span className="user-avatar__block__text">Đổi avatar</span>
                  </div>
                </div>
              </div>
              <Row>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">
                      Tên đăng nhập{' '}
                      <span style={{ color: 'red' }}>
                        {!oldUsername
                          ? '(không thể đổi sau khi đặt)'
                          : '(không thể đổi)'}
                      </span>
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="username"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username || ''}
                        invalid={touched.username && !!errors.username}
                        disabled={oldUsername ? true : false}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.username && errors.username}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">
                      Tên hiển thị{' '}
                      <span style={{ color: 'red' }}>(gõ để tạo mới)</span>
                    </Label>
                    <div className="position-relative">
                      <DropdownList
                        name="displayName"
                        saveName="newDisplayName"
                        creatable={true}
                        promptTextCreator={() => 'Đặt tên mới'}
                        options={displayNameOptions}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        value={values.newDisplayName}
                        invalid={
                          touched.newDisplayName && !!errors.newDisplayName
                        }
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.newDisplayName && errors.newDisplayName}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Họ và tên đệm</Label>
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
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Địa chỉ email</Label>
                    <div className="position-relative">
                      <Input
                        type="email"
                        name="email"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email || ''}
                        invalid={touched.email && !!errors.email}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>{touched.email && errors.email}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Tên</Label>
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
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Điện thoại</Label>
                    <div className="">
                      <Input
                        type="text"
                        name="phoneNumber"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phoneNumber || ''}
                        invalid={touched.phoneNumber && !!errors.phoneNumber}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.phoneNumber && errors.phoneNumber}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Bút danh</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="nickname"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nickname || ''}
                        invalid={touched.nickname && !!errors.nickname}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.nickname && errors.nickname}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Số CMND</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="identifyNumber"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.identifyNumber || ''}
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
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">
                      Mật khẩu cũ{' '}
                      {!oldPassword && (
                        <span style={{ color: 'red' }}>
                          (không có, vui lòng bỏ qua)
                        </span>
                      )}
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="password"
                        name="oldPassword"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.oldPassword}
                        invalid={touched.oldPassword && !!errors.oldPassword}
                        disabled={oldPassword ? false : true}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.oldPassword && errors.oldPassword}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Địa chỉ liên hệ</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="address"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address || ''}
                        invalid={touched.address && !!errors.address}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.address && errors.address}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Mật khẩu mới</Label>
                    <div className="position-relative">
                      <Input
                        type="password"
                        name="newPassword"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newPassword}
                        invalid={touched.newPassword && !!errors.newPassword}
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.newPassword && errors.newPassword}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Ngày sinh</Label>
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
                </Col>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">
                      Nhập lại mật khẩu mới
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="password"
                        name="confirm_newPassword"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirm_newPassword}
                        invalid={
                          touched.confirm_newPassword &&
                          !!errors.confirm_newPassword
                        }
                      />
                      <span className="line" />
                    </div>
                    <FormFeedback>
                      {touched.confirm_newPassword &&
                        errors.confirm_newPassword}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Giới tính</Label>
                    <RadioButtonGroup
                      id="gender"
                      className="user-form__radio"
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
                </Col>
              </Row>
              <FormGroup className="text-right">
                <Link
                  to={`/`}
                  className="btn btn-black-invert user-form__button"
                >
                  Hủy
                </Link>
                <Button
                  type="submit"
                  className="btn btn-submit user-form__button"
                  disabled={isSubmitting}
                >
                  Cập nhật
                </Button>
              </FormGroup>
            </Form>
          );
        }}
      />
    );
  }
}

class UpdateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: {
        username: '',
        lastname: '',
        displayName: '',
        newDisplayName: '',
        nickname: '',
        firstname: '',
        email: '',
        oldPassword: '',
        phoneNumber: '',
        newPassword: '',
        address: '',
        confirm_newPassword: '',
        birthDate: '',
        identifyNumber: '',
        gender: '',
        profileUrl: ''
      }
    };
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  mergeNewState = user => {
    let newState = Object.assign({}, this.state.initialValues);
    if (user) {
      if (user.displayName) {
        newState.displayName = user.displayName;
      }
      if (user.profileUrl) {
        newState.profileUrl = user.profileUrl;
      }
    }
    return newState;
  };

  render() {
    const { match, refreshHeader } = this.props;

    const {
      commonProps: {
        queries: { query, mutation },
        notify,
        validate
      },
      commonComps: { CommonLoading, CommonRedirect, CommonMessage, Page500 }
    } = Common;

    return (
      <Query query={query.getUser} variables={{ slug: match.params.slug }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 />;
          }
          if (data && data.getUser && data.getUser.success === true) {
            const user = data.getUser.user;
            return (
              <div className="user-profile">
                <div className="container">
                  <div className="user-detail">
                    <React.Fragment>
                      <Mutation
                        mutation={mutation.updateProfile}
                        onCompleted={data => {
                          notify.success(
                            'Cập nhật thông tin người dùng thành công!'
                          );
                          refreshHeader(
                            this.mergeNewState(data.updateProfile.user)
                          );
                        }}
                      >
                        {(updateProfile, { loading, error, data }) => {
                          if (loading) {
                            return <CommonLoading />;
                          }
                          if (error && error.networkError) {
                            return <Page500 />;
                          }
                          if (
                            data &&
                            data.updateProfile &&
                            data.updateProfile.success === true
                          ) {
                            return (
                              <div className="user-form">
                                <UpdateProfileForm
                                  updateProfile={updateProfile}
                                  validate={validate}
                                  initialValues={this.mergeNewState(
                                    data.updateProfile.user
                                  )}
                                  saveNewValue={this.handleNewValue}
                                />
                              </div>
                            );
                          }

                          let userInit = Object.assign({}, user);
                          if (!userInit.profileUrl) {
                            userInit.profileUrl = avatarDefaultUrl;
                          }

                          if (userInit.displayName) {
                            userInit.newDisplayName = userInit.displayName;
                          }

                          return (
                            <div className="user-form">
                              <UpdateProfileForm
                                updateProfile={updateProfile}
                                validate={validate}
                                initialValues={userInit}
                                saveNewValue={this.handleNewValue}
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
                                      ? 'Email đã tồn tại!'
                                      : error.message;
                                  })}
                                />
                              ) : null}
                            </div>
                          );
                        }}
                      </Mutation>
                    </React.Fragment>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <CommonRedirect redirectTo="/login" message="Chưa đăng nhập" />
          );
        }}
      </Query>
    );
  }
}
export default UpdateProfile;
