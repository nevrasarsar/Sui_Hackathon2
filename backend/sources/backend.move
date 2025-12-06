module quiz_game::game {
    use std::string::{Self, String};
    use sui::header; // Often used for time, but here checking imports requested
    use sui::url::{Self, Url};
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    // --- 1.1 STRUCTS ---

    /// Dragon NFT representing the character
    struct Dragon has key, store {
        id: UID,
        name: String,
        description: String,
        level: u64,
        url: Url, 
    }

    /// UserStats to track counts for all users via Tables
    struct UserStats has key, store {
        id: UID,
        correct_counts: Table<address, u64>,
        nft_counts: Table<address, u64>,
    }

    // --- INIT (Placeholder for next steps) ---
    fun init(ctx: &mut TxContext) {
        let stats = UserStats {
            id: object::new(ctx),
            correct_counts: table::new(ctx),
            nft_counts: table::new(ctx),
        };
        transfer::share_object(stats);
    }

    // --- 1.2 FUNCTIONS ---

    /// Create a new Dragon NFT and transfer it to the sender
    public entry fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = Dragon {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            level: 1, // Start at level 1
            url: url::new_unsafe(string::utf8(url))
        };

        transfer::public_transfer(nft, sender);
    }

    /// Increase the level of a Dragon NFT
    public entry fun level_up(nft: &mut Dragon) {
        nft.level = nft.level + 1;
    /// Burn the Dragon NFT (e.g. for swapping to SUI off-chain)
    public entry fun burn_dragon(nft: Dragon) {
        let Dragon { id, name: _, description: _, level: _, url: _ } = nft;
        object::delete(id);
    }

    /// Update the user's correct answer count in the stats table
    public fun update_stats(stats: &mut UserStats, user: address, count_to_add: u64) {
        if (table::contains(&stats.correct_counts, user)) {
            let current_val = table::borrow_mut(&mut stats.correct_counts, user);
            *current_val = *current_val + count_to_add;
        } else {
            table::add(&mut stats.correct_counts, user, count_to_add);
        };
    }
}