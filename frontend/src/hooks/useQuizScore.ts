import { useSuiClientQuery } from '@mysten/dapp-kit';

export function useQuizScore(address: string | undefined) {
    const { data, isPending, refetch } = useSuiClientQuery(
        'getOwnedObjects',
        {
            owner: address || '',
            filter: {
                StructType: "0x...PACKAGE...::game::QuizScore" // Update with actual ID
            },
            options: {
                showContent: true,
            },
        },
        {
            enabled: !!address,
        }
    );

    const quizScoreObj = data?.data?.[0];
    const content = quizScoreObj?.data?.content;

    let dailyLimitUsed = 0;
    let lastReset = 0;
    let id = "";

    if (content?.dataType === 'moveObject') {
        const fields = content.fields as any;
        dailyLimitUsed = Number(fields.daily_limit_used);
        lastReset = Number(fields.last_reset);
        id = quizScoreObj?.data?.objectId || "";
    }

    return {
        dailyLimitUsed,
        lastReset,
        id,
        isLoading: isPending,
        refetch
    };
}
