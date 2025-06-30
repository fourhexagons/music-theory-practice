// Input sanitization utilities
export class InputSanitizer {
  static sanitizeMusicalInput(input) {
    if (!input || typeof input !== 'string') return '';
    // Remove potentially harmful characters while preserving musical notation
    const cleaned = input
      .replace(/[<>'"]/g, '') // Remove HTML/JS injection chars
      .replace(/[^\w\s♭♯𝄪𝄫#b,.-]/gu, '') // Allow only musical notation, with 'u' flag and no unnecessary escape
      .trim()
      .substring(0, 100); // Limit length
    return cleaned;
  }
  static validateNumericInput(input, min = 0, max = 7) {
    const num = parseInt(input, 10);
    if (isNaN(num) || num < min || num > max) {
      throw new Error(`Invalid numeric input: ${input}`);
    }
    return num;
  }
  static sanitizeText(input, maxLength = 200) {
    if (!input || typeof input !== 'string') return '';
    return input
      .replace(/[<>'"&]/g, '') // Remove HTML chars
      .trim()
      .substring(0, maxLength);
  }
}
// Make available globally during transition
window.InputSanitizer = InputSanitizer; 