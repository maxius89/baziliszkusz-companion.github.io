// Puzzle solver module
export class PuzzleSolver {
  constructor(adventureSheet) {
    this.adventureSheet = adventureSheet;
    this.letterValues = {
      'A': 2, 'B': 25, 'C': 3, 'D': 15, 'E': 4, 'F': 19,
      'G': 9, 'H': 24, 'I': 6, 'J': 22, 'K': 5, 'L': 21,
      'M': 1, 'N': 20, 'O': 8, 'P': 17, 'Q': 14, 'R': 11,
      'S': 18, 'T': 13, 'U': 10, 'V': 5, 'W': 9, 'X': 6,
      'Y': 12, 'Z': 7
    };
  }

  show() {
    const existing = document.querySelector('.puzzle-modal');
    if (existing) {
      existing.remove();
      return;
    }

    const template = document.getElementById('puzzle-modal-template');
    const content = template.content.cloneNode(true);

    const modal = document.createElement('div');
    modal.className = 'puzzle-modal';
    modal.appendChild(content);

    document.body.appendChild(modal);

    this.bindEvents(modal);

    // Focus on input
    setTimeout(() => {
      modal.querySelector('#puzzleInput').focus();
    }, 100);
  }

  bindEvents(modal) {
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

    // Input event
    const input = modal.querySelector('#puzzleInput');
    input.addEventListener('input', (e) => {
      this.calculatePuzzle(e.target.value);
    });

    // Allow ESC to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  calculatePuzzle(text) {
    const breakdown = document.getElementById('puzzleBreakdown');
    const result = document.getElementById('puzzleResult');

    if (!text || text.trim() === '') {
      breakdown.innerHTML = '<div class="breakdown-empty">Nincs beírva semmi...</div>';
      result.textContent = '0';
      return;
    }

    const letters = text.toUpperCase().split('').filter(char => /[A-Z]/.test(char));

    if (letters.length === 0) {
      breakdown.innerHTML = '<div class="breakdown-empty">Csak betűket adj meg!</div>';
      result.textContent = '0';
      return;
    }

    let total = 0;
    const items = [];

    letters.forEach(letter => {
      const value = this.letterValues[letter] || 0;
      total += value;
      items.push({ letter, value });
    });

    // Render breakdown
    breakdown.innerHTML = items.map(item =>
      `<div class="breakdown-item">
                <span class="breakdown-letter">${item.letter}</span>
                <span class="breakdown-arrow">→</span>
                <span class="breakdown-value">${item.value}</span>
            </div>`
    ).join('');

    // Show calculation if more than one letter
    if (items.length > 1) {
      const calculation = items.map(item => item.value).join(' + ');
      breakdown.innerHTML += `<div class="breakdown-calculation">${calculation} = ${total}</div>`;
    }

    // Update result
    result.textContent = total;

    // Animate result
    result.classList.remove('pulse');
    void result.offsetWidth; // Trigger reflow
    result.classList.add('pulse');
  }
}