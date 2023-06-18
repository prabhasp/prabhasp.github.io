import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import "../global.css";

const spiel = `
# Should you buy points on your mortgage?
(or should you put the money in a high-yield savings account instead?)

It's Q2 2023, and mortgage rates are 7%+. 
Your mortgage broker will probably show a few options to pay points to lower your interest rate. 

A point is a percentage of your loan amount. For example, if you get a loan for $500,000, one point means you pay $5,000 to the lender. 
Each (fraction of a) point will lower your interest rate, and therefore your monthly payment, by some amount.

Question is: Should you buy points? And if so, how much?

## The alternative 

What if, instead of paying points, you put the money in a high-yield savings account?
And then, schedule an automatic mortgage payment -- of the same amount as the monthly points savings.

This is kind of like paying points to yourself.
As long as that savings account balance is positive, you're better off than if you had bought points.

But at some point, because there are monthly payments going out, that account will run out.

This is the **break-even point.**

If you expect to re-finance or sell your house _before_ the break-even point, don't pay these points.
If you expect to do so after, then go ahead.

## Points Calculator
Okay, now that we have the background, let's do the math.

Every field below with a box is a number you can input. 
Ask your mortgage officer for the "full spread" of points between 0 and 2 points -- 
they can give you the points, the interest rate, and the resulting monthly payment per your other loan details. 

`;
const Page = styled.div`
  font-family: "Lato";
  display: flex;
  justify-content: center;

  input {
    text-align: right;
    padding: 5px 0px 5px 5px;
    width: 100px;
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 5px;
  }
`;
const Article = styled.div`
  max-width: 960px;
`;

const Calc = styled.div`
  margin-top: 56px;
  background-color: peachpuff;
  padding: 30px;
`;

const GlobalsGrid = styled.div`
  display: grid;
  width: 50%;
  grid-template-columns: 1fr 1fr; // two columns with equal width
  grid-template-rows: 1fr 1fr 1fr 1fr; // four rows with equal height
  gap: 10px; // adjust as needed
  margin-bottom: 20px;
  label {
    font-weight: 500;
  }
`;

const dlr = amt =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amt);

const Calculator = () => {
  const [mortgageAmount, setMortgageAmount] = useState(675000);
  const [downPayment, setDownPayment] = useState(0.15);
  const [savingsRate, setSavingsRate] = useState(0.04);

  const loanAmount = mortgageAmount * (1 - downPayment);

  return (
    <Calc>
      <GlobalsGrid>
        <label htmlFor="mortgageAmount">Mortgage amount: </label>
        <div>
          {"$ "}
          <input
            type="number"
            min={0}
            max={1e12}
            step={5000}
            value={mortgageAmount}
            onChange={e => setMortgageAmount(Number(e.target.value))}
            style={{ textAlign: "left" }}
          />
        </div>

        <label htmlFor="downPayment">Down payment</label>
        <PercentInput
          pct={downPayment}
          setPct={setDownPayment}
          step={0.5}
          max={50}
        />

        <label htmlFor="loanAmount">Loan amount: </label>
        <input style={{ border: "none" }} readOnly value={dlr(loanAmount)} />

        <label htmlFor="savingsRate">Savings rate (APR): </label>
        <PercentInput
          pct={savingsRate}
          setPct={setSavingsRate}
          step={0.25}
          decimals={2}
        />
      </GlobalsGrid>
      <Rows loanAmount={loanAmount} savingsRate={savingsRate} />
    </Calc>
  );
};

const Table = styled.table`
  width: 100%;

  th {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  tr {
    text-align: right;
  }
  input {
    text-align: right;
  }
`;
const BtnRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
  width: 100%;
  button {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.6);
    border: 1px solid black;
    border-radius: 5px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }
  }
`;

type RowData = {
  points: number;
  interestRate: number;
  monthlyPayment: number;
};
const SampleData = [
  { points: 0, interestRate: 7.25, monthlyPayment: 4632 },
  { points: 0.375, interestRate: 7, monthlyPayment: 4582 },
  { points: 0.75, interestRate: 6.75, monthlyPayment: 4483 },
  { points: 1.25, interestRate: 6.625, monthlyPayment: 4433 },
  { points: 1.5, interestRate: 6.5, monthlyPayment: 4384 },
  { points: 1.75, interestRate: 6.375, monthlyPayment: 4336 }
];

const bem = `
(pointsCost, monthlyPaymentSavings, savingRateAPR) => {

  if (monthlyPaymentSavings < 0 || pointsCost < 0 || savingRateAPR < 0) {
    return -1; // invalid input
  }

  var month = 0,
    savingsAcct = pointsCost; // points cost goes into the savings account

  while (savingsAcct > 0) {
    // add interest, subtract monthly payment
    savingsAcct += savingsAcct * (savingRateAPR / 12) - monthlyPaymentSavings;
    month++;
  }

  return month;

}`;
const breakEvenMonths = eval(bem);

const Rows = ({
  loanAmount,
  savingsRate
}: {
  loanAmount: number;
  savingsRate: number;
}) => {
  const [rows, setRows] = useState<Array<RowData>>(SampleData);

  const handleInputChange = (e, rowIndex, fieldName) => {
    const newValue = e.target.value;
    setRows(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: newValue } : row
      )
    );
  };

  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    setRows([
      ...rows,
      {
        points: lastRow.points + 0.25,
        interestRate: lastRow.interestRate - 0.125,
        monthlyPayment: lastRow.monthlyPayment - 50
      }
    ]);
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Points</th>
            <th>Interest Rate</th>
            <th>Monthly Payment</th>
            <th>Points Cost</th>
            <th>Monthly Points Saving</th>
            <th>Break-even Months</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const pointPayment = row.points
              ? (row.points / 100) * loanAmount
              : 0;
            const monthlyPaymentDelta =
              rows[0].monthlyPayment - row.monthlyPayment;
            return (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="number"
                    step={0.025}
                    min={0}
                    max={5}
                    value={row.points}
                    onChange={e => handleInputChange(e, rowIndex, "points")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.interestRate}
                    min={savingsRate * 100}
                    max={savingsRate * 100 * 4}
                    step={0.125}
                    onChange={e =>
                      handleInputChange(e, rowIndex, "interestRate")
                    }
                  />
                </td>
                <td>
                  {"$ "}
                  <input
                    type="number"
                    value={row.monthlyPayment}
                    step={10}
                    max={rows[0].monthlyPayment - 0.1}
                    onChange={e =>
                      handleInputChange(e, rowIndex, "monthlyPayment")
                    }
                  />
                </td>
                <td>{dlr(pointPayment)}</td>
                <td>{dlr(monthlyPaymentDelta)}</td>
                <td>
                  {breakEvenMonths(
                    pointPayment,
                    monthlyPaymentDelta,
                    savingsRate
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <BtnRow>
        <button onClick={addRow} style={{ flexGrow: 1 }}>
          Add Row
        </button>
        <button onClick={() => setRows(SampleData)}>Reset</button>
      </BtnRow>
    </div>
  );
};

const PercentInput = ({
  pct,
  setPct,
  step = 0.01,
  min = 0,
  max = 100,
  decimals = 0
}: {
  pct: number;
  setPct: (pct: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
}) => {
  return (
    <div>
      <input
        type="number"
        step={step}
        max={max}
        min={min}
        value={(pct * 100).toFixed(decimals)}
        onChange={e => {
          setPct(Number(e.target.value) / 100);
        }}
      />
      {" %"}
    </div>
  );
};
const footer = `
## Epilogue: the formula

Most of these calculations are simple; calculating the break-even is the only involved part. 
The math we use above is this:
`;

const NewPage = () => {
  return (
    <Page>
      <Article>
        <ReactMarkdown children={spiel} />
        <Calculator />
        <ReactMarkdown children={footer} />
        <pre>
          <code>{bem}</code>
        </pre>
      </Article>
    </Page>
  );
};

export default NewPage;
