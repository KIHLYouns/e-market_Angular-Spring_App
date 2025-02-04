import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../../core/services/messages.service';
import { Message, Conversation } from '../../../shared/models/message.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  conversation?: Conversation;
  messages: Message[] = [];
  newMessage = '';
  currentUserId = 1; // Replace with actual user ID management
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const conversationId = +params['conversationId'];
      this.loadConversation(conversationId);
      this.loadMessages(conversationId);
      this.markAsRead(conversationId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConversation(conversationId: number): void {
    this.messagesService.getConversation(conversationId).subscribe(conversation => {
      this.conversation = conversation;
    });
  }

  private loadMessages(conversationId: number): void {
    this.messagesService.getMessages(conversationId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  private markAsRead(conversationId: number): void {
    this.messagesService.markAsRead(conversationId).subscribe();
  }

  sendMessage(): void {
    if (!this.conversation || !this.newMessage.trim()) return;
    
    this.messagesService.sendMessage(this.conversation.id, this.newMessage.trim())
      .subscribe(message => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
      });
  }

  getOtherParticipant() {
    if (!this.conversation) return { username: '', avatar: '' };
    return this.conversation.participants.find(p => p.id !== this.currentUserId) || 
           this.conversation.participants[0];
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }
}
