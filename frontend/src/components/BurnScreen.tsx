import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useWallet } from '@suiet/wallet-kit';
import { useDragons } from '../hooks/useDragons';
import DragonCard from './DragonCard';

export default function BurnScreen({ onBack }: { onBack: () => void }) {
    const wallet = useWallet();
    const { dragons, isLoading } = useDragons(wallet.address);
    const [selectedDragonId, setSelectedDragonId] = useState<string | null>(null);
    const [isBurning, setIsBurning] = useState(false);

    const selectedDragon = dragons.find(d => d.id === selectedDragonId);
    const estimatedReward = selectedDragon ? selectedDragon.rarity * 1.0 : 0; // 1 SUI per Rarity

    const handleBurn = async () => {
        if (!wallet.connected || !selectedDragon) return;
        setIsBurning(true);
        try {
            const tx = new Transaction();
            const PACKAGE_ID = "0x...PACKAGE...";
            const BANK_ID = "0x...BANK...";

            tx.moveCall({
                target: `${PACKAGE_ID}::game::burn_dragon_for_sui`,
                arguments: [
                    tx.object(BANK_ID),
                    tx.object(selectedDragon.id)
                ]
            });

            const res = await wallet.signAndExecuteTransaction({
                transaction: tx
            });

            console.log("Burn success:", res);
            alert(`Successfully burned dragon! Reward sent.`);
            setSelectedDragonId(null);
            // Ideally refill list here or depend on hook revalidation
            onBack();
        } catch (e) {
            console.error("Burn failed", e);
            alert("Burn failed (check console). Ensure Contract IDs are set.");
        } finally {
            setIsBurning(false);
        }
    };

    return (
        <div className="min-h-screen p-8 pt-20 flex flex-col items-center animate-fade-in relative">
            <button onClick={onBack} className="absolute top-24 left-8 text-gray-400 hover:text-white flex items-center gap-2">
                &larr; Back to Dashboard
            </button>

            <h2 className="text-4xl font-bold text-red-500 mb-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                Dragon Sacrifice
            </h2>

            <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">
                {/* Left: Gallery */}
                <div className="flex-1">
                    <h3 className="text-xl text-gray-400 mb-4 uppercase tracking-widest">Select to Sanction</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {isLoading ? (
                            <div className="text-neon-green animate-pulse">Loading Dragons...</div>
                        ) : dragons.length > 0 ? (
                            dragons.map(dragon => (
                                <div
                                    key={dragon.id}
                                    onClick={() => setSelectedDragonId(dragon.id)}
                                    className={`cursor-pointer transition-all duration-300 transform ${selectedDragonId === dragon.id ? 'scale-105 ring-2 ring-red-500 rounded-3xl' : 'hover:scale-102 opacity-70 hover:opacity-100'}`}
                                >
                                    <DragonCard dragon={dragon} />
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500">No dragons to burn.</div>
                        )}
                    </div>
                </div>

                {/* Right: Confirmation Panel */}
                <div className="w-full lg:w-96 flex flex-col gap-6 p-8 bg-black/40 border border-red-500/30 rounded-3xl backdrop-blur-xl h-fit sticky top-24">
                    {selectedDragon ? (
                        <>
                            <div className="text-center">
                                <div className="text-gray-400 text-sm mb-2">SACRIFICING</div>
                                <div className="text-2xl font-bold text-white mb-2 font-outfit">Level {selectedDragon.level}</div>
                                <div className="text-yellow-400 font-mono text-lg">{'★'.repeat(selectedDragon.rarity)}</div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Base Value</span>
                                    <span className="text-white">1.0 SUI</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Rarity Multiplier</span>
                                    <span className="text-yellow-400">x{selectedDragon.rarity}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-white/10">
                                    <span className="text-gray-200">Estimated Reward</span>
                                    <span className="text-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
                                        {estimatedReward.toFixed(1)} SUI
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleBurn}
                                disabled={isBurning}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold tracking-widest text-white shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isBurning ? "BURNING..." : "BURN & CLAIM"}
                            </button>

                            <p className="text-center text-xs text-red-400/60 mt-2">
                                Warning: This action is irreversible. The NFT will be destroyed forever.
                            </p>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 italic text-center">
                            Select a dragon from the list to view burn details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
