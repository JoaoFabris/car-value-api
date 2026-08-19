import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    // Apaga o banco de testes antes de cada suite de teste rodar
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {
    // Silencia o erro caso o arquivo test.sqlite ainda não exista
  }
});
