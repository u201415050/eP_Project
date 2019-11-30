import React, { Component } from 'react';
import { Dimensions,View, Text, StyleSheet, ImageBackground,TouchableOpacity,Image,FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ProductDetail from './productDetails';

class List extends Component {
    render() {
        const {products} = this.props
        return (
            <FlatList
                  style={{flexGrow: 0}}
                  keyboardShouldPersistTaps={'handled'}
                  keyExtractor={(item, index) => item + index}
                  data={products}
                  scrollEnabled={true} 
                  renderItem={({item,index}) =>     
                    <ProductDetail
                      parentFlatList={this}
                      index={index}
                      item={item} />
                    }
            />    
        );
    }
}

const styles = StyleSheet.create({
    container: {
          flex:6,
          flexDirection:'column',
    },
});

export default List;
