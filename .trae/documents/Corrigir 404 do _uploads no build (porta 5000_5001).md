## Causa raiz (por que só falha em produção)
- Em produção o backend Express é importado e executado dentro do processo principal do Electron ([src/main/index.js](file:///c:/projetos/siproa-sistem-desktop/src/main/index.js)), e o build do Electron-Vite empacota/bundla o código.
- O `GET http://localhost:5000/uploads/<arquivo>` dá 404 porque **o diretório usado para salvar** e **o diretório usado para servir** não são o mesmo no app empacotado:
  - O multer salva em `path.resolve("server/uploads")` (depende do `process.cwd()`) em [upload.js](file:///c:/projetos/siproa-sistem-desktop/server/middlewares/upload.js).
  - O Express serve `/uploads` a partir de `path.join(__dirname, "uploads")` em [server/index.js](file:///c:/projetos/siproa-sistem-desktop/server/index.js). No build, `__dirname` tende a virar algo como `.../out/main` (ou recursos do app), então ele procura `.../out/main/uploads`.
- Resultado: o arquivo é salvo num lugar e o static procura em outro → 404.

## Correção proposta (robusta para Electron)
### 1) Definir um diretório de uploads gravável e único no runtime (produção)
- No Electron (produção), definir `process.env.SIPROA_UPLOAD_DIR` para um caminho gravável: `app.getPath("userData") + "/uploads"`.
- Isso evita tentar gravar dentro do diretório do app/asar (que pode ser somente leitura).

### 2) Garantir que Express e multer usem exatamente o mesmo diretório
- Alterar [server/middlewares/upload.js](file:///c:/projetos/siproa-sistem-desktop/server/middlewares/upload.js) para usar:
  - `const uploadDir = process.env.SIPROA_UPLOAD_DIR || path.resolve("server/uploads")`
  - criar o diretório se não existir.
- Alterar [server/index.js](file:///c:/projetos/siproa-sistem-desktop/server/index.js) para servir `/uploads` a partir do mesmo `uploadDir` (evitando `__dirname + "uploads"`).
- Alterar [server/dev/index.js](file:///c:/projetos/siproa-sistem-desktop/server/dev/index.js) para também servir `/uploads` usando o mesmo `uploadDir` (mantém compatibilidade e elimina divergência).

### 3) Ajustar o start do backend no Electron para aplicar env antes de importar o Server
- Em [src/main/index.js](file:///c:/projetos/siproa-sistem-desktop/src/main/index.js), trocar o import estático do `Server` por import dinâmico dentro do `startServer()`.
- Fluxo:
  - `app.whenReady()` → define `SIPROA_UPLOAD_DIR` → `await startServer()` → abre janela.

### 4) (Relacionado) Ajustar automaticamente o endpoint do backend entre dev/prod
- Hoje o renderer está hardcoded em 5001 em [appEnv.js](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/env/appEnv.js).
- Vou ajustar para:
  - `file:` (produção) → `http://localhost:5000`
  - `http:` (dev Vite) → `http://localhost:5001`
- Isso elimina confusão e garante que em produção tudo aponte para 5000.

## Validação
- Em produção (build):
  - Fazer upload de um logo (POST `/savelogo`).
  - Conferir que o arquivo foi salvo no diretório `userData/uploads`.
  - Confirmar que `GET http://localhost:5000/uploads/<arquivo>` retorna 200.
  - Confirmar que o frontend renderiza o logo sem 404.
- Em dev:
  - Manter servidor em 5001 e confirmar que `/uploads/...` continua funcionando.

## Arquivos que serão modificados
- [src/main/index.js](file:///c:/projetos/siproa-sistem-desktop/src/main/index.js)
- [server/index.js](file:///c:/projetos/siproa-sistem-desktop/server/index.js)
- [server/dev/index.js](file:///c:/projetos/siproa-sistem-desktop/server/dev/index.js)
- [server/middlewares/upload.js](file:///c:/projetos/siproa-sistem-desktop/server/middlewares/upload.js)
- [src/renderer/src/env/appEnv.js](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/env/appEnv.js)
