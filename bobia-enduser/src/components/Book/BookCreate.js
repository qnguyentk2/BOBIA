import _ from 'lodash';
import React, { memo } from 'react';
import { Mutation } from 'react-apollo';
import bookDefaultUrl from 'assets/images/users/avatar-default.png';
import BookForm from 'components/Book/BookForm';
import Common from 'components/common';
import { UrlHelper } from 'helpers/index';

function BookCreate(props) {
  const {
    commonProps: {
      queries: { mutation },
      notify
    },
    commonComps: { CommonConfirm, CommonLoading, CommonMessage, Page500 }
  } = Common;

  const bookCreateSuccess = async slug => {
    const confirmResult = await CommonConfirm({
      title: '',
      message: 'Vui lòng chọn',
      confirmText: 'Về trang quản lý',
      confirmColor: 'primary',
      cancelText: 'Tiếp tục tạo chương',
      cancelColor: 'success'
    });

    if (confirmResult === true) {
      props.history.push(
        UrlHelper.getUrlUserDetail({ slugUser: props.userSlug })
      );
    } else {
      props.history.push(UrlHelper.getUrlChapterCreate({ slugBook: slug }));
    }
  };

  return (
    <div className="write-book">
      <Mutation
        mutation={mutation.createBook}
        onCompleted={data => {
          const _slug = _.get(data, `createBook.book.slug`, '');

          if (data && data.createBook && data.createBook.success === true) {
            notify.success('Tạo tác phẩm mới thành công!');
            bookCreateSuccess(_slug);
          }
        }}
      >
        {(_handleCreateBook, { loading, error, data }) => {
          if (loading) {
            return <CommonLoading />;
          }
          if (error && error.networkError) {
            return <Page500 error={error.networkError} />;
          }
          if (data && data.createBook && data.createBook.success === true) {
            return (
              <div className="form-write">
                <BookForm
                  onAction={_handleCreateBook}
                  initialValues={props.onMergeNewState(data.createBook.book)}
                  {...props}
                />
              </div>
            );
          }

          let bookInit = props.book
            ? Object.assign({}, props.book)
            : { ...props.initialValues };

          if (!bookInit.coverPage) {
            bookInit.coverPage = bookDefaultUrl;
          }

          return (
            <div className="form-write">
              <BookForm
                onAction={_handleCreateBook}
                initialValues={bookInit}
                {...props}
              />
              {error &&
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 ? (
                <CommonMessage
                  type="error"
                  messages={error.graphQLErrors.map(error => {
                    return error.message.includes('duplicate key error')
                      ? 'Sách này đã tồn tại!'
                      : error.message;
                  })}
                />
              ) : null}
            </div>
          );
        }}
      </Mutation>
    </div>
  );
}

export default memo(BookCreate);
