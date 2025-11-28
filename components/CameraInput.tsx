import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

interface CameraInputProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onImageSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem.');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment" // Hints mobile browsers to use the rear camera
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-8 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-600/20 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500"
        >
          <Camera className="w-10 h-10 mb-3" />
          <span className="font-semibold text-lg">Fotografar</span>
        </button>

        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-10 h-10 mb-3" />
          <span className="font-semibold text-lg">Galeria</span>
        </button>
      </div>
      
      <p className="text-center text-sm text-slate-400 mt-6">
        Formatos suportados: JPG, PNG, WEBP
      </p>
    </div>
  );
};