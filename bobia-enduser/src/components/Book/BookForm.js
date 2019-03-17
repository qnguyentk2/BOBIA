import React, { memo } from 'react';
import { Formik } from 'formik';
import {
  RATING,
  RATING_OPTIONS,
  BOOK_TYPE,
  BOOK_STATUS_OPTION,
  BOOK_STATUS
} from 'constants/index';
import {
  Button,
  Input,
  Label,
  Form,
  FormFeedback,
  FormGroup
} from 'reactstrap';
import {
  DropdownList,
  SingleCheckbox,
  FileUpload,
  RichEditor
} from 'components/common/Fields';
import Common from 'components/common';
import { getServerDirectUrl } from 'utils';

function BookForm(props) {
  const {
    commonProps: {
      queries: { query },
      validate: {
        check,
        rules: { isEmpty }
      },
      notify
    },
    commonComps: { CommonConfirm },
    client
  } = Common;

  const _handleValidateSchema = () => {
    let outputSchema = {
      newCategories: [[value => !isEmpty(value), 'Chọn ít nhất một thể loại!']],
      newRating: [[value => !isEmpty(value), 'Chọn độ tuổi!']],
      // newTags: [[value => !isEmpty(value), 'Chọn ít nhất một tag!']],
      title: [[value => !isEmpty(value), 'Tiêu đề không được để trống!']],
      summary: [
        [value => !isEmpty(value), 'Lời giới thiệu không được để trống!']
      ],
      newStatus: [[value => !isEmpty(value), 'Chọn trạng thái!']]
    };

    return outputSchema;
  };

  const _handleLoadCategories = (inputValue, callback) => {
    client
      .query({
        query: query.getAllCategories,
        variables: {
          filters: { name: inputValue },
          options: { limit: 0 }
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.getAllCategories &&
          data.getAllCategories.success === true
        ) {
          callback(
            data.getAllCategories.categories.docs.map(el => ({
              label: el.name,
              value: el.id.toString()
            }))
          );
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          notify.error(error.graphQLErrors[0].message);
        }
      });
  };

  const _handleLoadTags = (inputValue, callback) => {
    client
      .query({
        query: query.getAllTags,
        variables: {
          filters: { name: inputValue },
          options: { limit: 0 }
        }
      })
      .then(({ data }) => {
        if (data && data.getAllTags && data.getAllTags.success === true) {
          callback(
            data.getAllTags.tags.docs.map(el => ({
              label: el.name,
              value: el.id.toString()
            }))
          );
        }
      })
      .catch(error => {
        if (error.networkError) {
          notify.error('Lỗi kết nối, xin vui lòng thử lại!');
        } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          notify.error(error.graphQLErrors[0].message);
        }
      });
  };

  const _handleRenderForm = formProps => {
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
      submitForm
    } = formProps;
    return (
      <Form onSubmit={handleSubmit}>
        <div className="form-write__image">
          <div className="image-cover">
            <FileUpload
              type="image-single"
              name="coverPage"
              className="image-cover__input"
              alt="upload book"
              placeholder="Upload ảnh bìa"
              coverSize="189 x 235"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              initialValue={getServerDirectUrl(values.coverPage)}
            />
          </div>
        </div>
        <div className="form-write__content">
          <Label className="form-label form-write__content__summary__title">
            Tiêu đề
          </Label>
          <FormGroup className="form-write__content__header">
            <Input
              type="text"
              name="title"
              maxLength="100"
              className="form-write__content__header__input"
              placeholder="Đặt tiêu đề cho tác phẩm của bạn ..."
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title || ''}
              invalid={touched.title && !!errors.title}
            />
            <FormFeedback>{touched.title && errors.title}</FormFeedback>
          </FormGroup>
          <div className="form-write__content__summary">
            <Label className="form-label form-write__content__summary__title">
              Mô tả
            </Label>
            <RichEditor
              className="form-write__content__summary-editor"
              name="summary"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={values.summary}
              placeholder="Viêt mô tả cho tác phẩm của bạn ..."
            />
            <FormFeedback>{touched.summary && errors.summary}</FormFeedback>
          </div>
        </div>
        <div className="form-write__taskbar">
          <div className="form-write__taskbar__category mg-bottom">
            <Label className="form-label">Thể loại</Label>
            <DropdownList
              className="form-write__taskbar__category-container"
              name="categories"
              saveName="newCategories"
              placeholder="Chọn thể loại"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={values.newCategories}
              invalid={touched.newCategories && !!errors.newCategories}
              async={true}
              loadOptions={_handleLoadCategories}
              isMulti
            />
            <FormFeedback>
              {touched.newCategories && errors.newCategories}
            </FormFeedback>
          </div>
          <div className="form-write__taskbar__level mg-bottom">
            <Label className="form-label">Giới hạn độ tuổi</Label>
            <DropdownList
              name="rating"
              saveName="newRating"
              placeholder="Chọn độ tuổi"
              options={RATING_OPTIONS}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={
                values.newRating !== '' ? values.newRating : RATING_OPTIONS[0]
              }
              invalid={touched.newRating && !!errors.newRating}
            />
            <FormFeedback>{touched.newRating && errors.newRating}</FormFeedback>
          </div>
          <div className="form-write__taskbar__tag mg-bottom">
            <Label className="form-label">Tag</Label>
            <DropdownList
              className="form-write__taskbar__tag-container"
              name="tags"
              saveName="newTags"
              formatCreateLabel={() => 'Tạo tag mới'}
              placeholder="Chọn hoặc tạo tag"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={values.newTags}
              invalid={touched.newTags && !!errors.newTags}
              creatable={true}
              isMulti
              async={true}
              loadOptions={_handleLoadTags}
            />
            <FormFeedback>{touched.newTags && errors.newTags}</FormFeedback>
          </div>
          <div className="form-write__taskbar__status mg-bottom">
            <Label className="form-label">Trạng thái</Label>
            <DropdownList
              name="status"
              saveName="newStatus"
              placeholder="Chọn trạng thái"
              options={BOOK_STATUS_OPTION}
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={
                values.newStatus !== ''
                  ? values.newStatus
                  : BOOK_STATUS_OPTION[0]
              }
              invalid={touched.newStatus && !!errors.newStatus}
            />
            <FormFeedback>{touched.newStatus && errors.newStatus}</FormFeedback>
          </div>
          <span className="form-write__taskbar__one-shot">
            <SingleCheckbox
              id="bookType"
              name="type"
              className="radio-button"
              value={values.type}
              checkifequal={BOOK_TYPE.ONE_SHOT}
              onChange={handleChange}
              onBlur={handleBlur}
              label="One shot"
            />
          </span>
        </div>
        <div className="form-write__submit">
          <Button
            className="btn btn-primary form-write__submit__btn"
            onClick={async () => {
              const confirmResult = await CommonConfirm({
                message:
                  'Bạn chắc chắn muốn hủy bỏ việc viết truyện? Mọi thông tin bạn nhập sẽ không được lưu lại',
                confirmText: 'Đồng ý huỷ',
                confirmColor: 'primary',
                cancelText: 'Không',
                cancelColor: 'danger'
              });
              confirmResult && props.history.goBack();
            }}
          >
            Huỷ
          </Button>
          <Button
            className="btn btn-highlight form-write__submit__btn"
            disabled={isSubmitting}
            onClick={submitForm}
          >
            Lưu
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={props.initialValues}
      validate={check(_handleValidateSchema)}
      onSubmit={values => {
        if (typeof values.newCategories === 'object') {
          values.categories = values.newCategories.map(el => el.value);
        }

        if (!values.newRating) {
          values.rating = RATING.G;
        } else if (typeof values.newRating === 'object') {
          values.rating = values.newRating.value;
        }

        if (typeof values.newTags === 'object') {
          values.tags = values.newTags.map(el => el.label);
        }

        if (!values.newStatus) {
          values.status = BOOK_STATUS.ONGOING;
        } else if (typeof values.newStatus === 'object') {
          values.status = values.newStatus.value;
        }

        if (values.type && values.type === true) {
          values.type = BOOK_TYPE.ONE_SHOT;
        } else {
          values.type = BOOK_TYPE.LONG_STORY;
        }

        props.onSaveNewValue(values, () =>
          props.onAction({
            variables: { book: values }
          })
        );
      }}
      render={_handleRenderForm}
    />
  );
}

export default memo(BookForm);
