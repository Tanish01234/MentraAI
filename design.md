# 🎨 University Helpdesk Chatbot - Design Document

## 1. 🏗️ System Architecture

### 1.1 🏰 High-Level Architecture

The University Helpdesk Chatbot follows a modern web application architecture optimized for intelligent query handling and scalable responses.

- **Frontend** 🖥️ React 18 with TypeScript
- **Backend** ⚙️ FastAPI (Python) - High-performance async API
- **Database** 🗄️ Supabase (PostgreSQL) with vector extensions
- **NLP Engine** 🧠 spaCy + Sentence Transformers (all-MiniLM-L6-v2)
- **AI Fallback** 🤖 GROQ API (llama-3.3-70b-versatile)
- **Embedding Service** 🔍 Sentence-BERT for semantic search
- **Authentication** 🔐 Supabase Auth (Admin panel)
- **Styling** 🎨 Tailwind CSS with modern UI components
- **Deployment** 🚀 Localhost (Hackathon demo-ready)

### 1.2 📂 Directory Structure

```
university-helpdesk/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   │   ├── chat.py        # Chat endpoint (DB-first + GROQ fallback)
│   │   │   ├── admin.py       # Admin CRUD operations
│   │   │   └── analytics.py   # Analytics endpoints
│   │   ├── models/            # Database models
│   │   │   ├── faq.py         # FAQ schema
│   │   │   ├── chat.py        # Chat history schema
│   │   │   └── user.py        # User schema
│   │   ├── services/          # Business logic
│   │   │   ├── embedding.py   # Sentence-BERT embedding service
│   │   │   ├── nlp.py         # spaCy NLP pipeline
│   │   │   └── groq.py        # GROQ API integration
│   │   ├── utils/             # Utility functions
│   │   └── main.py            # FastAPI app entry
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ChatInterface/ # Student chat UI
│   │   │   ├── AdminPanel/    # Admin dashboard
│   │   │   └── ui/            # Base components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client services
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   └── package.json           # Node dependencies
├── supabase/                  # Database
│   ├── migrations/            # SQL migrations
│   └── seed.sql               # Initial FAQ data
└── docs/                      # Documentation
```

### 1.3 🧠 NLP & Embedding Architecture

#### Embedding Service
- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Dimension**: 384-dimensional embeddings
- **Purpose**: Semantic similarity search for FAQ matching
- **Storage**: PostgreSQL with pgvector extension

#### Query Processing Pipeline
1. **Input**: User query (text)
2. **Preprocessing**: spaCy tokenization and normalization
3. **Embedding**: Convert query to 384-dim vector
4. **Similarity Search**: Cosine similarity against FAQ embeddings
5. **Threshold**: 0.7 similarity score for database match
6. **Fallback**: If no match, call GROQ API
7. **Source Tracking**: Log whether response came from DB or AI

#### Database-First Logic
```python
# Pseudocode for chat endpoint
async def chat(query: str):
    # Step 1: Generate embedding
    query_embedding = embedding_service.encode(query)
    
    # Step 2: Search FAQs
    matches = db.search_similar(query_embedding, threshold=0.7)
    
    # Step 3: Return DB result or fallback
    if matches:
        return {
            "response": matches[0].answer,
            "source": "database",
            "confidence": matches[0].similarity
        }
    else:
        groq_response = await groq_api.chat(query)
        return {
            "response": groq_response,
            "source": "ai_model",
            "model": "llama-3.3-70b-versatile"
        }
```

---

## 2. ✨ User Interface (UI) Design

### 2.1 🎭 Design Philosophy

The UI is designed to be **clean**, **accessible**, and **efficient** for both students and administrators.

- **Theme** � Light mode with university branding colors
- **Typography** ✍️ Inter font family for optimal readability
- **Color Palette** 🎨 Professional blue/white theme with accent colors
- **Animations** 🎬 Subtle transitions for smooth user experience
- **Accessibility** ♿ WCAG 2.1 AA compliant
- **Responsive** 📱 Mobile-first design for all devices

### 2.2 🎨 Visual Design System

#### Color Variables
```css
--bg-base: Deep space background
--bg-elevated: Elevated surface color
--text-primary: Primary text color
--text-secondary: Secondary text color
--text-muted: Muted text color
--accent-primary: Primary accent (Aurora blue)
--accent-secondary: Secondary accent (Aurora pink)
--accent-tertiary: Tertiary accent
--border-subtle: Subtle border color
```

#### Key Design Elements
- **Glass Panels** 🪟 Semi-transparent containers with backdrop blur
- **Aurora Backgrounds** 🌌 Animated gradient backgrounds with floating orbs
- **Gradient Text** ✨ Text with gradient effects for emphasis
- **Floating Animations** 🎈 Subtle floating animations for visual interest

### 2.3 🧩 Key UI Components

#### Student Interface Components
- **ChatWindow** 💬 Main chat interface with message history
- **MessageBubble** 💭 Distinct styling for user/bot messages
- **LanguageSelector** 🌐 Toggle between English/Hindi/Gujarati
- **TypingIndicator** ⌨️ Real-time bot typing animation
- **QuickActions** ⚡ Suggested questions/common queries
- **SourceBadge** 🏷️ Indicator showing if response is from DB or AI

#### Admin Panel Components
- **FAQManager** 📝 CRUD interface for FAQ management
- **ChatHistory** 📊 View all student conversations
- **Analytics Dashboard** � Usage statistics and insights
- **BulkUpload** 📤 CSV/JSON import for FAQs
- **EmbeddingStatus** 🔄 Real-time embedding generation status
- **AdminAI Assistant** 🤖 AI helper for admin queries

---

## 3. 💾 Data Design (Schema)

### 3.1 📦 Core Entities

#### FAQ Management
- **faqs** � 
  - `id` (UUID, primary key)
  - `question` (TEXT)
  - `answer` (TEXT)
  - `category` (VARCHAR) - e.g., "admissions", "academics", "campus"
  - `embedding` (VECTOR(384)) - Sentence-BERT embedding
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
  - `created_by` (UUID, FK to admin users)

#### Chat History
- **chat_sessions** �
  - `id` (UUID, primary key)
  - `session_id` (VARCHAR) - Unique session identifier
  - `started_at` (TIMESTAMP)
  - `ended_at` (TIMESTAMP, nullable)
  - `language` (VARCHAR) - "en", "hi", "gu"

- **messages** 📨
  - `id` (UUID, primary key)
  - `session_id` (UUID, FK to chat_sessions)
  - `role` (ENUM: "user", "bot")
  - `content` (TEXT)
  - `source` (ENUM: "database", "ai_model")
  - `confidence_score` (FLOAT, nullable) - For DB matches
  - `model_used` (VARCHAR, nullable) - For AI responses
  - `timestamp` (TIMESTAMP)

#### Analytics
- **query_analytics** �
  - `id` (UUID, primary key)
  - `query` (TEXT)
  - `matched_faq_id` (UUID, FK to faqs, nullable)
  - `source` (ENUM: "database", "ai_model")
  - `confidence_score` (FLOAT, nullable)
  - `response_time_ms` (INTEGER)
  - `timestamp` (TIMESTAMP)

#### Admin Users
- **admin_users** �
  - `id` (UUID, primary key)
  - `email` (VARCHAR, unique)
  - `password_hash` (VARCHAR)
  - `role` (ENUM: "admin", "super_admin")
  - `created_at` (TIMESTAMP)

### 3.2 🔄 Data Flow Architecture

1. **Client** ➡️ Requests data via Server Actions or API Routes
2. **Middleware** 🛡️ Validates authentication via Supabase
3. **Server** ➡️ Queries Supabase (PostgreSQL) or calls AI APIs
4. **AI Processing** 🧠 Multiple AI providers for different use cases
5. **Response** ➡️ Structured data returned to client
6. **UI Update** ✨ React state updates with smooth animations

---

## 4. 🧠 AI Integration Design

### 4.1 ⚙️ Multi-Provider AI Architecture

MentraAI supports multiple AI providers for flexibility and redundancy:

- **Google Gemini** 🌟 Primary AI provider (`@google/generative-ai`)
- **OpenAI** 🤖 GPT models for specialized tasks
- **Azure OpenAI** ☁️ Enterprise-grade AI services
- **Groq** ⚡ High-speed inference for real-time interactions

### 4.2 🎯 AI Use Cases by Module

#### Chat Module 💬
- **Streaming Responses** 🌊 Real-time AI conversation
- **Context Awareness** 🧠 Maintains conversation history
- **Hinglish Support** 🇮🇳 Bilingual explanations

#### Notes Module 📝
- **Content Enhancement** ✨ AI-powered note improvement
- **Summary Generation** 📋 Automatic note summarization
- **Concept Extraction** � Key concept identification

#### Career Module 🚀
- **Roadmap Generation** 🗺️ Personalized career paths
- **Skill Gap Analysis** 📊 Identifies learning opportunities
- **Industry Insights** 💼 Current market trends

#### Exam Planner 📅
- **Study Schedule** ⏰ Optimized study timetables
- **Quiz Generation** 🧠 Adaptive practice questions
- **Weakness Analysis** 📈 Performance tracking

#### Confusion → Clarity 💡
- **Concept Simplification** 🎯 Complex topics made simple
- **Visual Explanations** 🖼️ Diagram and flowchart generation
- **Step-by-step Breakdown** 📝 Detailed explanations

### 4.3 �️ AI Safety & Configuration

- **Content Filtering** 🔒 Prevents harmful or inappropriate content
- **Rate Limiting** ⏱️ Prevents API abuse
- **Error Handling** 🛠️ Graceful fallbacks between providers
- **Response Validation** ✅ Ensures structured output quality

---

## 5. 🔒 Security Design

### 5.1 🛡️ Authentication & Authorization

- **Supabase Auth** 🔐 Secure user authentication
- **Row Level Security (RLS)** 🛡️ Database-level access control
- **JWT Tokens** 🎫 Secure session management
- **Middleware Protection** 🚧 Route-level authentication

### 5.2 🔑 Environment Security

- **Environment Variables** 🔒 Sensitive data protection
- **API Key Management** 🗝️ Secure credential storage
- **CORS Configuration** 🌐 Cross-origin request security
- **Input Validation** ✅ Prevents injection attacks

### 5.3 🔐 Data Privacy

- **User Data Isolation** 👤 Users can only access their own data
- **Encryption at Rest** 🔒 Database encryption
- **Secure Transmission** 🔐 HTTPS everywhere
- **Data Retention Policies** 📅 Configurable data lifecycle

---

## 6. 🎮 Gamification Design

### 6.1 � Engagement Mechanics

- **XP System** ⭐ Points for learning activities
- **Level Progression** 📈 Visual progress indicators
- **Achievement Badges** 🏅 Milestone rewards
- **Streak Tracking** 🔥 Daily engagement rewards

### 6.2 🎯 Behavioral Psychology

- **Variable Rewards** 🎰 Unpredictable positive reinforcement
- **Progress Visualization** 📊 Clear advancement indicators
- **Social Elements** 👥 Leaderboards and sharing
- **Personalization** 🎨 Customizable avatars and themes

---

## 7. 📱 Responsive Design

### 7.1 📐 Breakpoint Strategy

- **Mobile First** � Progressive enhancement approach
- **Flexible Layouts** 🔄 CSS Grid and Flexbox
- **Touch Optimization** 👆 Mobile-friendly interactions
- **Performance Focus** ⚡ Optimized for all devices

### 7.2 🖥️ Cross-Platform Compatibility

- **Browser Support** 🌐 Modern browser compatibility
- **PWA Features** 📲 Progressive Web App capabilities
- **Offline Functionality** 📴 Limited offline access
- **Native Feel** 📱 App-like user experience

---

## 8. 🚀 Performance Optimization

### 8.1 ⚡ Frontend Performance

- **Code Splitting** 📦 Dynamic imports for optimal loading
- **Image Optimization** 🖼️ Next.js Image component
- **Lazy Loading** � On-demand component loading
- **Bundle Analysis** 📊 Regular performance monitoring

### 8.2 🔧 Backend Performance

- **API Caching** 💾 Response caching strategies
- **Database Indexing** 🗂️ Optimized query performance
- **Connection Pooling** 🏊 Efficient database connections
- **CDN Integration** 🌐 Global content delivery

---

## 9. 🌍 Internationalization (i18n)

### 9.1 🇮🇳 Language Support

- **Hinglish Primary** 🗣️ Hindi-English code-mixing
- **English Fallback** 🇺🇸 Full English support
- **Regional Languages** 🌏 Future expansion planned
- **Cultural Adaptation** 🎭 India-specific content

### 9.2 🔤 Implementation Strategy

- **Context-based Translation** 📝 Smart language switching
- **AI-powered Localization** 🤖 Dynamic content translation
- **User Preference Storage** 💾 Language preference persistence
- **Fallback Mechanisms** 🔄 Graceful language degradation

---

## 10. 📊 Analytics & Monitoring

### 10.1 📈 User Analytics

- **Learning Progress Tracking** 📚 Study session analytics
- **Feature Usage Metrics** 🔍 Component interaction data
- **Performance Monitoring** ⚡ Real-time performance metrics
- **Error Tracking** 🐛 Automated error reporting

### 10.2 🎯 Business Intelligence

- **User Engagement Metrics** 👥 Retention and activity analysis
- **AI Usage Patterns** 🧠 AI interaction optimization
- **Content Performance** 📊 Learning content effectiveness
- **Conversion Tracking** 💰 User journey analysis

---

## 11. 🔮 Future Enhancements

### 11.1 🚀 Planned Features

- **Collaborative Learning** 👥 Group study sessions
- **Advanced Whiteboard** 🖊️ Enhanced visual learning tools
- **Mobile App** 📱 Native iOS/Android applications
- **Offline Mode** 📴 Full offline functionality

### 11.2 🧠 AI Advancements

- **Multimodal AI** � Image, audio, and video processing
- **Personalized Learning Paths** 🛤️ Adaptive curriculum generation
- **Real-time Tutoring** 👨‍🏫 Live AI tutoring sessions
- **Predictive Analytics** 🔮 Learning outcome predictions

---

*This design document serves as the foundation for MentraAI's architecture and will be updated as the platform evolves. Built with ❤️ for Indian students.*