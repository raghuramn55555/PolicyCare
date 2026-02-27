# PolicySetu — AI Policy Recommendation Engine

An intelligent, multilingual backend that recommends government schemes and insurance policies to users based on their profile. Powered by an agentic RAG (Retrieval-Augmented Generation) architecture with in-memory vector search.

## Architecture

```
server.js                  → Express entry point, middleware, routes
├── config/index.js        → Centralized configuration (env vars, paths, limits)
├── utils/logger.js        → Structured timestamped logging
├── routes/
│   ├── recommend.js       → POST /recommend — personalized recommendations
│   ├── chat.js            → POST /api/chat — agentic AI chatbot
│   ├── auth.js            → POST /api/auth/signup, /api/auth/login
│   └── popular.js         → GET  /popular — featured schemes & policies
├── services/
│   ├── vectorDB.js        → Orama in-memory vector database (multilingual)
│   ├── embeddingService.js→ OpenAI embeddings (with mock fallback)
│   ├── policyLoader.js    → Loads policies.json & agents.json into VectorDB
│   ├── agenticRAG.js      → Functional RAG agents (validator, researcher, etc.)
│   └── AgentOrchestrator.js → Coordinates class-based agents for chat
├── agents/
│   ├── BaseAgent.js       → Abstract base class
│   ├── IntentAgent.js     → Classifies user intent
│   ├── RetrievalAgent.js  → Searches VectorDB for relevant policies
│   ├── EligibilityAgent.js→ Rule-based eligibility validation
│   ├── ReasoningAgent.js  → Generates human-readable explanations
│   ├── RelevanceAgent.js  → Scores & ranks policies by profile match
│   ├── ComparisonAgent.js → Side-by-side policy comparison
│   └── LocationAgent.js   → Finds nearby agents by pincode
└── workflows/
    └── RecommendationWorkflow.js → Full recommend pipeline (retrieve → filter → rank → explain)
```

## Quick Start

### Prerequisites
- **Node.js** ≥ 18
- (Optional) OpenAI API key for real embeddings

### Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure environment
cp .env.example .env
# Edit .env to add your OPENAI_API_KEY

# 3. Start the server
npm start
# Server runs at http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/recommend` | Get personalized scheme/policy recommendations |
| POST | `/api/chat` | AI chatbot for policy queries |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login with existing credentials |
| GET | `/popular` | Get featured schemes & policies |

### Example: Get Recommendations

```bash
curl -X POST http://localhost:3000/recommend \
  -H "Content-Type: application/json" \
  -d '{"age":35,"annualIncome":450000,"occupation":"farmer","gender":"male","language":"en"}'
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `OPENAI_API_KEY` | No | — | OpenAI key for real embeddings (mock used if absent) |
| `LOG_LEVEL` | No | `INFO` | Logging verbosity: `DEBUG`, `INFO`, `WARN`, `ERROR` |

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js
- **Vector DB**: Orama (in-memory)
- **Embeddings**: OpenAI `text-embedding-3-small` (with mock fallback)
- **Frontend**: React + Vite + TailwindCSS
