/**
 * Aplicación de Calculadora de Capacidad de Cables
 * Identidad visual y técnica: Luz del Sur
 * Lógica con Factor de Agrupamiento y Corriente I aire por terna
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const displayFecha = document.getElementById('displayFecha');
  const inputSed = document.getElementById('inputSed');
  const btnClearSed = document.getElementById('btnClearSed');
  const sedDropdown = document.getElementById('sedDropdown');
  const inputCelda = document.getElementById('inputCelda');
  const inputCantConf = document.getElementById('inputCantConf');
  const configList = document.getElementById('configList');
  const emptyState = document.getElementById('emptyState');
  const materialRadios = document.querySelectorAll('input[name="material"]');

  // Transformador
  const selectTrafoKva = document.getElementById('selectTrafoKva');
  const inputTrafoMaxA = document.getElementById('inputTrafoMaxA');
  const trafoFormulaDetail = document.getElementById('trafoFormulaDetail');
  const lblTrafoFormulaText = document.getElementById('lblTrafoFormulaText');

  // Comparativa Trafo vs Ternas
  const lblCompTrafoVal = document.getElementById('lblCompTrafoVal');
  const lblCompTernasVal = document.getElementById('lblCompTernasVal');
  const compStatusBanner = document.getElementById('compStatusBanner');
  const compStatusIcon = document.getElementById('compStatusIcon');
  const compStatusText = document.getElementById('compStatusText');

  // Resumen de agrupamiento
  const agrupamientoSummaryBox = document.getElementById('agrupamientoSummaryBox');
  const lblTotalTernas = document.getElementById('lblTotalTernas');
  const lblFactorAgrup = document.getElementById('lblFactorAgrup');
  const lblFormulaExplicada = document.getElementById('lblFormulaExplicada');

  // Cargas
  const inputR = document.getElementById('inputR');
  const inputS = document.getElementById('inputS');
  const inputT = document.getElementById('inputT');
  const inputMaxCurrent = document.getElementById('inputMaxCurrent');

  // Resultados
  const fuTopValue = document.getElementById('fuTopValue');
  const fuBottomValue = document.getElementById('fuBottomValue');
  const fuPercentage = document.getElementById('fuPercentage');
  const fuStatusBanner = document.getElementById('fuStatusBanner');
  const fuStatusIcon = document.getElementById('fuStatusIcon');
  const fuStatusText = document.getElementById('fuStatusText');
  const progressBarFill = document.getElementById('progressBarFill');

  // Botones y Modal
  const btnLimpiar = document.getElementById('btnLimpiar');
  const btnCopiarCables = document.getElementById('btnCopiarCables');
  const btnCopiarTrafo = document.getElementById('btnCopiarTrafo');
  const btnLimpiarTrafo = document.getElementById('btnLimpiarTrafo');
  const btnVerTabla = document.getElementById('btnVerTabla');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const modalTabla = document.getElementById('modalTabla');
  const modalTableBody = document.getElementById('modalTableBody');

  // Pestañas de Navegación
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Re-ejecutar cálculo para refrescar los valores sincronizados
      recalculateAll();
    });
  });

  // 1. Inicializar fecha con la fecha del día (No editable)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const fechaHoy = `${dd}/${mm}/${yyyy}`;
  if (displayFecha) {
    displayFecha.textContent = fechaHoy;
  }

  // 2. Llenar tabla del modal con CABLES_DATABASE (Cable, Sección, I aire, Concatenar)
  if (typeof CABLES_DATABASE !== 'undefined' && modalTableBody) {
    modalTableBody.innerHTML = CABLES_DATABASE.map(c => `
      <tr>
        <td><strong>${c.tipo}</strong></td>
        <td>${c.seccion}</td>
        <td><strong>${c.capacidad} A</strong></td>
        <td><code>${c.concatenar}</code></td>
      </tr>
    `).join('');
  }

  // 3. Autocompletado y Filtro Dinámico de SED
  function filterSedList(query) {
    if (typeof SED_LIST === 'undefined' || !sedDropdown) return;
    const cleanQuery = query.trim().toUpperCase();

    if (!cleanQuery) {
      sedDropdown.style.display = 'none';
      sedDropdown.innerHTML = '';
      return;
    }

    // Filtrar todas las SEDs que contienen el texto ingresado
    const matches = SED_LIST.filter(sed => sed.toUpperCase().includes(cleanQuery));

    if (matches.length === 0) {
      sedDropdown.innerHTML = `<div class="autocomplete-empty">No se encontró ninguna SED similar a "<strong>${cleanQuery}</strong>"</div>`;
      sedDropdown.style.display = 'block';
      return;
    }

    // Ordenar: primero las que inician exactamente con el query, luego el resto alfabéticamente
    matches.sort((a, b) => {
      const aStarts = a.startsWith(cleanQuery);
      const bStarts = b.startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });

    const displayMatches = matches.slice(0, 40);
    let html = '';

    displayMatches.forEach(sed => {
      const regex = new RegExp(`(${cleanQuery})`, 'gi');
      const highlighted = sed.replace(regex, '<mark>$1</mark>');
      html += `
        <div class="autocomplete-item" data-sed="${sed}">
          <span class="sed-code-text">${highlighted}</span>
        </div>
      `;
    });

    sedDropdown.innerHTML = html;
    sedDropdown.style.display = 'block';

    // Selección de SED al hacer clic o tap
    sedDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        selectSed(item.dataset.sed);
      });
    });
  }

  function selectSed(sed) {
    inputSed.value = sed;
    sedDropdown.style.display = 'none';
    sedDropdown.innerHTML = '';
    if (btnClearSed) btnClearSed.style.display = 'flex';
  }

  inputSed.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    const val = e.target.value;
    if (btnClearSed) btnClearSed.style.display = val.length > 0 ? 'flex' : 'none';
    filterSedList(val);
  });

  inputSed.addEventListener('focus', () => {
    if (inputSed.value.trim().length > 0) {
      filterSedList(inputSed.value);
    }
  });

  // Botón para limpiar campo SED
  if (btnClearSed) {
    btnClearSed.addEventListener('click', () => {
      inputSed.value = '';
      btnClearSed.style.display = 'none';
      if (sedDropdown) {
        sedDropdown.style.display = 'none';
        sedDropdown.innerHTML = '';
      }
      inputSed.focus();
    });
  }

  // Cerrar lista flotante al hacer clic fuera del campo SED
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sed-autocomplete-wrap')) {
      if (sedDropdown) sedDropdown.style.display = 'none';
    }
  });

  // Celda: Solo números y letras, máx 1 carácter
  inputCelda.addEventListener('input', (e) => {
    let clean = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length > 1) clean = clean.slice(0, 1);
    e.target.value = clean.toUpperCase();
  });

  // Cantidad de Conf: Numérico, máx 1 carácter (1 al 9)
  inputCantConf.addEventListener('input', (e) => {
    let clean = e.target.value.replace(/[^0-9]/g, '');
    if (clean.length > 1) clean = clean.slice(0, 1);
    e.target.value = clean;
    renderConfigurations(parseInt(clean, 10) || 0);
  });

  // Obtener material seleccionado actualmente
  function getSelectedMaterial() {
    const checked = document.querySelector('input[name="material"]:checked');
    return checked ? checked.value : 'Cobre';
  }

  // Obtener tipos de cable permitidos según el material
  function getAllowedCableTypes(material) {
    if (typeof CABLES_BY_MATERIAL !== 'undefined' && CABLES_BY_MATERIAL[material]) {
      return CABLES_BY_MATERIAL[material];
    }
    return CABLE_TYPES;
  }

  // Estado de las configuraciones en memoria
  let configsState = [];

  // Escuchar cambio de material (Cobre / Aluminio) para filtrar dinámicamente
  materialRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedMat = getSelectedMaterial();
      const allowed = getAllowedCableTypes(selectedMat);

      // Adaptar cada configuración existente al nuevo material
      configsState.forEach(conf => {
        if (!allowed.includes(conf.tipo)) {
          conf.tipo = allowed[0];
          const newSections = SECTIONS_BY_TYPE[conf.tipo] || [];
          conf.seccion = newSections[0];
        }
      });

      // Volver a renderizar las configuraciones con el nuevo filtro
      renderConfigurations(configsState.length);
    });
  });

  // 4. Renderizar filas de configuración dinámicamente
  function renderConfigurations(count) {
    configList.innerHTML = '';
    
    if (count <= 0) {
      emptyState.style.display = 'block';
      if (agrupamientoSummaryBox) agrupamientoSummaryBox.style.display = 'none';
      configsState = [];
      recalculateAll();
      return;
    }

    emptyState.style.display = 'none';
    if (agrupamientoSummaryBox) agrupamientoSummaryBox.style.display = 'flex';

    const currentMaterial = getSelectedMaterial();
    const allowedTypes = getAllowedCableTypes(currentMaterial);
    const defaultTipo = allowedTypes[0];
    const defaultSeccion = (SECTIONS_BY_TYPE[defaultTipo] || [])[0];

    // Ajustar tamaño del array preservando datos existentes compatibles
    const newConfigs = [];
    for (let i = 0; i < count; i++) {
      if (configsState[i]) {
        if (!allowedTypes.includes(configsState[i].tipo)) {
          configsState[i].tipo = defaultTipo;
          configsState[i].seccion = defaultSeccion;
        }
        newConfigs.push(configsState[i]);
      } else {
        newConfigs.push({
          tipo: defaultTipo,
          seccion: defaultSeccion,
          ternas: 1
        });
      }
    }
    configsState = newConfigs;

    // Crear elementos DOM
    configsState.forEach((conf, index) => {
      const configIndex = index + 1;
      const card = document.createElement('div');
      card.className = 'config-item';
      card.dataset.index = index;

      if (!allowedTypes.includes(conf.tipo)) {
        conf.tipo = allowedTypes[0];
      }

      const sections = SECTIONS_BY_TYPE[conf.tipo] || [];
      if (!sections.includes(Number(conf.seccion))) {
        conf.seccion = sections[0];
      }

      const cableInfo = findCable(conf.tipo, conf.seccion);
      const capBase = (cableInfo ? cableInfo.capacidad : 0) * (Number(conf.ternas) || 0);
      const concatenado = `${conf.tipo}${conf.seccion}`;

      card.innerHTML = `
        <div class="config-title-bar">
          <span class="config-tag">Conf. ${configIndex}</span>
          <span class="config-subtext">Material: <strong>${currentMaterial}</strong></span>
        </div>

        <div class="config-row-flex">
          <div class="config-input-group">
            <label>Tipo Cable</label>
            <select class="form-control conf-tipo">
              ${allowedTypes.map(t => `<option value="${t}" ${t === conf.tipo ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>

          <div class="config-input-group">
            <label>Secc. (mm²)</label>
            <select class="form-control conf-seccion">
              ${sections.map(s => `<option value="${s}" ${s === Number(conf.seccion) ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>

          <div class="operator">=</div>

          <div class="config-input-group">
            <label>Concatenar</label>
            <input type="text" class="form-control disabled conf-concat" value="${concatenado}" readonly />
          </div>

          <div class="operator">×</div>

          <div class="config-input-group small">
            <label>Ternas</label>
            <input type="number" class="form-control conf-ternas" min="1" max="99" value="${conf.ternas}" inputmode="numeric" />
          </div>

          <div class="operator">=</div>

          <div class="config-input-group">
            <label>I aire × Ternas</label>
            <input type="text" class="form-control disabled conf-capacidad" value="${capBase} A" readonly />
          </div>
        </div>
      `;

      // Eventos de interacción en la fila
      const selectTipo = card.querySelector('.conf-tipo');
      const selectSecc = card.querySelector('.conf-seccion');
      const inputConcat = card.querySelector('.conf-concat');
      const inputTernas = card.querySelector('.conf-ternas');
      const inputCapacidad = card.querySelector('.conf-capacidad');

      selectTipo.addEventListener('change', (e) => {
        const newTipo = e.target.value;
        conf.tipo = newTipo;
        
        const newSections = SECTIONS_BY_TYPE[newTipo] || [];
        conf.seccion = newSections[0];

        selectSecc.innerHTML = newSections.map(s => `<option value="${s}">${s}</option>`).join('');
        updateRow();
      });

      selectSecc.addEventListener('change', (e) => {
        conf.seccion = Number(e.target.value);
        updateRow();
      });

      inputTernas.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        conf.ternas = val;
        updateRow();
      });

      function updateRow() {
        const cInfo = findCable(conf.tipo, conf.seccion);
        const cUnit = cInfo ? cInfo.capacidad : 0;
        const cTot = cUnit * conf.ternas;
        inputConcat.value = `${conf.tipo}${conf.seccion}`;
        inputCapacidad.value = `${cTot} A`;
        recalculateAll();
      }

      configList.appendChild(card);
    });

    recalculateAll();
  }

  // 5. Cargas R, S, T y Corriente Máxima
  [inputR, inputS, inputT].forEach(input => {
    input.addEventListener('input', () => {
      recalculateAll();
    });
  });

  // 6. Función de cálculo global de F.U., Agrupamiento y Corrientes
  function recalculateAll() {
    const valR = parseFloat(inputR.value) || 0;
    const valS = parseFloat(inputS.value) || 0;
    const valT = parseFloat(inputT.value) || 0;

    // Corriente Máxima
    const maxCurrent = Math.max(valR, valS, valT);
    inputMaxCurrent.value = maxCurrent > 0 ? `${maxCurrent.toFixed(2)} A` : '0.00 A';

    // 1. Sumar ternas y calcular suma de capacidad base
    let totalTernas = 0;
    let sumaCapacidadesBase = 0;
    let detalleCalculo = [];

    configsState.forEach((conf, idx) => {
      const cInfo = findCable(conf.tipo, conf.seccion);
      const ternas = Number(conf.ternas) || 0;
      totalTernas += ternas;

      if (cInfo) {
        const capConf = cInfo.capacidad * ternas;
        sumaCapacidadesBase += capConf;
        detalleCalculo.push(`${cInfo.capacidad} × ${ternas} = ${capConf}`);
      }
    });

    // 2. Determinar Factor de Agrupamiento según totalTernas
    const factorAgrup = getFactorAgrupamiento(totalTernas);

    // 3. Capacidad Total Final con Factor de Agrupamiento
    // Capacidad Total = (Suma de capacidades base) × Factor de Agrupamiento
    const capacidadTotalFinal = sumaCapacidadesBase * factorAgrup;

    // Actualizar caja de resumen visual de agrupamiento
    if (lblTotalTernas) lblTotalTernas.textContent = totalTernas;
    if (lblFactorAgrup) lblFactorAgrup.textContent = factorAgrup.toFixed(2);
    if (lblFormulaExplicada) {
      if (configsState.length > 0 && sumaCapacidadesBase > 0) {
        if (configsState.length === 1) {
          lblFormulaExplicada.textContent = `(${sumaCapacidadesBase} A) × ${factorAgrup} = ${capacidadTotalFinal.toFixed(2)} A`;
        } else {
          lblFormulaExplicada.textContent = `(${sumaCapacidadesBase} A) × ${factorAgrup} [${totalTernas} ternas] = ${capacidadTotalFinal.toFixed(2)} A`;
        }
      } else {
        lblFormulaExplicada.textContent = `(Cap. Base) × F.A. = Capacidad Total`;
      }
    }

    // Actualizar fórmula visible en la card de F.U.
    fuTopValue.textContent = `${maxCurrent.toFixed(2)} A`;
    fuBottomValue.textContent = `${capacidadTotalFinal.toFixed(2)} A`;

    // Cálculo del Factor de Utilización (FU %)
    if (capacidadTotalFinal > 0 && maxCurrent > 0) {
      const fuValue = (maxCurrent / capacidadTotalFinal) * 100;
      fuPercentage.textContent = `${fuValue.toFixed(2)}%`;

      // Barra de progreso visual
      const visualProgress = Math.min(Math.max(fuValue, 0), 100);
      progressBarFill.style.width = `${visualProgress}%`;

      // Reglas de semáforo actualizadas:
      // - Menor de 90%: Verde
      // - De 90% a 100%: Amarillo
      // - Mayor a 100%: Rojo con mensaje "Capacidad superada." y enlace a Fono Luz 01 2892301
      fuStatusBanner.className = 'status-banner';
      if (fuValue > 100) {
        fuStatusBanner.classList.add('danger');
        progressBarFill.style.backgroundColor = 'var(--color-danger)';
        fuStatusIcon.textContent = '⚠️';
        fuStatusText.innerHTML = `
          <div class="alert-overload-content">
            <div><strong>Capacidad superada (${fuValue.toFixed(1)}%)</strong></div>
            <div class="fonoluz-call-wrap">
              <span>Llamar Fono Luz:</span>
              <a href="tel:012892301" class="btn-fonoluz" id="btnLlamarFonoLuz">
                📞 01 2892301
              </a>
            </div>
          </div>
        `;
      } else if (fuValue >= 90) {
        fuStatusBanner.classList.add('warning');
        progressBarFill.style.backgroundColor = 'var(--color-warning)';
        fuStatusIcon.textContent = '⚡';
        fuStatusText.innerHTML = `<strong>ALERTA (${fuValue.toFixed(1)}%)</strong>: Carga elevada próxima al límite (90% - 100%).`;
      } else {
        fuStatusBanner.classList.add('normal');
        progressBarFill.style.backgroundColor = 'var(--color-success)';
        fuStatusIcon.textContent = '✅';
        fuStatusText.innerHTML = `<strong>NORMAL (${fuValue.toFixed(1)}%)</strong>: Capacidad admisible óptima (&lt; 90%).`;
      }
    } else {
      fuPercentage.textContent = '0.00%';
      progressBarFill.style.width = '0%';
      fuStatusBanner.className = 'status-banner normal';
      progressBarFill.style.backgroundColor = 'var(--color-success)';
      fuStatusIcon.textContent = 'ℹ️';
      fuStatusText.textContent = 'Ingrese configuraciones y cargas R, S, T para calcular.';
    }

    // 4. Comparativa Transformador vs. Ternas
    actualizarComparativaTrafoVsTernas(capacidadTotalFinal);
  }

  // Función específica para actualizar la comparativa de Trafo vs Ternas
  function actualizarComparativaTrafoVsTernas(capacidadTernas) {
    if (!selectTrafoKva || !inputTrafoMaxA) return;

    const trafoKva = parseFloat(selectTrafoKva.value) || 0;
    const trafoMaxA = getCapacidadMaxTrafo(trafoKva);

    if (trafoKva > 0) {
      inputTrafoMaxA.value = `${trafoMaxA.toFixed(2)} A`;
      if (trafoFormulaDetail) trafoFormulaDetail.style.display = 'block';
      if (lblTrafoFormulaText) {
        const iNominal = (trafoKva * FACTOR_I_NOMINAL_TRAFO).toFixed(2);
        lblTrafoFormulaText.innerHTML = `${trafoKva} kVA × 2.51 = <strong>${iNominal} A</strong> × 1.2 (120%) = <strong>${trafoMaxA.toFixed(2)} A</strong>`;
      }
    } else {
      inputTrafoMaxA.value = '0.00 A';
      if (trafoFormulaDetail) trafoFormulaDetail.style.display = 'none';
    }

    // Actualizar recuadro comparativo
    if (lblCompTrafoVal) lblCompTrafoVal.textContent = `${trafoMaxA.toFixed(2)} A`;
    if (lblCompTernasVal) lblCompTernasVal.textContent = `${capacidadTernas.toFixed(2)} A`;

    if (compStatusBanner && compStatusIcon && compStatusText) {
      compStatusBanner.className = 'status-banner';

      if (trafoKva <= 0 && capacidadTernas <= 0) {
        compStatusBanner.classList.add('normal');
        compStatusIcon.textContent = 'ℹ️';
        compStatusText.textContent = 'Seleccione capacidad del transformador y configure ternas para comparar.';
      } else if (trafoKva <= 0) {
        compStatusBanner.classList.add('normal');
        compStatusIcon.textContent = 'ℹ️';
        compStatusText.textContent = 'Seleccione una potencia de transformador para realizar la comparativa.';
      } else if (capacidadTernas <= 0) {
        compStatusBanner.classList.add('normal');
        compStatusIcon.textContent = 'ℹ️';
        compStatusText.textContent = 'Configure al menos una terna de cable para realizar la comparativa.';
      } else {
        // Evaluación directa de semáforo solicitada:
        // Si el transformador supera la capacidad de las ternas -> ROJO
        // Si la capacidad de las ternas es mayor o igual al trafo -> VERDE
        const dif = trafoMaxA - capacidadTernas;

        if (trafoMaxA > capacidadTernas) {
          compStatusBanner.classList.add('danger');
          compStatusIcon.textContent = '⚠️';
          compStatusText.innerHTML = `
            <strong>Capacidad de ternas insuficiente:</strong> El transformador al 120% (<strong>${trafoMaxA.toFixed(2)} A</strong>) 
            supera la capacidad de las ternas (<strong>${capacidadTernas.toFixed(2)} A</strong>) por <strong>${dif.toFixed(2)} A</strong>.
          `;
        } else {
          compStatusBanner.classList.add('normal');
          compStatusIcon.textContent = '✅';
          const holgura = capacidadTernas - trafoMaxA;
          compStatusText.innerHTML = `
            <strong>Capacidad adecuada:</strong> La capacidad de las ternas (<strong>${capacidadTernas.toFixed(2)} A</strong>) 
            soporta holgadamente la capacidad máxima del transformador (<strong>${trafoMaxA.toFixed(2)} A</strong>) con <strong>${holgura.toFixed(2)} A</strong> de margen.
          `;
        }
      }
    }
  }

  // Evento al cambiar la capacidad del transformador
  if (selectTrafoKva) {
    selectTrafoKva.addEventListener('change', () => {
      recalculateAll();
    });
  }

  // 7. Botón Limpiar (Pestaña 1 Cables)
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      if (confirm('¿Desea reiniciar todos los campos de la calculadora de cables?')) {
        inputSed.value = '';
        if (btnClearSed) btnClearSed.style.display = 'none';
        if (sedDropdown) {
          sedDropdown.style.display = 'none';
          sedDropdown.innerHTML = '';
        }
        inputCelda.value = '';
        inputCantConf.value = '';
        inputR.value = '';
        inputS.value = '';
        inputT.value = '';
        renderConfigurations(0);
      }
    });
  }

  // Botón Limpiar Trafo (Pestaña 2)
  if (btnLimpiarTrafo) {
    btnLimpiarTrafo.addEventListener('click', () => {
      if (confirm('¿Desea reiniciar la selección del transformador?')) {
        if (selectTrafoKva) selectTrafoKva.value = '';
        if (inputTrafoMaxA) inputTrafoMaxA.value = '0.00 A';
        if (trafoFormulaDetail) trafoFormulaDetail.style.display = 'none';
        recalculateAll();
      }
    });
  }

  // 8. Botón Copiar Reporte: Pestaña 1 (F.U. de Cables)
  if (btnCopiarCables) {
    btnCopiarCables.addEventListener('click', () => {
      const sed = inputSed.value.trim() || 'No especificado';
      const celda = inputCelda.value.trim() || '-';
      const material = getSelectedMaterial();
      const fecha = displayFecha ? displayFecha.textContent : fechaHoy;
      const r = parseFloat(inputR.value) || 0;
      const s = parseFloat(inputS.value) || 0;
      const t = parseFloat(inputT.value) || 0;
      const iMax = Math.max(r, s, t);

      // Determinar fase con mayor carga
      let fasesMax = [];
      if (iMax > 0) {
        if (r === iMax) fasesMax.push('FASE R');
        if (s === iMax) fasesMax.push('FASE S');
        if (t === iMax) fasesMax.push('FASE T');
      }
      const faseTxt = fasesMax.length > 0 ? ` (${fasesMax.join(' / ')})` : '';

      let totalTernas = 0;
      let sumaBase = 0;
      let confsText = '';

      configsState.forEach((c, idx) => {
        const cInfo = findCable(c.tipo, c.seccion);
        const ternas = Number(c.ternas) || 0;
        totalTernas += ternas;
        const capBase = cInfo ? cInfo.capacidad * ternas : 0;
        sumaBase += capBase;
        confsText += `  • Conf. ${idx + 1}: ${c.tipo}${c.seccion} (${cInfo ? cInfo.capacidad : 0} A) × ${ternas} terna(s) = ${capBase} A\n`;
      });

      const fAgrup = getFactorAgrupamiento(totalTernas);
      const capFinal = sumaBase * fAgrup;
      const fu = fuPercentage.textContent;

      const report = 
`⚡ REPORTE DE CAPACIDAD DE CABLES - LUZ DEL SUR ⚡
------------------------------------------------
Fecha: ${fecha}
SED: ${sed} | Celda: ${celda}
Material Seleccionado: ${material}
Cantidad de Configuraciones: ${configsState.length}
${confsText || '  (Sin configuraciones)\n'}
CAPACIDAD DE CARGA DE LOS CABLES:
  • Capacidad Total: (${sumaBase} A) × ${fAgrup} = ${capFinal.toFixed(2)} A

CARGAS DE FASE:
  • Corriente Máxima: ${iMax.toFixed(2)} A${faseTxt}

RESULTADO F.U. CABLE:
  • F.U. = ${fu} (${fuTopValue.textContent} / ${fuBottomValue.textContent})
`;

      navigator.clipboard.writeText(report).then(() => {
        alert('¡Reporte de Cables copiado al portapapeles con éxito!');
      }).catch(() => {
        alert('No se pudo copiar automáticamente. Por favor toma una captura de pantalla.');
      });
    });
  }

  // 8.1 Botón Copiar Reporte: Pestaña 2 (Comparativa Trafo vs. Ternas)
  if (btnCopiarTrafo) {
    btnCopiarTrafo.addEventListener('click', () => {
      const sed = inputSed.value.trim() || 'No especificado';
      const celda = inputCelda.value.trim() || '-';
      const fecha = displayFecha ? displayFecha.textContent : fechaHoy;
      const trafoKva = selectTrafoKva ? selectTrafoKva.value : '';
      const trafoMaxA = getCapacidadMaxTrafo(trafoKva);

      let totalTernas = 0;
      let sumaBase = 0;

      configsState.forEach(c => {
        const cInfo = findCable(c.tipo, c.seccion);
        const ternas = Number(c.ternas) || 0;
        totalTernas += ternas;
        const capBase = cInfo ? cInfo.capacidad * ternas : 0;
        sumaBase += capBase;
      });

      const fAgrup = getFactorAgrupamiento(totalTernas);
      const capFinal = sumaBase * fAgrup;

      const dif = Math.abs(trafoMaxA - capFinal);
      const resultadoDiagnostico = trafoMaxA > capFinal
        ? `⚠️ El transformador supera la capacidad de las ternas por ${dif.toFixed(2)} A.`
        : `✅ Capacidad de ternas adecuada para el transformador con ${dif.toFixed(2)} A de margen.`;

      const report = 
`⚡ REPORTE COMPARATIVA TRAFO VS. TERNAS - LUZ DEL SUR ⚡
------------------------------------------------
Fecha: ${fecha}
SED: ${sed} | Celda: ${celda}

DATOS DEL TRANSFORMADOR:
  • Potencia: ${trafoKva ? trafoKva + ' kVA' : 'No seleccionada'}
  • Capacidad Máxima (120%): ${trafoMaxA.toFixed(2)} A (${trafoKva} × 2.51 × 1.2)

CAPACIDAD DE TERNAS:
  • Total de Ternas: ${totalTernas}
  • Factor de Agrupamiento: ${fAgrup}
  • Capacidad de Ternas: ${capFinal.toFixed(2)} A

RESULTADO COMPARATIVA:
  • Trafo vs. Ternas: ${trafoMaxA.toFixed(2)} A  VS  ${capFinal.toFixed(2)} A
  • Estado: ${resultadoDiagnostico}
`;

      navigator.clipboard.writeText(report).then(() => {
        alert('¡Reporte de Comparativa Trafo vs. Ternas copiado al portapapeles!');
      }).catch(() => {
        alert('No se pudo copiar automáticamente. Por favor toma una captura de pantalla.');
      });
    });
  }

  // 9. Modal de Tabla de Referencia
  btnVerTabla.addEventListener('click', () => {
    modalTabla.classList.add('active');
  });

  btnCerrarModal.addEventListener('click', () => {
    modalTabla.classList.remove('active');
  });

  modalTabla.addEventListener('click', (e) => {
    if (e.target === modalTabla) {
      modalTabla.classList.remove('active');
    }
  });

  // 10. Interacción de llamada directa y copiado a Fono Luz
  document.addEventListener('click', (e) => {
    const btnFono = e.target.closest('#btnLlamarFonoLuz, .btn-fonoluz');
    if (btnFono) {
      e.preventDefault();
      const numeroTelefono = '012892301';
      const numeroFormateado = '01 2892301';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numeroTelefono).catch(() => {});
      }

      const confirmar = confirm(`¿Desea llamar a Fono Luz al ${numeroFormateado}?\n\nEl número fue copiado y se abrirá el teléfono listo para marcar.`);
      if (confirmar) {
        window.location.href = `tel:${numeroTelefono}`;
      }
    }
  });

  // Inicialización con 1 configuración por defecto para prueba amigable
  inputCantConf.value = '1';
  renderConfigurations(1);
});
