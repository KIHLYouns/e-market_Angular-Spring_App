import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from './conversation-list/conversation-list.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ConversationListComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
