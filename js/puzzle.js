import { LETTER_VALUES } from './config.js';

// Puzzle solver module
export class PuzzleSolver {
  constructor(adventureSheet) {
    this.adventureSheet = adventureSheet;
    this.letterValues = LETTER_VALUES;
    this.breakdownTemplate = document.getElementById('breakdown-item-template');
    this.legendItemTemplate = document.getElementById('legend-item-template');
  }

  show() {
    // Toggle if already open
    const existing = document.querySelector('.puzzle-modal');
    if (existing) {
      existing.remove();
      return;
    }

    const modal = this.createModal();
    document.body.appendChild(modal);
    this.populateLegend(modal);
    this.bindEvents(modal);
    this.focusInput(modal);
  }

  createModal() {
    const template = document.getElementById('puzzle-modal-template');
    const content = template.content.cloneNode(true);

    const modal = document.createElement('div');
    modal.className = 'puzzle-modal';
    modal.appendChild(content);

    return modal;
  }

  populateLegend(modal) {
    const legendGrid = modal.querySelector('.legend-grid');
    legendGrid.innerHTML = '';

    // Generate legend items from LETTER_VALUES
    Object.keys(this.letterValues).sort().forEach(letter => {
      const value = this.letterValues[letter];
      const item = this.createLegendItem(letter, value);
      legendGrid.appendChild(item);
    });
  }

  createLegendItem(letter, value) {
    const element = this.legendItemTemplate.content.cloneNode(true);
    element.querySelector('[data-legend-letter]').textContent = letter;
    element.querySelector('[data-legend-value]').textContent = value;
    return element;
  }

  bindEvents(modal) {
    this.bindCloseEvents(modal);
    this.bindInputEvents(modal);
    this.bindToggleEvents(modal);
  }

  bindCloseEvents(modal) {
    // Close button
    modal.querySelector('.puzzle-close').addEventListener('click', () => {
      modal.remove();
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  bindInputEvents(modal) {
    const input = modal.querySelector('#puzzleInput');
    input.addEventListener('input', (e) => {
      this.calculatePuzzle(e.target.value);
    });
  }

  bindToggleEvents(modal) {
    const legendToggle = modal.querySelector('.legend-toggle');
    const legendGrid = modal.querySelector('.legend-grid');

    const toggleLegend = () => {
      const isExpanded = legendGrid.classList.toggle('expanded');
      legendToggle.classList.toggle('expanded');
      legendToggle.setAttribute('aria-expanded', isExpanded);
    };

    legendToggle.addEventListener('click', toggleLegend);

    // Keyboard support for toggle
    legendToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLegend();
      }
    });
  }

  focusInput(modal) {
    setTimeout(() => {
      modal.querySelector('#puzzleInput').focus();
    }, 100);
  }

  calculatePuzzle(text) {
    const breakdown = document.getElementById('puzzleBreakdown');
    const result = document.getElementById('puzzleResult');

    // Validate input
    if (!text || text.trim() === '') {
      this.showEmptyState(breakdown, result);
      return;
    }

    const letters = this.extractLetters(text);

    if (letters.length === 0) {
      this.showInvalidState(breakdown, result);
      return;
    }

    // Calculate and display
    const items = this.calculateLetterValues(letters);
    const total = this.sumValues(items);

    this.renderBreakdown(breakdown, items);
    this.updateResult(result, total);
  }

  extractLetters(text) {
    return text.toUpperCase().split('').filter(char => /[A-Z]/.test(char));
  }

  calculateLetterValues(letters) {
    return letters.map(letter => ({
      letter,
      value: this.letterValues[letter] || 0
    }));
  }

  sumValues(items) {
    return items.reduce((sum, item) => sum + item.value, 0);
  }

  showEmptyState(breakdown, result) {
    breakdown.innerHTML = '<div class="breakdown-empty">Nincs beírva semmi...</div>';
    result.textContent = '0';
  }

  showInvalidState(breakdown, result) {
    breakdown.innerHTML = '<div class="breakdown-empty">Csak betűket adj meg!</div>';
    result.textContent = '0';
  }

  renderBreakdown(breakdown, items) {
    breakdown.innerHTML = '';
    items.forEach(item => {
      const element = this.createBreakdownItem(item);
      breakdown.appendChild(element);
    });
  }

  createBreakdownItem(item) {
    const element = this.breakdownTemplate.content.cloneNode(true);
    element.querySelector('[data-letter]').textContent = item.letter;
    element.querySelector('[data-value]').textContent = item.value;
    return element;
  }

  updateResult(result, total) {
    result.textContent = total;
    this.animateResult(result);
  }

  animateResult(result) {
    result.classList.remove('pulse');
    void result.offsetWidth; // Trigger reflow
    result.classList.add('pulse');
  }
}