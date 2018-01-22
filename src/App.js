import React, { Component } from 'react';
import styles from './index.css';
import { YearDrop } from './components/yeardrop.js';
import { Button2 } from './components/button-2.js';
import { Button3 } from './components/button-3.js';
import {Button1} from './components/button1.js';
import {Table} from './components/table.js';
import TransitionGroup from 'react-addons-transition-group';
import {RulingDrop} from './components/rulingdrop.js';

export class App extends React.Component {
    constructor(props) {
    super(props);

    this.state = {
      baseSalary: 36000,
      year: "2017",
      isOlderOn: false,
      isSocialOn: true,
      period: 1,
      isToggleOn: true,
      isRuling: "OFF"
    };

    this.updateContent = this.updateContent.bind(this);
    this.showCalculation = this.showCalculation.bind(this);
    this.updateYears = this.updateYears.bind(this);
    this.updateOlder = this.updateOlder.bind(this);
    this.updateSocial = this.updateSocial.bind(this);
    this.updateRuling = this.updateRuling.bind(this);
    this.updateYears = this.updateYears.bind(this);
  }

  updateContent(e, prop) {
    this.setState({
      [prop]: e.currentTarget.value ? e.currentTarget.value : 0
    });
  }

  updateYears(newYear) {
    this.setState({
        year: newYear
      });
    }

  showCalculation() {
     this.setState(prevState => ({
       isToggleOn: !prevState.isToggleOn
     }));
   }

   updateOlder() {
      this.setState(prevState => ({
        isOlderOn: !prevState.isOlderOn
      }));
    }

    updateSocial() {
       this.setState(prevState => ({
         isSocialOn: !prevState.isSocialOn
       }));
     }
     updateRuling(newRuling) {
        this.setState({
          isRuling: newRuling
        });
      }

  render() {

    return (
<div className="container">
  <div className="sub">
      <img src={require('./Taxdoctor-logo.svg')}/>
      <h1>The no-nonsense Dutch income tax calculator.</h1>
      <h2>No information overload. Just a simple Dutch income tax calculator.</h2>
  </div>
  <hr />

      <div className="sub bounce">
        <h2>I earn (pre-tax)</h2>
        <div className="input-group">
            <span className="input-group-addon">€</span>
            <input className="input-group-addon"
            type="text"
            defaultValue={ this.state.baseSalary }
            onChange={ e => this.updateContent(e, 'baseSalary') }/>

             <select className="input-group-addon-drop"
                onChange={ e => this.updateContent(e, 'period') }>
                <option value={1}>per year</option>
                <option value={12}>per month</option>
                <option value={52}>per week</option>
                <option value={260}>per day</option>
                <option value={2080}>per hour</option>
              </select>
          </div>


        <hr />
        <div className="sub">

        <div className="row height">
          <div className="col-xs-12 col-md-5">
          <label>Choose your tax year          </label>


          <YearDrop onChange={this.updateYears} />
          </div>
          <div className="col-xs-12 col-md-5">
          <label>Select options          </label>

          <Button2 isOlderOn={this.state.isOlderOn} onChange={this.updateOlder} />
          <Button3 isSocialOn={this.state.isSocialOn} onChange={this.updateSocial} />
</div>
<div className="col-xs-12 col-md-5">

<label>Select 30% ruling options          </label>

          <RulingDrop onChange={this.updateRuling}/>
        </div>
        </div>
      </div>
    </div>
<hr />
    <div className="text-xs-center">

          <TransitionGroup>
               { this.state.isToggleOn && <Button1 isToggleOn={this.state.isToggleOn} onChange={this.showCalculation} />
              }
              </TransitionGroup>
    </div>

              <TransitionGroup component="div" className="none">
              { !this.state.isToggleOn && <Table
                baseSalary={this.state.baseSalary}
                year={this.state.year}
                isOlderOn={this.state.isOlderOn}
                isSocialOn={this.state.isSocialOn}
                period={this.state.period}
                isToggleOn={this.state.isToggleOn}
                isRuling={this.state.isRuling}
                /> }
          </TransitionGroup>
    </div>


    );

  }

}


export default App;
