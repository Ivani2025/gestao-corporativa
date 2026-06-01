# 🏢 Gestão Corporativa — Sistema de Equipes v2.0

Sistema completo de gestão de equipes com múltiplas unidades, treinamentos e cargos.

---

## 📁 Estrutura de Arquivos

```
gestao-corporativa/
│
├── index.html              ← Abra este arquivo no navegador
│
├── css/
│   └── styles.css          ← Design system completo (Stitch)
│
├── js/
│   ├── config.js           ← ⚙️  Firebase + Cores padrão
│   ├── db.js               ← 🗄️  Banco de dados (localStorage)
│   ├── utils.js            ← 🔧  Utilitários, cargos, toast, modal
│   ├── auth.js             ← 🔐  Login e autenticação
│   ├── nav.js              ← 🧭  Navegação e roteador de páginas
│   ├── components.js       ← 🧩  Componentes reutilizáveis
│   ├── pages.js            ← 📄  Renderização de cada página
│   ├── modals.js           ← 🪟  Todos os modais do sistema
│   └── theme.js            ← 🎨  Painel de personalização de cores
│
└── README.md               ← Este arquivo
```

---

## 🚀 Como Usar

### Modo Demo (imediato, sem configuração)
1. Abra o arquivo `index.html` no navegador (duplo clique ou VS Code → Open with Live Server)
2. **Login:** `1234` | **Senha:** `1234`
3. Você entra como **Admin Geral** com acesso total

### Modo Produção (Firebase)
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto
3. Ative **Authentication → E-mail/Senha**
4. Ative **Firestore Database**
5. Vá em **Configurações → Seus apps → Adicionar app Web**
6. Copie as credenciais e cole em `js/config.js`

---

## 👥 Hierarquia de Cargos

| Cargo | Badge | Acesso |
|---|---|---|
| **Admin Geral** | Navy | Tudo — unidades, funcionários, treinamentos, configurações |
| **Gerente** | Azul | Sua unidade + equipe |
| **Sub-gerente** | Cinza | Sua unidade + equipe |
| **Adm Júnior** | Ouro | Cadastros |
| **Recruta** | Borda | Treinamentos |
| **Funcionário** | Borda | Treinamentos |
| **Jovem Aprendiz** | Verde | Treinamentos |

---

## 🎨 Painel de Personalização

Acesse: **Configurações → Tema & Cores** (no menu lateral)

Você pode alterar:
- ✅ Cor primária (navbar, botões)
- ✅ Cor do fundo da página
- ✅ Cor de sucesso (progresso)
- ✅ Cor de destaque (ouro)
- ✅ Cor de erro (alertas)
- ✅ Cor dos cards
- ✅ Nome do sistema
- ✅ 5 temas predefinidos prontos

---

## 📝 Como Adicionar Novas Funcionalidades

Cada arquivo tem uma responsabilidade clara:

- **Nova página?** → Adicione em `js/pages.js` + rota em `js/nav.js`
- **Novo modal?** → Adicione em `js/modals.js`
- **Novo componente?** → Adicione em `js/components.js`
- **Nova cor/tema?** → Edite `js/theme.js` e `js/config.js`
- **Novo dado no banco?** → Edite `js/db.js`

---

## ⚙️ Tecnologias

- **HTML5 + CSS3** puro, sem framework
- **JavaScript** vanilla (sem dependências)
- **Tailwind CSS** (via CDN, para utilitários)
- **Material Symbols** (ícones Google)
- **Design System:** Google Stitch (Navy #0a1f44)
- **Banco:** localStorage (→ Firebase quando configurado)

---

Desenvolvido com ❤️ usando Claude (Anthropic)
