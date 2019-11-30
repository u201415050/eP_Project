import React, { Component } from 'react';
import { Modal, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { TextMontserrat, ButtonGradient, Card } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Icons } from 'api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../features/cash_register/constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class Alert extends Component {
  state = {
    orientation: isPortrait(),
  };
  render() {
    const {
      fontWeight,
      message,
      buttonTitle,
      onPress,
      textSize,
      onPressCloseButton,
      closeIcon,
      messageTitle,
    } = this.props;

    const styles = EStyleSheet.create({
      alertContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // ...style,
      },
      messageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
      },
      containerButton: {
        width: '100%',
        alignItems: 'center',
        // marginTop: 30,
        // marginBottom: 20,
      },
      button: {
        width: '75%',
      },
      textStyle: {
        fontSize: `${textSize || 1.8}rem`,
        textAlign: 'center',
        fontWeight: fontWeight || '600',
        color: '#4e5965',
        width: '100%',
      },
      buttonStyle: {
        width: '100%',
      },
      card: {
        paddingHorizontal: '1.5rem',
        paddingBottom: '2rem',
      },
      '@media (min-width: 500)': {
        $width: 500,
        $scale: 1.2,
        card: {
          width: '$width',
          paddingHorizontal: '2rem',
          paddingBottom: '1.5rem',
        },
      },
      '@media (min-width: 320) and (max-width: 500)': {
        $scale: 1,
        $width: '85%',
        card: {
          width: '$width',
        },
      },
    });
    const {
      messageContainer,
      textStyle,
      card,
      containerButton,
      button,
    } = styles;

    return (
      <Modal
        onRequestClose={() => {}}
        transparent={true}
        visible={true}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(47, 49, 51, 0.6)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={1}
        >
          <Card
            style={
              this.state.orientation
                ? {
                    width: wp('86%'),
                    // height: hp('25%'),
                    paddingHorizontal: wp('1.5%'),
                    paddingBottom: hp('2.5%'),
                  }
                : {
                    width: wp('50%'),
                    // height: hp('25%'),
                    paddingHorizontal: wp('1.5%'),
                    paddingBottom: hp('2.5%'),
                  }
            }
          >
            {closeIcon ? (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: hp('0.9%'),
                  top: hp('0.9%'),
                }}
                activeOpacity={0.5}
                onPress={onPressCloseButton}
              >
                <Image
                  source={Icons.close}
                  style={
                    isTablet
                      ? { width: hp('2.3%'), height: hp('2.%') }
                      : { width: wp('4%'), height: wp('4%') }
                  }
                />
                {/* <Icon
                name={"close"}
                size={closeButtonSize || 30}
                color={closeButtonColor || "#666"}
              /> */}
              </TouchableOpacity>
            ) : null}
            <View
              style={
                this.state.orientation
                  ? messageContainer
                  : {
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: hp('4%'),
                      marginTop: hp('2.5%'),
                    }
              }
            >
              {messageTitle && (
                <View style={{ marginBottom: hp('1.5%') }}>
                  <TextMontserrat
                    style={{
                      fontSize: this.state.orientation ? wp('4.5%') : hp('4%'),
                      fontWeight: '700',
                      color: '#4e5965',
                      width: '100%',
                    }}
                  >
                    {messageTitle}
                  </TextMontserrat>
                </View>
              )}
              {message.map((element, i) => {
                return (
                  <TextMontserrat
                    key={i}
                    style={
                      this.state.orientation
                        ? {
                            fontSize: wp('3.5%'),
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#4e5965',
                            width: '100%',
                          }
                        : {
                            fontSize: hp('3%'),
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#4e5965',
                            width: '100%',
                          }
                    }
                  >
                    {element}
                  </TextMontserrat>
                );
              })}
            </View>
            <View style={containerButton}>
              <View style={button}>
                <ButtonGradient
                  resize={isTablet}
                  title={buttonTitle}
                  onPress={onPress}
                  labelSize={this.state.orientation ? null : hp('2.3%')}
                />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Modal>
    );
  }
}

export { Alert };
