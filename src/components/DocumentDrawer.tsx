import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Trash2,
  BookOpen,
  FileCheck,
  Search,
  Plus,
  Info
} from 'lucide-react';
import { UniversityDocument } from '../types.ts';

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: UniversityDocument[];
  onUploadDocument: (doc: { title: string; category: 'policy' | 'syllabus' | 'notes' | 'general'; content: string; summary: string }) => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
  onAskAboutDoc: (prompt: string) => void;
}

export const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  onUploadDocument,
  onDeleteDocument,
  onAskAboutDoc
}) => {
  const [selectedDoc, setSelectedDoc] = useState<UniversityDocument | null>(documents[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'policy' | 'syllabus' | 'notes' | 'general'>('notes');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onUploadDocument({
      title: title.trim(),
      category,
      content: content.trim(),
      summary: content.trim().slice(0, 160) + '...'
    });
    setTitle('');
    setContent('');
    setIsUploading(false);
  };

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">University Document Knowledge Base</h2>
              <p className="text-xs text-slate-500">
                Official documents, regulations & course handouts indexed for the Document Search tool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Document List */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50 p-4 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
              <button
                onClick={() => setIsUploading(!isUploading)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors shrink-0 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Document Cards List */}
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIsUploading(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id && !isUploading
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        doc.category === 'policy'
                          ? 'bg-orange-50 text-orange-600 border-orange-200'
                          : doc.category === 'syllabus'
                          ? 'bg-purple-50 text-purple-600 border-purple-200'
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {doc.category}
                      </span>
                      {doc.isSystemDefault && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                          Official
                        </span>
                      )}
                    </div>
                    {!doc.isSystemDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(doc.id);
                          if (selectedDoc?.id === doc.id) setSelectedDoc(documents[0] || null);
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {doc.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Viewer or Uploader */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-white flex flex-col justify-between">
            {isUploading ? (
              /* Upload Form */
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Upload New Document / Notes</h3>
                  <button
                    type="button"
                    onClick={() => setIsUploading(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CS201 Algorithms Syllabus or Physics Lab Guide"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="policy">Policy / Regulations</option>
                    <option value="syllabus">Syllabus / Course Handout</option>
                    <option value="notes">Lecture Notes / Reference</option>
                    <option value="general">General University Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">
                    Document Text Content
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste regulation text, syllabus topics, or notes here..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save & Index into Knowledge Base
                </button>
              </form>
            ) : selectedDoc ? (
              /* Selected Document Preview */
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedDoc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-slate-500 capitalize">
                        Category: {selectedDoc.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAskAboutDoc(`What does the uploaded document "${selectedDoc.title}" say about attendance and grading?`);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Query this doc</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedDoc.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No document selected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

