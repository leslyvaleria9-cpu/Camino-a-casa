// js/main.js

// -----------------------------
// Validadores
// -----------------------------
function validateRUT(rut) {
  // Limpiar puntos y guiones, y pasar a mayúscula
  let cleaned = rut.replace(/[\.\-]/g, '').toUpperCase();
  if (cleaned.length < 2) return false;

  const digv = cleaned.slice(-1);
  const rutNum = cleaned.slice(0, -1);

  return calculateRutDigit(rutNum) === digv;
}

function calculateRutDigit(T) {
  let M = 0, S = 1;
  for (T = parseInt(T, 10); T; T = Math.floor(T / 10)) {
    S = (S + T % 10 * (9 - M++ % 6)) % 11;
  }
  return S ? String(S - 1) : 'K';
}

function formatRUT(rut) {
  let cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleaned.length < 2) return cleaned;

  const dv = cleaned.slice(-1);
  let rutNum = cleaned.slice(0, -1);

  // Format with dots
  let formatted = '';
  while (rutNum.length > 3) {
    formatted = '.' + rutNum.slice(-3) + formatted;
    rutNum = rutNum.slice(0, -3);
  }
  formatted = rutNum + formatted + '-' + dv;

  return formatted;
}

function validatePhone(phone) {
  // Valida que el número (sin prefijo) tenga dígitos y espacios, y longitud entre 7 y 15
  const phoneRegex = /^[\d\s]{7,15}$/;
  return phoneRegex.test(phone.trim());
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}

// -----------------------------
// Lógica Principal de la UI
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a vistas
  const viewDashboard = document.getElementById("view-dashboard");
  const viewRegister = document.getElementById("view-register");
  const viewVerify = document.getElementById("view-verify");
  const viewProfile = document.getElementById("view-profile");
  const viewDetails = document.getElementById("view-details");
  const viewPets = document.getElementById("view-pets");
  const viewAdmin = document.getElementById("view-admin");
  const viewAdminDetail = document.getElementById("view-admin-detail");

  let tempPersonalData = {};

  // -----------------------------
  // 1. Validación en tiempo real
  // -----------------------------
  const inputs = document.querySelectorAll("#form-register input, #form-register select");
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      if (!validateRequired(input.value)) {
        showError(input.id, "Este campo es obligatorio");
      } else {
        clearError(input.id);
        if (input.id === "reg-rut" && !validateRUT(input.value)) showError("reg-rut", "RUT inválido");
        if (input.id === "reg-email" && !validateEmail(input.value)) showError("reg-email", "Correo inválido");
        if (input.id === "reg-phone" && !validatePhone(input.value)) showError("reg-phone", "Número inválido (mínimo 7 dígitos)");
      }
    });

    input.addEventListener("input", () => {
      clearError(input.id);
    });
  });

  // Evento especial para dar formato al RUT
  const rutInput = document.getElementById("reg-rut");
  if (rutInput) {
    rutInput.addEventListener("blur", () => {
      if (rutInput.value && validateRUT(rutInput.value)) {
        rutInput.value = formatRUT(rutInput.value);
      }
    });
  }

  // -----------------------------
  // 2. Registro → Verificación
  // -----------------------------
  const formRegister = document.getElementById("form-register");
  const verifyPhoneDisplay = document.getElementById("verify-phone-display");
  const simulatedCodeVal = document.getElementById("simulated-code-val");

  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();

    const rut = document.getElementById("reg-rut").value;
    const email = document.getElementById("reg-email").value;
    const countryCode = document.getElementById("reg-country-code").value;
    const rawPhone = document.getElementById("reg-phone").value;
    const phone = `${countryCode} ${rawPhone}`;
    const name = document.getElementById("reg-name").value;
    const region = document.getElementById("reg-region").value.trim();
    const commune = document.getElementById("reg-commune").value.trim();
    const address = document.getElementById("reg-address").value.trim();
    const housing = document.getElementById("reg-housing").value;

    let valid = true;

    if (!validateRequired(name)) { showError("reg-name", "El nombre es obligatorio"); valid = false; }
    if (!validateRUT(rut)) { showError("reg-rut", "RUT inválido"); valid = false; } else { document.getElementById("reg-rut").value = formatRUT(rut); }
    if (!validateEmail(email)) { showError("reg-email", "Correo inválido"); valid = false; }
    if (!validatePhone(rawPhone)) { showError("reg-phone", "Número inválido"); valid = false; }
    if (!validateRequired(region)) { showError("reg-region", "La región es obligatoria"); valid = false; }
    if (!validateRequired(commune)) { showError("reg-commune", "La comuna es obligatoria"); valid = false; }
    if (!validateRequired(address)) { showError("reg-address", "La dirección es obligatoria"); valid = false; }
    if (!validateRequired(housing)) { showError("reg-housing", "Selecciona un tipo de vivienda"); valid = false; }

    if (valid) {
      tempPersonalData = { name, rut, email, phone, region, commune, address, housing };

      viewRegister.classList.remove("active");
      viewRegister.classList.add("hidden");
      viewVerify.classList.remove("hidden");
      viewVerify.classList.add("active");
      verifyPhoneDisplay.textContent = phone;
      // Generar código simulado aleatorio
      simulatedCodeVal.textContent = Math.floor(1000 + Math.random() * 9000).toString();
    }
  });

  // -----------------------------
  // 3. Verificación → Perfil
  // -----------------------------
  const formVerify = document.getElementById("form-verify");
  formVerify.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("ver-code").value;
    if (code === simulatedCodeVal.textContent) {
      viewVerify.classList.remove("active");
      viewVerify.classList.add("hidden");
      viewProfile.classList.remove("hidden");
      viewProfile.classList.add("active");
    } else {
      showError("ver-code", "Código incorrecto");
    }
  });

  // -----------------------------
  // 4. Guardar perfil y calificación
  // -----------------------------
  const formProfile = document.getElementById("form-profile");
  formProfile.addEventListener("submit", (e) => {
    e.preventDefault();
    const profileData = {
      ...tempPersonalData,
      experience: document.getElementById("prof-experience").value,
      adoptions: parseInt(document.getElementById("prof-adoptions").value, 10),
      time: parseInt(document.getElementById("prof-time").value, 10),
      motivation: document.getElementById("prof-motivation").value,
      evidences: document.getElementById("prof-evidence").files.length
    };
    saveProfile(profileData);
    updateProfileStatus(profileData);
    alert("Perfil guardado con éxito \u2705");
    viewProfile.classList.remove("active");
    viewProfile.classList.add("hidden");
    viewDashboard.classList.remove("hidden");
    viewDashboard.classList.add("active");
  });

  // -----------------------------
  // 5. Botones de navegación
  // -----------------------------
  document.getElementById("btn-start-register").addEventListener("click", () => {
    viewDashboard.classList.remove("active");
    viewDashboard.classList.add("hidden");
    viewRegister.classList.remove("hidden");
    viewRegister.classList.add("active");
  });

  const btnBack = document.querySelector(".btn-back");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      viewRegister.classList.remove("active");
      viewRegister.classList.add("hidden");
      viewDashboard.classList.remove("hidden");
      viewDashboard.classList.add("active");
    });
  }

  const btnViewDetails = document.getElementById("btn-view-details");
  if (btnViewDetails) {
    btnViewDetails.addEventListener("click", () => {
      const p = loadProfile();
      if (!p) return;

      // Llenar vista
      document.getElementById("details-personal").innerHTML = `
        <li><span class="label">Nombre</span><span class="value">${p.name || 'N/A'}</span></li>
        <li><span class="label">RUT</span><span class="value">${p.rut || 'N/A'}</span></li>
        <li><span class="label">Correo</span><span class="value">${p.email || 'N/A'}</span></li>
        <li><span class="label">Celular</span><span class="value">${p.phone || 'N/A'}</span></li>
        <li><span class="label">Ubicación</span><span class="value">${p.address || ''}, ${p.commune || ''}, ${p.region || ''}</span></li>
        <li><span class="label">Vivienda</span><span class="value">${p.housing || 'N/A'}</span></li>
      `;

      document.getElementById("details-background").innerHTML = `
        <li><span class="label">Experiencia</span><span class="value">${p.experience || 'N/A'}</span></li>
        <li><span class="label">Adopciones Previas</span><span class="value">${p.adoptions || 0}</span></li>
        <li><span class="label">Tiempo Disponible</span><span class="value">${p.time || 0} hrs</span></li>
        <li><span class="label">Motivación</span><span class="value">${p.motivation || 'N/A'}</span></li>
      `;

      viewDashboard.classList.remove("active");
      viewDashboard.classList.add("hidden");
      viewDetails.classList.remove("hidden");
      viewDetails.classList.add("active");
    });
  }

  const btnBackDetails = document.querySelector(".btn-back-details");
  if (btnBackDetails) {
    btnBackDetails.addEventListener("click", () => {
      viewDetails.classList.remove("active");
      viewDetails.classList.add("hidden");
      viewDashboard.classList.remove("hidden");
      viewDashboard.classList.add("active");
    });
  }

  document.getElementById("btn-cancel-verify").addEventListener("click", () => {
    viewVerify.classList.remove("active");
    viewVerify.classList.add("hidden");
    viewDashboard.classList.remove("hidden");
    viewDashboard.classList.add("active");
  });

  document.getElementById("btn-cancel-profile").addEventListener("click", () => {
    viewProfile.classList.remove("active");
    viewProfile.classList.add("hidden");
    viewDashboard.classList.remove("hidden");
    viewDashboard.classList.add("active");
  });

  document.getElementById("btn-reset-data").addEventListener("click", () => {
    localStorage.removeItem("activeProfileId");
    document.getElementById("form-register").reset();
    document.getElementById("form-profile").reset();
    document.getElementById("form-verify").reset();
    alert("Se ha reiniciado el formulario para un nuevo registro.");
    location.reload();
  });

  const btnClosePage = document.getElementById("btn-close-page");
  if (btnClosePage) {
    btnClosePage.addEventListener("click", () => {
      localStorage.removeItem("activeProfileId");
      document.getElementById("form-register").reset();
      document.getElementById("form-profile").reset();
      document.getElementById("form-verify").reset();
      window.location.href = "../index.html";
      setTimeout(() => window.close(), 100);
    });
  }

  // Navegación Mascotas
  const btnChoosePet = document.getElementById("btn-choose-pet");
  if (btnChoosePet) {
    btnChoosePet.addEventListener("click", () => {
      renderPetsGrid();
      viewDashboard.classList.remove("active");
      viewDashboard.classList.add("hidden");
      viewPets.classList.remove("hidden");
      viewPets.classList.add("active");
    });
  }

  const btnBackPets = document.querySelector(".btn-back-pets");
  if (btnBackPets) {
    btnBackPets.addEventListener("click", () => {
      viewPets.classList.remove("active");
      viewPets.classList.add("hidden");
      viewDashboard.classList.remove("hidden");
      viewDashboard.classList.add("active");
    });
  }

  // Navegación Admin
  const btnGoAdmin = document.getElementById("btn-go-admin");
  if (btnGoAdmin) {
    btnGoAdmin.addEventListener("click", () => {
      renderAdminRequests();
      viewDashboard.classList.remove("active");
      viewDashboard.classList.add("hidden");
      viewAdmin.classList.remove("hidden");
      viewAdmin.classList.add("active");
    });
  }

  const btnBackAdmin = document.querySelector(".btn-back-admin");
  if (btnBackAdmin) {
    btnBackAdmin.addEventListener("click", () => {
      viewAdmin.classList.remove("active");
      viewAdmin.classList.add("hidden");
      viewDashboard.classList.remove("hidden");
      viewDashboard.classList.add("active");
    });
  }

  const btnBackAdminDetail = document.querySelector(".btn-back-admin-detail");
  if (btnBackAdminDetail) {
    btnBackAdminDetail.addEventListener("click", () => {
      viewAdminDetail.classList.remove("active");
      viewAdminDetail.classList.add("hidden");
      viewAdmin.classList.remove("hidden");
      viewAdmin.classList.add("active");
    });
  }

  // Reiniciar Sistema (Factory Reset)
  const btnFactoryReset = document.getElementById("btn-factory-reset");
  if (btnFactoryReset) {
    btnFactoryReset.addEventListener("click", () => {
      if (confirm("⚠️ ¿Estás segura de que quieres borrar TODOS los datos (adoptantes y estados de mascotas)? Esta acción liberará a las mascotas y dejará el sistema desde cero.")) {
        localStorage.clear();
        alert("Sistema reiniciado desde cero. Las mascotas están disponibles nuevamente.");
        location.reload();
      }
    });
  }

  // -----------------------------
  // Visualizar archivos adjuntos
  // -----------------------------
  const fileInput = document.getElementById("prof-evidence");
  const fileList = document.getElementById("file-list");
  if (fileInput && fileList) {
    fileInput.addEventListener("change", () => {
      fileList.innerHTML = "";
      Array.from(fileInput.files).forEach(file => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="material-symbols-rounded">description</span> ${file.name}`;
        fileList.appendChild(li);
      });
    });
  }

  // -----------------------------
  // 6. Al cargar, revisar perfil guardado
  // -----------------------------
  const profile = loadProfile();
  if (profile) updateProfileStatus(profile);
  else updateProfileStatus(null);
});

// -----------------------------
// Funciones auxiliares
// -----------------------------
function showError(id, msg) {
  const input = document.getElementById(id);
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = msg;
  errorSpan.classList.add("visible");
  input.classList.add("invalid");
}

function clearError(id) {
  const input = document.getElementById(id);
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = "";
  errorSpan.classList.remove("visible");
  input.classList.remove("invalid");
}

function getAdopterProfiles() {
  const raw = localStorage.getItem("adopterProfiles");
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveProfile(data) {
  let profiles = getAdopterProfiles();
  let activeId = localStorage.getItem("activeProfileId");
  let profileIndex = activeId ? profiles.findIndex(p => p.id === activeId) : -1;

  const score = calculateRating(data);
  let estado = "Incompleto";
  if (score >= 4) estado = "Completo";
  else if (score >= 2) estado = "En revisión";

  if (profileIndex > -1) {
    const existing = profiles[profileIndex];
    data.id = existing.id;
    data.mascotaSolicitada = existing.mascotaSolicitada || null;
    if (existing.estado === "Pendiente" || existing.estado === "Aprobado" || existing.estado === "Rechazado") {
      data.estado = existing.estado;
    } else {
      data.estado = estado;
    }
    profiles[profileIndex] = data;
  } else {
    data.id = Date.now().toString();
    data.mascotaSolicitada = null;
    data.estado = estado;
    profiles.push(data);
    localStorage.setItem("activeProfileId", data.id);
  }
  localStorage.setItem("adopterProfiles", JSON.stringify(profiles));
}

function loadProfile() {
  const activeId = localStorage.getItem("activeProfileId");
  if (!activeId) return null;
  const profiles = getAdopterProfiles();
  return profiles.find(p => p.id === activeId) || null;
}

function calculateRating(profile) {
  if (!profile) return 0;
  let score = 0;
  if (profile.adoptions > 0) score += 2;
  if (profile.experience !== "ninguna") score += 1;
  if (profile.time >= 4) score += 1;
  if (profile.evidences > 0) score += 1;
  return Math.min(Math.max(score, 1), 5); // Minimum 1 star if completed profile
}

function renderStars(score) {
  const container = document.getElementById("profile-stars");
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "material-symbols-rounded star" + (i <= score ? " active" : "");
    star.textContent = "grade";
    container.appendChild(star);
  }
}

function updateProfileStatus(profile) {
  const badge = document.getElementById("profile-status-badge");
  const score = calculateRating(profile);

  const btnViewDetails = document.getElementById("btn-view-details");
  const btnStartRegister = document.getElementById("btn-start-register");
  const btnChoosePet = document.getElementById("btn-choose-pet");

  if (!profile) {
    badge.textContent = "Incompleto";
    badge.dataset.state = "Incompleto";
    renderStars(0);
    if (btnViewDetails) btnViewDetails.classList.add("hidden");
    if (btnChoosePet) btnChoosePet.classList.add("hidden");
    if (btnStartRegister) btnStartRegister.textContent = "Completar Perfil";
    return;
  }

  if (btnViewDetails) btnViewDetails.classList.remove("hidden");
  if (btnStartRegister) btnStartRegister.textContent = "Actualizar Perfil";

  renderStars(score);

  badge.textContent = profile.estado;
  badge.dataset.state = profile.estado;

  if (!profile.mascotaSolicitada) {
    if (btnChoosePet) btnChoosePet.classList.remove("hidden");
  } else {
    if (btnChoosePet) btnChoosePet.classList.add("hidden");
  }
}

// -----------------------------
// Lógica de Mascotas y Admin
// -----------------------------
const mockPets = [
  { id: 1, name: "Bigote", type: "Gato", img: "../img/Bigote.jpeg" },
  { id: 2, name: "Mico", type: "Perro", img: "../img/Mico.jpeg" },
  { id: 3, name: "Polo", type: "Perro", img: "../img/Polo.jpeg" },
  { id: 4, name: "Vigilante", type: "Gato", img: "../img/Vigilante.jpeg" },
  { id: 5, name: "Yiya", type: "Perro", img: "../img/Yiya.jpeg" },
  { id: 6, name: "Pantro", type: "Gato", img: "../img/pantro.jpeg" },
  { id: 7, name: "Los 4 Mosqueteros", type: "Gatos", img: "../img/4_mosqueteros.jpeg" },
  { id: 8, name: "Lana y Pluma", type: "Perros", img: "../img/Lana y Pluma.jpeg" }
];

function getAdoptionRequests() {
  let profiles = getAdopterProfiles();
  if (profiles.length === 0) {
    const mockProfiles = [
      {
        id: "mock-1", name: "María González", phone: "+56 9 8765 4321", rut: "11.111.111-1",
        email: "maria@example.com", estado: "Pendiente", mascotaSolicitada: mockPets[1],
        date: new Date().toISOString()
      },
      {
        id: "mock-2", name: "Carlos López", phone: "+54 9 11 2345 6789", rut: "22.222.222-2",
        email: "carlos@example.com", estado: "Rechazado", mascotaSolicitada: mockPets[0],
        date: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    localStorage.setItem("adopterProfiles", JSON.stringify(mockProfiles));
    return mockProfiles;
  }
  return profiles;
}

function renderPetsGrid() {
  const container = document.getElementById("pets-grid");
  if (!container) return;

  const profiles = getAdopterProfiles();
  const adoptedPets = profiles
    .filter(p => p.estado === "Aprobado" && p.mascotaSolicitada)
    .map(p => p.mascotaSolicitada.name);

  container.innerHTML = mockPets.map(pet => {
    const isAdopted = adoptedPets.includes(pet.name);
    return `
    <div class="pet-card">
      <img src="${pet.img}" alt="${pet.name}" class="pet-img">
      <div class="pet-info">
        <h3>${pet.name}</h3>
        <p>${pet.type}</p>
        ${isAdopted
        ? '<p style="color: var(--clr-primary); font-weight: bold; margin-top: 0.5rem; text-align: center;">🎉 ¡Ya llego a su feliz casa!</p>'
        : `<button class="btn btn-secondary btn-adopt" onclick="requestAdoption(${pet.id})">Solicitar Adopción</button>`}
      </div>
    </div>
  `}).join("");
}

window.requestAdoption = function (petId) {
  const profile = loadProfile();
  if (!profile) {
    alert("Debes completar tu perfil primero.");
    return;
  }
  if (profile.mascotaSolicitada) {
    alert(`Ya tienes una solicitud en proceso para ${profile.mascotaSolicitada.name}.`);
    return;
  }

  const pet = mockPets.find(p => p.id === petId);

  const profiles = getAdopterProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);

  if (index > -1) {
    profiles[index].mascotaSolicitada = pet;
    profiles[index].estado = "Pendiente";
    profiles[index].date = new Date().toISOString();
    localStorage.setItem("adopterProfiles", JSON.stringify(profiles));

    alert(`¡Solicitud enviada para adoptar a ${pet.name}!`);
    updateProfileStatus(profiles[index]);

    // Volver al dashboard
    document.getElementById("view-pets").classList.remove("active");
    document.getElementById("view-pets").classList.add("hidden");
    document.getElementById("view-dashboard").classList.remove("hidden");
    document.getElementById("view-dashboard").classList.add("active");
  }
};

function renderAdminRequests() {
  const container = document.getElementById("admin-requests-list");
  if (!container) return;

  const requests = getAdoptionRequests();

  if (requests.length === 0) {
    container.innerHTML = "<p>No hay solicitudes pendientes.</p>";
    return;
  }

  // Ordenar: pendientes primero, luego por fecha
  requests.sort((a, b) => {
    if (a.estado === "Pendiente" && b.estado !== "Pendiente") return -1;
    if (a.estado !== "Pendiente" && b.estado === "Pendiente") return 1;
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA;
  });

  container.innerHTML = requests.map(req => {
    const petName = req.mascotaSolicitada ? req.mascotaSolicitada.name : "Aún sin solicitar";
    return `
    <div class="request-card" style="cursor: pointer;" onclick="viewAdminRequestDetail('${req.id}')">
      <div class="req-info">
        <h3>${req.name} <span style="font-size: 0.9rem; font-weight: normal; color: var(--clr-text-light);">(${req.phone || 'Sin tel.'})</span></h3>
        <p>Mascota: <strong>${petName}</strong></p>
        <span class="req-status ${req.estado.replace(" ", "-")}">${req.estado}</span>
      </div>
      <div class="req-actions">
        <span class="material-symbols-rounded" style="color: var(--clr-text-light); font-size: 2rem;">chevron_right</span>
      </div>
    </div>
  `}).join("");
}

window.viewAdminRequestDetail = function (profileId) {
  const profiles = getAdopterProfiles();
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return;

  const score = calculateRating(profile);
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<span class="material-symbols-rounded star ${i <= score ? 'active' : ''}" style="font-size: 1.5rem;">grade</span>`;
  }

  const container = document.getElementById("admin-detail-content");
  container.innerHTML = `
    <div class="details-section">
      <h3><span class="material-symbols-rounded">person</span> Información Personal</h3>
      <ul class="details-list">
        <li><span class="label">Nombre</span><span class="value">${profile.name}</span></li>
        <li><span class="label">RUT</span><span class="value">${profile.rut}</span></li>
        <li><span class="label">Correo</span><span class="value">${profile.email}</span></li>
        <li><span class="label">Celular</span><span class="value">${profile.phone}</span></li>
        <li><span class="label">Ubicación</span><span class="value">${profile.address || ''}, ${profile.commune || ''}, ${profile.region || ''}, ${profile.country || ''}</span></li>
        <li><span class="label">Vivienda</span><span class="value" style="text-transform: capitalize;">${profile.housing}</span></li>
      </ul>
    </div>
    
    <div class="details-section">
      <h3><span class="material-symbols-rounded">assignment</span> Antecedentes</h3>
      <ul class="details-list">
        <li><span class="label">Experiencia</span><span class="value" style="text-transform: capitalize;">${profile.experience || 'N/A'}</span></li>
        <li><span class="label">Adopciones Previas</span><span class="value">${profile.adoptions || 0}</span></li>
        <li><span class="label">Tiempo Disponible</span><span class="value">${profile.time || 0} hrs</span></li>
        <li><span class="label">Motivación</span><span class="value">${profile.motivation || 'N/A'}</span></li>
      </ul>
      <div style="margin-top: 1.5rem; text-align: center;">
        <span class="label" style="display:block; margin-bottom: 0.5rem; font-weight: bold;">Calificación del Sistema</span>
        <div class="stars-container" style="margin: 0; min-height: auto;">${starsHtml}</div>
      </div>
    </div>
    
    ${profile.mascotaSolicitada ? `
    <div class="details-section" style="text-align: center; background: #fff0f3;">
      <h3><span class="material-symbols-rounded">pets</span> Mascota Solicitada</h3>
      <p style="font-size: 1.4rem; font-weight: 700; color: var(--clr-primary-light);">${profile.mascotaSolicitada.name}</p>
      <span class="req-status ${profile.estado}" style="display:inline-block; margin-top:0.5rem; padding: 0.25rem 0.75rem; border-radius: 999px; background: white;">Estado: ${profile.estado}</span>
    </div>
    ` : `
    <div class="details-section" style="text-align: center; background: #f9f9f9;">
      <h3><span class="material-symbols-rounded">pets</span> Mascota Solicitada</h3>
      <p style="font-size: 1.2rem; font-weight: 500; color: var(--clr-text-light);">Aún no ha solicitado mascota</p>
      <span class="req-status ${profile.estado}" style="display:inline-block; margin-top:0.5rem; padding: 0.25rem 0.75rem; border-radius: 999px; background: white;">Estado: ${profile.estado}</span>
    </div>
    `}
    
    ${(profile.estado === "Pendiente" && profile.mascotaSolicitada) ? `
      <div class="form-actions" style="justify-content: center; gap: 1rem; margin-top: 2rem;">
        <button class="btn btn-approve" onclick="updateRequestStatus('${profile.id}', 'Aprobado')" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
          <span class="material-symbols-rounded">check</span> Aprobar
        </button>
        <button class="btn btn-reject" onclick="updateRequestStatus('${profile.id}', 'Rechazado')" style="font-size: 1.1rem; padding: 0.75rem 2rem;">
          <span class="material-symbols-rounded">close</span> Rechazar
        </button>
      </div>
    ` : ''}
  `;

  document.getElementById("view-admin").classList.remove("active");
  document.getElementById("view-admin").classList.add("hidden");
  document.getElementById("view-admin-detail").classList.remove("hidden");
  document.getElementById("view-admin-detail").classList.add("active");
};

window.updateRequestStatus = function (profileId, newStatus) {
  const profiles = getAdopterProfiles();
  const index = profiles.findIndex(p => p.id === profileId);
  if (index > -1) {
    profiles[index].estado = newStatus;
    localStorage.setItem("adopterProfiles", JSON.stringify(profiles));

    renderAdminRequests(); // Re-render

    // Enviar correo
    const profile = profiles[index];
    const petName = profile.mascotaSolicitada.name;
    let subject = "";
    let body = "";

    if (newStatus === "Aprobado") {
      subject = encodeURIComponent("¡Felicidades! Tu solicitud de adopción ha sido aprobada");
      body = encodeURIComponent(`¡Felicidades ${profile.name}!\n\nEl proceso de adopción de ${petName} ha sido aprobado.\nNos pondremos en contacto contigo pronto para los siguientes pasos.\n\nSaludos,\nEquipo Camino a Casa`);
    } else if (newStatus === "Rechazado") {
      subject = encodeURIComponent("Actualización sobre tu solicitud de adopción");
      body = encodeURIComponent(`Hola ${profile.name},\n\nLo siento, en esta ocasión no calificas para la adopción de ${petName}.\nPara más información o dudas, puedes responder a este correo.\n\nSaludos,\nEquipo Camino a Casa`);
    }

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    // Volver a la lista
    document.getElementById("view-admin-detail").classList.remove("active");
    document.getElementById("view-admin-detail").classList.add("hidden");
    document.getElementById("view-admin").classList.remove("hidden");
    document.getElementById("view-admin").classList.add("active");

    // Update dashboard if active profile was changed
    const activeId = localStorage.getItem("activeProfileId");
    if (activeId === profileId) {
      updateProfileStatus(profiles[index]);
    }
  }
};


const regionSelect = document.getElementById("reg-region");
const comunaSelect = document.getElementById("reg-commune");

// Llenar regiones al cargar
window.addEventListener("DOMContentLoaded", () => {
  for (const region in chileData) {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  }
});

// Actualizar comunas cuando cambia la región
regionSelect.addEventListener("change", () => {
  const region = regionSelect.value;

  // Limpia comunas anteriores
  comunaSelect.innerHTML = "<option value=''>Selecciona tu comuna</option>";

  if (region && chileData[region]) {
    chileData[region].forEach(comuna => {
      const option = document.createElement("option");
      option.value = comuna;
      option.textContent = comuna;
      comunaSelect.appendChild(option);
    });
    comunaSelect.disabled = false;
  } else {
    comunaSelect.disabled = true;
  }
});
