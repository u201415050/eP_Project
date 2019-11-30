import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { TextMontserrat } from 'components';
import EStyleSheet from 'react-native-extended-stylesheet';
import ProductsHeader from './components/products_header/products_header';
import ProductsItem from './components/products_item/products_item';
import {formatNumberCommasDecimal} from 'api';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
class TransactionDetails extends Component {
  SHOW_MORE_ARROW_DOWN = require('../../../../assets/icons/arrow_show_more.png');
  CART_ICON = require('../../../../assets/icons/Cart.png');
  state = {
    expanded: false,
    animation: new Animated.Value(1),
  };
  _setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height,
    });
  }
  _setMinHeight(event) {
    this.setState({
      minHeight: 5,
    });
  }
  toggle() {
    //Step 1
    let initialValue = this.state.expanded
        ? this.state.maxHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight;

    this.setState({
      expanded: !this.state.expanded, //Step 2
    });

    this.state.animation.setValue(initialValue); //Step 3
    Animated.spring(
      //Step 4
      this.state.animation,
      {
        toValue: finalValue,
      }
    ).start(); //Step 5
  }

  render() {
    const {data,foot}=this.props
    const products = data.products
    const {subTotalDiscount,finalDiscount,totalDelivery,CGST,Total} = foot



    return (
      <View style={styles.transactionDetailsContainer}>
        <View style={styles.transactionDetails}>
          <View style={styles.detailsIcon}>
            <View>
              <View style={styles.badge}>
                <TextMontserrat style={styles.badgeText}>{products.length}</TextMontserrat>
              </View>
              <Image source={this.CART_ICON} />
            </View>
          </View>
          <View style={styles.detailsDescription}>
            <TextMontserrat
              style={{
                ...styles.detailsDescriptionText,
                ...styles.detailsDescriptionTextName,
              }}
            >
              Guest
            </TextMontserrat>
            <TextMontserrat style={styles.detailsDescriptionText}>
              Invoice No. 12345
            </TextMontserrat>
          </View>
          <View style={styles.detailsDate}>
            <TextMontserrat
              style={{
                ...styles.detailsDateText,
                ...styles.detailsDateTextFull,
              }}
            >
              10 Jan 2019
            </TextMontserrat>
            <TextMontserrat style={styles.detailsDescriptionText}>
              10:52 AM
            </TextMontserrat>
          </View>
        </View>

        <Animated.View
          style={[
            {
              backgroundColor: '#fff',
              overflow: 'hidden',
            },
            { height: this.state.animation },
          ]}
        >
          <View>
            <View
              style={styles.productsView}
              onLayout={this._setMaxHeight.bind(this)}
            >
              <ProductsHeader />
              {products.map((item,i)=>{
                 return <ProductsItem key={i} product={item}/>
              })}

              <View style={totalsStyle.container}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextMontserrat style={totalsStyle.subtotal}>
                    Sub Total
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      ...totalsStyle.subtotal,
                      color: TEXT_COLOR_ACTIVE,
                    }}
                  >
                    ₹{formatNumberCommasDecimal(parseFloat(subTotalDiscount).toFixed(2))}
                  </TextMontserrat>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextMontserrat style={totalsStyle.discount}>
                    Discount
                  </TextMontserrat>
                  <TextMontserrat style={totalsStyle.discount}>
                    ₹{formatNumberCommasDecimal(parseFloat(finalDiscount).toFixed(2))}
                  </TextMontserrat>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextMontserrat style={totalsStyle.cgst}>
                    Delivery Charge
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      ...totalsStyle.cgst,
                      color: TEXT_COLOR_ACTIVE,
                    }}
                  >
                    ₹{formatNumberCommasDecimal(parseFloat(totalDelivery).toFixed(2))}
                  </TextMontserrat>
                </View>
                {/*<View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextMontserrat style={totalsStyle.cgst}>
                    CGST @ 9%
                  </TextMontserrat>
                  <TextMontserrat
                    style={{
                      ...totalsStyle.cgst,
                      color: TEXT_COLOR_ACTIVE,
                    }}
                  >
                    ₹{formatNumberCommasDecimal(parseFloat(CGST).toFixed(2))}
                  </TextMontserrat>
                  </View>*/}
              </View>
            </View>
          </View>
        </Animated.View>
        <View style={styles.transactionAmount}>
          <View style={styles.totalAmountText}>
            <TextMontserrat style={styles.textAmount}>
              Total Amount
            </TextMontserrat>
          </View>
          <View style={styles.totalAmountValue}>
            <TextMontserrat
              style={{ ...styles.textAmount, ...styles.textAmountValue }}
            >
              ₹{formatNumberCommasDecimal(parseFloat(Total).toFixed(2))}
            </TextMontserrat>
          </View>
        </View>

        <TouchableOpacity
          style={styles.showMore}
          activeOpacity={0.6}
          onPress={this.toggle.bind(this)}
          onLayout={this._setMinHeight.bind(this)}
        >
          <View style={{justifyContent:'center'}}>
          <TextMontserrat style={styles.showMoreText}>
            SHOW {this.state.expanded ? 'LESS' : 'MORE'}
          </TextMontserrat>
          <Image
            style={{
              position:'absolute',
              right: -hp('3.2%'),
              
              height:hp('1.8%')*0.6,
              width:hp('1.8%'),
              marginHorizontal: 5,
              transform: [{ rotate: this.state.expanded ? '180deg' : '0deg' }],
            }}
            source={this.SHOW_MORE_ARROW_DOWN}
          /></View>
        </TouchableOpacity>
      </View>
    );
  }
}

const TEXT_COLOR = '#47525D';
const TEXT_COLOR_LIGHT = '#5D6770';
const TEXT_COLOR_ACTIVE = '#174285';
const headerStyle = EStyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: '2rem',
  },
  headerText: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#FF6000',
  },
});

const totalsStyle = EStyleSheet.create({
  container: {
    paddingHorizontal: '2rem',
    paddingTop: '.5rem',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  subtotal: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  cgst: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  discount: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#FF6000',
  },
});
const styles = EStyleSheet.create({
  $height: 45,
  transactionDetailsContainer: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 3,
    elevation: 3,
  },
  textAmount: {
    fontWeight: 'bold',
    fontSize: '2rem',
    color: TEXT_COLOR,
  },
  textAmountValue: {
    color: TEXT_COLOR_ACTIVE,
  },
  transactionDetails: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    paddingRight: '2rem',
    paddingVertical: '1rem',
  },
  detailsIcon: {
    height: '$height',
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsDescription: {
    flex: 4,
    height: '$height',
    justifyContent: 'space-around',
  },
  detailsDescriptionText: {
    fontSize: '1.4rem',
    fontWeight: '600',
    color: TEXT_COLOR_LIGHT,
  },
  detailsDescriptionTextName: {
    fontSize: '1.9rem',
  },
  detailsDate: {
    flex: 2,
    height: '$height',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  detailsDateText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  detailsDateTextFull: {
    fontSize: '1.5rem',
  },
  transactionAmount: {
    paddingHorizontal: '2rem',
    paddingBottom: '.5rem',
    borderBottomWidth: 1,
    borderColor: TEXT_COLOR_ACTIVE,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showMore: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.5rem',
    flexDirection: 'row',
  },
  showMoreText: {
    fontWeight: '600',
    color: TEXT_COLOR_ACTIVE,
    fontSize: '1.1rem',
  },
  badge: {
    position: 'absolute',
    top: '-1rem',
    right: '-.7rem',
    backgroundColor: TEXT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: '.3rem',
    zIndex: 99,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: '600',
    zIndex: 99,
  },
  productsView: {
    // height: '3.8rem * 3',
  },
});
export default TransactionDetails;
