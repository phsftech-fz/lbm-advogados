import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../config/database';

const router = Router();

router.use(authenticateToken);

router.get('/office', async (req, res) => {
  try {
    const [
      totalProcesses,
      processesWithDeadlines,
      monthlyAudiences,
      finishedProcesses,
      recentProcesses,
      financialData,
    ] = await Promise.all([
      prisma.process.count({ where: { status: { not: 'ARQUIVADO' } } }),
      prisma.event.count({
        where: {
          type: 'PRAZO',
          date: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.event.count({
        where: {
          type: 'AUDIENCIA',
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
      }),
      prisma.process.count({
        where: {
          status: { in: ['FAVORAVEL', 'ARQUIVADO'] },
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.process.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { name: true } },
        },
      }),
      prisma.process.groupBy({
        by: ['lawArea'],
        _count: { id: true },
      }),
    ]);

    res.json({
      totalProcesses,
      processesWithDeadlines,
      monthlyAudiences,
      finishedProcesses,
      recentProcesses,
      areaDistribution: financialData,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

router.get('/client/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;

    const [
      client,
      activeProcesses,
      totalProcesses,
      finishedProcesses,
      upcomingAudiences,
      processes,
    ] = await Promise.all([
      prisma.client.findUnique({
        where: { id: clientId },
      }),
      prisma.process.count({
        where: {
          clientId,
          status: { not: 'ARQUIVADO' },
        },
      }),
      prisma.process.count({
        where: { clientId },
      }),
      prisma.process.count({
        where: {
          clientId,
          status: { in: ['FAVORAVEL'] },
        },
      }),
      prisma.event.findMany({
        where: {
          process: { clientId },
          type: 'AUDIENCIA',
          date: { gte: new Date() },
        },
        take: 5,
        orderBy: { date: 'asc' },
        include: {
          process: { select: { processNumber: true, title: true } },
        },
      }),
      prisma.process.findMany({
        where: { clientId },
        include: {
          responsibleUser: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const successRate = totalProcesses > 0 
      ? Math.round((finishedProcesses / totalProcesses) * 100) 
      : 0;

    res.json({
      client,
      activeProcesses,
      successRate,
      upcomingAudiences,
      processes,
    });
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard do cliente' });
  }
});

export { router as dashboardRoutes };

