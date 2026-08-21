import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  icon,
  action,
  badge,
}) => {
  return (
    <div className="page-header-container">
      <div>
        <div className="page-header-title-box">
          {icon && <div className="page-header-icon">{icon}</div>}
          <h1 className="page-title">{title}</h1>
          {badge}
        </div>
        {description && <p className="page-header-description">{description}</p>}
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
};
