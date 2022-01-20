// test-utils.js
import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../store/store';
import {ThemeProvider} from '../theme/useTheme';

// Navigation
import RootNavigation from '../routes/RootNavigation';

const AllTheProviders = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </Provider>
  );
};

const customRender = (ui, options) =>
  render(ui, {wrapper: AllTheProviders, ...options});

// re-export everything
export * from '@testing-library/react-native';

// override render method
export {customRender as render};