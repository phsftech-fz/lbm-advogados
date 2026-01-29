import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { minioClient, BUCKET_NAME, ensureBucket } from '../config/minio';
import { prisma } from '../config/database';
import { randomUUID } from 'crypto';

const router = Router();
router.use(authenticateToken);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post('/upload', upload.single('file'), async (req: AuthRequest & MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    await ensureBucket();

    const fileId = randomUUID();
    const fileName = `${fileId}-${req.file.originalname}`;
    const filePath = `documents/${fileName}`;

    await minioClient.putObject(BUCKET_NAME, filePath, req.file.buffer, req.file.size, {
      'Content-Type': req.file.mimetype,
    });

    const document = await prisma.document.create({
      data: {
        userId: req.userId!,
        processId: req.body.processId || null,
        clientId: req.body.clientId || null,
        fileName: req.file.originalname,
        filePath: filePath,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        description: req.body.description || null,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do documento' });
  }
});

router.get('/:id/download', async (req: Request, res: Response) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const fileStream = await minioClient.getObject(BUCKET_NAME, document.filePath);

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Erro ao baixar documento' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { processId, clientId } = req.query;
    const where: any = {};

    if (processId) {
      where.processId = processId;
    }
    if (clientId) {
      where.clientId = clientId;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    await minioClient.removeObject(BUCKET_NAME, document.filePath);
    await prisma.document.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Erro ao deletar documento' });
  }
});

export { router as documentRoutes };

