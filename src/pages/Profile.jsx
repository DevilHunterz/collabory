import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, uploadAvatar } from '../lib/supabase'
import { Star, Edit, Crown, CheckCircle, Mail, Loader2, Camera, X, Check } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { id } = useParams()
  const { user, profile: currentProfile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  const isOwnProfile = !id || id === user?.id

  useEffect(() => {
    const loadProfile = async () => {
      if (!user && isOwnProfile) {
        navigate('/auth')
        return
      }

      if (isOwnProfile && currentProfile) {
        setProfile(currentProfile)
        setEditData(currentProfile)
        await fetchReviews(currentProfile.id)
        setLoading(false)
      } else if (id) {
        await fetchProfile(id)
        await fetchReviews(id)
      } else if (isOwnProfile && user) {
        await createProfile()
      } else {
        setLoading(false)
      }
    }

    loadProfile()

    if (isOwnProfile && user) {
      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            setProfile(payload.new)
            setEditData(payload.new)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [id, currentProfile, user, isOwnProfile, navigate])

  const createProfile = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        role: 'Other',
        skills: [],
        bio: '',
        avatar_url: user.user_metadata?.avatar_url || null,
        portfolio_links: {},
        availability_status: 'available'
      })
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
      setEditData(data)
      await refreshProfile()
    }
    setLoading(false)
  }

  const fetchProfile = async (profileId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()
    
    if (data) {
      setProfile(data)
      setEditData(data)
    } else if (error) {
      console.error('Profile fetch error:', error)
    }
    setLoading(false)
  }

  const fetchReviews = async (profileId) => {
    const { data } = await supabase
      .from('reviews')
      .select('*, reviewer:profiles!reviews_reviewer_id_fkey(*)')
      .eq('reviewee_id', profileId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (data) setReviews(data)
  }

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update(editData)
      .eq('id', user.id)
    
    if (!error) {
      await refreshProfile()
      setIsEditing(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploading(true)
    try {
      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop()
        await supabase.storage.from('avatars').remove([oldFileName])
      }

      const url = await uploadAvatar(file, user.id)
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id)
      
      if (error) throw error
      
      setEditData({ ...editData, avatar_url: url })
      await refreshProfile()
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Failed to upload avatar: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to leave a review')
      return
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: user.id,
        reviewee_id: profile.id,
        rating: newReview.rating,
        comment: newReview.comment
      })

    if (!error) {
      fetchReviews(profile.id)
      fetchProfile(profile.id)
      setNewReview({ rating: 5, comment: '' })
    } else {
      alert('You may have already reviewed this user')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen premium-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Profile not found</p>
          <button
            onClick={() => navigate('/discover')}
            className="premium-button"
          >
            Browse Creators
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen premium-bg">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-12 px-4 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent"></div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="avatar-premium w-40 h-40">
                <img
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=400&background=6366f1&color=ffffff&bold=true&format=svg`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              
              {profile.is_verified && (
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0a0a0a]">
                  <CheckCircle size={20} className="text-white" />
                </div>
              )}
              
              {isEditing && !uploading && (
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-indigo-600 hover:to-purple-700 shadow-lg border-2 border-[#0a0a0a] transition-all">
                  <Camera size={18} className="text-white" />
                  <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="input-premium text-3xl font-bold"
                    placeholder="Your name"
                  />
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="input-premium"
                  >
                    <option value="YouTuber">YouTuber</option>
                    <option value="Editor">Video Editor</option>
                    <option value="Designer">Designer</option>
                    <option value="Developer">Developer</option>
                    <option value="Writer">Writer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h1 className="text-4xl font-bold text-white">
                      {profile.name}
                    </h1>
                    {profile.is_premium && (
                      <div className="premium-badge">
                        <Crown size={14} />
                        PRO
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-gray-400 mb-4">{profile.role}</p>
                  {profile.rating > 0 && (
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < Math.round(profile.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{profile.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({profile.review_count} reviews)</span>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {isOwnProfile ? (
                  isEditing ? (
                    <>
                      <button onClick={handleUpdate} className="btn-premium btn-primary">
                        <Check size={18} />
                        Save Changes
                      </button>
                      <button onClick={() => setIsEditing(false)} className="btn-premium btn-secondary">
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-premium btn-primary">
                      <Edit size={18} />
                      Edit Profile
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => navigate(`/messages?user=${profile.id}`)}
                    className="btn-premium btn-primary"
                  >
                    <Mail size={18} />
                    Send Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          {['about', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-semibold transition-all relative ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Bio */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                About
              </h3>
              {isEditing ? (
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself, your experience, and what you're looking for..."
                  className="input-premium"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {profile.bio || 'No bio yet.'}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.skills?.join(', ') || ''}
                    onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="e.g. Video Editing, Motion Graphics, Color Grading"
                    className="input-premium"
                  />
                  <p className="text-sm text-gray-500">Separate skills with commas</p>
                </div>
              ) : profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </div>

            {/* Availability */}
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Availability Status</h3>
              {isEditing ? (
                <select
                  value={editData.availability_status}
                  onChange={(e) => setEditData({ ...editData, availability_status: e.target.value })}
                  className="input-premium"
                >
                  <option value="available">Available for work</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Not available</option>
                </select>
              ) : (
                <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                  profile.availability_status === 'available'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : profile.availability_status === 'busy'
                    ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                    : 'bg-gray-500/10 border border-gray-500/30 text-gray-400'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    profile.availability_status === 'available' ? 'bg-green-500' :
                    profile.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  {profile.availability_status === 'available' ? 'Available for work' :
                   profile.availability_status === 'busy' ? 'Currently busy' : 'Not available'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {!isOwnProfile && user && (
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Leave a Review</h3>
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: n })}
                          className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                            newReview.rating === n
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          {n} ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience working with this person..."
                      className="input-premium"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-premium btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="card-premium p-12 text-center">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="card-premium p-6">
                    <div className="flex items-start gap-4">
                      <div className="avatar-premium w-12 h-12 flex-shrink-0">
                        <img
                          src={review.reviewer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer.name)}&size=100&background=6366f1&color=ffffff&bold=true&format=svg`}
                          alt={review.reviewer.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="font-semibold text-white">{review.reviewer.name}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-3">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
