import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isHiddenStat:boolean=false
  textForButton:string='Ukryj statystyki'
  @Output() isHiddenStatEvent = new EventEmitter()
  @Output() isHiddenCatEvent = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  hiddenStatToggle() {
    this.isHiddenStat=!this.isHiddenStat
    this.isHiddenStatEvent.emit(this.isHiddenStat)
    this.isHiddenStat ? this.textForButton='Pokaż statystyki': this.textForButton='Ukryj statystyki'
  }

  hiddenCatToggle() {
    this.isHiddenCatEvent.emit('')
  }
}
