import type { LeaderboardEntry } from '../hooks/useLeaderboard';

export default function Leaderboard({ players }: { players: LeaderboardEntry[] }) {

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <span className="text-2xl animate-bounce">👑</span>; // Gold
            case 2: return <span className="text-xl text-gray-300">🥈</span>; // Silver
            case 3: return <span className="text-xl text-orange-400">🥉</span>; // Bronze
            default: return <span className="font-mono text-gray-500">#{rank}</span>;
        }
    };

    return (
        <div className="w-full max-w-md bg-opacity-20 bg-black backdrop-blur-lg rounded-3xl border border-white/10 p-6 box-glow">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-6 text-center tracking-widest uppercase">
                Starton Legends
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {players.length === 0 ? (
                    <div className="text-center text-gray-500 italic">No legends yet. Be the first!</div>
                ) : (
                    players.map((player) => (
                        <div
                            key={player.address}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5 ${player.rank === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 flex justify-center">
                                    {getRankIcon(player.rank)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white font-mono">
                                        {player.address.slice(0, 6)}...{player.address.slice(-4)}
                                    </div>
                                    <div className="text-xs text-gray-400 flex gap-2">
                                        <span>Lvl {player.level}</span>
                                        <span className="text-yellow-400">{'★'.repeat(player.rarity)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-neon-green font-bold text-lg">{player.score}</div>
                                <div className="text-xs text-gray-500">XP</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
