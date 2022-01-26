import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { Application } from './Application';

test('Application component renders welcome message', () => {
  const { getByText } = render(<Application />);
  getByText('Jest will click me').click();
  expect(getByText('Hello!')).toBeInTheDocument();
});
