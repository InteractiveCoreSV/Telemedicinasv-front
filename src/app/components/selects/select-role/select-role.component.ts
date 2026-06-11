import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// import { RoleI } from '../../interfaces/role.interface';

import { FormGroup } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { RoleI } from 'src/app/auth/interfaces/role.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styles: [
  ]
})
export class SelectRoleComponent implements OnInit {

  roles:RoleI[] = [];

  @Input()roleSelected!:string | null;

  @Input()formGroup! :FormGroup;
  @Input()formControlNameRole! :string;
  @Input()classSelect! :string;

  @Output()roleChange:EventEmitter<string | null> = new EventEmitter<string | null>();
  @Output() changeRoleObject:EventEmitter<RoleI | null> = new EventEmitter<RoleI | null>();

  constructor(
    private rolesService: RolesService,
    private alertsService: AlertsService

    ) { }

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles(){

    this.rolesService.getAllRoles().subscribe({
      next:(res:any)=>{
        this.roles = res.roles;
      },
      error:(e)=>{
        this.alertsService.toastMixin(e['error']['message'],'error');
      }
    })
  }

  selectRole(){

    if(this.formGroup){
      this.formGroup.get(this.formControlNameRole)?.setValue(this.roleSelected)
    }

    const roleObject = this.roles.find((emp)=>emp._id == this.roleSelected);
    this.changeRoleObject.emit(roleObject ?? null)

    this.roleChange.emit(this.roleSelected);
  }

  cleanSelect(){
    this.roleSelected = null;
    this.roleChange.emit(null);
  }
}
