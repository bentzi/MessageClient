import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  userId: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';  // Retrieve user ID from local storage
    console.log('User ID on init:', this.userId);  // Debugging line

    if (this.userId) {
      this.dataService.getMessages().subscribe(messages => {
        this.messages = messages;
      });
    } else {
      console.error('User ID is not set');
    }
  }

  addMessage() {
    if (this.newMessage.trim()) {
      console.log('Adding message with User ID:', this.userId);  // Debugging line
      this.dataService.addMessage(this.newMessage).subscribe(
        message => {
          this.messages.push(message);
          this.newMessage = '';
        },
        error => {
          console.error('Error adding message:', error);
        }
      );
    }
  }

  goToLogin() {
    this.router.navigate(['/']);  // Navigate back to the login page
  }
}
