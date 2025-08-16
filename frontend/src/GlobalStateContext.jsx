import { createContext, useContext, useState } from "react";
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const initialState = {
    userName: "",
    baseUrl: "http://localhost:5000"
  }

  const [userName, setUserName] = useState(initialState.userName);
  const [baseUrl, setBaseUrl] = useState(initialState.baseUrl);

  const resetGlobalStates = () => {
    setUserName(initialState.userName);
    setBaseUrl(initialState.baseUrl);
  }

  return (
    <GlobalStateContext.Provider value={
      {
        userName,
        baseUrl,
        resetGlobalStates
      }
    }>
      {children}
    </GlobalStateContext.Provider>
  );
}

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
}