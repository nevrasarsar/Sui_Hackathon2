#[test_only]
module sui_quiz::backend_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string;
    use std::vector;
    use std::option;
    
    // Import the game module
    use sui_quiz::game::{Self, AdminCap, AdminConfig, GameBank, DragonNFT, PlayerGameProfile};

    const ADMIN: address = @0xAD;
    const USER: address = @0xB0B;

    // Helper to start test
    fun begin_test(): Scenario {
        let mut scenario = test_scenario::begin(ADMIN);
        
        // Run Init
        game::init(test_scenario::ctx(&mut scenario));
        
        test_scenario::next_tx(&mut scenario, ADMIN);
        scenario
    }

    #[test]
    fun test_init_and_profile_creation() {
        let mut scenario = begin_test();

        // Admin should have AdminCap
        {
            let cap = test_scenario::take_from_sender<AdminCap>(&scenario);
            test_scenario::return_to_sender(&scenario, cap);
        };

        // User Setup
        test_scenario::next_tx(&mut scenario, USER);
        
        // Create Profile
        {
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::initialize_player_profile(&clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
        };

        test_scenario::next_tx(&mut scenario, USER);
        
        // Check Profile
        {
            let profile = test_scenario::take_from_sender<PlayerGameProfile>(&scenario);
            // Just verifying it exists and we can return it
            test_scenario::return_to_sender(&scenario, profile);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_hatching() {
        let mut scenario = begin_test();
        
        // 1. User Creates Profile
        test_scenario::next_tx(&mut scenario, USER);
        {
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::initialize_player_profile(&clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
        };

        // 2. Submit Quiz (3 Correct - Trigger Hatch)
        test_scenario::next_tx(&mut scenario, USER);
        {
            let mut profile = test_scenario::take_from_sender<PlayerGameProfile>(&scenario);
            let config = test_scenario::take_shared<AdminConfig>(&scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 20000); // 20s > 0 (Anti-cheat)

            // Submit 3 correct answers
            game::submit_quiz_results(&mut profile, &config, &clock, 3, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, profile);
            test_scenario::return_shared(config);
            clock::destroy_for_testing(clock);
        };

        // 3. Verify Dragon Mint
        test_scenario::next_tx(&mut scenario, USER);
        {
            let dragon = test_scenario::take_from_sender<DragonNFT>(&scenario);
            // It should exist. Return it.
            test_scenario::return_to_sender(&scenario, dragon);
        };

        test_scenario::end(scenario);
    }

    #[test]
    fun test_evolution_to_legendary() {
        let mut scenario = begin_test();
        
        // Setup Profile & First Dragon (Manual setup simulation)
        test_scenario::next_tx(&mut scenario, USER);
        {
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            game::initialize_player_profile(&clock, test_scenario::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
        };

        test_scenario::next_tx(&mut scenario, USER);
        {
            let mut profile = test_scenario::take_from_sender<PlayerGameProfile>(&scenario);
            let config = test_scenario::take_shared<AdminConfig>(&scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 20000);

            // Hatch (3 pts)
            game::submit_quiz_results(&mut profile, &config, &clock, 3, test_scenario::ctx(&mut scenario));
            
            test_scenario::return_to_sender(&scenario, profile);
            test_scenario::return_shared(config);
            clock::destroy_for_testing(clock);
        };

        // 4. Score 12 more points (Total 15)
        test_scenario::next_tx(&mut scenario, USER);
        {
            let mut profile = test_scenario::take_from_sender<PlayerGameProfile>(&scenario);
            let config = test_scenario::take_shared<AdminConfig>(&scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            clock::set_for_testing(&mut clock, 40000); // +20s

            game::submit_quiz_results(&mut profile, &config, &clock, 12, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, profile);
            test_scenario::return_shared(config);
            clock::destroy_for_testing(clock);
        };

        // 5. Evolve
        test_scenario::next_tx(&mut scenario, USER);
        {
            let profile = test_scenario::take_from_sender<PlayerGameProfile>(&scenario);
            let mut dragon = test_scenario::take_from_sender<DragonNFT>(&scenario);
            let config = test_scenario::take_shared<AdminConfig>(&scenario);
            
            game::evolve_dragon(&profile, &mut dragon, &config, test_scenario::ctx(&mut scenario));

            test_scenario::return_to_sender(&scenario, profile);
            test_scenario::return_to_sender(&scenario, dragon);
            test_scenario::return_shared(config);
        };
        test_scenario::end(scenario);
    }
}
