import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import pngToIco from "png-to-ico";

async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

async function main() {
  const thisFilePath = fileURLToPath(import.meta.url);
  const projectRoot = resolve(dirname(thisFilePath), "..");
  const pngPath = resolve(projectRoot, "resources", "icon.png");
  const buildDir = resolve(projectRoot, "build");
  const icoPath = resolve(buildDir, "icon.ico");

  await ensureDir(buildDir);

  try {
    const pngBuffer = await readFile(pngPath);
    const icoBuffer = await pngToIco(pngBuffer);
    await writeFile(icoPath, icoBuffer);
    console.log("Ícone .ico gerado em:", icoPath);
  } catch (err) {
    console.error("Falha ao gerar .ico a partir de resources/icon.png:", err);
    process.exitCode = 1;
  }
}

main();
