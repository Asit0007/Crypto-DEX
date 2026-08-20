import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import QuickStart from "components/QuickStart";
import "./index.css";

/** Moralis server credentials — see .env.example. */
const APP_ID = import.meta.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = import.meta.env.REACT_APP_MORALIS_SERVER_URL;
const isServerInfo = Boolean(APP_ID && SERVER_URL);

const Application = () => {
  if (isServerInfo) {
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App isServerInfo />
      </MoralisProvider>
    );
  }
  // No .env configured — show onboarding instead of a white screen.
  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <QuickStart />
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <Application />
  </StrictMode>,
  document.getElementById("root"),
);
