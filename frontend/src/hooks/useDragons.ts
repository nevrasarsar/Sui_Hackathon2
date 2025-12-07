import { useSuiClientQuery } from '@mysten/dapp-kit';

export function useDragons(address: string | undefined) {
    // 1. Fetch Objects owned by address
    const { data, isPending, error, refetch } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: address || '',
            filter: {
                StructType: "0xf52f076b3e1e03da6955e03d07302b88b8baf5af860ba6d9f28df36b145099bf::game::DragonNFT"
            },
            options: {
                showContent: true,
                showDisplay: true,
            },
        },
        {
            enabled: !!address,
        }
    );

    // 2. Parse Data
    const dragons = data?.data?.map((obj) => {
        const content = obj.data?.content;
        if (content?.dataType !== 'moveObject') return null;

        const fields = content.fields as any;

        // Map Backend 'DragonNFT' fields to Frontend 'Dragon' interface
        return {
            id: obj.data?.objectId || "",
            name: fields.name || "Unknown Dragon",
            stage: Number(fields.stage_level || 0), // Backend: 0-4
            rarity: Number(fields.rarity || 1),
            score: Number(fields.score || 0),
            image_url: fields.url || "", // Backend URL or fallback
        };
    }).filter((d): d is NonNullable<typeof d> => d !== null) || [];

    return { dragons, isLoading: isPending, error, refetch };
}
