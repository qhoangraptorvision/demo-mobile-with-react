import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const client = new ApolloClient({
  uri: import.meta.env.VITE_PORTAL_GRAPHQL || "http://localhost:5002/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);