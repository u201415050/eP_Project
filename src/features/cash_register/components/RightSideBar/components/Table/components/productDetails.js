import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import EditProduct from '../../../../EditProduct';
import { editProductPortrait } from '../../../../EditProduct/styles/editProductPortrait';
import { editProductLandscape } from '../../../../EditProduct/styles/editProductLandscape';
import { formatNumberCommasDecimal } from 'api';
import { TextMontserrat } from 'components';
import ImagePicker from 'react-native-image-picker';
import { getLocalSettingRow } from '../../../../../../../services/settings_service';
import LinearGradient from 'react-native-linear-gradient';
import { isTablet } from '../../../../../../modal_customer/constants/isLandscape';
import colors from '../../../../../../modal_customer/styles/colors';
import Swipeout from 'react-native-swipeout';
import realm from 'services/realm_service';
import { connect } from 'react-redux';
import { cashActions } from '../../../../../actions';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ProductDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    if (this.props.myRef) {
      this.props.myRef(this);
    }
    this.state = {
      orientation: isPortrait(),
      detailVisible: false,

      imagePath: '',
      imageHeight: '',
      imageWidth: '',

      heightCard: 0,
      marginTopCard: 0,
      marginBottomCard: 0,
      addMargin: 0,

      openCameraModal: false,

      taxContainerHeight: 0,
      taxFromSavedContainerHeight: 0,
      tempHeight: 0,
      tempHeightTax: 0,
    };

    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

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
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
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
          this.setState({
            imagePath: response.uri,
            imageHeight: response.height,
            imageWidth: response.width,
          });
        }
      });
    }
  }

  closeModal = () => {
    this.setState(
      {
        detailVisible: !this.state.detailVisible,
      },
      () => {
        this.setState({
          heightCard: this.state.detailVisible
            ? hp('42%') +
              this.state.taxContainerHeight +
              (this.state.detailVisible
                ? this.state.taxFromSavedContainerHeight
                : 0)
            : 0,
          marginTopCard: this.state.detailVisible ? hp('1%') : 0,
          marginBottomCard: this.state.detailVisible ? hp('2.5%') : 0,
          tempHeight: this.state.detailVisible
            ? 0
            : this.state.taxContainerHeight,
          taxContainerHeight: this.state.detailVisible
            ? this.state.tempHeight
            : 0,
        });
      }
    );
  };

  forceCloseModal = () => {
    this.setState(
      {
        detailVisible: false,
      },
      () => {
        this.setState({
          heightCard: 0,
          marginTopCard: 0,
          marginBottomCard: 0,
          tempHeight: this.state.taxContainerHeight,
          taxContainerHeight: 0,
        });
      }
    );
  };

  addMarginDis = val => {
    this.setState({ addMargin: val });
  };

  addHeightForTax = val => {
    this.setState({ taxContainerHeight: val });
  };

  addHeightFromSavedTax = val => {
    this.setState({ taxFromSavedContainerHeight: val });
  };

  deleteProduct = product => {
    const { delete_product } = this.props;
    delete_product(product);
  };

  forceUpdateHandler() {
    this.forceUpdate();
  }

  closeAllExcept = () => {
    //alert('item to close : ' + this.props.nextToClose || ' is null yet')
    //this.setState({detailVisible: this.props.leaveOpened != this.props.item.id ? false: true})
    if (this.props.nextToClose == this.props.item.id) {
      //alert('true thisprops')
      this.setState({ detailVisible: false }, () => {
        this.setState({
          heightCard: 0,
          marginTopCard: 0,
          marginBottomCard: 0,
          tempHeight: this.state.taxContainerHeight,
          taxContainerHeight: 0,
        });
      });
      return;
    }

    this.setState({ detailVisible: !this.state.detailVisible }, () => {
      this.setState({
        heightCard: this.state.detailVisible
          ? hp('42%') + this.state.taxContainerHeight
          : 0,
        marginTopCard: this.state.detailVisible ? hp('1%') : 0,
        marginBottomCard: this.state.detailVisible ? hp('2.5%') : 0,
        tempHeight: this.state.detailVisible
          ? 0
          : this.state.taxContainerHeight,
        taxContainerHeight: this.state.detailVisible
          ? this.state.tempHeight
          : 0,
      });
    });
  };

  render() {
    const swipeBtns = [
      {
        component: (
          <TextMontserrat
            style={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
              color: '#D0021B',
              fontWeight: '600',
              fontSize: this.state.orientation ? wp('4%') : hp('2%'),
            }}
          >
            Delete
          </TextMontserrat>
        ),
        backgroundColor: '#FFACB6',
        onPress: () => {
          this.props.item.deleteItem();
          // this.deleteProduct(this.props.item);

          // let allproducts = realm.objects('Product');
          // let updateP = allproducts.filtered(`id = ${this.props.item.id}`);
          // let toUpdate = updateP[0];

          // realm.write(() => {
          //   realm.delete(toUpdate);
          // });

          // this.props.updateList();
          // //this.forceUpdateHandler();
        },
      },
    ];

    const {
      id,
      name,
      quantity,
      unitPrice,
      total,
      discount,
      type,
      calculatedDiscount,
      discountType,
      discountEntered,
    } = this.props.item;
    const lastOne = this.props.dataLength - 1 == this.props.index;
    console.log(this.props.item);
    return (
      <View
        style={{
          alignItems: 'center',
          marginTop: hp('0.5%'),
          marginBottom: lastOne
            ? this.state.orientation
              ? hp('12%')
              : hp('15%')
            : hp('1%'),
          //backgroundColor: this.props.nextToClose != this.props.item.id ? '#174285' : '#fff',
        }}
      >
        <Swipeout
          sensitivity={1}
          right={swipeBtns}
          autoClose={true}
          disabled={this.props.temporaly}
          backgroundColor={'transparent'}
          buttonWidth={hp('11%')}
          onOpen={() => {}}
          onClose={() => {}}
        >
          <TouchableOpacity
            disabled={this.props.temporaly}
            onPress={() => {
              // this.props.closeItemsExcept(this.props.item.id);
              // this.closeAllExcept();
              this.setState(
                {
                  detailVisible: !this.state.detailVisible,
                },
                () => {
                  this.setState(
                    {
                      heightCard: this.state.detailVisible
                        ? hp('42%') + this.state.taxContainerHeight
                        : 0,
                      marginTopCard: this.state.detailVisible ? hp('1%') : 0,
                      marginBottomCard: this.state.detailVisible
                        ? hp('2.5%')
                        : 0,
                      tempHeight: this.state.detailVisible
                        ? 0
                        : this.state.taxContainerHeight,
                      taxContainerHeight: this.state.detailVisible
                        ? this.state.tempHeight
                        : 0,
                    },
                    () => {
                      if (this.props.dataLength === this.props.index + 1)
                        this.props.scrollToEnd();
                    }
                  );
                }
              );
            }}
          >
            <View>
              <View style={styles.container}>
                <Text
                  style={[
                    styles.textProductDefault,
                    styles.TextGrayProductIndex,
                  ]}
                >
                  {this.props.index + 1}.
                </Text>
                <Text
                  style={[styles.textProductDefault, styles.TextGrayProduct]}
                  numberOfLines={1}
                >
                  {name}
                </Text>
                <Text style={[styles.textProductDefault, styles.TextGray]}>
                  {quantity}
                </Text>
                <Text
                  style={[styles.textProductDefault, styles.TextBlueProduct]}
                  numberOfLines={1}
                >
                  ₹
                  {formatNumberCommasDecimal(
                    parseFloat(quantity * unitPrice).toFixed(2)
                  )}
                </Text>
              </View>
              {discountEntered > 0 ? (
                <View style={styles.container}>
                  <Text
                    style={[
                      styles.textProductDefault,
                      styles.TextGrayProductIndex,
                    ]}
                  />
                  <Text style={styles.productDetailDiscountLabel}>
                    ̶— Discount{' '}
                    {discountType == '%'
                      ? `@ ${parseFloat(discountEntered)}%`
                      : `@ ₹${parseFloat(discountEntered)}`}
                  </Text>
                  <Text style={styles.productDetailDiscountValue}>
                    ₹
                    {type == '%'
                      ? formatNumberCommasDecimal(
                          parseFloat(
                            (unitPrice * quantity * calculatedDiscount) / 100
                          ).toFixed(2)
                        )
                      : formatNumberCommasDecimal(
                          parseFloat(calculatedDiscount).toFixed(2)
                        )}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </Swipeout>
        {this.state.detailVisible && (
          <View
            style={{
              height:
                this.state.heightCard +
                this.state.taxContainerHeight +
                (this.state.detailVisible
                  ? this.state.taxFromSavedContainerHeight
                  : 0) +
                (this.state.heightCard > 0 ? this.state.addMargin : 0),
              alignItems: 'center',
              marginTop: this.state.marginTopCard,
              marginBottom: this.state.marginBottomCard,
              width: '100%',
            }}
          >
            <ScrollView
              style={{ borderRadius: 10,shadowColor: 'black',
              shadowOffset: { width: 10, height: 10},
              shadowOpacity: 1,
              shadowRadius: 2,   elevation: hp('2%') }}
              scrollEnabled={true}
              keyboardShouldPersistTaps={'handled'}
            >
              <EditProduct
                addingHeight={this.addHeightForTax}
                addingHeightFromSaved={this.addHeightFromSavedTax}
                addMargin={this.addMarginDis}
                ref={editComponent => {
                  this.editComponent = editComponent;
                }}
                orientation={this.state.orientation}
                containerStyle={
                  this.state.orientation
                    ? editProductPortrait.containerStyle
                    : editProductLandscape.containerStyle
                }
                contentWidth={
                  this.state.orientation
                    ? editProductPortrait.contentWidth
                    : editProductLandscape.contentWidth
                }
                cameraButtonContainer={
                  this.state.orientation
                    ? editProductPortrait.cameraButtonContainer
                    : editProductLandscape.cameraButtonContainer
                }
                buttonIconSize={this.state.orientation ? '4' : '5'}
                productNameInputSize={
                  this.state.orientation
                    ? { height: '7.8', width: '46.5' }
                    : { height: '7.3', width: '17.7' }
                }
                quantityInputSize={
                  this.state.orientation
                    ? { height: '8', width: '22.5' }
                    : { height: '7.3', width: '10' }
                }
                priceInputSize={
                  this.state.orientation
                    ? { height: '8', width: '46.5' }
                    : { height: '7.3', width: '17.7' }
                }
                discountSelectorSize={
                  this.state.orientation
                    ? { height: '8', width: '70' }
                    : { height: '7.3', width: '27.2' }
                }
                cancelButtonStyle={
                  this.state.orientation
                    ? editProductPortrait.cancelButtonStyle
                    : editProductLandscape.cancelButtonStyle
                }
                saveButtonStyle={
                  this.state.orientation
                    ? editProductPortrait.saveButtonStyle
                    : editProductLandscape.saveButtonStyle
                }
                cameraButtonAction={this.openImagePicker.bind(this)} //{()=>alert('Camera not implemented.')}
                cancelButtonAction={this.closeModal}
                saveButtonAction={() => {}}
                item={this.props.item}
                imageSource={
                  this.state.imagePath === '' ? null : this.state.imagePath
                }
                imageAtributes={{
                  height: this.state.imageHeight,
                  width: this.state.imageWidth,
                }}
                isDetailVisible={this.state.detailVisible}
                closeModal={() => {
                  this.setState(
                    {
                      detailVisible: !this.state.detailVisible,
                    },
                    () => {
                      this.setState({
                        heightCard: this.state.detailVisible
                          ? hp('42%') + this.state.taxContainerHeight
                          : 0,
                        marginTopCard: this.state.detailVisible ? hp('1%') : 0,
                        marginBottomCard: this.state.detailVisible
                          ? hp('2.5%')
                          : 0,
                        tempHeight: this.state.detailVisible
                          ? 0
                          : this.state.taxContainerHeight,
                        taxContainerHeight: this.state.detailVisible
                          ? this.state.tempHeight
                          : 0,
                      });
                    }
                  );
                }}
              />
            </ScrollView>
            <Modal
              visible={this.state.openCameraModal}
              onRequestClose={() => this.setState({ openCameraModal: false })}
              transparent={true}
              animationType="fade"
            >
              <View
                style={{
                  width: '100%',
                  backgroundColor: colors.opacityDin(0.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <View
                  style={{
                    width: isTablet ? '20%' : '80%',
                    height: hp('23%'),
                    elevation: 5,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextMontserrat
                    style={{ fontWeight: '600', fontSize: hp('2.6%') }}
                  >
                    Please enable your camera
                  </TextMontserrat>
                  <TextMontserrat
                    style={{ fontWeight: '600', fontSize: hp('2.6%') }}
                  >
                    from the app settings.
                  </TextMontserrat>
                  <TouchableOpacity
                    onPress={() => this.setState({ openCameraModal: false })}
                    style={{
                      borderRadius: 50,
                      elevation: 9,
                      backgroundColor: 'white',
                      marginTop: hp('3%'),
                      width: '70%',
                      height: hp('6%'),
                    }}
                  >
                    <LinearGradient
                      colors={['#174285', '#0079AA']}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 50,
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TextMontserrat
                          style={styles.textDiscountAddButtonPortrait}
                        >
                          OK
                        </TextMontserrat>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textDiscountAddButtonPortrait: {
    color: 'white',
    fontSize: hp('1.95%'),
    letterSpacing: 1.33,
    textAlign: 'center',
    fontWeight: '600',
  },
  textProductDefault: {
    color: '#555555',
    fontFamily: 'Montserrat-Medium',
    fontSize: isTablet ? hp('2.3%') : hp('2.1%'),
  },
  TextGrayProductIndex: {
    textAlign: 'center',
    width: '15%',
  },
  TextGrayProduct: {
    width: '38%',
    textAlign: 'left',
  },
  TextGray: {
    width: '15%',
    textAlign: 'center',
  },
  productAmount: {
    width: '32%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  TextBlueProduct: {
    color: '#174285',
    width: '32%',
    textAlign: 'right',
    fontFamily: 'Montserrat-SemiBold',
    paddingRight: hp('2.3%'),
  },
  productDetailDiscountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingRight: wp('4.4%'),
  },
  productDetailDiscountLabel: {
    color: '#FD853D',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('1.9%'),
    width: '53%',
    textAlign: 'left',
  },
  productDetailDiscountValue: {
    color: '#FD853D',
    width: '32%',
    textAlign: 'right',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp('1.9%'),
    paddingRight: hp('2.3%'),
  },
});

const mapStateToProps = state => ({
  state: state.cashData,
});

const mapDispatchToProps = dispatch => ({
  delete_product: val => {
    return dispatch(cashActions.delete_product(val));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetail);
