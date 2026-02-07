import { Link } from 'react-router-dom'
import { Star, CheckCircle, Crown, ArrowRight, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfileCard({ profile }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel p-6 rounded-2xl group h-full flex flex-col elite-cursor"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-red-600/30 transition-colors">
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=dc2626&color=ffffff&bold=true&format=svg`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            {profile.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center border-2 border-[#000000] shadow-lg">
                <CheckCircle size={14} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                {profile.name}
              </h3>
              {profile.is_premium && (
                <div className="premium-badge text-[10px] px-2 py-0.5 rounded-md">
                  <Crown size={10} />
                  PRO
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{profile.role}</p>
            
            {profile.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-red-500 fill-red-500" />
                <span className="text-sm font-semibold text-white">{profile.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({profile.review_count})</span>
              </div>
            )}
          </div>
        </div>
        
        {profile.is_featured && (
          <div className="premium-badge text-[10px] px-2 py-0.5 rounded-md flex-shrink-0">
            Featured
          </div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-5 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 3).map((skill, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 font-medium hover:bg-red-600/10 hover:border-red-600/30 transition-all elite-cursor"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-500 font-medium">
                +{profile.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
        <Link to={`/profile/${profile.id}`} className="flex-1">
          <button className="w-full px-4 py-2.5 premium-button text-sm rounded-lg flex items-center justify-center gap-2 group elite-cursor">
            View Profile
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>
        <Link to={`/messages?user=${profile.id}`}>
          <button className="px-4 py-2.5 secondary-button text-sm rounded-lg flex items-center gap-2 elite-cursor">
            <MessageCircle size={14} />
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
