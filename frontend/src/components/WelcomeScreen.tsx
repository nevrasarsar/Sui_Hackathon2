import { ConnectButton, useWallet } from '@suiet/wallet-kit';

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
    const wallet = useWallet();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 font-outfit text-transparent bg-clip-text bg-gradient-to-r from-quiz-accent to-neon-purple text-glow animate-pulse">
                SUI QUIZ
            </h1>
            <p className="text-xl md:text-2xl text-quiz-highlight mb-8 max-w-lg font-light">
                Test your knowledge. Evolve your Dragon. Earn SUI.
            </p>

            {!wallet.connected ? (
                <div className="transform scale-125 box-glow rounded-full">
                    <ConnectButton />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-quiz-accent/30 box-glow">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome, Traveler!</h2>
                        <p className="text-sm text-gray-300 font-mono mb-4">
                            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                        </p>
                        <button
                            onClick={onStart}
                            className="px-8 py-3 bg-gradient-to-r from-quiz-accent to-neon-purple rounded-xl font-bold text-white text-lg hover:scale-105 transition-transform duration-200 box-glow shadow-lg"
                        >
                            ENTER THE ARENA
                        </button>
                    </div>
                </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-quiz-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-neon-green rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}
