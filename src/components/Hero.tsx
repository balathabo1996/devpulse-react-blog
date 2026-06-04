import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, ArrowRight, User as UserIcon } from "lucide-react";
import type { Post } from "../types";
import { useAuth } from "../context/AuthContext";

interface HeroProps {
  posts?: Post[];
  categories?: string[];
  onSelectPost?: (post: Post) => void;
  onSelectCategory?: (category: string) => void;
  onNavigate?: (view: "home" | "posts" | "about" | "contact" | "login" | "admin" | "settings" | "profile") => void;
  isHome?: boolean;
}

export function Hero({ posts = [], categories = [], onSelectPost, onSelectCategory, onNavigate, isHome = true }: HeroProps) {
  const { user } = useAuth();

  if (!isHome) return null; // Only render the Bento Grid on the homepage when no filters are active

  const featuredPost = posts[0];
  const secondaryPost = posts[1];
  const tertiaryPost = posts[2];
  const quaternaryPost = posts[3];
  const quinaryPost = posts[4];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="hero-section" style={{ minHeight: 'auto', padding: '2rem 0' }}>
      <div className="hero-glow" style={{ top: '-20%', height: '120%' }} />
      <div className="container hero-content" style={{ zIndex: 10, paddingTop: 0 }}>
        
        <motion.div 
          className="bento-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* 1. Large Featured Post (2x2) - Placed at Col 1-2, Row 1-2 */}
          {featuredPost ? (
            <motion.a 
              className="bento-item bento-item-large"
              variants={itemVariants}
              onClick={(e) => { e.preventDefault(); onSelectPost?.(featuredPost); }}
              href={`#post-${featuredPost.id || featuredPost._id}`}
            >
              <div className="bento-bg-image" style={{ backgroundImage: `url(${featuredPost.imageUrl})` }} />
              <div className="bento-overlay" />
              <div className="bento-content">
                <span className="bento-tag">Featured</span>
                <h2 className="bento-title" style={{ marginTop: 'auto' }}>{featuredPost.title}</h2>
                <p className="bento-excerpt">{featuredPost.excerpt}</p>
              </div>
            </motion.a>
          ) : (
            <motion.div className="bento-item bento-item-large bento-gradient-bg" variants={itemVariants}>
               <div className="bento-content">
                  <h2 className="bento-title">Welcome to DevPulse</h2>
                  <p className="bento-excerpt">Loading amazing content...</p>
               </div>
            </motion.div>
          )}

          {/* 2. Top Categories/Trending block (1x2 tall) - Placed at Col 3, Row 1-2 */}
          <motion.div className="bento-item bento-item-tall" variants={itemVariants} style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="bento-content" style={{ justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={20} className="text-primary" />
                <h3 style={{ margin: 0, fontWeight: 700 }}>Trending Topics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {(categories.length > 0 ? categories.slice(0, 4) : ['Technology', 'Development', 'Design', 'News']).map(tag => (
                   <button 
                     key={tag} 
                     onClick={() => onSelectCategory?.(tag)}
                     style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'transparent', color: 'inherit', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                   >
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{tag}</span>
                      <ArrowRight size={14} style={{ opacity: 0.5 }} />
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>

          {/* 3. Welcome / Stat block (1x1) - Placed at Col 4, Row 1 */}
          <AnimatePresence mode="wait">
            {user ? (
              <motion.a 
                key="welcome-user"
                className="bento-item bento-gradient-bg" 
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); onNavigate?.('profile'); }}
                href="#profile"
              >
                <UserIcon size={32} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>Welcome back,</h3>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>{user.displayName?.split(' ')[0] || 'Developer'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>View your profile</p>
              </motion.a>
            ) : (
              <motion.a 
                key="join-pulse"
                className="bento-item bento-gradient-bg" 
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); onNavigate?.('login'); }}
                href="#login"
              >
                <Sparkles size={32} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>Join the Pulse</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Where developers share real-world knowledge.</p>
              </motion.a>
            )}
          </AnimatePresence>

          {/* 4. Secondary Post (1x1) - Placed at Col 4, Row 2 */}
          {secondaryPost ? (
            <motion.a 
              className="bento-item"
              variants={itemVariants}
              onClick={(e) => { e.preventDefault(); onSelectPost?.(secondaryPost); }}
              href={`#post-${secondaryPost.id || secondaryPost._id}`}
            >
               <div className="bento-bg-image" style={{ backgroundImage: `url(${secondaryPost.imageUrl})`, opacity: 0.5 }} />
               <div className="bento-overlay" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)' }} />
               <div className="bento-content">
                 <span className="bento-tag" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>{secondaryPost.category}</span>
                 <h3 className="bento-title" style={{ fontSize: '1.1rem', marginTop: 'auto' }}>{secondaryPost.title}</h3>
               </div>
            </motion.a>
          ) : (
             <motion.div className="bento-item" variants={itemVariants} />
          )}

          {/* 5. Tertiary Post (wide 2x1) - Placed at Col 1-2, Row 3 */}
          {tertiaryPost ? (
            <motion.a 
              className="bento-item bento-item-wide"
              variants={itemVariants}
              onClick={(e) => { e.preventDefault(); onSelectPost?.(tertiaryPost); }}
              href={`#post-${tertiaryPost.id || tertiaryPost._id}`}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 0 }}
            >
               <div style={{ width: '40%', height: '100%', position: 'relative' }}>
                 <div className="bento-bg-image" style={{ backgroundImage: `url(${tertiaryPost.imageUrl})` }} />
               </div>
               <div className="bento-content" style={{ width: '60%', padding: '1.5rem', justifyContent: 'center' }}>
                 <span className="bento-tag" style={{ marginBottom: '0.75rem', alignSelf: 'flex-start' }}>{tertiaryPost.category}</span>
                 <h3 className="bento-title" style={{ fontSize: '1.25rem' }}>{tertiaryPost.title}</h3>
                 <p className="bento-excerpt" style={{ WebkitLineClamp: 2 }}>{tertiaryPost.excerpt}</p>
               </div>
            </motion.a>
          ) : (
            <motion.div className="bento-item bento-item-wide" variants={itemVariants} />
          )}

          {/* 6. Quaternary Post (1x1) - Placed at Col 3, Row 3 */}
          {quaternaryPost ? (
            <motion.a 
              className="bento-item"
              variants={itemVariants}
              onClick={(e) => { e.preventDefault(); onSelectPost?.(quaternaryPost); }}
              href={`#post-${quaternaryPost.id || quaternaryPost._id}`}
            >
               <div className="bento-bg-image" style={{ backgroundImage: `url(${quaternaryPost.imageUrl})`, opacity: 0.5 }} />
               <div className="bento-overlay" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)' }} />
               <div className="bento-content">
                 <span className="bento-tag" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>{quaternaryPost.category}</span>
                 <h3 className="bento-title" style={{ fontSize: '1.1rem', marginTop: 'auto' }}>{quaternaryPost.title}</h3>
               </div>
            </motion.a>
          ) : (
             <motion.div className="bento-item" variants={itemVariants} />
          )}

          {/* 7. Quinary Post (1x1) - Placed at Col 4, Row 3 */}
          {quinaryPost ? (
            <motion.a 
              className="bento-item"
              variants={itemVariants}
              onClick={(e) => { e.preventDefault(); onSelectPost?.(quinaryPost); }}
              href={`#post-${quinaryPost.id || quinaryPost._id}`}
            >
               <div className="bento-bg-image" style={{ backgroundImage: `url(${quinaryPost.imageUrl})`, opacity: 0.5 }} />
               <div className="bento-overlay" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)' }} />
               <div className="bento-content">
                 <span className="bento-tag" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>{quinaryPost.category}</span>
                 <h3 className="bento-title" style={{ fontSize: '1.1rem', marginTop: 'auto' }}>{quinaryPost.title}</h3>
               </div>
            </motion.a>
          ) : (
             <motion.div className="bento-item" variants={itemVariants} />
          )}

        </motion.div>

      </div>
    </section>
  );
}
