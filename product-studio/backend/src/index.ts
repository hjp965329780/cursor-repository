import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create App
app.post('/api/apps', async (req, res) => {
  try {
    const { name } = req.body;
    const application = await prisma.app.create({
      data: { name },
    });
    res.json(application);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create app' });
  }
});

// List Apps
app.get('/api/apps', async (req, res) => {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(apps);
});

// Get Config
app.get('/api/config/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const config = await prisma.config.findFirst({
      where: { appId, isActive: true },
      orderBy: { version: 'desc' },
    });
    
    if (!config) {
      // Return default config if none exists
      return res.json({
        guides: [],
        banner: { active: false, content: '', type: 'info' }
      });
    }
    
    res.json(JSON.parse(config.content));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// Save Config
app.post('/api/config/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const content = req.body;
    
    // Check if app exists
    const app = await prisma.app.findUnique({ where: { id: appId } });
    if (!app) return res.status(404).json({ error: 'App not found' });

    // Get latest version
    const latest = await prisma.config.findFirst({
      where: { appId },
      orderBy: { version: 'desc' }
    });
    
    const nextVersion = (latest?.version || 0) + 1;

    const config = await prisma.config.create({
      data: {
        appId,
        content: JSON.stringify(content),
        version: nextVersion,
        isActive: true, // simplified logic: new config is always active
      }
    });

    res.json({ success: true, version: config.version });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
