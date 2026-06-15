import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';

interface VerifiedBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerifiedBadge({ verified, size = 'md' }: VerifiedBadgeProps) {
  const { t } = useTranslation();

  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className="group relative inline-flex">
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        className={`${sizeClasses[size]} text-emerald-600 dark:text-emerald-400 inline`}
      />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {t("provider.verified_by_mfa") || "Verified by MyFutureAbroad"}
      </span>
    </span>
  );
}
