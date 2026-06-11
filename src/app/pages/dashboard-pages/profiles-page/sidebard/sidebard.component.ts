import { Component, Input, OnInit } from '@angular/core';
import { UserI } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-sidebard',
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.scss']
})
export class SidebardComponent implements OnInit {

  @Input() userInfo!:UserI

  constructor() { }

  ngOnInit(): void {
  }

}
