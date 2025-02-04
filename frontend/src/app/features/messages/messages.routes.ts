import { Routes } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { ConversationComponent } from './conversation/conversation.component';

export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    component: MessagesComponent,
    children: [
      {
        path: ':conversationId',
        component: ConversationComponent
      }
    ]
  }
];
