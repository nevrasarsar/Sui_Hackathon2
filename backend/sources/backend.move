module quiz_game::game {
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::option::{Self, Option};
    use std::vector;
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // --- CONSTANTS ---
    const E_DAILY_LIMIT_EXCEEDED: u64 = 666;

    // --- 1.1 STRUCTS ---

    /// The evolving Dragon NFT
    struct DragonNFT has key, store {
        id: UID,
        name: String,
        description: String,
        stage_level: u8, // 0-4
        rarity: u64,     // Kept for compatibility/calculation
        score: u64,      // XP of the Dragon
        url: String,     // Dynamic visual based on stage
        owner: address   // Original owner (informational)
    }

    /// User's Persistent Game Profile
    struct PlayerGameProfile has key {
        id: UID,
        user_address: address,
        total_correct_answers: u64,
        current_dragon_id: Option<ID>,
        // Daily limit tracking
        daily_limit_used: u8,
        last_reset: u64,
        // Anti-Cheat
        last_submission_timestamp: u64
    }

    /// Admin Capability to manage game config
    struct AdminCap has key, store {
        id: UID
    }

    /// Registry to store Dragon stage URLs (Shared Object)
    struct DragonStageRegistry has key, store {
        id: UID,
        stage_urls: vector<String>
    }

    /// Global Configuration (Shared Object) -- Keeping purely for legacy if needed, or remove? 
    /// Leaving generic holder.
    struct AdminConfig has key {
        id: UID
    }

    /// Treasury for SUI rewards
    struct GameBank has key {
        id: UID,
        balance: Balance<SUI>
    }

    /// Simple Leaderboard
    struct Leaderboard has key {
        id: UID,
        top_players: vector<address>, // simplified for compilation
        max_size: u64
    }

    // --- INIT ---

    fun init(ctx: &mut TxContext) {
        // 1. Create and Share the Registry
        let registry = DragonStageRegistry {
            id: object::new(ctx),
            stage_urls: vector::empty()
        };
        transfer::share_object(registry);

        // 2. Create and Transfer AdminCap
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // 3. Create and Share GameBank
        let bank = GameBank {
            id: object::new(ctx),
            balance: balance::zero()
        };
        transfer::share_object(bank);

        // 4. Create and Share Leaderboard
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_players: vector::empty(),
            max_size: 10
        };
        transfer::share_object(leaderboard);
    }

    // --- ADMIN FUNCTIONS ---

    /// Admin: Set Stage URLs (Phase 0 Setup)
    public entry fun set_stage_url(
        _: &AdminCap,
        registry: &mut DragonStageRegistry,
        new_urls: vector<String>
    ) {
        registry.stage_urls = new_urls;
    }

    /// Admin: Update a single stage URL (because sometimes we just want to fix one)
    public entry fun update_single_url(
        _: &AdminCap,
        registry: &mut DragonStageRegistry,
        index: u64,
        new_url: vector<u8>
    ) {
        let len = vector::length(&registry.stage_urls);
        if (index < len) {
            *vector::borrow_mut(&mut registry.stage_urls, index) = string::utf8(new_url);
        } else {
            // Extend vector if index is out of bounds (simple approach: fill gaps with empty strings)
            let mut i = len;
            while (i < index) {
                vector::push_back(&mut registry.stage_urls, string::utf8(b""));
                i = i + 1;
            };
            vector::push_back(&mut registry.stage_urls, string::utf8(new_url));
        };
    }

    // --- USER FUNCTIONS ---

    public entry fun initialize_player_profile(clock: &Clock, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let profile = PlayerGameProfile {
            id: object::new(ctx),
            user_address: sender,
            total_correct_answers: 0,
            current_dragon_id: option::none(),
            daily_limit_used: 0,
            last_reset: clock::timestamp_ms(clock),
            last_submission_timestamp: 0
        };
        // [SECURITY NOTE] Owned Object: Profile belongs to user.
        transfer::transfer(profile, sender);
    }

    // --- 1.2 LOGIC FUNCTIONS ---

    /// Mint a new Dragon (Egg Stage)
    public entry fun mint_dragon(
        registry: &DragonStageRegistry,
        name: vector<u8>,
        desc: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Stage 0 (Egg) URL
        let url = *vector::borrow(&registry.stage_urls, 0);

        let dragon = DragonNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(desc),
            stage_level: 0,
            rarity: 1, // Default rarity
            score: 0,
            url: url,
            owner: sender
        };

        // [SECURITY NOTE] Owned Object: Transferred to specific user.
        transfer::public_transfer(dragon, sender);
    }

    /// Submit quiz answer and evolve dragon
    public entry fun submit_answer(
        dragon: &mut DragonNFT,
        profile: &mut PlayerGameProfile,
        registry: &DragonStageRegistry,
        clock: &Clock,
        is_correct: bool
    ) {
        // Daily Limit Check
        check_daily_limit(profile, clock);
        profile.daily_limit_used = profile.daily_limit_used + 1;

        if (is_correct) {
            // Update Dragon XP
            dragon.score = dragon.score + 10; // 10 XP per correct answer
            
            // Update Profile Total
            profile.total_correct_answers = profile.total_correct_answers + 1;

            // Evolution Logic
            // Stage 0 -> 1: 50 XP
            // Stage 1 -> 2: 150 XP
            // Stage 2 -> 3: 300 XP
            // Stage 3 -> 4: 500 XP
            
            let old_stage = dragon.stage_level;
            let new_stage_val; // Use a temporary variable for assignment

            if (dragon.score >= 50 && dragon.score < 150) { new_stage_val = 1; }
            else if (dragon.score >= 150 && dragon.score < 300) { new_stage_val = 2; }
            else if (dragon.score >= 300 && dragon.score < 500) { new_stage_val = 3; }
            else if (dragon.score >= 500) { new_stage_val = 4; }
            else { new_stage_val = old_stage; }; // If no condition met, keep old stage

            let new_stage = new_stage_val;

            // If Evolved, Update Metadata
            if (new_stage > old_stage) {
                dragon.stage_level = new_stage;
                dragon.rarity = (new_stage as u64) + 1;
                
                // Fetch new URL from Registry
                if (vector::length(&registry.stage_urls) > (new_stage as u64)) {
                     dragon.url = *vector::borrow(&registry.stage_urls, (new_stage as u64));
                };
            };
        };
    }
    
    /// Submit quiz results (Bulk) and check for Hatching
    public entry fun submit_quiz_results(
        profile: &mut PlayerGameProfile,
        registry: &DragonStageRegistry,
        clock: &Clock,
        correct_count: u64,
        ctx: &mut TxContext
    ) {
        // 1. Anti-Cheat & Daily Limit
        let current_time = clock::timestamp_ms(clock);
        
        // Anti-Cheat: 10 seconds cooldown between submissions
        assert!(current_time >= profile.last_submission_timestamp + 10000, 555); // E_TOO_FAST
        profile.last_submission_timestamp = current_time;

        // (Optional: Check daily limit here too if we want to restrict bulk submissions per day)
        // check_daily_limit(profile, clock); 
        
        profile.total_correct_answers = profile.total_correct_answers + correct_count;

        // 2. Hatching Logic
        // If user has no dragon AND has enough correct answers (>= 3)
        if (option::is_none(&profile.current_dragon_id) && profile.total_correct_answers >= 3) {
            let dragon_id = mint_baby_dragon(registry, ctx);
            option::fill(&mut profile.current_dragon_id, dragon_id);
        };
    }

    /// Internal helper to mint a Baby Dragon
    fun mint_baby_dragon(registry: &DragonStageRegistry, ctx: &mut TxContext): ID {
        let sender = tx_context::sender(ctx);
        
        // Default to Index 0 (Baby/Egg)
        let url = *vector::borrow(&registry.stage_urls, 0);

        let id = object::new(ctx);
        let uid = object::uid_to_inner(&id);

        let dragon = DragonNFT {
            id,
            name: string::utf8(b"Baby Dragon"),
            description: string::utf8(b"A dragon hatched from your quiz knowledge!"),
            stage_level: 0,
            rarity: 1,
            score: 0,
            url,
            owner: sender
        };

        // Transfer to user
        transfer::public_transfer(dragon, sender);
        
        uid
    }

    // Helper to check limit on Profile
    fun check_daily_limit(profile: &mut PlayerGameProfile, clock: &Clock) {
        let current_time = clock::timestamp_ms(clock);
        if (current_time > profile.last_reset + 86400000) {
            profile.daily_limit_used = 0;
            profile.last_reset = current_time;
        };
        assert!(profile.daily_limit_used < 10, E_DAILY_LIMIT_EXCEEDED);
    }

    /// Evolve Dragon based on accumulated knowledge (Week 3 Engine)
    public entry fun evolve_dragon(
        profile: &PlayerGameProfile,
        dragon: &mut DragonNFT,
        registry: &DragonStageRegistry,
        _ctx: &mut TxContext // Context required for potential event emission or future expansion
    ) {
        // 1. Verify Ownership / Linkage
        assert!(option::contains(&profile.current_dragon_id, &object::id(dragon)), 999); // E_WRONG_DRAGON
        
        let total_score = profile.total_correct_answers;
        let current_stage = dragon.stage_level;
        
        // 2. Determine Target Stage based on Thresholds
        // 3 Correct = Baby (Stage 0) - Handled by Hatching
        // 6 Correct = Child (Stage 1)
        // 9 Correct = Teen (Stage 2)
        // 12 Correct = Adult (Stage 3)
        // 15 Correct = Legendary (Stage 4)

        let target_stage_val;

        if (total_score >= 15) { target_stage_val = 4; }
        else if (total_score >= 12) { target_stage_val = 3; }
        else if (total_score >= 9) { target_stage_val = 2; }
        else if (total_score >= 6) { target_stage_val = 1; }
        else { target_stage_val = current_stage; }; // If no condition met, keep current stage

        let target_stage = target_stage_val;

        // 3. Evolve if eligible
        if (target_stage > current_stage) {
            dragon.stage_level = target_stage;
            dragon.rarity = (target_stage as u64) + 1; // Rarity increases with stage
            
            // Update URL from Registry
            if (vector::length(&registry.stage_urls) > (target_stage as u64)) {
                 dragon.url = *vector::borrow(&registry.stage_urls, (target_stage as u64));
            };
            
            // Optional: Update Name/Description
            if (target_stage == 4) {
                 dragon.name = string::utf8(b"Legendary Dragon");
                 dragon.description = string::utf8(b"The ultimate master of Sui knowledge.");
            };
        };
    }

    // --- 1.3 MANAGEMENT FUNCTIONS ---

    /// Fund the Treasury (Admin Only - actually anyone can fund, but intended for Admin)
    public entry fun fund_treasury(bank: &mut GameBank, payment: Coin<SUI>) {
        coin::put(&mut bank.balance, payment);
    }

    /// Swap Legendary Dragon for SUI Reward (Week 4 Treasure)
    public entry fun swap_legendary_for_sui(bank: &mut GameBank, nft: DragonNFT, ctx: &mut TxContext) {
        let DragonNFT { id, name: _, description: _, stage_level, rarity: _, score: _, url: _, owner: _ } = nft;

        // 1. Verify Legendary Status (Stage 4)
        assert!(stage_level == 4, 888); // E_NOT_LEGENDARY

        // 2. Fixed Reward: 10 SUI
        let reward_amount = 10_000_000_000;

        // 3. Payout
        // Ensure bank has funds. If not, transaction fails (safe default).
        assert!(balance::value(&bank.balance) >= reward_amount, 777); // E_BANK_EMPTY
        
        let reward_coin = coin::take(&mut bank.balance, reward_amount, ctx);
        transfer::public_transfer(reward_coin, tx_context::sender(ctx));

        // 4. Burn
        object::delete(id);
    }
}