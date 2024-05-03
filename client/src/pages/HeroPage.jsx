import {React, useState} from 'react';
import BasePage from './BasePage';
import { Link } from 'react-router-dom';
import piggyBankLogo from '../assets/piggyBankIconColored.png';

const HeroPage = () => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const toggleStartModal = () => {
    setIsStartModalOpen(!isStartModalOpen);
  };

  return (
    <BasePage>
      <div className="container mx-auto p-8 flex items-center justify-center h-screen">
        <div className="max-w-6xl w-full bg-app-background text-app-text-primary p-8 rounded-lg shadow-xl space-y-8 text-center">
          {/* Displaying the logo */}
          <img src={piggyBankLogo} alt="Piggy Bank" className="mb-4 mx-auto" style={{ width: '150px' }} />

          <h1 className="text-4xl font-bold">Welcome to Piggy Bank</h1>
          <p className="text-base">The place to teach your child about financing!</p>
          
          <div className="flex justify-center space-x-4">
            {/* <Link to="/dashboard" className="btn btn-app-primary">
              View Dashboard
            </Link> */}
            <button className="btn btn-app-secondary" onClick={toggleStartModal}>
              How To Start*
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-app-primary">
              <h2 className="text-xl font-semibold mb-4">Easy Access</h2>
              <p className="text-base">View account details, children's transactions, and more.</p>
            </div>
            <div className="p-6 rounded-lg bg-app-accent">
              <h2 className="text-xl font-semibold mb-4">Secure Transactions</h2>
              <p className="text-base">Transfer money between accounts or to your children securely.</p>
            </div>
            <div className="p-6 rounded-lg bg-app-primary">
              <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
              <p className="text-base">Gain valuable insights into your financial health.</p>
            </div>
            <div className="p-6 rounded-lg bg-app-accent">
              <h2 className="text-xl font-semibold mb-4">Learn n' Earn</h2>
              <p className="text-base">Answer financial literacy questions to earn currency.</p>
            </div>
          </div>
        </div>
      </div>

      {isStartModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">WOOO</h3>
            <p>
              This is a short-term account for budgeting upcoming purchases
              and transferring money to others. Budgeting money is reversible,
              but transferring money to others is not, so be careful!
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={toggleStartModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </BasePage>
  );
};

export default HeroPage;
