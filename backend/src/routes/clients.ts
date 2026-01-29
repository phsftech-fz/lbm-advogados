import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

const clientSchema = z.object({
  type: z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA']),
  name: z.string().min(3),
  cpfCnpj: z.string(),
  rgIe: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { processes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        processes: {
          include: {
            responsibleUser: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = clientSchema.parse(req.body);
    const client = await prisma.client.create({
      data,
    });
    res.status(201).json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = clientSchema.partial().parse(req.body);
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data,
    });
    res.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

export { router as clientRoutes };

