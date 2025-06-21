// Encounter tracking
let encounter = [];
let totalBattlePoints = 14;

// Calculate battle points based on PC count and difficulty
function calculateBattlePoints() {
    const pcCount = parseInt(document.getElementById('pcCount').value) || 4;
    const activeBtn = document.querySelector('.toggle-btn.active');
    const difficultyMod = parseInt(activeBtn?.getAttribute('data-value')) || 0;
    
    const basePoints = (3 * pcCount) + 2;
    totalBattlePoints = basePoints + difficultyMod;
    
    document.getElementById('minion-count').textContent = `1 point = ${pcCount} Minions`;
    updateEncounterDisplay();
}

// Update the complete encounter display
function updateEncounterDisplay() {
    const usedPoints = encounter.reduce((total, item) => total + item.cost, 0);
    const partyTier = parseInt(document.querySelector('.tier-btn.active')?.getAttribute('data-value')) || 2;
    
    // Calculate all modifiers
    const soloCount = encounter.filter(item => item.type === 'Solo').length;
    const multiSoloModifier = soloCount >= 2 ? -2 : 0;
    
    const hasElites = encounter.some(item => 
        ['Bruiser', 'Horde', 'Leader', 'Solo'].includes(item.type)
    );
    const noElitesModifier = (!hasElites && encounter.length > 0) ? 1 : 0;
    
    const bonusDamageChecked = document.getElementById('bonus-damage').checked;
    const bonusDamageModifier = bonusDamageChecked ? -2 : 0;
    
    const hasLowerTierAdversary = encounter.some(item => 
        item.selectedAdversary && item.selectedAdversary.tier < partyTier
    );
    const lowerTierModifier = hasLowerTierAdversary ? 1 : 0;
    
    const totalModifiers = multiSoloModifier + noElitesModifier + bonusDamageModifier + lowerTierModifier;
    const effectiveBattlePoints = totalBattlePoints + totalModifiers;
    const remainingPoints = effectiveBattlePoints - usedPoints;
    
    // Update display
    document.getElementById('used-points').textContent = usedPoints;
    document.getElementById('remaining-points').textContent = remainingPoints;
    updateBattlePointsDisplay(multiSoloModifier, noElitesModifier, bonusDamageModifier, lowerTierModifier);
    
    // Color coding for remaining points
    const remainingElement = document.getElementById('remaining-points');
    const remainingContainer = remainingElement.closest('.points-remaining');
    
    remainingElement.classList.remove('plenty', 'low', 'over', 'perfect');
    remainingContainer.classList.remove('plenty', 'low', 'over', 'perfect');
    
    if (remainingPoints === 0) {
        remainingElement.classList.add('perfect');
        remainingContainer.classList.add('perfect');
    } else if (remainingPoints < 0) {
        remainingElement.classList.add('over');
        remainingContainer.classList.add('over');
    } else if (remainingPoints <= 3) {
        remainingElement.classList.add('low');
        remainingContainer.classList.add('low');
    } else {
        remainingElement.classList.add('plenty');
        remainingContainer.classList.add('plenty');
    }
    
    // Update adversary affordability
    document.querySelectorAll('.cost-item').forEach(item => {
        const cost = parseInt(item.getAttribute('data-cost'));
        if (cost > remainingPoints) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    });
    
    // Build encounter list
    const encounterList = document.getElementById('encounter-list');
    
    if (encounter.length === 0) {
        encounterList.innerHTML = '<p class="empty-message">Click adversary types above to add them to your encounter.</p>';
    } else {
        let modifierText = '';
        if (multiSoloModifier !== 0) {
            modifierText += '<div class="modifier-applied penalty">2+ Solos: -2 Points</div>';
        }
        if (noElitesModifier !== 0) {
            modifierText += '<div class="modifier-applied bonus">No Elites: +1 Point</div>';
        }
        if (bonusDamageModifier !== 0) {
            modifierText += '<div class="modifier-applied penalty">+1d4 Damage: -2 Points</div>';
        }
        if (lowerTierModifier !== 0) {
            modifierText += '<div class="modifier-applied bonus">Lower Tier: +1 Point</div>';
        }
        
        encounterList.innerHTML = encounter.map((item, index) => {
            let dropdownHtml = '';
            
            if (adversaryDatabase[item.type] && adversaryDatabase[item.type].length > 0) {
                dropdownHtml = `
                    <select class="adversary-dropdown" onchange="selectAdversary(${index}, this.value)">
                        <option value="">Choose specific ${item.type.toLowerCase()}...</option>
                        ${adversaryDatabase[item.type].map((adv, advIndex) => {
                            const isSelected = item.selectedAdversary && item.selectedAdversary.name === adv.name;
                            const tierBadge = adv.tier < partyTier ? ' class="lower"' : '';
                            return `<option value="${advIndex}" ${isSelected ? 'selected' : ''}>${adv.name} (Tier ${adv.tier})</option>`;
                        }).join('')}
                    </select>
                `;
            }
            
            const displayName = item.selectedAdversary ? item.selectedAdversary.name : item.type;
            const tierBadge = item.selectedAdversary ? `<span class="tier-badge${item.selectedAdversary.tier < partyTier ? ' lower' : ''}">Tier ${item.selectedAdversary.tier}</span>` : '';
            
            return `
                <div class="encounter-item">
                    <div class="encounter-details">
                        <div class="encounter-type">${displayName}${tierBadge}</div>
                        <div class="encounter-cost">${item.cost} point${item.cost !== 1 ? 's' : ''}</div>
                        ${dropdownHtml}
                    </div>
                    <button class="remove-btn" onclick="removeAdversary(${index})">×</button>
                </div>
            `;
        }).join('') + modifierText;
    }
    updateCopyButtonState();
}

// Update battle points display with modifiers
function updateBattlePointsDisplay(multiSoloModifier, noElitesModifier, bonusDamageModifier, lowerTierModifier) {
    const pcCount = parseInt(document.getElementById('pcCount').value) || 4;
    const activeBtn = document.querySelector('.toggle-btn.active');
    const difficultyMod = parseInt(activeBtn?.getAttribute('data-value')) || 0;
    
    const basePoints = (3 * pcCount) + 2;
    const finalPoints = basePoints + difficultyMod + multiSoloModifier + noElitesModifier + bonusDamageModifier + lowerTierModifier;
    
    document.getElementById('finalPoints').textContent = finalPoints + ' Battle Points';
    document.getElementById('calculation').textContent = `(3 × ${pcCount}) + 2 = ${basePoints}`;
    
    const modifiersList = document.getElementById('modifiers-list');
    let modifiersText = '';
    
    if (difficultyMod !== 0) {
        modifiersText += `Difficulty: ${difficultyMod > 0 ? '+' : ''}${difficultyMod}`;
    }
    if (bonusDamageModifier !== 0) {
        if (modifiersText) modifiersText += ' • ';
        modifiersText += `+1d4 Damage: ${bonusDamageModifier}`;
    }
    if (multiSoloModifier !== 0) {
        if (modifiersText) modifiersText += ' • ';
        modifiersText += `2+ Solos: ${multiSoloModifier}`;
    }
    if (noElitesModifier !== 0) {
        if (modifiersText) modifiersText += ' • ';
        modifiersText += `No Elites: ${noElitesModifier > 0 ? '+' : ''}${noElitesModifier}`;
    }
    if (lowerTierModifier !== 0) {
        if (modifiersText) modifiersText += ' • ';
        modifiersText += `Lower Tier: ${lowerTierModifier > 0 ? '+' : ''}${lowerTierModifier}`;
    }
    
    modifiersList.textContent = modifiersText;
}

// Add adversary to encounter
function addAdversary(type, cost) {
    const usedPoints = encounter.reduce((total, item) => total + item.cost, 0);
    const partyTier = parseInt(document.querySelector('.tier-btn.active')?.getAttribute('data-value')) || 2;
    
    // Calculate current modifiers
    const soloCount = encounter.filter(item => item.type === 'Solo').length;
    const multiSoloModifier = soloCount >= 2 ? -2 : 0;
    
    const hasElites = encounter.some(item => 
        ['Bruiser', 'Horde', 'Leader', 'Solo'].includes(item.type)
    );
    const noElitesModifier = (!hasElites && encounter.length > 0) ? 1 : 0;
    
    const bonusDamageChecked = document.getElementById('bonus-damage').checked;
    const bonusDamageModifier = bonusDamageChecked ? -2 : 0;
    
    const hasLowerTierAdversary = encounter.some(item => 
        item.selectedAdversary && item.selectedAdversary.tier < partyTier
    );
    const lowerTierModifier = hasLowerTierAdversary ? 1 : 0;
    
    const totalModifiers = multiSoloModifier + noElitesModifier + bonusDamageModifier + lowerTierModifier;
    const effectiveBattlePoints = totalBattlePoints + totalModifiers;
    const remainingPoints = effectiveBattlePoints - usedPoints;
    
    if (cost <= remainingPoints) {
        encounter.push({ type, cost });
        updateEncounterDisplay();
        updateCopyButtonState();
    }
}

// Global functions that need to be accessible from HTML onclick attributes
window.selectAdversary = function(encounterIndex, adversaryIndex) {
    if (adversaryIndex === '') return;
    
    const encounterItem = encounter[encounterIndex];
    const selectedAdversary = adversaryDatabase[encounterItem.type][adversaryIndex];
    
    encounter[encounterIndex].selectedAdversary = selectedAdversary;
    updateEncounterDisplay();
}

window.removeAdversary = function(index) {
    encounter.splice(index, 1);
    updateEncounterDisplay();
    updateCopyButtonState();
}

window.resetEncounter = function() {
    encounter = [];
    updateEncounterDisplay();
    updateCopyButtonState();
}

window.copyEncounter = function() {
    const encounterText = formatEncounterText();
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(encounterText).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopy(encounterText);
        });
    } else {
        fallbackCopy(encounterText);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy encounter:', err);
        alert('Copy failed. Please try again.');
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess() {
    const copyBtn = document.getElementById('copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.classList.add('success');
    copyBtn.innerHTML = '<svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Copied!';
    
    setTimeout(() => {
        copyBtn.classList.remove('success');
        copyBtn.innerHTML = originalText;
    }, 2000);
}

// Generate formatted encounter text for copying
function formatEncounterText() {
    const pcCount = parseInt(document.getElementById('pcCount').value) || 4;
    const partyTier = parseInt(document.querySelector('.tier-btn.active')?.getAttribute('data-value')) || 2;
    const activeBtn = document.querySelector('.toggle-btn.active');
    const difficultyMod = parseInt(activeBtn?.getAttribute('data-value')) || 0;
    const difficultyText = difficultyMod === -1 ? 'Easier' : difficultyMod === 2 ? 'Harder' : 'Standard';
    
    let text = 'DAGGERHEART ENCOUNTER\n';
    text += '========================\n\n';
    
    // Calculate modifiers
    const soloCount = encounter.filter(item => item.type === 'Solo').length;
    const multiSoloModifier = soloCount >= 2 ? -2 : 0;
    
    const hasElites = encounter.some(item => 
        ['Bruiser', 'Horde', 'Leader', 'Solo'].includes(item.type)
    );
    const noElitesModifier = (!hasElites && encounter.length > 0) ? 1 : 0;
    
    const bonusDamageChecked = document.getElementById('bonus-damage').checked;
    const bonusDamageModifier = bonusDamageChecked ? -2 : 0;
    
    const hasLowerTierAdversary = encounter.some(item => 
        item.selectedAdversary && item.selectedAdversary.tier < partyTier
    );
    const lowerTierModifier = hasLowerTierAdversary ? 1 : 0;
    
    const totalBattlePoints = (3 * pcCount) + 2 + difficultyMod + multiSoloModifier + noElitesModifier + bonusDamageModifier + lowerTierModifier;
    const usedPoints = encounter.reduce((total, item) => total + item.cost, 0);
    const remainingPoints = totalBattlePoints - usedPoints;
    
    // Party info
    text += `Party: ${pcCount} PCs, Tier ${partyTier} (${difficultyText} Difficulty)\n`;
    text += `Battle Points: ${totalBattlePoints} total, ${remainingPoints} remaining\n\n`;
    
    // Adversaries
    if (encounter.length > 0) {
        text += 'ADVERSARIES:\n';
        
        // Group identical adversaries
        const groupedAdversaries = {};
        encounter.forEach(item => {
            const name = item.selectedAdversary ? item.selectedAdversary.name : item.type;
            const key = `${name}_${item.type}_${item.cost}`;
            
            if (groupedAdversaries[key]) {
                groupedAdversaries[key].count++;
                groupedAdversaries[key].totalCost += item.cost;
            } else {
                groupedAdversaries[key] = {
                    name: name,
                    type: item.type,
                    cost: item.cost,
                    count: 1,
                    totalCost: item.cost,
                    tier: item.selectedAdversary ? item.selectedAdversary.tier : null
                };
            }
        });
        
        Object.values(groupedAdversaries).forEach(adv => {
            if (adv.count === 1) {
                text += `• 1× ${adv.name}`;
                if (adv.name !== adv.type) {
                    text += ` (${adv.type})`;
                }
                if (adv.tier) {
                    text += ` [Tier ${adv.tier}]`;
                }
                text += ` - ${adv.cost} pts\n`;
            } else {
                text += `• ${adv.count}× ${adv.name}`;
                if (adv.name !== adv.type) {
                    text += ` (${adv.type})`;
                }
                if (adv.tier) {
                    text += ` [Tier ${adv.tier}]`;
                }
                text += ` - ${adv.cost} pts each, ${adv.totalCost} total\n`;
            }
        });
        text += '\n';
    }
    
    // Modifiers
    text += 'MODIFIERS APPLIED:\n';
    const modifiers = [];
    
    if (difficultyMod === -1) {
        modifiers.push('Easier Difficulty (-1 Battle Point)');
    } else if (difficultyMod === 2) {
        modifiers.push('Harder Difficulty (+2 Battle Points)');
    }
    
    if (bonusDamageModifier !== 0) {
        modifiers.push('+1d4 Damage to All (-2 Battle Points)');
    }
    
    if (multiSoloModifier !== 0) {
        modifiers.push('2+ Solo Adversaries (-2 Battle Points)');
    }
    
    if (noElitesModifier !== 0) {
        modifiers.push('No Elite Adversaries (+1 Battle Point)');
    }
    
    if (lowerTierModifier !== 0) {
        modifiers.push('Lower Tier Adversary (+1 Battle Point)');
    }
    
    if (modifiers.length > 0) {
        modifiers.forEach(modifier => {
            text += `• ${modifier}\n`;
        });
    } else {
        text += '• None\n';
    }
    
    text += '\n---\n';
    text += 'Generated by Daggerheart Encounter Builder\n';
    text += 'https://coryroush.github.io/daggerheart-encounter-builder/';
    
    return text;
}

// Update the copy button state when encounter changes
function updateCopyButtonState() {
    const copyBtn = document.getElementById('copy-btn');
    
    if (encounter.length > 0) {
        copyBtn.disabled = false;
    } else {
        copyBtn.disabled = true;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pcCount').addEventListener('input', calculateBattlePoints);
    document.getElementById('bonus-damage').addEventListener('change', updateEncounterDisplay);
    
    // Difficulty toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateBattlePoints();
        });
    });
    
    // Tier toggle buttons
    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tier = parseInt(this.getAttribute('data-value'));
            const subtitle = document.querySelector('.tier-subtitle');
            const subtitles = {
                1: 'Tier 1: Level 1',
                2: 'Tier 2: Levels 2-4',
                3: 'Tier 3: Levels 5-7', 
                4: 'Tier 4: Levels 8-10'
            };
            subtitle.textContent = subtitles[tier];
            updateEncounterDisplay();
        });
    });
    
    // Adversary cost item clicks
    document.querySelectorAll('.cost-item').forEach(item => {
        item.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const cost = parseInt(this.getAttribute('data-cost'));
            addAdversary(type, cost);
        });
    });
    
    // Initialize
    calculateBattlePoints();
});
