import React, { Component } from 'react';
import { Redirect } from 'react-router';

import { Modal, ModalBody } from 'reactstrap';

class CommonRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      seconds: 3
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
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

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({
      time: timeLeftVar
    });
    this.startTimer();
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

export default CommonRedirect;
