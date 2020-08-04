import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit{
  @Input() statusOfTasks
  @Output() selectStatus= new EventEmitter<boolean>()
  @Input('status')
  set setStatus(status){
    this.status=status
  }
  status:boolean

  constructor() { }

  ngOnInit(): void {

  }

  onClickStatus(status: boolean) {
    this.selectStatus.emit(status)
  }
}
