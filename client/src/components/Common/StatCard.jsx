import React from 'react';

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'cyan',
  trend,
  isWarning = false,
  badgeText
}) {
  const variantStyles = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      glow: 'shadow-cyan-glow',
      text: 'text-cyan-400',
      bgIcon: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40'
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      glow: 'shadow-emerald-glow',
      text: 'text-emerald-400',
      bgIcon: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      glow: 'shadow-amber-glow',
      text: 'text-amber-400',
      bgIcon: 'bg-amber-950/60 text-amber-400 border-amber-500/40'
    },
    red: {
      border: 'border-rose-500/40 hover:border-rose-500/80',
      glow: 'shadow-red-glow',
      text: 'text-rose-400',
      bgIcon: 'bg-rose-950/60 text-rose-400 border-rose-500/40'
    }
  };

  const style = variantStyles[variant] || variantStyles.cyan;

  return (
    <div className={`relative aero-card p-4 transition-all duration-200 border ${style.border} ${isWarning ? 'border-rose-500/60 animate-pulse' : ''}`}>
      <div className="reticle-corner-tl opacity-60" />
      <div className="reticle-corner-tr opacity-60" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {badgeText && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${style.bgIcon}`}>
                {badgeText}
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl font-bold font-mono tracking-tight ${isWarning ? 'text-rose-400' : 'text-slate-100'}`}>
              {value}
            </span>
            {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${style.bgIcon} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={trend.startsWith('+') ? 'text-emerald-400' : trend.startsWith('-') ? 'text-amber-400' : 'text-slate-400'}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
