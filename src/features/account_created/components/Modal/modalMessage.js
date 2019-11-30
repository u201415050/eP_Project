//import liraries
import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Modal,
  findNodeHandle,
  InteractionManager,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import { isTablet } from '../../constants/isLandscape';
import BlurOverlay, {
  closeOverlay,
  openOverlay,
} from 'react-native-blur-overlay';
// create a component
class ModalMessage extends Component {
  state = {
    update: '',
  };
  componentDidMount() {
    this.setState({ update: '' });
    // alert('mount')
  }
  render() {
    const { active, toggleModal } = this.props;
    const isLandscape = isTablet;
    openOverlay();

    return (
      <Modal
        visible={active}
        animationType="fade"
        onRequestClose={closeOverlay}
        transparent={true}
      >
        <BlurOverlay
          radius={100}
          downsampling={4}
          brightness={-50}
          onPress={() => {
            closeOverlay();
          }}
          customStyles={{ alignItems: 'center', justifyContent: 'center' }}
          blurStyle="dark"
        >
          <View style={styles.container}>
            <View
              style={[
                styles.wrapper,
                isLandscape ? { width: hp('60%'), height: hp('70%') } : null,
              ]}
            >
              <View
                style={{ height: '40%', width: '100%', alignItems: 'center' }}
              >
                <Image
                  source={require('../../assets/img/congrat.png')}
                  resizeMode="stretch"
                  style={{
                    top: -hp('7%'),
                    width: '75%',
                    height: '110%',
                    position: 'absolute',
                  }}
                />
                <Image
                  source={require('../../assets/img/stack.png')}
                  resizeMode="stretch"
                  style={{
                    top: isLandscape ? -hp('18%') : -hp('18%'),
                    width: isLandscape ? hp('50%') : hp('45%'),
                    height: isLandscape ? hp('50%') : hp('45%'),
                    position: 'absolute',
                  }}
                />
              </View>
              <View
                style={{
                  height: '60%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: isLandscape ? 'center' : 'flex-start',
                }}
              >
                <Text style={styles.textLogin}>Hooray! Your account</Text>
                <Text style={styles.textLogin}>has been created</Text>
                <Text
                  style={[styles.textDescription, { marginTop: hp('3.6%') }]}
                >
                  Just one more step! To complete the
                </Text>
                <Text style={styles.textDescription}>
                  registration you need to validate your
                </Text>
                <Text style={styles.textDescription}>email address.</Text>

                <TouchableOpacity
                  onPress={this.props.onButtonClick}
                  style={{ alignItems: 'center', marginTop: hp('5%') }}
                >
                  <LinearGradient
                    colors={['#174285', '#0079AA']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        paddingVertical: hp('2.3%'),
                        width: isLandscape ? hp('45%') : wp('70.5%'),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          opacity: 0.9,
                          color: '#FFFFFF',
                          fontSize: hp('1.8%'),
                          fontFamily: 'Montserrat-Bold',
                          letterSpacing: hp('0.2%'),
                        }}
                      >
                        LOGIN TO YOUR ACCOUNT
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurOverlay>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.opacityDin(0.6),
  },
  wrapper: {
    backgroundColor: colors.white,
    width: '90%',
    height: hp('62%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: hp('2%'),
  },
  textLogin: {
    fontSize: hp('2.9%'),
    fontFamily: 'Montserrat-Bold',
    color: '#52565F',
    opacity: 0.8,
  },
  textDescription: {
    fontSize: hp('1.93%'),
    fontFamily: 'Montserrat-SemiBold',
    color: '#52565F',
    opacity: 0.5,
  },
});

//make this component available to the app
export default ModalMessage;
