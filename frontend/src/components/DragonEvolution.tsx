
export default function DragonEvolution({ level, score }: { level: number, score: number }) {
    // Determine attributes based on level (simulating on-chain logic visual)
    const getDragonSeed = (lvl: number) => {
        if (lvl >= 50) return "ElderTitan";
        if (lvl >= 20) return "AncientBeast";
        if (lvl >= 10) return "AdultDrake";
        if (lvl >= 5) return "YoungWyvern";
        return "BabyHatchling";
    };

    const seed = getDragonSeed(level) + "_" + level; // add level to change it slighly or keep static per tier
    const imageUrl = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&backgroundColor=transparent`;

    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 box-glow w-full max-w-sm relative">
            <div className="absolute top-4 right-4 text-xs font-mono text-neon-green px-2 py-1 bg-neon-green/10 rounded border border-neon-green/30">
                Lvl {level}
            </div>

            <div className="relative w-48 h-48 mb-6 transition-all duration-500 hover:scale-110">
                {/* Glow effect behind dragon */}
                <div className="absolute inset-0 bg-quiz-accent rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <img
                    src={imageUrl}
                    alt="Your Dragon"
                    className="w-full h-full drop-shadow-2xl relative z-10"
                />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 font-outfit">
                {level >= 50 ? "Elder Dragon God" :
                    level >= 20 ? "Ancient Dragon" :
                        level >= 10 ? "Adult Dragon" : "Rising Hatchling"}
            </h3>

            <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2 mt-4">
                <div className={`bg-quiz-accent h-2.5 rounded-full`} style={{ width: `${(score % 50) * 2}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mb-4">
                {50 - (score % 50)} points to next evolution
            </p>

            <div className="grid grid-cols-2 gap-4 w-full text-center">
                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Total Score</p>
                    <p className="text-lg font-bold text-neon-green">{score}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-400">Value (SUI)</p>
                    <p className="text-lg font-bold text-quiz-highlight">{(level * 0.1).toFixed(1)}</p>
                </div>
            </div>
        </div>
    );
}
