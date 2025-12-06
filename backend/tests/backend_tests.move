#[test_only]
module quiz_game::backend_tests {
    use sui::test_scenario;
    use sui::clock::{Self, Clock};
    use sui::coin::{Self};
    use sui::sui::SUI;
    use quiz_game::game::{Self, GameBank, UserAccount, Leaderboard, DragonNFT};

    const ADMIN: address = @0xA;
    const USER1: address = @0xB;

    #[test]
    fun test_game_flow() {
        let mut scenario = test_scenario::begin(ADMIN);
        
        // 1. Init
        {
            game::init(test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            // Deposit to bank
            let mut bank = test_scenario::take_shared<GameBank>(&scenario);
            let coin = coin::mint_for_testing<SUI>(1000_000_000_000, test_scenario::ctx(&mut scenario));
            game::deposit_to_bank(&mut bank, coin, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(bank);
        };

        // 2. User Register
        test_scenario::next_tx(&mut scenario, USER1);
        {
            game::register_user(test_scenario::ctx(&mut scenario));
        };

        // 3. Play Game
        test_scenario::next_tx(&mut scenario, USER1);
        {
            let mut account = test_scenario::take_from_sender<UserAccount>(&scenario);
            let mut leaderboard = test_scenario::take_shared<Leaderboard>(&scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            clock::set_for_testing(&mut clock, 10000); // Time moving forward

            // Correct 8 answers
            game::submit_daily_result(&mut account, &clock, 8, &mut leaderboard, test_scenario::ctx(&mut scenario));

            clock::destroy_for_testing(clock);
            test_scenario::return_shared(leaderboard);
            test_scenario::return_to_sender(&scenario, account);
        };

        // 4. Check Dragon Mint
        test_scenario::next_tx(&mut scenario, USER1);
        {
            let mut account = test_scenario::take_from_sender<UserAccount>(&scenario);
            // Total score should be 8. No dragon yet? Points per level = 50. 
            // 8 / 50 = 0. Level 1 + 0 = 1.
            
            game::mint_dragon(&mut account, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, account);
        };

        test_scenario::next_tx(&mut scenario, USER1);
        {
            let dragon = test_scenario::take_from_sender<DragonNFT>(&scenario);
            assert!(game::get_dragon_level(&dragon) == 1, 0); // Need getter or check fields if public
            // Returning dragon to sender since we can't drop it easily without burning
            test_scenario::return_to_sender(&scenario, dragon);
        };

        test_scenario::end(scenario);
    }
}
