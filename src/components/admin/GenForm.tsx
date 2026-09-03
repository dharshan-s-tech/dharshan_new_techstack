'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_MODULES } from '@/lib/admin-modules';
import FileUpload from '@/components/admin/FileUpload';

interface GenFormProps {
  moduleKey: string;
  id?: string;
  initialData?: any;
}

export default function GenForm({ moduleKey, id, initialData }: GenFormProps) {
  const router = useRouter();
  const config = ADMIN_MODULES[moduleKey];
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [options, setOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const [loading, setLoading] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!config) {
    return <div className="p-6 text-red-500">Invalid module configuration: {moduleKey}</div>;
  }

  // Load select options for relationship fields
  useEffect(() => {
    config.formFields.forEach(async (field) => {
      if (field.type === 'select') {
        if (field.options) {
          setOptions(prev => ({ ...prev, [field.name]: field.options || [] }));
        } else {
          try {
            const res = await fetch(`/api/admin/options?type=${field.name}`);
            if (res.ok) {
              const data = await res.json();
              setOptions(prev => ({ ...prev, [field.name]: data }));
            }
          } catch (err) {
            console.error(`Failed to load options for ${field.name}`, err);
          }
        }
      }
    });
  }, [config]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Capture standard form fields + FileUpload hidden fields
    const formElement = e.currentTarget as HTMLFormElement;
    const formValues: Record<string, any> = { ...formData };
    
    config.formFields.forEach(field => {
      const input = formElement.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (input) {
        if (field.type === 'boolean') {
          formValues[field.name] = (input as HTMLInputElement).checked;
        } else {
          formValues[field.name] = input.value;
        }
      }
    });

    try {
      const res = await fetch('/api/admin/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: moduleKey,
          action: id ? 'update' : 'create',
          id,
          data: formValues
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setSuccess('Record saved successfully!');
      router.push(`/admin/${moduleKey}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
        {id ? `Edit ${config.title}` : config.addTitle}
      </h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-start gap-2">
          <span>✅</span> {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {config.formFields.map(field => {
          const value = formData[field.name] !== undefined ? formData[field.name] : '';

          return (
            <div key={field.name} className={field.type === 'textarea' || field.type === 'richtext' ? 'md:col-span-2' : ''}>
              {field.type === 'boolean' ? (
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    defaultChecked={!!value}
                    className="w-4 h-4 text-[#751639] border-gray-300 rounded focus:ring-[#751639]"
                  />
                  <label htmlFor={field.name} className="text-sm font-medium text-gray-700 select-none">
                    {field.label}
                  </label>
                </div>
              ) : field.type === 'select' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name={field.name}
                    defaultValue={value}
                    required={field.required}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#751639]/20"
                  >
                    <option value="">Select {field.label}...</option>
                    {(options[field.name] || []).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : field.type === 'textarea' || field.type === 'richtext' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name={field.name}
                    defaultValue={value}
                    required={field.required}
                    rows={field.type === 'richtext' ? 8 : 4}
                    placeholder={field.placeholder}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#751639]/20 font-sans"
                  />
                  {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
                </div>
              ) : field.type === 'file' || field.type === 'image' ? (
                <div className="md:col-span-2">
                  <FileUpload
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    currentUrl={value}
                    required={field.required}
                    onUploadStateChange={(isUploading) => {
                      setActiveUploads(prev => isUploading ? prev + 1 : Math.max(0, prev - 1));
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label} {(field.required && !(id && field.type === 'password')) && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : field.type === 'date' ? 'date' : field.type === 'password' ? 'password' : 'text'}
                    name={field.name}
                    defaultValue={value ? (field.type === 'date' ? new Date(value).toISOString().split('T')[0] : value) : ''}
                    required={id && field.type === 'password' ? false : field.required}
                    placeholder={field.placeholder}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#751639]/20"
                  />
                  {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Link href={`/admin/${moduleKey}`}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading || activeUploads > 0}
          className="px-5 py-2 bg-[#751639] text-white font-medium rounded-lg text-sm hover:bg-[#5f0f2d] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {(loading || activeUploads > 0) && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
          {loading ? 'Saving...' : activeUploads > 0 ? 'Uploading file...' : 'Save Record'}
        </button>
      </div>
    </form>
  );
}
