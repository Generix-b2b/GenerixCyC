import Ajv from "https://cdn.jsdelivr.net/npm/ajv@8/+esm";
import addFormats from "https://cdn.jsdelivr.net/npm/ajv-formats@2/+esm";

const dropzone = document.getElementById("dropzone");
const input = document.getElementById("fileInput");
const result = document.getElementById("result");
const errorList = document.getElementById("errorList");
const viewer = document.getElementById("jsonViewer");

const SCHEMA_URL = "E-invoicing/Standard/Invoice/Json/GNX_Invoice_Schema_Json.json";

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

  try {
    data = JSON.parse(text);
  } catch {
    result.innerHTML = "❌ JSON inválido (error de sintaxis)";
    errorList.innerHTML = "";
    viewer.textContent = "";
    return;
  }

  let schema;

  try {
    const res = await fetch(SCHEMA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    schema = await res.json();
  } catch (e) {
    result.innerHTML = "⚠️ No se pudo cargar el esquema de validación";
    errorList.innerHTML = `➡ ${SCHEMA_URL} → ${e.message}`;
    viewer.textContent = "";
    return;
  }

  let validate;

  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    validate = ajv.compile(schema);
  } catch (e) {
    result.innerHTML = "⚠️ El esquema no se pudo compilar";
    errorList.innerHTML = `➡ ${e.message}`;
    viewer.textContent = "";
    return;
  }

  const valid = validate(data);
  const pretty = JSON.stringify(data, null, 2);

  viewer.textContent = pretty;

  if (valid) {
    result.innerHTML = "✅ JSON válido";
    errorList.innerHTML = "";
  } else {
    result.innerHTML = "❌ JSON inválido";
    errorList.innerHTML = validate.errors.map(e =>
      `➡ ${e.instancePath || "(raíz)"} → ${e.message}`
    ).join("\n");
  }
}