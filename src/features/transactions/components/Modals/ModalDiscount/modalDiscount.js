
import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,TouchableHighlight,Image, Modal, TextInput} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CardWithHeader} from "../../../../../components/cards"
import Icon from "react-native-vector-icons/FontAwesome";
import colors from '../../../styles/colors';
import { SelectWithTextInput } from '../../../../../components/inputs';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../../constants/util/scaling';

const options =["%","₹"]
class ModalDiscount extends Component {
    state={
        optionsActive: false,
        optionSelected: 1,
        valueDiscount: 0,
        inputFocus:false,
        wrong: false,
    }
    addValidate(){
        const {addDiscount} = this.props
        this.setState({wrong: false});
        addDiscount({discount: parseFloat(this.state.valueDiscount) ,type:options[this.state.optionSelected-1]});                     
    }
    render() {
        const {active, closeModal, widthModal, isLandscape} = this.props
        const wrongStyleLabel= this.state.wrong? {color:'#D0021B'}:null
        const wrongStyleBorders= this.state.wrong? {borderColor:'#D0021B'}:null
        const noFormat = this.state.optionSelected==1 ? ((parseFloat(this.state.valueDiscount) < 0.1 || parseFloat(this.state.valueDiscount) > 99.9)? 1 :0 ): parseFloat(this.state.valueDiscount) > 0? 0: 2
        
        return(
            <Modal visible={active} transparent={true} animationType="fade" onRequestClose={closeModal} >
            <View style={styles.container}>
                <CardWithHeader isLandscape={isLandscape} sizeHeaderLabel={isLandscape?"3.5%":"3%"} customBodyStyle={{alignItems:'center',justifyContent:'center'}} headerTitle="Discount" closeButton={true} onPressCloseButton={closeModal} customCardStyle={{width: hp(widthModal),}}>
                    <View style={styles.wrapper}>
                        <View style={[styles.rowForm,wrongStyleBorders]}>
                            <View style={styles.leftForm}>
                                <Text style={[styles.select,wrongStyleLabel,isLandscape?{fontSize:hp('3.4%'),}:null]}>{options[this.state.optionSelected-1]}</Text>
                                <TouchableOpacity style={styles.drop} onPress={()=>{this.setState({optionsActive:true})}}>
                                    <Icon  name={"angle-down"} size={isLandscape?hp('3.3%'):hp('2.5%')} />
                                </TouchableOpacity>
                                
                            </View>
                            <View style={[styles.separation,wrongStyleBorders]}>

                            </View>
                            <View style={styles.rightForm}>
                                <TextInput value={this.state.valueDiscount>'0' || this.state.valueDiscount?this.state.valueDiscount.toString():""} 
                                        onChangeText={(valueDiscount)=>{this.setState({valueDiscount})}} 
                                        onFocus={()=>{this.setState({inputFocus:true, optionsActive:false})}} 
                                        style={[styles.textInput,wrongStyleLabel,isLandscape?{fontSize:hp('3.4%'),paddingLeft: hp('4%'),}:null]}/>
                                <TouchableOpacity style={styles.icon} onPress={()=>{this.setState({valueDiscount: 0})}}>
                                <IconMaterialIcons  name={"cancel"} size={isLandscape?hp('4.2%'):hp('2.9%')} color="#666"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{width:'130%', justifyContent:'flex-start'}}>
                        <View style={{width:'100%', alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={()=>{
                                noFormat==0? 
                                this.addValidate():
                                this.setState({wrong: true})
                            }}
                            style={styles.touchableModalDiscountAdd }>

                            <LinearGradient 
                                colors={['#174285', '#0079AA']} 
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={ { borderRadius: 50 , alignItems: 'center', width: '70%',
                                elevation: moderateScale(3),} }>        
                                <View style= {{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} >
                                <Text style= { styles.textDiscountAddButtonPortrait}>ADD</Text>                
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                        </View>
                        {
                                    this.state.optionsActive?
                                    <View style={styles.dropdown}>{
                                        options.map((item,i)=>{
                                            return(
                                                <TouchableHighlight key={i} onPress={()=>{this.setState({optionsActive:false,optionSelected: (i+1)})}}>
                                                    <Text style={[styles.option,i==(this.state.optionSelected-1)?{backgroundColor:'#EEEEEE'}:null]}>
                                                        {item}
                                                    </Text>
                                                </TouchableHighlight>
                                            )
                                        })}
                                    </View>:null
                        }
                        {
                            this.state.wrong?
                            <View style={styles.messageWrong}>
                                <View style={{flexDirection:'row',width:'125%', justifyContent:'center', alignItems:'center'}}>
                                <Image source={require('../../../../../assets/icons/error.png')} style={{width: hp('1.8'),height:hp('1.8'),marginTop:hp('0.3')}}/>
                                    <Text style={[styles.messageWrongLabel, isLandscape?{fontSize: hp('2.0')}:null]}>
                                {noFormat==1 ? " Enter a valid discount from 0.1% - 99.9%": " Enter a valid discount from > 0.0"}
                                </Text></View>
                            </View>
                            :null
                        }            

                        
                        </View>
                    </View>
                </CardWithHeader>
            </View>
            </Modal>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container:{
        width:'100%',
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: colors.opacityDin(0.6)
    },
    wrapper:{
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: hp('6%'),
        marginTop: hp('5%')
    },
    rowForm:{
        width: '130%',
        flexDirection:'row',
        alignItems:'center',
        borderColor: '#174285',
        borderBottomWidth: 2,
    },
    leftForm:{
        flexDirection:'row',
        width:'30%',
        alignItems:'center',
        justifyContent:'space-around',
        
    },
    separation:{
        borderColor: '#174285',
        borderRightWidth: 2,
        height:'100%',
    },
    rightForm:{
        width:'70%',
        flexDirection:'row',
        alignItems:'center',
    },
    drop:{
        marginRight:hp('0.6%')
    },
    select:{
        textAlign:'center',
        fontSize: wp('4.4%'),
        marginLeft: 10,
        color:'#174285',
        fontFamily: 'Montserrat-SemiBold',
        marginBottom: 5,
    },
    icon:{
        position:'absolute',
        right: 4
    },
    textInput:{
        paddingVertical: 0,
        color:'#174285',
        paddingLeft: wp('6%'),
        fontSize:hp('2.8%'),
        width:'80%',
        marginBottom: 5,
        fontFamily: 'Montserrat-Bold',
    },
    textDiscountAddButtonPortrait:{
        fontFamily: 'Montserrat-SemiBold', 
        color:'white', 
        fontSize: hp('1.95%'), 
        letterSpacing: 1.33,
        textAlign:'center',
      },
      touchableModalDiscountAdd:{
        width: '130%',
        height: hp('6.25%'),
        marginTop: hp('5%'),
        borderRadius: 50,
        marginBottom: hp('3%'),
        alignItems:'center'
      },
      dropdown:{
        position: 'absolute',
        width: '30%',
        elevation: 20,
        top:0,
        left:0,
        borderLeftColor: colors.opacityDin(0.1),
        borderRightColor: colors.opacityDin(0.3),
        borderBottomColor: colors.opacityDin(0.3),
        borderWidth: 1,
      },
      option:{
          textAlign:'center',
          fontSize: hp('2.5%'),
          paddingVertical: hp('1.1%'),
          backgroundColor:"#FAFAFA",
          fontFamily: 'Montserrat-ExtraBold',
      },
      messageWrong:{
        width: '100%',
        position: 'absolute',
        top: 2,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      messageWrongLabel:{
        fontSize: hp('1.5'),
        color: '#D0021B',
        flexWrap: 'wrap',
        fontFamily: 'Montserrat-SemiBold',
        textAlign:'center',
        justifyContent: 'center',
        marginTop:hp('0.2%'),
      }
});

export default ModalDiscount;
