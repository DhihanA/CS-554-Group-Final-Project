import piggybank from '../assets/piggyBankIconColored.png';
import {useUser} from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomDataForm = () => {

  const {isSignedIn, isLoaded, user} = useUser();

  const [role, setRole] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    validateForm(event.target.value, dateOfBirth, verificationCode);
  };

  const handleDateChange = (event) => {
    setDateOfBirth(event.target.value);
    validateForm(role, event.target.value, verificationCode);
  };

  const submitCustomData = (role, dateOfBirth, verificationCode) => {
    // try {
    //   await user.update({
    //     publicMetadata: {
    //       role: customData.role,
    //     },
    //     privateMetadata: {
    //       dob: customData.dob,
    //     },
    //   });
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.error("Failed to update metadata:", error);
    //   setError(error.message);
    // }

    // call mutation here

  }

  const handleCodeChange = (event) => {
    setVerificationCode(event.target.value);
    validateForm(role, dateOfBirth, event.target.value);
  }

  const validateForm = (selectedRole, dob, verificationCode) => {
    if (!selectedRole || !dob) {
      setError('');
      setIsButtonActive(false);
      return;
    }

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (selectedRole === 'child' && (age < 13)) {
      setError('A child must be at least 13 years old.');
      setIsButtonActive(false);
    } else if (selectedRole === 'parent' && age < 18) {
      setError('A parent must be at least 18 years old.');
      setIsButtonActive(false);
    } else if (selectedRole === 'child' && verificationCode === '') {
      setIsButtonActive(false);
    } else {
      setError('');
      setIsButtonActive(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img src={piggybank} className="object-cover h-48 w-50"/>
      <h2 className='my-8'>Please fill in the following information:</h2>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Are you a Parent or Child?</label>
      <select
        className="select select-bordered w-full max-w-xs"
        value={role}
        onChange={handleRoleChange}
      >
        <option value="">select</option>
        <option value="child">Child</option>
        <option value="parent">Parent</option>
      </select>

      <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Date of Birth:</label>
      <input
        type="date"
        className="input input-bordered w-full max-w-xs"
        value={dateOfBirth}
        onChange={handleDateChange}
      />

      {role === 'child' && <>
        <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Verification Code:</label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={verificationCode}
          onChange={handleCodeChange}
        />
      </>}

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      

      <button
        onClick = {() => submitCustomData(role, dateOfBirth, verificationCode)}
        className={`btn mt-4 ${isButtonActive ? '' : 'btn-disabled'}`}
        disabled={!isButtonActive}
      >
        Continue
      </button>
    </div>
  );
}

export default CustomDataForm;