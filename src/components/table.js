import React from 'react';
import {TweenMax} from "gsap";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import constants from '../data.js';

export class Table extends React.Component {


componentWillEnter (callback) {
  const el = this.container;
  TweenMax.fromTo(el, 1.5 , {y: 10, opacity: 0}, {y: -40, opacity: 1, onComplete: callback});
}

totalComp() {
   return this.props.baseSalary * this.props.period;
 }

 // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/themaoverstijgend/brochures_en_publicaties/handboek-loonheffingen-2017

 getRates(brackets, salary, type) {
    let amount = 0, tax, delta, percent;
    brackets.some((bracket, index) => {
      delta = (bracket.max) ? bracket.max - bracket.min : Infinity; // Consider infinity when no upper bound

      tax = (type && bracket[type]) ? bracket[type] : bracket['rate'];

      percent = (tax !== 0 && tax > -1 && tax < 1); // Check if rate is percentage or fixed

      if (salary <= delta) {
        if (percent) {
          amount += Math.trunc((salary * 100) * tax) / 100; // Round down at 2 decimal places
        } else {
          amount = tax;
        }
        console.log(index, salary, delta, tax, percent, amount);
        return true; // Break loop when reach last bracket
      } else {
        if (percent) {
          amount += (delta * tax);
        } else {
          amount = tax;
        }
        salary -= delta;
      }
    });
    return amount;
  }

  // Payroll Tax Rates (Loonbelasting)
  // https://www.belastingdienst.nl/bibliotheek/handboeken/html/boeken/HL/stappenplan-stap_7_loonbelasting_premie_volksverzekeringen.html
getPayrollTax(year, salary) {
    return -1 * this.getRates(constants.payrollTax[year], salary, 'rate')
}

// Social Security Contribution (Volksverzekeringen - AOW, Anw, Wlz)
// https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/werk_en_inkomen/sociale_verzekeringen/premies_volks_en_werknemersverzekeringen/volksverzekeringen/volksverzekeringen?projectid=98f8c360-e92a-4fe2-aea6-27e9087ce4a1&projectid=98f8c360-e92a-4fe2-aea6-27e9087ce4a1
getSocialTax(year, salary, older) {
   return this.getRates(constants.socialPercent[year], salary, (this.props.isOlderOn) ? 'older' : 'social');
 }

getSocialCheck() {
let taxableYear = this.getTaxableYear();
 return (this.props.isSocialOn) ? -1 * this.getSocialTax(this.props.year, taxableYear) : 0;
}

// 30% Ruling (30%-regeling)
// https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/internationaal/werken_wonen/tijdelijk_in_een_ander_land_werken/u_komt_in_nederland_werken/30_procent_regeling/voorwaarden_30_procent_regeling/u_hebt_een_specifieke_deskundigheid
getRulingIncome(year, isRuling) {
     return constants.rulingThreshold[year][isRuling];
   }


// General Tax Credit (Algemene Heffingskorting)
// https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/
getGeneralCredit(year, salary) {
     return this.getSocialCredit(this.props.year, this.props.isOlderOn, this.props.isSocialOn) * this.getRates(constants.generalCredit[year], salary, 'rate');
        }

  // Labour Tax Credit (Arbeidskorting)
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/
getLabourCredit(year, salary) {
     return this.getSocialCredit(this.props.year, this.props.isOlderOn, this.props.isSocialOn) * this.getRates(constants.labourCredit[year], salary, 'rate');
           }
  // Social Security Contribution (Volksverzekeringen) Component of Tax Credit
  // https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/internationaal/fiscale_regelingen/sociale_zekerheid_bij_grensoverschrijdend_werken_en_ondernemen/hoe_wordt_de_premie_berekend/berekening_premie_volksverzekeringen_heffingskorting_deel_van_het_jaar_premieplichtig/heffingskortingen/
getSocialCredit(year, older, socialSecurity) {
                 /*
                 * JSON properties for socialPercent object
                 * rate: Higher full rate including social contributions to be used to get proportion
                 * social: Percentage of social contributions (AOW + Anw + Wlz)
                 * older: Percentage for retirement age (Anw + Wlz, no contribution to AOW)
                 */
                 let bracket = constants.socialPercent[year][0],
                   percentage = 1;
                 if (!socialSecurity) {
                   percentage = (bracket.rate - bracket.social) / bracket.rate; // Removing AOW + Anw + Wlz from total
                 } else if (older) {
                   percentage = (bracket.rate + bracket.older - bracket.social) / bracket.rate; // Removing only AOW from total
                 }
                 return percentage;
}

getTaxableYear() {
let taxFreeYear = 0;
let taxableYear = 0;
let rulingIncome = this.getRulingIncome(this.props.year, this.props.isRuling);
let grossYear = this.totalComp();
  if (this.props.isRuling === "OFF") {
    taxableYear = this.totalComp();
  } else if (grossYear => rulingIncome) {
    taxFreeYear = grossYear * 0.30;
    taxableYear = (grossYear -= taxFreeYear)
  } if (grossYear < rulingIncome) {
    taxableYear = this.totalComp();
  }
        return taxableYear;
      }

incomeTax() {
 let salaryGross = this.getTaxableYear();

 return -1*(this.getPayrollTax(this.props.year, salaryGross) +
 this.getSocialCheck() +
 this.getGeneralCredit(this.props.year, salaryGross, this.props.isOlderOn) +
 this.getLabourCredit(this.props.year, salaryGross))
}

netIncome() {
 let incomeTaxes = (this.incomeTax() > 0) ? this.incomeTax() : 0
 return this.totalComp() - incomeTaxes
}

generateResults() {
   let salaryGross = this.getTaxableYear();

   return (
    <div>
    <div className="alert margin-t alert-info">
           <FontAwesomeIcon icon={faInfoCircle} /> <span className="bold">Tip!</span> You can edit the form above and see the results in real-time below
           </div>

       <div className="row" >

               <div className="col-md-6 col-xs-12">

          <div className="card card-outline-primary">
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover">
                <tbody>
                  <tr className="headings">
                    <th> </th>
                    <th>Per year</th>
                    <th>Per month</th>
                  </tr>
                  <tr >
                    <td>Taxable income</td>
                    <td >{ "€ " + salaryGross }</td>
                    <td >{ "€ " + (salaryGross/12).toFixed(0) }</td>
                  </tr>
                  <tr >
                    <td>Payroll tax</td>
                    <td >{ "€ " + this.getPayrollTax(this.props.year, salaryGross).toFixed(0) }</td>
                    <td >{ "€ " + (this.getPayrollTax(this.props.year, salaryGross)/12).toFixed(0) }</td>
                  </tr>

                  <tr >
                    <td>Social tax</td>
                    <td >{ "€ " + this.getSocialCheck().toFixed(0)}</td>
                    <td >{ "€ " + (this.getSocialCheck()/12).toFixed(0)}</td>

                  </tr>
                  <tr >
                    <td>General credit</td>
                    <td >{ "€ " + this.getGeneralCredit(this.props.year, salaryGross, this.props.isOlderOn).toFixed(0) }</td>
                    <td >{ "€ " + (this.getGeneralCredit(this.props.year, salaryGross, this.props.isOlderOn)/12).toFixed(0) }</td>
                  </tr>
                  <tr >
                    <td>Labour credit</td>
                    <td >{ "€ " + this.getLabourCredit(this.props.year, salaryGross).toFixed(0) }</td>
                    <td >{ "€ " + (this.getLabourCredit(this.props.year, salaryGross)/12).toFixed(0) }</td>
                  </tr>
                  <tr className="info" >
                    <td>Total deductions</td>
                    <td >{"€ " + this.incomeTax().toFixed(0)}</td>
                    <td >{"€ " + (this.incomeTax()/12).toFixed(0)}</td>
                  </tr>
                  <tr className="primary" >
                    <td>Total after deductions</td>
                    <td >{"€ " + this.netIncome().toFixed(0)}</td>
                    <td >{"€ " + (this.netIncome()/12).toFixed(0)}</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xs-12">
          <div className="text-xs-center card">
            <div className="card-header">Your earnings result</div>
            <div className="card-block"><h3 className="earnings-value">{"€ " + this.netIncome().toFixed(0)}</h3></div>
          </div>
      <div className="share">
        <div className="card card-outline-primary">
          <div className="card-block">
            <div className="col-md-6 col-xs-12">
              <div className="lead">
                Do you find this web app useful?
                <span> share it with the world!</span>

              </div>
              <div className="col-md-6 col-xs-12">
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className="copyright">
    Copyright © 2017-18 <a href="https://www.taxdoctor.nl">TaxDoctor.nl</a>  | All rights reserved
    </p>
  </div>
</div>
</div>
   );
 }

  render () {
  return <div ref={c => this.container = c}>
 { this.generateResults() }</div>

  }
}
