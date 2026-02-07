import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle, Search, Edit, Trash2, MessageSquare, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Admin() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    featuredUsers: 0,
    totalRevenue: 0
  })
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})

  // Check if user is admin
  const isAdmin = profile?.email === 'tyrytr0981@gmail.com'

  useEffect(() => {
    if (!isAdmin && profile) {
      navigate('/')
      return
    }
    if (isAdmin) {
      fetchStats()
      fetchUsers()
      fetchPendingReviews()
    }
  }, [profile, isAdmin, navigate])

  const fetchStats = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*')
    const { data: subscriptions } = await supabase.from('subscriptions').select('*').eq('status', 'active')

    if (profiles) {
      setStats({
        totalUsers: profiles.length,
        premiumUsers: profiles.filter(p => p.is_premium).length,
        featuredUsers: profiles.filter(p => p.is_featured).length,
        totalRevenue: (subscriptions?.length || 0) * 9.99 // Simplified calculation
      })
    }
  }

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setUsers(data)
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fetchPendingReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, reviewer:profiles!reviews_reviewer_id_fkey(*), reviewee:profiles!reviews_reviewee_id_fkey(*)')
      .eq('is_approved', false)
    
    if (data) setReviews(data)
  }

  const toggleVerification = async (userId, currentStatus) => {
    await supabase
      .from('profiles')
      .update({ is_verified: !currentStatus })
      .eq('id', userId)
    
    fetchUsers()
  }

  const togglePremium = async (userId, currentStatus) => {
    await supabase
      .from('profiles')
      .update({ is_premium: !currentStatus })
      .eq('id', userId)
    
    fetchUsers()
    fetchStats()
  }

  const toggleFeatured = async (userId, currentStatus) => {
    await supabase
      .from('profiles')
      .update({ is_featured: !currentStatus })
      .eq('id', userId)
    
    fetchUsers()
    fetchStats()
  }

  const approveReview = async (reviewId) => {
    await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId)
    
    fetchPendingReviews()
  }

  const deleteReview = async (reviewId) => {
    await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
    
    fetchPendingReviews()
  }

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    // Delete user's messages, reviews, and profile
    await supabase.from('messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    await supabase.from('reviews').delete().or(`reviewer_id.eq.${userId},reviewee_id.eq.${userId}`)
    await supabase.from('profiles').delete().eq('id', userId)
    
    fetchUsers()
    fetchStats()
  }

  const startEditUser = (user) => {
    setEditingUser(user.id)
    setEditForm({
      name: user.name,
      role: user.role,
      bio: user.bio || '',
      is_premium: user.is_premium,
      is_verified: user.is_verified,
      is_featured: user.is_featured
    })
  }

  const saveUserEdit = async () => {
    await supabase
      .from('profiles')
      .update(editForm)
      .eq('id', editingUser)
    
    setEditingUser(null)
    fetchUsers()
    fetchStats()
  }

  const messageUser = (userId) => {
    navigate(`/messages?user=${userId}`)
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen premium-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-red-600" size={40} />
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Users className="text-red-600" size={32} />
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-500" size={32} />
              <div>
                <p className="text-gray-400 text-sm">Premium Users</p>
                <p className="text-2xl font-bold text-white">{stats.premiumUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-yellow-500" size={32} />
              <div>
                <p className="text-gray-400 text-sm">Featured Users</p>
                <p className="text-2xl font-bold text-white">{stats.featuredUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-blue-500" size={32} />
              <div>
                <p className="text-gray-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        {reviews.length > 0 && (
          <div className="glass-panel rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Pending Reviews</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="mb-2 text-white">
                    <strong>{review.reviewer.name}</strong> reviewed <strong>{review.reviewee.name}</strong>
                  </p>
                  <p className="text-gray-300 mb-3">{review.comment}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveReview(review.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Management */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white">Name</th>
                  <th className="text-left py-3 px-4 text-white">Email</th>
                  <th className="text-left py-3 px-4 text-white">Role</th>
                  <th className="text-left py-3 px-4 text-white">Status</th>
                  <th className="text-left py-3 px-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  editingUser === user.id ? (
                    <tr key={user.id} className="border-b border-white/5 bg-white/5">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="input-premium w-full"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="input-premium"
                        >
                          <option value="YouTuber">YouTuber</option>
                          <option value="Editor">Editor</option>
                          <option value="Designer">Designer</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          <label className="flex items-center gap-1 text-sm text-white">
                            <input
                              type="checkbox"
                              checked={editForm.is_premium}
                              onChange={(e) => setEditForm({...editForm, is_premium: e.target.checked})}
                            />
                            Premium
                          </label>
                          <label className="flex items-center gap-1 text-sm text-white">
                            <input
                              type="checkbox"
                              checked={editForm.is_verified}
                              onChange={(e) => setEditForm({...editForm, is_verified: e.target.checked})}
                            />
                            Verified
                          </label>
                          <label className="flex items-center gap-1 text-sm text-white">
                            <input
                              type="checkbox"
                              checked={editForm.is_featured}
                              onChange={(e) => setEditForm({...editForm, is_featured: e.target.checked})}
                            />
                            Featured
                          </label>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={saveUserEdit}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.role}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {user.is_premium && (
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">Premium</span>
                          )}
                          {user.is_verified && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Verified</span>
                          )}
                          {user.is_featured && (
                            <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => startEditUser(user)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => messageUser(user.id)}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                            title="Message User"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No users found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
