import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-register-info',
  templateUrl: './register-info.component.html',
  styles: [
  ]
})
export class RegisterInfoComponent implements OnInit {

  constructor(
    private changeDetectorRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    $('body').on('Show.bs.modal', '#registerInfo', () => {
      this.changeDetectorRef.detectChanges();
    });
  }

}
