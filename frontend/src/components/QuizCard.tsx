import { useState } from 'react';

interface QuizCardProps {
    question: string;
    options: string[];
    correctIndex: number;
    onAnswer: (isCorrect: boolean) => void;
    questionNumber: number;
    totalQuestions: number;
}

export default function QuizCard({ question, options, correctIndex, onAnswer, questionNumber, totalQuestions }: QuizCardProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleSelect = (index: number) => {
        if (isRevealed) return;
        setSelected(index);
        setIsRevealed(true);

        // Little delay to show result before moving on? or immediate?
        // User said "Yanlış cevaplar hemen gösterilsin."
        // Let's call onAnswer after a short expected delay so they can see the color.
        setTimeout(() => {
            onAnswer(index === correctIndex);
            setSelected(null);
            setIsRevealed(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-neon-green to-quiz-accent transition-all duration-500"
                    style={{ width: `${((questionNumber) / totalQuestions) * 100}%` }}
                />
            </div>

            <div className="flex justify-between items-center mb-6 mt-2">
                <h3 className="text-quiz-highlight font-mono tracking-widest text-sm uppercase">
                    Question {questionNumber} / {totalQuestions}
                </h3>
                <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                    Block #{Math.floor(Math.random() * 10000)}
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                {question}
            </h2>

            <div className="space-y-4">
                {options.map((option, idx) => {
                    let stateClass = "border-white/10 hover:border-quiz-highlight/50 hover:bg-white/5";

                    if (isRevealed) {
                        if (idx === correctIndex) {
                            // Gold/Green hybrid effect for correct answer
                            stateClass = "border-neon-green bg-gradient-to-r from-neon-green/20 to-yellow-400/20 text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.4)] scale-[1.02] ring-1 ring-yellow-400/50";
                        } else if (idx === selected) {
                            // Red effect for wrong answer
                            stateClass = "border-red-500 bg-red-500/20 text-red-500 glitch-text shadow-[0_0_15px_rgba(239,68,68,0.4)]";
                        } else {
                            stateClass = "opacity-40 border-transparent grayscale";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={isRevealed}
                            className={`w-full p-4 text-left rounded-xl border transition-all duration-300 transform ${isRevealed ? '' : 'hover:scale-[1.02]'} ${stateClass}`}
                        >
                            <div className="flex items-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold border ${isRevealed && idx === correctIndex ? 'border-neon-green text-neon-green' : 'border-gray-600 text-gray-500'
                                    }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-lg font-medium">{option}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
