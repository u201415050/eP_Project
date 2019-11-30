import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProductDetail from './productDetails';
import ItemList from '../../ItemList';
import NavigationService from '../../../../../../../services/navigation';
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      itemOpened: -1,

      prevSelected: -1,
      selected: -1,

      offset: 0,
    };
    NavigationService.history.on('DRAWER_CLOSED', () => {
      this.setState({ selected: null });
    });
  }

  updateList = () => {
    this.setState({ update: true });
  };

  closeThisItem = index => {
    this.setState({ itemOpened: index });
  };

  scrollToLastItem = () => {
    this.customerFlatList.scrollToEnd({ animated: true });
    //this.customerFlatList.scrollToOffset({offset: 2000, animated: true});

    //         ref={ref => (this.listView = ref)}
    // onLayout={event => {
    //     this.listViewHeight = event.nativeEvent.layout.height;
    // }}
    // onContentSizeChange={() => {
    //     this.listView.scrollTo({
    //         y: this.listView.getMetrics().contentLength - this.listViewHeight
    //     });
    // }}
  };

  settingOffset = (value) => {
    this.setState({offset: value})
    // alert('slected: '+this.state.selected+'  -  prev: '+this.state.prevSelected)
  }

  render() {
    const { customItems,temporaly } = this.props;

    return (
      <FlatList
        ref={ref => (this.customerFlatList = ref)}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={(item, index) => `${index}`}
        data={customItems}
        scrollEnabled={true}
        extraData={this.props}
        renderItem={({ item, index }) => (
          <ItemList
            selected={this.state.selected}
            select={selected => {
              // this.setState({prevSelected: this.state.selected},()=>this.setState({ selected }))
              this.setState({ selected });
            }}
            temporaly={temporaly}
            order={this.props.order}
            index={index}
            item={item}
            lastItem={(customItems.length-1)==index}
            scrollToEnd={
              () =>
              this.customerFlatList.scrollToEnd({ animated: true })
            }
            scrollToIndex={()=>{
              this.customerFlatList.scrollToIndex({
                  animated: true,
                  index: index,
                  viewOffset: 
                    (this.state.selected != -1 && 
                      this.state.selected != null ) ? this.state.offset : 0,
                  viewPosition: 0
              })
            }}
            settingOffset={this.settingOffset.bind(this)}
          />
          // <ProductDetail
          //   closeItemsExcept={this.closeThisItem.bind(this)}
          //   nextToClose={this.state.itemOpened}
          //   scrollToEnd={this.scrollToLastItem.bind(this)}
          //   updateList={this.updateList}
          //   dataLength={customItems.length}
          //   parentFlatList={this}
          //   index={index}
          //   item={item}
          // />
        )}
      />
    );

    //old flatlist
    // return (
    //   <FlatList
    //     ref={ref => (this.customerFlatList = ref)}
    //     style={{ flex: 1 }}
    //     keyboardShouldPersistTaps={'handled'}
    //     keyExtractor={(item, index) => index}
    //     data={products}
    //     scrollEnabled={true}
    //     // getItemLayout={(data, index) => {
    //     //     console.log("get item layout " + index)
    //     //     return { length: 40, offset: 40 * index, index }
    //     // }}
    //     extraData={this.props}
    //     //onViewableItemsChanged={()=>{}}
    //     renderItem={({ item, index }) => (
    //       <ProductDetail
    //         closeItemsExcept={this.closeThisItem.bind(this)}
    //         nextToClose={this.state.itemOpened}
    //         scrollToEnd={this.scrollToLastItem.bind(this)}
    //         updateList={this.updateList}
    //         dataLength={products.length}
    //         parentFlatList={this}
    //         index={index}
    //         item={item}
    //       />
    //     )}
    //   />
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    flexDirection: 'column',
  },
});

export default List;
