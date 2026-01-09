// Dice roller module
export class DiceRoller {
    constructor(adventureSheet) {
        this.adventureSheet = adventureSheet;
        this.historyKey = 'kalandlap_dice_history';
    }

show() {
    let sidebar = document.querySelector('.dice-roller-sidebar');
    
    if (sidebar) {
        sidebar.classList.toggle('open');
        return;
    }

    sidebar = document.createElement('div');
    sidebar.className = 'dice-roller-sidebar';
    sidebar.innerHTML = this.getHTML();
    
    document.body.appendChild(sidebar);

    this.bindDiceEvents(sidebar);

    setTimeout(() => sidebar.classList.add('open'), 10);
    this.loadHistory();
}

bindDiceEvents(sidebar) {
    // Close button
    sidebar.querySelector('#diceClose').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Simple roll buttons
    sidebar.querySelector('#roll1d6').addEventListener('click', () => this.rollAndShow(1));
    sidebar.querySelector('#roll2d6').addEventListener('click', () => this.rollAndShow(2));
    
    // Battle roll button
    sidebar.querySelector('#rollBattle').addEventListener('click', () => this.rollBattle());
}

getHTML() {
    return `
        <div class="dice-roller-content">
            <button class="dice-close" id="diceClose">✕</button>
            <h2>KOCKADOBÁS</h2>
            
            <div class="dice-section">
                <h3>Egyszerű dobás</h3>
                <div class="dice-result" id="diceResult">
                    <span class="result-number">?</span>
                </div>
                <div class="dice-buttons">
                    <button class="dice-btn" id="roll1d6">1D6</button>
                    <button class="dice-btn" id="roll2d6">2D6</button>
                </div>
            </div>
            
            <div class="dice-section">
                <h3>Harc dobás</h3>
                <div class="battle-rolls">
                    <div class="battle-roll">
                        <h4>JÁTÉKOS</h4>
                        <div class="battle-result" id="attackerRoll">?</div>
                    </div>
                    <div class="battle-roll">
                        <h4>ELLENFÉL</h4>
                        <div class="battle-result" id="defenderRoll">?</div>
                    </div>
                </div>
                <div class="dice-buttons">
                    <button class="dice-btn" id="rollBattle">HARC DOBÁS</button>
                </div>
            </div>
            
            <div class="dice-history" id="diceHistory">
                <h3>TÖRTÉNET</h3>
                <div class="history-items"></div>
            </div>
        </div>
    `;
}

    rollDice(sides = 6) {
        return Math.floor(Math.random() * sides) + 1;
    }

    rollAndShow(numDice) {
        const results = [];
        let total = 0;
        
        for (let i = 0; i < numDice; i++) {
            const roll = this.rollDice(6);
            results.push(roll);
            total += roll;
        }
        
        const resultElement = document.getElementById('diceResult');
        if (!resultElement) return;
        
        resultElement.classList.add('rolling');
        
        setTimeout(() => {
            resultElement.classList.remove('rolling');
            const resultNumber = resultElement.querySelector('.result-number');
            
            if (numDice === 1) {
                resultNumber.textContent = total;
            } else {
                resultNumber.innerHTML = `${total}<br><small>${results.join(' + ')}</small>`;
            }
            
            this.addToHistory(numDice, results, total);
        }, 300);
    }

    rollBattle() {
        const attackerRolls = [this.rollDice(6), this.rollDice(6)];
        const attackerTotal = attackerRolls[0] + attackerRolls[1];
        
        const defenderRolls = [this.rollDice(6), this.rollDice(6)];
        const defenderTotal = defenderRolls[0] + defenderRolls[1];
        
        const attackerElement = document.getElementById('attackerRoll');
        const defenderElement = document.getElementById('defenderRoll');
        
        if (!attackerElement || !defenderElement) return;
        
        attackerElement.classList.add('rolling');
        defenderElement.classList.add('rolling');
        
        setTimeout(() => {
            attackerElement.classList.remove('rolling');
            defenderElement.classList.remove('rolling');
            
            attackerElement.innerHTML = `${attackerTotal}<br><small>${attackerRolls.join(' + ')}</small>`;
            defenderElement.innerHTML = `${defenderTotal}<br><small>${defenderRolls.join(' + ')}</small>`;
            
            this.addToHistory('Harc', [...attackerRolls, ...defenderRolls], `${attackerTotal} vs ${defenderTotal}`);
        }, 300);
    }

    addToHistory(numDice, results, total) {
        const history = this.getHistory();
        const entry = {
            timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
            numDice: numDice,
            results: results,
            total: total
        };
        
        history.unshift(entry);
        if (history.length > 10) history.pop();
        
        localStorage.setItem(this.historyKey, JSON.stringify(history));
        this.displayHistory(history);
    }

    getHistory() {
        try {
            const history = localStorage.getItem(this.historyKey);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    loadHistory() {
        const history = this.getHistory();
        this.displayHistory(history);
    }

    displayHistory(history) {
        const container = document.querySelector('.history-items');
        if (!container) return;
        
        if (history.length === 0) {
            container.innerHTML = '<div class="history-empty">Még nem dobtál kockát</div>';
            return;
        }
        
        container.innerHTML = history.map(entry => {
            if (entry.numDice === 'Harc') {
                return `
                    <div class="history-item">
                        <span class="history-time">${entry.timestamp}</span>
                        <span class="history-dice">Harc:</span>
                        <span class="history-total">${entry.total}</span>
                    </div>
                `;
            } else {
                return `
                    <div class="history-item">
                        <span class="history-time">${entry.timestamp}</span>
                        <span class="history-dice">${entry.numDice}D6:</span>
                        <span class="history-total">${entry.total}</span>
                        ${entry.numDice > 1 ? `<span class="history-details">(${entry.results.join(' + ')})</span>` : ''}
                    </div>
                `;
            }
        }).join('');
    }
}