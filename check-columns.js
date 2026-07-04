import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB = new sqlite3.Database(join(__dirname, 'du_system.db'));

DB.serialize(() => {
  DB.all("PRAGMA table_info(contas)", (err, rows) => {
    if (err) {
      console.error('Erro:', err);
      return;
    }
    console.log('Colunas da tabela contas:');
    console.log('='.repeat(60));
    rows.forEach(row => {
      console.log(`${row.cid} - ${row.name} (${row.type})`);
    });
    console.log('='.repeat(60));
    
    console.log('\nVerificando quais colunas estão faltando...');
    const existingCols = rows.map(row => row.name);
    const requiredCols = [
      'conta_numero', 'contablista', 'quantidade_adicoes', 'cambio_usd',
      'cod_regime', 'cambio_moeda', 'estancia', 'peso_bruto',
      'fiscalizacao_porto', 'peso_liquido', 'aeroporto', 'soma',
      'numero_volume', 'cod_volume', 'seguro', 'importador_nif',
      'importador_morada', 'importador_ine', 'exportador_nome',
      'exportador_cod', 'exportador_ine', 'exportador_morada',
      'meio_transporte', 'nacionalidade', 'data_chegada',
      'porto_entrada_saida', 'posto_fronteirico', 'garantia_nr',
      'montante_garantia', 'metodo_avaliacao', 'forma_pagamento',
      'detalhes_banco', 'descricao', 'local_embarque',
      'pais_procedencia', 'pais_destino', 'data_du'
    ];
    
    const missingCols = requiredCols.filter(col => !existingCols.includes(col));
    
    if (missingCols.length > 0) {
      console.log('\nColunas faltando:');
      missingCols.forEach(col => console.log(`- ${col}`));
    } else {
      console.log('\nTodas as colunas estão presentes!');
    }
    
    DB.close();
  });
});