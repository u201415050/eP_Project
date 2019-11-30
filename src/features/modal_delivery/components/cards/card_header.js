import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { TextMontserrat } from "../texts";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class CardWithHeader extends Component {
  renderCloseButton = () => {
    const {
      closeButton,
      onPressCloseButton,
      closeButtonSize,
      closeButtonColor,
      isLandscape
    } = this.props;
    if (closeButton) {
      return (
        <TouchableOpacity
          style={styles.closeButtonStyle}
          activeOpacity={0.5}
          onPress={onPressCloseButton}
        >
          <Image 
            source={require('../../assets/icons/close.png')} 
            resizeMode="contain" 
            style={
              isLandscape?
              {width: hp('4%')}
              :
              {width: hp('2.4%')}
            } 
          />
          {/* <Icon
            name={"close"}
            size={closeButtonSize || 30}
            color={closeButtonColor || "#666"}
          /> */}
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
      fontWeight: "bold",
      fontSize: sizeHeaderLabel,
      color: "#47525d"
    }
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
    backgroundColor: "white"
  },
  cardBody: {
    padding: 0
  },
  cardHeader: {
    padding: 8,
    borderColor: "#979797",
    borderBottomWidth: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  closeButtonStyle: {
    position: "absolute", 
    right: isPortrait() ? wp('3%') : wp('1.5%'),
  }
};

export default CardWithHeader;