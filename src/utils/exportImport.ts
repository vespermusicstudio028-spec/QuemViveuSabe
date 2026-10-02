import { PublicationItem } from '../types/publication';

export function exportToJson(items: PublicationItem[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const now = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `quem-viveu-sabe-publicacoes-${now}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportToCsv(items: PublicationItem[]): void {
  const headers = ['Número', 'Título', 'Status', 'Categoria', 'Data Agendada', 'Horário', 'Data Publicada', 'Link Vídeo', 'Link Facebook', 'Notas'];
  
  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map(item => [
    item.id,
    escapeCsv(item.title),
    escapeCsv(item.status),
    escapeCsv(item.category),
    escapeCsv(item.scheduledDate),
    escapeCsv(item.scheduledTime),
    escapeCsv(item.publishedDate),
    escapeCsv(item.videoUrl),
    escapeCsv(item.facebookUrl),
    escapeCsv(item.notes)
  ].join(';')); // Using semicolon for standard PT-BR Excel compatibility

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  const now = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `quem-viveu-sabe-publicacoes-${now}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

export function parseJsonFile(file: File): Promise<PublicationItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          resolve(parsed);
        } else {
          reject(new Error('O arquivo JSON não contém uma lista válida.'));
        }
      } catch (err) {
        reject(new Error('Erro ao processar arquivo JSON: arquivo inválido.'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsText(file);
  });
}
