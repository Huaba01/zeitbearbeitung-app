import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresenceComponent } from '../presence/presence.component';

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, MatListModule, MatDialogModule],
  providers: [UserService],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentUser: any; 
  teamName: string = '';  

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      (profile: any) => {
        this.currentUser = profile;

        if (this.currentUser && this.currentUser.unit && this.currentUser.unit.name) {
          this.teamName = this.currentUser.unit.name;
          this.loadUsersByTeam(this.teamName);
        }
      },
      (error) => {
        console.error('Fehler beim Laden des Profils:', error);
      }
    );
  }
  loadUsersByTeam(teamName: string): void {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        if (Array.isArray(users)) {
          this.users = users.filter(
            (user) => user.unit && user.unit.name === teamName
          );
        }
      },
      (error) => {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    );
  }
  selectUser(user: any) {
    this.userService.getPresences(user.id).subscribe(
      (presences) => {
        const dialogRef = this.dialog.open(PresenceComponent, {
          data: {
            selectedUser: user,
            presences: presences,
          },
          width: '600px',
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('Dialog geschlossen', result);
        });
      },
      (error) => {
        console.error('Fehler beim Laden der Anwesenheitsdaten: ', error);
      }
    );
  }
}
