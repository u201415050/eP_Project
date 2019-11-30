import React, {Component} from 'react';
import {TextMontserrat} from 'components';

export default class Timer extends Component {

    initial_state = {
        counter: '01:00',
        seconds: 60,
    }

    state = this.initial_state;

    start = () => {
        this.clockCall = setInterval(() => this.decrementClock(), 1000);
        if(this.props.onStart) this.props.onStart();
    }

    restart = () => {
        clearInterval(this.clockCall);
        this.setState(this.initial_state);
        this.start();
    }

    componentWillMount() {
        this.start()
    }

    decrementClock = () => {      
        this.setState((prevstate) => ({ 
            seconds: prevstate.seconds - 1,
            counter: `00:${this.secondWithZero(prevstate.seconds - 1)}`
        }));
        if(this.state.seconds == 0){
            // on 00:00
            clearInterval(this.clockCall);
            if(this.props.onFinished) this.props.onFinished();

        }
    };

    secondWithZero = (second) => {
        return `${second < 10 ? 0 : '' }${second}`;
    }

    

    componentWillUnmount() {
        clearInterval(this.clockCall)
    }

    render() {
        const {textStyle} = this.props;
        return (
            <TextMontserrat style={textStyle}>
                {this.state.counter}
            </TextMontserrat>
        )
    }
}
