'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, File, Image as ImageIcon, Eye, Download, ZoomIn } from 'lucide-react';
import { getCloudFrontUrl } from '@/lib/cdnUtils';

interface FileUploadProps {
  name: string;
  label: string;
  type?: 'file' | 'image';
  currentUrl?: string;
  required?: boolean;
  onUploadStateChange?: (uploading: boolean) => void;
}

export default function FileUpload({ name, label, type = 'file', currentUrl, required, onUploadStateChange }: FileUploadProps) {
  const initialResolved = currentUrl ? getCloudFrontUrl(currentUrl) : null;
  const [preview, setPreview] = useState<string | null>(initialResolved);
  const [fileName, setFileName] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUrl) {
      setUploadedUrl(currentUrl);
      setPreview(getCloudFrontUrl(currentUrl));
    }
  }, [currentUrl]);

  const accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.zip';

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setUploading(true);
    onUploadStateChange?.(true);
    
    if (type === 'image' || file.type.startsWith('image/')) {
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
        if (!preview || !preview.startsWith('data:')) {
          setPreview(getCloudFrontUrl(data.url));
        }
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

  const effectivePreviewUrl = preview || (uploadedUrl ? getCloudFrontUrl(uploadedUrl) : null);
  const isImageFile = type === 'image' || 
    (uploadedUrl && uploadedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) !== null) ||
    (preview && preview.startsWith('data:image'));

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
          border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all relative overflow-hidden
          ${dragging ? 'border-[#751639] bg-[#751639]/5' : 'border-gray-200 hover:border-[#751639] hover:bg-gray-50/50'}
        `}
      >
        {isImageFile && effectivePreviewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative group inline-block max-w-full">
              <img 
                src={effectivePreviewUrl} 
                alt="Picture Preview" 
                className="max-h-48 max-w-full rounded-xl object-contain mx-auto shadow-md border border-gray-200 bg-white" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(true); }}
                  className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-semibold shadow flex items-center gap-1 hover:bg-gray-100"
                >
                  <Eye className="w-3.5 h-3.5" /> Full Picture
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clear(); }}
                  className="p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Click picture to change or drag and drop a new image</p>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2 py-3">
            <File className="w-5 h-5 text-[#751639]" />
            <span className="text-sm text-gray-700 font-medium">{fileName}</span>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            {type === 'image' ? (
              <div className="p-3 bg-[#751639]/10 text-[#751639] rounded-2xl">
                <ImageIcon className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-3 bg-gray-100 text-gray-400 rounded-2xl">
                <Upload className="w-8 h-8" />
              </div>
            )}
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#751639]">Click to upload {type === 'image' ? 'picture' : 'file'}</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">{type === 'image' ? 'PNG, JPG, JPEG, WEBP, SVG' : 'PDF, DOC, DOCX, XLS, ZIP'}</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-medium text-[#751639]">
            <div className="w-4 h-4 border-2 border-[#751639]/20 border-t-[#751639] rounded-full animate-spin" />
            Uploading picture...
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      {/* Render uploaded/current file details card with preview/download options */}
      {uploadedUrl && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {isImageFile && effectivePreviewUrl ? (
              <img 
                src={effectivePreviewUrl} 
                alt="Thumb" 
                className="w-10 h-10 object-cover rounded-lg border border-gray-200 bg-white shrink-0 cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                <File className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate max-w-[280px]">
                {uploadedUrl.split('/').pop()?.split('?')[0] || 'Uploaded File'}
              </p>
              <p className="text-[11px] text-gray-400 truncate max-w-[280px] font-mono">
                {uploadedUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#751639] border border-gray-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <a
              href={effectivePreviewUrl || uploadedUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <button
              type="button"
              onClick={clear}
              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Picture & Document Lightbox Preview Modal Overlay */}
      {isPreviewOpen && (effectivePreviewUrl || uploadedUrl) && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150" 
          onClick={() => { setIsPreviewOpen(false); setIsZoomed(false); }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <div className="p-1.5 bg-[#751639]/10 text-[#751639] rounded-lg">
                  {isImageFile ? <ImageIcon className="w-4 h-4" /> : <File className="w-4 h-4" />}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm truncate max-w-md">
                  {uploadedUrl.split('/').pop()?.split('?')[0] || 'Preview'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isImageFile && (
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    {isZoomed ? 'Fit to Screen' : 'Zoom In'}
                  </button>
                )}
                <a
                  href={effectivePreviewUrl || uploadedUrl}
                  download
                  className="px-3 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => { setIsPreviewOpen(false); setIsZoomed(false); }}
                  className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 bg-gray-950/5 overflow-auto flex items-center justify-center min-h-[350px] max-h-[75vh]">
              {isImageFile && effectivePreviewUrl ? (
                <img 
                  src={effectivePreviewUrl} 
                  alt="Picture Preview" 
                  className={`rounded-xl shadow-md transition-all duration-200 ${
                    isZoomed 
                      ? 'max-h-none max-w-none cursor-zoom-out' 
                      : 'max-h-[65vh] max-w-full object-contain cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              ) : uploadedUrl.toLowerCase().endsWith('.pdf') || type === 'file' ? (
                <iframe src={effectivePreviewUrl || uploadedUrl} className="w-full h-[65vh] rounded-xl border-0 bg-white" title="Document Preview" />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border w-full max-w-md mx-auto">
                  <File className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-700 font-semibold">Preview not available for this file type.</p>
                  <p className="text-xs text-gray-400 mt-1">Please download the file to inspect its content.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
