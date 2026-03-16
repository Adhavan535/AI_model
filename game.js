/**
 * N-Queens Game Logic
 * Manages game state, UI, and interactions
 */

class NQueensGame {
    constructor() {
        this.n = 8;
        this.board = Array(this.n).fill(-1);
        this.gameMode = 'human'; // human, ai, mixed
        this.aiDifficulty = 'hard';
        this.visualMode = '2d'; // 2d, 3d
        this.isAITurn = false;
        this.gameActive = true;
        this.ai = new NQueensAI(this.n);
        this.renderer3D = null;

        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.elements = {
            boardSize: document.getElementById('boardSize'),
            gameMode: document.getElementById('gameMode'),
            aiDifficulty: document.getElementById('aiDifficulty'),
            visualMode: document.getElementById('visualMode'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            solveBtn: document.getElementById('solveBtn'),
            board2D: document.getElementById('board2D'),
            canvas3D: document.getElementById('canvas3D'),
            modeDisplay: document.getElementById('modeDisplay'),
            sizeDisplay: document.getElementById('sizeDisplay'),
            queensCount: document.getElementById('queensCount'),
            conflictCount: document.getElementById('conflictCount'),
            status: document.getElementById('status'),
            solutionPanel: document.getElementById('solutionPanel'),
            solutionsContainer: document.getElementById('solutionsContainer'),
        };
    }

    attachEventListeners() {
        this.elements.boardSize.addEventListener('change', (e) => this.changeBoardSize(parseInt(e.target.value)));
        this.elements.gameMode.addEventListener('change', (e) => this.changeGameMode(e.target.value));
        this.elements.aiDifficulty.addEventListener('change', (e) => this.aiDifficulty = e.target.value);
        this.elements.visualMode.addEventListener('change', (e) => this.changeVisualMode(e.target.value));
        this.elements.startBtn.addEventListener('click', () => this.newGame());
        this.elements.resetBtn.addEventListener('click', () => this.resetBoard());
        this.elements.solveBtn.addEventListener('click', () => this.showSolutions());
    }

    changeBoardSize(size) {
        this.n = size;
        this.board = Array(this.n).fill(-1);
        this.ai = new NQueensAI(this.n);
        this.updateDisplay();
        this.render();
    }

    changeGameMode(mode) {
        this.gameMode = mode;
        const gameModeMaps = {
            'human': 'Human Player',
            'ai': 'AI vs AI',
            'mixed': 'Human vs AI'
        };
        this.elements.modeDisplay.textContent = gameModeMaps[mode];
        
        // Enable/disable AI difficulty based on mode
        this.elements.aiDifficulty.disabled = mode === 'human';
        
        this.resetBoard();
    }

    changeVisualMode(mode) {
        this.visualMode = mode;
        if (mode === '3d') {
            // Force recreation of 3D renderer
            this.renderer3D = null;
            setTimeout(() => {
                this.renderer3D = new NQueens3DRenderer(this.n, this.elements.canvas3D);
                if (this.renderer3D && this.renderer3D.renderer) {
                    this.render();
                }
            }, 100);
        } else {
            this.render();
        }
    }

    newGame() {
        this.resetBoard();
        this.elements.status.textContent = 'Game Started';
        
        if (this.gameMode === 'ai') {
            this.playAIGame();
        } else if (this.gameMode === 'mixed') {
            this.elements.status.textContent = 'Your turn - Place a queen';
        }
    }

    resetBoard() {
        this.board = Array(this.n).fill(-1);
        this.elements.status.textContent = this.gameMode === 'human' ? 'Place queens - no conflicts to win!' : 'Board Reset';
        this.gameActive = true;
        this.updateDisplay();
        this.render();
    }

    /**
     * Handle human player placing a queen - Allow ANY placement
     */
    placeQueen(row, col) {
        if (!this.gameActive) return;

        // Allow placement even if it creates conflicts (flexible gameplay)
        this.board[row] = col;
        this.updateDisplay();
        this.render();

        const filledRows = this.board.filter(c => c !== -1).length;
        
        // Check if board is full
        if (filledRows === this.n) {
            this.checkGameEnd();
        } else {
            // Show current status
            const conflicts = this.ai.countConflicts(this.board);
            if (conflicts > 0) {
                this.elements.status.textContent = `Conflicts detected: ${conflicts}. Continue placing...`;
            } else {
                this.elements.status.textContent = 'No conflicts yet! Continue placing...';
            }
        }
    }

    /**
     * Check game end condition and determine win/lose
     */
    checkGameEnd() {
        const conflicts = this.ai.countConflicts(this.board);
        const filledRows = this.board.filter(c => c !== -1).length;
        
        if (filledRows === this.n) {
            if (conflicts === 0) {
                this.elements.status.textContent = '✅ YOU WIN! All queens placed with no conflicts!';
            } else {
                this.elements.status.textContent = `❌ YOU LOSE! ${conflicts} conflict(s) detected. Try again!`;
            }
            this.gameActive = false;
        }
    }

    /**
     * Play AI vs AI game
     */
    async playAIGame() {
        this.board = Array(this.n).fill(-1);
        this.elements.status.textContent = 'AI is thinking...';
        
        while (true) {
            const filledRows = this.board.filter(c => c !== -1).length;
            if (filledRows === this.n) break;

            const col = this.ai.getMove(this.board, this.aiDifficulty);
            if (col === -1) {
                this.elements.status.textContent = 'No solution found';
                break;
            }

            this.board[filledRows] = col;
            this.updateDisplay();
            this.render();

            // Small delay for visualization
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (this.board.filter(c => c !== -1).length === this.n) {
            this.elements.status.textContent = `✓ AI Solved! (${this.aiDifficulty})`;
        }
        this.gameActive = false;
    }

    showSolutions() {
        this.elements.status.textContent = 'Finding all solutions...';
        const solutions = this.ai.solve();
        
        this.elements.solutionPanel.classList.add('active');
        this.elements.solutionsContainer.innerHTML = '';

        solutions.forEach((solution, index) => {
            const item = document.createElement('div');
            item.className = 'solution-item';
            item.textContent = `Solution ${index + 1}`;
            item.addEventListener('click', () => this.displaySolution(solution, index));
            this.elements.solutionsContainer.appendChild(item);
        });

        this.elements.status.textContent = `Found ${solutions.length} solution(s)`;
    }

    displaySolution(solution, index) {
        this.board = [...solution];
        this.updateDisplay();
        this.render();
        
        // Update active solution item
        document.querySelectorAll('.solution-item').forEach(item => item.classList.remove('active'));
        event.target.classList.add('active');
    }

    updateDisplay() {
        const filledRows = this.board.filter(c => c !== -1).length;
        this.elements.sizeDisplay.textContent = `${this.n}x${this.n}`;
        this.elements.queensCount.textContent = `${filledRows} / ${this.n}`;
        this.elements.conflictCount.textContent = this.ai.countConflicts(this.board);
    }

    render() {
        if (this.visualMode === '2d') {
            this.render2D();
        } else {
            this.render3D();
        }
    }

    render2D() {
        // Hide 3D and show 2D
        this.elements.canvas3D.classList.remove('active');
        this.elements.board2D.classList.add('active');

        this.elements.board2D.innerHTML = '';
        const boardElement = document.createElement('div');
        boardElement.className = 'board';
        boardElement.style.gridTemplateColumns = `repeat(${this.n}, 1fr)`;

        const threatened = this.ai.getThreatenedSquares(this.board);

        for (let row = 0; row < this.n; row++) {
            for (let col = 0; col < this.n; col++) {
                const square = document.createElement('div');
                square.className = 'square';

                // Determine square color
                const isWhite = (row + col) % 2 === 0;
                if (isWhite) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }

                // Add threat/safe indicators
                const key = `${row},${col}`;
                if (this.board[row] !== -1 && this.board[row] === col) {
                    square.classList.add('placed');
                    square.classList.add('queen');
                } else if (threatened.has(key)) {
                    square.classList.add('threat');
                } else if (this.board[row] === -1) {
                    square.classList.add('safe');
                }

                square.addEventListener('click', () => this.placeQueen(row, col));
                boardElement.appendChild(square);
            }
        }

        this.elements.board2D.appendChild(boardElement);
    }

    render3D() {
        // Hide 2D and show 3D
        this.elements.board2D.classList.remove('active');
        this.elements.canvas3D.classList.add('active');

        if (!this.renderer3D) {
            try {
                this.renderer3D = new NQueens3DRenderer(this.n, this.elements.canvas3D);
            } catch (e) {
                console.error('3D Renderer initialization error:', e);
                this.elements.status.textContent = '3D mode unavailable. Switching to 2D.';
                this.visualMode = '2d';
                this.render2D();
                return;
            }
        }

        if (this.renderer3D && this.renderer3D.render) {
            this.renderer3D.render(this.board, this.ai.getThreatenedSquares(this.board));
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new NQueensGame();
    game.newGame();
});
