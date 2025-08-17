import { useState } from "react";
import axios from "axios";
import "./styles/AddQuestionPopup.scss";
import { useGlobalState } from "../GlobalStateContext";

function AddQuestionPopup({ showAddQuestionPopup, setShowAddQuestionPopup, onQuestionAdded }) {
  const { baseUrl } = useGlobalState();
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");

  const handlePostQuestion = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("user_email");

      const response = await axios.post(`${baseUrl}/api/questions`, {
        question,
        description,
        user_id,
        username,
        email,
      });

      if (response.status === 200) {
        setShowAddQuestionPopup(false);
        setQuestion("");
        setDescription("");
        onQuestionAdded();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="overlay"
        style={{ display: showAddQuestionPopup ? "block" : "none" }}
      ></div>
      <div
        className="addQuestionContainer"
        style={{ display: showAddQuestionPopup ? "flex" : "none" }}
      >
        <div className="top-section">
          <p>Ask a Question</p>
        </div>
        <div className="mid-section">
          <div className="labelInputPair">
            <label>Question</label>
            <input
              className="inputValue"
              placeholder="Give a title to your Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="labelInputPair">
            <label>Description</label>
            <textarea
              className="inputValue"
              placeholder="Enter a detailed description of your question"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="bottom-section">
          <button
            className="discardButton"
            onClick={() => setShowAddQuestionPopup(false)}
          >
            Discard
          </button>
          <button className="postButton" onClick={handlePostQuestion}>
            Post
          </button>
        </div>
      </div>
    </>
  );
}

export default AddQuestionPopup;
