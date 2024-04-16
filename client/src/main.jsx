import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

//! TODO: uncomment AppoloClient stuff after gql server is up and running
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: 'http://localhost:4000'
//   })
// });

ReactDOM.createRoot(document.getElementById("root")).render(
  // <ApolloClient client={client}>
  <BrowserRouter>
    <NextUIProvider>
      <main className="dark text-foreground bg-background ">
        <App />
      </main>
    </NextUIProvider>
  </BrowserRouter>
  // </ApolloClient>
);
