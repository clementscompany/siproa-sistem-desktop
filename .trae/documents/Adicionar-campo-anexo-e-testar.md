## Problema

* O formulário (modal) de Arquivos não tem um campo/área para anexar documentos (upload) durante edição.

* O modal de confirmação do envio do anexo está ficando por trás do modal do formulário (problema de z-index/stacking entre o `Alert` e o `Dialog` do MUI).

## Ajustes no Frontend

* **Adicionar seção “Anexos” dentro do formulário** em [FormArquivo.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormArquivo.jsx):

  * Exibir a seção **somente quando** **`arquivoId`** **existir** (ou seja, em edição).

  * Para “Novo Arquivo”, mostrar texto “Salve primeiro para anexar documentos”.

  * Listar anexos já enviados e permitir **Download** e **Excluir**.

  * Botão **Upload** com `<input type="file">` (mesmo endpoint já existente).

* **Modal de confirmação do upload**:

  * Ao selecionar um arquivo, abrir um modal de confirmação antes de enviar.

  * Implementar este modal usando **MUI** **`Dialog`** com `sx={{ zIndex: (theme) => theme.zIndex.modal + 10 }}` para garantir que fique **acima** do modal do formulário.

  * Após confirmar, executar o upload e atualizar a lista de anexos.

* **Download no formulário**:

  * Reutilizar a mesma lógica de download já usada em [ArquivoDetailsView.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/arquivos/ArquivoDetailsView.jsx) (Blob + `a.download`).

## Ajuste de Camada (opcional/extra)

* Se necessário para manter consistência no app inteiro, ajustar o `z-index` global do componente [Alert](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/Alert/style.css) para ficar acima dos `Dialog` do MUI (ex.: `z-index: 2000`).

  * Eu vou priorizar o **Dialog de confirmação do upload** para não impactar outros alertas.

## Testes (antes de validar)

* Rodar novamente os testes do backend para garantir que nada quebre:

  * `node --test server/tests`

* Validar manualmente no app:

  * Editar Arquivo → Upload → confirmar → anexo aparece na lista.

  * Download do anexo.

  * Excluir anexo.

  * Confirmar que o modal de confirmação fica por cima do modal do formulário.

