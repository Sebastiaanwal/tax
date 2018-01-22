import React from 'react';

export class YearDrop extends React.Component {
  constructor(props) {
   super(props);

   this.handleUpdateYears = this.handleUpdateYears.bind(this);
}

handleUpdateYears(e) {
    const year = e.target.value;
    this.props.onChange(year);
}

render () {
  return (
<label>
<select className="input-group-addon-drop"
    onChange={ e => this.handleUpdateYears(e) }>
    <option value={"2017"}>Tax Year 2017/18</option>
    <option value={"2016"}>Tax Year 2016/17</option>
    <option value={"2015"}>Tax Year 2015/16</option>
  </select>
</label>
)}

}
