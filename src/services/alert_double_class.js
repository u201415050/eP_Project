import { EventEmitter } from 'events';

export default class AlertDoubleClass extends EventEmitter {
  constructor() {
    super();
    this.visible = false;
    this.reset();
  }
  reset() {
    this.title = '';
    this.message = '';
    this.titleCancel = null;
    this.titleConfirm = null;
    this.negativeAction = () => {};
    this.positiveAction = () => {};
  }
  setPositiveAction(positiveAction) {
    this.positiveAction = positiveAction;
  }
  setNegativeAction(negativeAction) {
    this.negativeAction = negativeAction;
  }
  onPress() {
    this.action();
    this.hide();
  }
  show(title, message, positiveAction, negativeAction, titleConfirm, titleCancel) {
    titleConfirm = titleConfirm || null; 
    titleCancel = titleCancel || null; 
    
    if (title) {
      this.title = title;
    }
    this.message = message;
    if (positiveAction) {
      this.positiveAction = positiveAction;
    }
    if (negativeAction) {
      this.negativeAction = negativeAction;
    }

    if (titleConfirm) {
      this.titleConfirm = titleConfirm;
    }

    if (titleCancel) {
      this.titleCancel = titleCancel;
    }
    this.visible = true;
    this.emit('STATUS_CHANGED', true);
  }
  hide() {
    this.visible = false;
    this.reset();
    this.emit('STATUS_CHANGED', false);
  }
}
