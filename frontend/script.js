const runBtn = document.getElementById("runBtn");
const refreshBtn = document.getElementById("refreshBtn");
const resultBox = document.getElementById("result");
const promptInput = document.getElementById("prompt");
const actionInput = document.getElementById("action");
const historyBox = document.getElementById("history");

runBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Run button clicked");
  runWorkflow();
});

refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Refresh button clicked");
  fetchHistory();
});

// 🧹 Clear result box when user starts typing
[promptInput, actionInput].forEach((input) => {
  input.addEventListener("input", () => {
    resultBox.innerHTML = "";
  });
});

async function runWorkflow() {
  const prompt = promptInput.value.trim();
  const action = actionInput.value.trim();

  if (!prompt || !action) {
    resultBox.innerHTML = `<p style="color:red;">⚠️ Please enter both prompt and action.</p>`;
    return;
  }

  resultBox.innerHTML = "⏳ Running workflow...";

  try {
    const res = await fetch("http://localhost:5000/run-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, action }),
    });

    const data = await res.json();

    if (!res.ok) {
      resultBox.innerHTML = `<p style="color:red;">
        ❌ Error: ${data.error || "Unknown error"}<br>
        <small>${data.details || ""}</small>
      </p>`;
      return;
    }

    console.log("✅ Workflow result:", data);

    resultBox.innerHTML = `
    <p><b>AI Response:</b> ${data.ai_response}</p>
      <p><b>API Response:</b> ${data.api_response}</p>
      <p><b>Final Result:</b> ${data.final_result}</p>
    `;

    // ✅ Refresh history after running workflow
    fetchHistory();
  } catch (err) {
    console.error("⚠️ Request failed:", err);
    resultBox.innerHTML = `<p style="color:red;">⚠️ Request failed: ${err.message}</p>`;
  }
}

// 📜 Fetch workflow history
async function fetchHistory() {
  historyBox.innerHTML = "⏳ Loading history...";

  try {
    const res = await fetch("http://localhost:5000/history");
    const data = await res.json();

    if (!res.ok) {
      historyBox.innerHTML = `<p style="color:red;">❌ Error fetching history</p>`;
      return;
    }

    if (data.length === 0) {
      historyBox.innerHTML = `<p>📭 No history found</p>`;
      return;
    }

    historyBox.innerHTML = data
      .map(
        (row) => `
        <div class="history-item">
          <b>${row.action.toUpperCase()}</b> | 
          <i>${row.prompt}</i><br/>
          <small>${row.final_result}</small>
        </div>
      `
      )
      .join("<hr/>");
  } catch (err) {
    historyBox.innerHTML = `<p style="color:red;">⚠️ Failed to load history: ${err.message}</p>`;
  }
}

// 🚀 Auto-load history on page load
window.onload = fetchHistory;
