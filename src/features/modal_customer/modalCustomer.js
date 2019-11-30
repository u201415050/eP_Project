import React, { Component } from 'react';
import { StyleSheet, Modal } from 'react-native';
import ModalFind from './components/ModalFind/modalFind';
import colors from './styles/colors';
import ModalAdd from './components/ModalAdd/modalAdd';
import ModalAddHold from './components/ModalAdd/modalAddHold';
import loading_service from '../../services/loading_service';

class ModalCustomer extends Component {
  state = {
    modalTab: 0,
    values: [],
    number: '',
    fetched:''
  };
  render() {
    const {
      widthModal,
      active,
      closeModal,
      addCustomer,
      permiss,
      list_customers,
      logout,
      verifyCustomer,
    } = this.props;

    let newVal = this.props.customers
      .filter(item => item.otp == null || item.otp == '')
      .map(item => {
        return {
          identity:
            item.firstName.toUpperCase() +
            ' ' +
            item.lastName.toUpperCase() +
            '/' +
            item.phoneNumber,
          points: item.rewardPoints != null ? item.rewardPoints : 0,
        };
      });

    return (
      <Modal
        visible={active}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        {this.state.modalTab == 0 ? (
          <ModalFind
            values={newVal}
            navNextModal={value => {
            
              this.setState({fetched: value },()=>{
                this.setState({modalTab: 1  })
              });
            }}
            addCustomer={addCustomer}
            widthModal={widthModal}
            closeModal={() => {
              this.setState({ modalTab: 0 });
              closeModal();
            }}
            fetchData={(val)=>this.setState({fetched:val})}
            fromHoldTap={this.props.fromHoldTap}
            holdWithCustomer={this.props.holdWithCustomer}
          />
        ) : !this.props.fromHoldTap ? (
          <ModalAdd
            logout={logout}
            list_customers={()=>{}}
            permiss={permiss}
            fetched={this.state.fetched}
            numberAdd={this.state.number}
            values={newVal}
            verifyCustomer={()=>{}}
            addCustomer={addCustomer}
            widthModal={widthModal}
            closeModal={() => {
              this.setState({ modalTab: 0 });
              closeModal();
            }}
          />
        ) : (
          <ModalAddHold
            isModal={true}
            fetched={this.state.fetched}
            addCustomer={val => {
              loading_service.showLoading();
              this.props.addCustomer(val);
              setTimeout(() => this.props.holdWithCustomer(val), 500);
              this.setState({modalHold:false, modalTab: 0 });
              loading_service.hideLoading();

              closeModal();
            }}
            holdAction={() => {} /*this.onHoldPress*/}
            active={this.state.modalHold}
            closeModal={() => {
              this.setState({ modalTab: 0 });
              closeModal();
            }}
          />
        )}
      </Modal>
    );
  }
}

export default ModalCustomer;
