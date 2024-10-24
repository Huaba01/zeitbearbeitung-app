import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { subWeeks, addWeeks } from 'date-fns';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-presence',
  standalone: true,
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
  ],
})
export class PresenceComponent implements OnInit {
  presences: any[] = [];
  currentWeekStart: Date = new Date();
  loading: boolean = false;
  error: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedUser: any; presences: any[] },
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.data.selectedUser) {
      this.presences = this.data.presences || [];
      this.presences.forEach((p) => (p.isEditing = false));
      this.filterPresencesByWeek();
    }
  }

  editPresence(presence: any) {
    presence.isEditing = true;
  }

  savePresence(presence: any) {
    this.userService.updatePresence(presence).subscribe(
      () => {
        presence.isEditing = false;
        console.log('Anwesenheit gespeichert:', presence);
      },
      (error) => {
        console.error('Fehler beim Speichern der Anwesenheit:', error);
      },
    );
  }

  cancelEdit(presence: any) {
    presence.isEditing = false;
  }

  filterPresencesByWeek() {
    const weekStart = this.getWeekStart(this.currentWeekStart);
    const weekEnd = addWeeks(weekStart, 1);
    this.presences = this.data.presences.filter((presence) =>
      this.isDateInCurrentWeek(new Date(presence.date)),
    );
  }

  getWeekStart(date: Date): Date {
    const tempDate = new Date(date);
    const day = tempDate.getDay();
    const diff = day === 0 ? 6 : day - 1;
    tempDate.setDate(tempDate.getDate() - diff);
    return new Date(tempDate.setHours(0, 0, 0, 0));
  }

  isDateInCurrentWeek(date: Date): boolean {
    const weekStart = this.getWeekStart(this.currentWeekStart);
    const weekEnd = addWeeks(weekStart, 1);
    return date >= weekStart && date < weekEnd;
  }

  previousWeek() {
    this.currentWeekStart = subWeeks(this.currentWeekStart, 1);
    this.filterPresencesByWeek();
  }

  nextWeek() {
    this.currentWeekStart = addWeeks(this.currentWeekStart, 1);
    this.filterPresencesByWeek();
  }
}
