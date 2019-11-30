import React, { Component } from 'react';
import {
  View,
  Platform,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { Card } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../features/cash_register/constants/isLandscape';
class PopUp extends Component {
  state = {
    visible: true,
  };
  _toggleModal = () => {
    this.setState({ visible: false });
  };
  render() {
    const modalContainer = {
      backgroundColor: 'rgba(47, 49, 51, 0.6)',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const { animation, children, style, paddingAvoid, Avoid } = this.props;
    const EStyle = EStyleSheet.create({
      card: {
        ...style,
      },
    });
    return (
      <Modal
        onRequestClose={() => null}
        //onRequestClose={() => this.setState({visible:false})}
        animationType={animation}
        transparent={true}
        visible={this.state.visible}
        presentationStyle="overFullScreen"
      >
        {this.props.Avoid ? (
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={modalContainer}
            activeOpacity={1}
          >
            <KeyboardAvoidingView
              style={{
                width: '100%',
                alignItems: 'center',
              }}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              behavior={Avoid.toString().length > 5 ? Avoid : 'position'}
              enabled
              keyboardVerticalOffset={
                !isTablet ? null : paddingAvoid ? paddingAvoid : 0 //-hp('40%')
              }
            >
              {this.props.hideCard ? (
                <View style={EStyle.card}>{children}</View>
              ) : (
                <Card style={EStyle.card}>{children}</Card>
              )}
            </KeyboardAvoidingView>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={modalContainer}
            activeOpacity={1}
          >
            {this.props.hideCard ? (
              <View style={EStyle.card}>{children}</View>
            ) : (
              <Card style={EStyle.card}>{children}</Card>
            )}
          </TouchableOpacity>
        )}
      </Modal>
    );
  }
}

export { PopUp };
