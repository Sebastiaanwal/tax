import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'

export class Button2 extends React.Component {
  constructor(props) {
   super(props);

   this.handleOlderOn = this.handleOlderOn.bind(this);
}

handleOlderOn(e) {
    const older = e.target.value;
    this.props.onChange(older);
}

render () {
  const check = (
    <FontAwesomeIcon icon={faCheck} />
  )
const isOlderOn = this.props.isOlderOn;

return (
  <button className={(isOlderOn) ? "button-on input-group-addon-drop" : "input-group-addon-drop"} onClick={this.handleOlderOn} >
  {isOlderOn ? check : ''}
  {isOlderOn ? ' Older than 65' : 'Older than 65'}
  </button>
  )}

}
