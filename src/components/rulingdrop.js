import React from 'react';

export class RulingDrop extends React.Component {
  constructor(props) {
   super(props);
   this.state = {color: 'aqua'};

   this.handleUpdateRuling = this.handleUpdateRuling.bind(this);
}

handleUpdateRuling(e) {
    const ruling = e.target.value;
    this.props.onChange(ruling);
}

render () {
  return (
<label>
<select className="input-group-addon-drop"
    onChange={ e => this.handleUpdateRuling(e) }>
    <option value={"OFF"}>No 30 ruling</option>
    <option className="button-on" value={"normal"}>Standard ruling</option>
    <option value={"young"}>Younsters</option>
    <option value={"research"}>Researchers</option>
  </select>
</label>
)}

}
