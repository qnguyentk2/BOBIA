import React, { memo } from 'react';
import { Query } from 'react-apollo';
import Common from 'components/common';

function AboutPage() {
  const {
    commonProps: {
      queries: { query }
    },
    commonComps: { LazyImage }
  } = Common;

  return (
    <Query query={query.allAuthors}>
      {({ loading, error, data: { allAuthors } }) => {
        if (loading) {
          return (
            <div active={loading} inverted>
              <div>Loading</div>
            </div>
          );
        }
        if (error) {
          return <p>Error :( {error}</p>;
        }
        return (
          <div>
            {allAuthors.map(author => (
              <div className="About-author" key={author.id}>
                <div className="About-infoHeader">
                  <LazyImage
                    className="About-img"
                    alt={author.name}
                    src={`https://media.graphcms.com/resize=w:100,h:100,fit:crop/${
                      author.avatar.handle
                    }`}
                  />
                  <h1>Hello! My name is {author.name}</h1>
                </div>
                <p>{author.bibliography}</p>
              </div>
            ))}
          </div>
        );
      }}
    </Query>
  );
}

export default memo(AboutPage);
