import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import DragonCard from "./DragonCard";

interface ProfileScreenProps {
    profileId: string;
    activeDragon: any; // Using any for now, should be typed
    onEvolve: () => void;
    onSwap: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profileId, activeDragon, onEvolve, onSwap }) => {
    const account = useCurrentAccount();

    // NOTE: In a real app we would fetch the Profile Object here using profileId
    // For now, we rely on props passed from App (which might be fetching or mocking)
    // Assuming App.tsx handles the data fetching for now to keep it centralized as per our pattern.

    if (!account) {
        return <div className="text-white text-center">Please Connect Wallet</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 rounded-xl p-8 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                    Player Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Wallet Address</p>
                            <p className="text-white font-mono text-sm truncate">{account.address}</p>
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-sm">Total Correct Answers</p>
                                <p className="text-3xl font-bold text-green-400">
                                    {/* Placeholder or Prop */}
                                    {activeDragon ? "..." : "0"}
                                    {/* We need the profile score here. App.tsx needs to pass score. */}
                                </p>
                            </div>
                            <div className="text-4xl">🧠</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <h3 className="text-xl text-purple-300 mb-4">Current Companion</h3>
                        {activeDragon ? (
                            <div className="transform scale-90">
                                <DragonCard
                                    dragon={activeDragon}
                                    onClick={() => { }}
                                />

                                {/* Actions */}
                                <div className="mt-4 flex gap-4">
                                    {/* Evolve Button Logic handled by parent for now */}
                                    <button
                                        onClick={onEvolve}
                                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition"
                                    >
                                        Check Evolution
                                    </button>

                                    {activeDragon.stage_level === 4 && (
                                        <button
                                            onClick={onSwap}
                                            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg font-bold hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition"
                                        >
                                            Claim 10 SUI Reward
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic border-2 border-dashed border-gray-700 rounded-xl p-8">
                                No Dragon Hatched Yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
