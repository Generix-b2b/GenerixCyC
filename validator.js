import Ajv from "https://cdn.jsdelivr.net/npm/ajv@8/+esm";
import addFormats from "https://cdn.jsdelivr.net/npm/ajv-formats@2/+esm";

const dropzone = document.getElementById("dropzone");
const input = document.getElementById("fileInput");
const result = document.getElementById("result");
const errorList = document.getElementById("errorList");
const viewer = document.getElementById("jsonViewer");

const SCHEMA_URL = "/Standard/Invoice/Json/GNX_Schema_Json.json";

dropzone.onclick = () => input.click();

dropzone.ondragover = e => {
  e.preventDefault();
  dropzone.classList.add("dragover");
};

dropzone.ondrop = e => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
};

input.onchange = () => handleFile(input.files[0]);

async function handleFile(file) {
  const text = await file.text();
  processJSON(text);
}

async function processJSON(text) {

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    result.innerHTML = "❌ JSON inválido";
    return;
  }

  const schema = await fetch(SCHEMA_URL).then(r => r.json());

  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(data);

  const pretty = JSON.stringify(data, null, 2);

  renderViewer(pretty, validate.errors);

  if (valid) {
    result.innerHTML = "✅ JSON válido";
    errorList.innerHTML = "";
  } else {
    result.innerHTML = "❌ JSON inválido";

    errorList.innerHTML = validate.errors.map(e =>
      `<div>➡ ${e.instancePath} → ${e.message}</div>`
    ).join("");
  }
}

function renderViewer(text, errors) {

  const lines = text.split("\n");

  const errorLines = (errors || []).map(e => {
    const key = e.instancePath.split("/").pop();
    return lines.findIndex(l => l.includes(key)) + 1;
  });

  viewer.innerHTML = lines.map((l, i) => {
    const isError = errorLines.includes(i + 1);
    return `
      <div class="json-line ${isError ? "error" : ""}">
        <div class="json-line-number">${i + 1}</div>
        <div>${escapeHtml(l)}</div>
      </div>
    `;
  }).join("");
}

function escapeHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* BOTÓN DESCARGA */
window.downloadExample = function () {
  const example = {
    invoiceId: "123",
    date: "2025-01-01"
  };

  const blob = new Blob([JSON.stringify(example, null, 2)], { type: "application/json" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "example.json";
  a.click();
};
``