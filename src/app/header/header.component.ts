import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class HeaderComponent {
  isApiKeyFormVisible = false;
  apiKey: string = '';
  profileImageUrl: string = 'assets/default-profile.jpg';
  playingCaptain: any;

  constructor(private userService: UserService) {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      this.apiKey = storedApiKey;
      this.loadPlayingCaptain();
    }
  }

  toggleApiKeyForm() {
    this.isApiKeyFormVisible = !this.isApiKeyFormVisible;
  }

  saveApiKey() {
    if (this.apiKey) {
      localStorage.setItem('apiKey', this.apiKey);
      alert('API-Key gespeichert!');
      this.isApiKeyFormVisible = false;
      window.location.reload();
    } else {
      alert('Bitte einen gültigen API-Key eingeben.');
    }
  }

  loadPlayingCaptain() {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        const captain = users.find((user) =>
          user.tags.includes('Playing Captain'),
        );
        if (captain && captain.avatar_url) {
          this.profileImageUrl = captain.avatar_url;
          this.playingCaptain = captain;
        }
      },
      (error: any) => {
        console.error('Fehler beim Laden des Playing Captain:', error);
      },
    );
  }

  logout() {
    localStorage.removeItem('apiKey');
    this.apiKey = '';
    this.profileImageUrl = 'assets/default-profile.jpg';
    this.playingCaptain = null;
    alert('Sie haben sich erfolgreich abgemeldet.');
    window.location.reload();
  }
}
