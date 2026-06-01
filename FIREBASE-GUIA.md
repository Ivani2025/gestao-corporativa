# 🔥 Como Ativar o Banco de Dados em Nuvem (Firebase)

Sem Firebase, cada computador tem seu próprio banco separado.  
Com Firebase, **todos os computadores compartilham os mesmos dados**.

---

## Passo a Passo (gratuito, ~10 minutos)

### 1. Criar o Projeto Firebase

1. Acesse **[console.firebase.google.com](https://console.firebase.google.com)**
2. Clique em **"Criar um projeto"**
3. Dê um nome (ex: `gestao-corporativa`)
4. Desative o Google Analytics (opcional)
5. Clique **"Criar projeto"**

---

### 2. Criar o Banco de Dados (Firestore)

1. No menu lateral, clique em **"Firestore Database"**
2. Clique **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"** (pode mudar depois)
4. Clique **"Avançar"** → **"Criar"**

---

### 3. Pegar as Credenciais

1. Clique na **engrenagem ⚙** (canto superior esquerdo)
2. Vá em **"Configurações do projeto"**
3. Role até **"Seus apps"**
4. Clique no ícone **`</>`** (Web)
5. Dê um apelido (ex: `gestao-web`)
6. **NÃO** marque Firebase Hosting
7. Clique **"Registrar app"**
8. Copie os valores que aparecem — vai ser algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "gestao-corporativa.firebaseapp.com",
  projectId: "gestao-corporativa",
  storageBucket: "gestao-corporativa.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### 4. Colar no Sistema

Abra o arquivo **`js/config.js`** e substitua os valores:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",           // ← cole aqui
  authDomain:        "seu-projeto.firebaseapp.com",
  projectId:         "seu-projeto",
  storageBucket:     "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

### 5. Ativar o Firebase no Sistema

Abra **`js/db.js`** e mude a linha 12:

```javascript
// ANTES:
const USE_FIREBASE = false;

// DEPOIS:
const USE_FIREBASE = true;
```

---

### 6. Publicar no Vercel

1. Vá em **[vercel.com](https://vercel.com)** → seu projeto
2. Faça upload dos arquivos atualizados
3. O sistema vai conectar ao Firebase automaticamente

---

## ✅ Como saber se está funcionando

Quando o Firebase estiver ativo, ao abrir o site você verá a mensagem:
> **"Banco de dados em nuvem conectado ✓"**

Se aparecer erro, verifique se os valores em `config.js` estão corretos.

---

## 🔒 Regras de Segurança (depois de testar)

Quando o sistema estiver funcionando, vá em:
**Firestore → Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Isso mantém o banco aberto enquanto você desenvolve.  
Para produção real, adicione autenticação.

---

## 📞 Precisa de ajuda?

Mande uma mensagem para o Claude com os valores que o Firebase te deu e ele coloca no código pra você.
