import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  body {
    background-color: #0b0f17;
    color: #e2e8f0;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    background: linear-gradient(180deg, #111827 0%, #0d131f 100%);
    border: 1px solid #1f2937;
    border-radius: 20px;
    padding: 44px;
    width: 1040px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  }
  .header {
    text-align: center;
    margin-bottom: 36px;
    position: relative;
  }
  .badge {
    display: inline-block;
    padding: 4px 14px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border-radius: 9999px;
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.25);
    margin-bottom: 12px;
  }
  .title {
    font-size: 26px;
    font-weight: 800;
    color: #f8fafc;
    letter-spacing: -0.5px;
  }
  .subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 6px;
  }

  /* Ingress box */
  .ingress-box {
    background: rgba(15, 23, 42, 0.8);
    border: 1px dashed #334155;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .ingress-label {
    background: #1e293b;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .ingress-quote {
    font-size: 13px;
    color: #cbd5e1;
    font-style: italic;
    line-height: 1.4;
  }

  /* Layers flow */
  .layers-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
  }
  .layer {
    display: flex;
    align-items: stretch;
    background: rgba(17, 24, 39, 0.95);
    border: 1px solid #1f293d;
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .layer-tag {
    width: 210px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 1px solid #1f293d;
    flex-shrink: 0;
  }
  .layer-num {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }
  .layer-name {
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
    line-height: 1.25;
  }
  .layer-content {
    flex-grow: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }
  .layer-desc {
    font-size: 13px;
    color: #cbd5e1;
    line-height: 1.4;
  }
  .layer-meta {
    display: flex;
    gap: 16px;
    margin-top: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11.5px;
  }
  .layer-stats {
    width: 190px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    border-left: 1px solid #1f293d;
    background: rgba(10, 15, 26, 0.5);
    flex-shrink: 0;
  }
  .stat-latency {
    font-size: 15px;
    font-weight: 800;
    font-family: ui-monospace, monospace;
  }
  .stat-cost {
    font-size: 11px;
    color: #64748b;
    margin-top: 2px;
  }

  /* Color themes per layer */
  .l1 .layer-num { color: #818cf8; }
  .l1 .stat-latency { color: #818cf8; }
  .l1 { border-left: 4px solid #6366f1; }

  .l2 .layer-num { color: #34d399; }
  .l2 .stat-latency { color: #34d399; }
  .l2 { border-left: 4px solid #10b981; }

  .l3 .layer-num { color: #fbbf24; }
  .l3 .stat-latency { color: #fbbf24; }
  .l3 { border-left: 4px solid #f59e0b; }

  .l4 .layer-num { color: #c084fc; }
  .l4 .stat-latency { color: #c084fc; }
  .l4 { border-left: 4px solid #a855f7; }

  .l5 .layer-num { color: #f43f5e; }
  .l5 .stat-latency { color: #f43f5e; }
  .l5 { border-left: 4px solid #f43f5e; }

  .l6 .layer-num { color: #38bdf8; }
  .l6 .stat-latency { color: #38bdf8; }
  .l6 { border-left: 4px solid #0ea5e9; }

  /* Connectors */
  .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    color: #475569;
    font-size: 11px;
  }

  .pill {
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }
  .pill-green { background: rgba(16, 185, 129, 0.15); color: #34d399; }
  .pill-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
  .pill-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
  .pill-rose { background: rgba(244, 63, 94, 0.15); color: #fb7185; }

  .footer-legend {
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #1e293b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #64748b;
  }
  .legend-items {
    display: flex;
    gap: 20px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="badge">Architecture Pattern</div>
    <div class="title">The Composed Enterprise AI Stack</div>
    <div class="subtitle">Replacing monolithic generative LLMs with task-specific intelligence building blocks</div>
  </div>

  <div class="ingress-box">
    <span class="ingress-label">Inbound Ticket</span>
    <span class="ingress-quote">"My account was suspended and I have ¥2M in inventory stuck in the warehouse. I have been selling here for 6 years. Resolve today."</span>
  </div>

  <div class="layers-container">

    <!-- Layer 1 -->
    <div class="layer l1">
      <div class="layer-tag">
        <div class="layer-num">Layer 1 &bull; Deterministic</div>
        <div class="layer-name">CRM & Database</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">Extracts historical ground truth: Seller tenure (6 yrs), GMV Tier (Top 10%), Inventory at risk (¥2,000,000).</div>
        <div class="layer-meta">
          <span class="pill" style="background:#1e293b; color:#94a3b8;">Zero AI inference</span>
          <span style="color:#64748b;">Enriches payload before model boundary</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">&lt; 5 ms</div>
        <div class="stat-cost">Negligible ($0.00)</div>
      </div>
    </div>

    <div class="arrow">&darr;</div>

    <!-- Layer 2 -->
    <div class="layer l2">
      <div class="layer-tag">
        <div class="layer-num">Layer 2 &bull; System 1 API</div>
        <div class="layer-name">Semantic Classifier</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">Single forward pass semantic evaluation. Returns calibrated probability distribution without generating conversational text.</div>
        <div class="layer-meta">
          <span class="pill pill-green">Intent: Reinstatement (93%)</span>
          <span class="pill pill-green">Tone: Distressed (87%)</span>
          <span class="pill pill-green">Urgency: P1 (91%)</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">~280 ms</div>
        <div class="stat-cost">Fixed micro-cost</div>
      </div>
    </div>

    <div class="arrow">&darr; <span style="font-size:10px; color:#64748b; margin-left:4px;">Gated trigger on Distressed + P1</span></div>

    <!-- Layer 3 -->
    <div class="layer l3">
      <div class="layer-tag">
        <div class="layer-num">Layer 3 &bull; Classical ML</div>
        <div class="layer-name">Churn Risk Model</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">In-process XGBoost/GBDT evaluating mixed tabular signals (tenure, GMV, inventory) and Jev semantic confidence scores.</div>
        <div class="layer-meta">
          <span class="pill pill-amber">Predicted Churn Risk: 73%</span>
          <span style="color:#64748b;">In-process CPU math</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">&lt; 10 ms</div>
        <div class="stat-cost">Zero cloud API fees</div>
      </div>
    </div>

    <div class="arrow">&darr;</div>

    <!-- Layer 4 -->
    <div class="layer l4">
      <div class="layer-tag">
        <div class="layer-num">Layer 4 &bull; Code Logic</div>
        <div class="layer-name">Routing & SLA Policy</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">Deterministic business rules: IF Urgency == P1 AND Churn Risk &gt; 60% THEN route to Senior Escalation Desk with 2-hr SLA callback.</div>
        <div class="layer-meta">
          <span class="pill pill-purple">Route: VIP Merchant Desk</span>
          <span class="pill pill-purple">SLA: 2-Hour Window</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">&lt; 1 ms</div>
        <div class="stat-cost">Zero AI cost</div>
      </div>
    </div>

    <div class="arrow">&darr; <span style="font-size:10px; color:#64748b; margin-left:4px;">Gated execution (&lt; 5% total queue volume)</span></div>

    <!-- Layer 5 -->
    <div class="layer l5">
      <div class="layer-tag">
        <div class="layer-num">Layer 5 &bull; Frontier LLM</div>
        <div class="layer-name">Generative Synthesis</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">Drafts concise, high-empathy briefing for human operator referencing 6-year merchant loyalty and stranded inventory value.</div>
        <div class="layer-meta">
          <span class="pill pill-rose">Generative Briefing Drafted</span>
          <span style="color:#64748b;">Never runs on routine tickets</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">1,500 ms</div>
        <div class="stat-cost">High token cost (budgeted)</div>
      </div>
    </div>

    <div class="arrow">&darr;</div>

    <!-- Layer 6 -->
    <div class="layer l6">
      <div class="layer-tag">
        <div class="layer-num">Layer 6 &bull; Operator</div>
        <div class="layer-name">Human Specialist</div>
      </div>
      <div class="layer-content">
        <div class="layer-desc">Specialist reviews Jev telemetry, churn risk score, and pre-drafted briefing. Executes immediate warehouse release and calls merchant.</div>
        <div class="layer-meta">
          <span style="color:#38bdf8; font-weight:600;">High-stakes accountability & relationship preservation</span>
        </div>
      </div>
      <div class="layer-stats">
        <div class="stat-latency">Target: &lt; 2 hrs</div>
        <div class="stat-cost">Expert human time</div>
      </div>
    </div>

  </div>

  <div class="footer-legend">
    <div class="legend-items">
      <div class="legend-item"><div class="legend-dot" style="background:#6366f1;"></div> Deterministic DB</div>
      <div class="legend-item"><div class="legend-dot" style="background:#10b981;"></div> System 1 Triage</div>
      <div class="legend-item"><div class="legend-dot" style="background:#f59e0b;"></div> Classical ML</div>
      <div class="legend-item"><div class="legend-dot" style="background:#f43f5e;"></div> Frontier LLM (&lt;5%)</div>
      <div class="legend-item"><div class="legend-dot" style="background:#0ea5e9;"></div> Human Specialist</div>
    </div>
    <div style="font-family:ui-monospace, monospace; font-size:11px; color:#475569;">blog.anoj.net</div>
  </div>
</div>
</body>
</html>`;

async function render() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });
  const page = await browser.newPage();
  
  // Set high DPI viewport for crisp retina rendering
  await page.setViewport({
    width: 1120,
    height: 1080,
    deviceScaleFactor: 2
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const cardElement = await page.$('.card');
  const outputPath = path.resolve('/home/ubuntu/apps/blog/public/images/composed-ai-stack-architecture.png');
  
  await cardElement.screenshot({
    path: outputPath,
    type: 'png'
  });

  console.log('Successfully saved screenshot to:', outputPath);
  await browser.close();
}

render().catch(console.error);
