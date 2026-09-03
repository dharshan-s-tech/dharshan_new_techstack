'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  name: string;
  label: string;
  type?: 'file' | 'image';
  currentUrl?: string;
  required?: boolean;
  onUploadStateChange?: (uploading: boolean) => void;
}

export default function FileUpload({ name, label, type = 'file', currentUrl, required, onUploadStateChange }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [fileName, setFileName] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.zip';

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setUploading(true);
    onUploadStateChange?.(true);
    
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setUploadedUrl(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    setFileName('');
    setUploadedUrl('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Hidden input to submit the URL */}
      <input type="hidden" name={name} value={uploadedUrl} />

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragging ? 'border-[#751639] bg-[#751639]/5' : 'border-gray-200 hover:border-[#751639] hover:bg-gray-50'}
        `}
      >
        {type === 'image' && preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="max-h-40 max-w-full rounded-lg mx-auto shadow" />
            <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2">
            <File className="w-5 h-5 text-[#751639]" />
            <span className="text-sm text-gray-700 font-medium">{fileName}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }}
              className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {type === 'image' ? <ImageIcon className="w-8 h-8 text-gray-300" /> : <Upload className="w-8 h-8 text-gray-300" />}
            <p className="text-sm text-gray-500">
              <span className="font-medium text-[#751639]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">{type === 'image' ? 'PNG, JPG, WEBP' : 'PDF, DOC, DOCX, XLS, ZIP'}</p>
          </div>
        )}
        {uploading && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 border-2 border-[#751639]/20 border-t-[#751639] rounded-full animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      {/* Render uploaded/current file details card with preview/download options */}
      {uploadedUrl && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {type === 'image' ? <ImageIcon className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <File className="w-5 h-5 text-gray-500 flex-shrink-0" />}
            <span className="text-xs text-gray-600 font-medium truncate max-w-[250px]">{uploadedUrl.split('/').pop()}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#751639] hover:text-[#5f0f2d] text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Preview
            </button>
            <a
              href={uploadedUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              Download
            </a>
            <button
              type="button"
              onClick={clear}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal Overlay */}
      {isPreviewOpen && uploadedUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsPreviewOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm truncate">{uploadedUrl.split('/').pop()}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={uploadedUrl}
                  download
                  className="px-3 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-100 overflow-auto flex items-center justify-center min-h-[300px]">
              {type === 'image' ? (
                <img src={uploadedUrl} alt="Preview" className="max-h-[60vh] object-contain rounded-lg shadow" />
              ) : uploadedUrl.toLowerCase().endsWith('.pdf') || type === 'file' ? (
                <iframe src={uploadedUrl} className="w-full h-[60vh] rounded border-0" title="PDF Preview" />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                  <File className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Preview not available for this file type.</p>
                  <p className="text-xs text-gray-400 mt-1">Please download the file to view its contents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
