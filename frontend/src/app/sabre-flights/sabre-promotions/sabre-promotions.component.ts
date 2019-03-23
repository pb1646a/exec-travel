import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sabre-promotions',
  templateUrl: './sabre-promotions.component.html',
  styleUrls: ['./sabre-promotions.component.css']
})
export class SabrePromotionsComponent implements OnInit {
  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);


  promotions=[{code: 'aa', link: ''}, {code:'ll', description: 'test2'}];

  constructor() { }

  ngOnInit() {

  }

}
