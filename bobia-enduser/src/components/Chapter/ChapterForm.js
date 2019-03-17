import React, { memo } from 'react';
import { Formik } from 'formik';
import {
  Button,
  Input,
  Label,
  Form,
  FormFeedback,
  FormGroup
} from 'reactstrap';
import { DropdownList, RichEditor } from 'components/common/Fields';
import Common from 'components/common';
import { RATING, RATING_OPTIONS, APPROVE_STATES } from 'constants/index';

function ChapterForm(props) {
  const {
    commonProps: {
      validate: {
        check,
        rules: { isEmpty }
      }
    },
    commonComps: { CommonConfirm }
  } = Common;

  let formAction;

  const _handleValidateSchema = () => {
    let outputSchema = {};

    if (formAction === 'save-draft') {
      outputSchema = {
        title: [[value => !isEmpty(value), 'Tiêu đề không được để trống!']]
      };
    }

    if (formAction === 'submit') {
      outputSchema = {
        newRating: [[value => !isEmpty(value), 'Chọn độ tuổi!']],
        title: [[value => !isEmpty(value), 'Tiêu đề không được để trống!']],
        content: [
          [value => !isEmpty(value), 'Nội dung chương không được để trống!']
        ]
      };
    }

    return outputSchema;
  };

  const _handleSubmit = (action, execSubmit) => {
    formAction = action;
    execSubmit();
  };

  const _handleBackToCreateBook = () => {
    const { formType } = props;
    // const { initialValues, formType } = props;
    // const _slugUser = initialValues.book.createdUser.slug;
    const _pathUpdateBook = props
      ? `/${props.initialValues.slugBook}/cap-nhat/sach`
      : '/';
    if (formType === 'UPDATE') {
      props.history.goBack();
      // props.history.push(`/nguoi-dung/${_slugUser}`);
    } else {
      props.history.push(`${_pathUpdateBook}`);
    }
  };

  return (
    <Formik
      initialValues={props.initialValues}
      validate={check(_handleValidateSchema)}
      onSubmit={values => {
        if (!values.newRating) {
          values.rating = RATING.G;
        } else if (typeof values.newRating === 'object') {
          values.rating = values.newRating.value;
        }

        if (formAction === 'save-draft') {
          values.state = APPROVE_STATES.DRAFT;
        }

        if (formAction === 'submit') {
          // values.state = APPROVE_STATES.PENDING;
          values.state = APPROVE_STATES.PUBLISHED;
        }

        props.onSaveNewValue(values, () =>
          props.onAction({
            variables: { chapter: values }
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
        setFieldTouched,
        submitForm
      }) => {
        return (
          <Form>
            <div className="form-write__content">
              <div className="form-write__taskbar">
                <div className="form-write__taskbar__level">
                  <Label className="form-label">Giới hạn độ tuổi</Label>
                  <DropdownList
                    name="rating"
                    saveName="newRating"
                    placeholder="Chọn độ tuổi"
                    options={RATING_OPTIONS}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    value={
                      values.newRating !== ''
                        ? values.newRating
                        : RATING_OPTIONS[0]
                    }
                    invalid={touched.newRating && !!errors.newRating}
                  />
                  <FormFeedback>
                    {touched.newRating && errors.newRating}
                  </FormFeedback>
                </div>
              </div>
              <Label className="form-label form-write__content__summary__title">
                Tiêu đề
              </Label>
              <FormGroup className="form-write__content__header">
                <Input
                  type="text"
                  name="title"
                  className="form-write__content__header__input"
                  placeholder="Đặt tiêu đề cho chương của bạn ..."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title || ''}
                  invalid={touched.title && !!errors.title}
                />
                <FormFeedback>{touched.title && errors.title}</FormFeedback>
              </FormGroup>
              <div className="form-write__content__summary">
                <Label className="form-label form-write__content__summary__title">
                  Nội dung
                </Label>
                <RichEditor
                  className="form-write__content__summary-editor"
                  name="content"
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  value={values.content}
                  placeholder="Viêt câu chuyện của bạn ..."
                />
                <FormFeedback>{touched.content && errors.content}</FormFeedback>
              </div>
            </div>
            {/* <div className="form-write__status">
              <span className="form-write__status__list">{values.state}</span>
            </div> */}
            <div className="form-write__submit">
              <div className="form-write__submit__group-left">
                <Button
                  className="btn btn-primary form-write__submit__btn"
                  onClick={async () => {
                    const confirmResult = await CommonConfirm({
                      message:
                        'Bạn chắc chắn muốn hủy bỏ việc viết chương? Mọi thông tin bạn nhập sẽ không được lưu lại',
                      confirmText: 'Đồng ý huỷ',
                      confirmColor: 'primary',
                      cancelText: 'Không',
                      cancelColor: 'danger'
                    });
                    confirmResult && _handleBackToCreateBook();
                  }}
                >
                  Huỷ
                </Button>
              </div>
              <div className="form-write__submit__group-right">
                <Button
                  className="btn btn-primary form-write__submit__btn"
                  disabled={isSubmitting}
                  onClick={() => _handleSubmit('save-draft', submitForm)}
                >
                  Lưu
                </Button>
                <Button
                  className="btn btn-highlight form-write__submit__btn"
                  onClick={() => _handleSubmit('submit', submitForm)}
                >
                  Đăng tải
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    />
  );
}

export default memo(ChapterForm);
