import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategiriesService } from 'src/app/shared/services/categiries.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  allCategory: Array<ICategory> = [];
  basket: Array<IProduct> = [];
  totalPrice = 0;
  modalRef: BsModalRef;
  userEmail: string;
  userPassword: string;
  Login: boolean;
  Admin: boolean;

  constructor(
    private categoryService: CategiriesService,
    private orderService: OrderService,
    private modalService: BsModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.checkMyBasket();
    this.getLocalProducts();
    this.ifLogin();
  }

  private checkMyBasket(): void {
    this.orderService.basket.subscribe(
      data => {
        this.basket = data;
        this.totalPrice = this.getTotal(this.basket);
      }
    )
  };

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
    }
  };

  private getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }

  private getCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.allCategory = data;
      }
    )
  };

  signUpModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  };

  signOutModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  signUpUser(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signUp(this.userEmail, this.userPassword);
    }
  };

  singInUser(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signIn(this.userEmail, this.userPassword);
    }
  };

  signOutUser(): void {
    this.authService.signOut();
    this.Admin = false;
    this.Login = false;
  };

  private ifLogin(): void {
    if (localStorage.getItem('user')) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser.role === 'admin' && currentUser != null) {
        this.Admin = true;
        this.Login = true;
      } else if (currentUser.role === 'user' && currentUser != null) {
        this.Admin = false;
        this.Login = true;
      }
    }
  };



}
