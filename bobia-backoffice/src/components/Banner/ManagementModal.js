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
import { Link } from 'react-router-dom';
import { FileUpload, ColorPicker } from '../common/Fields';
import bannerDefaultUrl from 'assets/images/banner.jpg';
import { invertColor } from 'utils/formatter';

class ManagementForm extends Component {
  renderBannerContent = bannerData => {
    return (
      <div
        className="Banner"
        style={{
          backgroundImage: `url(${
            bannerData && bannerData.bannerUrl
              ? bannerData.bannerUrl
              : bannerDefaultUrl
          })`
        }}
      >
        <div className="Banner-content">
          <div className="Banner-description">
            <h2
              className="Banner-description__title"
              style={{ color: bannerData.titleColor }}
            >
              {bannerData ? bannerData.title : 'CHÀO MỪNG ĐẾN VỚI BOBIA'}
            </h2>
            <span
              className="Banner-description__sub-title"
              style={{ color: bannerData.contentColor }}
            >
              {bannerData
                ? bannerData.content
                : 'Bobia là mạng xã hội cung cấp môi trường trực tuyến cho các cây bút trẻ sáng tác, đọc, trau dồi kỹ năng. Bobia là đại lý về bản quyền giữa các tác giả và các bên khai thác.'}
            </span>
          </div>
          <div className="Banner-button">
            <Link
              to="/"
              className="btn Banner-button__btn"
              style={{
                border: `1px solid ${bannerData.ctaColor}`,
                background: 'transparent',
                color: `${bannerData.ctaColor}`
              }}
            >
              {bannerData.cta}
            </Link>
          </div>
        </div>
        <button
          className="btn btn-transparent Banner__btn"
          onClick={this.toggleModal}
        >
          <i className="ico ico-chevron-up Banner__btn__arrow-up" />
        </button>
      </div>
    );
  };

  validateSchema = values => {
    const {
      commonProps: {
        validate: {
          rules: { isEmpty }
        }
      }
    } = Common;

    let outputSchema = {
      name: [[value => !isEmpty(value), 'Tên banner không được để trống!']],
      title: [[value => !isEmpty(value), 'Tiêu đề không được để trống!']],
      content: [[value => !isEmpty(value), 'Nội dung không được để trống!']],
      cta: [[value => !isEmpty(value), 'Tên CTA không được để trống!']],
      ctaLink: [
        [value => !isEmpty(value), 'Đường dẫn CTA không được để trống!']
      ]
    };

    return outputSchema;
  };

  render() {
    const {
      saveBanner,
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
            saveBanner({
              variables: { banner: values }
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
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Tên banner</Label>
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
                <Col sm="4">
                  <FileUpload
                    type="image-single"
                    name="bannerUrl"
                    className="banner__block__input"
                    imageClassName="banner__block__img"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    initialValue={values.bannerUrl}
                  />
                  <div className="banner__block__upload">
                    <span className="banner__block__text">Đổi banner</span>
                  </div>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Tên CTA</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="cta"
                        className="user-form__input"
                        style={{
                          color: values.ctaColor,
                          backgroundColor: invertColor(values.ctaColor, true)
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.cta || ''}
                        invalid={touched.cta && !!errors.cta}
                      />
                      <FormFeedback>{touched.cta && errors.cta}</FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Tiêu đề</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="title"
                        className="user-form__input"
                        style={{
                          color: values.titleColor,
                          backgroundColor: invertColor(values.titleColor, true)
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title || ''}
                        invalid={touched.title && !!errors.title}
                      />
                      <FormFeedback>
                        {touched.title && errors.title}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Nội dung</Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="content"
                        className="user-form__input"
                        style={{
                          color: values.contentColor,
                          backgroundColor: invertColor(
                            values.contentColor,
                            true
                          )
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content || ''}
                        invalid={touched.content && !!errors.content}
                      />
                      <FormFeedback>
                        {touched.content && errors.content}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">
                      Đường dẫn CTA (trừ tên miền)
                    </Label>
                    <div className="position-relative">
                      <Input
                        type="text"
                        name="ctaLink"
                        className="user-form__input"
                        style={{
                          color: values.ctaColor,
                          backgroundColor: invertColor(values.ctaColor, true)
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.ctaLink || ''}
                        invalid={touched.ctaLink && !!errors.ctaLink}
                      />
                      <FormFeedback>
                        {touched.ctaLink && errors.ctaLink}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Màu tiêu đề</Label>
                    <div className="position-relative">
                      <ColorPicker
                        name="titleColor"
                        color={values.titleColor}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Màu nội dung</Label>
                    <div className="position-relative">
                      <ColorPicker
                        name="contentColor"
                        color={values.contentColor}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <Label className="user-form__label">Màu CTA</Label>
                    <div className="position-relative">
                      <ColorPicker
                        name="ctaColor"
                        color={values.ctaColor}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <FormGroup>
                    <Label className="user-form__label">Xem trước</Label>
                    <div className="position-relative">
                      {this.renderBannerContent(values)}
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
          title: '',
          titleColor: '#000000',
          content: '',
          contentColor: '#000000',
          cta: '',
          ctaLink: '',
          ctaColor: '#000000',
          bannerUrl: ''
        }
      };
    } else {
      this.state = {
        initialValues: {
          ...this.props.bannerData
        }
      };
    }
  }

  handleNewValue = (values, callback) => {
    this.setState({ initialValues: values }, callback);
  };

  mergeNewState = banner => {
    let newState = Object.assign({}, this.state.initialValues);

    if (banner) {
      newState.bannerUrl = banner.bannerUrl || bannerDefaultUrl;
      newState.titleColor = banner.titleColor || '#000000';
      newState.contentColor = banner.contentColor || '#000000';
      newState.ctaColor = banner.ctaColor || '#000000';
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
        mutation={
          mode === 'create' ? mutation.createBanner : mutation.updateBanner
        }
        onCompleted={data => {
          mode === 'create'
            ? notify.success('Tạo banner thành công!')
            : notify.success('Chỉnh sửa banner thành công!');
          closeModal();
          refresh();
        }}
      >
        {(saveBanner, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 />;
          }
          return (
            <div className="user-form">
              <ManagementForm
                saveBanner={saveBanner}
                validate={validate}
                initialValues={this.mergeNewState(this.state.initialValues)}
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
