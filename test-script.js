import ProcessosModule from './server/database/models/Processos.module.js';

async function testCreateProcesso() {
  console.log('Testando criação de processo...');
  
  const testData = {
    cliente_nome: 'Cliente Teste',
    conta_numero: '1234',
    contablista: 'Contabilista Teste',
    status: 'aberta'
  };
  
  try {
    const result = await ProcessosModule.create(testData);
    console.log('Resultado:', result);
    console.log('✓ Sucesso!');
  } catch (e) {
    console.error('✗ Erro:', e);
  }
}

testCreateProcesso();