import { createConnection } from 'mysql2/promise';
import * as fs from 'fs';
import { getCurrentDatabaseName, generateTableCreationCode } from './generate_table';
import { program } from 'commander';
import { envconfig } from '../src/lib/envconfig';

function getImportFile(prefix: string) {
  if (!prefix) return './src/generated/tables.ts';
  return `./src/generated/${prefix}_tables.ts`;
}

function getTableFolder(prefix: string) {
  if (!prefix) return './src/generated/tables/';
  return `./src/generated/${prefix}_tables/`;
}

function generateCombinedTableImportFile(prefix: string): void {
  const tables = listGeneratedTable(prefix);
  const finalPrefix = prefix ? `${prefix}_` : '';

  const generatedCode = tables
    .sort()
    .map(x => `export * from './${finalPrefix}tables/table_${x}';`)
    .join('\n');

  fs.writeFileSync(getImportFile(prefix), generatedCode + '\n');
}

function listGeneratedTable(prefix: string): string[] {
  return fs.readdirSync(getTableFolder(prefix)).map(x => x.substring(0, x.length - 3).substring(6));
}

async function add(tableName: string, connection: string, prefix: string): Promise<void> {
  const conn = await createConnection(connection);
  const databaseName = await getCurrentDatabaseName(conn);
  const generatedCode = await generateTableCreationCode(conn, databaseName, tableName, prefix);

  const finalPrefix = prefix ? `${prefix}_` : '';
  fs.writeFileSync(getTableFolder(prefix) + `table_${finalPrefix}${tableName}.ts`, generatedCode);
  generateCombinedTableImportFile(prefix);
}

program.description('Generating table typescript');
program
  .command('add')
  .argument('<table_name>', 'Table name')
  .option('--social', 'Using social database')
  .action((tableName: string, options: { social: boolean }) => {
    let connection = envconfig.db;
    let prefix = '';
    if (options.social) {
      connection = envconfig.db;
      prefix = 'social';
    }

    add(tableName, connection || '', prefix)
      .then(() => process.exit(0))
      .catch(e => {
        console.error('Error:', e);
        process.exit(1);
      });
  });

program.parse();