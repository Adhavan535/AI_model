/**
 * N-Queens AI Solver Module
 * Implements different AI strategies for solving the N-Queens problem
 */

class NQueensAI {
    constructor(n) {
        this.n = n;
        this.solutions = [];
    }

    /**
     * Check if placing a queen at (row, col) is safe
     */
    isSafe(board, row, col) {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i] === col) return false;
        }

        // Check upper-left diagonal
        for (let i = 0; i < row; i++) {
            if (Math.abs(board[i] - col) === Math.abs(i - row)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Count conflicts on the board (for difficulty levels)
     */
    countConflicts(board) {
        let conflicts = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = i + 1; j < board.length; j++) {
                if (board[i] !== -1 && board[j] !== -1) {
                    if (Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
                        conflicts++;
                    }
                }
            }
        }
        return conflicts;
    }

    /**
     * Solve using backtracking algorithm
     */
    solve(board = null) {
        if (!board) {
            board = Array(this.n).fill(-1);
        }

        const result = [];

        const backtrack = (row) => {
            if (row === this.n) {
                result.push([...board]);
                return;
            }

            for (let col = 0; col < this.n; col++) {
                if (this.isSafe(board, row, col)) {
                    board[row] = col;
                    backtrack(row + 1);
                    board[row] = -1;
                }
            }
        };

        backtrack(0);
        this.solutions = result;
        return result;
    }

    /**
     * AI: Easy difficulty - Random valid moves
     */
    getEasyMove(board) {
        const validMoves = [];
        const filledRows = board.filter(col => col !== -1).length;

        for (let col = 0; col < this.n; col++) {
            const testBoard = [...board];
            testBoard[filledRows] = col;
            if (this.isSafe(testBoard, filledRows, col)) {
                validMoves.push(col);
            }
        }

        if (validMoves.length === 0) return -1;
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    /**
     * AI: Medium difficulty - Smart heuristic (minimize future conflicts)
     */
    getMediumMove(board) {
        const filledRows = board.filter(col => col !== -1).length;
        let bestCol = -1;
        let bestScore = -Infinity;

        for (let col = 0; col < this.n; col++) {
            const testBoard = [...board];
            testBoard[filledRows] = col;

            if (this.isSafe(testBoard, filledRows, col)) {
                // Score based on future viability
                let score = 0;
                for (let futureRow = filledRows + 1; futureRow < this.n; futureRow++) {
                    for (let futureCol = 0; futureCol < this.n; futureCol++) {
                        const tempBoard = [...testBoard];
                        tempBoard[futureRow] = futureCol;
                        if (this.isSafe(tempBoard, futureRow, futureCol)) {
                            score++;
                        }
                    }
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestCol = col;
                }
            }
        }

        return bestCol;
    }

    /**
     * AI: Hard difficulty - Optimal solution using backtracking
     */
    getHardMove(board) {
        const filledRows = board.filter(col => col !== -1).length;

        if (filledRows === 0) {
            // First move: use optimal starting position
            return Math.floor(this.n / 2);
        }

        // Try to find a move that leads to a valid solution
        for (let col = 0; col < this.n; col++) {
            const testBoard = [...board];
            testBoard[filledRows] = col;

            if (this.isSafe(testBoard, filledRows, col)) {
                // Check if this move can lead to a solution
                if (this.canSolveFromHere(testBoard, filledRows + 1)) {
                    return col;
                }
            }
        }

        // Fallback to medium strategy if no solution found
        return this.getMediumMove(board);
    }

    /**
     * Check if board can be solved from current state (backtracking check)
     */
    canSolveFromHere(board, row) {
        if (row === this.n) return true;

        for (let col = 0; col < this.n; col++) {
            const testBoard = [...board];
            testBoard[row] = col;
            if (this.isSafe(testBoard, row, col)) {
                if (this.canSolveFromHere(testBoard, row + 1)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get AI move based on difficulty
     */
    getMove(board, difficulty = 'hard') {
        switch (difficulty) {
            case 'easy':
                return this.getEasyMove(board);
            case 'medium':
                return this.getMediumMove(board);
            case 'hard':
            default:
                return this.getHardMove(board);
        }
    }

    /**
     * Get all valid moves for current position
     */
    getValidMoves(board) {
        const filledRows = board.filter(col => col !== -1).length;
        const validMoves = [];

        for (let col = 0; col < this.n; col++) {
            const testBoard = [...board];
            testBoard[filledRows] = col;
            if (this.isSafe(testBoard, filledRows, col)) {
                validMoves.push(col);
            }
        }

        return validMoves;
    }

    /**
     * Check if board is complete valid solution
     */
    isValidSolution(board) {
        if (board.filter(col => col !== -1).length !== this.n) {
            return false;
        }

        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                if (Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get threatened squares from current queen positions
     */
    getThreatenedSquares(board) {
        const threatened = new Set();

        for (let row = 0; row < this.n; row++) {
            if (board[row] !== -1) {
                const col = board[row];

                // Mark queen position
                threatened.add(`${row},${col}`);

                // Mark column
                for (let i = 0; i < this.n; i++) {
                    if (i !== row) threatened.add(`${i},${col}`);
                }

                // Mark diagonals
                for (let i = 0; i < this.n; i++) {
                    if (Math.abs(row - i) === Math.abs(col - board[i === row ? -1 : row])) {
                        for (let j = 0; j < this.n; j++) {
                            if (Math.abs(row - i) === Math.abs(col - j)) {
                                threatened.add(`${i},${j}`);
                            }
                        }
                    }
                }

                // Mark left-up to right-down diagonal
                for (let i = -this.n; i < this.n; i++) {
                    const r = row + i;
                    const c = col + i;
                    if (r >= 0 && r < this.n && c >= 0 && c < this.n) {
                        threatened.add(`${r},${c}`);
                    }
                }

                // Mark left-down to right-up diagonal
                for (let i = -this.n; i < this.n; i++) {
                    const r = row + i;
                    const c = col - i;
                    if (r >= 0 && r < this.n && c >= 0 && c < this.n) {
                        threatened.add(`${r},${c}`);
                    }
                }
            }
        }

        return threatened;
    }
}
