import React from 'react'
import BasePage from './BasePage';
import piggyBankLogo from '../assets/piggyBankIconColored.png';

function HowTo() {
  return (
    <BasePage>
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <div className="max-w-6xl w-full bg-app-background text-app-text-primary p-8 rounded-lg shadow-xl space-y-8 text-center">
        {/* Displaying the logo */}
        <img src={piggyBankLogo} alt="Piggy Bank" className="mb-4 mx-auto" style={{ width: '75px' }} />

        <h1 className="text-4xl font-bold">Here's how to get started:</h1>
        
        <ol>
            <li>If you're a new user, click the Sign Up button at the top right. Once there, fill out the information accordingly to create your account.</li>
            <li>help</li>
            <li>me</li>
            <li>blah blah</li>
            <li>list steps here...</li>
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