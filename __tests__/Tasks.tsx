import 'react-native';
import React from 'react';
import {render} from '../app/utils/test-utils';

import LabsListScreen from '../app/screens/Tasks';

test('Renders the screen', () => {
  let {getByPlaceholderText} = render(<LabsListScreen />, {});
  getByPlaceholderText('New Task');
});
