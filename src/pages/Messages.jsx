import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, uploadMessageFile } from '../lib/supabase'
import { Send, Paperclip, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Messages() {
  const { user, profile } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchConversations()
      subscribeToMessages()
      
      // Check if there's a user parameter in URL
      const userId = searchParams.get('user')
      if (userId) {
        loadUserFromId(userId)
      }
    }
  }, [user, searchParams])

  const loadUserFromId = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) {
      setSelectedUser(data)
    }
  }

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
    }
  }, [selectedUser])

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, profiles!messages_sender_id_fkey(*), profiles!messages_receiver_id_fkey(*)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (data) {
      const uniqueUsers = new Map()
      data.forEach(msg => {
        const otherUser = msg.sender_id === user.id ? msg.profiles : msg.profiles
        if (!uniqueUsers.has(otherUser.id)) {
          uniqueUsers.set(otherUser.id, otherUser)
        }
      })
      setConversations(Array.from(uniqueUsers.values()))
    }
  }

  const fetchMessages = async (otherUserId) => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(*)')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (data) {
      setMessages(data)
      markAsRead(otherUserId)
    }
  }

  const markAsRead = async (senderId) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', user.id)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        if (selectedUser && payload.new.sender_id === selectedUser.id) {
          setMessages(prev => [...prev, payload.new])
        }
        fetchConversations()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && !file) return

    // Check message limit for free users
    if (!profile?.is_premium) {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', user.id)

      if (count >= 10) {
        alert('Free users are limited to 10 messages. Upgrade to Premium for unlimited messaging!')
        return
      }
    }

    setLoading(true)
    try {
      let fileUrl = null
      if (file) {
        fileUrl = await uploadMessageFile(file, user.id)
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUser.id,
          content: newMessage,
          file_url: fileUrl
        })
        .select('*, sender:profiles!messages_sender_id_fkey(*)')
        .single()

      if (!error && data) {
        setMessages(prev => [...prev, data])
        setNewMessage('')
        setFile(null)
      }
    } catch (err) {
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen premium-bg">
      <Navbar />
      
      <div className="h-[calc(100vh-6rem)] mt-24 mx-4 flex gap-4 max-w-7xl mx-auto">
        {/* Conversations List */}
        <div className="w-full md:w-80 glass-panel rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedUser(conv)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 border-b border-white/5 transition-all ${
                    selectedUser?.id === conv.id ? 'bg-red-900/20' : ''
                  }`}
                >
                  <img
                    src={conv.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=8b0000&color=ffffff&bold=true&format=svg`}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">{conv.name}</p>
                    <p className="text-sm text-gray-400">{conv.role}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <img
                  src={selectedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=8b0000&color=ffffff&bold=true&format=svg`}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">{selectedUser.name}</p>
                  <p className="text-sm text-gray-400">{selectedUser.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md ${
                      msg.sender_id === user.id
                        ? 'bg-gradient-to-br from-red-900 to-red-950 text-white'
                        : 'bg-white/5 text-white'
                    } rounded-lg p-3 shadow`}>
                      <p>{msg.content}</p>
                      {msg.file_url && (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-sm underline mt-2 block text-red-300">
                          View Attachment
                        </a>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
                {file && (
                  <div className="mb-2 text-sm text-gray-400">
                    File: {file.name}
                    <button onClick={() => setFile(null)} className="ml-2 text-red-400">Remove</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <label className="cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-all">
                    <Paperclip size={20} className="text-gray-400" />
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-premium flex-1"
                  />
                  <button
                    type="submit"
                    disabled={loading || (!newMessage.trim() && !file)}
                    className="btn-premium btn-primary disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <User size={48} className="mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
