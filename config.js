// ============================================================
// js/config.js — CONFIGURAÇÃO DO SISTEMA
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCNtMhfANMu6A-WOWM7VPKmzp-sJ0Wy7Fo",
  authDomain:        "gestao-corporativa-4dfd4.firebaseapp.com",
  projectId:         "gestao-corporativa-4dfd4",
  storageBucket:     "gestao-corporativa-4dfd4.firebasestorage.app",
  messagingSenderId: "573936450148",
  appId:             "1:573936450148:web:54f89015f95dab4f2dbd71",
};

// ============================================================
// SISTEMA
// ============================================================
const SYSTEM_CONFIG = {
  nomeDoSistema: "Gestão Corporativa",
  subtitulo:     "Sistema de Equipes",
  versao:        "2.1.0",
};

// ============================================================
// TEMA PADRÃO
// ============================================================
const TEMA_PADRAO = {
  nome:          "Navy (Padrão)",
  primaria:      "#0a1f44",
  fundo:         "#EAECEF",
  sucesso:       "#006b54",
  destaque:      "#C5A059",
  erro:          "#ba1a1a",
  superficie:    "#ffffff",
  nomeDoSistema: "Gestão Corporativa",
  nomeEmpresa:   "",
  logoUrl:       null,
  epocaTema:     "nenhum",
};

const TEMAS_PRESET = [
  { nome:"Navy (Padrão)",    primaria:"#0a1f44", fundo:"#EAECEF", sucesso:"#006b54", destaque:"#C5A059", erro:"#ba1a1a", superficie:"#ffffff" },
  { nome:"Grafite Dark",     primaria:"#212121", fundo:"#F0F0F0", sucesso:"#2e7d32", destaque:"#FF8F00", erro:"#c62828", superficie:"#ffffff" },
  { nome:"Azul Corporativo", primaria:"#1565C0", fundo:"#E8EAF6", sucesso:"#00695C", destaque:"#E65100", erro:"#b71c1c", superficie:"#ffffff" },
  { nome:"Verde Executivo",  primaria:"#1B5E20", fundo:"#E8F5E9", sucesso:"#00838F", destaque:"#BF360C", erro:"#b71c1c", superficie:"#ffffff" },
  { nome:"Roxo Premium",     primaria:"#4A148C", fundo:"#EDE7F6", sucesso:"#00600F", destaque:"#E65100", erro:"#b71c1c", superficie:"#ffffff" },
];
