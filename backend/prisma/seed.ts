import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Função auxiliar para gerar CPF fake
function generateCPF(): string {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  const n9 = Math.floor(Math.random() * 9);
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-00`;
}

// Função auxiliar para gerar CNPJ fake
function generateCNPJ(): string {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/0001-90`;
}

// Função auxiliar para gerar número de processo fake único
function generateProcessNumber(index: number): string {
  const year = 2023 + Math.floor(Math.random() * 3);
  const court = ['0000001', '0000002', '0000003', '0000004', '0000005'][Math.floor(Math.random() * 5)];
  const segment = ['26', '13', '04', '17', '12'][Math.floor(Math.random() * 5)];
  // Usar o índice e timestamp para garantir unicidade no número sequencial
  const uniqueNum = index * 1000 + Math.floor(Math.random() * 999);
  const sequential = String(uniqueNum).padStart(4, '0');
  const digit = Math.floor(Math.random() * 9) + 1; // Dígito verificador de 1 a 9
  return `${court}-${year}.${segment}.${sequential}-${digit}`;
}

// Função auxiliar para gerar data aleatória nos últimos N dias
function randomDate(daysAgo: number = 365): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

// Função auxiliar para gerar data futura
function randomFutureDate(daysAhead: number = 30): Date {
  const now = new Date();
  const future = new Date(now.getTime() + Math.random() * daysAhead * 24 * 60 * 60 * 1000);
  return future;
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...');
  await prisma.document.deleteMany();
  await prisma.event.deleteMany();
  await prisma.processMonitoring.deleteMany();
  await prisma.process.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@lbm.com.br',
        password: hashedPassword,
        name: 'Dr. Carlos Silva',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.santos@lbm.com.br',
        password: hashedPassword,
        name: 'Dra. Maria Santos',
        role: 'SOCIO_SENIOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'joao.oliveira@lbm.com.br',
        password: hashedPassword,
        name: 'Dr. João Oliveira',
        role: 'ADVOGADO',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana.costa@lbm.com.br',
        password: hashedPassword,
        name: 'Dra. Ana Costa',
        role: 'ADVOGADO',
      },
    }),
    prisma.user.create({
      data: {
        email: 'pedro.almeida@lbm.com.br',
        password: hashedPassword,
        name: 'Dr. Pedro Almeida',
        role: 'ADVOGADO',
      },
    }),
    prisma.user.create({
      data: {
        email: 'julia.ferreira@lbm.com.br',
        password: hashedPassword,
        name: 'Júlia Ferreira',
        role: 'ASSISTENTE',
      },
    }),
  ]);

  console.log(`✅ ${users.length} usuários criados\n`);

  // Criar clientes
  console.log('👤 Criando clientes...');
  const clientsData = [
    // Pessoa Física
    {
      type: 'PESSOA_FISICA' as const,
      name: 'Roberto Mendes',
      cpfCnpj: generateCPF(),
      rgIe: '12.345.678-9',
      email: 'roberto.mendes@email.com',
      phone: '(11) 98765-4321',
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_FISICA' as const,
      name: 'Fernanda Lima',
      cpfCnpj: generateCPF(),
      rgIe: '23.456.789-0',
      email: 'fernanda.lima@email.com',
      phone: '(11) 97654-3210',
      cep: '04547-130',
      street: 'Rua Funchal',
      number: '200',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_FISICA' as const,
      name: 'Marcos Pereira',
      cpfCnpj: generateCPF(),
      rgIe: '34.567.890-1',
      email: 'marcos.pereira@email.com',
      phone: '(11) 96543-2109',
      cep: '04038-001',
      street: 'Rua dos Três Irmãos',
      number: '500',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_FISICA' as const,
      name: 'Patrícia Souza',
      cpfCnpj: generateCPF(),
      rgIe: '45.678.901-2',
      email: 'patricia.souza@email.com',
      phone: '(11) 95432-1098',
      cep: '01310-100',
      street: 'Avenida Brigadeiro Faria Lima',
      number: '1500',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_FISICA' as const,
      name: 'Ricardo Martins',
      cpfCnpj: generateCPF(),
      rgIe: '56.789.012-3',
      email: 'ricardo.martins@email.com',
      phone: '(11) 94321-0987',
      cep: '01452-000',
      street: 'Rua Augusta',
      number: '800',
      city: 'São Paulo',
      state: 'SP',
    },
    // Pessoa Jurídica
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'TechSolutions Ltda',
      cpfCnpj: generateCNPJ(),
      rgIe: '123.456.789.012',
      email: 'contato@techsolutions.com.br',
      phone: '(11) 3456-7890',
      cep: '04547-130',
      street: 'Avenida Engenheiro Luís Carlos Berrini',
      number: '1200',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Construtora ABC S.A.',
      cpfCnpj: generateCNPJ(),
      rgIe: '234.567.890.123',
      email: 'juridico@construtoraabc.com.br',
      phone: '(11) 3345-6789',
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '2000',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Comércio XYZ EIRELI',
      cpfCnpj: generateCNPJ(),
      rgIe: '345.678.901.234',
      email: 'contato@comercioxyz.com.br',
      phone: '(11) 3234-5678',
      cep: '04038-001',
      street: 'Rua dos Três Irmãos',
      number: '300',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Indústria Moderna Ltda',
      cpfCnpj: generateCNPJ(),
      rgIe: '456.789.012.345',
      email: 'juridico@industriamoderna.com.br',
      phone: '(11) 3123-4567',
      cep: '01310-100',
      street: 'Avenida Brigadeiro Faria Lima',
      number: '2500',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Serviços Premium S.A.',
      cpfCnpj: generateCNPJ(),
      rgIe: '567.890.123.456',
      email: 'contato@servicospremium.com.br',
      phone: '(11) 3012-3456',
      cep: '01452-000',
      street: 'Rua Augusta',
      number: '900',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Agro Negócios Ltda',
      cpfCnpj: generateCNPJ(),
      rgIe: '678.901.234.567',
      email: 'juridico@agronegocios.com.br',
      phone: '(11) 2901-2345',
      cep: '04547-130',
      street: 'Avenida Engenheiro Luís Carlos Berrini',
      number: '1400',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'Logística Express S.A.',
      cpfCnpj: generateCNPJ(),
      rgIe: '789.012.345.678',
      email: 'contato@logisticaexpress.com.br',
      phone: '(11) 2890-1234',
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '3000',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      type: 'PESSOA_JURIDICA' as const,
      name: 'E-commerce Digital Ltda',
      cpfCnpj: generateCNPJ(),
      rgIe: '890.123.456.789',
      email: 'juridico@ecommercedigital.com.br',
      phone: '(11) 2789-0123',
      cep: '04038-001',
      street: 'Rua dos Três Irmãos',
      number: '400',
      city: 'São Paulo',
      state: 'SP',
    },
  ];

  const clients = await Promise.all(
    clientsData.map((data) => prisma.client.create({ data }))
  );

  console.log(`✅ ${clients.length} clientes criados\n`);

  // Criar ProcessMonitoring para clientes PJ
  console.log('📊 Criando monitoramentos de processos...');
  const pjClients = clients.filter((c) => c.type === 'PESSOA_JURIDICA');
  const monitoringData = await Promise.all(
    pjClients.slice(0, 5).map((client) =>
      prisma.processMonitoring.create({
        data: {
          clientId: client.id,
          cnpj: client.cpfCnpj,
          lastScan: randomDate(7),
          newCasesCount: Math.floor(Math.random() * 5),
          isActive: Math.random() > 0.3,
        },
      })
    )
  );
  console.log(`✅ ${monitoringData.length} monitoramentos criados\n`);

  // Criar processos
  console.log('📁 Criando processos...');
  const processTitles = [
    'Ação de Cobrança',
    'Ação Trabalhista - Rescisão Indireta',
    'Ação de Indenização por Danos Morais',
    'Processo Administrativo Tributário',
    'Ação de Despejo',
    'Ação de Usucapião',
    'Ação de Divórcio Litigioso',
    'Ação de Investigação de Paternidade',
    'Ação de Revisão Contratual',
    'Ação de Responsabilidade Civil',
    'Ação Trabalhista - Horas Extras',
    'Processo de Recuperação de Crédito',
    'Ação de Indenização por Danos Materiais',
    'Processo de Execução Fiscal',
    'Ação de Consignação em Pagamento',
    'Ação de Nulidade de Ato Jurídico',
    'Ação de Busca e Apreensão',
    'Ação de Desapropriação',
    'Ação de Alimentos',
    'Ação de Guarda e Visitação',
    'Ação Trabalhista - Adicional de Insalubridade',
    'Processo de Falência',
    'Ação de Indenização por Publicidade Enganosa',
    'Ação de Cobrança de Títulos',
    'Processo de Recuperação Judicial',
    'Ação de Anulação de Contrato',
    'Ação de Repetição de Indébito',
    'Ação de Obrigação de Fazer',
    'Ação de Obrigação de Não Fazer',
    'Ação de Declaratória de Inexistência',
  ];

  const lawAreas: Array<'CIVEL' | 'TRABALHISTA' | 'TRIBUTARIO' | 'CRIMINAL' | 'FAMILIA' | 'EMPRESARIAL' | 'ADMINISTRATIVO'> = [
    'CIVEL',
    'TRABALHISTA',
    'TRIBUTARIO',
    'CRIMINAL',
    'FAMILIA',
    'EMPRESARIAL',
    'ADMINISTRATIVO',
  ];

  const subAreas: Record<string, string[]> = {
    CIVEL: ['Contratos', 'Responsabilidade Civil', 'Propriedade', 'Obrigações'],
    TRABALHISTA: ['Rescisão', 'Horas Extras', 'FGTS', 'Acidente de Trabalho'],
    TRIBUTARIO: ['ICMS', 'ISS', 'IRPF', 'IRPJ'],
    CRIMINAL: ['Furto', 'Estelionato', 'Lesão Corporal', 'Ameaça'],
    FAMILIA: ['Divórcio', 'Guarda', 'Alimentos', 'Inventário'],
    EMPRESARIAL: ['Sociedades', 'Falência', 'Recuperação', 'Fusão'],
    ADMINISTRATIVO: ['Licitações', 'Concessões', 'Serviços Públicos', 'Ato Administrativo'],
  };

  const statuses: Array<
    'EM_ANDAMENTO' | 'AGUARDANDO_AUDIENCIA' | 'CONCLUSO_PARA_SENTENCA' | 'ARQUIVADO' | 'SUSPENSO' | 'RECURSO' | 'FAVORAVEL' | 'PRAZO_EM_ABERTO'
  > = [
    'EM_ANDAMENTO',
    'AGUARDANDO_AUDIENCIA',
    'CONCLUSO_PARA_SENTENCA',
    'ARQUIVADO',
    'SUSPENSO',
    'RECURSO',
    'FAVORAVEL',
    'PRAZO_EM_ABERTO',
  ];

  const priorities: Array<'BAIXA' | 'NORMAL' | 'URGENTE'> = ['BAIXA', 'NORMAL', 'URGENTE'];

  const courts = [
    '1ª Vara Cível',
    '2ª Vara Cível',
    '1ª Vara do Trabalho',
    '2ª Vara do Trabalho',
    'Vara Federal',
    'Vara de Família',
    'Vara Criminal',
  ];

  const comarcas = ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'];

  const processes = [];
  for (let i = 0; i < 40; i++) {
    const lawArea = lawAreas[Math.floor(Math.random() * lawAreas.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const responsibleUser = users.filter((u) => u.role !== 'ASSISTENTE')[Math.floor(Math.random() * (users.length - 1))];
    const createdAt = randomDate(180);
    const lastUpdate = randomDate(30);

    const process = await prisma.process.create({
      data: {
        processNumber: generateProcessNumber(i),
        referenceNumber: Math.random() > 0.5 ? `REF-${Math.floor(Math.random() * 10000)}` : null,
        clientId: client.id,
        responsibleUserId: responsibleUser.id,
        lawArea,
        subArea: subAreas[lawArea][Math.floor(Math.random() * subAreas[lawArea].length)],
        status,
        priority,
        title: processTitles[Math.floor(Math.random() * processTitles.length)],
        description: `Processo relacionado a ${lawArea.toLowerCase()} envolvendo ${client.name}.`,
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 500000) + 10000 : null,
        court: Math.random() > 0.2 ? courts[Math.floor(Math.random() * courts.length)] : null,
        comarca: Math.random() > 0.2 ? comarcas[Math.floor(Math.random() * comarcas.length)] : null,
        lastUpdate,
        createdAt,
      },
    });
    processes.push(process);
  }

  console.log(`✅ ${processes.length} processos criados\n`);

  // Criar eventos
  console.log('📅 Criando eventos...');
  const eventTypes = ['AUDIENCIA', 'PRAZO', 'SENTENCA', 'PETICAO', 'INTIMACAO', 'DECISAO'];
  const eventTitles: Record<string, string[]> = {
    AUDIENCIA: ['Audiência de Conciliação', 'Audiência de Instrução', 'Audiência de Justificação', 'Audiência Inicial'],
    PRAZO: ['Prazo para Manifestação', 'Prazo para Recurso', 'Prazo para Contestação', 'Prazo para Prova'],
    SENTENCA: ['Sentença Proferida', 'Sentença Publicada', 'Sentença Transitada em Julgado'],
    PETICAO: ['Petição Inicial', 'Petição de Recurso', 'Petição de Impugnação'],
    INTIMACAO: ['Intimação para Manifestação', 'Intimação para Audiência', 'Intimação de Sentença'],
    DECISAO: ['Decisão Interlocutória', 'Decisão de Recurso', 'Decisão de Agravo'],
  };

  const eventDescriptions: Record<string, string> = {
    AUDIENCIA: 'Audiência marcada para instrução e julgamento do processo.',
    PRAZO: 'Prazo estabelecido para manifestação das partes.',
    SENTENCA: 'Sentença proferida pelo magistrado.',
    PETICAO: 'Petição protocolada no processo.',
    INTIMACAO: 'Intimação realizada para conhecimento das partes.',
    DECISAO: 'Decisão proferida no processo.',
  };

  let eventCount = 0;
  for (const process of processes) {
    // Criar 2-5 eventos por processo
    const numEvents = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numEvents; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const isFuture = Math.random() > 0.6;
      const eventDate = isFuture ? randomFutureDate(60) : randomDate(90);

      await prisma.event.create({
        data: {
          processId: process.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          title: eventTitles[eventType][Math.floor(Math.random() * eventTitles[eventType].length)],
          description: eventDescriptions[eventType],
          date: eventDate,
          type: eventType,
        },
      });
      eventCount++;
    }
  }

  console.log(`✅ ${eventCount} eventos criados\n`);

  // Criar documentos
  console.log('📄 Criando documentos...');
  const documentTypes = [
    { fileName: 'Petição Inicial.pdf', mimeType: 'application/pdf', description: 'Petição inicial do processo' },
    { fileName: 'Contrato.pdf', mimeType: 'application/pdf', description: 'Contrato relacionado ao processo' },
    { fileName: 'Procuração.pdf', mimeType: 'application/pdf', description: 'Procuração do cliente' },
    { fileName: 'RG e CPF.pdf', mimeType: 'application/pdf', description: 'Documentos de identificação' },
    { fileName: 'Comprovante.pdf', mimeType: 'application/pdf', description: 'Comprovante de pagamento' },
    { fileName: 'Laudo Técnico.pdf', mimeType: 'application/pdf', description: 'Laudo técnico pericial' },
    { fileName: 'Sentença.pdf', mimeType: 'application/pdf', description: 'Sentença do processo' },
    { fileName: 'Recurso.pdf', mimeType: 'application/pdf', description: 'Recurso protocolado' },
  ];

  let documentCount = 0;
  for (const process of processes.slice(0, 30)) {
    // Criar 1-3 documentos por processo
    const numDocs = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numDocs; i++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      await prisma.document.create({
        data: {
          processId: process.id,
          clientId: process.clientId,
          userId: users[Math.floor(Math.random() * users.length)].id,
          fileName: docType.fileName,
          filePath: `/documents/${process.id}/${docType.fileName}`,
          fileSize: Math.floor(Math.random() * 5000000) + 100000,
          mimeType: docType.mimeType,
          description: docType.description,
        },
      });
      documentCount++;
    }
  }

  // Criar alguns documentos apenas para clientes (sem processo)
  for (const client of clients.slice(0, 5)) {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    await prisma.document.create({
      data: {
        clientId: client.id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        fileName: `Documento_${client.name.replace(/\s/g, '_')}.pdf`,
        filePath: `/documents/clients/${client.id}/${docType.fileName}`,
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
        mimeType: docType.mimeType,
        description: `Documento do cliente ${client.name}`,
      },
    });
    documentCount++;
  }

  console.log(`✅ ${documentCount} documentos criados\n`);

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - ${users.length} usuários`);
  console.log(`   - ${clients.length} clientes`);
  console.log(`   - ${monitoringData.length} monitoramentos`);
  console.log(`   - ${processes.length} processos`);
  console.log(`   - ${eventCount} eventos`);
  console.log(`   - ${documentCount} documentos`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
