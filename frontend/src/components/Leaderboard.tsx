
interface Player {
    rank: number;
    address: string;
    score: number;
    level: number;
}

export default function Leaderboard({ players }: { players: Player[] }) {
    return (
        <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl border border-quiz-highlight/20 p-6 box-glow">
            <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-quiz-accent to-quiz-highlight uppercase tracking-wider">
                Dragon Lords
            </h2>

            <div className="space-y-3">
                {players.map((player) => (
                    <div
                        key={player.rank}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/10 ${player.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50' :
                                player.rank <= 3 ? 'bg-white/5 border border-white/10' : 'border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${player.rank === 1 ? 'bg-yellow-500 text-black' :
                                    player.rank === 2 ? 'bg-gray-300 text-black' :
                                        player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-500'
                                }`}>
                                {player.rank}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-mono text-sm text-gray-300">
                                    {player.address.slice(0, 6)}...{player.address.slice(-4)}
                                </span>
                                <span className="text-xs text-quiz-highlight">Lvl {player.level} Dragon</span>
                            </div>
                        </div>
                        <div className="font-bold text-lg text-neon-green">
                            {player.score}
                        </div>
                    </div>
                ))}

                {players.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No legends yet. Be the first.
                    </div>
                )}
            </div>
        </div>
    );
}
