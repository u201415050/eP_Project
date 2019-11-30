import React, { Component } from "react";
import { View, Image, TouchableOpacity,Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Icons } from "api";
import { TextMontserrat } from "components";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Settings from 'react-native-vector-icons/FontAwesome5';
import Header from '../Header/headerModel'

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
       <View style={{justifyContent: "center",
       alignItems: "center",left:wp('32.5%')}}>
        <TouchableOpacity
          style={styles.closeButtonStyle}
          activeOpacity={0.5}
          onPress={onPressCloseButton}
        >
         <Settings name="sliders-h" size={hp('2.6%')} color="gray" />
       
        </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    const { cardStyles, cardBody, cardHeader } = styles;
    const {
      children,
      customCardStyle,
      customBodyStyle,
      onPressCloseButton,
      headerTitle,
      sizeHeaderLabel,
      customCardHeader,
      customCardHeaderText,
    } = this.props;
    
    const cardHeaderText = {
      fontWeight: "bold",
      fontSize: hp(sizeHeaderLabel),
      color: "#47525d"
    }
    return (
      <View style={{flex:1,width:'100%', justifyContent:'center',alignItems:'center', flexDirection:'column'}}>
  
      <Header onPressCloseButton={onPressCloseButton}/>
      <View style={[cardStyles, customCardStyle]}>
      
       
        <View style={[cardBody, customBodyStyle]}>{children}</View>
      </View>
      </View>
    );
  }
}

const styles = {
  cardStyles: {
    borderRadius: 15,
    backgroundColor: "white",
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
    justifyContent: "center",
    alignItems: "center",
    width:hp('5%'),
    height:hp('5%'),

    backgroundColor:'white',
    borderRadius:20,
  }
};

export default CardWithHeader;