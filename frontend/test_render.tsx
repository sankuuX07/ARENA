import React from 'react';
import { renderToString } from 'react-dom/server';
import { LoginPage } from './src/pages/LoginPage';
import { MemoryRouter } from 'react-router-dom';

// We have to hack into the AuthContext because it's not exported
import * as AuthContextModule from './src/context/AuthContext';
// Find the context object inside the module (it's the only one without a name exported but we can't get it easily)
// Actually we can just mock useAuth
jest.mock('./src/context/AuthContext', () => ({
  useAuth: () => ({ currentUser: null, userProfile: null, login: () => {}, logout: () => {}, register: () => {}, resetPassword: () => {}, loading: false }),
}));

try {
  const html = renderToString(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  console.log("RENDER SUCCESS, length:", html.length);
} catch (e) {
  console.error("RENDER ERROR:", e);
}
