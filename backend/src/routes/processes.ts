import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

const processSchema = z.object({
  processNumber: z.string(),
  referenceNumber: z.string().optional(),
  clientId: z.string().uuid(),
  lawArea: z.enum(['CIVEL', 'TRABALHISTA', 'TRIBUTARIO', 'CRIMINAL', 'FAMILIA', 'EMPRESARIAL', 'ADMINISTRATIVO']),
  subArea: z.string().optional(),
  status: z.enum(['EM_ANDAMENTO', 'AGUARDANDO_AUDIENCIA', 'CONCLUSO_PARA_SENTENCA', 'ARQUIVADO', 'SUSPENSO', 'RECURSO', 'FAVORAVEL', 'PRAZO_EM_ABERTO']),
  priority: z.enum(['BAIXA', 'NORMAL', 'URGENTE']).optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  value: z.number().optional(),
  court: z.string().optional(),
  comarca: z.string().optional(),
});

router.get('/', async (req, res) => {
  try {
    const { status, area, search } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (area) {
      where.lawArea = area;
    }
    if (search) {
      where.OR = [
        { processNumber: { contains: search as string, mode: 'insensitive' } },
        { title: { contains: search as string, mode: 'insensitive' } },
        { client: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const processes = await prisma.process.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, type: true },
        },
        responsibleUser: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(processes);
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ error: 'Erro ao buscar processos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const process = await prisma.process.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        responsibleUser: {
          select: { id: true, name: true, email: true },
        },
        events: {
          orderBy: { date: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado' });
    }

    res.json(process);
  } catch (error) {
    console.error('Error fetching process:', error);
    res.status(500).json({ error: 'Erro ao buscar processo' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = processSchema.parse({
      ...req.body,
      responsibleUserId: req.userId,
    });
    const process = await prisma.process.create({
      data: {
        ...data,
        responsibleUserId: req.userId!,
      },
      include: {
        client: true,
        responsibleUser: {
          select: { id: true, name: true },
        },
      },
    });
    res.status(201).json(process);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Error creating process:', error);
    res.status(500).json({ error: 'Erro ao criar processo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = processSchema.partial().parse(req.body);
    const process = await prisma.process.update({
      where: { id: req.params.id },
      data,
      include: {
        client: true,
        responsibleUser: {
          select: { id: true, name: true },
        },
      },
    });
    res.json(process);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Error updating process:', error);
    res.status(500).json({ error: 'Erro ao atualizar processo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.process.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting process:', error);
    res.status(500).json({ error: 'Erro ao deletar processo' });
  }
});

export { router as processRoutes };

