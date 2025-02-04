import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessagesService } from '../../../core/services/messages.service';
import { Conversation } from '../../../shared/models/message.interface';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {
  conversations: Conversation[] = [];
  currentUserId = 1; // Replace with actual user ID management

  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  private loadConversations(): void {
    this.messagesService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
    });
  }

  getOtherParticipant(conversation: Conversation) {
    return conversation.participants.find(p => p.id !== this.currentUserId) || conversation.participants[0];
  }
}
