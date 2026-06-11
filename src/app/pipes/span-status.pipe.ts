import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'spanStatus'
})
export class SpanStatusPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(status: boolean | string | undefined, classes?: string): SafeHtml {
    const html = status
      ? `<span class="badge badge-success ${classes || ''}">Activo</span>`
      : `<span class="badge badge-danger ${classes || ''}">Desactivado</span>`;

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
