import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const AiAssistantContext = createContext(null)

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'assistant',
  text: "👋 Hi, I'm Reelify AI, your intelligent conversational prompt builder.\n\nStep 1: What do you want to create?",
  questionType: 'type',
  options: ['Commercial', 'Travel', 'Food', 'Fitness', 'Gaming', 'Movie Trailer', 'Anime', 'Documentary'],
  showStepNumbers: true,
}

export function AiAssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE])
  const [promptHistory, setPromptHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [insertCallback, setInsertCallback] = useState(null)

  // Current guided 5-step flow state
  const [flowState, setFlowState] = useState({
    type: '',
    audience: '',
    style: '',
    duration: '',
    platform: '',
  })

  // Open & Close methods
  const openAssistant = useCallback(() => setIsOpen(true), [])
  const closeAssistant = useCallback(() => setIsOpen(false), [])
  const toggleAssistant = useCallback(() => setIsOpen((prev) => !prev), [])

  // Register callback for main studio prompt editor
  const registerInsertCallback = useCallback((cb) => {
    setInsertCallback(() => cb)
  }, [])

  // Add message to chat
  const addMessage = (sender, text, extra = {}) => {
    const newMsg = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...extra
    }
    setMessages((prev) => [...prev, newMsg])
    return newMsg
  }

  // Handle prompt insertion into main Studio textbox
  const insertPromptIntoStudio = (promptText, styleText = '') => {
    if (insertCallback) {
      insertCallback(promptText, styleText)
    } else {
      localStorage.setItem('reelify_ai_suggested_prompt', promptText)
      if (styleText) localStorage.setItem('reelify_ai_suggested_style', styleText)
    }
    toast.success('Prompt inserted successfully.')
    closeAssistant()
  }

  // Helper to generate 3 sequential storyboard scenes
  const createStoryboardForPrompt = (type, topic, style) => {
    return [
      {
        id: 'scene-1-' + Date.now(),
        sceneNumber: 1,
        title: 'Scene 1: Hook & Opening Frame',
        duration: '4.0s',
        prompt: `High-impact opening shot of ${topic || type}. Dramatic camera push-in establishing the main focal subject with bold cinematic contrast.`,
        cameraMovement: '📹 Fast Push-In / Tracking Shot',
        lighting: '💡 Volumetric Rim Lighting',
        emotion: '🔥 High Energy & Curious',
        thumbnailGradient: 'from-purple-600/40 to-indigo-900/60'
      },
      {
        id: 'scene-2-' + Date.now(),
        sceneNumber: 2,
        title: 'Scene 2: Core Subject & Action',
        duration: '5.5s',
        prompt: `Detailed mid-shot exploring ${topic || type} in motion. Vibrant color grading and realistic texture depth in ${style || 'Cinematic'} style.`,
        cameraMovement: '📹 Smooth Orbital Pan',
        lighting: '💡 Golden Hour Soft Warm Light',
        emotion: '✨ Inspiring & Premium',
        thumbnailGradient: 'from-pink-600/40 to-purple-900/60'
      },
      {
        id: 'scene-3-' + Date.now(),
        sceneNumber: 3,
        title: 'Scene 3: Climax & Resolution',
        duration: '4.5s',
        prompt: `Wide atmospheric closing shot resolving the narrative of ${topic || type}. Cinematic lighting fade out with memorable visual hook.`,
        cameraMovement: '📹 Slow Pull-Back / Crane Up',
        lighting: '💡 Dramatic Cyberpunk Neon Glow',
        emotion: '🎯 Powerful & Satisfying',
        thumbnailGradient: 'from-blue-600/40 to-cyan-900/60'
      }
    ]
  }

  // Helper to generate professional technical Shot List
  const createShotListForPrompt = (type, topic) => {
    return [
      {
        id: 'shot-1-' + Date.now(),
        shotNumber: 1,
        shotType: 'Extreme Close-Up (ECU)',
        cameraAngle: 'Low Angle (30°)',
        lens: '100mm Cine Macro T2.8',
        movement: 'Dolly Push-In (Smooth)',
        lighting: 'Volumetric Rim Key Light',
        transition: 'Hard Cut',
        duration: '2.5s',
        notes: 'Focal emphasis on hero subject texture and reflections.'
      },
      {
        id: 'shot-2-' + Date.now(),
        shotNumber: 2,
        shotType: 'Medium Shot (MS)',
        cameraAngle: 'Eye Level (0°)',
        lens: '35mm Anamorphic T1.5',
        movement: 'Gimbal Tracking Orbit',
        lighting: 'Golden Hour Sunset Glow',
        transition: 'Cross Dissolve',
        duration: '4.0s',
        notes: 'Captures fluid action with anamorphic lens flare artifacts.'
      },
      {
        id: 'shot-3-' + Date.now(),
        shotNumber: 3,
        shotType: 'Wide Establishing Shot (WS)',
        cameraAngle: 'Overhead Bird’s Eye (80°)',
        lens: '24mm Ultra-Wide Prime',
        movement: 'Pedestal Crane Up',
        lighting: 'Cyberpunk Neon Rim & Atmospheric Haze',
        transition: 'Zoom Blur Transition',
        duration: '3.5s',
        notes: 'Reveals full environmental scale and moody backdrop depth.'
      }
    ]
  }

  // Generate final 1 professional cinematic prompt + Automatic Storyboard + Technical Shot List
  const generateFinalPrompt = async (finalFlow) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const { type, audience, style, duration, platform } = finalFlow

    let promptText = `A professional cinematic 8k ${type.toLowerCase()} video tailored for ${audience.toLowerCase()}. Visual style: ${style}. Aspect ratio: ${platform.includes('9:16') ? '9:16 vertical video' : platform.includes('16:9') ? '16:9 widescreen' : '1:1 square'}. Duration: ${duration}. Features hyper-detailed realistic textures, volumetric lighting, dynamic tracking shot camera movement, and viral engagement story flow.`

    try {
      const { data } = await axios.post('/api/ai/suggest', { topic: `${type} video for ${audience}` })
      if (data && data.prompt) {
        promptText = `${data.prompt} Visual style: ${style}. Tailored for ${audience}. Format: ${platform}.`
      }
    } catch (e) {
      // Fallback prompt works cleanly
    }

    setIsTyping(false)

    // Generate automatic storyboard & shot list
    const initialStoryboard = createStoryboardForPrompt(type, type, style)
    const initialShotList = createShotListForPrompt(type, type)

    const generatedObj = {
      id: 'gen-' + Date.now(),
      prompt: promptText,
      type,
      audience,
      style,
      duration,
      platform,
      storyboard: initialStoryboard,
      shotList: initialShotList,
      timestamp: new Date().toLocaleString()
    }

    addMessage('assistant', `✨ Here is your custom-engineered cinematic prompt, Storyboard, and Technical Shot List:`, {
      promptCard: generatedObj
    })

    setPromptHistory((prev) => [generatedObj, ...prev])
  }

  // User sends text manually
  const handleUserMessage = async (userText) => {
    if (!userText.trim()) return
    const trimmed = userText.trim()
    addMessage('user', trimmed)

    if (!flowState.type) {
      const updated = { ...flowState, type: trimmed }
      setFlowState(updated)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsTyping(false)

      addMessage('assistant', `Step 2: Who is the target audience for your ${trimmed}?`, {
        questionType: 'audience',
        options: ['Gen Z & Youth', 'Professionals', 'Fitness Enthusiasts', 'Foodies & Chefs', 'Gamers & Streamers', 'General Audience']
      })
    }
  }

  // Step-by-Step Option Select Handler
  const handleOptionSelect = async (questionType, selectedValue) => {
    addMessage('user', selectedValue)

    if (questionType === 'type') {
      const updated = { ...flowState, type: selectedValue }
      setFlowState(updated)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsTyping(false)

      addMessage('assistant', `Step 2: Who is the target audience for your ${selectedValue}?`, {
        questionType: 'audience',
        options: ['Gen Z & Youth', 'Professionals', 'Fitness Enthusiasts', 'Foodies & Chefs', 'Gamers & Streamers', 'General Audience']
      })
    } else if (questionType === 'audience') {
      const updated = { ...flowState, audience: selectedValue }
      setFlowState(updated)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsTyping(false)

      addMessage('assistant', `Step 3: Choose a visual style.`, {
        questionType: 'style',
        options: ['Cinematic 8K', 'Hyper-Realistic', 'Anime / Cyberpunk', 'Minimalist & Clean', 'Dark & Moody', 'Vibrant & High Energy']
      })
    } else if (questionType === 'style') {
      const updated = { ...flowState, style: selectedValue }
      setFlowState(updated)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsTyping(false)

      addMessage('assistant', `Step 4: Choose video duration.`, {
        questionType: 'duration',
        options: ['15 sec', '30 sec', '60 sec', '90 sec']
      })
    } else if (questionType === 'duration') {
      const updated = { ...flowState, duration: selectedValue }
      setFlowState(updated)
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsTyping(false)

      addMessage('assistant', `Step 5: Choose target platform & aspect ratio.`, {
        questionType: 'platform',
        options: ['TikTok / Instagram Reels (9:16)', 'YouTube Shorts (9:16)', 'YouTube Longform (16:9)', 'Instagram Post (1:1)']
      })
    } else if (questionType === 'platform') {
      const finalFlow = { ...flowState, platform: selectedValue }
      setFlowState(finalFlow)
      generateFinalPrompt(finalFlow)
    }
  }

  // Reset conversation
  const resetConversation = () => {
    setMessages([INITIAL_WELCOME_MESSAGE])
    setFlowState({ topic: '', audience: '', style: '', duration: '15 sec' })
  }

  // Delete prompt from history
  const deleteHistoryPrompt = (id) => {
    setPromptHistory((prev) => prev.filter((p) => p.id !== id))
    toast.success('Prompt removed from session history.')
  }

  return (
    <AiAssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        messages,
        promptHistory,
        isTyping,
        handleUserMessage,
        handleOptionSelect,
        insertPromptIntoStudio,
        resetConversation,
        deleteHistoryPrompt,
        registerInsertCallback,
        generateFinalPrompt,
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  )
}

export const useAiAssistant = () => useContext(AiAssistantContext)
