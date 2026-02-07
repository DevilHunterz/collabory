import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProfileCard from '../components/ProfileCard'
import { Search, Filter } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Discover() {
  const [profiles, setProfiles] = useState([])
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    filterAndSortProfiles()
  }, [profiles, searchTerm, roleFilter, sortBy])

  const fetchProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (!error && data) {
      setProfiles(data)
    }
    setLoading(false)
  }

  const filterAndSortProfiles = () => {
    let filtered = [...profiles]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(p => p.role === roleFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'reviews':
          return (b.review_count || 0) - (a.review_count || 0)
        default:
          return 0
      }
    })

    // Featured profiles first
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      return 0
    })

    setFilteredProfiles(filtered)
  }

  return (
    <div className="min-h-screen premium-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Discover Creators
        </h1>

        {/* Filters */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-premium"
              >
                <option value="all">All Roles</option>
                <option value="YouTuber">YouTuber</option>
                <option value="Editor">Editor</option>
                <option value="Designer">Designer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-premium"
              >
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No creators found matching your criteria</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              Found {filteredProfiles.length} creator{filteredProfiles.length !== 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
