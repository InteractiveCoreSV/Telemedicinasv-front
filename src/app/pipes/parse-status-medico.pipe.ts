import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseStatusMedico'
})
export class ParseStatusMedicoPipe implements PipeTransform {

  transform(status: string | undefined, select?: 'color' | 'text', classes?: string): string {
    const estados: Record<string, { text: string; color: string }> = {
      enLinea: { text: 'En línea', color: 'bg-in_line' },
      ausente: { text: 'Ausente', color: 'bg-ausente' },
      enConsulta: { text: 'En Consulta', color: 'bg-consulta' },
      desconectado: { text: 'Desconectado', color: 'bg-disconnected' } // <-- mejor clase que bg-inProgress
    };

    if (!status ) {
      status = 'desconectado';
    }
    const { text, color } = estados[status];

    switch (select) {
      case 'color':
        return `<span class="status-circle ${color} ${classes || ''}"></span>`;
      case 'text':
        return `<span class="mx-2">${text}</span>`;
      default:
        return `<span class="status-circle ${color} ${classes || ''}"></span> <span class="mx-2">${text}</span>`;
    }
  }

}
