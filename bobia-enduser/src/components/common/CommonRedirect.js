import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

import { Modal, ModalBody } from 'reactstrap';

export default class CommonRedirect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      seconds: 3
    };
    this.timer = 0;
  }

  _convertSecondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  _handleCountdown = () => {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    if (seconds === 0) {
      clearInterval(this.timer);
    }
  };

  _startTimer = () => {
    if (this.timer === 0) {
      this.timer = setInterval(this._handleCountdown, 1000);
    }
  };

  componentDidMount() {
    let timeLeftVar = this._convertSecondsToTime(this.state.seconds);
    this.setState({
      time: timeLeftVar
    });
    this._startTimer();
  }

  render() {
    const { message, redirectTo, history } = this.props;

    if (this.state.seconds === 0) {
      if (!redirectTo) {
        history.goBack();
      } else {
        return <Redirect to={redirectTo} />;
      }
    }

    return (
      <div>
        <Modal isOpen={true} className={this.props.className}>
          <ModalBody>
            {message}, tự động chuyển trang sau {this.state.time.s} giây
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
