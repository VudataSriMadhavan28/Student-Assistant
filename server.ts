import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { runAgent } from './server/agent.ts';
import {
  getAllDocuments,
  addDocument,
  deleteDocument,
  getDocumentById
} from './server/documents.ts';
import {
  getMemory,
  updateMemory,
  resetMemory,
  toolCalculator,
  toolExecuteCode
} from './server/tools.ts';
import { UNIVERSITY_REGISTRY } from './server/registry.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chat endpoint (Runs Core Agent Loop)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { prompt, conversationHistory = [] } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const result = await runAgent(prompt, conversationHistory);
      const memory = getMemory();

      res.json({
        success: true,
        structured: result.structured,
        trace: result.trace,
        memory
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({
        error: 'Failed to process agent request',
        details: err.message
      });
    }
  });

  // University Documents endpoints
  app.get('/api/documents', (req: Request, res: Response) => {
    const docs = getAllDocuments();
    res.json({ success: true, documents: docs });
  });

  app.post('/api/documents/upload', (req: Request, res: Response) => {
    try {
      const { title, category = 'general', content, summary } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }
      const newDoc = addDocument({
        title,
        category,
        content,
        summary: summary || content.slice(0, 160) + '...'
      });
      res.json({ success: true, document: newDoc });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/documents/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = deleteDocument(id);
    res.json({ success: deleted });
  });

  // Student Memory endpoints
  app.get('/api/memory', (req: Request, res: Response) => {
    res.json({ success: true, memory: getMemory() });
  });

  app.post('/api/memory', (req: Request, res: Response) => {
    const updated = updateMemory(req.body);
    res.json({ success: true, memory: updated });
  });

  app.post('/api/memory/reset', (req: Request, res: Response) => {
    const reset = resetMemory();
    res.json({ success: true, memory: reset });
  });

  // Registry endpoint
  app.get('/api/registry', (req: Request, res: Response) => {
    res.json({ success: true, registry: UNIVERSITY_REGISTRY });
  });

  // Direct calculation helper
  app.post('/api/calculator', (req: Request, res: Response) => {
    const result = toolCalculator(req.body);
    res.json({ success: true, result });
  });

  // Direct code execution helper
  app.post('/api/execute-code', (req: Request, res: Response) => {
    const result = toolExecuteCode(req.body);
    res.json({ success: true, result });
  });

  // --- VITE & STATIC FILES SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`University Student Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
