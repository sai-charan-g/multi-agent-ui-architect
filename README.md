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
