import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../config/database';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

const monitoringSchema = z.object({
  clientId: z.string().uuid(),
  cnpj: z.string(),
});

router.post('/search', async (req, res) => {
  try {
    const { cnpj } = req.body;
    
    // Simulação de busca de processos por CNPJ
    // Em produção, aqui você integraria com APIs dos tribunais
    const mockResults = [
      {
        processNumber: '1002345-88.2023.5.02.0000',
        area: 'TRABALHISTA',
        court: 'TRT-2 (São Paulo)',
        author: 'Silva, João Paulo',
        defendant: 'Construtora Exemplo Ltda',
        value: 150000.00,
        status: 'AÇÃO_NECESSARIA',
        createdAt: new Date(),
      },
    ];

    res.json(mockResults);
  } catch (error) {
    console.error('Error searching processes:', error);
    res.status(500).json({ error: 'Erro ao buscar processos' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const data = monitoringSchema.parse(req.body);
    
    const monitoring = await prisma.processMonitoring.upsert({
      where: {
        clientId_cnpj: {
          clientId: data.clientId,
          cnpj: data.cnpj,
        },
      },
      update: {
        lastScan: new Date(),
        isActive: true,
      },
      create: {
        ...data,
        lastScan: new Date(),
        isActive: true,
      },
    });

    res.status(201).json(monitoring);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Error registering monitoring:', error);
    res.status(500).json({ error: 'Erro ao registrar monitoramento' });
  }
});

router.get('/', async (req, res) => {
  try {
    const monitorings = await prisma.processMonitoring.findMany({
      where: { isActive: true },
      include: {
        client: {
          select: { id: true, name: true, cpfCnpj: true },
        },
      },
      orderBy: { lastScan: 'desc' },
    });

    res.json(monitorings);
  } catch (error) {
    console.error('Error fetching monitorings:', error);
    res.status(500).json({ error: 'Erro ao buscar monitoramentos' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.processMonitoring.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting monitoring:', error);
    res.status(500).json({ error: 'Erro ao desativar monitoramento' });
  }
});

export { router as monitoringRoutes };

