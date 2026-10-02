import { PublicationItem } from '../types/publication';

export type CopyStyle = 'nostalgia_padrao' | 'filme_cine' | 'desenho_infancia' | 'curto_direto';

export function generateFacebookCopy(item: PublicationItem, style: CopyStyle = 'nostalgia_padrao'): string {
  if (item.caption && item.caption.trim().length > 0) {
    return item.caption;
  }

  const title = item.title || `Publicação #${item.id}`;

  switch (style) {
    case 'filme_cine':
      return `🍿 CINE NOSTALGIA — QUEM VIVEU, SABE! 📼✨\n\nQue relíquia inesquecível do nosso passado:\n🎬 ${title}\n\nVocê lembra de ter assistido na TV ou em fita VHS? Quem assistiu nunca esquece!\n\nDeixe seu like e marque aquele amigo que via com você! 👇\n\n#QuemViveuSabe #CinemaNostalgia #Anos80 #Anos90 #Anos2000 #SessaoDaTarde #Classicos`;

    case 'desenho_infancia':
      return `📺 HORA DO DESENHO — QUEM VIVEU, SABE! ⚡\n\nAcordar cedo com um copo de achocolatado para assistir isso não tinha preço:\n✨ ${title}\n\nQuem lembra dessa abertura ou desse episódio marcante?\nComente aqui embaixo se você viveu essa época de ouro! 👇\n\n#QuemViveuSabe #DesenhosAntigos #NostalgiaPura #InfanciaFeliz #Anos80 #Anos90 #Anos2000`;

    case 'curto_direto':
      return `📺 QUEM VIVEU, SABE! ✨\n\n📼 ${title}\n\nQuem aqui assistia? Deixe sua curtida e comente! 👇\n\n#QuemViveuSabe #Nostalgia #Classicos`;

    case 'nostalgia_padrao':
    default:
      return `📺 QUEM VIVEU, SABE! ✨\n\nHoje é dia de matar a saudade dessa verdadeira joia:\n👉 ${title}\n\nQuem lembrava dessa maravilha? O coração até esquenta de nostalgia!\n\nCurta, compartilhe e conte nos comentários a sua melhor memória dessa época! 👇\n\n#QuemViveuSabe #Nostalgia #BonsTempos #Anos80 #Anos90 #Anos2000 #InfanciaNostalgica`;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
