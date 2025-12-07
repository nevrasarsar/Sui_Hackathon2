import { useSuiClientQuery } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';

export type LeaderboardEntry = {
    rank: number;
    address: string;
    score: number;
    level: number;
    rarity: number;
};

export function useLeaderboard() {
    const client = useSuiClient();
    const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Get Leaderboard Object to find Table ID
    const { data: leaderboardObj } = useSuiClientQuery('getObject', {
        id: "0x...LEADERBOARD_ID...", // Replace with actual Shared Object ID
        options: { showContent: true }
    });

    useEffect(() => {
        async function fetchScores() {
            if (!leaderboardObj?.data?.content) return;

            const content = leaderboardObj.data.content as any;
            const tableId = content.fields?.scores?.fields?.id?.id;

            if (!tableId) return;

            setIsLoading(true);
            try {
                // 2. Fetch Table Entries using Dynamic Fields
                // Note: This fetches the keys (User Addresses) and wraps Values
                const fields = await client.getDynamicFields({
                    parentId: tableId,
                });

                // 3. For each field, fetching the value might be needed if not embedded, 
                // but usually simple types like u64 are embedded or we need 'getDynamicFieldObject'.
                // However, for Table<address, u64>, the field value struct is often opaque via API 
                // without `getDynamicFieldObject`.
                // Optimization: For hackathon, we assume limited entries and fetch one by one or batch.

                const entries = await Promise.all(fields.data.map(async (field) => {
                    const detail = await client.getDynamicFieldObject({
                        parentId: tableId,
                        name: field.name
                    });

                    // Helper to extract value from dynamic field wrapper
                    const valueContent = detail.data?.content as any;
                    const score = Number(valueContent?.fields?.value || 0);
                    const address = field.name.value as string;

                    return {
                        address,
                        score
                    };
                }));

                // 4. Sort and Format
                const formatted = entries
                    .sort((a, b) => b.score - a.score)
                    .map((entry, index) => {
                        // Infer Level/Rarity from Score since we don't store it in Leaderboard Table
                        const level = Math.floor(1 + entry.score / 50);
                        const rarity = Math.floor(level / 50) < 1 ? 1 : Math.floor(level / 50);

                        return {
                            rank: index + 1,
                            address: entry.address,
                            score: entry.score,
                            level,
                            rarity
                        };
                    });

                setPlayers(formatted);

            } catch (e) {
                console.error("Failed to fetch leaderboard", e);
            } finally {
                setIsLoading(false);
            }
        }

        fetchScores();
    }, [leaderboardObj, client]);

    return { players, isLoading };
}
