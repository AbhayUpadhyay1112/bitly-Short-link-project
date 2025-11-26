const fs = require('fs');
const path = require('path');
const db = require('../db');

async function run() {
  const filePath = path.join(__dirname, '..', 'migrations', 'create_links_table.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  try {
    await db.query(sql);
    console.log("Migration applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
