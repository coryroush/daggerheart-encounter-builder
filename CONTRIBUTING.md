# Contributing to Daggerheart Encounter Builder

Thank you for your interest in contributing! This project thrives on community involvement and we welcome contributions of all kinds.

## Ways to Contribute

### 🐛 Bug Reports
Found something that doesn't work? Please [open an issue](https://github.com/yourusername/daggerheart-encounter-builder/issues) with:
- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Browser/device information**

### 📊 Data Corrections
The adversary database contains 127+ entries - mistakes happen! If you spot errors:
- **Adversary classifications** (wrong type or tier)
- **Missing adversaries** from the SRD
- **Incorrect names or details**

### 🎨 UI/UX Improvements
Ideas for better user experience:
- **Visual design enhancements**
- **Mobile responsiveness improvements**
- **Accessibility improvements**
- **Performance optimizations**

### ⚙️ New Features
Have an idea for new functionality? Great features to consider:
- **Export encounters** (PDF, text, JSON)
- **Save/load encounters** (local storage)
- **Encounter templates** (boss fight, exploration, etc.)
- **Advanced filtering** (by tier, type, theme)
- **Encounter analysis** (difficulty assessment, balance tips)

## Development Setup

### Prerequisites
- A modern web browser
- Text editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, and JavaScript

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/daggerheart-encounter-builder.git
   cd daggerheart-encounter-builder
   ```
3. **Open `index.html`** in your browser to test
4. **Make your changes** and test thoroughly
5. **Commit and push** to your fork
6. **Create a pull request**

### File Structure
```
daggerheart-encounter-builder/
├── index.html          # Main application file
├── README.md          # Project documentation
├── CONTRIBUTING.md    # This file
└── LICENSE           # Community Gaming License
```

## Code Guidelines

### HTML Structure
- **Semantic markup** - use appropriate HTML elements
- **Accessibility** - include proper ARIA labels and alt text
- **Mobile-first** - ensure responsive design

### CSS Standards
- **CSS Custom Properties** - use the existing color variables
- **BEM naming** - follow existing class naming patterns
- **Mobile responsive** - test on various screen sizes
- **Performance** - minimize reflows and repaints

### JavaScript Practices
- **Vanilla JS** - no external dependencies
- **ES6+ features** - use modern JavaScript
- **Clear naming** - descriptive variable and function names
- **Comments** - explain complex logic
- **Error handling** - graceful failure modes

### Brand Consistency
Maintain the **Forge & Frame** visual identity:
- **Color scheme**: Forge Copper, Frame Steel, Blueprint Blue
- **Typography**: Clean, technical aesthetic
- **Spacing**: Consistent with existing patterns

## Adversary Database

### Data Format
```javascript
const adversaryDatabase = {
    "Type": [
        { name: "Adversary Name", tier: 1 },
        // ...
    ]
};
```

### Adding Adversaries
1. **Verify against SRD** - ensure accuracy
2. **Correct classification** - proper type and tier
3. **Alphabetical order** - within each type
4. **Consistent naming** - match SRD exactly

### Data Validation
Before submitting adversary changes:
- [ ] Names match SRD exactly
- [ ] Types are correct (Minion, Social, Support, etc.)
- [ ] Tiers are accurate (1-4)
- [ ] No duplicates within types
- [ ] Alphabetical order maintained

## Testing

### Manual Testing Checklist
- [ ] **Basic functionality** - add/remove adversaries
- [ ] **Calculations** - Battle Points math is correct
- [ ] **Modifiers** - all SRD modifiers apply properly
- [ ] **Responsive design** - works on mobile and desktop
- [ ] **Browser compatibility** - test in multiple browsers

### Common Test Scenarios
1. **Empty encounter** - starts with correct base points
2. **Single adversary** - adds correctly, shows proper cost
3. **Multiple types** - combinations work properly
4. **All modifiers** - difficulty, 2+ solos, no elites, etc.
5. **Edge cases** - 0 points remaining, over budget
6. **Tier interactions** - lower tier bonuses apply correctly

## Pull Request Process

### Before Submitting
1. **Test thoroughly** - ensure no breaking changes
2. **Check formatting** - consistent with existing code
3. **Update documentation** - if adding features
4. **Single focus** - one feature or fix per PR

### PR Description Template
```markdown
## What Changed
Brief description of the change

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Data correction
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Verified calculations
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

### Review Process
1. **Automated checks** - basic validation
2. **Manual review** - code quality and functionality
3. **Testing** - verify changes work as expected
4. **Merge** - once approved by maintainers

## Community Guidelines

### Be Respectful
- **Constructive feedback** - focus on the code, not the person
- **Patient** - maintainers are volunteers
- **Inclusive** - welcoming to all skill levels

### Communication
- **Issues** - for bug reports and feature requests
- **Pull Requests** - for code contributions
- **Discussions** - for questions and ideas

## Recognition

Contributors will be recognized in:
- **GitHub contributors** list
- **Release notes** for significant contributions
- **README** for major features or improvements

## Questions?

- **Open an issue** for public discussion
- **Check existing issues** - your question might be answered
- **Be specific** - provide context and details

Thank you for helping make this tool better for the entire Daggerheart community!

---

*Built with ❤️ for the Daggerheart community*