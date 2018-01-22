import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'


export class Button3 extends React.Component {
  constructor(props) {
   super(props);

   this.handleSocialOn = this.handleSocialOn.bind(this);

}

handleSocialOn(e) {
    const social = e.target.value;
    this.props.onChange(social);
}



render () {
const check = (
  <FontAwesomeIcon icon={faCheck} />
)
const isSocialOn = this.props.isSocialOn;
return (
  <button className={(isSocialOn) ? "button-on input-group-addon-drop" : "input-group-addon-drop"}
onClick={this.handleSocialOn} >
  {isSocialOn ? check : ''}
  {isSocialOn ? ' Social security' : 'Social security'}
  </button>
  )}

}
