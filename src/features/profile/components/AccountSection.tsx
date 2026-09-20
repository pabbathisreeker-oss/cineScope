import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Key, Shield, LogOut, X, Check, Loader2 } from 'lucide-react';
import SettingsCard from './SettingsCard';
import useProfileStore from '../store/useProfileStore';
import useAuthStore from '@/store/useAuthStore';
import PATHS from '@/routes/paths';

export const AccountSection: React.FC = () => {
  const { profile, updateProfile, isEditModalOpen, setEditModalOpen, isPasswordModalOpen, setPasswordModalOpen, showToast } = useProfileStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (!result.success) {
        showToast(result.error || 'Failed to sign out. Please try again.');
        setIsLoggingOut(false);
        return;
      }
      setIsLoggingOut(false);
      navigate(PATHS.HOME);
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Failed to sign out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  // Local Form States
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [genreInput, setGenreInput] = useState(profile.favoriteGenre);


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || profile.name,
      email: emailInput.trim() || profile.email,
      favoriteGenre: genreInput.trim() || profile.favoriteGenre,
    });
    setEditModalOpen(false);
    showToast('Profile information successfully updated.');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully.');
  };

  return (
    <>
      <SettingsCard
        title="Account & Security"
        description="Manage your account profile details, security, and membership status."
        icon={<UserCheck className="h-5 w-5" />}
      >
        <div className="space-y-3 pt-1">
          {/* Edit Profile Entry */}
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <span className="text-xs md:text-sm font-semibold text-white block">
                Edit Profile Information
              </span>
              <p className="text-[11px] text-text-secondary">
                Update display name, contact email, and genre preferences.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNameInput(profile.name);
                setEmailInput(profile.email);
                setGenreInput(profile.favoriteGenre);
                setEditModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Edit Profile
            </motion.button>
          </div>

          {/* Change Password Entry */}
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <span className="text-xs md:text-sm font-semibold text-white block">
                Change Password
              </span>
              <p className="text-[11px] text-text-secondary">
                Update your account password and security keys.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPasswordModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Key className="h-3.5 w-3.5 text-amber-400" />
              <span>Change Password</span>
            </motion.button>
          </div>

          {/* Subscription Status */}
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <span className="text-xs md:text-sm font-semibold text-white flex items-center space-x-1.5">
                <span>CineScope Pro Membership</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </span>
              <p className="text-[11px] text-text-secondary">
                Unlimited 4K HDR playback and AI cinema curation enabled.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing Out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out of CineScope</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </SettingsCard>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#111115] border border-white/15 p-6 shadow-premium select-none"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">Edit Profile</h3>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="p-1 rounded-full text-text-muted hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Favorite Genre
                  </label>
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-text-secondary hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground shadow-glow-gold flex items-center space-x-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal Dialog */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#111115] border border-white/15 p-6 shadow-premium select-none"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white flex items-center space-x-2">
                  <Key className="h-5 w-5 text-amber-400" />
                  <span>Change Password</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="p-1 rounded-full text-text-muted hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-text-secondary hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-xs font-bold text-primary-foreground shadow-glow-gold"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccountSection;
