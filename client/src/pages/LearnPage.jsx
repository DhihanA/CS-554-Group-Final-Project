import "../index.css";
import NavbarComponent from "../components/NavbarComponent";
import axios from "axios";
import { useState, useEffect } from "react";

// https://gist.githubusercontent.com/jesalgandhi/5d0dddad0b3faf048990c534e5e98186/raw/12f54b265f69522b38660c31e8c561685d6769b7/piggyBankQuestions.json

const LearnPage = () => {
  const [questions, setQuestions] = useState([]); // all the ques
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // the ans the user picks
  const [canAccessQuiz, setCanAccessQuiz] = useState(true); // !! need it to set 12 hr timer before next quiz, WIP
  const [displayedQuestions, setDisplayedQuestions] = useState([]); // the 2 out of the 38 ques the user sees
  const [correctCount, setCorrectCount] = useState(0); // the # of questions the user got correct
  const [incorrectCount, setIncorrectCount] = useState(0); // the # of questions the user got incorrect
  const link =
    "https://gist.githubusercontent.com/jesalgandhi/5d0dddad0b3faf048990c534e5e98186/raw/12f54b265f69522b38660c31e8c561685d6769b7/piggyBankQuestions.json";

  // here is where i get the questions from the gist link jesal made
  useEffect(() => {
    const getQuizQuestions = async () => {
      try {
        let { data } = await axios.get(link);
        // console.log("successful RETRIEVAL of questions: ", data);

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
  }, []);

  // selecting the first 2 ques to display, since i randomly shuffled them in the beginning, picking the first 2 from the list is still random
  useEffect(() => {
    const selectRandomQuestions = () => {
      const selectedQuestions = questions.slice(0, 2);
      console.log("selected questions: ", selectedQuestions);
      setDisplayedQuestions(selectedQuestions);
    };

    selectRandomQuestions();
  }, [questions]);

  // for when they submit the quiz
  const handleQuizSubmission = (e) => {
    e.preventDefault();
    let correctCount = 0;
    let incorrectCount = 0;

    displayedQuestions.forEach((question) => {
      const selectedOption = answeredQuestions[question.id]; // getting da ans the user selected
      // checking how many they got right/wrong
      if (selectedOption === question.correctAnswer) correctCount++;
      else incorrectCount++;
    });

    console.log("correct responses:", correctCount);
    console.log("incorrect responses:", incorrectCount);

    setCorrectCount(correctCount);
    setIncorrectCount(incorrectCount);

    // !!!! IGNORE ALL THIS RIGHT NOW. all a failed attempt at trying to implement a 12 hour timer before next quiz is available.
    // !!!! will need to come back to this eventually
    setCanAccessQuiz(false); // disable the shi
    // selectRandomQuestions();
    // setCanAccessQuiz(true);
    // ? have no idea what i was even going for with this tbh
    setTimeout(() => {
      setCanAccessQuiz(true); // can access quiz after 12 hrs
      // selectRandomQuestions(); // displaying new set of random questions after 12 hrs
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    setAnsweredQuestions((prevState) => ({
      ...prevState,
      [questionId]: selectedOption, // updating answeredQuestions state with the user's selected option
    }));
  };

  return (
    <>
      {/* {console.log(displayedQuestions)} */}
      <NavbarComponent />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold my-4 text-center">Quiz Section</h2>
        {canAccessQuiz ? (
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
        ) : (
          <div>
            <p className="text-center">
              You got {correctCount}{" "}
              {correctCount === 1 ? "question" : "questions"} correct!
            </p>
            <p className="text-center">
              Please wait before attempting the quiz again.
            </p>
            <p className="text-center">
              (work in progress... atm just refresh the page to get 2 other
              questions)
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default LearnPage;
