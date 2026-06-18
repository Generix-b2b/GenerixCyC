import Ajv from "https://cdn.jsdelivr.net/npm/ajv@8/+esm";
import addFormats from "https://cdn.jsdelivr.net/npm/ajv-formats@2/+esm";

const dropzone = document.getElementById("dropzone");
const input = document.getElementById("fileInput");
const result = document.getElementById("result");
const errorList = document.getElementById("errorList");
const viewer = document.getElementById("jsonViewer");

// MISMA ruta que ya usa el HTML para mostrar el esquema de respuesta
const SCHEMA_URL = "E-invoicing/Standard/Response/Json/GNX_Response_Schema_Json.json";

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
  if (!file) return;
  const text = await file.text();
  processJSON(text);
}

async function processJSON(text) {

  let data;

  // 1) ¿El JSON es válido sintácticamente?
  try {
    data = JSON.parse(text);
  } catch {
    result.innerHTML = "❌ JSON inválido (error de sintaxis)";
    errorList.innerHTML = "";
    viewer.innerHTML = "";
    return;
  }

  // 2) Cargar el esquema CON control de errores (antes fallaba en silencio)
  let schema;
  try {
    const res = await fetch(SCHEMA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    schema = await res.json();
  } catch (e) {
    result.innerHTML = "⚠️ No se pudo cargar el esquema de validación";
    errorList.innerHTML = `<div>➡ ${SCHEMA_URL} → ${e.message}</div>`;
    viewer.innerHTML = "";
    return;
  }

  // 3) Compilar el esquema CON control de errores
  let validate;
  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    validate = ajv.compile(schema);
  } catch (e) {
    result.innerHTML = "⚠️ El esquema no se pudo compilar";
    errorList.innerHTML = `<div>➡ ${e.message}</div>`;
    viewer.innerHTML = "";
    return;
  }

  const valid = validate(data);

  const pretty = JSON.stringify(data, null, 2);

  renderViewer(pretty, validate.errors);

  if (valid) {
    result.innerHTML = "✅ JSON válido";
    errorList.innerHTML = "";
  } else {
    result.innerHTML = "❌ JSON inválido";

    errorList.innerHTML = validate.errors.map(e =>
      `<div>➡ ${e.instancePath || "(raíz)"} → ${e.message}</div>`
    ).join("");
  }
}

function renderViewer(text, errors) {

  const lines = text.split("\n");

  const errorLines = (errors || [])
    .map(e => {
      const key = e.instancePath.split("/").pop();
      if (!key) return -1;                      // evita resaltar la línea 1 con errores de raíz
      return lines.findIndex(l => l.includes(`"${key}"`)) + 1;
    })
    .filter(n => n > 0);

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
