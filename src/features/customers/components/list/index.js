import React, { Component } from 'react';
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import CustomerRow from './components/customer_row';
import { TextMontserrat } from 'components';
import * as portraitStyles from './styles/portrait';
import * as landscapeStyles from './styles/landscape';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import alert_service from '../../../../services/alert_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

const letterIndexes = {
  A: { letter: 'A', index: 0 },
  B: { letter: 'B', index: 1 },
  C: { letter: 'C', index: 2 },
  D: { letter: 'D', index: 3 },
  E: { letter: 'E', index: 4 },
  F: { letter: 'F', index: 5 },
  G: { letter: 'G', index: 6 },
  H: { letter: 'H', index: 7 },
  I: { letter: 'I', index: 8 },
  J: { letter: 'J', index: 9 },
  K: { letter: 'K', index: 10 },
  L: { letter: 'L', index: 11 },
  M: { letter: 'M', index: 12 },
  N: { letter: 'N', index: 13 },
  O: { letter: 'O', index: 14 },
  P: { letter: 'P', index: 15 },
  Q: { letter: 'Q', index: 16 },
  R: { letter: 'R', index: 17 },
  S: { letter: 'S', index: 18 },
  T: { letter: 'T', index: 19 },
  U: { letter: 'U', index: 20 },
  V: { letter: 'V', index: 21 },
  W: { letter: 'W', index: 22 },
  Y: { letter: 'Y', index: 23 },
  Z: { letter: 'Z', index: 24 },
};

class CustomerList extends Component {
  state = {
    isPortrait: isPortrait(),
  };

  renderItem = ({ item }) => {
    return (
      <CustomerRow item={item} onSelectedItem={this.props.onSelectedItem} />
    );
  };

  renderSectionHeader = ({ section }) => {
    const styles = this.state.isPortrait ? portraitStyles : landscapeStyles;

    return (
      <TextMontserrat style={styles.headerStyles.sectionHeader}>
        {section.title}
      </TextMontserrat>
    );
  };

  renderRows = (sectionItems) => {
    return sectionItems.map( it => {
      return it.data.map( item =>  {
        return <CustomerRow item={item} onSelectedItem={this.props.onSelectedItem} />
      })
    })    
  }

  componentDidUpdate() {}

  getLettersArr = () => {
    const letters = [];
    for (let key in letterIndexes) {
      letters.push(letterIndexes[key]);
    }
    return letters;
    // return this.props.items.map(l => { return l.title })
  };

  searchLetterIndex = (letter) => {
    var letters = this.getTitlesFromList();
    return letters.indexOf(letter)
  }

  getTitlesFromList = () => {
    return this.props.items.map(l => { return l.title })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.items ? (
          <SectionList
            ref={component => (this.sectionList = component)}
            keyboardShouldPersistTaps={'handled'}
            style={{ flex: 1 }}
            sections={this.props.items}
            renderItem={this.renderItem}
            //onEndReachedThreshold={0.1}
            onEndReached={()=>{this.props.updateList(30)}}
            renderSectionHeader={this.renderSectionHeader}
            keyExtractor={(item, index) => `${item.customerId}._${index}`}
          />
        ) : null} 
        <View
          style={
            this.state.isPortrait
              ? {
                  flex: 1,
                  position: 'absolute',
                  right: 0,
                  height: '100%',
                  width: wp('7%'),
                  backgroundColor: 'transparent',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: hp('2%'),
                  top: hp('1%'),
                }
              : {
                  height: '100%',
                  width: wp('3%'),
                  position: 'absolute',
                  right: wp('0.8%'),
                  backgroundColor: 'transparent',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: hp('3%'),
                }
          }
        >
          {
            this.getLettersArr().map(({ letter, index }) => (
              <TouchableWithoutFeedback
                key={`letter_${letter}_${index}`}
                onPress={() => {
                  if(this.getTitlesFromList().includes(letter)){
                    this.sectionList.scrollToLocation({
                      itemIndex: 0,
                      sectionIndex: this.searchLetterIndex(letter),
                    });
                  } else {
                    alert_service.showAlert('There are no customers\' name with selected letter')
                  }
                }}
              >
                  <TextMontserrat
                    style={{
                      flex:1,
                      width: this.state.isPortrait ? wp('7%') : wp('1.8%'),
                      fontSize: this.state.isPortrait ? wp('3%') : hp('1.8%'),
                      fontWeight: '600',
                      color: '#52565F',
                      textAlign: 'center',
                    }}
                  >
                    {letter}
                  </TextMontserrat>
              </TouchableWithoutFeedback>
            )) 
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
});

export default CustomerList;
