import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
 @Input() title : string = 'title';
 @Input() type : string = '';
 @Input() disabled : boolean = false;

 @Output() action = new EventEmitter();

 onClickAction() : void {
  this.action.emit()
 }
}
