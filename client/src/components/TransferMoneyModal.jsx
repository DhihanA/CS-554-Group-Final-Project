import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
// import queries from "../../queries";

const TransferMoneyModal = ({ toggleModal, accountType }) => {
  /* useState hooks */
  // const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null); // State to track selected account
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown menu open/close


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

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    document.activeElement.blur(); // gets rid of the dropdown afterwards
    // setDropdownOpen(false); // Close the dropdown after selecting an option
    console.log(account);
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
                  <li><a onClick={() => handleAccountSelect("Checking 1")}>Checking 1</a></li>
                  <li><a onClick={() => handleAccountSelect("Checking 2")}>Checking 2</a></li>
                </ul>
              </div>
              
            ) : 
            (<p className="pb-1 font-medium text-sm">* The transferred money will go into your Checking Account. *</p>)}
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
