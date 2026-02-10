## Diagnóstico
- A logo vem do backend como caminho relativo `/uploads/...` (gravado assim no banco) e o frontend monta a URL `http://localhost:5001/uploads/...`.
- Na exportação para PDF (html2canvas/html2pdf), a imagem só entra no canvas se a resposta da imagem tiver CORS ok (ex.: `Access-Control-Allow-Origin`).
- Hoje o backend registra `express.static('/uploads', ...)` antes do `cors()` em:
  - [server/index.js](file:///c:/projetos/siproa-sistem-desktop/server/index.js#L14-L25)
  - [server/dev/index.js](file:///c:/projetos/siproa-sistem-desktop/server/dev/index.js#L15-L26)
  Isso faz o `/uploads/...` frequentemente ser servido sem headers CORS, e o PDF sai sem a logo.

## Correção (backend)
- Reordenar middlewares para aplicar CORS antes do static de uploads.
- Além disso, garantir CORS explicitamente no static de `/uploads` via `setHeaders` (para não depender da ordem).

## Robustez (frontend)
- Ajustar a montagem da URL no [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx) para também prefixar `appEnv.server` quando o caminho vier como `uploads/...` (sem barra inicial), evitando falhas caso o backend salve o path sem `/`.

## Verificação
- Abrir a tela de exportação e confirmar no DevTools que a request `GET /uploads/...` responde com `Access-Control-Allow-Origin: *`.
- Exportar PDF e validar que a logo aparece (e o restante do conteúdo mantém-se igual).