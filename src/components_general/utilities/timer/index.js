import React, { Component } from 'react';
import { TextMontserrat } from 'components';
import BackgroundTimer from 'react-native-background-timer';
export default class Timer extends Component {
  initial_state = {
    counter: '0'.concat(this.props.minutes ? this.props.minutes : 1 ,':00'),
    seconds: 60 * (this.props.minutes ? this.props.minutes : 1),
  };

  state = this.initial_state;

  start = () => {
    this.clockCall = BackgroundTimer.setInterval(
      () => this.decrementClock(),
      1000
    );
    if (this.props.onStart) this.props.onStart();
  };

  restart = () => {
    BackgroundTimer.clearInterval(this.clockCall);
    this.setState(this.initial_state);
    this.start();
  };

  UNSAFE_componentWillMount() {
    this.start();
  }

  formatTimer = (seconds) => {
    const minutes = (seconds / 60);
    const second = seconds % 60;
    const minuteString = '0'+Math.floor(minutes);
    const secondsString = second >= 10 ? second : '0'+second;
    return minuteString.concat(':',secondsString);
  }

  decrementClock = () => {
    this.setState(prevstate => ({
      seconds: prevstate.seconds - 1,
      // counter: `00:${this.secondWithZero(prevstate.seconds - 1)}`,
      counter: this.formatTimer(prevstate.seconds - 1),
    }));
    if (this.state.seconds == 0) {
      BackgroundTimer.clearInterval(this.clockCall);
      if (this.props.onFinished) this.props.onFinished();
    }
  };

  secondWithZero = second => {
    return `${second < 10 ? 0 : ''}${second}`;
  };

  componentWillUnmount() {
    BackgroundTimer.clearInterval(this.clockCall);
    BackgroundTimer.stopBackgroundTimer();
  }

  render() {
    const { textStyle } = this.props;
    return (
      <TextMontserrat style={textStyle}>{this.state.counter}</TextMontserrat>
    );
  }
}
