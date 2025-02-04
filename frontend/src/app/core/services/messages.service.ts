import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment.dev';
import { Conversation, Message } from '../../shared/models/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesUrl = `${environment.apiUrl}/messages`;
  private conversationsUrl = `${environment.apiUrl}/conversations`;
  
  private currentUserId = 1; // Replace with actual user ID management
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  constructor(private http: HttpClient) {
    this.updateUnreadCount();
  }

  getConversations(): Observable<Conversation[]> {
    // Filter conversations where the current user is a participant
    return this.http.get<Conversation[]>(this.conversationsUrl).pipe(
      map(conversations => 
        conversations.filter(conv => 
          conv.participants.some(p => p.id === this.currentUserId)
        )
      )
    );
  }

  getConversation(conversationId: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.conversationsUrl}/${conversationId}`);
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.messagesUrl}`).pipe(
      map(messages => messages.filter(m => m.conversationId === conversationId))
    );
  }

  sendMessage(conversationId: number, content: string): Observable<Message> {
    const message = {
      conversationId,
      content,
      senderId: this.currentUserId,
      timestamp: new Date().toISOString(),
      read: false
    };
    return this.http.post<Message>(this.messagesUrl, message);
  }

  markAsRead(conversationId: number): Observable<void> {
    // Get all messages for this conversation
    return this.http.get<Message[]>(this.messagesUrl).pipe(
      map(messages => {
        const unreadMessages = messages.filter(m => 
          m.conversationId === conversationId && 
          m.senderId !== this.currentUserId && 
          !m.read
        );
        
        // Update each unread message
        unreadMessages.forEach(message => {
          this.http.patch(`${this.messagesUrl}/${message.id}`, { read: true }).subscribe();
        });
        
        this.updateUnreadCount();
      })
    );
  }

  private updateUnreadCount(): void {
    this.http.get<Message[]>(this.messagesUrl).pipe(
      map(messages => {
        const unreadCount = messages.filter(m => 
          m.senderId !== this.currentUserId && !m.read
        ).length;
        this.unreadCountSubject.next(unreadCount);
      })
    ).subscribe();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  startConversation(userId: number): Observable<Conversation> {
    const conversation: Partial<Conversation> = {
      participants: [
        {
          id: this.currentUserId,
          username: 'kihl_youns', // Should come from user service
          avatar: 'assets/images/avatars/default.jpg'
        },
        {
          id: userId,
          username: 'user_' + userId, // Should come from user service
          avatar: 'assets/images/avatars/default.jpg'
        }
      ],
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    };
    return this.http.post<Conversation>(this.conversationsUrl, conversation);
  }
}
