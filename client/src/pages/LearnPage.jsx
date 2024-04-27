import React from "react";
import BasePage from "./BasePage";
import "../index.css";
import NavbarComponent from "../components/NavbarComponent";

// https://gist.githubusercontent.com/jesalgandhi/5d0dddad0b3faf048990c534e5e98186/raw/3f705f0a4e9894db42c74d9f2f54bcafe8cf119f/piggyBankQuestions.json


const LearnPage = () => {
    return (
        <>
            {/* <BasePage>
                hello
            </BasePage> */}
            <NavbarComponent user={{}}></NavbarComponent>
            {/* <NavbarComponent user={undefined}></NavbarComponent> */}



            {/* <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl items-center">daisyUI</a>
            </div>
            <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button>
            </div>
            </div> */}
            
            <h2 className="text-2xl font-bold m-4 text-center">Here is where we can do quizzz</h2>

            <div className="card card-side bg-base-300 shadow-xl m-4">
                <div className="card-body flex-col justify-center">
                    <p>qwe</p>
                    <p>qwr</p>
                    <br />
                    <p>rw</p>
                </div>



            </div>

            <div className="card-actions flex-col items-center">
                <button className="btn btn-primary mb-2 ">Submit</button>
            </div>


        </>
    );
};

export default LearnPage;
