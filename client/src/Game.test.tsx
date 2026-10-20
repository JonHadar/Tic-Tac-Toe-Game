import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Game from './Game';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockResolvedValue({ json: async () => ({ X: 0, O: 0 }) });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

const winPosts = () =>
  fetchMock.mock.calls.filter(([url, init]) => url === '/api/win' && init?.method === 'POST');

async function startGame() {
  const user = userEvent.setup();
  render(<Game />);
  await user.type(screen.getByLabelText(/Player 1/), 'Alice');
  await user.type(screen.getByLabelText(/Player 2/), 'Bob');
  await user.click(screen.getByRole('button', { name: 'Start The Game' }));
  return user;
}

// Squares are labelled "Square 5", or "Square 5: X" once taken.
const square = (n: number) => screen.getByRole('button', { name: new RegExp(`^Square ${n}(:|$)`) });

async function play(user: ReturnType<typeof userEvent.setup>, squares: number[]) {
  for (const n of squares) {
    await user.click(square(n));
  }
}

describe('Game', () => {
  it('shows whose turn it is', async () => {
    const user = await startGame();
    expect(screen.getByRole('status')).toHaveTextContent('Next Player: Alice');
    await play(user, [5]);
    expect(screen.getByRole('status')).toHaveTextContent('Next Player: Bob');
  });

  it('announces the winner and reports the win once', async () => {
    const user = await startGame();
    // X: 1, 2, 3 (top row); O: 4, 5
    await play(user, [1, 4, 2, 5, 3]);

    expect(screen.getByRole('status')).toHaveTextContent('Winner: Alice');
    expect(winPosts()).toHaveLength(1);
    expect(JSON.parse(winPosts()[0][1].body)).toEqual({ winner: 'X' });

    const session = screen.getByRole('region', { name: 'Current Session' });
    expect(within(session).getAllByText('1')).toHaveLength(1);
  });

  it('does not count a win again when replaying the move history', async () => {
    const user = await startGame();
    await play(user, [1, 4, 2, 5, 3]);

    await user.click(screen.getByRole('button', { name: 'Go to move #4' }));
    await user.click(screen.getByRole('button', { name: 'Go to move #5' }));

    expect(screen.getByRole('status')).toHaveTextContent('Winner: Alice');
    expect(winPosts()).toHaveLength(1);
  });

  it('ignores clicks on a taken square or after the game is won', async () => {
    const user = await startGame();
    await play(user, [1, 1]);
    expect(screen.getByRole('status')).toHaveTextContent('Next Player: Bob');

    await play(user, [4, 2, 5, 3, 9]);
    expect(square(9)).toHaveTextContent('');
  });

  it('declares a draw on a full board with no winner', async () => {
    const user = await startGame();
    // X O X / X O O / O X X
    await play(user, [1, 2, 3, 5, 4, 6, 8, 7, 9]);
    expect(screen.getByRole('status')).toHaveTextContent("It's a draw!");
    expect(winPosts()).toHaveLength(0);
  });
});
