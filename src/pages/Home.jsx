import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Typing animation states
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [line3, setLine3] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [typingComplete, setTypingComplete] = useState(false)

  const text1 = 'Professional'
  const text2 = 'Collaboration'
  const text3 = 'Platform'

  useEffect(() => {
    // Typing animation
    let index1 = 0
    let index2 = 0
    let index3 = 0

    const timer1 = setInterval(() => {
      if (index1 < text1.length) {
        setLine1(text1.slice(0, index1 + 1))
        index1++
      } else {
        clearInterval(timer1)
        setTimeout(() => {
          const timer2 = setInterval(() => {
            if (index2 < text2.length) {
              setLine2(text2.slice(0, index2 + 1))
              index2++
            } else {
              clearInterval(timer2)
              setTimeout(() => {
                const timer3 = setInterval(() => {
                  if (index3 < text3.length) {
                    setLine3(text3.slice(0, index3 + 1))
                    index3++
                  } else {
                    clearInterval(timer3)
                    setTypingComplete(true)
                    setTimeout(() => setShowCursor(false), 500)
                  }
                }, 80)
              }, 200)
            }
          }, 80)
        }, 200)
      }
    }, 80)

    return () => {
      clearInterval(timer1)
    }
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen premium-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline with Typing Animation */}
            <div className="text-6xl md:text-7xl lg:text-8xl display-text mb-8 min-h-[280px]">
              <div className="text-white">
                {line1}
                {line1 && !line2 && showCursor && <span className="animate-pulse text-red-700">|</span>}
              </div>
              {line1 && (
                <div className="gradient-text">
                  {line2}
                  {line2 && !line3 && showCursor && <span className="animate-pulse text-red-700">|</span>}
                </div>
              )}
              {line2 && (
                <div className="text-white">
                  {line3}
                  {line3 && showCursor && <span className="animate-pulse text-red-700">|</span>}
                </div>
              )}
            </div>

            {/* Subheadline */}
            {typingComplete && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Connect with verified professionals. Build high-performing teams. 
                Deliver exceptional results.
              </motion.p>
            )}

            {/* CTA Buttons */}
            {typingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button 
                  onClick={handleGetStarted}
                  className="premium-button text-base rounded-lg flex items-center gap-2 group"
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
                <Link to="/discover">
                  <button className="secondary-button text-base rounded-lg">
                    Explore Talent
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Subtle light bloom */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-red-900/5 to-transparent blur-3xl pointer-events-none"></div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '5K+', label: 'Projects' },
              { value: '98%', label: 'Success Rate' },
              { value: '50+', label: 'Countries' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl heading-text mb-6 text-white">
              Built for professionals
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
              Enterprise-grade tools for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Instant Matching',
                description: 'AI-powered connections with verified professionals in your industry.',
              },
              {
                icon: Shield,
                title: 'Verified Profiles',
                description: 'Every user is verified. Work with confidence and trust.',
              },
              {
                icon: Users,
                title: 'Global Network',
                description: 'Access skilled professionals across every discipline worldwide.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="feature-card p-8 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-900/20 to-red-950/20 flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-red-400" />
                </div>
                <h3 className="text-xl heading-text mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-4 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl heading-text mb-4 text-white">
              Trusted by industry leaders
            </h2>
            <p className="text-gray-400 font-medium">Thousands of successful collaborations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Collabory transformed how we build teams. Found our lead developer in 48 hours.",
                author: "Sarah Chen",
                role: "CEO, TechStart",
                rating: 5,
              },
              {
                quote: "The quality of talent here is unmatched. Every connection has been valuable.",
                author: "Marcus Rodriguez",
                role: "Creative Director",
                rating: 5,
              },
              {
                quote: "Finally, a platform that understands what professionals actually need.",
                author: "Emily Watson",
                role: "Product Manager",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-red-700 fill-red-700" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed font-medium">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-red-950"></div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl display-text mb-8 text-white">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of professionals building exceptional teams.
            </p>
            <button 
              onClick={handleGetStarted}
              className="premium-button text-base rounded-lg flex items-center gap-2 mx-auto group"
            >
              {user ? 'Go to Dashboard' : 'Start Your Journey'}
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm font-medium">
          <p>© 2024 Collabory. Professional collaboration platform.</p>
        </div>
      </footer>
    </div>
  )
}
