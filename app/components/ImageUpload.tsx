'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    setUploading(true)
    const newImages = [...images]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'cakes')

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        newImages.push(data.url)
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image. Please use the "Add Image URL" option instead.')
      }
    }

    onImagesChange(newImages)
    setUploading(false)
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return

    if (images.length >= maxImages) {
      alert(`You can only add up to ${maxImages} images`)
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
      onImagesChange([...images, urlInput])
      setUrlInput('')
      setShowUrlInput(false)
    } catch {
      alert('Please enter a valid image URL')
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative h-32 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Cake image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {images.length < maxImages && !showUrlInput && (
          <label className="relative h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-cake-pink">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="sr-only"
              disabled={uploading}
            />
            <div className="text-center">
              {uploading ? (
                <span className="text-gray-500">Uploading...</span>
              ) : (
                <>
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm text-gray-500">Upload File</span>
                </>
              )}
            </div>
          </label>
        )}

        {images.length < maxImages && showUrlInput && (
          <div className="relative h-32 border-2 border-dashed border-cake-pink rounded-lg p-2 flex flex-col">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 text-sm px-2 py-1 border rounded mb-1"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleUrlAdd}
                className="flex-1 bg-cake-pink text-white text-xs py-1 rounded"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setUrlInput('')
                }}
                className="flex-1 bg-gray-300 text-gray-700 text-xs py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Upload up to {maxImages} images. Recommended size: 1200x1200px
        </p>
        {images.length < maxImages && !showUrlInput && (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-sm text-cake-purple hover:underline"
          >
            Or add image URL
          </button>
        )}
      </div>
    </div>
  )
}
