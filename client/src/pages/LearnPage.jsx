import "../index.css";
import NavbarComponent from "../components/NavbarComponent";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@apollo/client";
import queries from "../queries"

// https://gist.githubusercontent.com/jesalgandhi/5d0dddad0b3faf048990c534e5e98186/raw/12f54b265f69522b38660c31e8c561685d6769b7/piggyBankQuestions.json

const LearnPage = () => {
  const { user } = useUser();
  console.log('user id: ', user.id);
  console.log('user completed questions: ', user.publicMetadata.completedQuestionIds);
  console.log('user len of comp. ques.: ', user.publicMetadata.completedQuestionIds.length);
  const [questions, setQuestions] = useState([]); // all the ques
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // the ans the user picks
  const [canAccessQuiz, setCanAccessQuiz] = useState(true); // !! need it to set 12 hr timer before next quiz, WIP
  const [displayedQuestions, setDisplayedQuestions] = useState([]); // the 2 out of the 38 ques the user sees
  const [correctCount, setCorrectCount] = useState(0); // the # of questions the user got correct
  const [incorrectCount, setIncorrectCount] = useState(0); // the # of questions the user got incorrect
  const [submittedQuiz, setSubmittedQuiz] = useState(false); // if the ques has been submitted or not
  const link =
    "https://gist.githubusercontent.com/jesalgandhi/5d0dddad0b3faf048990c534e5e98186/raw/12f54b265f69522b38660c31e8c561685d6769b7/piggyBankQuestions.json";

    const [updateMetadataQuestionIds] = useMutation(queries.UPDATE_METADATA_QUESTION_IDS, {
      // update(cache, {data: {addSavingToCheckingTransfer}}) {
      //   const {getAllTransactions} = cache.readQuery({
      //     query: queries.GET_ALL_TRANSACTIONS,
      //     variables: {
      //       userId: user.id,
      //       checkingAccountId: user.publicMetadata.checkingAccountId,
      //       savingsAccountId: user.publicMetadata.savingsAccountId
      //     }
      //   });
      // //   console.log('like what');
      //   cache.writeQuery({
      //     query: queries.GET_ALL_TRANSACTIONS,
      //     variables: {
      //       userId: user.id,
      //       checkingAccountId: user.publicMetadata.checkingAccountId,
      //       savingsAccountId: user.publicMetadata.savingsAccountId
      //     },
      //     data: {getAllTransactions: [...getAllTransactions, addSavingToCheckingTransfer]}
      //   });
      // },
      onError: (error) => {
          console.log(JSON.stringify(error, null, 2));
      }
    });


  // here is where i get the questions from the gist link jesal made
  useEffect(() => {
    const getQuizQuestions = async () => {
      try {
        let { data } = await axios.get(link);

        // filtering out the questions that have already been answered by the user
        data = data.filter((ques) => !user.publicMetadata.completedQuestionIds.includes(ques.id));
        // console.log("successful RETRIEVAL & REMOVAL of questions that have been done already: ", data);

        // https://stackoverflow.com/questions/59810241/how-to-fisher-yates-shuffle-a-javascript-array
        // shuffling the questions using fisher-yates shuffle algorithm
        data = [...data].sort(() => Math.random() - 0.5);
        // console.log("successful SHUFFLING of questions: ", data);

        // failed attmept at trying to prepend a whitespace to the beginning of options, ah well
        // for (let i = 0; i < data.length; i++) {
        //   data[i].options = data[i].options.map((option) => ` ${option}`)
        // }
        setQuestions(data);
      } catch (e) {
        console.error("error in fetching quiz questions: ", e);
      }
    };

    getQuizQuestions();
  }, [user.publicMetadata.completedQuestionIds]);

  // selecting the first 2 ques to display, since i randomly shuffled them in the beginning, picking the first 2 from the list is still random
  useEffect(() => {
    const selectRandomQuestions = () => {
      const selectedQuestions = questions.slice(0, 2);
      console.log("selected questions: ", selectedQuestions);
      setDisplayedQuestions(selectedQuestions);
      // user.publicMetadata.completedQuestionIds.push(selectedQuestions[0].id, selectedQuestions[1].id)
    };

    selectRandomQuestions();
  }, [questions]);

  useEffect(() => {
    const completedQuestionIds = [];

    for (const [key, value] of Object.entries(displayedQuestions)) {
      completedQuestionIds.push(value.id);
    }

    console.log('completedQuestoinIds in useEffect: ', completedQuestionIds);

    const updateUser = async () => {
      if (submittedQuiz) {
        if (!user.publicMetadata.lastDateSubmitted || (new Date() - new Date(user.publicMetadata.lastDateSubmitted)) >= (24 * 60 * 60 * 1000)) {
          try {
            await updateMetadataQuestionIds({
              variables: {
                updateMetadataQuestionIdsUserId2: user.id,
                completedQuesIdsString: JSON.stringify(completedQuestionIds),
                date: new Date()
              },
            });
          } catch (e) {
            console.log('failed to update metadata questions ids man: ', e);
          }
        }
        else {
          console.log('mmmmm2wqqwr');
        }
      }
    }
    updateUser();

  }, [submittedQuiz, displayedQuestions, user, updateMetadataQuestionIds])

  // for when they submit the quiz
  const handleQuizSubmission = (e) => {
    e.preventDefault();
    setSubmittedQuiz(true);
    let correctCount = 0;
    let incorrectCount = 0;

    displayedQuestions.forEach((question) => {
      const selectedOption = answeredQuestions[question.id]; // getting da ans the user selected
      user.publicMetadata.completedQuestionIds.push(question.id); // pushing the ques into comp ques Ids since they have submitted it
      // checking how many they got right/wrong
      if (selectedOption === question.correctAnswer) correctCount++;
      else incorrectCount++;
    });

    console.log("correct responses:", correctCount);
    console.log("incorrect responses:", incorrectCount);

    setCorrectCount(correctCount);
    setIncorrectCount(incorrectCount);
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    setAnsweredQuestions((prevState) => ({
      ...prevState,
      [questionId]: selectedOption, // updating answeredQuestions state with the user's selected option
    }));
  };

  // reloading page after 3.5 seconds when quiz results are displayed
  useEffect(() => {
    if (submittedQuiz) {
      setTimeout(() => {
        window.location.reload();
      }, 3500); // 3500 milliseconds = 3.5 sec
    }
  }, [submittedQuiz]);



  
  return (
    <>
      {/* {console.log(displayedQuestions)} */}
      <NavbarComponent />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold my-4 text-center">Quiz Section</h2>

        {submittedQuiz ? 
            <div>
            <p className="text-center">
              You got {correctCount}{" "}
              {correctCount === 1 ? "question" : "questions"} correct!
            </p>
            <p className="text-center">
              Please wait 24 hours before attempting the quiz again.
            </p>
          </div> : 
           user.publicMetadata.lastDateSubmitted && (new Date() - new Date(user.publicMetadata.lastDateSubmitted)) < (24 * 60 * 60 * 1000) ?
            <div>
            <p className="text-center">
              Thank you for answering! Please 24 hours before your next set of questions.
            </p>
            </div> :
            
              <div className="card bg-base-300 shadow-xl my-4">
              <form className="card-body">
                {displayedQuestions.map((question, index) => (
                  <div key={question.id}>
                    {/* <p className="font-bold">{index + 1}. {question.id} - {question.question}</p> */}
                    <p className="font-bold">
                      {index + 1}. {question.question}
                    </p>
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          <label
                            style={{
                              marginBottom: "16px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              onChange={() =>
                                handleOptionSelect(question.id, option)
                              }
                              required
                            />
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <button
                  className="btn btn-primary mt-4"
                  onClick={handleQuizSubmission}
                >
                  Submit
                </button>
              </form>
            </div>
        }



      </div>
    </>
  );
};

export default LearnPage;
