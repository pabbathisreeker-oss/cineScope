import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Film, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import useAuthStore from '@/store/useAuthStore';
import { Popover } from './Overlays';
import PATHS from '@/routes/paths';

// ==========================================
// 1. AVATAR
// ==========================================
interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Guest User',
  size = 'md',
  className,
}) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={cn(
      "rounded-full bg-zinc-800 text-text-primary border border-border flex items-center justify-center font-bold overflow-hidden select-none flex-shrink-0 aspect-square",
      {
        "h-8 w-8 text-xs": size === 'sm',
        "h-10 w-10 text-sm": size === 'md',
        "h-14 w-14 text-lg": size === 'lg',
      },
      className
    )}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

// ==========================================
// 2. USER MENU
// ==========================================
interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  className,
}) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      const result = await logout();
      if (!result.success) {
        setLogoutError(result.error || 'Failed to sign out. Please try again.');
        setIsLoggingOut(false);
        return;
      }
      setIsLoggingOut(false);
      navigate(PATHS.HOME);
    } catch (err) {
      console.error('Logout error:', err);
      setLogoutError('An unexpected error occurred. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name || 'Member';
  const displayEmail = user?.email || '';

  const triggerButton = (
    <button className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-surface-hover transition-colors focus:outline-none cursor-pointer">
      <Avatar
        src={user?.avatarUrl}
        name={displayName}
        size="sm"
      />
      {isAuthenticated && (
        <span className="hidden sm:inline text-xs font-semibold text-text-primary pr-2">
          {displayName}
        </span>
      )}
    </button>
  );

  return (
    <Popover trigger={triggerButton} className={cn("w-60 p-2", className)}>
      {isAuthenticated && user ? (
        <div className="flex flex-col space-y-3.5">
          <div className="flex items-center space-x-3 p-2 border-b border-border pb-3.5">
            <Avatar src={user.avatarUrl} name={displayName} size="md" />
            <div className="min-w-0 flex-grow">
              <p className="text-sm font-bold text-text-primary truncate">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-text-secondary truncate">{displayEmail}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <NavLink
              to={PATHS.WATCHLIST}
              className="flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Film className="h-4 w-4" />
              <span>Your Watchlist</span>
            </NavLink>
            <NavLink
              to={PATHS.PROFILE}
              className="flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Profile & Settings</span>
            </NavLink>
          </div>

          {logoutError && (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[11px] leading-tight">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{logoutError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer text-left border-t border-border pt-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-3 text-center">
          <p className="text-xs text-text-secondary mb-3 leading-normal">
            Sign in to synchronize watchlists and personalize recommendations.
          </p>
          <NavLink
            to={PATHS.SIGN_IN}
            className="block w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm text-center"
          >
            Sign In
          </NavLink>
        </div>
      )}
    </Popover>
  );
};

export default UserMenu;

