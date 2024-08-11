import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userId: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  login() {
    this.dataService.login(this.userId).subscribe(
      response => {
        localStorage.setItem('userId', this.userId);
        this.router.navigate(['/messages']);
      },
      error => {
        console.error('Login failed', error);
        alert('User ID not found');
      }
    );
  }
}
