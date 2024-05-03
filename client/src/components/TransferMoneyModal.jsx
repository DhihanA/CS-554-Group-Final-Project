import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
// import queries from "../../queries";

const TransferMoneyModal = ({ toggleModal, accountType }) => {
  /* useState hooks */
  // const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false); // track if dropdown is open or closed
  let option1 = 'Other User';
  let option2 = 'Savings';
  const [selectedOption, setSelectedOption] = useState(option2); // track the user's selected option, defaulted to option2 (savings)

  // !! query to display all the users in the dropdown
  // const {loading, error, data} = useQuery(queries.GET_ALL_USERS, {
  //   fetchPolicy: 'cache-and-network'
  // });

  /* useMutation hooks */
  //! configure this after mutation is complete
  // const [transferMoney] = useMutation(queries.ADD_COMPANY, {
  //   update(cache, { data: { addCompany } }) {
  //     const newCompany = {
  //       ...addCompany,
  //       numOfAlbums: 0,
  //     };

  //     const { recordCompanies } = cache.readQuery({
  //       query: queries.GET_COMPANIES,
  //     });
  //     cache.writeQuery({
  //       query: queries.GET_COMPANIES,
  //       data: { recordCompanies: [...recordCompanies, newCompany] },
  //     });
  //   },
  // });

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
    // if (trimmedTransactionName.length === 0) {
    //   setError("Transaction Name should not be empty");
    //   return;
    // }
    if (trimmedAmount.length === 0) {
      setError("Amount should not be empty");
      return;
    }
    if (trimmedDescription.length === 0) {
      setError("Description should not be empty");
      return;
    }    
  
    const handleTransferMoney = async () => {
      try {
        await transferMoney({
          variables: {
            // transactionName: trimmedTransactionName,
            description: trimmedDescription,
            amount: parseInt(trimmedAmount)
          },
        });
        document.getElementById("my_modal_2").close();
        toggleModal();
        resetForm();
      } catch (e) {
        setError(e.message);
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
              <p className="pb-1 font-medium text-sm">* The transferred money will go into your Savings Account. *</p>
            ) : selectedOption === option1 && accountType.toUpperCase() === 'CHECKING ACCOUNT' ? (
              <p className="pb-1 font-medium text-sm">* PUT A TEXTBOX HERE *</p>
            ) : <p className="pb-1 font-medium text-sm">* The transferred money will go into your Checking Account. *</p>}
            
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
