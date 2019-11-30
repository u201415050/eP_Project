import React, { Component } from 'react';
import {
  NativeModules,
  Platform,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
import { TextMontserrat } from 'components';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import { getLocalSettingRow } from '../../../../../../services/settings_service';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64';
import realm from '../../../../../../services/realm_service';
import { epaisaRequest } from '../../../../../../services/epaisa_service';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class PersonalCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),
      customer: this.props.item,
      imagePath: '',
      imageHeight: '',
      imageWidth: '',
      userImage:
        this.props.item != null
          ? this.props.item.customerImage != null
            ? this.props.item.customerImage
            : ''
          : '',
      user: realm.objectForPrimaryKey('User', 0),
    };
  }

  timestampToFormattedDate = timestamp =>
    moment.unix(timestamp).format('DD/MM');

  openImagePicker() {
    const options = {
      title: 'Select your option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    if (getLocalSettingRow('device', 'EnableCamera') == 0) {
      //this.setState({openCameraModal:!this.state.openCameraModal})
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          alert('Custom button tapped : ' + response.customButton);
        } else {
          this.props.changeCustomer({
            ...this.props.item,
            customerImage: response.uri,
          });
          this.setState({
            imagePath: response.uri,
            userImage: response.uri,
            upload: true,
            imageHeight: response.height,
            imageWidth: response.width,
            //upload : true
          });
        }
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('Something went wrong with this option. Try again later.');
          console.log(response.error);
        } else if (response.customButton) {
          alert('Custom button tapped : ' + response.customButton);
        } else {
          // alert(response.uri)
          this.props.changeCustomer({
            ...this.props.item,
            customerImage: response.uri,
          });
          this.setState({
            imagePath: response.uri,
            userImage: response.uri,
            upload: true,
            imageHeight: response.height,
            imageWidth: response.width,
            //upload : true
          });
        }
      });
    }
  }

  componentDidUpdate() {
    if (this.state.upload) {
      this.setState({ upload: false });
      //loading_service.showLoading()
      ImageResizer.createResizedImage(
        this.state.imagePath,
        200,
        (200 * this.state.imageHeight) / this.state.imageWidth,
        'PNG',
        0,
        0
      )
        .then(response => {
          //alert(response.uri)
          if (Platform.OS === 'ios') {
            ImgToBase64.getBase64String(response.uri).then(base64String => {
              // export function edit_customer(auth_key, customerId, params) {
              //   var returnEncrypt = encryptRequestEditCustomer(auth_key, customerId, params);

              //   return sendRequestPut(returnEncrypt, '/customer');
              epaisaRequest(
                { customerId: this.props.item.customerId, files: base64String },
                '/customer',
                'PUT'
              );
              // UserServices.edit_customer(
              //   this.state.user.auth_key,
              //   this.props.item.customerId
              // );
            });
          } else {
            NativeModules.RNImageToBase64.getBase64String(
              response.uri,
              (err, base64) => {
                try {
                  //alert(base64)
                  epaisaRequest(
                    { customerId: this.props.item.customerId, files: base64 },
                    '/customer',
                    'PUT'
                  );
                } catch {
                  console.log(err);
                }
              }
            );
          }

          //.catch(err => doSomethingWith(err));
          /**/
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  render() {
    const styles = this.state.isPortrait
      ? portraitStyles.styles
      : landscapeStyles.styles;
    const customer = this.props.item;

    //let userUrl=null
    // const user_photo=/*this.state.imagePath!=''?{uri:this.state.imagePath}:*/require('./../../../../assets/user_placeholder.jpg')
    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={styles.cardView}>
            <Image 
              style={styles.cardImage}
              source={require('./assets/cardFirst.png')} 
              resizeMode={'stretch'}
            />
            <View style={styles.cardFirstRow}>
              <View style={styles.photoSpace}>
                <View style={styles.photoContainer}>
                  <TouchableOpacity
                    onPress={this.openImagePicker.bind(this)}
                    style={styles.photoContainer}
                  >
                    <Image
                      source={
                        this.state.userImage != ''
                          ? {
                              uri:
                                this.state.userImage.indexOf('png') != -1
                                  ? this.state.userImage.substr(
                                      0,
                                      this.state.userImage.indexOf('png') + 3
                                    )
                                  : this.state.userImage,
                            }
                          : require('./../../../../assets/user_placeholder.jpg')
                      }
                      style={styles.photoContainer}
                      resizeMode={'cover'}
                    />
                  </TouchableOpacity>
                  <Image
                    source={require('../../assets/images/edit.png')}
                    style={styles.editContainer}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
              <View style={styles.nameSpace}>
       
                <TextMontserrat style={styles.nameText}>
                  {customer.firstName + ' ' + customer.lastName}
                </TextMontserrat>
              </View>
              <View style={styles.sinceSpace}>
                <TextMontserrat style={styles.sinceLabel}>
                  Cust. Since
                </TextMontserrat>
                <TextMontserrat style={styles.sinceText}>
                  {this.timestampToFormattedDate(+customer.created_at)}
                </TextMontserrat>
              </View>
            </View>
            <View style={styles.cardSecondRow}>
              <TextMontserrat style={styles.cardNumber}>
                1234 5678 90
              </TextMontserrat>
            </View>
            <View style={styles.cardThirdRow}>
              <View style={{ flex: 1.5,}}>
                <TextMontserrat style={styles.loyaltyLabel}>
                  Loyalty Points
                </TextMontserrat>
                <TextMontserrat style={styles.loyaltyText}>0</TextMontserrat>
              </View>
              <View
                style={{ flex: isPortrait ? 2.4 : 1.4, alignItems: 'center' }}
              >
                <View >
                  <TextMontserrat style={styles.pointsLabel}>
                    Points Value
                  </TextMontserrat>
                  <TextMontserrat style={styles.pointsText}>₹0</TextMontserrat>
                </View>
              </View>
              <View style={{ flex: isPortrait ? 1.4 : 1.4 }}>
                <TextMontserrat style={styles.expiryLabel}>
                  Expiry Date
                </TextMontserrat>
                <TextMontserrat style={styles.expiryText}>--/--</TextMontserrat>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default PersonalCard;
