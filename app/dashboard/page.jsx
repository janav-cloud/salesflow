'use client';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const COLORS = {
  'Most Likely to Convert': '#10b981', // emerald
  'Good Scope': '#1260CC', // blue
  'Future Scope': '#ffbf00', // amber dark
  'No Scope': '#ef4444', // red
};

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [leadData, setLeadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All');
  const [insights, setInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);

  const leadsPerPage = 5;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/upload/list');
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error('Failed to fetch file list:', err);
      }
    };
    fetchFiles();
  }, []);

  const fetchProcessedData = async (filename) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({ filename }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        const leads = Array.isArray(data) ? data : data?.leads || [];
        setLeadData(leads);
        fetchInsights(leads); // Trigger insights after loading leads
      } else {
        setError(data.error || 'Processing failed.');
        setLeadData([]);
        setInsights('');
      }

    } catch (err) {
      setError('Something went wrong while processing the file.');
      console.error(err);
      setLeadData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (data) => {
    setInsightsLoading(true);
    setInsights(''); // Reset insights while loading
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData: data }),
      });
      const result = await res.json();

      if (res.ok) {
        setInsights(result.insights || 'No insights returned.');
      } else {
        setInsights('Failed to generate insights.');
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      setInsights('Failed to generate insights.');
    } finally {
      setInsightsLoading(false);
    }
  };

  const filteredLeads = filter === 'All' ? leadData : leadData.filter(l => l.Category === filter);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage);

  const categoryCounts = leadData.reduce((acc, lead) => {
    const cat = lead.Category || 'Unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Lead Categories',
        data: Object.values(categoryCounts),
        backgroundColor: Object.keys(categoryCounts).map(cat => COLORS[cat] || '#9ca3af'),
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: Object.keys(categoryCounts).map(cat => COLORS[cat] || '#9ca3af'),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4">Overview</h1>

        {/* File Dropdown */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-900 font-medium text-lg">All your uploaded leads below!</label>
          <select
            className="w-full lg:w-2/3 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            onChange={(e) => {
              const selected = e.target.value;
              setSelectedFile(selected);
              if (selected) fetchProcessedData(selected);
            }}
            value={selectedFile}
          >
            <option value="">Select the File 📁</option>
            {files.map((file) => (
              <option key={file.filename} value={file.filename}>
                {file.filename}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        {leadData.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {['All', 'Most Likely to Convert', 'Good Scope', 'Future Scope', 'No Scope'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all shadow-sm ${
                  filter === cat
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Status Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-slate-500 mb-4">Loading processed data...</p>}

        {/* Leads Table */}
        {!loading && paginatedLeads.length > 0 && (
          <div className="bg-white rounded-3xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Categorized Leads</h2>
            <div className="overflow-auto rounded-2xl">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Lead ID</th>
                    <th className="px-4 py-3 text-left">Company</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead, index) => (
                    <tr key={index} className="border-t border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-4 py-2 text-slate-700">{lead.Lead_ID}</td>
                      <td className="px-4 py-2 text-slate-700">{lead.Company_Name}</td>
                      <td className="px-4 py-2 text-slate-700">{lead.Company_Client_Email}</td>
                      <td
                        className="px-4 py-2 font-semibold"
                        style={{ color: COLORS[lead.Category] || '#374151' }}
                      >
                        {lead.Category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Insights Panel */}
        {!loading && leadData.length > 0 && (
          <div className="bg-white rounded-3xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">📊 AI Insights</h2>

            {insightsLoading ? (
              <p className="text-slate-600 italic">Generating insights for you...</p>
            ) : (
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{insights}</p>
            )}
          </div>
        )}

        {/* Charts */}
        {!loading && leadData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-2">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Bar Chart Overview</h2>
              <Bar data={chartData} />
            </div>
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Lead Distribution</h2>
              <Pie data={pieData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}