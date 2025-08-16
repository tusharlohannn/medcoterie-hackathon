import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "./styles/QuestionCard.scss";
import { useGlobalState } from "../GlobalStateContext";

function QuestionCard({ id, title, description, username, created_at }) {
  const { baseUrl } = useGlobalState();
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [questionVotes, setQuestionVotes] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const defaultColor = "#ffffff";
  const voteHover = "rgb(106, 92, 255)";
  const commentHover = "#FFCC00";
  const downvoteHover = "rgb(217, 57, 0)";

  function formatDate(dateString) {
    const date = dayjs(dateString);
    const now = dayjs();
    if (date.isSame(now, "day")) {
      return date.fromNow();
    } else {
      return date.format("DD MMM YYYY, hh:mm A");
    }
  }

  useEffect(() => {
    fetch(`${baseUrl}/api/answers/${id}`)
      .then((res) => res.json())
      .then((data) => setAnswers(data))
      .catch((err) => console.error(err));

    fetch(`${baseUrl}/api/votes/question/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestionVotes(data.score))
      .catch((err) => console.error(err));
  }, [id]);

  // Handle new answer submit
  async function handleAnswerSubmit() {
    if (!newAnswer.trim()) return;

    try {
      const res = await fetch(`${baseUrl}/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          question_id: id,
          description: newAnswer,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit answer");

      const data = await res.json();
      setAnswers([...answers, data]);
      setNewAnswer("");
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  }

  // Handle question voting
  async function handleQuestionVote(type) {
    try {
      const res = await fetch(`${baseUrl}/api/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          target_id: id,
          target_type: "question",
          vote_type: type === "up" ? 1 : -1,
        }),
      });

      if (!res.ok) throw new Error("Vote failed");

      const scoreRes = await fetch(`${baseUrl}/api/votes/question/${id}`);
      const scoreData = await scoreRes.json();
      setQuestionVotes(scoreData.score);
    } catch (err) {
      console.error(err);
    }
  }

  // Handle answer voting
  async function handleAnswerVote(answerId, type) {
    try {
      const res = await fetch(`${baseUrl}/api/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          target_id: answerId,
          target_type: "answer",
          vote_type: type === "up" ? 1 : -1,
        }),
      });

      if (!res.ok) throw new Error("Vote failed");

      const scoreRes = await fetch(`${baseUrl}/api/votes/answer/${answerId}`);
      const scoreData = await scoreRes.json();

      setAnswers(
        answers.map((a) =>
          a.id === answerId ? { ...a, votes: scoreData.score } : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  // Reusable Hoverable SVG button
  const HoverableButton = ({ onClick, svgPath, size = 24, hoverColor = voteHover }) => {
    const [hover, setHover] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        className="wrapper"
      >
        <svg
          fill={hover ? hoverColor : defaultColor}
          width={`${size}px`}
          height={`${size}px`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={svgPath} />
        </svg>
      </button>
    );
  };

  return (
    <div className="questionCardContainer">
      {/* Top Section */}
      <div className="middle-section">
        <p className="userName">{username}</p> <span style={{ color: "rgb(183, 202, 212)" }}>•</span>
        <p className="postedAt">{formatDate(created_at)}</p>
      </div>

      <div className="top-section">
        <p className="questionTitle">{title}</p>
        <p className="questionDescription">{description}</p>
      </div>

      {/* Middle Section */}


      {/* Voting for Question */}
      <div className="postActions">
        <div className="question-votes">
          <HoverableButton
            onClick={() => handleQuestionVote("up")}
            svgPath="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"
          />
          <span>{questionVotes}</span>
          <HoverableButton
            onClick={() => handleQuestionVote("down")}
            svgPath="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"
            hoverColor={downvoteHover} // 🔴 apply red hover
          />
        </div>

        <div className="question-comments">
          <HoverableButton
            onClick={() => setShowComments(!showComments)}
            svgPath="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"
            hoverColor={commentHover}
          />
          <span>{answers.length}</span>
        </div>
      </div>

      {showComments && (
        <>
          <div className="bottom-section">
            <input
              className="input-answer"
              placeholder="Have an answer? Let others know"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button onClick={handleAnswerSubmit} className="submit-answer">
              Submit
            </button>
          </div>
          {/* Answers list */}
          <div className="answers-section">
            {answers.length > 0 ? (
              answers.map((a) => (
                <div key={a.id} className="answer">
                  <p className="answer-meta">
                    <span className="answer-username">{a.username}</span>:{" "}
                    {formatDate(a.created_at)}
                  </p>
                  <p className="answer-text">{a.description}</p>
                  <div className="answer-votes">
                    <HoverableButton
                      onClick={() => handleAnswerVote(a.id, "up")}
                      svgPath="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"
                      size={28}
                    />
                    <span>{a.votes || 0}</span>
                    <HoverableButton
                      onClick={() => handleAnswerVote(a.id, "down")}
                      svgPath="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"
                      size={28}
                      hoverColor={downvoteHover} // 🔴 red downvote hover
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-answers">No answers yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionCard;
