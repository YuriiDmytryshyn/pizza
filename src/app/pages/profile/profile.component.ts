import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isError } from 'util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  addModalHeight = 500;
  fileUploaded = false;
  dynamic: number = 0;

  myFirstName: string;
  myLastName: string;
  myCity: string;
  myOld: number;
  userImage = 'assets/images/no-person.jpg';

  constructor(
    private db: AngularFirestore,
    private modalService: BsModalService,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  cheackLocalUser(): void {
    if (this.myFirstName && this.myLastName && this.myCity && this.myOld) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.firtName === undefined || user.lastName === undefined || user.old === undefined || user.city === undefined) {
          user.firtName = this.myFirstName;
          user.lastName = this.myLastName;
          user.city = this.myCity;
          user.old = this.myOld;
        }
      }
    }
  };



  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data === 100) {
        this.dynamic = 100;
      }
    });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.userImage = url;
        this.addModalHeight = 540;
        this.fileUploaded = true;
      });
    });
  };

  openModalAdd(template: TemplateRef<any>) {
    this.myFirstName = '';
    this.myLastName = '';
    this.myCity = '';
    this.myOld = null;
    this.modalRef = this.modalService.show(template);
  };

}
