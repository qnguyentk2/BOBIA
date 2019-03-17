import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
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
  DropdownList
} from '../common/Fields';
import Common from 'components/common';

class ManagementForm extends Component {
  constructor(props) {
    super(props);

    this.loadRoles = this.loadRoles.bind(this);

    this.state = {
      roleList: []
    };
  }

  validateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: { isEmpty, isEmail, minLength, maxLength, isUsername }
        }
      }
    } = Common;

    let outputSchema = {
      username: [
        [value => !isEmpty(value), 'Tên đăng nhập không được để trống!'],
        [value => minLength(value, 6), 'Tên đăng nhập tối thiểu 6 ký tự!'],
        [value => maxLength(value, 25), 'Tên đăng nhập tối đa 25 ký tự!'],
        [value => isUsername(value), 'Tên đăng nhập không hợp lệ!']
      ],
      newDisplayName: [
        [value => !isEmpty(value), 'Tên hiển thị không được để trống!']
      ],
      email: [
        [value => !isEmpty(value), 'Email không được để trống!'],
        [value => !isEmpty(value) || isEmail(value), 'Email không hợp lệ!']
      ]
    };

    return outputSchema;
  };

  loadRoles(inputValue, callback) {
    const {
      client,
      commonProps: {
        queries: { query }
      }
    } = Common;

    client
      .query({
        query: query.getAllRoles,
        variables: {
          filters: { name: inputValue },
          options: { limit: 0 }
        }
      })
      .then(({ data }) => {
        if (data && data.getAllRoles && data.getAllRoles.success === true) {
          const roleList = data.getAllRoles.roles.docs.map(el => ({
            label: el.name,
            value: el.id.toString()
          }));
          this.setState({ roleList }, () => callback(roleList));
        }
      });
  }

  resetPassword(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.resetPassword,
        variables: {
          userId: id
        }
      })
      .then(
        ({ data }) =>
          data &&
          data.resetPassword &&
          data.resetPassword.success === true &&
          notify.success('Đặt lại mật khẩu thành công!')
      );
  }

  render() {
    const {
      saveUser,
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
          if (typeof values.newDisplayName === 'object') {
            values.displayName = values.newDisplayName.value;
          }

          if (typeof values.newRoleId === 'object') {
            values.roleId = parseInt(values.newRoleId.value, 10);
          }

          saveNewValue(values, () =>
            saveUser({
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

          const roleList = this.state.roleList;

          if (
            values.newRoleId &&
            typeof values.newRoleId !== 'object' &&
            roleList.length > 0
          ) {
            values.newRoleId = roleList.filter(
              el => el.value === values.newRoleId.toString()
            )[0];
          }

          return (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Tên đăng nhập</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="username"
                        className="user-form__input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username || ''}
                        invalid={touched.username && !!errors.username}
                        isDisabled={values.username === 'superadmin'}
                      />
                      <FormFeedback>
                        {touched.username && errors.username}
                      </FormFeedback>
                    </div>
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
                        className={`custom-dropdown ${touched.newDisplayName &&
                          !!errors.newDisplayName &&
                          'is-invalid'}`}
                        name="displayName"
                        saveName="newDisplayName"
                        creatable={true}
                        formatCreateLabel={() => 'Đặt tên mới'}
                        options={displayNameOptions}
                        noOptionsMessage={() => 'Không có lựa chọn'}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        value={values.newDisplayName}
                        placeholder="Nhập hoặc chọn tên hiển thị"
                        isClearable={true}
                        invalid={
                          touched.newDisplayName && !!errors.newDisplayName
                        }
                      />
                      <FormFeedback>
                        {touched.newDisplayName && errors.newDisplayName}
                      </FormFeedback>
                    </div>
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
                        value={values.lastname || ''}
                        invalid={touched.lastname && !!errors.lastname}
                      />
                      <FormFeedback>
                        {touched.lastname && errors.lastname}
                      </FormFeedback>
                    </div>
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
                      <FormFeedback>
                        {touched.email && errors.email}
                      </FormFeedback>
                    </div>
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
                        value={values.firstname || ''}
                        invalid={touched.firstname && !!errors.firstname}
                      />
                      <FormFeedback>
                        {touched.firstname && errors.firstname}
                      </FormFeedback>
                    </div>
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
                      <FormFeedback>
                        {touched.phoneNumber && errors.phoneNumber}
                      </FormFeedback>
                    </div>
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
                      <FormFeedback>
                        {touched.nickname && errors.nickname}
                      </FormFeedback>
                    </div>
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
                      <FormFeedback>
                        {touched.identifyNumber && errors.identifyNumber}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                {mode !== 'create' && (
                  <Col sm="6 pd-right-10">
                    <FormGroup>
                      <Label className="user-form__label">Mật khẩu</Label>
                      <div className="position-relative">
                        <Button
                          outline
                          color="warning"
                          onClick={async () => {
                            const confirmResult = await this.props.commonComps.CommonConfirm(
                              {
                                message:
                                  'Bạn muốn đặt lại mật khẩu của người dùng này?',
                                confirmText: 'Đặt lại',
                                confirmColor: 'primary',
                                cancelText: 'Không',
                                cancelColor: 'danger'
                              }
                            );
                            confirmResult &&
                              this.resetPassword(initialValues.id);
                          }}
                        >
                          <i className="fa fa-refresh" /> Đặt lại mật khẩu
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                )}
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
                      <FormFeedback>
                        {touched.address && errors.address}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-right-10">
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
                      <FormFeedback>
                        {touched.birthDate && errors.birthDate}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6 pd-left-10">
                  <FormGroup>
                    <Label className="user-form__label">Giới tính</Label>
                    <RadioButtonGroup
                      id="gender"
                      className="user-form__radio"
                      containerClassName="form-check form-check-inline"
                      inputClassName="form-check-input"
                      labelClassName="form-check-label"
                      value={values.gender}
                      error={errors.gender}
                      touched={touched.gender}
                      inline={true}
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
                <Col sm="6 pd-right-10">
                  <FormGroup>
                    <Label className="user-form__label">Quyền</Label>
                    <div className="position-relative">
                      <DropdownList
                        className="create-book__category-container"
                        name="roleId"
                        saveName="newRoleId"
                        placeholder="Chọn quyền"
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        value={values.newRoleId}
                        invalid={touched.newRoleId && !!errors.newRoleId}
                        isDisabled={values.username === 'superadmin'}
                        async={true}
                        loadOptions={this.loadRoles}
                      />
                      <FormFeedback>
                        {touched.newRoleId && errors.newRoleId}
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
          username: '',
          lastname: '',
          displayName: '',
          newDisplayName: '',
          nickname: '',
          firstname: '',
          email: '',
          phoneNumber: '',
          address: '',
          birthDate: '',
          identifyNumber: '',
          gender: '',
          roleId: '',
          newRoleId: ''
        }
      };
    } else {
      this.state = {
        initialValues: {
          ...this.props.userData
        }
      };
    }
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
    }
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
        mutation={mode === 'create' ? mutation.createUser : mutation.updateUser}
        onCompleted={data => {
          mode === 'create'
            ? notify.success('Tạo người dùng thành công!')
            : notify.success('Chỉnh sửa người dùng thành công!');
          closeModal();
          refresh();
        }}
      >
        {(saveUser, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 />;
          }
          return (
            <div className="user-form">
              <ManagementForm
                saveUser={saveUser}
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
