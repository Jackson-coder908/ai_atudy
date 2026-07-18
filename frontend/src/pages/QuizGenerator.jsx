import React, { useState } from 'react';
import { generateQuiz } from '../api/api';
import { Brain, Award, CheckCircle2, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  
  // Interactive quiz play state
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [quizFinished, setQuizFinished] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setQuiz(null);
    setUserAnswers({});
    setQuizFinished(false);

    try {
      const data = await generateQuiz(topic.trim(), difficulty);
      setQuiz(data);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (userAnswers[questionIdx] !== undefined) return; // Answer already locked for this question
    
    setUserAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  const handleReset = () => {
    setQuiz(null);
    setTopic('');
    setDifficulty('Beginner');
    setUserAnswers({});
    setQuizFinished(false);
    setError('');
  };

  // Compute final score
  const getScore = () => {
    let score = 0;
    if (!quiz) return score;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const allAnswered = quiz && Object.keys(userAnswers).length === quiz.questions.length;

  return (
    <div className="flex-1 overflow-y-auto px-md md:px-lg lg:px-xxl py-xl">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-xl animate-in fade-in duration-200">
          <h1 className="text-display-md font-bold text-on-surface mb-xs flex items-center gap-xs">
            <Brain className="w-8 h-8 text-primary" />
            <span>Quiz Generator</span>
          </h1>
          <p className="text-body-md text-secondary">
            Generate custom multiple choice quizzes instantly using AI.
          </p>
        </header>

        {/* Loading Spinner State */}
        {loading && (
          <div className="bg-surface rounded-2xl border border-outline-variant/60 p-12 text-center flex flex-col items-center justify-center shadow-sm animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <Brain className="w-8 h-8 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface mb-2">Generating Quiz...</h3>
            <p className="text-body-sm text-secondary max-w-sm">
              Our AI is synthesizing concepts regarding "{topic}" at an {difficulty} level. This may take a few seconds.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-lg p-4 bg-error-container/20 border border-error/30 text-error-on-container rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-label-md font-bold">Generation Failed</h4>
              <p className="text-body-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Initial Form Screen (only visible when quiz is null and not loading) */}
        {!quiz && !loading && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-lg shadow-sm animate-in fade-in duration-300">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="topic-input" className="text-label-md font-bold text-on-surface block mb-2">
                  Topic *
                </label>
                <input
                  id="topic-input"
                  required
                  type="text"
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="e.g., Mitosis, Big-O Complexity, Quantum Computing..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="difficulty-select" className="text-label-md font-bold text-on-surface block mb-2">
                  Difficulty Level *
                </label>
                <select
                  id="difficulty-select"
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!topic.trim()}
                className={`w-full py-3.5 rounded-xl text-label-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  !topic.trim()
                    ? 'bg-outline-variant/40 text-outline cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-container text-on-primary active:scale-98'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Generate Quiz</span>
              </button>
            </form>
          </div>
        )}

        {/* Quiz View (displayed upon successful API response) */}
        {quiz && !loading && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header Status Card */}
            <div className="bg-surface-container-low/60 rounded-2xl border border-outline-variant/60 p-lg flex flex-col md:flex-row md:items-center justify-between gap-lg">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface mb-xs">{quiz.title}</h2>
                <div className="flex flex-wrap items-center gap-sm">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-label-sm font-semibold rounded-full">
                    {quiz.difficulty}
                  </span>
                  <span className="text-label-sm text-secondary font-medium">
                    Topic: {topic}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-xs px-4 py-2 border border-outline-variant rounded-xl text-label-md hover:bg-surface-container transition-colors bg-surface"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Reset Form</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {quiz.questions.map((q, qIdx) => {
                const answerIdx = userAnswers[qIdx];
                const isLocked = answerIdx !== undefined;

                return (
                  <div 
                    key={qIdx} 
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-lg shadow-sm"
                  >
                    <span className="text-label-sm text-outline uppercase tracking-wider font-bold block mb-sm">
                      Question #{qIdx + 1}
                    </span>
                    <h3 className="text-body-lg text-on-surface font-semibold leading-relaxed mb-lg">
                      {q.question}
                    </h3>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      {q.options.map((option, oIdx) => {
                        const isCorrect = oIdx === q.correctAnswer;
                        const isSelected = oIdx === answerIdx;

                        let style = 'border-outline-variant hover:bg-surface-container hover:border-outline';
                        let icon = null;

                        if (isLocked) {
                          if (isCorrect) {
                            style = 'border-emerald-500 bg-emerald-500/10 text-emerald-950 font-semibold';
                            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                          } else if (isSelected) {
                            style = 'border-red-500 bg-red-500/10 text-red-950 font-semibold';
                            icon = <XCircle className="w-4 h-4 text-red-600" />;
                          } else {
                            style = 'opacity-50 border-outline-variant/30 cursor-default';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            disabled={isLocked}
                            className={`flex items-center justify-between text-left p-3.5 border rounded-xl transition-all duration-150 ${style}`}
                          >
                            <span className="text-body-md pr-2">{option}</span>
                            {icon}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Results Panel */}
            {allAnswered && (
              <div className="bg-surface border border-outline-variant/80 rounded-2xl p-lg text-center flex flex-col items-center justify-center shadow-lg animate-in zoom-in-95 duration-300">
                <Award className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-headline-md font-bold text-on-surface mb-xs">Quiz Completed!</h3>
                <p className="text-body-md text-secondary mb-6">
                  You scored **{getScore()} / {quiz.questions.length}** ({Math.round((getScore() / quiz.questions.length) * 100)}%).
                </p>

                <div className="flex gap-sm w-full max-w-sm justify-center">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl text-label-md font-semibold hover:bg-surface-container transition-colors bg-surface"
                  >
                    Reset & Generate
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex-grow btn-primary py-2.5 font-semibold flex items-center justify-center gap-xs shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Extra breathing room at bottom */}
        <div className="h-24 lg:h-12" />
      </div>
    </div>
  );
}
