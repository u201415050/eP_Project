import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  SectionList,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "api";
import Icon from "react-native-vector-icons/FontAwesome";
import { FloatingTextInput } from "./index";
import { CountryItem } from "./components";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
// import ExtraDimensions from "react-native-extra-dimensions-android";
import { countries } from "./api/countries";

class PhoneInput extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    let currentLetter;
    let letters = [];
    const letterIndexes = {};
    countries.map(({ name }, index) => {
      if (!currentLetter) {
        currentLetter = {
          letter: name.charAt(0),
          start: 0
        };
      }
      const itemLetter = name.charAt(0) === "Å" ? "A" : name.charAt(0);
      if (itemLetter !== currentLetter.letter) {
        currentLetter["end"] = index;
        letters.push(currentLetter);
        currentLetter = {
          letter: name.charAt(0),
          start: index
        };
      }
    });

    let letterI = 0;
    const sections = letters.map(({ letter, start, end }) => {
      letterIndexes[letter] = {
        letter: letter,
        index: letterI
      };
      letterI++;
      return {
        title: letter,
        data: countries.slice(start, end)
      };
    });

    this.setState({ sections, countries, dataToShow: sections, letterIndexes });
  }

  state = {
    touched: false,
    isModalVisible: false,
    letterIndexes: {},
    phone: "",
    countries: [],
    sections: [],
    dataToShow: [],
    selectedCountry: {
      flag: "https://www.countryflags.io/af/flat/64.png",
      callingCodes: ["93"],
      name: "Afghanistan"
    }
  };

  getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => 36,
    getSeparatorHeight: () => 12
  });

  getLettersArr = () => {
    const letters = [];
    const { letterIndexes } = this.state;
    for (key in letterIndexes) {
      letters.push(letterIndexes[key]);
    }
    return letters;
  };
  renderLetters = () => {
    const { letterIndexes } = this.state;
    const letters = [];
    for (key in letterIndexes) {
      const { letter, index } = letterIndexes[key];
      letters.push(
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(this.myFlatList);
            this.myFlatList.scrollToLocation({
              itemIndex: 0,
              sectionIndex: index
            });
          }}
        >
          <Text style={{ fontSize: 20 }}>{letter}</Text>
        </TouchableWithoutFeedback>
      );
    }
    return letters;
  };

  handleSearch = term => {
    let matchedItemsArray = [];
    if (term === "") {
      this.setState({
        search: false,
        dataToShow: this.state.sections
      });
    } else {
      this.state.countries.map(item => {
        if (item.name.toLowerCase().includes(term.toLowerCase())) {
          matchedItemsArray.push(item);
        }
      });
      this.setState({
        search: true,
        dataToShow: [
          {
            title: `Results for "${term}"`,
            data: matchedItemsArray
          }
        ]
      });
    }
  };

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  _selectCountryCode = (item) => {
    this.setState({ 
      selectedCountry: item,
      touched:true
    }, this.onChange({
      alpha2Code: item.alpha2Code,
      callingCode: item.callingCodes[0],
      phone: this.state.phone,
    }))
    
  }

  _changeText = (v) => {
    this.setState({ phone: v })
    this.onChange({
      alpha2Code: this.state.selectedCountry.alpha2Code,
      callingCode: this.state.selectedCountry.callingCodes[0],
      phone: v
    });
  }

  onChange = (payload) => {
    if(this.props.onChange) {
      this.props.onChange(payload)
    }
  }

  render() {
    const { callingCodes, flag, name } = this.state.selectedCountry;
    const { phone } = this.state;

    const {
      modalContainer,
      modalHeader,
      countryCodeContainer,
      modalHeaderText,
      modalCloseButton
    } = styles;
    return (
      <View>
        <View style={{ flexDirection: "row"}}>
            <FloatingTextInput
              label="Mobile"
              phone={true}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={this._changeText}
              focus={this.state.touched}
              {...this.props}
            >
              <TouchableOpacity onPress={this._toggleModal}>
                <View style={countryCodeContainer}>
                  <View>
                    <Image
                      source={{ uri: flag }}
                      style={{ width: 30, height: 25 }}
                    />
                  </View>
                  <View style={{ paddingHorizontal: 5 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "#6b6b6b",
                        bottom: 2
                      }}
                    >{`+${callingCodes[0]}`}</Text>
                  </View>
                  <View>
                    <Icon name={"angle-down"} size={25} />
                  </View>
                </View>
              </TouchableOpacity>
            </FloatingTextInput>
        </View>

        <Modal
          isVisible={this.state.isModalVisible}
          style={{ margin: 0 }}
          swipeDirection={"down"}
          onSwipe={this._toggleModal}
        >
          <View style={modalContainer}>
            <View style={modalHeader}>
              <View style={modalCloseButton}>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Icon
                    name={"close"}
                    size={width > 400 ? 30 : 24}
                    color={"white"}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  margin: width > 400 ? 25 : 15
                }}
              >
                <Text style={modalHeaderText}>Select Country/region code</Text>
              </View>
              <View
                style={{
                  width: "94%",
                  backgroundColor: "white",
                  marginBottom: 25,
                  borderRadius: 12,
                  flexDirection: "row"
                }}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Icon name={"search"} size={25} color={Colors.primary} />
                </View>
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <TextInput
                    placeholderTextColor={Colors.primary}
                    placeholder="Search..."
                    style={{
                      fontSize: 20
                    }}
                    onChangeText={term => this.handleSearch(term)}
                  />
                </View>
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Icon name={"close"} size={20} color={Colors.primary} />
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                marginLeft: 20,
                flex: 1,
                height: "100%",
                marginBottom: 48
              }}
            >
              <CountryItem
                flag={flag}
                selected={true}
                name={name}
                callingCode={callingCodes[0]}
              />
              <View
                style={{
                  flexDirection: "row"
                }}
              >
                <SectionList
                  ref={component => (this.myFlatList = component)}
                  sections={this.state.dataToShow}
                  keyExtractor={(item, index) => `${item.name}_${index}`}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#aaaaaa"
                      }}
                    >
                      {title}
                    </Text>
                  )}
                  renderItem={({
                    item,
                    item: { flag, name, callingCodes }
                  }) => (
                    <CountryItem
                      flag={flag}
                      name={name}
                      callingCode={callingCodes[0]}
                      onPress={() => this._selectCountryCode(item)}
                    />
                  )}
                  getItemLayout={this.getItemLayout}
                />
                <ScrollView
                  style={{
                    position: "absolute",
                    right: 0,
                    paddingHorizontal: 10,
                    width: 35,
                    flex: 1,
                    height: "100%",
                    backgroundColor: "white"
                  }}
                >
                  {this.getLettersArr().map(({ letter, index }) => (
                    <TouchableWithoutFeedback
                      key={`letter_${letter}_${index}`}
                      onPress={() => {
                        this.myFlatList.scrollToLocation({
                          itemIndex: 0,
                          sectionIndex: index
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: Colors.primary
                        }}
                      >
                        {letter}
                      </Text>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const width = Dimensions.get("window").width;

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  modalHeader: {
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    position: "relative",
    elevation: 8,
    shadowOffset: {
      width: 5,
      height: 10
    },
    shadowColor: "black",
    shadowOpacity: 1
  },
  modalCloseButton: {
    position: "absolute",
    top: width > 400 ? 26 : 16,
    right: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  modalHeaderText: {
    color: "white",
    fontSize: width > 400 ? 24 : 18,
    fontWeight: "bold"
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  }
};

export default PhoneInput;
