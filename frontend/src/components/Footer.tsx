import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h4>{APP_NAME}</h4>
          <p>{APP_TAGLINE}</p>
        </div>
        <div className="footer-meta">
          <p>&copy; {new Date().getFullYear()} ARENA Platform. Milestone 1 Architecture Established.</p>
        </div>
      </div>
    </footer>
  );
};
