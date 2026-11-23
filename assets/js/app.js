(() => {
  "use strict";

  const STORAGE_KEY = "psf_faltas_leves_draft_v3";
  const SCHEMA_KEY = "psf_faltas_leves_schema_v4";

  const MEASURE_LABELS = {
    RE: "Reconvención escrita",
    AS: "Apercibimiento simple",
    AA: "Apercibimiento agravado"
  };

  const ARTICLE_41_B = {
    "1": {
      text: "No guardar el comportamiento adecuado al servicio o utilizar vocabulario inadecuado, dentro y fuera de las dependencias policiales o lugares de servicio, siempre que no constituya falta grave.",
      measures: ["RE", "AS"]
    },
    "2": {
      text: "La ostentación de la condición de agente policial sin causa justificada, con o sin exhibición de los distintivos o insignias de identificación.",
      measures: ["AA"]
    },
    "3": {
      text: "Falta de respeto en el trato o proferir insultos entre agentes policiales de igual grado o inferior.",
      measures: ["AA"]
    },
    "4": {
      text: "Falta de respeto o descortesía en el trato hacia personas ajenas a la repartición.",
      measures: ["RE", "AS", "AA"]
    },
    "5": {
      text: "Ordenar a un subalterno la realización de servicios o tareas ajenas a las funciones de policía, siempre que no constituya falta grave.",
      measures: ["AA"]
    },
    "6": {
      text: "Cualquier acto irrespetuoso hacia un superior. El respeto es debido aún cuando el superior vista de particular.",
      measures: ["RE", "AS", "AA"],
      warning: "ATENCIÓN: este supuesto requiere revisión especial porque, según las circunstancias, podría encuadrar como falta grave (referencia de trabajo: art. 43 inc. g)."
    },
    "7": {
      text: "No saludar al superior o no guardar en su presencia la debida compostura.",
      measures: ["RE", "AS", "AA"]
    },
    "8": {
      text: "Presentar recursos, peticiones o reclamos o cualquier escrito en términos irrespetuosos o descorteses.",
      measures: ["RE", "AS", "AA"]
    },
    "9": {
      text: "No dar conocimiento inmediato al superior de cualquier enfermedad o causas justificadas que le impidan presentarse al servicio.",
      measures: ["RE", "AS", "AA"]
    },
    "10": {
      text: "Comunicarse con detenidos sin causa justificada.",
      measures: ["AA"]
    },
    "11": {
      text: "Quejarse del servicio o verter expresiones que puedan infundir en los integrantes de la repartición situaciones que afecten la disciplina.",
      measures: ["AA"]
    }
  };

  const DEFAULT_SCHEMA = {
    version: "4.0",
    title: "Acta por Faltas Leves",
    subtitle: "Policía de la Provincia de Santa Fe",
    sections: [
      {
        id: "acta",
        title: "Identificación del acta",
        description: "Datos básicos del formulario.",
        icon: "bi-file-earmark-text",
        fields: [
          { id: "numero_acta", label: "Original N°", type: "text", required: true, col: 4, placeholder: "Ej.: 024/2026" },
          { id: "lugar_acta", label: "Lugar", type: "text", required: true, col: 4, placeholder: "Ej.: Santa Fe" },
          { id: "fecha_acta", label: "Fecha", type: "date", required: true, col: 2 },
          { id: "hora_acta", label: "Hora", type: "time", required: true, col: 2 }
        ]
      },
      {
        id: "actuante",
        title: "Datos del funcionario actuante",
        description: "Identificación de quien confecciona el acta.",
        icon: "bi-person-badge",
        fields: [
          { id: "actuante_nombre", label: "Apellidos y nombres", type: "text", required: true, col: 8 },
          { id: "actuante_interno", label: "N° interno", type: "text", required: true, col: 4 },
          { id: "actuante_grado", label: "Grado", type: "text", required: true, col: 4 },
          { id: "actuante_cargo", label: "Cargo que ocupa", type: "text", required: true, col: 4 },
          { id: "actuante_dependencia", label: "Dependencia de revista", type: "text", required: true, col: 4 },
          { id: "actuante_domicilio", label: "Domicilio / calle", type: "text", required: false, col: 8 },
          { id: "actuante_localidad", label: "Localidad", type: "text", required: false, col: 4, default: "Santa Fe" }
        ]
      },
      {
        id: "infractor",
        title: "Datos del personal policial infractor",
        description: "Datos personales, funcionales y antecedentes disciplinarios.",
        icon: "bi-person-exclamation",
        fields: [
          { id: "infractor_nombre", label: "Apellidos y nombres", type: "text", required: true, col: 8 },
          { id: "infractor_interno", label: "N° interno", type: "text", required: true, col: 4 },
          { id: "infractor_dni", label: "Documento de identidad N°", type: "text", required: true, col: 4, inputmode: "numeric" },
          { id: "infractor_grado", label: "Grado", type: "text", required: true, col: 4 },
          { id: "infractor_cargo", label: "Cargo que ocupa", type: "text", required: false, col: 4 },
          { id: "infractor_antiguedad", label: "Antigüedad", type: "text", required: false, col: 4, placeholder: "Ej.: 8 años" },
          { id: "antecedentes_estado", label: "Antecedentes disciplinarios", type: "select", required: true, col: 4, options: ["Sin antecedentes", "Registra antecedentes", "A verificar"] },
          { id: "antecedentes_detalle", label: "Detalle de antecedentes", type: "textarea", required: true, col: 8, rows: 3, placeholder: "Consigne los antecedentes relevantes según el registro disponible.", showWhen: { field: "antecedentes_estado", equals: "Registra antecedentes" } },
          { id: "infractor_dependencia", label: "Dependencia de revista", type: "text", required: true, col: 6 },
          { id: "infractor_domicilio_particular", label: "Domicilio particular", type: "text", required: false, col: 6 },
          { id: "infractor_domicilio_dependencia", label: "Domicilio de la dependencia", type: "text", required: false, col: 8 },
          { id: "infractor_localidad", label: "Localidad", type: "text", required: false, col: 4, default: "Santa Fe" }
        ]
      },
      {
        id: "hecho",
        title: "Datos del hecho ocurrido",
        description: "Relato objetivo con circunstancias de tiempo, modo y lugar.",
        icon: "bi-journal-text",
        fields: [
          { id: "hecho_lugar", label: "Lugar (dependencia, intersección de calles, etc.)", type: "text", required: true, col: 8 },
          { id: "hecho_localidad", label: "Localidad", type: "text", required: true, col: 4, default: "Santa Fe" },
          { id: "hecho_fecha", label: "Día", type: "date", required: true, col: 4 },
          { id: "hecho_hora", label: "Hora", type: "time", required: false, col: 4 },
          { id: "hecho_danos", label: "Daños", type: "text", required: false, col: 4, placeholder: "Si corresponde" },
          { id: "hecho_damnificados", label: "Damnificados", type: "text", required: false, col: 12, placeholder: "Si corresponde" },
          { id: "hecho_descripcion", label: "Descripción del hecho ocurrido", type: "textarea", required: true, col: 12, rows: 6, placeholder: "Describa los hechos de manera concreta y cronológica, sin adelantar la calificación jurídica.", help: "Conviene indicar qué ocurrió, cuándo, dónde, quiénes intervinieron y cómo se constató." }
        ]
      },
      {
        id: "tipificacion",
        title: "Tipificación de la falta cometida",
        description: "Carga asistida con el catálogo incorporado al prototipo. La autoridad conserva la decisión final.",
        icon: "bi-diagram-3",
        fields: [
          { id: "tipo_tipificacion", label: "Forma de carga", type: "select", required: true, col: 6, options: ["Art. 41 inc. b", "Otra tipificación / carga manual"] },
          { id: "punto_41b", label: "Art. 41 inc. b - punto", type: "select", required: true, col: 6, options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"], showWhen: { field: "tipo_tipificacion", equals: "Art. 41 inc. b" } },
          { id: "descripcion_falta", label: "Descripción de la falta", type: "textarea", required: true, readonly: true, col: 12, rows: 4, showWhen: { field: "tipo_tipificacion", equals: "Art. 41 inc. b" } },
          { id: "articulo_manual", label: "Artículo/s", type: "text", required: true, col: 4, showWhen: { field: "tipo_tipificacion", equals: "Otra tipificación / carga manual" } },
          { id: "inciso_manual", label: "Inciso/s", type: "text", required: false, col: 4, showWhen: { field: "tipo_tipificacion", equals: "Otra tipificación / carga manual" } },
          { id: "otros_manual", label: "Otros", type: "text", required: false, col: 4, showWhen: { field: "tipo_tipificacion", equals: "Otra tipificación / carga manual" } },
          { id: "descripcion_manual", label: "Descripción / encuadre", type: "textarea", required: true, col: 12, rows: 4, showWhen: { field: "tipo_tipificacion", equals: "Otra tipificación / carga manual" } }
        ]
      },
      {
        id: "descargo",
        title: "Descargo y pruebas",
        description: "Espacios previstos en el formulario para la defensa y los elementos presentados.",
        icon: "bi-chat-left-text",
        fields: [
          { id: "descargo_infractor", label: "Descargo del personal policial infractor", type: "textarea", required: false, col: 12, rows: 5, placeholder: "Transcriba o sintetice el descargo conforme corresponda." },
          { id: "pruebas_presentadas", label: "Pruebas presentadas", type: "textarea", required: false, col: 12, rows: 4, placeholder: "Documentación, testimonios u otros elementos." }
        ]
      },
      {
        id: "resolucion",
        title: "Resolución",
        description: "Fundamentos y medida disciplinaria. Las opciones se ajustan automáticamente cuando se utiliza el art. 41 inc. b.",
        icon: "bi-check2-square",
        fields: [
          { id: "fundamentos", label: "Fundamentos", type: "textarea", required: true, col: 12, rows: 5, placeholder: "Fundamente la decisión vinculando hechos, antecedentes disponibles y encuadre seleccionado." },
          { id: "medida_disciplinaria", label: "Medida disciplinaria", type: "select", required: true, col: 6, options: ["Reconvención escrita", "Apercibimiento simple", "Apercibimiento agravado"] },
          { id: "observacion_resolucion", label: "Observación de la resolución", type: "textarea", required: false, col: 6, rows: 3, placeholder: "Opcional" }
        ]
      },
      {
        id: "notificacion",
        title: "Notificación y comunicación",
        description: "Constancias finales del acta.",
        icon: "bi-pen",
        fields: [
          { id: "fecha_notificacion", label: "Fecha de notificación", type: "date", required: false, col: 4 },
          { id: "hora_notificacion", label: "Hora de notificación", type: "time", required: false, col: 4 },
          { id: "recibe_copia", label: "Recibe copia", type: "select", required: false, col: 4, options: ["Sí", "No", "Pendiente"] },
          { id: "pena_alternativa", label: "Pena alternativa", type: "select", required: false, col: 4, options: ["No", "Sí"] },
          { id: "numero_pena_alternativa", label: "N° acta de pena alternativa", type: "text", required: true, col: 8, showWhen: { field: "pena_alternativa", equals: "Sí" } },
          { id: "observaciones_finales", label: "Observaciones finales", type: "textarea", required: false, col: 12, rows: 3 }
        ]
      }
    ]
  };

  const state = {
    schema: loadStoredSchema() || DEFAULT_SCHEMA,
    data: {},
    saveTimer: null,
    modal: null
  };

  const form = document.getElementById("dynamicForm");
  const progressBar = document.getElementById("progressBar");
  const progressLabel = document.getElementById("progressLabel");
  const saveStatus = document.getElementById("saveStatus");
  const previewContent = document.getElementById("previewContent");
  const bootstrapApi = window.bootstrap;
  const toast = bootstrapApi
    ? bootstrapApi.Toast.getOrCreateInstance(document.getElementById("appToast"), { delay: 2800 })
    : { show: () => window.alert(document.getElementById("toastMessage").textContent) };
  const previewModalEl = document.getElementById("previewModal");

  state.modal = bootstrapApi
    ? bootstrapApi.Modal.getOrCreateInstance(previewModalEl)
    : {
        show: () => {
          previewModalEl.style.display = "block";
          previewModalEl.classList.add("show");
          previewModalEl.setAttribute("aria-modal", "true");
          previewModalEl.removeAttribute("aria-hidden");
        }
      };

  init();

  function init() {
    state.data = loadDraft();
    renderForm();
    bindGlobalEvents();
    applyConditions();
    updateAssistance();
    updateMeasureOptions();
    updateProgress();
  }

  function loadStoredSchema() {
    try {
      const raw = localStorage.getItem(SCHEMA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("No se pudo recuperar la plantilla guardada.", error);
      return null;
    }
  }

  function loadDraft() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      console.warn("No se pudo recuperar el borrador.", error);
      return {};
    }
  }

  function renderForm() {
    form.innerHTML = "";

    state.schema.sections.forEach((section, index) => {
      const card = document.createElement("section");
      card.className = "form-section";
      card.dataset.sectionId = section.id;
      card.innerHTML = `
        <div class="section-header">
          <div class="section-icon"><i class="bi ${escapeHtml(section.icon || "bi-card-text")}"></i></div>
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <span class="section-step">${index + 1}</span>
              <h3 class="section-title">${escapeHtml(section.title)}</h3>
            </div>
            <p class="section-description">${escapeHtml(section.description || "")}</p>
          </div>
        </div>
        <div class="section-body">
          <div class="row g-3" data-fields></div>
        </div>
      `;

      const fieldsContainer = card.querySelector("[data-fields]");
      section.fields.forEach((field) => fieldsContainer.appendChild(createField(field)));

      if (section.id === "tipificacion") {
        const assistant = document.createElement("div");
        assistant.id = "tipificationAssistant";
        assistant.className = "assistant-card mt-3 d-none";
        fieldsContainer.appendChild(assistant);
      }

      if (section.id === "infractor") {
        const antecedentHint = document.createElement("div");
        antecedentHint.id = "antecedentHint";
        antecedentHint.className = "col-12 d-none";
        antecedentHint.innerHTML = `<div class="soft-hint"><i class="bi bi-info-circle"></i><span></span></div>`;
        fieldsContainer.appendChild(antecedentHint);
      }

      form.appendChild(card);
    });
  }

  function createField(field) {
    const wrapper = document.createElement("div");
    wrapper.className = `col-12 col-md-${field.col || 6}`;
    wrapper.dataset.fieldWrapper = field.id;
    if (field.showWhen) {
      wrapper.dataset.showField = field.showWhen.field;
      wrapper.dataset.showEquals = field.showWhen.equals;
    }

    const requiredMark = field.required ? '<span class="required-mark">*</span>' : "";
    const help = field.help ? `<div class="form-text">${escapeHtml(field.help)}</div>` : "";
    const value = state.data[field.id] ?? field.default ?? "";
    let control = "";

    if (field.type === "select") {
      const options = ['<option value="">Seleccione...</option>']
        .concat((field.options || []).map((option) => `<option value="${escapeAttribute(option)}" ${String(value) === String(option) ? "selected" : ""}>${escapeHtml(option)}</option>`))
        .join("");
      control = `<select class="form-select" id="${field.id}" name="${field.id}" ${field.required ? "required" : ""}>${options}</select>`;
    } else if (field.type === "textarea") {
      control = `<textarea class="form-control" id="${field.id}" name="${field.id}" rows="${field.rows || 4}" placeholder="${escapeAttribute(field.placeholder || "")}" ${field.readonly ? "readonly" : ""} ${field.required ? "required" : ""}>${escapeHtml(value)}</textarea>`;
    } else if (field.type === "checkbox") {
      control = `
        <div class="check-card">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="${field.id}" name="${field.id}" ${value === true || value === "true" ? "checked" : ""}>
            <label class="form-check-label fw-semibold" for="${field.id}">${escapeHtml(field.label)}</label>
          </div>
        </div>`;
      wrapper.innerHTML = control;
      return wrapper;
    } else {
      control = `<input class="form-control" type="${field.type || "text"}" id="${field.id}" name="${field.id}" value="${escapeAttribute(value)}" placeholder="${escapeAttribute(field.placeholder || "")}" ${field.readonly ? "readonly" : ""} ${field.inputmode ? `inputmode="${escapeAttribute(field.inputmode)}"` : ""} ${field.required ? "required" : ""}>`;
    }

    wrapper.innerHTML = `
      <label class="form-label" for="${field.id}">${escapeHtml(field.label)}${requiredMark}</label>
      ${control}
      ${help}
      <div class="invalid-feedback">Complete este campo antes de generar el acta.</div>
    `;
    return wrapper;
  }

  function bindGlobalEvents() {
    form.addEventListener("input", handleFormChange);
    form.addEventListener("change", handleFormChange);
    form.addEventListener("submit", handleSubmit);

    document.getElementById("btnPreview").addEventListener("click", showPreview);
    document.getElementById("btnGenerateFromPreview").addEventListener("click", () => {
      syncStateFromForm();
      if (!validateVisibleFields()) {
        state.modal.hide?.();
        focusFirstInvalid();
        showToast("Todavía faltan algunos campos obligatorios.", "error");
        return;
      }
      generatePdf();
    });
    document.getElementById("btnReset").addEventListener("click", resetForm);
    document.getElementById("btnExportDraft").addEventListener("click", exportDraft);
    document.getElementById("btnImportDraft").addEventListener("click", () => document.getElementById("draftFileInput").click());
    document.getElementById("draftFileInput").addEventListener("change", importDraft);
    document.getElementById("btnImportSchema").addEventListener("click", () => document.getElementById("schemaFileInput").click());
    document.getElementById("schemaFileInput").addEventListener("change", importSchema);
  }

  function handleFormChange(event) {
    const field = event.target;
    if (!field.name) return;

    state.data[field.name] = getElementValue(field);
    if (isFilled(state.data[field.name])) field.classList.remove("is-invalid");

    if (field.name === "tipo_tipificacion" && field.value !== "Art. 41 inc. b") {
      state.data.punto_41b = "";
      state.data.descripcion_falta = "";
    }

    if (field.name === "punto_41b") {
      applySelectedRule(field.value);
    }

    applyConditions();
    updateAssistance();
    updateMeasureOptions();
    updateProgress();
    scheduleSave();
  }

  function applySelectedRule(point) {
    const rule = ARTICLE_41_B[point];
    state.data.descripcion_falta = rule?.text || "";
    const description = document.getElementById("descripcion_falta");
    if (description) description.value = state.data.descripcion_falta;
  }

  function updateAssistance() {
    const assistant = document.getElementById("tipificationAssistant");
    if (assistant) {
      const mode = state.data.tipo_tipificacion || getLiveFieldValue("tipo_tipificacion");
      const point = state.data.punto_41b || getLiveFieldValue("punto_41b");
      const rule = ARTICLE_41_B[point];

      if (mode === "Art. 41 inc. b" && rule) {
        const measures = rule.measures.map((code) => `<span class="measure-pill">${code} · ${escapeHtml(MEASURE_LABELS[code])}</span>`).join("");
        assistant.classList.remove("d-none", "assistant-warning");
        if (rule.warning) assistant.classList.add("assistant-warning");
        assistant.innerHTML = `
          <div class="assistant-icon"><i class="bi ${rule.warning ? "bi-exclamation-triangle" : "bi-stars"}"></i></div>
          <div>
            <strong>${rule.warning ? "Revisión especial" : "Asistencia de tipificación"}</strong>
            <p class="mb-2">Medidas cargadas para el punto ${escapeHtml(point)}:</p>
            <div class="d-flex flex-wrap gap-2">${measures}</div>
            ${rule.warning ? `<p class="assistant-warning-text mb-0 mt-2">${escapeHtml(rule.warning)}</p>` : ""}
          </div>`;
      } else if (mode === "Otra tipificación / carga manual") {
        assistant.classList.remove("d-none", "assistant-warning");
        assistant.innerHTML = `
          <div class="assistant-icon"><i class="bi bi-pencil-square"></i></div>
          <div>
            <strong>Carga manual</strong>
            <p class="mb-0">La aplicación no validará automáticamente artículo, inciso ni medida para este caso.</p>
          </div>`;
      } else {
        assistant.classList.add("d-none");
        assistant.innerHTML = "";
      }
    }

    const hint = document.getElementById("antecedentHint");
    if (hint) {
      const status = state.data.antecedentes_estado || getLiveFieldValue("antecedentes_estado");
      const span = hint.querySelector("span");
      if (!status) {
        hint.classList.add("d-none");
      } else {
        hint.classList.remove("d-none");
        if (status === "Registra antecedentes") {
          span.textContent = "Los antecedentes disciplinarios deben solicitarse antes del día de la citación del infractor. Si se registra una falta igual a la actual dentro de los tres meses anteriores, podría configurarse una reincidencia, circunstancia que influye en el tipo de sanción que corresponda aplicar.";
        } else if (status === "A verificar") {
          span.textContent = "Queda marcado como pendiente de verificación antes de cerrar definitivamente el acta.";
        } else {
          span.textContent = "Sin antecedentes disciplinarios informados para esta carga.";
        }
      }
    }
  }

  function updateMeasureOptions() {
    const select = document.getElementById("medida_disciplinaria");
    if (!select) return;

    const mode = state.data.tipo_tipificacion || getLiveFieldValue("tipo_tipificacion");
    const point = state.data.punto_41b || getLiveFieldValue("punto_41b");
    const current = state.data.medida_disciplinaria || select.value || "";

    let options = ["Reconvención escrita", "Apercibimiento simple", "Apercibimiento agravado"];
    if (mode === "Art. 41 inc. b" && ARTICLE_41_B[point]) {
      options = ARTICLE_41_B[point].measures.map((code) => MEASURE_LABELS[code]);
    }

    select.innerHTML = '<option value="">Seleccione...</option>' + options.map((option) => `<option value="${escapeAttribute(option)}">${escapeHtml(option)}</option>`).join("");
    if (options.includes(current)) {
      select.value = current;
    } else {
      select.value = "";
      state.data.medida_disciplinaria = "";
    }
  }

  function scheduleSave() {
    clearTimeout(state.saveTimer);
    saveStatus.textContent = "Guardando cambios...";
    state.saveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      const time = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
      saveStatus.textContent = `Borrador guardado a las ${time}`;
    }, 350);
  }

  function applyConditions() {
    document.querySelectorAll("[data-show-field]").forEach((wrapper) => {
      const controller = document.getElementById(wrapper.dataset.showField);
      const visible = controller && String(getElementValue(controller)) === wrapper.dataset.showEquals;
      wrapper.classList.toggle("field-hidden", !visible);
      wrapper.querySelectorAll("input, select, textarea").forEach((input) => {
        input.disabled = !visible;
        if (!visible) input.classList.remove("is-invalid");
      });
    });
  }

  function updateProgress() {
    const requiredFields = getAllFields().filter((field) => field.required && isFieldVisible(field.id));
    const complete = requiredFields.filter((field) => isFilled(state.data[field.id] ?? getLiveFieldValue(field.id))).length;
    const percent = requiredFields.length ? Math.round((complete / requiredFields.length) * 100) : 0;
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));
    progressLabel.textContent = `${percent}%`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    syncStateFromForm();
    if (!validateVisibleFields()) {
      showToast("Faltan algunos campos obligatorios. Te marco solo los que hay que completar.", "error");
      focusFirstInvalid();
      return;
    }
    generatePdf();
  }

  function validateVisibleFields() {
    let valid = true;
    getAllFields().forEach((field) => {
      const input = document.getElementById(field.id);
      if (!input || input.disabled || !field.required) return;
      const fieldValid = isFilled(getElementValue(input));
      input.classList.toggle("is-invalid", !fieldValid);
      valid = valid && fieldValid;
    });
    return valid;
  }

  function focusFirstInvalid() {
    const firstInvalid = form.querySelector(".is-invalid");
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => firstInvalid?.focus(), 350);
  }

  function syncStateFromForm() {
    getAllFields().forEach((field) => {
      const input = document.getElementById(field.id);
      if (input && !input.disabled) state.data[field.id] = getElementValue(input);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  }

  function showPreview() {
    syncStateFromForm();
    previewContent.innerHTML = buildPreviewHtml();
    state.modal.show();
  }

  function buildPreviewHtml() {
    const summary = getTipificationSummary();
    const logoSrc = document.getElementById("institutionLogo")?.src || "assets/img/escudo-santa-fe.png";
    const sections = state.schema.sections.map((section) => {
      const rows = section.fields
        .filter((field) => isFieldVisible(field.id))
        .map((field) => {
          const value = displayValue(field, state.data[field.id]);
          if (!value && !field.required) return "";
          const full = field.type === "textarea" || (field.col || 6) >= 12;
          return `<div class="preview-row ${full ? "full" : ""}"><b>${escapeHtml(field.label)}:</b><br>${escapeHtml(value || "—").replace(/\n/g, "<br>")}</div>`;
        })
        .join("");
      return `<section class="preview-section"><h4>${escapeHtml(section.title)}</h4><div class="preview-grid">${rows}</div></section>`;
    }).join("");

    return `
      <article class="preview-sheet">
        <header class="preview-head">
          <img class="preview-logo" src="${escapeAttribute(logoSrc)}" alt="Escudo de la Provincia de Santa Fe">
          <div>
            <h3>Provincia de Santa Fe · Ministerio de Seguridad</h3>
            <p>${escapeHtml(state.data.actuante_dependencia || "Dependencia interviniente")}</p>
          </div>
          <div class="preview-model">Original N°<br>${escapeHtml(state.data.numero_acta || "—")}</div>
        </header>
        <h2 class="preview-title">Acta por Faltas Leves</h2>
        ${summary ? `<div class="preview-tipification">${escapeHtml(summary)}</div>` : ""}
        ${sections}
        <section class="preview-section">
          <h4>Notificación</h4>
          <div class="preview-row full">Cumpliendo la Ley N° 12.071, se deja prevista la notificación y el recurso conforme al texto del formulario de referencia. Verificar vigencia y redacción institucional antes de uso real.</div>
        </section>
        <div class="preview-signatures">
          <div class="preview-signature">Firma y aclaración<br>Funcionario actuante</div>
          <div class="preview-signature">Firma y aclaración<br>Personal policial infractor</div>
          <div class="preview-signature">Constancia / testigo<br>si corresponde</div>
        </div>
      </article>`;
  }

  function getTipificationSummary() {
    if (state.data.tipo_tipificacion === "Art. 41 inc. b" && state.data.punto_41b) {
      return `Decreto 461/15 (Ley 12.521) · Art. 41 inc. b · Punto ${state.data.punto_41b}`;
    }
    if (state.data.tipo_tipificacion === "Otra tipificación / carga manual") {
      return `Tipificación manual · Artículo/s ${state.data.articulo_manual || "—"}${state.data.inciso_manual ? ` · Inciso/s ${state.data.inciso_manual}` : ""}`;
    }
    return "";
  }

  function generatePdf() {
    syncStateFromForm();
    if (!window.jspdf?.jsPDF) {
      showToast("No se cargó jsPDF. Se abrirá la impresión del navegador para guardar como PDF.", "error");
      printFallback();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const page = { width: 210, height: 297, left: 16, right: 16, top: 16, bottom: 18 };
    const contentWidth = page.width - page.left - page.right;
    let y = page.top;

    const ensureSpace = (required = 14) => {
      if (y + required > page.height - page.bottom) {
        doc.addPage();
        y = page.top;
        drawContinuationHeader();
      }
    };

    const drawContinuationHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("ACTA POR FALTAS LEVES - CONTINUACIÓN", page.left, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Original N° ${safePdfText(state.data.numero_acta || "S/N")}`, page.width - page.right, y, { align: "right" });
      y += 6;
      doc.setDrawColor(90);
      doc.line(page.left, y, page.width - page.right, y);
      y += 8;
    };

    doc.setDrawColor(35, 62, 78);
    doc.setLineWidth(.35);

    const logoImg = document.getElementById("institutionLogo");
    let logoDrawn = false;
    try {
      if (logoImg && logoImg.complete && logoImg.naturalWidth) {
        doc.addImage(logoImg, "PNG", page.left + 1, y, 22, 22, undefined, "FAST");
        logoDrawn = true;
      }
    } catch (error) {
      console.warn("No se pudo incorporar el escudo al PDF.", error);
    }
    if (!logoDrawn) {
      doc.roundedRect(page.left, y, 20, 20, 3, 3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("SF", page.left + 10, y + 12.5, { align: "center" });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.8);
    doc.setTextColor(25, 45, 58);
    doc.text("PROVINCIA DE SANTA FE", page.width / 2, y + 5, { align: "center" });
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 92, 103);
    doc.text("MINISTERIO DE SEGURIDAD", page.width / 2, y + 10.3, { align: "center" });
    doc.text(safePdfText(state.data.actuante_dependencia || "Dependencia interviniente"), page.width / 2, y + 15.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(45, 63, 74);
    doc.text(`ORIGINAL N° ${safePdfText(state.data.numero_acta || "S/N")}`, page.width - page.right, y + 6, { align: "right" });

    doc.setFillColor(15, 94, 136);
    doc.rect(page.left, y + 24, contentWidth, 1.1, "F");
    doc.setTextColor(0);
    y += 31;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ACTA POR FALTAS LEVES", page.width / 2, y, { align: "center" });
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`${safePdfText(state.data.lugar_acta || "")} · ${formatDateForDisplay(state.data.fecha_acta)} · ${safePdfText(state.data.hora_acta || "")}`, page.width / 2, y, { align: "center" });
    y += 10;

    state.schema.sections.forEach((section) => {
      ensureSpace(18);
      doc.setFillColor(241, 246, 249);
      doc.rect(page.left, y - 4, contentWidth, 8, "F");
      doc.setFillColor(15, 94, 136);
      doc.rect(page.left, y - 4, 1.5, 8, "F");
      doc.setTextColor(35, 55, 68);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.text(safePdfText(section.title.toUpperCase()), page.left + 4, y + 1.5);
      doc.setTextColor(0);
      y += 9;

      section.fields.filter((field) => isFieldVisible(field.id)).forEach((field) => {
        let value = displayValue(field, state.data[field.id]);
        if (!value && !field.required) return;
        value = value || "—";
        const label = `${field.label}:`;
        const isLong = field.type === "textarea" || value.length > 70 || (field.col || 6) >= 12;

        if (isLong) {
          let lines = doc.splitTextToSize(safePdfText(value), contentWidth - 6);
          ensureSpace(12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.2);
          doc.text(safePdfText(label), page.left, y);
          y += 4.6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.8);

          while (lines.length) {
            const availableHeight = page.height - page.bottom - y;
            const maxLines = Math.max(1, Math.floor(availableHeight / 4.1));
            const chunk = lines.splice(0, maxLines);
            doc.text(chunk, page.left + 2, y, { lineHeightFactor: 1.18 });
            y += chunk.length * 4.1 + 3;
            if (lines.length) {
              doc.addPage();
              y = page.top;
              drawContinuationHeader();
            }
          }
        } else {
          ensureSpace(7);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.2);
          doc.text(safePdfText(label), page.left, y);
          const labelWidth = Math.min(doc.getTextWidth(safePdfText(label)) + 2, 62);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.8);
          const valueLines = doc.splitTextToSize(safePdfText(value), contentWidth - labelWidth);
          doc.text(valueLines, page.left + labelWidth, y);
          y += Math.max(5.2, valueLines.length * 4.1);
        }
      });
      y += 3;
    });

    ensureSpace(48);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.1);
    const declaration = "Se deja constancia de la notificación y recepción de copia conforme el formulario de referencia. La redacción legal definitiva debe verificarse antes de uso institucional.";
    const declarationLines = doc.splitTextToSize(declaration, contentWidth);
    doc.text(declarationLines, page.left, y);
    y += declarationLines.length * 4 + 18;

    const signatureWidth = (contentWidth - 14) / 2;
    ["Funcionario actuante", "Personal policial infractor"].forEach((title, index) => {
      const x = page.left + index * (signatureWidth + 14);
      doc.line(x, y, x + signatureWidth, y);
      doc.setFontSize(7.8);
      doc.text(title, x + signatureWidth / 2, y + 5, { align: "center" });
      doc.text("Firma y aclaración", x + signatureWidth / 2, y + 9, { align: "center" });
    });

    addPageNumbers(doc);
    const number = fileSafe(state.data.numero_acta || "sin-numero");
    const person = fileSafe(state.data.infractor_nombre || "personal");
    doc.save(`acta-faltas-leves-${number}-${person}.pdf`);
    showToast("PDF generado correctamente.");
  }

  function printFallback() {
    syncStateFromForm();
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      showToast("El navegador bloqueó la ventana de impresión.", "error");
      return;
    }
    popup.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Acta por Faltas Leves</title><style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #111; font-family: Georgia, "Times New Roman", serif; }
      .preview-sheet { width: 100%; }
      .preview-head { display: grid; grid-template-columns: 70px 1fr 105px; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 2px solid #222; text-align: center; }
      .preview-logo { width: 58px; height: 58px; object-fit: contain; margin: 0 auto; }
      .preview-head h3 { margin: 0; font-size: 14px; text-transform: uppercase; }
      .preview-head p { margin: 4px 0 0; font-size: 11px; }
      .preview-model { font: bold 9px Arial, sans-serif; text-transform: uppercase; }
      .preview-title { margin: 20px 0 16px; text-align: center; font-size: 17px; text-transform: uppercase; }
      .preview-tipification { margin: 0 0 14px; padding: 8px 10px; border: 1px solid #aaa; font: 10px Arial, sans-serif; }
      .preview-section { margin: 17px 0; break-inside: avoid; }
      .preview-section h4 { margin: 0 0 9px; padding-bottom: 4px; border-bottom: 1px solid #555; font-size: 11px; text-transform: uppercase; }
      .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 18px; }
      .preview-row { font-size: 11px; line-height: 1.4; overflow-wrap: anywhere; }
      .preview-row.full { grid-column: 1 / -1; }
      .preview-row b { font-family: Arial, sans-serif; font-size: 9px; text-transform: uppercase; }
      .preview-signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 55px; }
      .preview-signature { padding-top: 7px; border-top: 1px solid #222; text-align: center; font-size: 10px; }
    </style></head><body>${buildPreviewHtml()}</body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  function resetForm() {
    if (!window.confirm("¿Querés limpiar todos los datos del borrador actual?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state.data = {};
    renderForm();
    applyConditions();
    updateAssistance();
    updateMeasureOptions();
    updateProgress();
    saveStatus.textContent = "Borrador eliminado";
    showToast("Formulario limpio.");
  }

  function exportDraft() {
    syncStateFromForm();
    const payload = {
      exportedAt: new Date().toISOString(),
      schemaVersion: state.schema.version,
      data: state.data
    };
    downloadJson(payload, `borrador-acta-faltas-leves-${fileSafe(state.data.numero_acta || "sin-numero")}.json`);
    showToast("Borrador exportado.");
  }

  async function importDraft(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      state.data = parsed.data && typeof parsed.data === "object" ? parsed.data : parsed;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      renderForm();
      applyConditions();
      updateAssistance();
      updateMeasureOptions();
      updateProgress();
      showToast("Borrador importado.");
    } catch (error) {
      console.error(error);
      showToast("No se pudo importar el borrador.", "error");
    }
  }

  async function importSchema(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed?.sections || !Array.isArray(parsed.sections)) throw new Error("Plantilla inválida");
      state.schema = parsed;
      localStorage.setItem(SCHEMA_KEY, JSON.stringify(parsed));
      renderForm();
      applyConditions();
      updateAssistance();
      updateMeasureOptions();
      updateProgress();
      showToast("Plantilla cargada.");
    } catch (error) {
      console.error(error);
      showToast("La plantilla JSON no tiene el formato esperado.", "error");
    }
  }

  function getAllFields() {
    return state.schema.sections.flatMap((section) => section.fields || []);
  }

  function isFieldVisible(fieldId) {
    const wrapper = document.querySelector(`[data-field-wrapper="${cssEscape(fieldId)}"]`);
    return wrapper ? !wrapper.classList.contains("field-hidden") : true;
  }

  function getLiveFieldValue(fieldId) {
    const input = document.getElementById(fieldId);
    return input ? getElementValue(input) : "";
  }

  function getElementValue(input) {
    return input.type === "checkbox" ? input.checked : input.value;
  }

  function isFilled(value) {
    if (typeof value === "boolean") return value;
    return value !== null && value !== undefined && String(value).trim() !== "";
  }

  function displayValue(field, value) {
    if (field.type === "checkbox") return value ? "Sí" : "No";
    if (field.type === "date" && value) return formatDateForDisplay(value);
    return value == null ? "" : String(value);
  }

  function formatDateForDisplay(value) {
    if (!value) return "";
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
  }

  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function showToast(message, type = "success") {
    const messageEl = document.getElementById("toastMessage");
    const icon = document.getElementById("toastIcon");
    messageEl.textContent = message;
    icon.className = type === "error" ? "bi bi-exclamation-circle-fill text-danger" : "bi bi-check-circle-fill text-success";
    toast.show();
  }

  function addPageNumbers(doc) {
    const total = doc.getNumberOfPages();
    for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
      doc.setPage(pageNumber);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100);
      doc.text(`Página ${pageNumber} de ${total}`, 194, 289, { align: "right" });
      doc.setTextColor(0);
    }
  }

  function safePdfText(value) {
    return String(value ?? "").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u00A0/g, " ");
  }

  function fileSafe(value) {
    return String(value || "archivo").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "archivo";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function cssEscape(value) {
    return window.CSS?.escape ? window.CSS.escape(value) : String(value).replace(/([ #;?%&,.+*~':"!^$[\]()=>|/@])/g, "\\$1");
  }
})();
