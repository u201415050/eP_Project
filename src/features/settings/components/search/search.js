import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../styles/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTablet } from '../../constants/isLandscape';
import { connect } from 'react-redux';
class Search extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      fontSearch:'2.1%',
      textSearch:'',
    };
    this.props.inputRef(this.focus);
  }
  toggleLeftDrawer = () => {
    console.log('OPEN DRAWER');
    console.log(this.props.navigation);
    this.props.navigation.toggleLeftDrawer();
  };
  goBack = () => {
    console.log('GO BACK');
    console.log(this.props.navigation);
    this.props.navigation.goBack();
  };
  focus=()=>{
    this.inputField.focus()
  }
  render() {
    console.log(this.state);
    const isLandscape = isTablet;
    const { label } = this.props;
    return (
        <View style={styles.searchInput}>
          <TextInput 
          ref={ref=>this.inputField = ref}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Search Settings"
          value={this.state.textSearch}
          //onFocus={()=>{this.setState({fontSearch:'2.2%'})}}
          onChangeText={(textSearch)=>{ 
          this.setState({textSearch});
          this.props.find(textSearch)
          if(textSearch=='') this.setState({fontSearch:'2.1%'});
          else this.setState({fontSearch:'2.2%'})
          }}
          style={{
            marginLeft:hp('2.3%'),
            paddingVertical:0,
            width:'80%',
            fontFamily:'Montserrat-Bold',
            fontSize:hp(this.state.fontSearch),
            marginBottom:hp('0.7%'),
            color: 'rgba(0,0,0,0.6)'
          }}
          />
          <TouchableOpacity
          onPress={()=>{}}
          style={{
            position:'absolute',
            right: hp('1%'),
            height:'100%',
            paddingHorizontal:hp('1%'),
            alignItems:'center',
            justifyContent: 'center',
          }}>
            <Image 
              source={require('../../assets/img/Shape.png')}/>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    height: hp('10%'),
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    elevation: 0,
  },
  searchInput:{
    width:'95%',
    backgroundColor:'white',
    height:'55%',
    marginTop: hp('1%'),
    borderRadius: 7,
    justifyContent: 'flex-end',
  },
  iconLeft: {
    position: 'absolute',
    height: '100%',
    left: 20,
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: hp('3%'),
    bottom: hp('3%'),
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: hp('0.5'),
  },
  badgeText: {
    color: colors.white,
    fontSize: hp('1.3%'),
    fontFamily: 'Montserrat-Bold',
  },
  stack: {
    position: 'absolute',
    left: '27%',
    top: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
  },
  iconRight: {
    flexDirection: 'row',
    position: 'absolute',
    height: '100%',
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconItem: {
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: hp('0.3%'),
    alignItems: 'center',
  },
  marginExtra: {
    marginLeft: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
  },
  titleCentral: {
    color: colors.white,
    fontSize: hp('2.4%'),
    letterSpacing: hp('0.1%'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
});
const mapStateToProps = state => ({});

const dispatchActionsToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  dispatchActionsToProps
)(Search);
