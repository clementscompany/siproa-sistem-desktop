import fs from "fs";
import { DB } from "../../database/db.js";

/* =========================
   EXPORT BACKUP
========================= */
export async function exportBackup(req, res) {
  try {
    DB.all(
      `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
    `,
      async (err, tables) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Erro ao buscar tabelas",
          });
        }

        const backup = {};

        for (const table of tables) {
          const rows = await new Promise((resolve, reject) => {
            DB.all(`SELECT * FROM ${table.name}`, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });

          backup[table.name] = rows;
        }

        res.setHeader(
          "Content-Disposition",
          `attachment; filename=backup-${Date.now()}.json`,
        );
        res.setHeader("Content-Type", "application/json");

        return res.send(JSON.stringify(backup, null, 2));
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erro no export",
    });
  }
}

/* =========================
   IMPORT BACKUP
========================= */
export async function importBackup(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ficheiro não enviado",
      });
    }

    // 🔥 CORRETO: memoryStorage
    const backup = JSON.parse(req.file.buffer.toString("utf8"));

    await new Promise((resolve, reject) => {
      DB.serialize(() => {
        DB.run("BEGIN TRANSACTION");
        DB.run("PRAGMA foreign_keys = OFF");

        try {
          const tables = Object.keys(backup);

          for (const table of tables) {
            const rows = backup[table];

            if (!Array.isArray(rows)) continue;

            DB.run(`DELETE FROM ${table}`);

            if (rows.length === 0) continue;

            const columns = Object.keys(rows[0]);
            const placeholders = columns.map(() => "?").join(",");

            const stmt = DB.prepare(
              `INSERT INTO ${table} (${columns.join(",")}) VALUES (${placeholders})`,
            );

            for (const row of rows) {
              stmt.run(Object.values(row));
            }

            stmt.finalize();
          }

          DB.run("COMMIT");
          resolve();
        } catch (err) {
          DB.run("ROLLBACK");
          reject(err);
        }
      });
    });

    return res.json({
      success: true,
      message: "Backup restaurado com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erro ao importar backup",
      error: error.message,
    });
  }
}
