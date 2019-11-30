import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Icons } from "api";
import { TextMontserrat } from "components";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { automaticSyncConfiguration } from "realm";

class CardWithHeader extends Component {
  renderCloseButton = () => {
    const {
      closeButton,
      onPressCloseButton,
      closeButtonSize,
      closeButtonColor,
      isLandscape,
      colorTitle
    } = this.props;
    if (closeButton) {
      return (
        <TouchableOpacity
          hitSlop={{top:hp('1%'),bottom:hp('1%'),left:hp('1%'),right:hp('1%')}}
          style={styles.closeButtonStyle}
          activeOpacity={0.5}
          onPress={onPressCloseButton}
        >
          <Image source={Icons.close} style={[colorTitle?{tintColor:colorTitle}:null,isLandscape?{width: hp('3%'), height: hp('3%')}:{width: wp('4%'), height: wp('4%')}]} />
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
      colorTitle,
      backHeader
    } = this.props;
    
    const cardHeaderText = {
      fontWeight: "bold",
      fontSize: hp(sizeHeaderLabel),
      color: colorTitle||"#47525d"
    }
    return (
      <View style={[cardStyles, customCardStyle,backHeader?{backgroundColor:backHeader}:null]}>
        {this.props.noheader?null:((this.props.headerCustom)||<View style={[cardHeader,customHeaderStyle]}>
          <TextMontserrat style={cardHeaderText}>{headerTitle}</TextMontserrat>
          {this.renderCloseButton()}
        </View>)}
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
    padding: 0,
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
    right: hp('2%'),
    top:'auto',
    bottom:'auto'
  }
};

export default CardWithHeader;