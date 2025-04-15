import { useEffect, useState } from 'react';

function App() {
  const [words, setWords] = useState([]);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [usedWords, setUsedWords] = useState([]);
  const [questionLimit, setQuestionLimit] = useState(null); // 총 문제 수
  const [isReady, setIsReady] = useState(false); // 퀴즈 시작 여부

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetch('/words.json')
      .then(res => res.json())
      .then(data => setWords(data));
  }, []);

  const startQuiz = (limit) => {
    if (words.length === 0) {
      alert("단어 데이터를 불러오지 못했습니다.");
      return;
    }
  
    setQuestionLimit(limit);
    setIsReady(true);
    generateQuestion(words, limit, []); // limit 직접 넘김!
  };
  
  
  

  const generateQuestion = (wordList, questionLimit, prevUsed = usedWords) => {
    const availableWords = wordList.filter(word =>
      !prevUsed.some(used => used.word === word.word)
    );
  
    if (prevUsed.length >= questionLimit || availableWords.length === 0) {
      setQuestion(null);
      setFeedback("🎉 퀴즈 완료! 수고하셨습니다!");
      return;
    }
  
    const correct = availableWords[Math.floor(Math.random() * availableWords.length)];
  
    const otherChoices = wordList
      .filter(w => w.word !== correct.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  
    const allChoices = [...otherChoices, correct].sort(() => 0.5 - Math.random());
  
    setQuestion(correct);
    setChoices(allChoices);
    setFeedback("");
    setUsedWords(prev => [...prev, correct]);
  };
  
  
  const handleAnswer = (selected) => {
    if (selected.meaning === question.meaning) {
      setFeedback("✅ 정답입니다!");
    } else {
      setFeedback(`❌ 오답입니다. 정답: ${question.meaning}`);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex(prev => prev + 1);
    generateQuestion(words, questionLimit);
  };
  

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>영어 단어 퀴즈 🧠</h1>

      {!isReady && (
        <div style={{ marginTop: "2rem" }}>
          <p>몇 문제를 풀고 싶으신가요?</p>
          <button onClick={() => startQuiz(5)} style={{ margin: "6px" }}>5문제</button>
          <button onClick={() => startQuiz(10)} style={{ margin: "6px" }}>10문제</button>
          <button onClick={() => startQuiz(20)} style={{ margin: "6px" }}>20문제</button>
        </div>
      )}

      {isReady && question && (
        <>
          <h2 style={{ marginTop: "2rem" }}>
            Q{questionIndex + 1}. "{question.word}"의 뜻은?
          </h2>

          <button
            onClick={() => speak(question.word)}
            style={{ marginBottom: "1rem", padding: "6px 12px", cursor: "pointer" }}
          >
            🔊 발음 듣기
          </button>

          <ul>
            {choices.map((choice, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleAnswer(choice)}
                  style={{ margin: "8px", padding: "10px 20px", cursor: "pointer" }}
                >
                  {choice.meaning}
                </button>
              </li>
            ))}
          </ul>

          <p style={{ marginTop: "1rem" }}>{feedback}</p>

          {feedback && (
            <button onClick={nextQuestion} style={{ marginTop: "1rem" }}>
              다음 문제 ▶
            </button>
          )}
        </>
      )}

      {isReady && !question && feedback && (
        <>
          <p style={{ marginTop: "2rem", fontSize: "1.2rem" }}>{feedback}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem", padding: "10px 20px" }}
          >
            🔄 다시 시작하기
          </button>
        </>
      )}
    </div>
  );
}

export default App;
