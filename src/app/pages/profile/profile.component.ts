import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profesion: string;
  city: string;

  constructor(
    private db: AngularFirestore,
  ) { }

  ngOnInit(): void {
  }

}
