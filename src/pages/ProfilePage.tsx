import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Bell, Info, Moon, Sparkles, Check } from 'lucide-react';
import useProfileStore, { type AccentColor } from '@/features/profile/store/useProfileStore';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import StatsCards from '@/features/profile/components/StatsCards';
import SettingsCard from '@/features/profile/components/SettingsCard';
import ToggleSwitch from '@/features/profile/components/ToggleSwitch';
import AccountSection from '@/features/profile/components/AccountSection';
import Toast from '@/components/ui/Toast';

const ACCENT_COLORS: { id: AccentColor; name: string; bgClass: string; hex: string }[] = [
  { id: 'gold', name: 'Cinematic Gold', bgClass: 'bg-[#D4A15A]', hex: '#D4A15A' },
  { id: 'violet', name: 'Muted Violet', bgClass: 'bg-[#7C6FF0]', hex: '#7C6FF0' },
  { id: 'emerald', name: 'Cyber Emerald', bgClass: 'bg-[#10b981]', hex: '#10b981' },
  { id: 'purple', name: 'Obsidian Purple', bgClass: 'bg-[#8b5cf6]', hex: '#8b5cf6' },
  { id: 'cyan', name: 'Neon Cyan', bgClass: 'bg-[#06b6d4]', hex: '#06b6d4' },
];

export const ProfilePage: React.FC = () => {
  const {
    profile,
    settings,
    toggleSetting,
    setAccentColor,
    setEditModalOpen,
    toastMessage,
    hideToast,
    showToast,
  } = useProfileStore();

  const handleAccentChange = (color: AccentColor, name: string) => {
    setAccentColor(color);
    showToast(`Accent color set to ${name}.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col"
    >
      {/* 1. Header Section */}
      <ProfileHeader
        profile={profile}
        onEditClick={() => setEditModalOpen(true)}
      />

      {/* 2. Quick Stats Grid */}
      <StatsCards profile={profile} />

      {/* 3. Settings Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
        {/* Left Column: Appearance & Notifications */}
        <div className="space-y-6">
          {/* Appearance Settings Card */}
          <SettingsCard
            title="Appearance"
            description="Customize display theme and visual color accents."
            icon={<Palette className="h-5 w-5" />}
          >
            <ToggleSwitch
              checked={settings.darkTheme}
              onChange={() => {
                toggleSetting('darkTheme');
                showToast(settings.darkTheme ? 'Light mode enabled (UI preview).' : 'Dark obsidian mode active.');
              }}
              label="Dark Theme"
              description="Obsidian dark mode optimized for OLED displays."
              icon={<Moon className="h-4 w-4 text-purple-400" />}
            />

            <div className="py-3 border-b border-white/5 select-none">
              <label className="text-xs md:text-sm font-semibold text-white block mb-1">
                Accent Theme Color
              </label>
              <p className="text-[11px] text-text-secondary mb-3">
                Choose primary accent highlight color across CineScope.
              </p>

              <div className="flex items-center space-x-3">
                {ACCENT_COLORS.map((color) => {
                  const isSelected = settings.accentColor === color.id;
                  return (
                    <motion.button
                      key={color.id}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAccentChange(color.id, color.name)}
                      className={`relative w-8 h-8 rounded-full ${color.bgClass} flex items-center justify-center cursor-pointer shadow-md transition-transform ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      title={color.name}
                    >
                      {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </SettingsCard>

          {/* Notification Settings Card */}
          <SettingsCard
            title="Notifications"
            description="Control how and when you receive cinema alerts."
            icon={<Bell className="h-5 w-5" />}
          >
            <ToggleSwitch
              checked={settings.recommendationAlerts}
              onChange={() => {
                toggleSetting('recommendationAlerts');
                showToast(`Recommendation alerts ${!settings.recommendationAlerts ? 'enabled' : 'disabled'}.`);
              }}
              label="Recommendation Alerts"
              description="Receive personalized AI movie recommendations."
              icon={<Sparkles className="h-4 w-4 text-amber-400" />}
            />

            <ToggleSwitch
              checked={settings.newReleaseAlerts}
              onChange={() => {
                toggleSetting('newReleaseAlerts');
                showToast(`New release notifications ${!settings.newReleaseAlerts ? 'enabled' : 'disabled'}.`);
              }}
              label="New Release Alerts"
              description="Get notified when bookmarked titles premiere."
              icon={<Bell className="h-4 w-4 text-primary" />}
            />

            <ToggleSwitch
              checked={settings.weeklyDigest}
              onChange={() => {
                toggleSetting('weeklyDigest');
                showToast(`Weekly CineDigest ${!settings.weeklyDigest ? 'subscribed' : 'unsubscribed'}.`);
              }}
              label="Weekly CineDigest"
              description="Curated weekly roundup of top trending releases."
            />
          </SettingsCard>
        </div>

        {/* Right Column: Account & About */}
        <div className="space-y-6">
          {/* Account Section */}
          <AccountSection />

          {/* About & System Info Settings Card */}
          <SettingsCard
            title="About & System"
            description="Platform specifications, release notes, and credits."
            icon={<Info className="h-5 w-5" />}
          >
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-text-secondary">App Version</span>
                <span className="text-white font-mono font-bold">v2.4.0 (Build 8920)</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-text-secondary">Environment</span>
                <span className="text-emerald-400 font-semibold">Production Ready</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-text-secondary">Tech Stack</span>
                <span className="text-white font-medium">React • Tailwind CSS • Framer Motion</span>
              </div>

              <div className="pt-2 text-center text-text-muted text-[11px]">
                <p>© 2026 CineScope Inc. All rights reserved.</p>
                <p className="mt-0.5">Crafted for movie lovers worldwide.</p>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      {/* Toast Notification Container */}
      <Toast
        isOpen={Boolean(toastMessage)}
        message={toastMessage || ''}
        type="success"
        onClose={hideToast}
        duration={3500}
      />
    </motion.div>
  );
};

export default ProfilePage;
