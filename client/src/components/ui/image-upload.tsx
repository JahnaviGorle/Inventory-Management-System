import { useState, useRef } from "react";

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  currentImage?: string | null;
  className?: string;
}

export default function ImageUpload({ onImageChange, currentImage, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-upload ${className || ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <div className="image-preview">
          <img 
            src={preview} 
            alt="Product preview" 
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-gray-200)'
            }}
          />
          <div className="image-actions">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Change Image'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="image-placeholder"
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            height: '200px',
            border: '2px dashed var(--color-gray-300)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--color-gray-50)',
            transition: 'all var(--transition-base)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-gray-300)';
            e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-2)' }}>📷</div>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </p>
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-xs)' }}>
            PNG, JPG up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}