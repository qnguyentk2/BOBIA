import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
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
} from 'components/common/Fields';
import Common from 'components/common';
import { getServerDirectUrl } from 'utils';

export default class UserProfileForm extends PureComponent {
  state = {
    isDropdown: false
  };

  _handleDropdownToggle = () => {
    this.setState({
      isDropdown: !this.state.isDropdown
    });
  };

  _generateValidateSchema = values => {
    const {
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
    } = Common.commonProps;
    const {
      initialValues: { password }
    } = this.props;
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

  _handleRenderForm = props => {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldTouched,
      initialValues
    } = props;

    const classDropDownList = classNames({
      dropdown: true,
      open: this.state.isDropdown
    });

    const oldUsername = initialValues.username;
    const oldPassword = initialValues.password === 'true';

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

    const changeClasses = classNames('image-cover__change', {
      show: initialValues.profileUrl
    });

    return (
      <>
        <div className="user-title">
          <h2 className="user-title__title">Thông tin cá nhân</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="user-avatar">
            <div className="image-cover">
              <FileUpload
                type="image-single"
                name="profileUrl"
                className="image-cover__input"
                alt="upload avatar"
                placeholder="Upload ảnh đại diện"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                initialValue={getServerDirectUrl(initialValues.profileUrl)}
              />
              <div className={changeClasses}>
                <span className="image-cover__change__text">
                  Đổi{' '}
                  <span className="image-cover__change__text--uppercase">
                    avatar
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Row className="user-info">
            <Col sm="6 pd-right-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">
                  Tên đăng nhập{' '}
                  <span className="user-form__note">
                    {!oldUsername
                      ? '(không thể đổi sau khi đặt)'
                      : '(không thể đổi)'}
                  </span>
                </Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="username"
                    className="info-detail__input"
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
            <Col sm="6 pd-left-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">
                  Tên hiển thị{' '}
                  <span className="user-form__note">(gõ để tạo mới)</span>
                </Label>
                <div className="input-block">
                  <DropdownList
                    className={`custom-dropdown ${touched.newDisplayName &&
                      !!errors.newDisplayName &&
                      'is-invalid'}`}
                    name="displayName"
                    saveName="newDisplayName"
                    creatable={true}
                    formatCreateLabel={() => 'Đặt tên mới'}
                    options={displayNameOptions}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    value={values.newDisplayName}
                    invalid={touched.newDisplayName && !!errors.newDisplayName}
                  />
                  <span className="line" />
                </div>
                <FormFeedback>
                  {touched.newDisplayName && errors.newDisplayName}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6 pd-right-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Họ và tên đệm</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="lastname"
                    className="info-detail__input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastname || ''}
                    invalid={touched.lastname && !!errors.lastname}
                  />
                  <span className="line" />
                </div>
                <FormFeedback>
                  {touched.lastname && errors.lastname}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6 pd-left-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Tên</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="firstname"
                    className="info-detail__input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstname || ''}
                    invalid={touched.firstname && !!errors.firstname}
                  />
                  <span className="line" />
                </div>
                <FormFeedback>
                  {touched.firstname && errors.firstname}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6 pd-right-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Email</Label>
                <div className="input-block">
                  <Input
                    type="email"
                    name="email"
                    className="info-detail__input"
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
            <Col sm="6 pd-left-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Điện thoại</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="phoneNumber"
                    className="info-detail__input"
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
            <Col sm="6 pd-right-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Bút danh</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="nickname"
                    className="info-detail__input"
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
            <Col sm="6 pd-left-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Số CMND</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="identifyNumber"
                    className="info-detail__input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.identifyNumber || ''}
                    invalid={touched.identifyNumber && !!errors.identifyNumber}
                  />
                  <span className="line" />
                </div>
                <FormFeedback>
                  {touched.identifyNumber && errors.identifyNumber}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6 pd-right-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Địa chỉ liên hệ</Label>
                <div className="input-block">
                  <Input
                    type="text"
                    name="address"
                    className="info-detail__input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address || ''}
                    invalid={touched.address && !!errors.address}
                  />
                  <span className="line" />
                </div>
                <FormFeedback>{touched.address && errors.address}</FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6 pd-left-11">
              <FormGroup className="info-detail">
                <Label className="info-detail__label">Ngày sinh</Label>
                <div className="input-block date-picker">
                  <DatePicker
                    name="birthDate"
                    className="info-detail__input"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    value={values.birthDate}
                    invalid={touched.birthDate && !!errors.birthDate}
                  />
                  <i className="fa fa-calendar-alt date-picker__birthday-icon" />
                  <span className="line" />
                </div>
                <FormFeedback>
                  {touched.birthDate && errors.birthDate}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup className="info-detail gender-info">
                <Label className="info-detail__label">Giới tính:</Label>
                <RadioButtonGroup
                  id="gender"
                  className="info-detail__radio"
                  value={values.gender}
                  error={errors.gender}
                  touched={touched.gender}
                >
                  <Field
                    component={RadioButton}
                    name="gender"
                    id="FEMALE"
                    label="Nữ"
                  />
                  <Field
                    component={RadioButton}
                    name="gender"
                    id="MALE"
                    label="Nam"
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
            <Col sm="12">
              <FormGroup className="info-detail password-info">
                <Label
                  className="info-detail__label info-detail__label--main hidden-xs"
                  onClick={() => this._handleDropdownToggle()}
                >
                  Thay đổi mật khẩu
                </Label>
                <div className="input-block">
                  <div className={classDropDownList}>
                    <div className="row user-form__password">
                      <Col sm="6 pd-right-11">
                        <FormGroup className="info-detail">
                          <Label className="info-detail__label">
                            Mật khẩu cũ{' '}
                            {!oldPassword && (
                              <span className="user-form__note">
                                (không có, vui lòng bỏ qua)
                              </span>
                            )}
                          </Label>
                          <div className="input-block">
                            <Input
                              type="password"
                              name="oldPassword"
                              className="info-detail__input"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.oldPassword}
                              invalid={
                                touched.oldPassword && !!errors.oldPassword
                              }
                              disabled={oldPassword ? false : true}
                            />
                            <span className="line" />
                          </div>
                          <FormFeedback>
                            {touched.oldPassword && errors.oldPassword}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6 pd-left-11">
                        <FormGroup className="info-detail">
                          <Label className="info-detail__label">
                            Mật khẩu mới
                          </Label>
                          <div className="input-block">
                            <Input
                              type="password"
                              name="newPassword"
                              className="info-detail__input"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.newPassword}
                              invalid={
                                touched.newPassword && !!errors.newPassword
                              }
                            />
                            <span className="line" />
                          </div>
                          <FormFeedback>
                            {touched.newPassword && errors.newPassword}
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm="6 pd-right-11">
                        <FormGroup className="info-detail">
                          <Label className="info-detail__label">
                            Nhập lại mật khẩu mới
                          </Label>
                          <div className="input-block">
                            <Input
                              type="password"
                              name="confirm_newPassword"
                              className="info-detail__input"
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
                    </div>
                  </div>
                </div>
              </FormGroup>
            </Col>
            <Col sm="12">
              <div className="user-button">
                <Link to={`/`} className="btn btn-primary user-button__btn">
                  Hủy
                </Link>
                <Button
                  type="submit"
                  className="btn btn-highlight user-button__btn"
                  disabled={isSubmitting}
                >
                  Cập nhật
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  render() {
    const { updateProfile, initialValues, onSubmitForm } = this.props;
    const {
      validate: { check }
    } = Common.commonProps;

    return (
      <Formik
        initialValues={initialValues}
        validate={check(this._generateValidateSchema)}
        onSubmit={values => onSubmitForm(values, updateProfile)}
        render={props => this._handleRenderForm({ ...props, initialValues })}
      />
    );
  }
}
