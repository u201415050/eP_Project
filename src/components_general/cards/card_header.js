import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { TextMontserrat } from '../texts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class CardWithHeader extends Component {
  renderCloseButton = () => {
    const { closeButton, onPressCloseButton, isLandscape } = this.props;
    if (closeButton) {
      return (
        <TouchableOpacity
          style={[
            styles.closeButtonStyle,
            {
              right: !isLandscape ? wp('3.1%') : wp('1.65%'),
              width: !isLandscape ? wp('5%') : wp('5%'),
            },
          ]}
          activeOpacity={0.5}
          onPress={onPressCloseButton}
        >
          <Image
            source={require('../../assets/icons/close.png')}
            resizeMode="contain"
            style={
              !isLandscape
                ? { width: wp('4%'), height: wp('4%') }
                : { width: hp('3.65%'), height: hp('3.65%') }
            }
          />
        </TouchableOpacity>
      );
    }
  };
  render() {
    const { cardStyles, cardBody, cardHeader } = styles;
    const {
      children,
      customCardStyle,
      customBodyStyle,
      headerTitle,
      sizeHeaderLabel,
      customHeaderStyle,
    } = this.props;

    const cardHeaderText = {
      fontWeight: 'bold',
      fontSize: sizeHeaderLabel,
      color: '#47525d',
    };
    return (
      <View style={[cardStyles, customCardStyle]}>
        <View style={[cardHeader, customHeaderStyle]}>
          <TextMontserrat style={cardHeaderText}>{headerTitle}</TextMontserrat>
          {this.renderCloseButton()}
        </View>
        <View style={[cardBody, customBodyStyle]}>{children}</View>
      </View>
    );
  }
}

const styles = {
  cardStyles: {
    borderRadius: 15,
    backgroundColor: 'white',
  },
  cardBody: {
    padding: 0,
  },
  cardHeader: {
    padding: 8,
    borderColor: '#979797',
    borderBottomWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonStyle: {
    position: 'absolute',
  },
};

export default CardWithHeader;
