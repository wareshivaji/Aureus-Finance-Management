import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = signal(false);
  
  isDarkMode = this.isDark.asReadonly();

  constructor() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(systemPrefersDark);
    }
    
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark.update(mode => {
      const newMode = !mode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      this.applyTheme();
      return newMode;
    });
  }

  private applyTheme() {
    if (this.isDark()) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}