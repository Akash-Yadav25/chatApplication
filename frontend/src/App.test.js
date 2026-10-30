import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PulseChat join screen with title and button', () => {
  render(<App />);
  const titleElement = screen.getByText(/PulseChat/i);
  expect(titleElement).toBeInTheDocument();

  const buttonElement = screen.getByRole('button', { name: /Enter Room/i });
  expect(buttonElement).toBeInTheDocument();
});
