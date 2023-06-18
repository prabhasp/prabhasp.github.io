import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const markdown = `
# Should you pay points on your mortgage?
(or should you put the money in a high-yield savings account instead?)


When you get a mortgage, you often have the option to pay points to lower your interest rate. 
Let's understand when paying points is benefitial, and when it's not. 

## What are points?

A point is a percentage of your loan amount. For example, if you get a loan for $500,000, one point means you pay $5,000 to the lender. 
That's going to lower your interest rate (and therefore your monthly payment) by some amount.

## Should I pay points?
To see if this is a good idea, let's think about an alternate scenario. 
What if, instead of paying $5,000 as points, we put it in a high-yield savings account?
Then then, literally paid a set amount from this savings account towards the mortgage.

Those are going to be euivalent, and which comes out on top basically comes down to how long you'll hold the mortgage.

## The calculator
Okay, now that we have the background, let's do the math.
(I recommend making a spreadsheet and saving most of these numbers there as well.)

`;

const dlr = amt =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amt);

// React component
const Calculator = () => {
  const [mortgageAmount, setMortgageAmount] = useState(675000);
  const [downPayment, setDownPayment] = useState(0.2);
  const [savingsRate, setSavingsRate] = useState(0.04);

  const loanAmount = mortgageAmount * (1 - downPayment);

  return (
    <div>
      <div>
        <label htmlFor="mortgageAmount">Mortgage amount: </label>
        $
        <input
          type="number"
          step={10000}
          value={mortgageAmount}
          onChange={e => setMortgageAmount(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="downPayment">Down payment</label>
        <PercentInput pct={downPayment} setPct={setDownPayment} step={1} />
      </div>

      <div>
        <label htmlFor="loanAmount">Loan amount: </label>
        {dlr(loanAmount)}
      </div>

      <div>
        <label htmlFor="savingsRate">Savings rate: </label>
        <PercentInput pct={savingsRate} setPct={setSavingsRate} step={0.5} />
      </div>

      <div>
        <Rows loanAmount={loanAmount} savingsRate={savingsRate} />
      </div>
    </div>
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
    text-align: center;
  }
  input {
    text-align: right;
  }
`;

type RowData = {
  points: number;
  interestRate: number;
  monthlyPayment: number;
};

const Rows = ({
  loanAmount,
  savingsRate
}: {
  loanAmount: number;
  savingsRate: number;
}) => {
  // Initialize with three rows
  const [rows, setRows] = useState<Array<RowData>>([
    { points: 0, interestRate: 7.25, monthlyPayment: 4632 },
    { points: 0.375, interestRate: 7, monthlyPayment: 4582 },
    { points: 0.75, interestRate: 6.75, monthlyPayment: 4483 },
    { points: 1.25, interestRate: 6.625, monthlyPayment: 4433 },
    { points: 1.5, interestRate: 6.5, monthlyPayment: 4384 },
    { points: 1.75, interestRate: 6.375, monthlyPayment: 4336 }
  ]);

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
        points: lastRow.points + 0.5,
        interestRate: lastRow.interestRate - 0.25,
        monthlyPayment: lastRow.monthlyPayment - 200
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
            <th>$ Paid for Points</th>
            <th>Diff in Monthly Payment</th>
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
                    value={row.points}
                    onChange={e => handleInputChange(e, rowIndex, "points")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.interestRate}
                    onChange={e =>
                      handleInputChange(e, rowIndex, "interestRate")
                    }
                  />
                </td>
                <td>
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
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};

const breakEvenMonths = (upFrontPayment, monthlyPaymentDelta, interestRate) => {
  var m = 0;
  let savings = upFrontPayment;
  let paid = 0;
  while (savings - paid > 0) {
    savings = savings * (1 + interestRate / 12) - monthlyPaymentDelta;
    paid += monthlyPaymentDelta;
    m++;
  }
  return m;
};

const PercentInput = ({
  pct,
  setPct,
  step = 0.01
}: {
  pct: number;
  setPct: (pct: number) => void;
  step?: number;
}) => {
  return (
    <>
      <input
        step={step}
        type="number"
        value={pct * 100}
        onChange={e => {
          setPct(Number(e.target.value) / 100);
        }}
      />
      %
    </>
  );
};

const NewPage = () => {
  return (
    <div>
      <ReactMarkdown children={markdown} />
      <Calculator />
    </div>
  );
};

export default NewPage;
