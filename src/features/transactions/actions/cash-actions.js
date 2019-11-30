import {cashConstants} from "../constants/actions"

export const cashActions = {
    sum_amount,
    sum_total,
    back_amount,
    clear_amount,
    change_option,
    add_discount,
    add_delivery,
    remove_delivery,
    remove_discount
};

function sum_amount(value) {
    return { type: cashConstants.SUM_AMOUNT, payload: value };
}

function sum_total() {
    return { type: cashConstants.SUM_TOTAL};
}

function back_amount() {
    return { type: cashConstants.BACK_AMOUNT };
}

function clear_amount() {
    return { type: cashConstants.CLEAR_AMOUNT };
}

function change_option(value) {
    return { type: cashConstants.CHANGE_OPTION, payload: value };
}

function add_discount(value) {
    return { type: cashConstants.ADD_DISCOUNT, payload: value };
}

function add_delivery(value) {
    return { type: cashConstants.ADD_DELIVERY, payload: value };
}

function remove_discount() {
    return { type: cashConstants.REMOVE_DISCOUNT};
}
function remove_delivery() {
    return { type: cashConstants.REMOVE_DELIVERY};
}

