// Simple landing page script - just load styles, no practice app logic
import './styles/variables.css';
import './styles/style.css';

// Simple landing page functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Music Theory Practice - Landing Page Loaded');
  
  // Optional: Add any simple landing page interactions here
  const startButton = document.querySelector('.btn[href="/practice"]');
  if (startButton) {
    startButton.addEventListener('click', (e) => {
      console.log('Navigating to practice app...');
    });
  }
}); 