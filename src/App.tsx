import ContextProvider from "./store";
import { FC } from "react";
import Main from "./Main";
import "./App.css";

const App: FC = () => {
  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
  );
};

export default App;
