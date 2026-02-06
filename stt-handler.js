/**
 * 实时语音转文字 (STT) 前端
 * - 流式：上传一段音频，按识别出的片段 SSE 展示
 * - 实时对讲：WebSocket 持续发音频 chunk，持续收文字
 */

const API_BASE = window.location.origin;
const WS_BASE = (window.location.protocol === "https:" ? "wss:" : "ws:") + "//" + window.location.host;

/**
 * 流式转录：上传音频，按 SSE 逐段追加到 outputEl
 * @param {File|Blob|string} audio - 文件、Blob 或 base64 字符串
 * @param {HTMLElement} outputEl - 显示转录结果的容器
 * @param {object} opts - { language: "zh" }
 */
async function sttStream(audio, outputEl, opts = {}) {
  const { language } = opts;
  outputEl.textContent = "";

  let body;
  let contentType;
  if (typeof audio === "string") {
    body = JSON.stringify({ audio_base64: audio, language: language || undefined });
    contentType = "application/json";
  } else {
    const form = new FormData();
    form.append("file", audio instanceof File ? audio : new File([audio], "audio.wav"));
    if (language) form.append("language", language);
    body = form;
    contentType = undefined;
  }

  const res = await fetch(`${API_BASE}/ai/stt/transcribe_stream`, {
    method: "POST",
    headers: contentType ? { "Content-Type": contentType } : {},
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.msg || `HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const obj = JSON.parse(data);
        if (obj.error) throw new Error(obj.error);
        if (obj.text) outputEl.appendChild(document.createTextNode(obj.text));
      } catch (e) {
        if (e.message) outputEl.textContent += "\n[错误] " + e.message;
      }
    }
  }
}

/**
 * 实时对讲：麦克风 → 按间隔送 chunk → WebSocket 收文字并追加
 * @param {HTMLElement} outputEl - 显示转录结果的容器
 * @param {object} opts - { language: "zh", chunkMs: 2000 }
 */
function sttLive(outputEl, opts = {}) {
  const { language = "zh", chunkMs = 2000 } = opts;
  outputEl.textContent = "";

  const ws = new WebSocket(`${WS_BASE}/ai/stt/live`);
  let mediaRecorder = null;
  let stream = null;

  ws.onopen = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunks.length === 0) {
          setTimeout(startChunk, chunkMs);
          return;
        }
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const payload = { audio_base64: reader.result };
          if (language) payload.language = language;
          ws.send(JSON.stringify(payload));
        };
        reader.readAsDataURL(blob);
        setTimeout(startChunk, chunkMs);
      };

      function startChunk() {
        chunks.length = 0;
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), chunkMs);
      }
      startChunk();
    } catch (e) {
      outputEl.textContent = "无法打开麦克风: " + e.message;
    }
  };

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      if (data.error) outputEl.textContent += "\n[错误] " + data.error;
      else if (data.text) outputEl.appendChild(document.createTextNode(data.text));
    } catch (_) {}
  };

  ws.onerror = () => {
    outputEl.textContent += "\n[WebSocket 错误]";
  };

  ws.onclose = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  return () => {
    ws.close();
  };
}

// 暴露到全局
if (typeof window !== "undefined") {
  window.sttStream = sttStream;
  window.sttLive = sttLive;
}
