'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createJourney, updateJourney } from '@/app/actions/journeys';
import { Upload, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface JourneyFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    countryName: string;
    cityName: string;
    latitude: number;
    longitude: number;
    travelDate: string;
    daysCount: number;
    coverImage: string;
    excerpt: string;
    story: string;
    published: boolean;
  };
  isEditing?: boolean;
}

export default function JourneyForm({ initialData, isEditing = false }: JourneyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    countryName: initialData?.countryName || 'Nepal',
    cityName: initialData?.cityName || '',
    latitude: initialData?.latitude ?? 28.2096,
    longitude: initialData?.longitude ?? 83.9856,
    travelDate: initialData?.travelDate || new Date().toISOString().slice(0, 10),
    daysCount: initialData?.daysCount ?? 3,
    coverImage: initialData?.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    excerpt: initialData?.excerpt || '',
    story: initialData?.story || '',
    published: initialData?.published ?? true,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!isEditing || !formData.slug) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, title, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && initialData?.id) {
        await updateJourney(initialData.id, formData);
        router.push('/admin/journeys');
        router.refresh();
      } else {
        const res = await createJourney(formData);
        if (res.journey) {
          router.push(`/admin/journeys/${res.journey.id}/photos`);
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save journey');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/journeys"
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A87428] font-semibold block">
              {isEditing ? 'Edit Expedition' : 'New Nepal Folio'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0D0E12]">
              {isEditing ? `Edit: ${formData.title || 'Untitled'}` : 'Document New Nepal Expedition'}
            </h1>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full bg-[#0D0E12] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#A87428] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
        >
          <Check className="w-4 h-4 text-[#C28E46]" />
          <span>{loading ? 'Saving...' : isEditing ? 'Update Folio' : 'Create & Add Photos'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Metadata Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Expedition Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Pokhara"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-display font-bold shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            URL Slug *
          </label>
          <div className="flex items-center">
            <span className="px-3 py-3 rounded-l-xl bg-neutral-100 border border-r-0 border-neutral-300 text-neutral-500 text-xs font-mono">
              /journeys/
            </span>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="pokhara"
              className="w-full px-4 py-3 rounded-r-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-mono text-xs shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Country *
          </label>
          <input
            type="text"
            required
            value={formData.countryName}
            onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
            placeholder="Nepal"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Location / Region *
          </label>
          <input
            type="text"
            required
            value={formData.cityName}
            onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
            placeholder="e.g. Phewa Lake & Sarangkot"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Latitude (°N) *
          </label>
          <input
            type="number"
            step="any"
            required
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            placeholder="28.2096"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-mono shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Longitude (°E) *
          </label>
          <input
            type="number"
            step="any"
            required
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            placeholder="83.9856"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-mono shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Travel Date *
          </label>
          <input
            type="date"
            required
            value={formData.travelDate}
            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-mono shadow-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
            Duration (Days) *
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.daysCount}
            onChange={(e) => setFormData({ ...formData, daysCount: parseInt(e.target.value, 10) })}
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-mono shadow-xs"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="glass-card-light p-6 rounded-2xl">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-3 font-medium">
          Hero Cover Photograph *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-6 relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
            {formData.coverImage ? (
              <Image src={formData.coverImage} alt="Cover preview" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono">
                No cover chosen
              </div>
            )}
          </div>

          <div className="sm:col-span-6 flex flex-col gap-3">
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="Paste image URL or upload below..."
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-[#0D0E12] focus:border-[#A87428] focus:outline-none font-mono"
            />

            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4 text-[#A87428]" />
              <span>{uploadingCover ? 'Uploading Image...' : 'Upload Cover File'}</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
          Short Pull Quote / Excerpt *
        </label>
        <textarea
          required
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Three days beside the lake, surrounded by mountains, quiet mornings and long walks..."
          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-serif italic shadow-xs"
        />
      </div>

      {/* Personal Travel Story */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-2 font-medium">
          Personal Travel Story / Memoir *
        </label>
        <textarea
          required
          rows={8}
          value={formData.story}
          onChange={(e) => setFormData({ ...formData, story: e.target.value })}
          placeholder="Write your personal memories of Nepal here. Separate paragraphs with double newlines..."
          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-[#0D0E12] text-sm focus:border-[#A87428] focus:outline-none font-sans leading-relaxed shadow-xs"
        />
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="w-4 h-4 rounded text-[#A87428] focus:ring-[#A87428] accent-[#A87428]"
        />
        <label htmlFor="published" className="text-xs font-mono uppercase tracking-wider text-[#0D0E12] font-semibold cursor-pointer">
          Publish Live Immediately (Visible on Homepage, Nepal Map, and Archive)
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-[#0D0E12] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#A87428] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Check className="w-4 h-4 text-[#C28E46]" />
        <span>{loading ? 'Saving Changes...' : isEditing ? 'Save Expedition Changes' : 'Create Folio & Add Photos'}</span>
      </button>
    </form>
  );
}
