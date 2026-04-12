# Entangle Protocol Documentation

> **The first fully decentralised cross-chain message relay subnet on Bittensor. Five ecosystems. Agentic miners. TAO-incentivised intelligence.**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Why Entangle Exists](#2-why-entangle-exists)
3. [How It Works — System Overview](#3-how-it-works--system-overview)
4. [Architecture Deep Dive](#4-architecture-deep-dive)
5. [The Dual-Miner Model](#5-the-dual-miner-model)
6. [Validators](#6-validators)
7. [Scoring & Incentives](#7-scoring--incentives)
8. [Smart Contracts](#8-smart-contracts)
9. [dApp Integration Guide](#9-dapp-integration-guide)
10. [Running a Miner](#10-running-a-miner)
11. [Supported Chains & Ecosystem Adapters](#11-supported-chains--ecosystem-adapters)
12. [Fee Model & Gas Oracle](#12-fee-model--gas-oracle)
13. [Security Model](#13-security-model)
14. [Tokenomics & Economics](#14-tokenomics--economics)
15. [Governance](#15-governance)
16. [Risk Factors & Mitigations](#16-risk-factors--mitigations)
17. [Roadmap](#17-roadmap)
18. [Glossary](#18-glossary)

---

## 1. Introduction

Entangle Protocol is a **Bittensor subnet** that provides fully decentralised cross-chain message relaying across 13 blockchain networks and 5 distinct ecosystems. It connects EVM chains (Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche), Solana, SUI, Stellar, and Cosmos chains (Cosmos Hub, Osmosis, Neutron) using a competitive, incentivised relay network.

**No bridges. No custodians. No single point of failure.** Just a decentralised network of incentivised agentic relayers — scored and rewarded by Bittensor's Yuma Consensus.

### What makes Entangle different

| Dimension | Entangle | Wormhole | LayerZero | Axelar |
|---|---|---|---|---|
| **Miner entry** | Permissionless (TAO burn) | Permissioned Guardians | Permissioned DVNs | Permissioned validators |
| **Incentive model** | Competitive TAO emissions + fees | Protocol revenue share | DVN operator fees | Validator staking rewards |
| **Source-chain watching** | Specialised scanner miners | Each Guardian node | Each DVN | Each validator |
| **Decentralisation** | Open subnet, any operator | 19 Guardian multisig | DVN operator set | Proof-of-stake set |
| **Latency target** | <60s fast chains / <90s EVM L1 | 1–5 min | <1 min | 2–5 min |
| **Fee model** | Oracle-driven per-destination | Fixed/variable | Pay-as-you-go | Fixed |
| **Chain extensibility** | ChainAdapter interface | Per-chain deployments | DVN per chain | Per-chain voting |

### Protocol at a Glance

```
Protocol Version:   2.0
Chains Supported:   13
Ecosystems:         5 (EVM, Solana, SUI, Cosmos, Stellar)
Miner Types:        2 (Scanner & Relay)
Emission Split:     30% Discovery / 70% Relay
Governance:         3-of-5 Multisig with 48h timelocks
Latency Target:     <60s (fast chains), <90s (EVM L1)
```

---

## 2. Why Entangle Exists

### The Web3 Stack is Fragmented

Billions of dollars have been stolen from bridges. Trillions in value sits siloed across chains that cannot communicate. Cross-chain infrastructure is the most critical unsolved problem in Web3.

**Isolated Networks**  
Ethereum cannot talk to Solana. Solana cannot talk to Cosmos. Each blockchain is an island — its assets and logic locked behind an invisible wall, unable to compose with the broader ecosystem.

> $2.8B lost to bridge exploits in 2022–2024

**Fragile Bridges**  
Trusted bridges require handing custody to a multisig. Lock-and-mint mechanisms create honeypots. Validator collusion is a single exploit away from draining everything. The model is architecturally broken.

> 67% of crypto hacks target bridge contracts

**Centralised Relayers**  
Most cross-chain messaging protocols rely on permissioned relayer sets that require KYC, stake in specific tokens, or DAO membership. This is not decentralisation — it is a distributed trust assumption with extra steps.

> Top 3 relayer protocols control 78% of cross-chain volume

### The Entangle Solution

TCP/IP didn't ask permission to connect computers. It established a protocol — and let the network do the rest. Entangle does the same for blockchains.

Instead of a bridge, Entangle is a network. Instead of a trusted relayer, Entangle uses decentralised miners — scored by Bittensor's Yuma Consensus — competing in an open market to route messages faster, cheaper, and more reliably than any centralised alternative could.

Cross-chain communication becomes a decentralised digital commodity. **Anyone can mine it. Anyone can validate it. Anyone can build on it.**

---

## 3. How It Works — System Overview

Every cross-chain message passes through the same three-phase lifecycle:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ENTANGLE MESSAGE LIFECYCLE                       │
├──────────────┬────────────────────────────┬────────────────────────┤
│   PHASE 1    │         PHASE 2            │        PHASE 3         │
│    SCAN      │          AUCTION           │         RELAY          │
│              │                            │                        │
│  Scanner     │  Validators verify events, │  Winning relay miner   │
│  miners      │  collect threshold         │  executes delivery on  │
│  watch source│  attestations, and run     │  destination chain     │
│  chains for  │  sealed-bid relay auction: │  using validator-issued │
│  events      │  selecting winner by       │  threshold signature   │
│              │  latency, gas, history     │  bundle                │
│              │                            │                        │
│  ← 30% TAO → │       Orchestration        │   ← 70% TAO ←         │
└──────────────┴────────────────────────────┴────────────────────────┘
```

### The Message Lifecycle — Step by Step

**Step 1 — dApp Sends**  
A dApp calls `sendMessage()` on the Entangle contract. Fee is split into a platform fee and relay reserve.

**Step 2 — Scanners Detect**  
Scanner miners race to detect the `MessageDispatched` event via private RPC. The first verified response earns the highest score.

**Step 3 — Validators Sign**  
Validators spot-verify events, serialise canonical message fields, and produce a threshold signature bundle using chain-specific attestation keys.

**Step 4 — Relay Delivers**  
The winning relay miner from the sealed-bid auction calls `receiveEntangleMessage()` on the destination dApp.

### Network Topology

```
                   BITTENSOR METAGRAPH
                   (subnet registration,
                    UID assignments,
                    weight aggregation)
                          │
           ┌──────────────┼──────────────┐
           │              │              │
      ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
      │  VAL-1  │    │  VAL-2  │    │  VAL-N  │
      └────┬────┘    └────┬────┘    └────┬────┘
           │              │              │
           └──────┬────────┘──────┬──────┘
                  │               │
        ┌─────────┴──┐     ┌──────┴──────────┐
        │ SCANNER     │     │  RELAY          │
        │ MINERS      │     │  MINERS         │
        │ (M1 pool)   │     │  (M2 pool)      │
        └──────┬──────┘     └──────┬──────────┘
               │                   │
   ┌───────────┴──────┐    ┌───────┴──────────────┐
   │  SOURCE CHAINS   │    │  DESTINATION CHAINS  │
   │ • ETH mainnet    │    │ • Arbitrum           │
   │ • Solana         │    │ • Optimism           │
   │ • Cosmos Hub     │    │ • SUI                │
   │ • SUI            │    │ • Stellar            │
   │ • Stellar        │    │ • ETH mainnet        │
   └──────────────────┘    └──────────────────────┘
        (Entangle contracts deployed on all chains)
```

---

## 4. Architecture Deep Dive

### 4.1 Key Design Principles

**Permissionless Entry**  
Any operator can register by paying the dynamic TAO burn. No approval process, no guardian whitelist, no DVN gatekeeping. Competition is open.

**Objective Scoring**  
Every score dimension uses on-chain or cryptographically verifiable data. Validator receipt timestamps prevent self-reporting manipulation entirely.

**Sealed-Bid Auctions**  
Relay miners compete on latency and gas estimates before execution. Bid accuracy is scored. The market finds optimal pricing automatically.

**ChainAdapter Interface**  
New chains can be added without deploying new contracts. Same-ecosystem chains are zero-config additions. New ecosystems need one Python class implementing five methods.

**One Contract Per Chain**  
A single Entangle contract handles both source (`sendMessage`) and destination (`verifyMessage`) roles on every supported blockchain.

**3-of-5 Multisig Governance**  
All protocol governance through a 3-of-5 Gnosis Safe. 48h timelocks on validator set and threshold changes. All transactions publicly verifiable on-chain.

### 4.2 Protocol Data Structures

#### MessageEnvelope

The chain-agnostic, canonical description of a pending cross-chain message:

| Field | Description |
|---|---|
| `message_id` | sha256 of (src_chain + protocol_addr + seq + src_tx). Globally unique. |
| `src_chain` | Source chain name (e.g. `"ethereum"`, `"solana"`) |
| `src_ecosystem` | Ecosystem family: `evm`, `solana`, `sui`, `stellar`, `cosmos` |
| `src_protocol` | Entangle ProtocolHub contract address on the source chain |
| `src_tx` | Transaction hash / signature of the `MessageDispatched` event |
| `src_seq` | Monotonically increasing sequence number from the source hub |
| `src_height` | Block / slot / ledger number on the source chain |
| `src_timestamp` | Unix timestamp of source transaction confirmation |
| `dst_chain` | Target chain name |
| `dst_ecosystem` | Target ecosystem family |
| `dst_protocol` | Entangle ProtocolHub address on destination chain |
| `dst_recipient` | Application contract/account receiving the message |
| `payload_hex` | Hex-encoded raw message payload (max 8 KiB) |
| `requires_ack` | If true, source dApp expects an acknowledgement reply |

#### ProofBundle

Returned by the miner as evidence of delivery:

| Field | Description |
|---|---|
| `proof_type` | One of: `evm_tx_receipt`, `solana_signature`, `sui_digest`, `stellar_hash`, `cosmos_tx_hash` |
| `relay_tx` | Primary on-chain identifier of the relay transaction |
| `dst_height` | Block / slot / ledger number on the destination chain |
| `dst_timestamp` | Unix timestamp of the relay confirmation |
| `raw` | Ecosystem-specific data (EVM receipt/logs, Solana signature/slot, SUI digest/effects, etc.) |

#### RelayStatus Codes

| Code | Name | Meaning |
|---|---|---|
| 200 | `SUCCESS` | Relay confirmed on destination chain |
| 208 | `ALREADY_RELAYED` | Another miner relayed first. Partial score. |
| 202 | `PENDING` | Transaction submitted but not yet confirmed |
| 402 | `INSUFFICIENT_FUNDS` | Miner wallet has insufficient gas |
| 500 | `REVERT` | Destination contract reverted |
| 408 | `TIMEOUT` | Message not confirmed before deadline |
| 501 | `UNSUPPORTED_CHAIN` | Miner doesn't support this chain pair |
| 422 | `INVALID_PROOF` | Miner couldn't build a valid proof |
| 429 | `RATE_LIMITED` | Miner is at capacity — task shed |

### 4.3 Deterministic Task IDs

Task IDs are computed deterministically so all validators assign the same ID to the same message — critical for cross-validator score consistency:

```python
task_id = sha256(
    sha256(src_chain + ":" + protocol_addr + ":" + seq + ":" + src_tx)
    + ":" + validator_hotkey[:8]
)
```

### 4.4 Deployment Architecture

**Per Validator Node:**
```
┌────────────────────────────────────────────────────────────┐
│  validator-process (Python)                                │
│    ├─ BittensorClient (metagraph, axon, dendrite)          │
│    ├─ ChainAdapterRegistry (one adapter per chain)         │
│    ├─ SynapseHandlers (ChainScan, HealthCheck, Attest)     │
│    ├─ AuctionEngine (BidRequest, winner selection)         │
│    ├─ ExecutionMonitor (proof verification, scoring)       │
│    ├─ OracleSubmitter (gas price updates)                  │
│    └─ WeightCommitter (set_weights every epoch)            │
│                                                            │
│  HSM / Secrets Manager (external)                         │
│    └─ Attestation keys per dst_chain ecosystem            │
└────────────────────────────────────────────────────────────┘
```

**Per Scanner Miner Node:**
```
┌────────────────────────────────────────────────────────────┐
│  scanner-process (Python)                                  │
│    ├─ BittensorClient (axon — serves ChainScanSynapse)     │
│    ├─ ChainAdapterRegistry (source chain adapters only)    │
│    └─ SynapseHandlers (ChainScan, HealthCheck)             │
│                                                            │
│  RPC Infrastructure:                                       │
│    ├─ Private dedicated RPC (primary) — per chain         │
│    └─ Public backup RPC — per chain                       │
└────────────────────────────────────────────────────────────┘
```

**Per Relay Miner Node:**
```
┌────────────────────────────────────────────────────────────┐
│  relay-process (Python)                                    │
│    ├─ BittensorClient (axon — serves BidRequest, Execute)  │
│    ├─ ChainAdapterRegistry (destination chain adapters)    │
│    ├─ WalletManager (keys + balances per dst_chain)        │
│    └─ SynapseHandlers (BidRequest, Execute, Standby)       │
│                                                            │
│  Hot Wallets:                                              │
│    └─ Funded address per supported destination chain      │
└────────────────────────────────────────────────────────────┘
```

---

## 5. The Dual-Miner Model

Entangle uses Bittensor's **dual incentive mechanism** to run two separate scoring systems on a single subnet. Each mechanism has its own task type, miner population, and emission allocation.

| Mechanism | Name | Emission Share | Miner Role | Task |
|---|---|---|---|---|
| Mechanism 1 | Discovery | 30% | Scanner Miners | Detect `MessageDispatched` events on source chains |
| Mechanism 2 | Relay | 70% | Relay Miners | Execute message delivery to destination chains |

### 5.1 Scanner Miners

Scanner miners are the event detection layer. They monitor source chain contracts continuously for `MessageDispatched` events and report them to validators.

**How scoring works:**

When a validator broadcasts a `ChainScanSynapse`, scanner miners race to respond with the event data. The validator records its own receipt timestamp — miners never self-report timing. Rank-based scoring is applied:

| Detection Rank | Score |
|---|---|
| 1st (fastest) | 1.00 |
| 2nd | 0.70 |
| 3rd | 0.50 |
| 4th | 0.20 |
| Did not respond / wrong data | 0.00 |

**What scanner miners need:**
- Private, low-latency RPC endpoints for each monitored chain (public RPCs create systematic disadvantage)
- Bittensor hotkey + coldkey
- No funded wallets required (read-only operation)
- Low-bandwidth, read-heavy server infrastructure

**Economics:** Scanner miners receive 30% of subnet TAO emissions. Low capital requirements make this role accessible to a broad population — intentionally, since the Discovery mechanism benefits from many independent, geographically diverse monitors.

### 5.2 Relay Miners

Relay miners are the execution layer. They receive verified relay tasks from validators, submit execution transactions on destination chains, and return cryptographic proof of delivery.

**Auction mechanism:**

When validators have a verified `MessageDispatched` event, they open a sealed-bid auction:

```
Validator broadcasts BidRequest
        │
        ├── Relay miners submit bids: { estimated_latency_ms, gas_estimate_usd }
        │
        ├── Validator selects winner (lowest combined score of latency + gas × weight)
        │
        ├── Winner executes relay transaction
        │
        └── Validator scores execution and updates Bittensor weights
```

**Relay execution flow:**

1. Dedup check — if `(src_chain, seq_no, dst_chain)` already in-flight, return cached result
2. Pre-flight checks — verify chain support, relay key, and deadline
3. Mark in-flight — insert entry before execution
4. Build `PendingMessage` from relay task
5. Execute `adapter.relay_message()` under concurrency semaphore (default: 12 parallel)
6. Map result → `RelayStatus` code
7. Build `ProofBundle` with relay tx and verification data
8. Mark done and cache for future dedup

**Economics:** Relay miners receive 70% of subnet TAO emissions. Higher risk (funded wallets, capital exposure to gas volatility) is compensated by higher rewards. A relay miner consistently winning 10% of relay rounds on a medium-volume network earns significantly more than a top scanner miner.

### 5.3 Combined Scanner + Relay Miners

A single Bittensor UID can register both roles by declaring `roles: ["scanner", "relay"]` in `HealthCheckSynapse`. This miner participates in both mechanisms and is scored independently on each.

The key advantage: a combined miner that detects an event via its scanner function can pre-position its relay function before the `BidRequest` arrives — a meaningful latency advantage in competitive rounds.

> **Note:** Running both roles on a single node adds operational complexity. Scanner and relay functions have different resource profiles and failure modes. Experienced operators may prefer separate UIDs.

---

## 6. Validators

Validators are the orchestration layer. They do not run chain-scanning infrastructure themselves — they outsource scanning to scanner miners and verify results.

### Validator Responsibilities

- Broadcast `ChainScanSynapse` to scanner miners and record receipt timestamps
- Spot-verify events (~20% sampled; all events via multi-reporter consensus)
- Maintain a consensus gas oracle that drives the per-destination fee model
- Sign verified messages with chain-specific attestation keys (cryptographic bridge between Bittensor's sr25519 keys and destination chain signature schemes)
- Run sealed-bid auctions and select relay miner winners
- Independently verify relay execution on destination chains
- Call `set_weights()` on the Bittensor metagraph every epoch (default: every 100 blocks)

### Validator Loop

```
Step 1: Query       ChainScanSynapse → scanner miners
                    Record all receipt timestamps server-side
Step 2: Score       Rank miners by validator receipt time
                    discovery_score ∈ {0.00, 0.20, 0.50, 0.70, 1.00}
Step 3: Auction     BidRequest → relay miners
                    winner selection → execute signal
Step 4: Verify      RelayTask → relay miners
                    Independent on-chain verification of delivery
Step 5: EMA         Exponential Moving Average blends task scores into weights
Step 6: Weights     set_weights() normalises non-zero EMA scores
                    → submits to Bittensor chain
Background:         HealthCheckSynapse every 600s to up to 20 miners
```

### Attestation Model

Validators maintain separate attestation keys for each destination chain ecosystem:

```bash
ENTANGLE_ATTEST_KEY_EVM=0xPRIVKEY       # secp256k1 — all EVM chains
ENTANGLE_ATTEST_KEY_SOLANA=BASE58        # ed25519 — Solana
ENTANGLE_ATTEST_KEY_SUI=BASE58           # ed25519 — SUI
ENTANGLE_ATTEST_KEY_COSMOS=0x...         # secp256k1 — Cosmos chains
ENTANGLE_ATTEST_KEY_STELLAR=BASE58       # ed25519 — Stellar
```

Keys are loaded into memory at startup and never written to disk. Use an HSM or encrypted secrets manager (AWS Secrets Manager, HashiCorp Vault).

---

## 7. Scoring & Incentives

### 7.1 Discovery Score (Scanner Miners)

A scanner miner's weight is derived from per-event discovery scores averaged across the scoring window (one Bittensor epoch; default 100 blocks):

```
period_discovery_score(miner) = mean(discovery_score_i for all events i)

where events i = all unique (chain_id, seq_no) events in the scoring window
and discovery_score_i ∈ {0.00, 0.20, 0.50, 0.70, 1.00}
```

Miners monitoring more chains observe more events and can score on more of them — incentivising broad chain coverage.

### 7.2 Execution Score (Relay Miners)

Relay miners are scored across five independent dimensions:

| Dimension | Weight | What It Measures | Score Logic |
|---|---|---|---|
| **SUCCESS** | 50% | Did the relay land on the destination? | 1.0 = confirmed, 0.4 = already relayed, 0.15 = pending, 0.0 = failed |
| **SPEED** | 25% | How fast relative to peers? | relay_block_timestamp − source_block_timestamp (from on-chain headers) |
| **CORRECTNESS** | 15% | Was the proof valid and verifiable? | Multi-RPC quorum query; asymmetric fallback if validator infra fails |
| **FEE_EFFICIENCY** | 5% | Was gas cost reasonable vs the oracle? | Derived from on-chain receipt, NOT miner-reported |
| **RELIABILITY** | 5% | Historical success rate (50-task rolling window) | 0.50 neutral for new miners → graduated baseline |

The final blended score per relay round:

```
winner_score     = 0.80 × execution_score + 0.20 × bid_quality_score
non_winner_score = bid_quality_score (for miners that bid but didn't win)
no_bid           = 0.00
```

### 7.3 New Relay Miner Reliability Baseline

New miners don't have 50 tasks of history. A graduated baseline prevents impossible first-mover economics:

| Tasks Completed | Reliability Score Applied |
|---|---|
| 0–5 | 0.50 (neutral baseline; no penalty, no bonus) |
| 6–15 | Rolling average of completed tasks only |
| 16–49 | Rolling average, floor of 0.20 |
| 50+ | Full 50-task rolling average, no floor |

### 7.4 Emission Split

The 30/70 Discovery/Relay emission split is a Bittensor subnet hyperparameter controlled by the subnet owner coldkey (multisig). For every 10 TAO emitted to the subnet: 3 TAO → scanner miner rewards, 7 TAO → relay miner rewards (before Bittensor's standard validator commission).

### 7.5 Anti-Gaming Protections

**Self-reporting manipulation prevented:** Scanner miner speed rankings use the validator's own receipt timestamp. Miners never submit a timestamp field. The only way to rank higher is to genuinely respond faster.

**Proof fabrication prevented (three-layer correctness check):**
- Layer 1 — Attestation consistency (local): Did the miner include the validator's attestation, unmodified?
- Layer 2 — Destination chain event query (multi-RPC quorum): Did the relay actually land on-chain?
- Layer 3 — Asymmetric fallback: If quorum fails, liveness probe determines whether it's validator infra failure (→ 0.5 neutral) or miner fabrication (→ 0.0)

**ALREADY_RELAYED farming prevented:** Partial credit for ALREADY_RELAYED (208) requires the miner to provide raw signed transaction bytes as proof of genuine attempt. Without this: 0.0.

**Fee self-reporting eliminated:** `fee_paid_usd` is derived entirely from on-chain receipts via Chainlink/Pyth price oracles. Miner-reported values are ignored for scoring.

---

## 8. Smart Contracts

### 8.1 One Contract Per Chain

Entangle deploys **one contract per supported blockchain**. A single deployment serves both directions:

- **Source-side**: When a dApp calls `sendMessage()`, the contract collects fees and emits `MessageDispatched`
- **Destination-side**: When a relay miner delivers a message, it calls the dApp's `receiveEntangleMessage()`, which calls back into the Entangle contract's `verifyMessage()` to validate the threshold signature bundle

### 8.2 Core Contract Functions

| Function | Visibility | Caller | Description |
|---|---|---|---|
| `sendMessage(dst_chain, dst_addr, payload)` | external payable | Any dApp | Accepts fee, validates invariant, emits `MessageDispatched`, increments `seq_no` |
| `verifyMessage(msg_hash, sig_bundle)` | external view | Destination dApp | Verifies threshold signature bundle against registered validator set. Returns `bool`. |
| `updateGasOracle(dst_chain, gas_estimate)` | external | Registered validator | Submits gas cost estimate; contract computes stake-weighted median |
| `setBaseFee(dst_chain, amount)` | external | Protocol multisig | Sets platform base fee for a destination chain |
| `setGasBuffer(dst_chain, multiplier)` | external | Protocol multisig | Sets gas reserve safety multiplier |
| `setFeeSplit(dst_chain, platform_bps)` | external | Protocol multisig | Sets platform_fee / relay_reserve ratio |
| `updateValidatorSet(validators[], weights[])` | external | Protocol multisig (timelocked) | Replaces registered validator public keys and stake weights |
| `setSignatureThreshold(threshold)` | external | Protocol multisig (timelocked) | Sets minimum validator signatures for `verifyMessage()` to pass |
| `freezeOracle(dst_chain, value)` | external | Protocol multisig | Emergency freeze of gas oracle at a manual value |
| `withdrawRelayReserve(dst_chain, amount)` | external | Protocol multisig | Withdraws accumulated relay reserve |
| `getTotalFee(dst_chain)` | view | Anyone | Returns current total fee — helper for dApp UIs |
| `getSeqNo(src_addr, dst_chain)` | view | Anyone | Returns next sequence number for a sender/destination pair |

### 8.3 Contract Events

```solidity
MessageDispatched(
    uint64 indexed seq_no,
    address indexed src_addr,
    string dst_chain,
    string dst_addr,
    bytes payload
)

MessageExecuted(
    uint64 indexed seq_no,
    address indexed relayer,   // winning miner's relay address
    address recipient,
    bytes32 payload_hash
)

GasOracleUpdated(string dst_chain, uint256 new_reserve, uint256 validator_count)
ValidatorSetUpdated(address[] validators, uint256[] weights, uint256 threshold)
FeeSplitUpdated(string dst_chain, uint256 platform_bps)
RelayReserveWithdrawn(string dst_chain, uint256 amount, address recipient)
```

### 8.4 Fee Invariant

The contract enforces this invariant at every `sendMessage()` call:

```solidity
require(msg.value >= platform_base_fee[dst_chain] + gas_reserve[dst_chain])
// gas_reserve[dst_chain] = oracle_median × gas_buffer_multiplier
```

If the gas oracle hasn't updated recently and gas prices spike above the reserve, `sendMessage()` reverts with `InsufficientReserve` until the oracle catches up. dApps should call `getTotalFee(dst_chain)` before presenting a relay UI to users.

### 8.5 Cross-Chain Replay Protection — 4-Tuple Dedup Key

To prevent a message intended for one destination from being executed on another, all dedup keys use a 4-tuple:

| Layer | Key |
|---|---|
| EVM contract | `keccak256(abi.encode(src_chain, DST_CHAIN_NAME, seq_no))` |
| Solana PDA | `[b"executed", src_chain_hash[:8], dst_chain_hash[:8], seq_le_bytes]` |
| SUI Move | `ExecutionKey { src_chain: String, dst_chain: String, seq_no: u64 }` |
| Cosmos | `EXECUTED map key: (src_chain, dst_chain, seq_no)` |
| Stellar | `DataKey::Executed wraps (src_chain_hash, dst_chain_hash, seq_no)` |

---

## 9. dApp Integration Guide

### 9.1 How Delivery Works

When a relay miner wins an auction for a cross-chain message, it calls `receiveEntangleMessage()` on the **destination dApp contract** — not the Entangle contract. The dApp owns this function and implements its own application logic inside it.

```
Relay miner
  → dApp.receiveEntangleMessage(payload, seq_no, src_chain, src_addr, sig_bundle)

Inside dApp.receiveEntangleMessage():
  1. Check dedup:  require(!executed[seq_no], 'ALREADY_EXECUTED')
  2. Build hash:   msg_hash = hash(src_chain, dst_chain, seq_no, src_addr, dst_addr, payload)
  3. Validate:     require(entangle.verifyMessage(msg_hash, sig_bundle))
  4. Mark done:    executed[seq_no] = true
  5. App logic:    _handleMessage(payload)   // your custom logic here
```

### 9.2 EVM Integration (Solidity)

**Step 1: Import the Entangle interface**

```solidity
// SPDX-License-Identifier: MIT
interface IEntangle {
    function verifyMessage(bytes32 msgHash, bytes calldata sigBundle)
        external view returns (bool);
}
```

**Step 2: Implement your dApp contract**

```solidity
contract MyDApp {
    IEntangle public immutable entangle;
    mapping(uint64 => bool) public executed;

    constructor(address _entangle) {
        entangle = IEntangle(_entangle);
    }

    // Source: send a message to another chain
    function sendCrossChainMessage(
        string calldata dst_chain,
        address dst_addr,
        bytes calldata payload
    ) external payable {
        uint256 fee = IEntangle(address(entangle)).getTotalFee(dst_chain);
        require(msg.value >= fee, "INSUFFICIENT_FEE");
        IEntangle(address(entangle)).sendMessage{value: fee}(
            dst_chain, dst_addr, payload
        );
    }

    // Destination: receive a message from another chain
    function receiveEntangleMessage(
        bytes calldata payload,
        uint64 seq_no,
        string calldata src_chain,
        bytes calldata src_addr,
        bytes calldata sig_bundle
    ) external {
        require(!executed[seq_no], 'ALREADY_EXECUTED');

        bytes32 msg_hash = keccak256(abi.encode(
            src_chain, block.chainid, seq_no, src_addr,
            address(this), payload
        ));

        require(entangle.verifyMessage(msg_hash, sig_bundle), 'BAD_SIGS');
        executed[seq_no] = true;
        _handleMessage(payload); // implement your logic here
    }

    function _handleMessage(bytes calldata payload) internal {
        // your application logic
    }
}
```

**Step 3: Query the current fee before sending**

Always call `getTotalFee(dst_chain)` before presenting a send UI — fees change with the gas oracle:

```javascript
const fee = await entangle.getTotalFee("arbitrum");
await myDApp.sendCrossChainMessage("arbitrum", recipientAddr, payload, { value: fee });
```

### 9.3 Integration Summary by Ecosystem

| Ecosystem | Relay miner calls | dApp calls for validation | Sig scheme |
|---|---|---|---|
| EVM (Ethereum, Arbitrum…) | `dApp.receiveEntangleMessage()` | `entangle.verifyMessage()` | secp256k1 ECDSA |
| Solana | `receiveEntangleMessage` instruction | Entangle program `verify_message` CPI | ed25519 |
| SUI | dApp Move function `receiveEntangleMessage` | Entangle Move `verify_message` call | ed25519 |
| Cosmos / IBC | dApp CosmWasm `receiveEntangleMessage` | Entangle CosmWasm `verify_message` | secp256k1 ECDSA |
| Stellar | dApp contract `receiveEntangleMessage` | Entangle contract `verify_message` | ed25519 |

### 9.4 Adding New Chains

**Same-ecosystem chain (e.g., a new EVM L2):** Deploy the Entangle contract and add to the Chain Configuration Registry. No code changes required.

**New ecosystem chain:** Requires a new `ChainAdapter` implementation, an SDK PR, and a governance vote to add it to the chain registry.

---

## 10. Running a Miner

### 10.1 Prerequisites

- Python 3.10+
- Bittensor wallet (hotkey + coldkey)
- TAO for registration burn
- For relay miners: funded wallets on all supported destination chains

### 10.2 Scanner Miner Setup

**Step 1: Configure environment variables**

```bash
# Chains to monitor (comma-separated chain IDs from the on-chain registry)
ENTANGLE_SCANNER_CHAINS=ethereum_mainnet,solana_mainnet,cosmos_mainnet

# RPC endpoint per monitored chain (private/dedicated strongly recommended)
ENTANGLE_SCANNER_RPC_ETHEREUM_MAINNET=https://your-private-eth-rpc.com
ENTANGLE_SCANNER_RPC_SOLANA_MAINNET=https://your-private-sol-rpc.com
ENTANGLE_SCANNER_RPC_COSMOS_MAINNET=https://your-private-cosmos-rpc.com

# Bittensor credentials
ENTANGLE_BITTENSOR_HOTKEY=your_hotkey
ENTANGLE_BITTENSOR_COLDKEY=your_coldkey

# Role declaration
ENTANGLE_SCANNER_ROLE_DECLARATION=scanner
```

**Step 2: Register on the subnet**

```bash
btcli subnet register --netuid <entangle_subnet_id>
```

**Step 3: Start the scanner**

```bash
python neurons/miner.py --relay.chains ethereum_mainnet,solana_mainnet
```

> **RPC Quality is Critical:** A scanner miner competing on validator receipt time with a shared public RPC will systematically lose to operators with private, low-latency infrastructure.

### 10.3 Relay Miner Setup

**Step 1: Configure environment variables**

For each chain you support:

```bash
# RPC endpoint
ENTANGLE_PROTOCOL_RPC_ETHEREUM=https://eth.llamarpc.com

# Private key (relay execution wallet — must be funded)
ENTANGLE_PROTOCOL_KEY_ETHEREUM=0x<private_key_hex>

# Entangle ProtocolHub contract address
ENTANGLE_PROTOCOL_CONTRACT_ETHEREUM=0x<ProtocolHub_deployed_address>
```

Repeat for each chain: `SOLANA`, `SUI`, `STELLAR`, `COSMOSHUB`, `ARBITRUM`, `BASE`, `POLYGON`, `OPTIMISM`, etc.

**Step 2: Configuration flags**

```bash
--relay.max_fee_usd 10           # Maximum USD gas per relay (default $10)
--relay.max_concurrent 12        # Parallel relay executions (default 12)
--relay.deadline_buffer_secs 20  # Reject tasks with <20s to deadline
--relay.chains ethereum,arbitrum # Explicit list of supported chains
```

**Step 3: Start the relay miner**

```bash
python neurons/miner.py --relay.chains ethereum,arbitrum,solana
```

### 10.4 Miner Type Declaration (HealthCheckSynapse)

Validators poll miners every ~10 minutes via `HealthCheckSynapse`. Declare your role in the response:

```json
// Scanner-only
{ "version":"1.2.0", "roles":["scanner"], "supported_chains":["ethereum_mainnet","solana_mainnet"] }

// Relay-only
{ "version":"1.2.0", "roles":["relay"], "dst_chains":["ethereum_mainnet","arbitrum"] }

// Combined
{ "version":"1.2.0", "roles":["scanner","relay"], "supported_chains":["ethereum_mainnet"], "dst_chains":["arbitrum"] }
```

Miners that don't respond within 60 seconds are excluded from all scoring rounds until the next successful check.

### 10.5 Private MEV Protection for Relay Miners

When submitting EVM relay transactions, use private mempool routing to prevent MEV front-running:

| Chain | Recommended Private RPC |
|---|---|
| Ethereum | Flashbots Protect (`https://rpc.flashbots.net`) or MEV Blocker (`https://rpc.mevblocker.io`) |
| Polygon | Polygon Blocknative private mempool |
| Arbitrum / Optimism / Base | Standard submission (sequencer-ordered; private RPC recommended as best practice) |

---

## 11. Supported Chains & Ecosystem Adapters

### 11.1 Launch Chain Support

| Chain | Ecosystem | Finality Model | Confirmation Blocks | Signature Scheme |
|---|---|---|---|---|
| Ethereum mainnet | EVM | Probabilistic (PoS) | 2 (safe head); 32 for epoch finality | secp256k1 |
| Arbitrum One | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Base | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Optimism | EVM L2 | Sequencer + L1 finality | 1 (optimistic) | secp256k1 |
| Polygon | EVM PoA | Checkpoint | 64 | secp256k1 |
| BNB Chain | EVM PoA | Checkpoint | 64 | secp256k1 |
| Avalanche | EVM (Snowman) | Instant after acceptance | 1 | secp256k1 |
| Solana mainnet | Solana | Tower BFT | 32 slots (~13s) | ed25519 |
| SUI mainnet | SUI | Narwhal/Bullshark | 1 checkpoint | ed25519 |
| Cosmos Hub | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Osmosis | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Neutron | Cosmos/IBC | Tendermint BFT | 1 block (instant) | secp256k1 |
| Stellar mainnet | Stellar | SCP (federated) | 1 ledger close | ed25519 |

**Phase 2 additions:** SUI (additional), Cosmos Hub, Osmosis, Neutron  
**Phase 3 additions:** Stellar, additional Cosmos chains

### 11.2 Finality Confirmation Depths (constants.py)

```python
FINALITY_BLOCKS: dict[str, int] = {
    'ethereum':   12,   # ~2.5 min; PoS single-slot final at 2 epochs
    'arbitrum':    1,   'optimism':  1,   'base': 1,
    'polygon':    64,   'bsc':      64,
    'avalanche':   1,   # Snowman: instant after acceptance
    'solana':      1,   # Confirmed commitment level
    'sui':         1,   'stellar': 1,
    'cosmoshub':   1,   'osmosis': 1,   'neutron': 1,
}
```

### 11.3 ChainAdapter Interface

All adapters implement the same abstract interface — the only component containing ecosystem-specific code:

```python
class ChainAdapter(ABC):
    @abstractmethod
    def get_pending_messages(self, from_height, to_height) -> list[PendingMessage]: ...

    @abstractmethod
    def is_message_delivered(self, seq_no, src_chain) -> bool: ...

    @abstractmethod
    def relay_message(self, msg, private_key, max_fee_usd) -> RelayResult: ...

    @abstractmethod
    def verify_relay(self, relay_tx, expected_seq) -> tuple[bool, raw_proof_dict]: ...

    @abstractmethod
    def get_rpc_latency_ms(self) -> float: ...

    @abstractmethod
    def get_wallet_info(self, private_key) -> WalletInfo: ...

    @abstractmethod
    def get_current_height(self) -> int: ...
```

**Ecosystem-specific implementations:**

- **EVMAdapter** — handles all 7 EVM chains via web3.py. PoA chains (Polygon, BNB) get `ExtraDataToPOAMiddleware` injected automatically.
- **SolanaAdapter** — uses solana-py and the Anchor IDL. Parses base64-encoded Anchor events using discriminators.
- **SUIAdapter** — uses SUI JSON-RPC API via aiohttp. Object-centric execution via programmable transaction blocks.
- **StellarAdapter** — split architecture: base ledger via Horizon REST API, smart contracts via Soroban RPC.
- **CosmosAdapter** — uses Cosmos REST API (Stargate) and CosmWasm execution. Handles per-chain denom differences.

---

## 12. Fee Model & Gas Oracle

### 12.1 Fee Architecture

Every cross-chain message triggers a fee payment split at the source chain contract:

```
sendMessage(dst_chain, dst_addr, payload) payable:
  total_fee = platform_base_fee[dst_chain] + gas_reserve[dst_chain]
  require(msg.value >= total_fee)

  platform_fee     → protocol_treasury_address (e.g. 20% of total_fee)
  relay_reserve    → relay_reserve_pool[dst_chain]
  emit MessageDispatched(...)
```

### 12.2 Gas Oracle

The gas oracle dynamically adjusts `gas_reserve[dst_chain]` to match actual destination chain gas costs. Validators maintain the oracle via consensus:

```
Oracle update cycle (per validator, every ~10 blocks / ~2 minutes):
  1. Validator samples current gas price on dst_chain via RPC
  2. Estimates gas cost of a typical receiveEntangleMessage() call
  3. Submits updateGasOracle(dst_chain, gas_cost_estimate) on-chain
  4. Contract accepts if caller is a registered validator
  5. Contract computes stake-weighted median of recent submissions
  6. Updates gas_reserve[dst_chain] = median × gas_buffer_multiplier

  gas_buffer_multiplier default: 1.25 (25% safety margin above median)
```

**Oracle Collusion Circuit Breaker:** The contract rejects any gas oracle update that deviates more than 30% from the previous epoch's accepted value, unless countersigned by the protocol multisig.

### 12.3 Fee-to-Quality Flywheel

```
High relay volume
  → More platform fees and relay reserves collected
  → Larger treasury for protocol sustainability
  → Relay miners can support more chains and higher volumes
  → Better miners attracted → lower latency, lower fees
  → More dApps integrate → higher relay volume
  → (repeat)
```

---

## 13. Security Model

### 13.1 Threshold Attestation

All message delivery is gated by a **threshold signature bundle** — validators must collectively attest to a message before it can be executed on the destination chain. Compromising the attestation requires controlling >60% of registered validator stake — the same threshold needed to corrupt Bittensor consensus itself.

**EVM (Solidity):**
```solidity
function executeMessage(
    string calldata src_chain,
    uint64 seq_no,
    address dst_recipient,
    bytes calldata payload,
    AttestationBundle calldata bundle
) external nonReentrant {
    // 1. Verify dedup (4-tuple)
    bytes32 key = _execKey(src_chain, DST_CHAIN_NAME, seq_no);
    require(!_executed[key], 'AlreadyExecuted');

    // 2. Verify attestation bundle — BEFORE any state change
    bytes32 payload_hash = keccak256(payload);
    uint128 attestedStake = 0;
    for (uint i = 0; i < bundle.validator_uids.length; i++) {
        ValidatorRecord memory v = validators[bundle.validator_uids[i]];
        require(v.active, 'InactiveValidator');
        require(bundle.payload_hashes[i] == payload_hash, 'PayloadMismatch');
        require(bundle.dst_recipients[i] == dst_recipient, 'RecipientMismatch');
        // Verify signature from validator's registered chain key
        bytes32 digest = _attestDigest(src_chain, seq_no, DST_CHAIN_NAME, payload_hash, dst_recipient);
        require(_recoverSigner(digest, bundle.signatures[i]) == v.signingKey, 'InvalidSig');
        attestedStake += v.stakeWeight;
    }
    uint128 required = totalRegisteredStake * THRESHOLD_PERCENT / 100;
    require(attestedStake >= required, 'BelowStakeThreshold');

    // 3. Mark executed and run payload — AFTER threshold verified
    _executed[key] = true;
    emit MessageExecuted(seq_no, msg.sender, dst_recipient);
    (bool ok,) = dst_recipient.call{gas:100_000}(payload);
}
```

### 13.2 Security Properties

**Payload integrity:** The contract hashes the submitted payload and requires validators' signed commitments to match. The miner cannot substitute payload without all attesting validators having signed a different hash.

**Recipient integrity:** `dst_recipient` is explicitly covered in the attestation digest. Substituting it invalidates every validator's signature simultaneously.

**Pre-execution enforcement:** The stake threshold check is the first gating operation in `executeMessage()`. Nothing executes until it passes.

**No new trust set:** Bittensor validators are already economically incentivised to attest honestly via TAO staking. A colluding validator loses stake through slashing and reputation.

### 13.3 Source Chain Reorg Protection

Validators do not advance their block cursor to the chain tip immediately. They respect per-chain finality depths before attesting:

```python
current_height = await adapter.get_current_height()
safe_height    = current_height - FINALITY_BLOCKS[chain]
# Validator does NOT attest to events above safe_height
msgs = await adapter.get_pending_messages(from_height=self.cursors[chain], to_height=safe_height)
self.cursors[chain] = safe_height
```

### 13.4 Cross-Validator Collusion Detection

Validators gossip score vectors to each other via `ScoreGossip` synapse after each epoch. Because most scores are deterministic from on-chain data, a validator whose submitted weights deviate significantly from the stake-weighted median is producing provably wrong scores:

```python
def _detect_collusion(self, gossip_pool, uid):
    scores = {g.validator_uid: g.score_vec for g in gossip_pool if g.miner_uid == uid}
    median_vec = stake_weighted_median(scores, self.metagraph.S)
    for vuid, vec in scores.items():
        deviation = mean_absolute_error(vec, median_vec)
        if deviation > 0.15:   # >15% mean deviation from median
            self._flag_validator(vuid, deviation)
            # Flagged validators' weight contributions are discounted
```

---

## 14. Tokenomics & Economics

### 14.1 The Alpha Token

Alpha is Entangle's subnet token on Bittensor. It is a **work token** (utility token) — not a profit-sharing security. Alpha holders benefit from two demand drivers:

1. **TAO emissions:** Bittensor emits TAO to the subnet, which converts to Alpha via the subnet's internal AMM
2. **Fee buyback:** Protocol fee revenue is used to buy Alpha on the open market (programmatic demand backed by real revenue)

### 14.2 Revenue Buyback Mechanism

```
Step 1  dApp relays a message — $0.08 fee paid in ETH
Step 2  Relay confirmed → 70% to winning relay miner ($0.056)
Step 3  30% → Treasury ($0.024 per message)
Step 4  20% of treasury → TWAP buyback of Alpha via DEX (every 7 days)
Step 5  Bought Alpha is burned or locked in governance staking pool
```

**Monthly Buyback Formula:**
```
MonthlyBuybackUSD = DailyMessages × ProtocolFee × 0.20 × 30

Y1 baseline (50K msgs/day, $0.08/msg):
  MonthlyBuybackUSD = 50,000 × $0.08 × 0.20 × 30 = $24,000/month

Y3 scale (3M msgs/day):
  MonthlyBuybackUSD = 3,000,000 × $0.05 × 0.20 × 30 = $900,000/month
```

### 14.3 Supply Dynamics Over Time

| Period | Daily Msgs | Monthly Emission (α) | Monthly Buyback (α) | Burn (20% rate) | Net Supply Change |
|---|---|---|---|---|---|
| Month 1 | 5,000 | 937,500 | 10,667 | 187,500 | +739,333 (High inflation) |
| Month 6 | 30,000 | 937,500 | 64,000 | 187,500 | +686,000 (Moderate) |
| Month 12 | 50,000 | 937,500 | 106,667 | 187,500 | +643,333 (Controlled) |
| Month 24 | 500,000 | 937,500 | 1,066,667 | 187,500 | -316,667 (**Net deflationary**) |
| Month 36 | 3,000,000 | 937,500 | 6,000,000 | 187,500 | -5,250,000 (Strongly deflationary) |

> **Deflationary Inflection Point:** At ~500,000 messages/day, buyback alone exceeds new Alpha emission. Combined with burn rate, the protocol becomes structurally deflationary.

### 14.4 Emission Burn Rate

The protocol can vote to burn a percentage of miner emission before it reaches miners — a deflationary lever:

| Burn Rate | Net Emission/Day | Burned α/Day | When to Use |
|---|---|---|---|
| 0% (Off) | 31,250 α | 0 | Bootstrap phase |
| 10% | 28,125 α | 3,125 | Early operation |
| **20% (Recommended)** | **25,000 α** | **6,250** | **Steady state** |
| 35% | 20,313 α | 10,937 | Bear market defence |
| 50% (Max) | 15,625 α | 15,625 | Emergency defence |

### 14.5 Miner Economics at Scale

**Relay Miner earnings (40 relay miners, 70% emission pool):**

| Daily Msgs | Monthly Fee Revenue | Relay Pool (70%) | Per Miner/Month | Infrastructure | Monthly Profit |
|---|---|---|---|---|---|
| 5,000 (Bear) | $400 | $280 | $7 / $210 | $400 | **-$190 (loss)** |
| 15,000 (Low) | $1,200 | $840 | $630 | $400 | **+$230** |
| 50,000 (Y1 baseline) | $4,000 | $2,800 | $2,100 | $400 | **+$1,700** |
| 500,000 (Y2 growth) | $30,000 | $21,000 | $5,250 | $400 | **+$4,850** |
| 3,000,000 (Y3 scale) | $150,000 | $105,000 | $26,250 | $400 | **+$25,850** |

*Avg fee = $0.08/msg. Top relay miners win more bids (competitive bidding) and earn 2–5× average.*

### 14.6 Protocol Self-Sustainability

```
Break-even analysis (TAO-independent, fee revenue only):

  Scanner operational cost:  60 miners × $500/month = $30,000/month
  Validator operational cost: 12 validators × $1,200/month = $14,400/month
  Total op cost:              $44,400/month

  Treasury receives 30% of fees:
  Break-even fee revenue:    $44,400 / 0.30 = $148,000/month
  Break-even messages:       ~62,000 msgs/day

  With TAO emission (normal case): ~15,000 msgs/day
```

The Y1 baseline target of 50K/day means the protocol approaches fee-only sustainability by Month 3–4.

### 14.7 The Dual Flywheel

```
TAO Demand → more TAO staked in subnet → Alpha price rises
Fee Buyback → market buy pressure → Alpha price rises

NetAlphaDemand = TAO_stake_demand + Fee_buyback_demand
NetAlphaSupply = Emission × (1-B) - Buyback_burns

AlphaEquilibriumP = NetAlphaDemand / NetAlphaSupply
```

Most Bittensor subnets rely entirely on TAO emission for miner incentives. If TAO price drops, the entire subnet degrades. Entangle breaks this dependency with a second demand source — protocol fee buybacks in stable USD-denominated value. Relay miners are paid in ETH/BNB/MATIC directly, and Alpha buyback continues in real dollar terms even in a TAO bear market.

---

## 15. Governance

### 15.1 Protocol Multisig

All Entangle governance is conducted through a **3-of-5 Gnosis Safe** (EVM) or equivalent Substrate multisig. All signer addresses are published on-chain. All transactions are publicly verifiable.

| Parameter | Value |
|---|---|
| Signing threshold | 3-of-5 |
| Signer addition/removal | Requires 3-of-5 vote; replacement in same transaction |
| Transaction log | All executions publicly visible on-chain |
| Key storage | Hardware wallets; no hot signer keys |

**Per-ecosystem equivalents:**
- **Solana:** Upgrade authority held by a Squads multisig (3-of-5)
- **SUI:** Package upgrade cap owned by a 3-of-5 multisig object
- **Cosmos:** Contract admin is a CosmWasm multisig (3-of-5 threshold)
- **Stellar:** Contract admin is a Stellar multisig (3-of-5 threshold)

Signer sets are kept in sync across all chains. Any signer rotation must be applied to all chain multisigs within 24 hours.

### 15.2 Operations and Timelocks

| Operation | Timelock | Trigger |
|---|---|---|
| Update Chain Configuration Registry | None | New chain, contract rotation, deprecation |
| `setBaseFee()`, `setGasBuffer()`, `setFeeSplit()` | None | Operational fee adjustments |
| `freezeOracle()` | None | Emergency |
| `withdrawRelayReserve()` | None | Operational |
| Change emission split (30/70) | **48 hours** | Governance proposal |
| `updateValidatorSet()` | **48 hours** | Validator set rotation |
| `setSignatureThreshold()` | **48 hours** | Security parameter change |
| Emergency validator key rotation | None (emergency) | Key compromise detected |
| Freeze subnet registrations | None | Emergency only |

### 15.3 Major Protocol Upgrades

New ecosystem support and architectural changes follow a structured process:

1. Public RFC posted to the project GitHub repository
2. Minimum 7-day community comment period
3. Multisig review and response to substantive comments
4. 48-hour timelock on execution (where applicable)
5. Public announcement of execution transaction hash

### 15.4 Bootstrapping Governance

**Phase 1 (Synthetic events, weeks 1–4 post-launch):**  
A treasury-controlled test dApp emits synthetic `MessageDispatched` events on a randomised schedule (10–50 events/day/chain). Scanner miners that correctly report receive a flat 0.50 participation score — no speed-race dynamic.

**Phase 2 (Live scoring):**  
Triggered automatically when real `MessageDispatched` events reach ≥20 per day per chain. Full rank-based scoring (1.00 / 0.70 / 0.50 / 0.20) resumes.

**Emergency Fallback Scanner:**  
If no scanner miner responds to `ChainScanSynapse` for 3 consecutive cycles (~90 seconds), validators activate a thin RPC poller built into the validator binary. Events are flagged as validator-originated — no scanner miner receives a score. This exists solely to prevent relay pipeline stalling.

---

## 16. Risk Factors & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| All scanner miners go offline simultaneously | Critical — relay pipeline stalls | Emergency validator fallback scanner activates after ~90s. Economic incentives (zero score = zero emission) strongly disfavour downtime. |
| Scanner miners gaming the speed ranking | Medium — unfair emission distribution | Validator uses its own receipt timestamp — miners never submit timing. Fabricated event data scores 0.00. |
| Validator oracle collusion (majority stake suppresses gas reserve) | High — relay miners underfunded | Circuit breaker rejects oracle updates deviating >30% from prior epoch. Multisig can freeze oracle. All submissions publicly auditable. |
| Gas price spike on EVM destination chains | Medium — relay miners temporarily underfunded | 1.25× gas buffer. Oracle updates every ~2 minutes. Multisig can manually set gas reserve via `freezeOracle()`. |
| Scanner miner fabricated event reports | Medium — false events enter relay pipeline | Validator spot-verifies ~20% sampled. Fabricated reports score 0.00. Three flags trigger 24h suspension. |
| Attestation key compromise | High — attacker can sign arbitrary messages | Keys in HSM/encrypted secrets manager. Single compromised key cannot meet threshold alone. Emergency `updateValidatorSet()` call. |
| Smart contract vulnerability | High — loss of relay reserve or platform fees | Formal audit before mainnet. Threshold signature limits blast radius. Bug bounty ($500K cap). Circuit breaker: auto-pause above threshold loss. |
| TAO price dependency | High — scanner miner income collapses in bear market | Emergency burn rate (up to 50%). Insurance Fund subsidises scanner ops during downturns. Relay miners paid in ETH/BNB/MATIC directly. |
| Relay miner cartel | Medium — price-gouging | Maximum bid cap. Fallback relay pool if no valid bid within 15 blocks. Slashing for detected bid collusion. |
| Bittensor protocol changes | Low — architecture dependency | Protocol versioning; fallback single-mechanism design available. Architecture follows official Bittensor multi-mechanism specification. |

---

## 17. Roadmap

### Q1 2025 (Months 1–3) — Phase 0: Foundation
- Register Entangle subnet on Bittensor testnet
- Deploy 12 initial scanner miners (team-operated) and 5 relay miners
- Finalise smart contracts on ETH, Polygon, BNB
- Complete Audit #1
- Whitelist 3 alpha-partner dApps
- Target: 1,000 msgs/day test volume; seed DEX liquidity with 500K Alpha

### Q2 2025 (Months 4–6) — Phase 1: Mainnet Launch
- Go live on Bittensor mainnet
- Open miner registration; target 40 relay miners, 60 scanner miners
- Launch on 6 chains; first 10 dApp integrations
- Target: 10,000–30,000 msgs/day
- Activate k=2.5× fee structure; begin Alpha buybacks

### Q3–Q4 2025 (Months 7–12) — Phase 2: Scale & Revenue
- Expand to 12 chains; 50+ dApp integrations
- Launch governance (Alpha voting on k, burn rate)
- Target: 50,000 msgs/day; monthly fee revenue $100K+
- Introduce SLA tiers (Standard/Fast/Express)
- Open Relay Miner SDK v2 with auto-bid optimisation

### Q1–Q2 2026 (Months 13–18) — Phase 3: Ecosystem Dominance
- Target: 500K msgs/day; 28 chains
- Enterprise integrations (B2B SDK for exchanges, wallets)
- Monthly revenue $900K; Alpha buyback $180K/month
- Launch Relay Miner Insurance Pool (staked Alpha, earns % of slashing rewards)
- Introduce message routing optimisation (cheapest path algorithm)

### 2027 (Months 24+) — Phase 4: Decentralised Mesh
- Target: 3M+ msgs/day; 60+ chains
- Fully decentralised governance; protocol-owned liquidity for Alpha
- Integrate additional non-EVM chains with dedicated scanner miner types
- Explore zkProof-based scanner verification for trustless scanning
- Monthly revenues $4.5M+

---

## 18. Glossary

| Term | Definition |
|---|---|
| **Alpha** | Entangle's subnet token on Bittensor. A work/utility token. |
| **Bittensor** | Decentralised AI network providing the incentive and consensus layer for Entangle |
| **ChainAdapter** | A Python class implementing chain-specific logic for one blockchain ecosystem |
| **ChainScanSynapse** | The synapse type sent by validators to scanner miners to request event detection |
| **Discovery Mechanism** | Mechanism 1 — 30% emission, runs scanner miner scoring |
| **HealthCheckSynapse** | Fast liveness probe sent by validators every ~10 minutes to all miners |
| **Metagraph** | Bittensor's on-chain registry of subnet participants and their weights |
| **MessageDispatched** | The on-chain event emitted by the Entangle contract when a dApp sends a message |
| **MessageEnvelope** | Chain-agnostic canonical data structure describing a pending cross-chain message |
| **ProofBundle** | Cryptographic evidence of delivery returned by a relay miner |
| **Relay Mechanism** | Mechanism 2 — 70% emission, runs relay miner scoring |
| **RelayTask** | The primary synapse type carrying message context from validator to miner |
| **Scanner Miner** | Miner role that monitors source chains for MessageDispatched events (Mechanism 1) |
| **Relay Miner** | Miner role that executes message delivery to destination chains (Mechanism 2) |
| **Sealed-Bid Auction** | The validator-run process for selecting which relay miner executes each message |
| **TAO** | Bittensor's native token; emitted to subnet participants proportional to performance |
| **Threshold Attestation** | Cryptographic mechanism requiring >60% of registered validator stake to attest before message execution |
| **Yuma Consensus** | Bittensor's consensus mechanism aggregating validator weights to produce TAO emission distribution |

---

*Entangle Protocol v2.0 — Protocol Documentation*  
*Cross-Chain Messaging Infrastructure on Bittensor*

> This documentation covers the public technical and philosophical content of Entangle Protocol. For miner setup support or dApp integration assistance, visit the official Discord or GitHub repository.
