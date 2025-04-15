import { useEffect, useState } from 'react';

function App() {
  const [words, setWords] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    fetch('/words.json')
      .then(res => res.json())
      .then(data => {
        setWords(data);
        generateQuestion(data);
      });
  }, []);

  const generateQuestion = (wordList) => {
    const correct = wordList[Math.floor(Math.random() * wordList.length)];
    const otherChoices = wordList
      .filter(w => w.word !== correct.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const allChoices = [...otherChoices, correct].sort(() => 0.5 - Math.random());

    setQuestion(correct);
    setChoices(allChoices);
    setFeedback("");
  };

  const handleAnswer = (selected) => {
    if (selected.meaning === question.meaning) {
      setFeedback("✅ 정답입니다!");
    } else {
      setFeedback(`❌ 오답입니다. 정답: ${question.meaning}`);
    }
  };

  const nextQuestion = () => {
    generateQuestion(words);
    setQuestionIndex(prev => prev + 1);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>영어 단어 퀴즈 🧠</h1>
      {question && (
        <>
          <h2 style={{ marginTop: "2rem" }}>
            Q{questionIndex + 1}. "{question.word}"의 뜻은?
          </h2>
          <ul>
            {choices.map((choice, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleAnswer(choice)}
                  style={{ margin: "8px", padding: "10px 20px" }}
                >
                  {choice.meaning}
                </button>
              </li>
            ))}
          </ul>
          <p>{feedback}</p>
          {feedback && (
            <button onClick={nextQuestion}>다음 문제 ▶</button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
