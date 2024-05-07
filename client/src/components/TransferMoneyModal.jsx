import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { useUser } from "@clerk/clerk-react";
import {v4 as uuid} from 'uuid'

const TransferMoneyModal = ({ toggleModal, accountType }) => {
  const { user } = useUser();
  // console.log("user here: ", user);
  console.log("user here: ", user.id);
  console.log("user here: ", user.publicMetadata.checkingAccountId);
  console.log("user here: ", user.publicMetadata.savingsAccountId);

  /* useState hooks */
  // const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [selectedChildId, setSelectedChildId] = useState(""); // selected child from the dropdown
  const [error, setError] = useState("");

  const [children, setChildren] = useState(undefined); // all the users that are children


  const [dropdownOpen, setDropdownOpen] = useState(false); // track if dropdown is open or closed
  let option1 = 'Other User';
  let option2 = 'Savings';
  const [selectedOption, setSelectedOption] = useState(option2); // track the user's selected option, defaulted to option2 (savings)

  // !! query to get all the children in the dropdown
  let {loading: childrenLoading, error: childrenError, data: childrenData} = useQuery(queries.GET_ALL_CHILDREN, {
    fetchPolicy: 'cache-and-network'
  });
  // console.log('here are all the children: ', childrenData);

  const [transferMoney] = useMutation(queries.ADD_TRANSFER_TRANSACTION);

  const [transferCheckingToSavings] = useMutation(queries.ADD_CHECKING_TO_SAVINGS_TRANSACTION);

  const [transferSavingsToChecking] = useMutation(queries.ADD_SAVINGS_TO_CHECKING_TRANSACTION);


  useEffect(() => {
    if (childrenData) {
      let {getAllChildren} = childrenData;
      getAllChildren = getAllChildren.filter((child) => child.id !== user.id);

      getAllChildren = getAllChildren.sort((a, b) => {
        const first = a.lastName.toLowerCase();
        const second = b.lastName.toLowerCase();

        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
      });
      setChildren(getAllChildren);
      // console.log('here are all the APPROVED children: ', getAllChildren);
  
    }
  }, [childrenData, user.id]);

  useEffect(() => {
    document.getElementById("my_modal_2").showModal();
  }, [toggleModal]);

  /* Functions */
  /* Resets all states upon form submission/cancellation */
  const resetForm = () => {
    // setTransactionName("");
    setAmount(1);
    setDescription("");
    setError("");
  };
  const handleIncompleteForm = () => {
    document.getElementById("my_modal_2").close();
    toggleModal();
    resetForm();
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    document.activeElement.blur(); // gets rid of the dropdown afterwards
    // setDropdownOpen(false); // closing dropdown menu after selecting an option
    console.log(option);
  };

  /* Form submission */
  //!uncomment below after mutation above is complete
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // let trimmedTransactionName = transactionName.trim();
    let trimmedAmount = amount.toString().trim();
    let trimmedDescription = description.trim();
    let trimmedSelectedChildId = selectedChildId.trim();
    console.log('AMOUNTTTT: ', trimmedAmount);
    console.log('DESCRIPTION: ', trimmedDescription);
    console.log('SELECTED USER: ', trimmedSelectedChildId);
    // if (trimmedTransactionName.length === 0) {
    //   setError("Transaction Name should not be empty");
    //   return;
    // }
    if (selectedOption === option1 && !trimmedSelectedChildId) {
      setError("You must select a user");
      return;
    }
    if (selectedOption === option1 && trimmedSelectedChildId.length === 0) {
      setError("User should not be empty");
      return;
    }
    if (trimmedAmount.length === 0) {
      setError("Amount should not be empty");
      return;
    }
    if (trimmedDescription.length === 0) {
      setError("Description should not be empty");
      return;
    }    
  
    const handleTransferMoney = async () => {
      // inter-user checking to checking
      if (accountType.toUpperCase() === 'CHECKING ACCOUNT' && selectedOption === option1) {
        try {
          await transferMoney({
            variables: {
              // transactionName: trimmedTransactionName,
              // _id: new uuid(),
              senderOwnerId: user.id,
              receiverOwnerId: trimmedSelectedChildId,
              amount: parseFloat(trimmedAmount),
              description: trimmedDescription,
            },
          });
          document.getElementById("my_modal_2").close();
          // alert('Transfer Successful');
          toggleModal();
          resetForm();
        } catch (e) {
          console.log('ISSUE HERE!!!')
          setError(e.message);
        }
      }
      // checking to savings
      else if (accountType.toUpperCase() === 'CHECKING ACCOUNT' && selectedOption === option2) {
        try {
          await transferCheckingToSavings({
            variables: {
              ownerId: user.id,
              addCheckingToSavingTransferAmount2: parseFloat(trimmedAmount),
              addCheckingToSavingTransferDescription2: trimmedDescription,
            },
          });
          document.getElementById("my_modal_2").close();
          // alert('Transfer Successful');
          toggleModal();
          resetForm();
        } catch (e) {
          setError(e.message);
          return;
        }

      }
      // savings to checking
      else {
        try {
          await transferSavingsToChecking({
            variables: {
              addSavingToCheckingTransferOwnerId2: user.id,
              addSavingToCheckingTransferAmount2: parseFloat(trimmedAmount),
              addSavingToCheckingTransferDescription2: trimmedDescription,
            },
          });
          document.getElementById("my_modal_2").close();
          // alert('Transfer Successful');
          toggleModal();
          resetForm();
        } catch (e) {
          setError(e.message);
        }
      }



    };

    handleTransferMoney();
  };

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Transfer Money</h3>
          <form onSubmit={handleFormSubmit} method="dialog" className="py-4">
            {/* <div className="mb-4">
              <input
                type="text"
                placeholder="Transaction Name"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div> */}
            {accountType.toUpperCase() === 'CHECKING ACCOUNT' ? (
              <div className="dropdown">
              <div tabIndex={0} className="btn m-1">Click</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => handleOptionSelect(option2)}>{option2}</a></li>
                  <li><a onClick={() => handleOptionSelect(option1)}>{option1}</a></li>
                </ul>
              </div>
              
            ) : (
              undefined)}

            {selectedOption === option2 && accountType.toUpperCase() === 'CHECKING ACCOUNT' ? (
              <p className="pb-1 font-medium text-sm">The transferred money will go into your Savings Account.</p>
            ) : selectedOption === option1 && accountType.toUpperCase() === 'CHECKING ACCOUNT' && children ? (
              // console.log('we made it: ', children)
              // <p className="pb-1 font-medium text-sm">* PUT A TEXTBOX HERE *</p>
              <div className="mb-4">
                {console.log('we made it: ', children)}
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                >
                <option value="">Select a user...</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {`${child.firstName} ${child.lastName}`}
                  </option>
                ))}
              </select>
            </div>



            ) : <p className="pb-1 font-medium text-sm">The transferred money will go into your Checking Account.</p>}
            
            <div className="mb-4">
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary mr-2"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleIncompleteForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TransferMoneyModal;
