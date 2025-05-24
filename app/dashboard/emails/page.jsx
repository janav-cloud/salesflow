"use client";

import { useState, useEffect } from "react";

const EmailPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendStatusMessage, setSendStatusMessage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const categories = [
    "Most Likely to Convert",
    "Good Scope",
    "Future Scope",
    "No Scope"
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/upload/list");
        const data = await response.json();
        setUploadedFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Could not load uploaded files.");
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = async (e) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    setSelectedCategory("");
    setEmailSubject("");
    setEmailBody("");
    setAiPrompt(""); // Clear AI prompt on file change

    if (fileName) {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/process-file-background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName }),
        });
        const data = await response.json();
        if (data.success) {
          console.log("Background processing initiated:", data.message);
        } else {
          console.error("Background processing failed:", data.error);
          alert("Failed to initiate background processing.");
        }
      } catch (error) {
        console.error("Error calling background processing:", error);
        alert("Error initiating background processing.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleGenerateEmail = async () => {
    if (!selectedFile || !selectedCategory) {
      alert("Please select a file and a category.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/emails/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile,
          category: selectedCategory
        })
      });

      const data = await response.json();

      if (data.subject && data.body) {
        setEmailSubject(data.subject);
        setEmailBody(data.body);
      } else {
        alert("Error generating email.");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAiEmail = async () => {
    if (!selectedFile || !selectedCategory || !aiPrompt) {
      alert("Please select a file, category, and provide a prompt.");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const response = await fetch("/api/emails/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile,
          category: selectedCategory,
          prompt: aiPrompt,
        }),
      });

      const data = await response.json();

      if (data.subject && data.body) {
        setEmailSubject(data.subject);
        setEmailBody(data.body);
      } else {
        alert("Error generating email with AI.");
      }
    } catch (error) {
      console.error("Error generating email with AI:", error);
      alert("Something went wrong during AI generation.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSendEmail = () => {
    if (!emailSubject || !emailBody || !selectedFile || !selectedCategory) {
      alert("Please select a file, category, and ensure subject and body are not empty.");
      return;
    }

    setIsSending(true);
    setSendProgress(0);
    setSendStatusMessage("Connecting...");

    const url = `/api/emails/send?fileName=${encodeURIComponent(selectedFile)}&category=${encodeURIComponent(selectedCategory)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const eventSource = new EventSource(url);


    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.progress !== undefined) {
          setSendProgress(data.progress);
          setSendStatusMessage(`Sending email ${data.sent} of ${data.total} to ${data.to}...`);
        } else if (data.complete) {
          setSendStatusMessage(`Finished sending ${data.sent} emails out of ${data.total}.`);
          setIsSending(false);
          eventSource.close();
        } else if (data.error) {
          setSendStatusMessage(`Error: ${data.error}`);
          setIsSending(false);
          eventSource.close();
        }
      } catch (error) {
        console.error("Error parsing SSE event:", error);
        setSendStatusMessage("Error processing update.");
        setIsSending(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setSendStatusMessage("Connection error during sending.");
      setIsSending(false);
      eventSource.close();
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Left Column: Controls */}
        <div className="mb-8 lg:mb-0">
          <h2 className="text-xl font-bold text-sky-600 mb-4">📩 Email Configuration</h2>

          {/* File Selection */}
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-slate-700">Select Uploaded File</label>
            <select
              id="file"
              value={selectedFile}
              onChange={handleFileChange}
              className="text-slate-800 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi}
            >
              <option value="">-- Select a File --</option>
              {uploadedFiles.map((file, index) => (
                <option key={index} value={file.filename}>{file.filename}</option>
              ))}
            </select>
            {isProcessing && <p className="mt-2 text-sm text-gray-500">Processing file...</p>}
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Select Lead Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-slate-800 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi || !selectedFile}
            >
              <option value="">-- Select a Category --</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* AI Prompt */}
          <div className="mb-4">
            <label htmlFor="aiPrompt" className="block text-sm font-medium text-slate-700">AI Email Prompt</label>
            <textarea
              id="aiPrompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="text-slate-800 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              rows={4}
              placeholder="Enter a prompt for AI email generation..."
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi || !selectedFile || !selectedCategory}
            />
            <button
              onClick={handleGenerateAiEmail}
              className="mt-2 w-full bg-sky-500 text-white py-2 rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi || !selectedFile || !selectedCategory || !aiPrompt}
            >
              {isGeneratingAi ? "Generating AI Email..." : "Generate AI Email"}
            </button>
          </div>

          {/* Standard Generate Button */}
          <button
            onClick={handleGenerateEmail}
            className="w-full bg-emerald-600 text-white py-2 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors"
            disabled={isGenerating || isProcessing || isSending || isGeneratingAi || !selectedFile || !selectedCategory}
          >
            {isGenerating ? "Generating Standard Email..." : "Generate Standard Email"}
          </button>
        </div>

        {/* Right Column: Email Preview and Sending */}
        <div>
          <h2 className="text-xl font-bold text-emerald-600 mb-4">📝 Email Preview & Send</h2>

          {/* Email Subject */}
          <div className="mb-4">
            <label htmlFor="emailSubject" className="block text-sm font-medium text-slate-700">Email Subject</label>
            <input
              type="text"
              id="emailSubject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="text-slate-800 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              placeholder="Subject of the email"
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi}
            />
          </div>

          {/* Email Body */}
          <div className="mb-4">
            <label htmlFor="emailBody" className="block text-sm font-medium text-slate-700">Email Body</label>
            <textarea
              id="emailBody"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="text-slate-800 mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              rows={8}
              placeholder="Email content"
              disabled={isProcessing || isSending || isGenerating || isGeneratingAi}
            ></textarea>
          </div>

          {/* Send Email Button */}
          <button
            onClick={handleSendEmail}
            className="w-full bg-emerald-600 text-white py-2 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors"
            disabled={isSending || isGenerating || isProcessing || isGeneratingAi || !emailSubject || !emailBody || !selectedFile || !selectedCategory}
          >
            {isSending ? "Sending Emails..." : "Send Emails"}
          </button>

          {/* Sending Progress */}
          {isSending && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-700">{sendStatusMessage}</p>
              <progress value={sendProgress} max="100" className="w-full h-2 rounded-full bg-gray-200 appearance-none">
                {sendProgress}%
              </progress>
              <p className="text-xs text-gray-500">{sendProgress}% complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
