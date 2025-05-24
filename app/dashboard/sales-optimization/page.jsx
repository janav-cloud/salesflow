"use client";

import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useState, useEffect } from "react";
import { Trash2, BarChart2, Activity, AlertCircle, Users, CheckCircle, Plus } from "lucide-react";

function getProbabilityColor(prob) {
  if (prob >= 0.8) return "text-green-600 font-bold";
  if (prob >= 0.5) return "text-yellow-600 font-semibold";
  return "text-red-600 font-semibold";
}
function getStatusColor(status) {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}
function getSeverityColor(severity) {
  if (severity === "High") return "bg-red-100 text-red-700";
  if (severity === "Medium") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function usePagination(data, pageSize = 5) {
  const [page, setPage] = useState(1);
  const maxPage = Math.max(1, Math.ceil(data.length / pageSize));
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  function next() {
    setPage(p => Math.min(p + 1, maxPage));
  }
  function prev() {
    setPage(p => Math.max(p - 1, 1));
  }
  function goTo(n) {
    setPage(Math.max(1, Math.min(n, maxPage)));
  }

  return { paginated, page, maxPage, next, prev, goTo, setPage };
}

export default function SalesOptimizationPage() {
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // Filter states
  const [dealFilter, setDealFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [alertFilter, setAlertFilter] = useState("");
  const [interactionFilter, setInteractionFilter] = useState("");

  // Form states
  const [showDealForm, setShowDealForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  // Pagination (filtered)
  const dealsPagination = usePagination(
    deals.filter(
      d =>
        !dealFilter ||
        d.name.toLowerCase().includes(dealFilter.toLowerCase()) ||
        (d.stage && d.stage.toLowerCase().includes(dealFilter.toLowerCase()))
    ),
    5
  );
  const tasksPagination = usePagination(
    tasks.filter(
      t =>
        !taskFilter ||
        t.title.toLowerCase().includes(taskFilter.toLowerCase()) ||
        (t.priority && t.priority.toLowerCase().includes(taskFilter.toLowerCase())) ||
        (t.status && t.status.toLowerCase().includes(taskFilter.toLowerCase()))
    ),
    5
  );
  const alertsPagination = usePagination(
    alerts.filter(
      a =>
        !alertFilter ||
        a.message.toLowerCase().includes(alertFilter.toLowerCase()) ||
        (a.severity && a.severity.toLowerCase().includes(alertFilter.toLowerCase())) ||
        (a.dealId && a.dealId.toLowerCase().includes(alertFilter.toLowerCase()))
    ),
    5
  );
  const interactionsPagination = usePagination(
    interactions.filter(
      i =>
        !interactionFilter ||
        i.type.toLowerCase().includes(interactionFilter.toLowerCase()) ||
        i.content.toLowerCase().includes(interactionFilter.toLowerCase()) ||
        (i.dealId && i.dealId.toLowerCase().includes(interactionFilter.toLowerCase()))
    ),
    5
  );

  // Simple form states for each entity
  const [dealForm, setDealForm] = useState({ name: "", stage: "", probability: "", value: "" });
  const [taskForm, setTaskForm] = useState({ title: "", dueDate: "", priority: "", status: "" });
  const [alertForm, setAlertForm] = useState({ message: "", severity: "", dealId: "" });
  const [interactionForm, setInteractionForm] = useState({ type: "", content: "", dealId: "" });

  // AI states
  const [aiDealLoading, setAiDealLoading] = useState(false);
  const [aiTaskLoading, setAiTaskLoading] = useState(false);
  const [aiAlertLoading, setAiAlertLoading] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);

  // AI results as strings (plain text)
  const [aiDealResults, setAiDealResults] = useState("");
  const [aiTaskResults, setAiTaskResults] = useState("");
  const [aiAlertResults, setAiAlertResults] = useState("");
  const [interactionInsights, setInteractionInsights] = useState("");

  useEffect(() => {
    fetch("/api/deals").then(res => res.json()).then(setDeals);
    fetch("/api/tasks").then(res => res.json()).then(setTasks);
    fetch("/api/alerts").then(res => res.json()).then(setAlerts);
    fetch("/api/interactions").then(res => res.json()).then(setInteractions);
  }, []);

  // Handlers for adding new entries
  async function handleAddDeal(e) {
    e.preventDefault();
    await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dealForm, probability: parseFloat(dealForm.probability), value: parseFloat(dealForm.value) }),
    });
    setDealForm({ name: "", stage: "", probability: "", value: "" });
    setShowDealForm(false);
    fetch("/api/deals").then(res => res.json()).then(setDeals);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskForm),
    });
    setTaskForm({ title: "", dueDate: "", priority: "", status: "" });
    setShowTaskForm(false);
    fetch("/api/tasks").then(res => res.json()).then(setTasks);
  }

  async function handleAddAlert(e) {
    e.preventDefault();
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alertForm),
    });
    setAlertForm({ message: "", severity: "", dealId: "" });
    setShowAlertForm(false);
    fetch("/api/alerts").then(res => res.json()).then(setAlerts);
  }

  async function handleAddInteraction(e) {
    e.preventDefault();
    await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interactionForm),
    });
    setInteractionForm({ type: "", content: "", dealId: "" });
    setShowInteractionForm(false);
    fetch("/api/interactions").then(res => res.json()).then(setInteractions);
  }

  async function handleDeleteDeal(id) {
    await fetch(`/api/deals/${id}`, { method: "DELETE" });
    fetch("/api/deals").then(res => res.json()).then(setDeals);
  }
  async function handleDeleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetch("/api/tasks").then(res => res.json()).then(setTasks);
  }
  async function handleDeleteAlert(id) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    fetch("/api/alerts").then(res => res.json()).then(setAlerts);
  }
  async function handleDeleteInteraction(id) {
    await fetch(`/api/interactions/${id}`, { method: "DELETE" });
    fetch("/api/interactions").then(res => res.json()).then(setInteractions);
  }

  // AI Integration Handlers (expect plain text)
  async function fetchDealPredictions() {
    setAiDealLoading(true);
    setAiDealResults("");
    try {
      const res = await fetch("/api/deals/ai-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deals }),
      });
      const text = await res.text();
      setAiDealResults(text || "No response from AI.");
    } catch (err) {
      setAiDealResults("AI prediction failed.");
    }
    setAiDealLoading(false);
  }

  async function fetchTaskPrioritization() {
    setAiTaskLoading(true);
    setAiTaskResults("");
    try {
      const res = await fetch("/api/tasks/ai-prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const text = await res.text();
      setAiTaskResults(text || "No response from AI.");
    } catch (err) {
      setAiTaskResults("AI analysis failed.");
    }
    setAiTaskLoading(false);
  }

  async function fetchAlertGeneration() {
    setAiAlertLoading(true);
    setAiAlertResults("");
    try {
      const res = await fetch("/api/alerts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deals, tasks }),
      });
      const text = await res.text();
      setAiAlertResults(text || "No response from AI.");
    } catch (err) {
      setAiAlertResults("AI alert generation failed.");
    }
    setAiAlertLoading(false);
  }

  async function fetchInteractionInsights() {
    setAiInsightsLoading(true);
    setInteractionInsights("");
    try {
      const res = await fetch("/api/interactions/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interactions }),
      });
      const text = await res.text();
      setInteractionInsights(text || "No response from AI.");
    } catch (err) {
      setInteractionInsights("AI insights generation failed.");
    }
    setAiInsightsLoading(false);
  }

  // Enhanced Excel Report Generation Handler with colored "insight boxes"
  async function handleGenerateReport() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Optimization Report");

    // Timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();

    // Title with timestamp
    sheet.mergeCells("A1", "E1");
    sheet.getCell("A1").value = "Sales Optimization Report";
    sheet.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
    sheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" } // blue-600
    };
    sheet.getRow(1).height = 28;

    sheet.mergeCells("A2", "E2");
    sheet.getCell("A2").value = `Generated: ${timestamp}`;
    sheet.getCell("A2").font = { italic: true, size: 11, color: { argb: "FF64748B" } }; // slate-500
    sheet.getCell("A2").alignment = { vertical: "middle", horizontal: "center" };
    sheet.getRow(2).height = 18;

    let row = 4;

    // Section helper
    function sectionHeader(title, color = "FF2563EB") {
      sheet.mergeCells(`A${row}:E${row}`);
      sheet.getCell(`A${row}`).value = title;
      sheet.getCell(`A${row}`).font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
      sheet.getCell(`A${row}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color }
      };
      sheet.getCell(`A${row}`).alignment = { vertical: "middle", horizontal: "left" };
      row++;
    }
    function tableHeader(headers, color = "FFDBEAFE", fontColor = "FF1E293B") {
      sheet.getRow(row).values = headers;
      sheet.getRow(row).font = { bold: true, color: { argb: fontColor } };
      sheet.getRow(row).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color }
      };
      row++;
    }

    // Deals Section
    sectionHeader("Deals", "FF2563EB");
    tableHeader(["Name", "Stage", "Value", "Probability"]);
    deals.forEach(d => {
      sheet.getRow(row).values = [
        d.name,
        d.stage,
        d.value,
        `${Math.round(d.probability * 100)}%`
      ];
      row++;
    });
    row++;

    // Tasks Section
    sectionHeader("Tasks", "FFF59E42");
    tableHeader(["Title", "Due Date", "Priority", "Status"], "FFFFEDD5", "FF78350F");
    tasks.forEach(t => {
      sheet.getRow(row).values = [
        t.title,
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
        t.priority,
        t.status
      ];
      row++;
    });
    row++;

    // Alerts Section
    sectionHeader("Alerts", "FFDC2626");
    tableHeader(["Message", "Severity", "Deal", "Created"], "FFFECACA", "FF991B1B");
    alerts.forEach(a => {
      sheet.getRow(row).values = [
        a.message,
        a.severity,
        a.dealId || "N/A",
        a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""
      ];
      row++;
    });
    row++;

    // Interactions Section
    sectionHeader("Interactions", "FF7C3AED");
    tableHeader(["Type", "Content", "Deal", "Date"], "FFEDE9FE", "FF5B21B6");
    interactions.forEach(i => {
      sheet.getRow(row).values = [
        i.type,
        i.content,
        i.dealId || "N/A",
        i.createdAt ? new Date(i.createdAt).toLocaleDateString() : ""
      ];
      row++;
    });
    row++;

    // AI Insights Section with colored "text boxes"
    sectionHeader("AI Insights & Summaries", "FF0EA5E9");

    function addInsightBox(label, value, color) {
      if (!value) return;
      // Label row
      sheet.mergeCells(`A${row}:E${row}`);
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`A${row}`).font = { italic: true, bold: true, color: { argb: color } };
      sheet.getCell(`A${row}`).alignment = { vertical: "middle", horizontal: "left" };
      row++;
      // Value row (colored box)
      sheet.mergeCells(`A${row}:E${row}`);
      sheet.getCell(`A${row}`).value = value;
      sheet.getCell(`A${row}`).alignment = { wrapText: true, vertical: "top", horizontal: "left" };
      sheet.getCell(`A${row}`).font = { color: { argb: "FF1E293B" }, size: 11 };
      sheet.getCell(`A${row}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color }
      };
      sheet.getRow(row).height = Math.max(24, Math.ceil(value.length / 80) * 18);
      row++;
    }

    addInsightBox("Deal Predictions:", aiDealResults, "FFDBEAFE");      // blue-100
    addInsightBox("Task Prioritization:", aiTaskResults, "FFFFEDD5");   // orange-100
    addInsightBox("Alerts:", aiAlertResults, "FFFECACA");               // red-100
    addInsightBox("Interaction Insights:", interactionInsights, "FFEDE9FE"); // purple-100

    // Auto width for columns
    sheet.columns.forEach(col => {
      let maxLength = 0;
      col.eachCell?.({ includeEmpty: true }, cell => {
        const val = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, val.length);
      });
      col.width = Math.max(12, Math.min(maxLength + 2, 40));
    });

    // Export as Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "sales-optimization-report.xlsx");
  }

  // Options for selects
  const stageOptions = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];
  const priorityOptions = ['Low', 'Medium', 'High'];
  const statusOptions = ['Pending', 'In Progress', 'Completed'];
  const severityOptions = ['Low', 'Medium', 'High'];
  const interactionTypes = ['Email', 'Call', 'Meeting'];

  return (
    <div className="p-6 font-bold text-slate-800">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
        <BarChart2 className="w-7 h-7 text-blue-600" />
        Sales Optimization Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Deals with AI Predictions */}
        <section className="bg-white rounded-lg shadow p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Current Deals & AI Insights
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowDealForm(v => !v)} className="flex items-center gap-1 text-emerald-700 hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={fetchDealPredictions}
                className="flex items-center gap-1 text-emerald-700 border px-2 py-1 rounded hover:bg-emerald-50"
                disabled={aiDealLoading || deals.length === 0}
              >
                {aiDealLoading ? "Analyzing..." : "Predict"}
              </button>
            </div>
          </div>
          {/* Filter input for deals */}
          <div className="mb-3">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              placeholder="Filter deals by name or stage..."
              value={dealFilter}
              onChange={e => setDealFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-normal">
              <thead>
                <tr>
                  <th className="py-2 px-3">Deal Name</th>
                  <th className="py-2 px-3">Stage</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3">%dC</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {dealsPagination.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-gray-500 py-4 text-center">
                      Deal list with AI predictions coming soon...
                    </td>
                  </tr>
                ) : (
                  dealsPagination.paginated.map(deal => (
                    <tr key={deal.id} className="border-t">
                      <td className="py-2 px-3">{deal.name}</td>
                      <td className="py-2 px-3">{deal.stage}</td>
                      <td className="py-2 px-3">${deal.value?.toLocaleString()}</td>
                      <td className={`py-2 px-3 ${getProbabilityColor(deal.probability)}`}>
                        {Math.round(deal.probability * 100)}%
                      </td>
                      <td className="py-2 px-3">
                        <button
                          aria-label="Delete deal"
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-2">
              <button onClick={dealsPagination.prev} disabled={dealsPagination.page === 1} className="px-2 py-1 rounded border">Prev</button>
              <span>Page {dealsPagination.page} of {dealsPagination.maxPage}</span>
              <button onClick={dealsPagination.next} disabled={dealsPagination.page === dealsPagination.maxPage} className="px-2 py-1 rounded border">Next</button>
            </div>
          </div>
          {/* AI Deal Predictions Results */}
          {aiDealResults && (
            <div className="mt-4 p-4 bg-emerald-50 rounded">
              <h4 className="font-semibold mb-2 text-emerald-800">AI Deal Predictions</h4>
              <pre className="text-emerald-900 whitespace-pre-wrap">{aiDealResults}</pre>
            </div>
          )}
        </section>

        {/* Task Prioritization */}
        <section className="bg-white rounded-lg shadow p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Task Prioritization
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowTaskForm(v => !v)} className="flex items-center gap-1 text-orange-700 hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={fetchTaskPrioritization}
                className="flex items-center gap-1 text-orange-700 border px-2 py-1 rounded hover:bg-orange-50"
                disabled={aiTaskLoading || tasks.length === 0}
              >
                {aiTaskLoading ? "Analyzing..." : "Prioritize"}
              </button>
            </div>
          </div>
          {/* Filter input for tasks */}
          <div className="mb-3">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              placeholder="Filter tasks by title, priority, or status..."
              value={taskFilter}
              onChange={e => setTaskFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-normal">
              <thead>
                <tr>
                  <th className="py-2 px-3">Task</th>
                  <th className="py-2 px-3">Due Date</th>
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {tasksPagination.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-gray-500 py-4 text-center">
                      Task prioritization will appear here.
                    </td>
                  </tr>
                ) : (
                  tasksPagination.paginated.map(task => (
                    <tr key={task.id} className="border-t">
                      <td className="py-2 px-3">{task.title}</td>
                      <td className="py-2 px-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="py-2 px-3">{task.priority}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          aria-label="Delete task"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-2">
              <button onClick={tasksPagination.prev} disabled={tasksPagination.page === 1} className="px-2 py-1 rounded border">Prev</button>
              <span>Page {tasksPagination.page} of {tasksPagination.maxPage}</span>
              <button onClick={tasksPagination.next} disabled={tasksPagination.page === tasksPagination.maxPage} className="px-2 py-1 rounded border">Next</button>
            </div>
          </div>
          {/* AI Task Prioritization Results */}
          {aiTaskResults && (
            <div className="mt-4 p-4 bg-orange-50 rounded">
              <h4 className="font-semibold mb-2 text-orange-800">AI Task Prioritization</h4>
              <pre className="text-orange-900 whitespace-pre-wrap">{aiTaskResults}</pre>
            </div>
          )}
        </section>

        {/* Alerts for At-Risk Deals */}
        <section className="bg-white rounded-lg shadow p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              At-Risk Deals & Alerts
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAlertForm(v => !v)} className="flex items-center gap-1 text-red-700 hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={fetchAlertGeneration}
                className="flex items-center gap-1 text-red-700 border px-2 py-1 rounded hover:bg-red-50"
                disabled={aiAlertLoading || deals.length === 0}
              >
                {aiAlertLoading ? "Analyzing..." : "Generate"}
              </button>
            </div>
          </div>
          {/* Filter input for alerts */}
          <div className="mb-3">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              placeholder="Filter alerts by message, severity, or deal ID..."
              value={alertFilter}
              onChange={e => setAlertFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-normal">
              <thead>
                <tr>
                  <th className="py-2 px-3">Message</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Deal</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {alertsPagination.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-gray-500 py-4 text-center">
                      No alerts at this time.
                    </td>
                  </tr>
                ) : (
                  alertsPagination.paginated.map(alert => (
                    <tr key={alert.id} className="border-t">
                      <td className="py-2 px-3">{alert.message}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3">{alert.dealId || "N/A"}</td>
                      <td className="py-2 px-3">{new Date(alert.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        <button
                          aria-label="Delete alert"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-2">
              <button onClick={alertsPagination.prev} disabled={alertsPagination.page === 1} className="px-2 py-1 rounded border">Prev</button>
              <span>Page {alertsPagination.page} of {alertsPagination.maxPage}</span>
              <button onClick={alertsPagination.next} disabled={alertsPagination.page === alertsPagination.maxPage} className="px-2 py-1 rounded border">Next</button>
            </div>
          </div>
          {/* AI Alert Generation Results */}
          {aiAlertResults && (
            <div className="mt-4 p-4 bg-red-50 rounded">
              <h4 className="font-semibold mb-2 text-red-800">AI Generated Alerts</h4>
              <pre className="text-red-900 whitespace-pre-wrap">{aiAlertResults}</pre>
            </div>
          )}
        </section>

        {/* Customer Interaction History */}
        <section className="bg-white rounded-lg shadow p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Customer Interaction History
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowInteractionForm(v => !v)} className="flex items-center gap-1 text-purple-700 hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={fetchInteractionInsights}
                className="flex items-center gap-1 text-purple-700 border px-2 py-1 rounded hover:bg-purple-50"
                disabled={aiInsightsLoading || interactions.length === 0}
              >
                {aiInsightsLoading ? "Analyzing..." : "Insights"}
              </button>
            </div>
          </div>
          {/* Filter input for interactions */}
          <div className="mb-3">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              placeholder="Filter interactions by type, content, or deal ID..."
              value={interactionFilter}
              onChange={e => setInteractionFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-normal">
              <thead>
                <tr>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Content</th>
                  <th className="py-2 px-3">Deal</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3"></th> 
                </tr>
              </thead>
              <tbody>
                {interactionsPagination.paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-gray-500 py-4 text-center">
                      Interaction history will be shown here.
                    </td>
                  </tr>
                ) : (
                  interactionsPagination.paginated.map(interaction => (
                    <tr key={interaction.id} className="border-t">
                      <td className="py-2 px-3">{interaction.type}</td>
                      <td className="py-2 px-3">{interaction.content}</td>
                      <td className="py-2 px-3">{interaction.dealId || "N/A"}</td>
                      <td className="py-2 px-3">{new Date(interaction.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        <button
                          aria-label="Delete interaction"
                          onClick={() => handleDeleteInteraction(interaction.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-2 mt-2">
              <button onClick={interactionsPagination.prev} disabled={interactionsPagination.page === 1} className="px-2 py-1 rounded border">Prev</button>
              <span>Page {interactionsPagination.page} of {interactionsPagination.maxPage}</span>
              <button onClick={interactionsPagination.next} disabled={interactionsPagination.page === interactionsPagination.maxPage} className="px-2 py-1 rounded border">Next</button>
            </div>
          </div>
          {/* AI Insights Section */}
          {interactionInsights && (
            <div className="mt-4 p-4 bg-purple-50 rounded">
              <h4 className="font-semibold mb-2 text-purple-800">AI Insights</h4>
              <pre className="text-purple-900 whitespace-pre-wrap">{interactionInsights}</pre>
            </div>
          )}
        </section>
      </div>

      {/* --- PDF Report Generation --- */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg shadow text-base font-normal">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerateReport}
            className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            Generate Excel Report
          </button>
          <span className="text-slate-700">Download a summary of all data and AI insights as an Excel file.</span>
        </div>
      </div>
    </div>
  );
}