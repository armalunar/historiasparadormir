# Guia de Deploy no Vercel - Contos para Dormir

Este guia detalha como fazer o deploy do projeto "Contos para Dormir" no Vercel.

## Pré-requisitos

- Conta no GitHub
- Conta no Vercel
- Projeto Firebase configurado com Firestore e Storage

## Passo 1: Conectar Replit ao GitHub

1. No Replit, clique no ícone do Git na barra lateral esquerda
2. Clique em "Create a Git repository"
3. Conecte sua conta do GitHub quando solicitado
4. Digite um nome para o repositório (ex: `contos-para-dormir`)
5. Clique em "Create repository"

## Passo 2: Enviar Código para o GitHub

1. No terminal do Replit, execute:
```bash
git add .
git commit -m "Initial commit - Contos para Dormir complete"
git push
```

2. Verifique no GitHub se todos os arquivos foram enviados

## Passo 3: Criar Projeto no Vercel

### Opção A: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `contos-para-dormir`
5. Configure as variáveis de ambiente (veja seção abaixo)
6. Clique em "Deploy"

### Opção B: Via Console do Replit

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login no Vercel:
```bash
vercel login
```

3. Navegue até o diretório do projeto e execute:
```bash
vercel
```

4. Siga as instruções na tela

## Passo 4: Configurar Variáveis de Ambiente

No painel do Vercel, adicione as seguintes variáveis de ambiente:

```
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
VITE_FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

**Importante:** Todas as variáveis devem começar com `VITE_` para serem acessíveis no frontend.

## Passo 5: Deploy via Linha de Comando

Para fazer deploy direto do terminal:

```bash
vercel --prod
```

Ou configurar deploy automático:

```bash
vercel --prod --yes
```

## Passo 6: Configurar Regras do Firebase Storage

Para permitir URLs públicas de imagens e músicas:

1. Acesse o Firebase Console
2. Vá em Storage > Rules
3. Configure as regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir leitura pública de imagens de capas
    match /covers/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Apenas via admin SDK
    }
    
    // Permitir leitura pública de músicas
    match /music/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Apenas via admin SDK
    }
  }
}
```

## Passo 7: Gerar Links Públicos do Firebase Storage

### Para Capas de Histórias

1. Faça upload da imagem no Firebase Console > Storage
2. Clique na imagem
3. Copie a "Download URL"
4. Use essa URL no campo `coverImageUrl` ao criar histórias

### Para Músicas MP3

1. Faça upload do arquivo MP3 no Firebase Console > Storage
2. Clique no arquivo
3. Copie a "Download URL"
4. Crie um documento na coleção `music` no Firestore:

```javascript
{
  name: "Nome da Música",
  url: "https://firebasestorage.googleapis.com/...",
  uploadedAt: Date.now()
}
```

## Resolver Erros Comuns

### Erro: "Module not found"

**Solução:** Verifique se todas as dependências estão no `package.json`:
```bash
npm install
vercel --prod
```

### Erro: "Environment variables not defined"

**Solução:** Verifique se todas as variáveis `VITE_*` estão configuradas no Vercel:
1. Vá em Settings > Environment Variables
2. Adicione todas as variáveis do Firebase
3. Faça um novo deploy

### Erro: "Firebase initialization failed"

**Solução:** Verifique se as credenciais do Firebase estão corretas:
1. Confira no Firebase Console > Project Settings
2. Verifique se as variáveis no Vercel estão exatamente iguais
3. Faça rebuild do projeto

### Erro: "CORS policy blocked"

**Solução:** Configure CORS no Firebase:
1. Acesse Firebase Console > Storage
2. Configure as regras de CORS conforme documentação

### Build falha com "TypeScript errors"

**Solução:**
```bash
npm run build
```
Corrija os erros do TypeScript localmente antes de fazer deploy.

## Configurar Domínio Personalizado

1. No painel do Vercel, vá em Settings > Domains
2. Clique em "Add Domain"
3. Digite seu domínio (ex: `contosparadormir.com`)
4. Siga as instruções para configurar DNS
5. Aguarde propagação (pode levar até 48h)

## Comandos Úteis

```bash
# Ver status do projeto
vercel ls

# Ver logs em tempo real
vercel logs

# Remover projeto
vercel remove nome-do-projeto

# Fazer deploy de branch específica
vercel --prod --branch main
```

## Monitoramento

Após o deploy:

1. Acesse a URL fornecida pelo Vercel
2. Teste todas as funcionalidades
3. Verifique o console do navegador para erros
4. Teste em diferentes dispositivos (mobile, tablet, desktop)

## Próximos Passos

- Configure analytics no Firebase
- Habilite monitoramento de erros
- Configure backups do Firestore
- Implemente CDN para assets estáticos
- Configure certificado SSL (automático no Vercel)

## Suporte

Para problemas específicos:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Firebase: [firebase.google.com/docs](https://firebase.google.com/docs)

---

**Nota:** Este projeto usa Vite + React + Firebase. O build é otimizado automaticamente pelo Vercel.
