# N-Queens AI Game - 3D Visualization

A web-based interactive N-Queens solver game with 3D visualization, featuring AI vs AI gameplay and human player challenges.

## Features

✨ **Multiple Game Modes:**
- **Human Player**: Solve the puzzle yourself
- **AI vs AI**: Watch the AI solve the puzzle
- **Human vs AI**: Compete with different AI difficulties

🎮 **AI Difficulty Levels:**
- **Easy**: Random valid moves (exploration mode)
- **Medium**: Smart heuristic-based moves (balanced)
- **Hard**: Optimal backtracking solutions (expert mode)

📊 **Board Sizes:**
- Configurable from 4x4 to 12x12
- Dynamically adjust complexity

🎨 **Visualization Modes:**
- **2D Grid View**: Traditional checkerboard with click-to-place queens
- **3D Model View**: Interactive 3D board with animated queens

## How to Use

1. **Open the Game**
   - Simply open `index.html` in a modern web browser
   - No installation or build process required!

2. **Select Game Settings**
   - Choose board size (4-12)
   - Select game mode (Human, AI, or Mixed)
   - Choose AI difficulty level (Easy, Medium, Hard)
   - Pick visualization (2D or 3D)

3. **Play the Game**
   - **Human Player Mode**: Click on squares to place queens
   - **AI vs AI Mode**: Watch the AI solve the puzzle automatically
   - **Human vs AI Mode**: Alternate turns with the AI

4. **Game Controls**
   - **New Game**: Start a fresh game
   - **Reset Board**: Clear all queens and start over
   - **Show Solution**: Find all possible solutions and browse them

## Game Rules

The N-Queens problem requires placing N queens on an NxN chessboard such that:
- Each row contains exactly one queen
- No two queens attack each other (same column or diagonal)

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **3D Graphics**: Three.js
- **Algorithm**: Backtracking with optimizations

## File Structure

```
nqueens-game/
├── index.html          # Main HTML file
├── style.css          # Styling and layout
├── game.js            # Game logic and UI management
├── ai.js              # AI solver algorithms
├── 3d-renderer.js     # Three.js 3D visualization
└── README.md          # This file
```

## Algorithm Explanation

### N-Queens Solver
The core algorithm uses **backtracking** with the following approach:

1. **Placement Strategy**: Place one queen per row
2. **Validity Check**: For each placement, verify no conflicts with previously placed queens
3. **Recursion**: If valid, move to next row; if not, try different column
4. **Backtrack**: If no valid position found, return to previous row

### AI Difficulty Levels

**Easy Mode (Random)**
- Selects randomly from all valid moves
- Fun for learning the problem

**Medium Mode (Smart Heuristic)**
- Evaluates each move by counting future valid placements
- Selects move with most remaining options
- More intelligent but still shows variations

**Hard Mode (Optimal)**
- Uses full backtracking to find valid solutions
- Verifies each move can lead to a complete solution
- Always finds the optimal path

## Interactive Features

### 2D Mode
- Click any square to place a queen
- Color coding:
  - **Blue**: Placed queen
  - **Green**: Safe square (no conflicts)
  - **Red**: Threatened square (under attack)
  - **Standard**: Empty squares

### 3D Mode
- 3D rendered board with animated queens
- Rotating camera for dynamic perspective
- Color-coded threats same as 2D mode
- Smooth animations and transitions

## Performance

- Handles up to 12x12 boards smoothly
- 3D rendering optimized with WebGL
- AI solving times:
  - 8x8: < 1 second
  - 10x10: 1-2 seconds
  - 12x12: 2-5 seconds (depending on difficulty)

## Browser Compatibility

Works best on modern browsers with WebGL support:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Chrome Mobile

## Tips for Playing

1. **Starting Out**: Try 4x4 or 5x5 first to learn the rules
2. **Watch AI**: Use AI vs AI mode to see solution strategies
3. **Learn Patterns**: Study the AI's moves to understand the problem
4. **Use 3D View**: For larger boards, the 3D view provides better visualization
5. **Show Solutions**: Use the solution browser to see all possible arrangements

## Fun Facts about N-Queens

- 4x4: 2 solutions
- 8x8: 92 solutions
- 10x10: 724 solutions
- 12x12: 14,200 solutions

## Future Enhancements

- Save/load game states
- Multiplayer mode
- Performance statistics
- Custom color themes
- Mobile touch optimization
- Sound effects and animations

## License

Open source project for educational purposes.

## Author

Created as an AI project to explore the N-Queens problem with interactive visualization.

---

Enjoy solving the N-Queens puzzle! 👑♛
