'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { addPhotoToJourney, updatePhoto, deletePhoto } from '@/app/actions/photos';
import { Upload, Trash2, Star, ArrowLeft } from 'lucide-react';

interface PhotoItem {
  id: string;
  imageUrl: string;
  caption?: string | null;
  location?: string | null;
  category: string;
  aspectRatio: string;
  displayOrder: number;
  isFeatured: boolean;
}

interface PhotoManagerProps {
  journeyId: string;
  journeyTitle: string;
  journeySlug: string;
  initialPhotos: PhotoItem[];
}

const CATEGORIES = ['Landscape', 'Nature', 'Architecture', 'Moments', 'People', 'Food', 'Other'];
const RATIOS = ['16/9', '4/3', '3/2', '1/1', '2/3', '3/4'];

export default function PhotoManager({
  journeyId,
  journeyTitle,
  journeySlug,
  initialPhotos,
}: PhotoManagerProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setUploadProgress({ total: acceptedFiles.length, done: 0 });

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            const photoRes = await addPhotoToJourney({
              journeyId,
              imageUrl: data.url,
              caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
              category: 'Landscape',
              aspectRatio: '3/2',
            });

            if (photoRes.photo) {
              setPhotos((prev) => [...prev, photoRes.photo]);
            }
          }
        } catch (err) {
          console.error('Failed to upload file:', file.name, err);
        }

        setUploadProgress({ total: acceptedFiles.length, done: i + 1 });
      }

      setUploading(false);
    },
    [journeyId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleUpdate = async (id: string, updates: Partial<PhotoItem>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    await updatePhoto(id, updates);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photograph from the archive?')) return;
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    await deletePhoto(id);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/journeys/${journeyId}`}
            className="p-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A87428] font-semibold block">
              Photo Management Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0D0E12]">{journeyTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/journeys/${journeySlug}`}
            target="_blank"
            className="px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-mono uppercase tracking-wider text-[#0D0E12] font-semibold transition-colors shadow-xs"
          >
            View Live Folio →
          </Link>
        </div>
      </div>

      {/* Drag and Drop Zone in Light Theme */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
          isDragActive
            ? 'border-[#A87428] bg-[#A87428]/10 scale-[1.01]'
            : 'border-neutral-300 bg-white hover:border-[#A87428] hover:bg-neutral-50/70 shadow-xs'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-full bg-[#A87428]/15 border border-[#A87428]/30 flex items-center justify-center text-[#A87428]">
          <Upload className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-display font-bold text-[#0D0E12]">
            {isDragActive ? 'Drop photographs here...' : 'Upload Photographs (Batch Drag & Drop)'}
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Supports high-resolution JPEG, PNG, WebP, AVIF.
          </p>
        </div>

        {uploading && (
          <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#A87428] h-full transition-all duration-300"
                style={{
                  width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-[#A87428] font-semibold">
              Archiving {uploadProgress.done} of {uploadProgress.total} photographs...
            </span>
          </div>
        )}
      </div>

      {/* Photos Grid & Metadata Editor */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#A87428] font-mono font-semibold">
              Archived Frames
            </span>
            <span className="text-xs text-neutral-500 font-mono">({photos.length} total)</span>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-mono text-xs glass-card-light rounded-2xl">
            No photographs uploaded yet. Drag & drop image files into the upload box above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="glass-card-light rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-neutral-100">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption || 'Archived photograph'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />

                  {/* Featured badge button */}
                  <button
                    onClick={() => handleUpdate(photo.id, { isFeatured: !photo.isFeatured })}
                    className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      photo.isFeatured
                        ? 'bg-[#A87428] text-white border-[#A87428] shadow-sm'
                        : 'bg-white/80 text-neutral-500 border-neutral-300 hover:text-black'
                    }`}
                    title={photo.isFeatured ? 'Featured Hero Item' : 'Mark as Featured'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-red-500 text-neutral-600 hover:text-white backdrop-blur-md border border-neutral-300 transition-colors cursor-pointer shadow-sm"
                    title="Delete Photograph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metadata Editor Inputs */}
                <div className="p-4 flex flex-col gap-3 bg-white">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1 font-medium">
                      Caption / Memory
                    </label>
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={(e) => handleUpdate(photo.id, { caption: e.target.value })}
                      placeholder="Write an intimate memory or note..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-[#0D0E12] focus:border-[#A87428] focus:outline-none font-serif italic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1 font-medium">
                        Category
                      </label>
                      <select
                        value={photo.category}
                        onChange={(e) => handleUpdate(photo.id, { category: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-[#0D0E12] focus:border-[#A87428] focus:outline-none font-mono"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1 font-medium">
                        Aspect Ratio
                      </label>
                      <select
                        value={photo.aspectRatio}
                        onChange={(e) => handleUpdate(photo.id, { aspectRatio: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-[#0D0E12] focus:border-[#A87428] focus:outline-none font-mono"
                      >
                        {RATIOS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1 font-medium">
                      Specific Location
                    </label>
                    <input
                      type="text"
                      value={photo.location || ''}
                      onChange={(e) => handleUpdate(photo.id, { location: e.target.value })}
                      placeholder="e.g. Phewa Lake North Shore"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-[#0D0E12] focus:border-[#A87428] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
