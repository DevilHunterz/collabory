import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, Search, MessageCircle, User, Shield, LogOut, Settings, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const isAdmin = profile?.email === 'tyrytr0981@gmail.com'

  const handleSignOut = async () => {
    await signOut()
    setShowProfileMenu(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Search, label: 'Discover' },
    ...(user ? [
      { to: '/messages', icon: MessageCircle, label: 'Messages' },
      { to: '/profile', icon: User, label: 'Profile' },
    ] : []),
  ]

  // Mock notifications - in production, fetch from database
  const notifications = []

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-6 w-full z-50 flex justify-center px-4"
    >
      <div className="navbar-pill flex items-center gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-full transition-all duration-300">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-950 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10"></div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-full transition-all duration-300 flex items-center gap-2"
            >
              <Shield size={14} />
              Admin
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10"></div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white/5 rounded-full transition-all duration-300 relative"
                >
                  <Bell size={18} className="text-gray-400 hover:text-white transition-colors" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-3 w-80 bg-black/95 backdrop-blur-xl border border-red-900/20 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-red-900/10">
                          <p className="text-sm font-semibold text-white">Notifications</p>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notif, idx) => (
                              <div key={idx} className="px-4 py-3 hover:bg-red-900/10 border-b border-red-900/5 transition-all">
                                <p className="text-sm text-white">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-red-900/50 transition-all duration-300"
                >
                  <img
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=8b0000&color=ffffff&bold=true&format=svg`}
                    alt={profile?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl border border-red-900/20 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-red-900/10">
                          <p className="text-sm font-semibold text-white truncate">{profile?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-red-900/10 transition-all duration-200"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-red-900/10 transition-all duration-200"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Shield size={16} />
                              Admin Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-red-900/10">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all duration-200 w-full"
                          >
                            <LogOut size={16} />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {!user && (
            <Link to="/auth">
              <button className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 rounded-full transition-all duration-300">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
