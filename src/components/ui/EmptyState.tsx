interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = '🔍', title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <p className="text-text-primary font-semibold text-lg mb-1">{title}</p>
      {subtitle && <p className="text-text-muted text-sm">{subtitle}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4">{action.label}</button>
      )}
    </div>
  );
}
