import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { portraitStyles } from './styles/portrait';
import { landscapeStyles } from './styles/landscape';
import Option from '../option';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class TableOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: isPortrait(),
    };
  }

  groupingOptions = (arrayOptions, count, extras) => {
    var groupedOptions = [];
    var tempArray = [];

    for (i = 0, length = arrayOptions.length; i < length; i++) {
      if ((i + 1) % count == 0) {
        tempArray.push(arrayOptions[i]);
        groupedOptions.push(tempArray);
        tempArray = [];
      } else {
        tempArray.push(arrayOptions[i]);
      }
    }

    var resting = arrayOptions.length % count;
    const extra = { label: '' };

    tempArray = [];
    while (resting > 0) {
      tempArray.push(arrayOptions[arrayOptions.length - resting]);
      resting -= 1;
    }

    if (extras) {
      while (tempArray.length < count) {
        tempArray.push(extra);
      }
    }

    if (tempArray.length > 0) groupedOptions.push(tempArray);

    return groupedOptions;
  };

  renderTable = options => {
    return options.map((item, mainIndex) => {
      return (
        <View key={`${mainIndex}`} style={{ flexDirection: 'row', flex: 1 }}>
          {item.map((option, subIndex) => {
            return (
              <Option
                key={`${mainIndex + '-' + subIndex}`}
                position={mainIndex + '-' + subIndex}
                icon={option.logo}
                label={option.label}
                enabled={option.enabled}
                item={option}
                navigate={this.props.navigate}
                lastItem={options[mainIndex].length - 1 == subIndex}
                lastRow={options.length - 1 == mainIndex}
              />
            );
          })}
        </View>
      );
    });
  };

  renderDivider = (orientation, styles) => {
    return orientation ? (
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
    ) : (
      <View style={styles.dividerInnerHolder}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>
      </View>
    );
  };

  render() {
    const styles = this.state.orientation ? portraitStyles : landscapeStyles;

    return (
      <View style={styles.container}>
        {/* { this.state.orientation &&
          <View style={styles.dividerHolder}>
            {
              this.renderDivider(this.state.orientation, styles)
            }
          </View>
        } */}
        <View style={{ height: '100%', width: '100%' }}>
          {this.renderTable(
            this.groupingOptions(
              this.props.options,
              this.state.orientation ? 2 : 3,
              true
            )
          )}
        </View>
      </View>
    );
  }
}

export default TableOptions;
