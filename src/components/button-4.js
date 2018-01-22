import React from 'react';
import ReactDOM from 'react-dom';
import constants from '../data.js';
import styles from '../index.css';
import App from './index.js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'


export class Button4 extends React.Component {
  constructor(props) {
   super(props);

   this.handleRulingOn = this.handleRulingOn.bind(this);

}

handleRulingOn(e) {
    const ruling = e.target.value;
    this.props.onChange(ruling);
}



render () {
const check = (
  <FontAwesomeIcon icon={faCheck} />
)
const isRulingOn = this.props.isRulingOn;
return (
  <button className={(isRulingOn) ? "button-on input-group-addon-drop" : "input-group-addon-drop"}
onClick={this.handleRulingOn} >
  {isRulingOn ? check : ''}
  {isRulingOn ? ' 30% ruling' : '30% ruling'}
  </button>
  )}

}
