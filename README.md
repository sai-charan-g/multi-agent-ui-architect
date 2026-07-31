# DevPilot AI Frontend Designer

An AI-powered multi-agent system for generating production-quality web applications. DevPilot AI orchestrates a team of specialized AI agents to plan, design, build, and refine frontend projects autonomously.

## 🧠 How It Works (The Multi-Agent Pipeline)

The system utilizes a structured pipeline of autonomous agents powered by Gemini:

1. **Planner Agent**: Analyzes your natural language request, determines the website type, structure, pages, and layout requirements.
2. **Design System Agent**: Generates a cohesive design language (colors, typography, spacing, and CSS variables) tailored to the brand style.
3. **Builder Agent**: Writes the actual code (HTML, CSS, JS, React/Next.js components) based on the plan and design tokens.
4. **Critic Agent**: Reviews the generated code against best practices, UI/UX standards, and the original plan. If issues are found, it sends targeted feedback back to the Builder Agent in an iterative refinement loop until the code passes validation.

## ✨ Features

- **Autonomous Code Generation**: From a single prompt to a fully structured codebase.
- **Iterative Refinement**: Built-in Critic agent ensures code quality and catches visual/structural bugs before they reach you.
- **Design Tokens**: Standardized CSS variables and typography scales for consistent, premium aesthetics.
- **Automated Project Scaffolding**: Outputs ready-to-run projects.

## 💡 Why This Exists (The Core Problem)

A single Large Language Model prompt is generally insufficient to build production-ready, beautiful, and complex frontend architectures. **AI alone cannot make a good frontend without rigorous planning.** Typical LLM outputs result in monolithic, unstyled, and unmaintainable code. 

DevPilot AI solves this by introducing a **multi-agent orchestration architecture** where the problem is subdivided:
1. **Strategic Planning** before any code is written.
2. **Design System Generation** before any UI components are built.
3. **Iterative Peer Review** where agents critique and fix each other's work.

## 🏆 Technical Achievements (Resume Highlights)

- **Retrieval-Augmented Generation (RAG) for UI Design**: Integrates a localized RAG pipeline that injects curated, domain-specific markdown knowledge (e.g., modern typography standards, spacing heuristics, and color theory) directly into the agents' context window, resulting in premium, non-generic designs.
- **Multi-Agent Orchestration Engine**: Engineered a custom TypeScript-based agentic pipeline bypassing heavy frameworks like LangChain, significantly reducing overhead and optimizing for raw API speed and direct Node.js integration.
- **Deterministic Structured Outputs**: Enforced strict type-safety across the LLM boundary using **Zod** and JSON Schema, ensuring predictable data passing between the Planner, Designer, and Builder agents without hallucinated structures.
- **Autonomous Feedback Loops (Self-Healing Code)**: Implemented a 'Critic' agent that automatically evaluates generated code against initial requirements and design tokens, triggering a localized refinement loop to fix issues before delivering the final build.
- **Event-Driven UI Streaming**: Built an Express server with Server-Sent Events (SSE) to broadcast real-time internal agent logs, state transitions, and file generation updates to a lightweight frontend dashboard.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sai-charan-g/multi-agent-ui-architect.git
   cd multi-agent-ui-architect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Usage

Run the main pipeline using the npm script:

```bash
npm start
# or
npm run generate
```

To run the web interface/server:
```bash
npm run serve
```

## 📂 Output

Once the generation pipeline is complete, your newly created project will be saved in the `output/` directory. 

To run the generated project:
```bash
cd output/your-project-name
npm install
npm run dev
```

## 🛠 Tech Stack

- **Core**: TypeScript, Node.js
- **AI SDK**: `@google/genai`
- **Validation**: Zod
- **CLI Utilities**: Chalk, Ora, Commander

## 📄 License

ISC License. See `package.json` for details.
