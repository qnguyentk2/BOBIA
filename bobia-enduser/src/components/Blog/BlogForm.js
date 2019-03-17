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
import { DropdownList, FileUpload, RichEditor } from 'components/common/Fields';
import Common from 'components/common';
import { getServerDirectUrl } from 'utils';

function BlogForm(props) {
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
      newTopics: [[value => !isEmpty(value), 'Chọn ít nhất một chủ đề!']],
      title: [[value => !isEmpty(value), 'Tiêu đề không được để trống!']],
      content: [[value => !isEmpty(value), 'Nội dung không được để trống!']]
    };

    return outputSchema;
  };

  const _handleLoadTopics = (inputValue, callback) => {
    client
      .query({
        query: query.getAllTopics,
        variables: {
          filters: { name: inputValue },
          options: { limit: 0 }
        }
      })
      .then(({ data }) => {
        if (data && data.getAllTopics && data.getAllTopics.success === true) {
          callback(
            data.getAllTopics.topics.docs.map(el => ({
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
              alt="upload blog"
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
              placeholder="Đặt tiêu đề cho bài viết của bạn ..."
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
              placeholder="Viêt nội dung cho bài viết của bạn ..."
            />
            <FormFeedback>{touched.content && errors.content}</FormFeedback>
          </div>
        </div>
        <div className="form-write__taskbar">
          <div className="form-write__taskbar__topic mg-bottom">
            <Label className="form-label">Chủ đề</Label>
            <DropdownList
              className="form-write__taskbar__topic-container"
              name="topics"
              saveName="newTopics"
              placeholder="Chọn chủ đề"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              value={values.newTopics}
              invalid={touched.newTopics && !!errors.newTopics}
              async={true}
              loadOptions={_handleLoadTopics}
              isMulti
            />
            <FormFeedback>{touched.newTopics && errors.newTopics}</FormFeedback>
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
        </div>
        <div className="form-write__submit">
          <Button
            className="btn btn-primary form-write__submit__btn"
            onClick={async () => {
              const confirmResult = await CommonConfirm({
                message:
                  'Bạn chắc chắn muốn hủy bỏ việc viết bài? Mọi thông tin bạn nhập sẽ không được lưu lại',
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
        if (typeof values.newTopics === 'object') {
          values.topics = values.newTopics.map(el => el.value);
        }

        if (typeof values.newTags === 'object') {
          values.tags = values.newTags.map(el => el.label);
        }

        props.onSaveNewValue(values, () =>
          props.onAction({
            variables: { blog: values }
          })
        );
      }}
      render={_handleRenderForm}
    />
  );
}

export default memo(BlogForm);
