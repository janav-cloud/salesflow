'use client';

import { useEffect, useState } from 'react';

export default function LeadsPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        fetchFiles(); // reload the file list
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('Upload error');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
  
      if (res.ok) {
        fetchFiles(); // Refresh file list
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const fetchFiles = async () => {
    setLoadingFiles(true);
    setError(null);
    try {
      const res = await fetch(`/api/upload/list?page=${page}&limit=5`);
      const data = await res.json();

      if (Array.isArray(data.files)) {
        setUploadedFiles(data.files);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching file list:', err);
      setUploadedFiles([]);
      setTotalPages(1);
      setError('Could not load files');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="space-y-10">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">📤 Upload Lead File</h1>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-slate-300 p-3 rounded-2xl mb-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`bg-emerald-600 text-white px-6 py-2 rounded-3xl transition-all hover:bg-emerald-700 ${
              uploading || !file ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Uploaded Files Section */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">📁 Uploaded Files</h2>

          {loadingFiles ? (
            <p className="text-slate-600">Loading files...</p>
          ) : uploadedFiles.length > 0 ? (
            <>
              <ul className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-slate-900">{file.originalName}</div>
                    <div className="text-sm text-slate-600">
                      {new Date(file.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-2xl transition duration-200"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-2xl bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-slate-600 text-sm">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-2xl bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-500">No uploaded files found.</p>
          )}
        </div>
      </div>
    </div>
  );
}