import React, { PureComponent } from 'react';
import { parseEditorContent } from 'utils';

export default class CommonBlockSeeMore extends PureComponent {
  state = {
    seeMore: false
  };

  renderButton() {
    if (this.props.content.split(' ').length <= this.props.limit) {
      return null;
    }
    return (
      <span
        onClick={() => {
          this.setState({ seeMore: !this.state.seeMore });
        }}
        className="see-more"
      >
        <span className="btn-text">
          {!this.state.seeMore
            ? this.props.textSeeMore
            : this.props.textSeeLess}
        </span>
      </span>
    );
  }

  // renderContent() {
  //   const { content, limit } = this.props;
  //   let cookedContent;
  //   if (isJSON(content)) {
  //     cookedContent = JSON.parse(content)
  //       .blocks.map(el => el.text)
  //       .join('\n');
  //   } else {
  //     cookedContent = content;
  //   }

  //   if (cookedContent.split(' ').length <= limit || this.state.seeMore) {
  //     return cookedContent;
  //   }
  //   return (
  //     cookedContent
  //       .split(' ')
  //       .splice(0, limit)
  //       .join(' ') + '...'
  //   );
  // }

  render() {
    const { classWrapper, content } = this.props;
    return (
      <>
        <div className={classWrapper}>{parseEditorContent(content, 100)}</div>
        {this.renderButton()}
      </>
    );
  }
}
