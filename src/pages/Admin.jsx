import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
      .limit(20)
    
    if (data) setUsers(data)
  }

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

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Users className="text-primary-600" size={32} />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" size={32} />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Premium Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.premiumUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-yellow-600" size={32} />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Featured Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.featuredUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-blue-600" size={32} />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Pending Reviews</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="mb-2 text-gray-900 dark:text-white">
                    <strong>{review.reviewer.name}</strong> reviewed <strong>{review.reviewee.name}</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Role</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.role}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.rating.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => toggleVerification(user.id, user.is_verified)}
                          className={`px-3 py-1 rounded text-sm ${
                            user.is_verified
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {user.is_verified ? 'Verified' : 'Verify'}
                        </button>
                        <button
                          onClick={() => togglePremium(user.id, user.is_premium)}
                          className={`px-3 py-1 rounded text-sm ${
                            user.is_premium
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {user.is_premium ? 'Premium' : 'Make Premium'}
                        </button>
                        <button
                          onClick={() => toggleFeatured(user.id, user.is_featured)}
                          className={`px-3 py-1 rounded text-sm ${
                            user.is_featured
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {user.is_featured ? 'Featured' : 'Feature'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
