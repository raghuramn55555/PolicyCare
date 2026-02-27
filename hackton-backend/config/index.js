import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const config = {
    port: Number(process.env.PORT) || 5000,
    openaiApiKey: process.env.OPENAI_API_KEY || null,
    supportedLanguages: ['en', 'te', 'hi'],
    paths: {
        policies: path.join(ROOT_DIR, 'policies.json'),
        agents: path.join(ROOT_DIR, 'agents.json'),
        users: path.join(ROOT_DIR, 'users.json'),
    },
    recommendation: {
        candidateLimit: 30,
        broadLimit: 40,
        outputLimit: 6,
    },
};

export default config;
