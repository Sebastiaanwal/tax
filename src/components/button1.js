
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCalculator from '@fortawesome/fontawesome-free-solid/faCalculator'

export class Button1 extends React.Component {
  constructor(props) {
   super(props);
   this.handleCalculation = this.handleCalculation.bind(this);
}

handleCalculation(e) {
    const calculation = e.target.value;
    this.props.onChange(calculation);
}


  render () {

    return <button onClick={this.handleCalculation}  className="input-group-addon-calc" ref={c => this.container = c}>
    <FontAwesomeIcon icon={faCalculator} /> Calculate my income
</button>

  }
}
