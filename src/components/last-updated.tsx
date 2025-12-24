'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DeploymentInfo {
  lastUpdated: string;
  deploymentId: string;
  environment: string;
  url?: string;
}

export function LastUpdated() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDeploymentInfo = async () => {
      try {
        const response = await fetch('/api/deployment');
        if (!response.ok) {
          throw new Error('Failed to fetch deployment info');
        }
        const data = await response.json();
        setDeploymentInfo(data);
      } catch (err) {
        console.error('Error fetching deployment info:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentInfo();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return tCommon('justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return tCommon('minutesAgo', { minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return tCommon('hoursAgo', { hours });
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return tCommon('daysAgo', { days });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <Clock className="h-4 w-4 animate-spin" />
        <span className="text-sm">{tCommon('loading')}</span>
      </div>
    );
  }

  if (error || !deploymentInfo) {
    return (
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">{t('lastUpdated', { time: 'Unknown' })}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
      <Calendar className="h-4 w-4" />
      <div className="text-sm">
        <span 
          className="font-medium"
          title={formatDate(deploymentInfo.lastUpdated)}
        >
          {t('lastUpdated', { time: getRelativeTime(deploymentInfo.lastUpdated) })}
        </span>
      </div>
    </div>
  );
}
