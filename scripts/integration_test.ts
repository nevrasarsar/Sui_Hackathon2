import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { fromB64 } from '@mysten/sui/utils';
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// CONFIGURATION
const NETWORK = 'testnet';
const packagePath = process.cwd();
const MOVER_BYTECODE_PATH = path.resolve(packagePath, 'backend/build/SuiQuizProject/bytecode_modules');
const MNEMONIC = process.env.MNEMONIC || "insert your mnemonic here";

const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

const getKeypair = () => {
    if (MNEMONIC.includes("insert")) {
        throw new Error("Please set MNEMONIC in .env file");
    }
    return Ed25519Keypair.deriveKeypair(MNEMONIC);
};

const main = async () => {
    const keypair = getKeypair();
    const address = keypair.toSuiAddress();
    console.log(`Running with address: ${address}`);

    // 1. PUBLISH
    console.log("--- Step 1: Publishing ---");
    if (!fs.existsSync(MOVER_BYTECODE_PATH)) {
        console.error(`Build output not found at ${MOVER_BYTECODE_PATH}`);
        return;
    }
    const modules = fs.readdirSync(MOVER_BYTECODE_PATH)
        .filter(f => f.endsWith('.mv'))
        .map(f => fs.readFileSync(path.join(MOVER_BYTECODE_PATH, f), 'base64'));

    const tx = new Transaction();
    const [upgradeCap] = tx.publish({
        modules,
        dependencies: ["0x1", "0x2"],
    });
    tx.transferObjects([upgradeCap], address);

    const publishRes = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true }
    });

    if (publishRes.effects?.status.status !== 'success') {
        console.error("Publish failed", publishRes.effects?.status);
        return;
    }

    const packageId = publishRes.objectChanges?.find(o => o.type === 'published')?.['packageId'];
    if (!packageId) {
        console.error("Could not find packageId");
        return;
    }
    console.log(`PACKAGE_ID: ${packageId}`);

    // Parse Objects
    let adminCapId = "";
    let adminConfigId = "";
    let gameBankId = "";
    let leaderboardId = "";

    publishRes.objectChanges?.forEach(obj => {
        if (obj.type === 'created') {
            if (obj.objectType.includes('::AdminCap')) adminCapId = obj.objectId;
            if (obj.objectType.includes('::AdminConfig')) adminConfigId = obj.objectId;
            if (obj.objectType.includes('::GameBank')) gameBankId = obj.objectId;
            if (obj.objectType.includes('::Leaderboard')) leaderboardId = obj.objectId;
        }
    });

    console.log(`AdminCap: ${adminCapId}`);
    console.log(`AdminConfig: ${adminConfigId}`);
    console.log(`GameBank: ${gameBankId}`);
    console.log(`Leaderboard: ${leaderboardId}`);

    if (!adminCapId || !adminConfigId || !gameBankId) {
        console.error("Missing critical objects.");
        return;
    }

    // 2. CONFIGURE URLS
    console.log("\n--- Step 2: Setting URLs & Funding Bank ---");
    const configTx = new Transaction();
    configTx.moveCall({
        target: `${packageId}::game::update_dragon_urls`,
        arguments: [
            configTx.object(adminCapId),
            configTx.object(adminConfigId),
            configTx.pure.vector('string', [
                "/dragons/stage_1.jpg", // Egg/Baby
                "/dragons/stage_2.jpg", // Child
                "/dragons/stage_3.jpg", // Teen
                "/dragons/stage_4.jpg", // Adult
                "/dragons/stage_5.jpg"  // Legendary
            ])
        ]
    });

    // Split coin for funding (10 SUI = 10 * 10^9) -> 10_000_000_000. Let's do 20 SUI just to be safe.
    // 20_000_000_000
    const [fundCoin] = configTx.splitCoins(configTx.gas, [configTx.pure.u64(20_000_000_000)]);
    configTx.moveCall({
        target: `${packageId}::game::fund_treasury`,
        arguments: [
            configTx.object(gameBankId),
            fundCoin
        ]
    });

    await client.signAndExecuteTransaction({ signer: keypair, transaction: configTx });
    console.log("Configured URLs and Funded Bank.");

    // 3. INIT PROFILE
    console.log("\n--- Step 3: Init Profile ---");
    const profileTx = new Transaction();
    profileTx.moveCall({
        target: `${packageId}::game::initialize_player_profile`,
        arguments: [profileTx.object('0x6')]
    });
    const profileRes = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: profileTx,
        options: { showObjectChanges: true }
    });

    // Find Profile ID
    // Note: profileRes.objectChanges might contain many things. We look for the one created with type PlayerGameProfile.
    let profileId = "";
    profileRes.objectChanges?.forEach(obj => {
        if (obj.type === 'created' && obj.objectType.includes('PlayerGameProfile')) {
            profileId = obj.objectId;
        }
    });

    if (!profileId) {
        console.error("Profile creation failed");
        return;
    }
    console.log(`Profile ID: ${profileId}`);

    // 4. PLAY & HATCH (Score 3)
    console.log("\n--- Step 4: Submit Quiz (3 Correct) -> Hatch ---");
    const hatchTx = new Transaction();
    hatchTx.moveCall({
        target: `${packageId}::game::submit_quiz_results`,
        arguments: [
            hatchTx.object(profileId),
            hatchTx.object(adminConfigId),
            hatchTx.object('0x6'),
            hatchTx.pure.u64(3) // Correct Count
        ]
    });
    const hatchRes = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: hatchTx,
        options: { showObjectChanges: true }
    });

    let dragonId = "";
    hatchRes.objectChanges?.forEach(obj => {
        if (obj.type === 'created' && obj.objectType.includes('DragonNFT')) {
            dragonId = obj.objectId;
        }
    });

    if (!dragonId) {
        console.log("No dragon hatched (expected if already exists, but this is fresh profile). Error?");
        // Keep going maybe?
    } else {
        console.log(`Hatched Dragon ID: ${dragonId}`);
    }

    if (!dragonId) return;

    // 5. EVOLVE (Score +12 = 15)
    console.log("\n--- Step 5: Score 12 more -> Evolve to Legendary ---");
    console.log("Waiting 11s for Anti-Cheat cooldown...");
    await new Promise(r => setTimeout(r, 11000));

    const scoreTx = new Transaction();
    scoreTx.moveCall({
        target: `${packageId}::game::submit_quiz_results`,
        arguments: [
            scoreTx.object(profileId),
            scoreTx.object(adminConfigId),
            scoreTx.object('0x6'),
            scoreTx.pure.u64(12)
        ]
    });
    await client.signAndExecuteTransaction({ signer: keypair, transaction: scoreTx });
    console.log("Points submitted.");

    // EVOLVE
    const evolveTx = new Transaction();
    evolveTx.moveCall({
        target: `${packageId}::game::evolve_dragon`,
        arguments: [
            evolveTx.object(profileId),
            evolveTx.object(dragonId),
            evolveTx.object(adminConfigId)
        ]
    });
    await client.signAndExecuteTransaction({ signer: keypair, transaction: evolveTx });
    console.log("Evolved to Legendary.");

    // 6. SWAP
    console.log("\n--- Step 6: Swap for SUI ---");
    const swapTx = new Transaction();
    swapTx.moveCall({
        target: `${packageId}::game::swap_legendary_for_sui`,
        arguments: [
            swapTx.object(gameBankId),
            swapTx.object(dragonId)
        ]
    });
    const swapRes = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: swapTx,
        options: { showEffects: true }
    });
    console.log("Swap Status:", swapRes.effects?.status.status);
};

main().catch(console.error);
