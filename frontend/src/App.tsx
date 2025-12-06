import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import WelcomeScreen from './components/WelcomeScreen';
import QuizCard from './components/QuizCard';
import DragonEvolution from './components/DragonEvolution';
import Leaderboard from './components/Leaderboard';

// Mock Data
const MOCK_QUESTIONS = [
  { q: "What is the consensus mechanism of Sui?", options: ["Proof of Work", "Delegated Proof of Stake", "Proof of History", "Proof of Authority"], correct: 1 },
  { q: "Which language is used to write Sui smart contracts?", options: ["Rust", "Solidity", "Move", "Python"], correct: 2 },
  { q: "What is the native token of the Sui network?", options: ["APT", "SOL", "SUI", "ETH"], correct: 2 },
];

const MOCK_LEADERBOARD = [
  { rank: 1, address: "0x123...456", score: 1250, level: 25 },
  { rank: 2, address: "0xabc...def", score: 980, level: 19 },
  { rank: 3, address: "0x789...012", score: 450, level: 9 },
];

export default function App() {
  const wallet = useWallet();
  const [gameState, setGameState] = useState<'WELCOME' | 'PLAYING' | 'DASHBOARD'>('WELCOME');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(150);
  const [isBurning, setIsBurning] = useState(false);

  const userDragonLevel = Math.floor(1 + (totalScore / 50));

  const handleStart = () => {
    if (!wallet.connected) return;
    setGameState('PLAYING');
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 1);
      setTotalScore(s => s + 1);
    }

    if (currentQIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setTimeout(() => setGameState('DASHBOARD'), 1000);
    }
  };

  const handleBurn = async () => {
    if (!wallet.connected) return;
    setIsBurning(true);
    try {
      const tx = new Transaction();
      // Update with actual Package and Module IDs
      const PACKAGE_ID = "0x...PACKAGE...";
      const BANK_ID = "0x...BANK...";
      const DRAGON_ID = "0x...NFT_ID..."; // Should be selected from list

      tx.moveCall({
        target: `${PACKAGE_ID}::game::burn_dragon_for_sui`,
        arguments: [
          tx.object(BANK_ID),
          tx.object(DRAGON_ID)
        ]
      });

      const res = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log("Burn success:", res);
      alert("Dragon burned! SUI rewards sent.");
      setGameState('WELCOME'); // Reset or update state
    } catch (e) {
      console.error("Burn failed", e);
      alert("Burn simulated (Contract not deployed).");
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-outfit relative">
      <nav className="absolute top-0 right-0 p-4 z-50 flex gap-4">
        {gameState === 'DASHBOARD' && (
          <button onClick={() => setGameState('PLAYING')} className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10">
            Top Up Questions
          </button>
        )}
        {wallet.connected && <div className="text-sm font-mono bg-black/50 px-3 py-1 rounded border border-quiz-accent/30">{wallet.address?.slice(0, 6)}...</div>}
      </nav>

      {gameState === 'WELCOME' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {gameState === 'PLAYING' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <QuizCard
            question={MOCK_QUESTIONS[currentQIndex % MOCK_QUESTIONS.length].q}
            options={MOCK_QUESTIONS[currentQIndex % MOCK_QUESTIONS.length].options}
            correctIndex={MOCK_QUESTIONS[currentQIndex % MOCK_QUESTIONS.length].correct}
            onAnswer={handleAnswer}
            questionNumber={currentQIndex + 1}
            totalQuestions={MOCK_QUESTIONS.length}
          />
        </div>
      )}

      {gameState === 'DASHBOARD' && (
        <div className="min-h-screen p-8 pt-20 flex flex-col items-center gap-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-quiz-accent text-center mb-4">
            Sanctuary of the Dragon
          </h2>

          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-start">
            <div className="flex-1 flex flex-col items-center gap-4 w-full">
              <h3 className="text-xl text-gray-400 uppercase tracking-widest">My Dragons</h3>
              {/* Simulating a list of NFTs */}
              <div className="w-full flex justify-center">
                <DragonEvolution level={userDragonLevel} score={totalScore} />
              </div>
            </div>

            <div className="flex-1 flex justify-center w-full">
              <Leaderboard players={MOCK_LEADERBOARD} />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleBurn}
              disabled={isBurning}
              className="px-6 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/40 transition-colors uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50"
            >
              {isBurning ? "Burning..." : "Burn Dragon for SUI"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
