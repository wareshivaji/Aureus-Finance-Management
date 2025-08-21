import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private themeService: ThemeService) {}
  
  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  // Navigation items
  navItems = [
    { path: '/dashboard/overview', label: 'Overview', icon: 'dashboard' },
    { path: '/dashboard/analysis', label: 'Analysis', icon: 'analytics' },
    { path: '/dashboard/future', label: 'Future of App', icon: 'settings' }
  ];

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  
}
