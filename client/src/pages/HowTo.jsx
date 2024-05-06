import React from 'react'
import BasePage from './BasePage';
import piggyBankLogo from '../assets/piggyBankIconColored.png';

function HowTo() {
  return (
    <BasePage>
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <div className="max-w-6xl w-full bg-app-background text-app-text-primary p-8 rounded-lg shadow-xl space-y-8 text-center">
        {/* Displaying the logo */}
        <img src={piggyBankLogo} alt="Piggy Bank" className="mb-4 mx-auto" style={{ width: '150px' }} />

        <h1 className="text-4xl font-bold">Here's how to get started:</h1>
        
        <ol style={{listStyleType: 'number'}}>
            <li>If you're a new user, click the Sign Up button at the top right. Once there, fill out the information accordingly to create your account.</li>
            <li>(ajit will implement choosing parent or child, til i get that, ill skip this step)</li>
            <li>Once you're signed in, you will be navigated to your dashboard.</li>
            <li>If you're a parent, what you will see on your Parent dashboard will be a list of all transactions your children have made.</li>
            <li>If you're a child, what you will see on your Child dashboard will be your Checking & Savings account info. as well your deposits & withdrawals.</li>
            <li>In your Checking Account: You have the option to transfer money either to your Savings account or to another user's checking account.</li>
            <li>In your Savings Account: You have the option to transfer money to your Checking account.</li>
            <li>You can also navigate to Learn n' Earn to answer financial literacy questions. The more you get right, the more money you earn in your account! (New questions every 12 hours!)</li>
            <li>Navigate to My Transactions to see all of the transactions you've made.</li>
            <li>Press Piggy Bank to return to your dashboard at any time.</li>
            <li>If you're ever lost, navigate back here by pressing How To Start!</li>
            <li>Whether you're a parent or child, press the moon/sun icon to switch between dark/light mode.</li>
            {/* have the steps all below and such */}
            {/* <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li> */}
        </ol>
        

      </div>
    </div>

  </BasePage>
  )
}

export default HowTo