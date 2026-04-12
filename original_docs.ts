export interface DocPage {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function codeBlock(language: string, code: string) {
  return `<pre data-language="${language}"><code>${escapeHtml(code)}</code></pre>`;
}

const developerSnippet = `import "IEntangle.sol";

string memory dstChain = "arbitrum";
bytes memory dstAddr = abi.encode(user);

bytes memory payload = abi.encode(
  "SWAP",
  tokenAddress,
  amount
);

uint256 fees = entangle.getFee(
  dstChain,
  payload.length
);

entangle.sendMessage{value: fees}(
  dstChain,
  dstAddr,
  payload
);`;

const senderSnippet = `function sendCrossChain(uint256 amount) external payable {
  bytes memory payload = abi.encode(amount);
  uint256 fee = entangle.getRequiredFee(dstChainId, payload.length);

  // 1. Dispatch Message
  entangle.sendMessage{value: fee}(dstChainId, dstAddr, payload);
}`;

const receiverSnippet = `function receiveEntangleMessage(
  bytes memory payload,
  bytes memory sigs,
  ...
) external payable {
  // 2. Verify Origin
  require(msg.sender == address(entangle), "Only Entangle");

  // 3. Execute Logic
  uint256 amount = abi.decode(payload, (uint256));
  _mint(amount);
}`;

export const docsStructure: DocSection[] = [
  {
    title: "1. Introduction",
    pages: [
      {
        slug: "overview",
        title: "Overview",
        description: "Entangle's black-and-white docs landing page.",
        content: `
          <span class="eyebrow">Entangle Protocol</span>
          <h1>AI-powered cross-chain messaging for teams that need one protocol across every chain.</h1>
          <p>Entangle positions itself as a relay network for cross-chain delivery. The source site frames the product around a simple thesis: <strong>one protocol, any chain</strong>, without centralized chokepoints.</p>
          <div class="hero-grid">
            <div class="hero-card">
              <span class="metric-value">$3.7T</span>
              <span class="metric-label">Blockchains stay isolated</span>
              <span class="metric-note">Liquidity, users, and state remain trapped inside separate ecosystems.</span>
            </div>
            <div class="hero-card">
              <span class="metric-value">$2.7B</span>
              <span class="metric-label">Lost to bridge exploits</span>
              <span class="metric-note">The original source emphasizes the security cost of centralized bridge patterns.</span>
            </div>
            <div class="hero-card">
              <span class="metric-value">&lt;10 min</span>
              <span class="metric-label">Developer integration goal</span>
              <span class="metric-note">The interface is designed around a minimal send-and-deliver workflow.</span>
            </div>
          </div>
          <h2 id="what-entangle-is">What Entangle Is</h2>
          <p>Entangle is described as an AI-optimized relay layer for cross-chain messaging. Developers dispatch a message on a source chain, scanners detect the event, validators attest to it, relay miners compete to execute the delivery, and the result is scored and rewarded.</p>
          <h2 id="core-product-pillars">Core Product Pillars</h2>
          <div class="card-grid">
            <div class="info-card">
              <h3>Standardized interface</h3>
              <p>Write once and target EVM, Solana, Cosmos, Stellar, and other supported environments through one messaging model.</p>
            </div>
            <div class="info-card">
              <h3>Automated security</h3>
              <p>On-chain signature verification and validator thresholds reduce reliance on single operators or off-chain trust.</p>
            </div>
            <div class="info-card">
              <h3>Competitive execution</h3>
              <p>Delivery is not static. Relay miners compete on latency, gas efficiency, and successful execution.</p>
            </div>
          </div>
          <h2 id="docs-map">Docs Map</h2>
          <p>This documentation splits the original product site into docs-style sections for developers, validators, scanner operators, relay miners, and teams evaluating the protocol's delivery model.</p>
        `,
      },
      {
        slug: "problem-landscape",
        title: "Problem Landscape",
        description: "Why Entangle exists and the pain points it targets.",
        content: `
          <span class="eyebrow">Why This Exists</span>
          <h1>Cross-chain UX still breaks on fragmentation, security risk, and slow integrations.</h1>
          <p>The original Entangle site opens with two claims: chains do not communicate well, and bridge-driven connectivity has created a major security failure surface. This page turns that product framing into reference docs.</p>
          <h2 id="pain-points">Pain Points</h2>
          <ul>
            <li><strong>Chain isolation:</strong> applications must build separate integration paths for every destination chain.</li>
            <li><strong>Bridge risk:</strong> centralized or brittle bridge patterns have created billions in losses.</li>
            <li><strong>Operational drag:</strong> teams often need to manage custom relayers, fee logic, and trust assumptions themselves.</li>
          </ul>
          <h2 id="product-thesis">Product Thesis</h2>
          <p>Entangle presents a relay-based architecture where scanners, validators, and relay miners each perform a discrete job. Instead of asking a dApp team to run the whole stack manually, the protocol exposes a minimal messaging interface and a competitive execution layer.</p>
          <blockquote>
            One protocol. Any chain. No centralized choke points.
          </blockquote>
          <h2 id="target-outcome">Target Outcome</h2>
          <p>For developers, the ideal outcome is a single integration surface. For operators, the outcome is an incentive system where network participation is measurable and rewarded. For end users, the target is faster, verifiable message delivery across ecosystems.</p>
        `,
      },
      {
        slug: "protocol-flow",
        title: "Protocol Flow",
        description: "The eight-step flow from source dispatch to delivery.",
        content: `
          <span class="eyebrow">How It Flows</span>
          <h1>From source transaction to destination delivery in eight automated steps.</h1>
          <p>The Entangle landing page visualizes the protocol as a sequential bus topology. In docs form, the system flow is easier to review as an ordered checklist.</p>
          <h2 id="eight-steps">Eight Steps</h2>
          <ol>
            <li><strong>Send:</strong> the dApp calls <code>sendMessage()</code>.</li>
            <li><strong>Emit:</strong> a source-chain event is dispatched on-chain.</li>
            <li><strong>Scan:</strong> a scanner miner detects the event.</li>
            <li><strong>Check:</strong> validators verify the message and its origin.</li>
            <li><strong>Attest:</strong> validators produce threshold signatures.</li>
            <li><strong>Auction:</strong> relay miners bid in a sealed two-second window.</li>
            <li><strong>Deliver:</strong> the winning relay miner executes the destination transaction.</li>
            <li><strong>Score:</strong> proof of delivery is verified and recorded for rewards.</li>
          </ol>
          <h2 id="why-the-flow-matters">Why The Flow Matters</h2>
          <p>This split lets the protocol separate detection, validation, and execution into different roles. That is important because the product's security and incentive model assumes no single participant should control the full path end to end.</p>
        `,
      },
      {
        slug: "delivery-benchmarks",
        title: "Delivery Benchmarks",
        description: "Latency ranges highlighted on the original site.",
        content: `
          <span class="eyebrow">Benchmarks</span>
          <h1>Latency expectations vary by destination chain, but the product is optimized around fast L2 delivery.</h1>
          <p>The original site highlights rough benchmark windows to frame operator expectations and developer UX.</p>
          <table>
            <thead>
              <tr>
                <th>Latency</th>
                <th>Network class</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5-12s</td>
                <td>Solana and high-performance chains</td>
                <td>The source specifically calls out Solana and similar environments such as Sui and Stellar.</td>
              </tr>
              <tr>
                <td>8-25s</td>
                <td>EVM L2s</td>
                <td>Arbitrum and Base-style networks are presented as the practical fast-delivery target.</td>
              </tr>
              <tr>
                <td>60s+</td>
                <td>Ethereum L1</td>
                <td>Finality and base-layer confirmation slow the full delivery cycle.</td>
              </tr>
            </tbody>
          </table>
          <h2 id="benchmark-interpretation">Benchmark Interpretation</h2>
          <p>These numbers should be read as product-facing reference ranges rather than formal SLA guarantees. Final latency depends on chain-specific confirmation assumptions, auction dynamics, and destination gas conditions.</p>
        `,
      },
    ],
  },
  {
    title: "2. Developers",
    pages: [
      {
        slug: "developer-overview",
        title: "Developer Overview",
        description: "How the product is presented to builders.",
        content: `
          <span class="eyebrow">For Builders</span>
          <h1>One contract, any chain.</h1>
          <p>Entangle's developer section focuses on reducing integration overhead. The original messaging is consistent: standardized interface, automated security, and instant integration around a single send path.</p>
          <div class="card-grid">
            <div class="info-card">
              <h3>Standardized interface</h3>
              <p>Write once using a Solidity-style SDK and deploy the same messaging workflow to multiple ecosystems.</p>
            </div>
            <div class="info-card">
              <h3>Automated security</h3>
              <p>Signature verification and fee calculation are meant to happen through protocol logic rather than custom app-side relayer code.</p>
            </div>
            <div class="info-card">
              <h3>Instant integration</h3>
              <p>The source explicitly positions <code>sendMessage()</code> as the central primitive developers need to adopt.</p>
            </div>
          </div>
          <h2 id="example-snippet">Example Snippet</h2>
          <p>The original site shows a compact developer example centered on destination selection, payload packing, fee retrieval, and message dispatch.</p>
          ${codeBlock("solidity", developerSnippet)}
        `,
      },
      {
        slug: "chain-support",
        title: "Chain Support",
        description: "Networks highlighted in the original product page.",
        content: `
          <span class="eyebrow">Supported Environments</span>
          <h1>Entangle is framed as a single messaging layer across the biggest smart-contract ecosystems.</h1>
          <p>The source site groups support across EVM, Solana, Sui, Cosmos, and Stellar, with the interface presented as chain-agnostic from the dApp perspective.</p>
          <table>
            <thead>
              <tr>
                <th>Chain</th>
                <th>Class</th>
                <th>Docs takeaway</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Ethereum</td><td>EVM L1</td><td>Base-layer destination with slower finality.</td></tr>
              <tr><td>Arbitrum</td><td>EVM L2</td><td>Highlighted as a practical fast-delivery target.</td></tr>
              <tr><td>Optimism</td><td>EVM L2</td><td>Fits the same standardized contract workflow.</td></tr>
              <tr><td>Base</td><td>EVM L2</td><td>Included as part of the L2 rollout story.</td></tr>
              <tr><td>Solana</td><td>SVM</td><td>Called out in both support and reference benchmark sections.</td></tr>
              <tr><td>Sui</td><td>Move</td><td>Included as a non-EVM chain in the unified interface story.</td></tr>
              <tr><td>Cosmos</td><td>IBC ecosystem</td><td>Represents adapter-based expansion beyond EVM.</td></tr>
              <tr><td>Stellar</td><td>Soroban</td><td>Shown as a supported smart-contract environment.</td></tr>
            </tbody>
          </table>
          <p>The landing page also states that adding a new chain should require just one adapter class, which suggests expansion is intended to happen at the protocol adapter layer rather than the dApp layer.</p>
        `,
      },
      {
        slug: "simple-integration",
        title: "Simple Integration",
        description: "Source and destination contract flow.",
        content: `
          <span class="eyebrow">Integration Pattern</span>
          <h1>The docs model is intentionally simple: dispatch on the source chain, verify and execute on the destination chain.</h1>
          <p>The original page visualizes the source and destination contracts side by side. In docs form, that translates to two core surfaces developers need to understand.</p>
          <h2 id="source-contract">Source Contract</h2>
          <p>At dispatch time, the source contract encodes payload data, asks Entangle for the required fee, and emits the cross-chain message.</p>
          ${codeBlock("solidity", senderSnippet)}
          <h2 id="destination-contract">Destination Contract</h2>
          <p>On the destination chain, the receiving contract verifies that Entangle is the caller, decodes the payload, and applies application logic.</p>
          ${codeBlock("solidity", receiverSnippet)}
          <h2 id="implementation-note">Implementation Note</h2>
          <p>This structure keeps application logic compact: the dApp focuses on message shape and destination execution, while the network handles scanning, validation, and auctioned delivery.</p>
        `,
      },
    ],
  },
  {
    title: "3. Security Model",
    pages: [
      {
        slug: "threshold-signatures",
        title: "Threshold Signatures",
        description: "Why no single validator can authorize a delivery.",
        content: `
          <span class="eyebrow">Security Model</span>
          <h1>Threshold signatures prevent a single validator from authorizing cross-chain execution.</h1>
          <p>The original site centers its security story around one claim: <strong>no single validator</strong>. Delivery depends on validator consensus and verifiable signature bundles.</p>
          <h2 id="multi-chain-signatures">Multi-Chain Signatures</h2>
          <ul>
            <li><strong>EVM:</strong> secp256k1 and <code>ecrecover</code>-style verification.</li>
            <li><strong>Non-EVM:</strong> ed25519 for ecosystems such as Solana, Sui, and Cosmos.</li>
          </ul>
          <h2 id="on-chain-verification">On-Chain Verification</h2>
          <p>The destination-side security model expects contracts to enforce cryptographic proofs through a verification step similar to <code>verifyMessage(msg_hash, sig_bundle)</code>.</p>
          <h2 id="trust-minimized-architecture">Trust-Minimized Architecture</h2>
          <p>The operator set may be distributed across scanners, validators, and relays, but authorization still requires consensus. That means an individual participant can compete or attest, but cannot unilaterally finalize delivery.</p>
        `,
      },
    ],
  },
  {
    title: "4. Operators",
    pages: [
      {
        slug: "operator-overview",
        title: "Operator Overview",
        description: "Dual incentive structure for network participants.",
        content: `
          <span class="eyebrow">For Operators</span>
          <h1>Operators earn through native execution fees and subnet rewards.</h1>
          <p>The source page introduces a dual incentive mechanism: native-token fee revenue plus Bittensor subnet emissions. The operator story is built around continuous participation in cross-chain message handling.</p>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-value">70%</span>
              <span class="metric-label">Relay-focused subnet emissions</span>
              <span class="metric-note">Allocated toward miners that win auctions and execute successful deliveries.</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">30%</span>
              <span class="metric-label">Scanner-focused subnet emissions</span>
              <span class="metric-note">Allocated around discovery speed, filtering quality, and validator feed reliability.</span>
            </div>
          </div>
          <h2 id="operator-roles">Operator Roles</h2>
          <ul>
            <li><strong>Validators</strong> attest to message legitimacy and participate in threshold signatures.</li>
            <li><strong>Scanner miners</strong> watch source chains and surface candidate events quickly.</li>
            <li><strong>Relay miners</strong> compete to execute destination delivery.</li>
          </ul>
        `,
      },
      {
        slug: "scanner-miner",
        title: "Scanner Miner",
        description: "Scanner miner responsibilities and reward framing.",
        content: `
          <span class="eyebrow">Scanner Role</span>
          <h1>Scanner miners continuously monitor connected chains for dispatch events.</h1>
          <p>The product page assigns scanner miners roughly 30% of subnet emissions and describes them as the discovery layer for message activity.</p>
          <h2 id="scanner-responsibilities">Scanner Responsibilities</h2>
          <ul>
            <li><strong>Real-time polling:</strong> query RPC nodes block by block to detect <code>MessageDispatched</code> events.</li>
            <li><strong>Event filtering:</strong> validate payload shape and confirm the expected source contract emitted the event.</li>
            <li><strong>Validator feed:</strong> pass verified events to validators so the attestation flow can begin quickly.</li>
          </ul>
          <h2 id="scanner-economics">Scanner Economics</h2>
          <p>The source cites <strong>~30%</strong> of subnet TAO emissions for scanner activity and references discovery speed and accuracy as the reward basis.</p>
          <blockquote>
            Required stake shown in the source: 100 TAO to register a UID.
          </blockquote>
        `,
      },
      {
        slug: "relay-miner",
        title: "Relay Miner",
        description: "How relay miners compete for execution.",
        content: `
          <span class="eyebrow">Relay Role</span>
          <h1>Relay miners compete to deliver messages across chains with speed and cost efficiency.</h1>
          <p>Relay miners are the execution layer. The original site assigns them the larger reward share because they absorb the responsibility of winning auctions and submitting successful proofs.</p>
          <h2 id="relay-responsibilities">Relay Responsibilities</h2>
          <ul>
            <li><strong>Sealed auctions:</strong> bid latency and gas cost inside a short execution window.</li>
            <li><strong>Cross-chain delivery:</strong> submit the destination transaction as soon as execution rights are won.</li>
            <li><strong>Proof submission:</strong> return a verifiable proof so rewards and fees can be released.</li>
          </ul>
          <h2 id="relay-economics">Relay Economics</h2>
          <p>The landing page frames relay miners around <strong>~70%</strong> of subnet emissions plus access to the protocol's relay reserve. One highlighted example metric is a verified delivery target below ten seconds on fast chains.</p>
        `,
      },
    ],
  },
  {
    title: "5. Auctions & Economics",
    pages: [
      {
        slug: "sealed-bid-velocity",
        title: "Sealed-Bid Velocity",
        description: "How execution rights are awarded.",
        content: `
          <span class="eyebrow">Auction Layer</span>
          <h1>Execution rights are awarded through a sealed-bid velocity auction.</h1>
          <p>The original site visualizes three relay miners bidding into a two-second window, after which the winner executes the delivery. The simplified scoring model shown there balances latency, gas cost, and accuracy.</p>
          <h2 id="auction-flow">Auction Flow</h2>
          <ol>
            <li>Multiple relay miners observe an attested message.</li>
            <li>Each miner submits a sealed bid during the time window.</li>
            <li>The protocol evaluates bids across latency, gas cost, and correctness.</li>
            <li>The winning miner receives execution rights for that delivery.</li>
          </ol>
          <h2 id="illustrative-bid-formula">Illustrative Bid Formula</h2>
          <p>The visual shown on the source page uses this simplified weight split for the auction stage:</p>
          ${codeBlock("text", "Score = 0.40 × Latency + 0.40 × Gas Cost + 0.20 × Accuracy")}
        `,
      },
      {
        slug: "scoring-model",
        title: "Scoring Model",
        description: "The five dimensions used to evaluate deliveries.",
        content: `
          <span class="eyebrow">Quality Signals</span>
          <h1>Every delivery is evaluated across five dimensions.</h1>
          <p>The source site breaks execution quality into five measurable factors. Together they determine which operators earn the strongest reputation and reward outcomes over time.</p>
          <table>
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Weight</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>D1 Latency</td><td>25%</td><td>Time from source dispatch to destination delivery.</td></tr>
              <tr><td>D2 Confirmation</td><td>25%</td><td>Whether delivery lands inside the promised deadline window.</td></tr>
              <tr><td>D3 Gas Efficiency</td><td>20%</td><td>Execution cost relative to expected oracle or market conditions.</td></tr>
              <tr><td>D4 Integrity</td><td>15%</td><td>Exact payload-hash matching against the source event.</td></tr>
              <tr><td>D5 Reliability</td><td>15%</td><td>Historical uptime and successful-delivery consistency.</td></tr>
            </tbody>
          </table>
          <h2 id="blended-score">Blended Score</h2>
          <p>The landing page also shows a higher-level combined formula for execution and bid quality:</p>
          ${codeBlock("text", "Score = 0.70 × Exec + 0.30 × Bid")}
        `,
      },
      {
        slug: "real-time-fees",
        title: "Real-Time Fees",
        description: "Fee flow, treasury split, and miner reserve framing.",
        content: `
          <span class="eyebrow">Economic Loop</span>
          <h1>Native gas fees fund a self-sustaining reward loop alongside subnet emissions.</h1>
          <p>Entangle's source page makes a clear point here: fee revenue is paid in native assets like ETH, SOL, or USDC-equivalents depending on the execution path, so the protocol is not framed as relying only on TAO price appreciation.</p>
          <h2 id="fee-flow">Fee Flow</h2>
          <ul>
            <li><strong>User or dApp:</strong> calls <code>sendMessage()</code> and pays the required native gas fee.</li>
            <li><strong>Entangle Core:</strong> uses a gas oracle and circuit-breaker logic to keep pricing current.</li>
            <li><strong>Distribution:</strong> fee flow is split between protocol treasury and relay reserve.</li>
          </ul>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-value">30%</span>
              <span class="metric-label">Protocol treasury</span>
              <span class="metric-note">Accumulates native assets to support operations and ecosystem growth.</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">70%</span>
              <span class="metric-label">Relay reserve</span>
              <span class="metric-note">Funds successful relay execution on the network side.</span>
            </div>
          </div>
        `,
      },
    ],
  },
  {
    title: "6. Validation",
    pages: [
      {
        slug: "reference-run",
        title: "Reference Run",
        description: "Metrics from the live demo flow on the original site.",
        content: `
          <span class="eyebrow">Live Example</span>
          <h1>The reference run illustrates a verified end-to-end delivery across test environments.</h1>
          <p>The source product page includes a "It's Live" section that packages one example reference run into a compact proof of execution story.</p>
          <div class="metric-grid">
            <div class="metric-card">
              <span class="metric-value">8.3s</span>
              <span class="metric-label">Fastest delivery</span>
              <span class="metric-note">Source example: Solana to Arbitrum.</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">8/8</span>
              <span class="metric-label">Consecutive runs</span>
              <span class="metric-note">Displayed as a 100% success-rate reference streak.</span>
            </div>
            <div class="metric-card">
              <span class="metric-value">213K</span>
              <span class="metric-label">Gas used</span>
              <span class="metric-note">Shown as the reference delivery cost.</span>
            </div>
          </div>
          <h2 id="reference-path">Reference Path</h2>
          <ol>
            <li>Sepolia dispatches the source message.</li>
            <li>Entangle relay processes the route in roughly 8.3 seconds.</li>
            <li>Arbitrum Sepolia receives the message with the relay flag set to true.</li>
          </ol>
          <p>The point of this section is not just latency marketing. It demonstrates the product's preferred documentation pattern: show the message hash, the relay timing, and the destination confirmation state in one traceable view.</p>
        `,
      },
    ],
  },
  {
    title: "7. Roadmap & Resources",
    pages: [
      {
        slug: "roadmap",
        title: "Roadmap",
        description: "The staged rollout described on the landing page.",
        content: `
          <span class="eyebrow">Roadmap</span>
          <h1>Entangle's rollout is split across three phases.</h1>
          <p>The original site frames roadmap progress as a sequence from live testnet infrastructure into mainnet launch and then wider ecosystem scale.</p>
          <div class="phase-list">
            <div class="phase-card">
              <span class="pill">Phase 1 · Active now</span>
              <h3>Bootstrap and readiness</h3>
              <ul>
                <li>Testnets deployed across Sepolia, Arbitrum Sepolia, and Solana Devnet.</li>
                <li>Multisig governance deployed across five ecosystems.</li>
                <li>Security audits in final review.</li>
                <li>Monitoring and alerting stack already live.</li>
              </ul>
            </div>
            <div class="phase-card">
              <span class="pill">Phase 2 · Up next</span>
              <h3>Mainnet and scoring activation</h3>
              <ul>
                <li>Mainnet launch planned across Ethereum, Arbitrum, Solana, Sui, and Cosmos.</li>
                <li>Bootstrap mode ends and competitive scoring begins.</li>
                <li>Initial real dApp integrations move live.</li>
                <li>Relay reserve becomes funded by live fees.</li>
              </ul>
            </div>
            <div class="phase-card">
              <span class="pill">Phase 3+ · Future</span>
              <h3>Expansion and institutional scale</h3>
              <ul>
                <li>Chain adapter plugins broaden ecosystem coverage.</li>
                <li>ZK verification is explored as a trustless proof path.</li>
                <li>Institutional operator programs expand the network.</li>
                <li>DAO governance takes more direct control over parameters.</li>
              </ul>
            </div>
          </div>
        `,
      },
      {
        slug: "actions",
        title: "Actions",
        description: "The three audience paths shown at the bottom of the site.",
        content: `
          <span class="eyebrow">Get Started</span>
          <h1>The original site closes with three clear calls to action: build, operate, and join the community.</h1>
          <p>This docs adaptation keeps the same audience framing while turning it into a quick decision page.</p>
          <div class="card-grid">
            <div class="info-card">
              <h3>Developers</h3>
              <p>Integrate omnichain messaging with one SDK model and focus application logic on payload creation and destination execution.</p>
              <ul>
                <li><code>npm install @entangle/sdk</code></li>
                <li><code>import { Entangle }</code></li>
              </ul>
            </div>
            <div class="info-card">
              <h3>Operators</h3>
              <p>Run validator, scanner, or relay infrastructure to participate in the delivery path and compete for rewards.</p>
              <ul>
                <li>Relay rewards: 70%</li>
                <li>Scanner rewards: 30%</li>
              </ul>
            </div>
            <div class="info-card">
              <h3>Community</h3>
              <p>Follow governance, ecosystem updates, and support channels as the network expands from testnet into mainnet.</p>
              <ul>
                <li>Announcements</li>
                <li>Governance</li>
              </ul>
            </div>
          </div>
          <h2 id="recommended-reading-order">Recommended Reading Order</h2>
          <ol>
            <li>Read <strong>Overview</strong> and <strong>Protocol Flow</strong> first.</li>
            <li>If you are integrating, continue into <strong>Developer Overview</strong> and <strong>Simple Integration</strong>.</li>
            <li>If you are operating infrastructure, move to <strong>Scanner Miner</strong>, <strong>Relay Miner</strong>, and <strong>Scoring Model</strong>.</li>
          </ol>
        `,
      },
    ],
  },
];

export function getPageBySlug(slug: string) {
  for (const section of docsStructure) {
    const found = section.pages.find((page) => page.slug === slug);
    if (found) return found;
  }
}

export function getSectionBySlug(slug: string) {
  return docsStructure.find((section) => section.pages.some((page) => page.slug === slug));
}

export function getAllPages() {
  return docsStructure.flatMap((section) => section.pages);
}

export function getAdjacentPages(slug: string) {
  const pages = getAllPages();
  const index = pages.findIndex((page) => page.slug === slug);
  return {
    prev: index > 0 ? pages[index - 1] : undefined,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined,
  };
}

export function extractHeadings(content: string) {
  const regex = /<(h2|h3)\s+id="([^"]+)">(.+?)<\/h2>|<(h2|h3)\s+id="([^"]+)">(.+?)<\/h3>/g;
  const headings: { id: string; title: string; level: 2 | 3 }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const level = (match[1] || match[4]) as "h2" | "h3";
    const id = match[2] || match[5];
    const rawTitle = match[3] || match[6];
    const title = rawTitle.replace(/<[^>]+>/g, "");
    headings.push({ id, title, level: level === "h2" ? 2 : 3 });
  }

  return headings;
}
