import { PublicationItem, PublicationCategory } from '../types/publication';

function detectCategory(title: string): PublicationCategory {
  const lower = title.toLowerCase();
  if (lower.includes('maratona')) return 'maratona';
  if (lower.includes('filme') || lower.includes('(19') || lower.includes('(20') || lower.includes('rambo') || lower.includes('mortal kombat')) {
    return 'filme';
  }
  if (lower.includes('mr. bean') || lower.includes('zorro') || lower.includes('police story')) {
    return 'serie';
  }
  if (
    lower.includes('juniper') ||
    lower.includes('corrida maluca') ||
    lower.includes('speed racer') ||
    lower.includes('flintstones') ||
    lower.includes('jackie chan') ||
    lower.includes('he-man') ||
    lower.includes('gulliver') ||
    lower.includes('dragão') ||
    lower.includes('popeye') ||
    lower.includes('x-men') ||
    lower.includes('desenhos') ||
    lower.includes('cowboys') ||
    lower.includes('thundercats') ||
    lower.includes('pinky') ||
    lower.includes('johnny') ||
    lower.includes('mônica') ||
    lower.includes('hércules')
  ) {
    return 'desenho';
  }
  return 'outro';
}

const rawList: Record<number, string> = {
  1: "A vida e as aventuras de Juniper Lee: Episódio 1",
  2: "A Vida e as Aventuras de Juniper Lee: Episódio 2",
  3: "Corrida Maluca",
  4: "Speed Racer",
  5: "Os Flintstones",
  6: "As Aventuras de Jackie Chan",
  7: "As Aventuras de Charlie Chan",
  8: "He-Man e os Mestres do Universo",
  9: "As Aventuras de Gulliver",
  10: "filme Double Dragon (1994)",
  11: "filme Te Pego Lá Fora (1987)",
  12: "Rambo",
  13: "filme JET LI EM: HITMAN – O REI DOS ASSASSINOS",
  14: "filme ZORRO – A NOVA ORDEM (1958)",
  15: "MORTAL KOMBAT (1996)",
  16: "filme TIMEcop: O GUARDIÃO DO TEMPO",
  17: "filme BATER OU CORRER",
  18: "CAVERNA DO DRAGÃO",
  19: "CIDADE SECRETA EM CHAMAS — JET LI",
  20: "POPEYE CLÁSSICO — EPISÓDIOS ANTIGOS COMPLETOS!",
  21: "POLICE STORY: A GUERRA DAS DROGAS",
  22: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 1",
  23: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 2",
  24: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 3",
  25: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 4",
  26: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 5",
  27: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 6",
  28: "X-MEN — EPISÓDIO 01: A NOITE DAS SENTINELAS – PARTE 7",
  29: "X-MEN — EPISÓDIO 02: A NOITE DAS SENTINELAS – PARTE 2",
  30: "X-MEN — EPISÓDIO 02: A NOITE DAS SENTINELAS – PARTE 2",
  31: "X-MEN — EPISÓDIO 02: A NOITE DAS SENTINELAS – PARTE 2",
  32: "FILME: O GRANDE DESAFIO",
  33: "filme MOTOQUEIRO FANTASMA",
  34: "COVIL DE LADRÕES (2018)",
  35: "filme BATMAN (1966) — SEM CONTEXTO!",
  36: "filme OS CONDENADOS (2007)",
  37: "filme TRINITY É O MEU NOME (1970)",
  38: "filme ESPORTE SANGRENTO (1993)",
  39: "filme MIRA DE AÇO: CAÇADA AO LADRÃO",
  40: "DESENHOS CLÁSSICOS DOS ANOS 80, 90 E 2000! (Tarzan e os vikings)",
  41: "OS VALENTES COWBOYS DE MOO MESA",
  42: "THUNDERCATS",
  43: "O BATMAN — MARATONA ESPECIAL: DIA DO BATMAN",
  44: "PINKY E O CÉREBRO",
  45: "JOHNNY BRAVO",
  46: "MR. BEAN — MR. BEAN VIRA MOTORISTA DE TÁXI!",
  47: "MARATONA CEBOLINHA E CASCÃO | TURMA DA MÔNICA",
  48: "MR. BEAN — CONFUSÃO NA ENFERMAGEM!",
  49: "HÉRCULES (1995) - GOODTIMES",
};

export const INITIAL_PUBLICATIONS: PublicationItem[] = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const rawTitle = rawList[id];
  const title = rawTitle ? rawTitle.trim() : '';

  return {
    id,
    title,
    status: title ? 'draft' : 'draft',
    category: title ? detectCategory(title) : 'outro',
    scheduledDate: '',
    scheduledTime: '',
    publishedDate: '',
    videoUrl: '',
    facebookUrl: '',
    caption: '',
    notes: '',
    tags: title ? ['nostalgia', 'anos80-90-2000'] : [],
    updatedAt: new Date().toISOString(),
  };
});
