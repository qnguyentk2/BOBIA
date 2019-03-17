import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './dev.scss';
import bannerDefaultUrl from 'assets/images/space.jpg';
import marsPic from 'assets/images/planets/mars.jpg';
import cloudsPic from 'assets/images/planets/clouds.png';

export default class JustForDevPage extends PureComponent {
  state = {
    editorState: BraftEditor.createEditorState('<div>lol</div>')
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
  };

  render() {
    // const { editorState } = this.state;

    return (
      <div
        className="my-component"
        style={{
          backgroundImage: `url(${bannerDefaultUrl})`
        }}
      >
        <div className="planet">
          <div className="wrap">
            <div
              className="background"
              style={{
                backgroundImage: `url(${marsPic})`
              }}
            />
            <div
              className="clouds"
              style={{
                backgroundImage: `url(${cloudsPic})`
              }}
            />
          </div>
          <div className="mask" />
        </div>
        {/* <BraftEditor
          language="en"
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          readOnly
        /> */}
      </div>
    );
  }
}
