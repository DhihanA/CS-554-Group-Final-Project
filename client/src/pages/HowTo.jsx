import React from 'react'
import BasePage from './BasePage';
import piggyBankLogo from '../assets/piggyBankIconColored.png';

function HowTo() {
  return (
    <BasePage>
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <div className="max-w-6xl w-full bg-app-background text-app-text-primary p-8 rounded-lg shadow-xl space-y-8 text-center">
        {/* Displaying the logo */}
        <img src={piggyBankLogo} alt="Piggy Bank" className="mb-4 mx-auto w-20" />

        <h1 className="text-4xl font-bold">Here's how to get started:</h1>
        
        <ol className='list-decimal text-left'>
            <li>If you're a new user, click the <span className='text-emerald-600 font-semibold'>Sign Up</span> button at the top right. Once there, fill out the information accordingly (or sign in with Google) to create your account.</li>
            <li>Once signed in, you have to fill out your role & date of birth.</li>
            <li>If you're a <span className='text-blue-500 font-semibold'>parent</span>:
              <ul className='list-disc'>
                <li className='ml-10'>You will be navigated to your dashboard which contains a verification code to give to your children.</li>
              </ul>
            </li>
            <li>If you're a <span className='text-red-600 font-semibold'>child</span>:
              <ul className='list-disc'>
                <li className='ml-10'>You will enter the verification code your parent gives you from their dashboard.</li>
              </ul>
              <ul className='list-disc'>
                <li className='ml-10'>Once entered, you will be navigated to your dashboard.</li>
              </ul>
            </li>
            <li><span className='text-blue-500 font-semibold'>Parents!</span> What you see will be:
              <ul className='list-disc'>
                <li className='ml-10'>Your dashboard which will list all the transactions your children have made.</li>
              </ul>
              <ul className='list-disc'>
                <li className='ml-10'>You can also transfer money (up to $500 per transaction) to your children accordingly.</li>
              </ul>
            </li>
            <li><span className='text-red-600 font-semibold'>Children!</span> What you see will be:
              <ul className='list-disc'>
                <li className='ml-10'><span className='text-red-600 font-semibold'>Checking Account:</span> Besides your Checking balance, you have the option to... 
                <ul className='list-disc'>
                  <li className='ml-10'>Transfer money either to your Savings account or to another user's Checking account.</li>
                </ul>
                <ul className='list-disc'>
                  <li className='ml-10'>Create a budgeted transaction, in order to set aside funds for future short-term purchases.</li>
                </ul>
                you have the option to transfer money either to your Savings account or to another user's Checking account.</li>
              </ul>
              <ul className='list-disc'>
                <li className='ml-10'><span className='text-red-600 font-semibold'>Savings Account:</span> Besides your savings balance & interest rate, you have the option to transfer money to your Checking account.</li>
              </ul>
              <ul className='list-disc'>
                <li className='ml-10'>Navigate to <span className='text-red-600 font-semibold'>My Transactions</span> to see all of the transactions you've made.</li>
              </ul>
              <ul className='list-disc'>
                <li className='ml-10'>Navigate to <span className='text-red-600 font-semibold'>Learn n' Earn</span> to answer financial literacy questions. The more you get right, the more money you earn in your account! (New questions daily!)</li>
              </ul>
            </li>
            <li>Press <span className='text-emerald-600 font-semibold'>Piggy Bank</span> to return to your dashboard at any time.</li>
            <li>Whether you're a parent or child, press the <span className='text-cyan-600 font-semibold'>moon</span>/<span className='text-yellow-600 font-semibold'>sun</span> icon to switch between dark/light mode.</li>
            <li>If you're ever lost, navigate back here by pressing <span className='text-red-600 font-semibold'>How To Start</span>!</li>
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