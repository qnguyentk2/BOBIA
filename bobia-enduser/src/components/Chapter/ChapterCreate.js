import React, { memo } from 'react';
import { Mutation } from 'react-apollo';
import ChapterForm from 'components/Chapter/ChapterForm';
import Common from 'components/common';
import { RATING_OPTIONS } from 'constants/index';

function ChapterCreate(props) {
  const {
    commonProps: {
      queries: { mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <div className="write-chapter">
      <div className="form-write">
        <Mutation
          mutation={mutation.createChapter}
          onCompleted={data => {
            if (
              data &&
              data.createChapter &&
              data.createChapter.success === true
            ) {
              notify.success('Tạo chương mới thành công!');
              window.scrollTo(0, 0);
            }
          }}
        >
          {(_handleCreateChapter, { loading, error, data }) => {
            if (loading) {
              return <CommonLoading />;
            }
            if (error && error.networkError) {
              return <Page500 error={error.networkError} />;
            }
            if (
              data &&
              data.createChapter &&
              data.createChapter.success === true
            ) {
              const newProps = Object.assign({}, props);

              newProps.initialValues = {
                slugBook: props.initialValues.slugBook,
                rating: 'G',
                newRating: RATING_OPTIONS[0],
                title: '',
                content: ''
              };

              return (
                <ChapterForm onAction={_handleCreateChapter} {...newProps} />
              );
            }

            let chapterInit = props.chapter
              ? Object.assign({}, props.chapter)
              : { ...props.initialValues };

            return (
              <div className="form-write">
                <ChapterForm
                  onAction={_handleCreateChapter}
                  initialValues={chapterInit}
                  {...props}
                />
                {error &&
                error.graphQLErrors &&
                error.graphQLErrors.length > 0 ? (
                  <CommonMessage
                    type="error"
                    messages={error.graphQLErrors.map(error => {
                      return error.message.includes('duplicate key error')
                        ? 'Chương này đã tồn tại!'
                        : error.message;
                    })}
                  />
                ) : null}
              </div>
            );
          }}
        </Mutation>
      </div>
    </div>
  );
}

export default memo(ChapterCreate);
