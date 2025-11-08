'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CakeDesign {
  shape: 'round' | 'square' | 'heart' | 'custom'
  size: '6inch' | '8inch' | '10inch' | '12inch'
  layers: number
  flavor: string
  filling: string
  frosting: {
    type: 'buttercream' | 'fondant' | 'cream_cheese' | 'whipped'
    color: string
  }
  decorations: {
    flowers: boolean
    sprinkles: boolean
    berries: boolean
    chocolate_chips: boolean
    custom_text: string
    border_style: 'none' | 'rosette' | 'shell' | 'stars'
  }
  theme: string
  special_instructions: string
}

interface CakeDesignerProps {
  onSave: (design: CakeDesign & { estimatedPrice: number }) => void
  onOrder: (design: CakeDesign & { estimatedPrice: number }) => void
}

export default function CakeDesigner({ onSave, onOrder }: CakeDesignerProps) {
  const { data: session } = useSession()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [design, setDesign] = useState<CakeDesign>({
    shape: 'round',
    size: '8inch',
    layers: 1,
    flavor: 'vanilla',
    filling: 'none',
    frosting: {
      type: 'buttercream',
      color: '#FFFFFF'
    },
    decorations: {
      flowers: false,
      sprinkles: false,
      berries: false,
      chocolate_chips: false,
      custom_text: '',
      border_style: 'none'
    },
    theme: 'classic',
    special_instructions: ''
  })

  const [estimatedPrice, setEstimatedPrice] = useState(25)
  const [activeTab, setActiveTab] = useState('basics')

  // Cake options
  const cakeShapes = [
    { id: 'round', name: 'Round', icon: '⭕' },
    { id: 'square', name: 'Square', icon: '⬜' },
    { id: 'heart', name: 'Heart', icon: '💖' },
    { id: 'custom', name: 'Custom', icon: '✨' }
  ]

  const cakeSizes = [
    { id: '6inch', name: '6"', serves: '6-8', basePrice: 20 },
    { id: '8inch', name: '8"', serves: '10-12', basePrice: 25 },
    { id: '10inch', name: '10"', serves: '15-20', basePrice: 35 },
    { id: '12inch', name: '12"', serves: '25-30', basePrice: 45 }
  ]

  const cakeFlavors = [
    'Vanilla', 'Chocolate', 'Red Velvet', 'Lemon', 'Strawberry',
    'Carrot', 'Funfetti', 'Coffee', 'Coconut', 'Banana'
  ]

  const fillingOptions = [
    'None', 'Strawberry Jam', 'Chocolate Ganache', 'Lemon Curd',
    'Raspberry', 'Caramel', 'Peanut Butter', 'Cream Cheese'
  ]

  const frostingTypes = [
    { id: 'buttercream', name: 'Buttercream', price: 0 },
    { id: 'fondant', name: 'Fondant', price: 10 },
    { id: 'cream_cheese', name: 'Cream Cheese', price: 5 },
    { id: 'whipped', name: 'Whipped Cream', price: 3 }
  ]

  const decorationOptions = [
    { id: 'flowers', name: 'Sugar Flowers', price: 15 },
    { id: 'sprinkles', name: 'Sprinkles', price: 2 },
    { id: 'berries', name: 'Fresh Berries', price: 8 },
    { id: 'chocolate_chips', name: 'Chocolate Chips', price: 3 }
  ]

  const borderStyles = [
    { id: 'none', name: 'None', price: 0 },
    { id: 'rosette', name: 'Rosette Border', price: 8 },
    { id: 'shell', name: 'Shell Border', price: 6 },
    { id: 'stars', name: 'Star Border', price: 7 }
  ]

  // Calculate price based on current design
  useEffect(() => {
    let price = cakeSizes.find(s => s.id === design.size)?.basePrice || 25

    // Layer multiplier
    price *= design.layers

    // Frosting type
    const frostingPrice = frostingTypes.find(f => f.id === design.frosting.type)?.price || 0
    price += frostingPrice

    // Decorations
    decorationOptions.forEach(option => {
      if (design.decorations[option.id as keyof typeof design.decorations]) {
        price += option.price
      }
    })

    // Border style
    const borderPrice = borderStyles.find(b => b.id === design.decorations.border_style)?.price || 0
    price += borderPrice

    // Custom text
    if (design.decorations.custom_text.length > 0) {
      price += 5
    }

    setEstimatedPrice(price)
  }, [design])

  // Draw cake preview on canvas
  useEffect(() => {
    drawCakePreview()
  }, [design])

  const drawCakePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = 300
    canvas.height = 300

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const baseRadius = 80

    // Draw cake layers
    for (let layer = design.layers; layer > 0; layer--) {
      const layerRadius = baseRadius - (layer - 1) * 10
      const layerY = centerY + (design.layers - layer) * 15

      // Draw cake base
      ctx.fillStyle = getFrostingColor()

      if (design.shape === 'round') {
        // Draw round cake
        ctx.beginPath()
        ctx.ellipse(centerX, layerY, layerRadius, layerRadius * 0.3, 0, 0, 2 * Math.PI)
        ctx.fill()

        // Draw cake side
        ctx.fillStyle = darkenColor(getFrostingColor(), 0.2)
        ctx.fillRect(centerX - layerRadius, layerY - 20, layerRadius * 2, 20)
      } else if (design.shape === 'square') {
        // Draw square cake
        ctx.fillRect(centerX - layerRadius, layerY - 20, layerRadius * 2, 40)
      } else if (design.shape === 'heart') {
        // Draw heart shape (simplified)
        ctx.beginPath()
        ctx.fillStyle = getFrostingColor()
        ctx.arc(centerX - 20, layerY - 10, 25, 0, Math.PI, true)
        ctx.arc(centerX + 20, layerY - 10, 25, 0, Math.PI, true)
        ctx.lineTo(centerX, layerY + 20)
        ctx.fill()
      }
    }

    // Draw decorations
    if (design.decorations.flowers) {
      drawFlowers(ctx, centerX, centerY - 20)
    }

    if (design.decorations.sprinkles) {
      drawSprinkles(ctx, centerX, centerY - 20, baseRadius)
    }

    if (design.decorations.berries) {
      drawBerries(ctx, centerX, centerY - 20)
    }

    if (design.decorations.custom_text) {
      drawText(ctx, design.decorations.custom_text, centerX, centerY + 40)
    }

    // Draw border
    if (design.decorations.border_style !== 'none') {
      drawBorder(ctx, centerX, centerY, baseRadius)
    }
  }

  const getFrostingColor = () => {
    return design.frosting.color
  }

  const darkenColor = (color: string, amount: number) => {
    const hex = color.replace('#', '')
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.floor(255 * amount))
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.floor(255 * amount))
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.floor(255 * amount))
    return `rgb(${r}, ${g}, ${b})`
  }

  const drawFlowers = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#FF69B4'
    for (let i = 0; i < 3; i++) {
      const flowerX = x - 30 + i * 30
      const flowerY = y - 10 + (i % 2) * 10
      ctx.beginPath()
      ctx.arc(flowerX, flowerY, 8, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const drawSprinkles = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = colors[i % colors.length]
      const sprinkleX = x - radius + Math.random() * (radius * 2)
      const sprinkleY = y - 20 + Math.random() * 20
      ctx.fillRect(sprinkleX, sprinkleY, 3, 8)
    }
  }

  const drawBerries = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#FF0000'
    for (let i = 0; i < 4; i++) {
      const berryX = x - 20 + i * 13
      const berryY = y - 5
      ctx.beginPath()
      ctx.arc(berryX, berryY, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.fillStyle = '#333'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }

  const drawBorder = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.strokeStyle = darkenColor(getFrostingColor(), 0.4)
    ctx.lineWidth = 3

    if (design.decorations.border_style === 'rosette') {
      // Draw rosette pattern around edge
      for (let angle = 0; angle < 360; angle += 30) {
        const radian = (angle * Math.PI) / 180
        const rosetteX = x + Math.cos(radian) * (radius - 10)
        const rosetteY = y + Math.sin(radian) * (radius * 0.3 - 10)
        ctx.beginPath()
        ctx.arc(rosetteX, rosetteY, 4, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
  }

  const updateDesign = (updates: Partial<CakeDesign>) => {
    setDesign(prev => ({ ...prev, ...updates }))
  }

  const updateDecorations = (updates: Partial<CakeDesign['decorations']>) => {
    setDesign(prev => ({
      ...prev,
      decorations: { ...prev.decorations, ...updates }
    }))
  }

  const updateFrosting = (updates: Partial<CakeDesign['frosting']>) => {
    setDesign(prev => ({
      ...prev,
      frosting: { ...prev.frosting, ...updates }
    }))
  }

  const tabs = [
    { id: 'basics', name: 'Basics', icon: '🎂' },
    { id: 'frosting', name: 'Frosting', icon: '🎨' },
    { id: 'decorations', name: 'Decorations', icon: '✨' },
    { id: 'details', name: 'Details', icon: '📝' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview Panel */}
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Preview</h2>

        {/* Canvas Preview */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              width={300}
              height={300}
            />
          </div>
        </div>

        {/* Design Summary */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-3">
          <h3 className="font-semibold text-lg mb-4">Design Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Shape:</span>
              <span className="ml-2 font-medium">{design.shape}</span>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <span className="ml-2 font-medium">{design.size}</span>
            </div>
            <div>
              <span className="text-gray-600">Layers:</span>
              <span className="ml-2 font-medium">{design.layers}</span>
            </div>
            <div>
              <span className="text-gray-600">Flavor:</span>
              <span className="ml-2 font-medium">{design.flavor}</span>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Estimated Price:</span>
              <span className="text-2xl font-bold gradient-text">£{estimatedPrice}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Final price may vary based on complexity and baker consultation
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onSave({ ...design, estimatedPrice })}
              className="flex-1 btn-secondary py-3"
            >
              💾 Save Design
            </button>
            <button
              onClick={() => onOrder({ ...design, estimatedPrice })}
              className="flex-1 btn-primary py-3"
            >
              🛒 Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <h2 className="text-2xl font-bold mb-6">Customize Your Cake</h2>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-cake-purple shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'basics' && (
            <>
              {/* Shape Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cake Shape
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cakeShapes.map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => updateDesign({ shape: shape.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        design.shape === shape.id
                          ? 'border-cake-purple bg-cake-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{shape.icon}</div>
                      <div className="font-medium">{shape.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cake Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cakeSizes.map(size => (
                    <button
                      key={size.id}
                      onClick={() => updateDesign({ size: size.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        design.size === size.id
                          ? 'border-cake-purple bg-cake-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg">{size.name}</div>
                      <div className="text-sm text-gray-600">Serves {size.serves}</div>
                      <div className="text-sm font-medium text-cake-purple">+£{size.basePrice}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Layers
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(layers => (
                    <button
                      key={layers}
                      onClick={() => updateDesign({ layers })}
                      className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                        design.layers === layers
                          ? 'border-cake-purple bg-cake-purple text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {layers}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cake Flavor
                </label>
                <select
                  value={design.flavor}
                  onChange={(e) => updateDesign({ flavor: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                >
                  {cakeFlavors.map(flavor => (
                    <option key={flavor} value={flavor.toLowerCase()}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filling */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filling
                </label>
                <select
                  value={design.filling}
                  onChange={(e) => updateDesign({ filling: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                >
                  {fillingOptions.map(filling => (
                    <option key={filling} value={filling.toLowerCase().replace(' ', '_')}>
                      {filling}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'frosting' && (
            <>
              {/* Frosting Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frosting Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {frostingTypes.map(frosting => (
                    <button
                      key={frosting.id}
                      onClick={() => updateFrosting({ type: frosting.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        design.frosting.type === frosting.id
                          ? 'border-cake-purple bg-cake-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{frosting.name}</span>
                        <span className="text-cake-purple font-medium">
                          {frosting.price > 0 ? `+£${frosting.price}` : 'Included'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frosting Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frosting Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={design.frosting.color}
                    onChange={(e) => updateFrosting({ color: e.target.value })}
                    className="w-16 h-16 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={design.frosting.color}
                      onChange={(e) => updateFrosting({ color: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                {/* Color Presets */}
                <div className="grid grid-cols-6 gap-2 mt-3">
                  {['#FFFFFF', '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'].map(color => (
                    <button
                      key={color}
                      onClick={() => updateFrosting({ color })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'decorations' && (
            <>
              {/* Decoration Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Decorations
                </label>
                <div className="space-y-3">
                  {decorationOptions.map(decoration => (
                    <label
                      key={decoration.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={design.decorations[decoration.id as keyof typeof design.decorations] as boolean}
                          onChange={(e) => updateDecorations({
                            [decoration.id]: e.target.checked
                          })}
                          className="w-5 h-5 text-cake-purple border-gray-300 rounded focus:ring-cake-purple"
                        />
                        <span className="ml-3 font-medium">{decoration.name}</span>
                      </div>
                      <span className="text-cake-purple font-medium">+£{decoration.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Border Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Border Style
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {borderStyles.map(border => (
                    <button
                      key={border.id}
                      onClick={() => updateDecorations({ border_style: border.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        design.decorations.border_style === border.id
                          ? 'border-cake-purple bg-cake-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{border.name}</span>
                        <span className="text-cake-purple font-medium">
                          {border.price > 0 ? `+£${border.price}` : 'Free'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Custom Text (+£5)
                </label>
                <input
                  type="text"
                  value={design.decorations.custom_text}
                  onChange={(e) => updateDecorations({ custom_text: e.target.value })}
                  placeholder="Happy Birthday, Congratulations, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {design.decorations.custom_text.length}/50 characters
                </p>
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <>
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Theme/Occasion
                </label>
                <select
                  value={design.theme}
                  onChange={(e) => updateDesign({ theme: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                >
                  <option value="classic">Classic</option>
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="graduation">Graduation</option>
                  <option value="baby_shower">Baby Shower</option>
                  <option value="holiday">Holiday</option>
                  <option value="custom">Custom Theme</option>
                </select>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Special Instructions
                </label>
                <textarea
                  value={design.special_instructions}
                  onChange={(e) => updateDesign({ special_instructions: e.target.value })}
                  placeholder="Any specific requirements, allergies, or special requests..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cake-purple focus:border-transparent"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {design.special_instructions.length}/500 characters
                </p>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">📋 Design Notes</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• This is an estimated design - final cake may vary slightly</li>
                  <li>• Baker will contact you to confirm details and timing</li>
                  <li>• Custom designs typically take 3-5 days to complete</li>
                  <li>• Price may be adjusted based on complexity</li>
                  <li>• Delivery or pickup will be arranged after confirmation</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
