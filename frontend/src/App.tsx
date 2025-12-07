// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import WelcomeScreen from './components/WelcomeScreen';
import QuizCard from './components/QuizCard';
import DragonCard from './components/DragonCard';
import Leaderboard from './components/Leaderboard';
import BurnScreen from './components/BurnScreen';
import { useDragons } from './hooks/useDragons';
import { useQuizScore } from './hooks/useQuizScore';
import { useLeaderboard } from './hooks/useLeaderboard';
import { getRandomQuestions } from './data/questions';

// --- GÖRSEL EŞLEŞTİRME ---
const DRAGON_IMAGES: Record<number, string> = {
  1: "../public/dragons/stage_1.jpg",
  2: "../public/dragons/stage_2.png",
  3: "../public/dragons/stage_3.jpg",
  4: "../public/dragons/stage_4.jpg",
  5: "../public/dragons/stage_5.jpg"
};

export default function App() {
  const wallet = useWallet();
  const [gameState, setGameState] = useState<'WELCOME' | 'PLAYING' | 'DASHBOARD' | 'BURN'>('WELCOME');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);

  // Hook'ları çağırıyoruz ama hata vermemesi için kullanmadıklarımızı dert etmiyoruz
  const { dragons, isLoading: isDragonsLoading } = useDragons(wallet.address || '');
  const quizScoreData = useQuizScore(wallet.address || ''); // Değişkeni tek parça aldık
  const { players } = useLeaderboard();

  // --- MOCK DATA (SAHTE EJDERHA) ---
  const mockDragon = {
    id: 'temp-dragon-1',
    name: 'Baby Dragon (Preview)',
    stage: 1,
    image_url: DRAGON_IMAGES[1]
  };

  // Ejderha varsa onu göster, yoksa sahteyi
  const displayDragons = dragons.length > 0 ? dragons : [mockDragon];
  const activeDragonId = displayDragons[0]?.id;

  const handleStart = () => {
    // Test için cüzdan kontrolünü kapattım, istersen açabilirsin
    // if (!wallet.connected) { alert("Wallet bağlayın"); return; }

    const sessionQuestions = getRandomQuestions(5);
    setQuestions(sessionQuestions);
    setGameState('PLAYING');
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 1);
      console.log("Doğru cevap! (Blockchain kapalı)");
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setTimeout(() => setGameState('DASHBOARD'), 1000);
    }
  };

  return (
    <div className="min-h-screen text-white font-outfit relative bg-gray-900">
      <nav className="absolute top-0 right-0 p-4 z-50 flex gap-4">
        {gameState === 'DASHBOARD' && (
          <button onClick={() => setGameState('PLAYING')} className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10">
            Tekrar Oyna
          </button>
        )}
        {wallet.connected && <div className="text-sm font-mono bg-black/50 px-3 py-1 rounded border border-quiz-accent/30">{wallet.address?.slice(0, 6)}...</div>}
      </nav>

      {gameState === 'WELCOME' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {gameState === 'PLAYING' && questions.length > 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <QuizCard
            question={questions[currentQIndex].q}
            options={questions[currentQIndex].options}
            correctIndex={questions[currentQIndex].correct}
            onAnswer={handleAnswer}
            questionNumber={currentQIndex + 1}
            totalQuestions={questions.length}
          />
        </div>
      )}

      {gameState === 'DASHBOARD' && (
        <div className="min-h-screen p-8 pt-20 flex flex-col items-center gap-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 text-center mb-4">
            Ejderha Tapınağı
          </h2>

          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-start">
            <div className="flex-1 flex flex-col items-center gap-4 w-full">
              <h3 className="text-xl text-gray-400 uppercase tracking-widest">Ejderhalarım</h3>

              <div className="w-full flex flex-wrap justify-center gap-6">
                {displayDragons.map((dragon: any) => (
                  <div key={dragon.id} className="relative">
                    <DragonCard
                      dragon={{
                        ...dragon,
                        // Backend Stage 0 (Egg) -> Image 1 (stage_1.jpg)
                        image_url: DRAGON_IMAGES[(dragon.stage || 0) + 1] || DRAGON_IMAGES[1]
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Starton Legends Leaderboard */}
            <div className="w-full max-w-md bg-gray-800/50 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>🏆</span> Starton Legends
              </h3>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "0x12..AB", score: 1540 },
                  { rank: 2, name: "MystenWizard", score: 1250 },
                  { rank: 3, name: "SuiWhale", score: 980 },
                  { rank: 4, name: "DragonMaster", score: 850 },
                  { rank: 5, name: "Newbie", score: 320 },
                ].map((player) => (
                  <div key={player.rank} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold w-6 text-center ${player.rank === 1 ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {player.rank}
                      </span>
                      <span className="font-mono text-sm text-gray-300">{player.name}</span>
                    </div>
                    <span className="text-neon-green font-bold">{player.score} XP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center w-full">
              <Leaderboard players={players} />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setGameState('BURN')}
              className="px-6 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/40 transition-colors uppercase font-bold tracking-widest"
            >
              Burn Chamber
            </button>
          </div>
        </div>
      )}

      {gameState === 'BURN' && (
        <BurnScreen onBack={() => setGameState('DASHBOARD')} />
      )}
    </div>
  );
}