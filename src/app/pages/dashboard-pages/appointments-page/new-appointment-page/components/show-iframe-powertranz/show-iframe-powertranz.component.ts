import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-iframe-powertranz',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './show-iframe-powertranz.component.html',
  styleUrls: ['./show-iframe-powertranz.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowIframePowertranzComponent implements OnInit, OnDestroy {

  @Input() iframeHtml!: SafeHtml;
  public showButton: boolean = false;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    window.addEventListener('message', this.handleIframeMessage);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleIframeMessage);
  }

  handleIframeMessage = (event: MessageEvent) => {
    if (event.data?.type === 'paymentSuccess') {
      setTimeout(() => {
        this.ngbActiveModal.dismiss({ paymentComplete: true });
      }, 4000);
    }

    if (event.data?.type === 'paymentSuccessWithMessage') {
      this.showButton = true;
      this.changeDetectorRef.detectChanges();
    }

    if (event.data?.type === 'paymentError') {
      setTimeout(() => {
        this.ngbActiveModal.dismiss({ paymentComplete: false });
      }, 3000);
    }
  };
}
