# Guia do Voz Delas

Este guia explica como usar o **Voz Delas** no dia a dia da redação escolar, abrir o código no VS Code, guardar o projeto no GitHub e publicar a aplicação de forma compatível com a área de login, o banco de dados e o envio de arquivos.

> **Importante:** o jornal é público, mas o painel **Redação** é privado. Somente contas aprovadas como administradoras conseguem cadastrar, editar ou publicar conteúdos.

## 1. Como o site está organizado

O site público foi pensado para leitura no celular e no computador. A navegação contém as páginas **Início**, **Edições**, **Entrevistas**, **Galeria** e **Apoio**. As publicações só aparecem para a comunidade quando a redação seleciona a opção “Publicar para a comunidade”. Enquanto essa opção estiver desmarcada, o material permanece como rascunho no painel.

| Área | O que aparece | Quem pode editar |
| --- | --- | --- |
| Início | Apresentação do projeto, destaques e encaminhamentos de apoio. | Redação aprovada. |
| Edições | Jornais em PDF, com busca por título, edição ou tema. | Redação aprovada. |
| Entrevistas | Vídeos e textos/transcrições produzidos pelos estudantes. | Redação aprovada. |
| Galeria | Imagens e documentos da turma. | Redação aprovada. |
| Apoio | Informações educativas e links oficiais de acolhimento. | Alteração pelo código, se necessário. |
| Redação | Painel de cadastro, edição e publicação. | Somente administradoras e administradores. |

## 2. Primeiro acesso da redação

A pessoa responsável pelo projeto já entra como administradora. Para liberar outro integrante, a pessoa deve primeiro clicar em **Redação** e entrar com a própria conta. Em seguida, a pessoa responsável abre a tabela `users` no painel de banco de dados do projeto e altera o campo `role` daquela conta de `user` para `admin`. Depois de sair e entrar novamente, essa pessoa poderá usar o painel editorial.

Essa aprovação manual é intencional: fazer login não libera automaticamente a publicação. Assim, a equipe responsável mantém o controle sobre quem pode tornar materiais públicos.

| Situação da conta | Ação esperada |
| --- | --- |
| Ainda não fez login | Pedir que acesse **Redação** uma vez. |
| Fez login, mas vê a mensagem de aguardar aprovação | A responsável deve alterar `role` para `admin` na tabela `users`. |
| Já é `admin` | Pode cadastrar, editar, publicar e despublicar conteúdos. |

## 3. Publicar uma nova edição em PDF

Primeiro, abra **Redação** e escolha a aba **Galeria**. Envie o PDF pelo bloco “Enviar imagem ou PDF”. O arquivo fica guardado no armazenamento da aplicação e entra inicialmente como rascunho. Na lista “Materiais cadastrados”, clique em **Editar**, copie a URL do material e mantenha-a em um local temporário.

Depois, abra a aba **Edições**. Preencha título, identificação da edição, apresentação e cole a URL no campo **URL do PDF**. Marque “Publicar para a comunidade” apenas quando o material tiver sido revisado. Salve a edição. O PDF passará a aparecer na página pública **Edições**, onde visitantes podem pesquisá-lo e abri-lo.

> O envio aceita JPG, PNG, WEBP e PDF de até **10 MB**. Evite incluir dados pessoais desnecessários, especialmente em imagens, entrevistas ou documentos de estudantes.

## 4. Publicar textos, entrevistas e imagens

Na aba **Matérias**, a redação registra a autoria, a categoria, um resumo e o texto completo. É possível associar a matéria a uma edição já criada. Na aba **Entrevistas**, a equipe pode inserir título, pessoa entrevistada, apresentação, descrição, link público de vídeo e transcrição. O site reconhece links usuais do YouTube e Vimeo e incorpora o vídeo quando o serviço permitir.

Para imagens e documentos, a aba **Galeria** oferece dois caminhos. O primeiro é enviar o arquivo diretamente; o segundo é registrar uma URL já existente. Em ambos os casos, o item só será público após a marcação da caixa de publicação.

| Tipo de conteúdo | Informações mínimas | Onde inserir |
| --- | --- | --- |
| Edição | Título, identificação, apresentação e URL do PDF. | Redação → Edições. |
| Matéria | Título, autoria, categoria, resumo e texto completo. | Redação → Matérias. |
| Entrevista | Título, pessoa entrevistada, apresentação e descrição. | Redação → Entrevistas. |
| Vídeo | Link público de YouTube ou Vimeo; transcrição é recomendada. | Redação → Entrevistas. |
| Imagem/PDF | Título e arquivo ou URL. | Redação → Galeria. |

## 5. Revisar, publicar e retirar uma publicação do ar

Todo formulário contém a opção **“Publicar para a comunidade”**. Desmarque-a para voltar o conteúdo a rascunho. Nesse estado, o item continua disponível para a redação, mas deixa de aparecer nas páginas públicas. Essa medida é útil para corrigir nomes, revisar linguagem, trocar arquivos ou respeitar solicitações de retirada de conteúdo.

Antes de publicar, confira se a produção tem autorização de uso de imagem, se os nomes foram revisados, se não expõe uma pessoa em risco e se o título não trata a violência como espetáculo. A linguagem do jornal deve informar, acolher e apontar caminhos de proteção.

## 6. Abrir e executar no VS Code

Para editar o código localmente, baixe os arquivos do projeto pela área **Código** e abra a pasta no VS Code. Instale uma versão atual do Node.js e o gerenciador `pnpm`. No terminal integrado do VS Code, execute os comandos abaixo na pasta do projeto.

```bash
pnpm install
pnpm dev
```

O segundo comando inicia o ambiente local de desenvolvimento. Para verificar se o código está consistente antes de enviar alterações, use estes comandos.

```bash
pnpm check
pnpm test
pnpm build
```

O código foi estruturado como uma aplicação completa: React no site, servidor Node.js, banco de dados, autenticação e armazenamento. Por segurança, não copie nem envie arquivos de variáveis de ambiente, chaves de acesso ou tokens para o GitHub.

## 7. Versionar o projeto no GitHub

Crie um repositório vazio no GitHub, por exemplo `jornal-voz-delas`. Em seguida, no terminal do VS Code, execute os comandos abaixo, substituindo o endereço pelo endereço do seu repositório.

```bash
git init
git add .
git commit -m "Cria o site Voz Delas"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/jornal-voz-delas.git
git push -u origin main
```

Depois de cada conjunto de mudanças, registre uma nova versão. Esse hábito ajuda a recuperar o site caso alguma alteração cause problemas.

```bash
git add .
git commit -m "Atualiza a edição do jornal"
git push
```

## 8. Hospedagem gratuita: decisão correta para este projeto

O **GitHub Pages** hospeda arquivos estáticos — HTML, CSS e JavaScript — publicados a partir de um repositório. Por isso, ele é uma excelente escolha para um portfólio ou site institucional simples, mas não executa o servidor, o login, o banco de dados nem o armazenamento que este jornal utiliza.[1]

| Objetivo | Opção adequada | Observação |
| --- | --- | --- |
| Guardar o código gratuitamente | GitHub | Use para histórico, colaboração e cópia de segurança do projeto. |
| Publicar uma versão somente estática | GitHub Pages | Exigiria retirar ou separar a área de login, banco e painel editorial.[1] |
| Publicar o Voz Delas completo | Ambiente de aplicação com servidor, banco, autenticação e armazenamento | Mantenha a versão atual no ambiente de publicação da aplicação. |

Para publicar a versão completa que foi construída, crie primeiro um ponto de versão do projeto e então use o botão **Publish/Publicar** da interface do projeto. O código pode continuar sincronizado no GitHub para que a equipe use o VS Code e mantenha o histórico. Não é recomendável tentar colocar esta mesma aplicação completa no GitHub Pages: o painel deixaria de acessar as rotas do servidor e os recursos de login, publicação e envio de arquivos não funcionariam.

> Se a escola quiser usar outro provedor de aplicação, será necessário configurar servidor Node.js, banco de dados, armazenamento, autenticação e variáveis de ambiente nesse provedor. Essa é uma migração técnica diferente de ativar o GitHub Pages.

## 9. Boas práticas de acessibilidade e cuidado

O site possui navegação por teclado, atalho “Ir para o conteúdo principal”, foco visível, estrutura de títulos e layout responsivo. Ao adicionar conteúdos, preserve essas qualidades: escreva textos alternativos que descrevam as imagens, ofereça transcrição para cada entrevista em vídeo, use títulos claros e verifique se links indicam seu destino.

O conteúdo de apoio do jornal informa que o **Ligue 180** oferece orientação, informações sobre direitos e encaminhamento de denúncias 24 horas por dia; em uma situação de emergência ou risco imediato, a orientação oficial é acionar o **190**.[2] O jornal deve apresentar essas informações de modo responsável, sem substituir atendimento especializado.

## Referências

[1] [GitHub Docs — What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

[2] [Ministério das Mulheres — Ligue 180](https://www.gov.br/mulheres/pt-br/ligue180)
