import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { TextMontserrat } from 'components';
import ProductEditModal from '../ProductEditModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ItemRow from './components/item_row';
import DiscountProduct from './components/discount_container';
import Swipeout from 'react-native-swipeout';
import { isTablet } from '../../../../constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: isPortrait(),

      prevSelected: -1,
      selected: -1,
      showEdit: false,
    };
  }

  render() {
    const { temporaly } = this.props;
    const swipeBtns = [
      {
        component: (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextMontserrat
              style={{
                width: '100%',
                textAlign: 'center',
                textAlignVertical: 'center',
                color: '#D0021B',
                fontWeight: '600',
                fontSize: !isTablet ? wp('3.4%') : hp('2%'),
              }}
            >
              Delete
            </TextMontserrat>
          </View>
        ),
        backgroundColor: '#FFACB6',
        onPress: () => {
          this.props.item.deleteItem();
          this.props.order.update();
        },
      },
    ];

    return (
      <View
        style={{
          width: '100%',
        }}
      >
        <Swipeout
          sensitivity={1}
          right={swipeBtns}
          autoClose={true}
          disabled={temporaly}
          backgroundColor={'transparent'}
          buttonWidth={this.state.isPortrait ? wp('18%') : wp('9%')}
          onOpen={() => {}}
          onClose={() => {}}
        >
          <TouchableOpacity
            style={{
              width: '100%',
            }}
            disabled={temporaly}
            onPress={() => {
              // this.props.closeThisItem(this.props.index)
              if (!temporaly) {
                if (this.props.lastItem) {
                  this.props.scrollToEnd();
                } else {
                  this.props.scrollToIndex();
                }

                this.setState(
                  {
                    showEdit: !this.state.showEdit,
                  },
                  () => {
                    this.props.select(
                      this.props.selected === this.props.index
                        ? null
                        : this.props.index
                    );
                  }
                );
              }
            }}
          >
            <ItemRow index={this.props.index + 1} item={this.props.item} />
            {(this.props.item.discountEntered != '' ||
              this.props.item.discountEntered != 0) && (
              <DiscountProduct item={this.props.item} />
            )}
          </TouchableOpacity>
        </Swipeout>
        {this.state.showEdit && this.props.selected === this.props.index && (
          <View>
            <ProductEditModal
              order={this.props.order}
              item={this.props.item}
              close={select => {
                this.setState({ showEdit: false }, () => {
                  if (!select) {
                    this.props.select(null);
                  }
                });
              }}
              settingOffset={this.props.settingOffset}
            />
          </View>
        )}
      </View>
    );
  }
}

export default ItemList;
