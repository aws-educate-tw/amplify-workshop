import "./App.scss";
import Main from "./components/Main";
import { FaAws } from "react-icons/fa";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
  // 畫面
  return (
    <div className="App">
      <div className="header">
        <h2>
          {" "}
          Music Platform by Amplify &nbsp; <FaAws className="bounce" />{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Educate
        </h2>
      </div>
      {/* Main.js */}
      <Main />
    </div>
  );
}

export default App;
