import { useRef } from 'react';

type DragonProps = {
    id: string;
    level: number;
    score: number;
    rarity: number;
    image_url: string;
};

export default function DragonCard({ dragon, onClick }: { dragon: DragonProps, onClick?: () => void }) {
    // Rarity Visuals
    const getRarityColor = (r: number) => {
        if (r >= 5) return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]";
        if (r >= 3) return "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]";
        return "text-blue-400";
    };

    const nextLevelScore = dragon.level * 50; // Simplified logic based on "every 50 points"
    // Actually prompt said "dragon.score % 50 == 0" levels up.
    // So progress is score % 50 out of 50.
    const progress = dragon.score % 50;
    const progressPercent = (progress / 50) * 100;

    return (
        <div
            className="relative group w-full max-w-sm bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-6 transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 hover:border-quiz-accent/50 box-glow overflow-hidden"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >

            {/* Rarity & Level Badge */}
            <div className="flex justify-between items-center mb-4">
                <span className={`font-bold font-mono text-xl ${getRarityColor(dragon.rarity)}`}>
                    {'★'.repeat(dragon.rarity) || '★'}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-neon-green border border-neon-green/20">
                    Lvl {dragon.level}
                </span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-quiz-accent/20 to-neon-purple/20 rounded-full blur-2xl animate-pulse group-hover:opacity-100 transition-opacity opacity-50"></div>
                <img src={dragon.image_url} alt="Dragon" className="w-4/5 h-4/5 object-contain z-10 drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2 font-outfit truncate">
                Dragon #{dragon.id.slice(0, 4)}
            </h3>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider">
                    <span>Evolution Progress</span>
                    <span className="text-quiz-highlight">{progress}/50 XP</span>
                </div>
                <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                    {/* Neon Bar */}
                    <div
                        className="h-full bg-gradient-to-r from-neon-purple to-quiz-accent shadow-[0_0_15px_rgba(171,154,235,0.6)]"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-mono">
                    Score: <span className="text-white">{dragon.score}</span>
                </div>
                <button className="text-xs text-quiz-accent hover:text-white transition-colors uppercase font-bold tracking-widest">
                    View Details &rarr;
                </button>
            </div>
        </div>
    );
}
