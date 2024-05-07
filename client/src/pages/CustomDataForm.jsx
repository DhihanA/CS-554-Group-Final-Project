import piggybank from "../assets/piggyBankIconColored.png";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { createRoutesFromChildren, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { format } from "date-fns";
import queries from "../queries.js";

const CustomDataForm = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  const [role, setRole] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  // define mutation here
  const parentMutation = gql`
    mutation Mutation($userId: String!, $dob: Date!, $role: Role!) {
      addRoleAndDOB(userId: $userId, dob: $dob, role: $role)
      createAccountsAndUpdateUserInClerk(userId: $userId) {
        firstName
        lastName
      }
    }
  `;

  // const childMutation = gql`
  //   mutation Mutation(
  //     $userId: String!
  //     $dob: Date!
  //     $role: Role!
  //     $verificationCode: String!
  //   ) {
  //     verifyChild(userId: $userId, verificationCode: $verificationCode) {
  //       id
  //     }
  //     addRoleAndDOB(userId: $userId, dob: $dob, role: $role)
  //     createAccountsAndUpdateUserInClerk(userId: $userId) {
  //       firstName
  //       lastName
  //     }
  //   }
  // `;

  // retrieve mutation function
  // const [updateChildUser] = useMutation(childMutation);
  const [verifyChild] = useMutation(queries.VERIFY_CHILD_MUTATION);
  const [addRoleAndDOB] = useMutation(queries.ADD_ROLE_AND_DOB_MUTATION);
  const [createAccounts] = useMutation(queries.CREATE_ACCOUNTS_MUTATION);

  const [updateParentUser] = useMutation(parentMutation);

  const submitCustomData = async (e) => {
    e.preventDefault();
    // changing the date format to MM/DD/YYYY
    const date = new Date(dateOfBirth);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    const formattedDateOfBirth = format(new Date(adjustedDate), "MM/dd/yyyy");

    try {
      let response;
      if (role === "child") {
        const verifyResponse = await verifyChild({
          variables: {
            userId: user.id,
            verificationCode: verificationCode,
          },
        });

        if (verifyResponse.data.verifyChild.id) {
          const roleDOBResponse = await addRoleAndDOB({
            variables: {
              userId: user.id,
              dob: formattedDateOfBirth,
              role: role,
            },
          });

          const accountUpdateResponse = await createAccounts({
            variables: { userId: user.id },
          });

          console.log(roleDOBResponse, accountUpdateResponse);
          navigate("/dashboard");
        }
      } else {
        response = await updateParentUser({
          variables: { userId: user.id, dob: formattedDateOfBirth, role: role },
        });
      }
      console.log(response);
      window.location.reload();
    } catch (e) {
      console.log(e);
      setError(e.message);
      return;
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    validateForm(event.target.value, dateOfBirth, verificationCode);
  };

  const handleDateChange = (event) => {
    setDateOfBirth(event.target.value);
    validateForm(role, event.target.value, verificationCode);
  };

  const handleCodeChange = (event) => {
    setVerificationCode(event.target.value);
    validateForm(role, dateOfBirth, event.target.value);
  };

  const validateForm = (selectedRole, dob, verificationCode) => {
    if (!selectedRole || !dob) {
      setError("");
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

    if (selectedRole === "child" && age < 13) {
      setError("A child must be at least 13 years old.");
      setIsButtonActive(false);
    } else if (selectedRole === "parent" && age < 18) {
      setError("A parent must be at least 18 years old.");
      setIsButtonActive(false);
    } else if (selectedRole === "child" && verificationCode === "") {
      setIsButtonActive(false);
    } else {
      setError("");
      setIsButtonActive(true);
    }
  };

  return (
    <form className="flex flex-col items-center justify-center min-h-screen p-4" onSubmit={submitCustomData}>
      <img src={piggybank} className="object-cover h-48 w-50" />
      <h2 className="my-8">Please fill in the following information:</h2>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Are you a Parent or Child?
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        value={role}
        onChange={handleRoleChange}
      >
        <option value="">select</option>
        <option value="child">Child</option>
        <option value="parent">Parent</option>
      </select>

      <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Date of Birth:
      </label>
      <input
        type="date"
        className="input input-bordered w-full max-w-xs"
        value={dateOfBirth}
        onChange={handleDateChange}
      />

      {role === "child" && (
        <>
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Verification Code:
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={verificationCode}
            onChange={handleCodeChange}
          />
        </>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      <button
        type='submit'
        className={`btn mt-4 ${isButtonActive ? "" : "btn-disabled"}`}
        disabled={!isButtonActive}
      >
        Continue
      </button>
    </form>
  );
};

export default CustomDataForm;
