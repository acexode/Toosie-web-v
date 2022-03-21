import { AuthService } from './../../../../core/service/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import * as e from 'express';
// import { userListDB } from 'src/app/shared/tables/list-users';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public user_list = []

  constructor(private authS: AuthService) {
    this.user_list = [];
  }

  public settings = {
    actions: {
      edit: false,
      add: false,
      position: 'right'
  },
    delete: {
      confirmDelete: true,

      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    edit: {
      editButtonContent: `'<i class="fas fa-pencil-alt fa-fw"></i>'`,
      saveButtonContent: '<i class="fas fa-check fa-fw"></i>',
      cancelButtonContent: '<i class="fas fa-times fa-fw"></i>',
      confirmSave: true
    },
    columns: {
      fullName: {
        title: 'Name',
      },
      email: {
        title: 'Email'
      },
      phone: {
        title: 'Phone'
      },
      userType: {
        title: 'Role'
      },
      'id': {
        title: 'Edit',
        type: 'html'
      },
    },
  };

  ngOnInit() {
    this.authS.getUsers().subscribe(res =>{
      this.user_list = res.data.map(e =>{
        return {
          ...e,
          id: `
          <a href=dashboard/main/users/edit-user/${e._id} class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"><a/>
          `
        }
      })
      console.log(res)
    })
  }

}

