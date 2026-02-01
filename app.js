import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqnPu5uInhoWBTwPs46asfm4ecotShfHY",
  authDomain: "escarolaos-ed7e8.firebaseapp.com",
  projectId: "escarolaos-ed7e8",
  storageBucket: "escarolaos-ed7e8.firebasestorage.app",
  messagingSenderId: "211000066025",
  appId: "1:211000066025:web:d71791f51acb571414d578"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentPin = "";
const dots = document.querySelectorAll('.dot');

// --- EXPONEMOS LAS FUNCIONES AL HTML ---
window.press = async (n) => {
    if(currentPin.length < 4) {
        currentPin += n;
        updateDots();
        if(currentPin.length === 4) {
            await verificarAcceso();
        }
    }
};

window.reset = () => { currentPin = ""; updateDots(); };

window.backspace = () => { 
    currentPin = currentPin.slice(0, -1); 
    updateDots(); 
};

window.closeModal = () => {
    document.getElementById('customModal').style.display = 'none';
};

// --- LÓGICA DE FIREBASE ---
async function verificarAcceso() {
    try {
        const q = query(collection(db, "usuarios"), where("pin", "==", currentPin));
        const snap = await getDocs(q);
        
        if(!snap.empty) {
            const user = snap.docs[0].data();
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('userName').innerText = "Hola, " + user.nombre;
            cargarSaldos();
        } else {
            showModal("Acceso Denegado", "El PIN " + currentPin + " no es válido.");
            reset();
        }
    } catch (error) {
        showModal("Error de Conexión", "No se pudo conectar con EscarolaOS.");
        reset();
    }
}

// --- SISTEMA DE MODAL PROPIO ---
function showModal(titulo, mensaje) {
    document.getElementById('modalTitle').innerText = titulo;
    document.getElementById('modalMsg').innerText = mensaje;
    document.getElementById('customModal').style.display = 'flex';
}

function updateDots() { 
    dots.forEach((d, i) => i < currentPin.length ? d.classList.add('filled') : d.classList.remove('filled')); 
}

// --- FINANZAS ---
async function cargarSaldos() {
    const snap = await getDoc(doc(db, "finanzas", "saldos"));
    if(snap.exists()) {
        const d = snap.data();
        const b = d.banco || 0;
        const e = d.efectivo || 0;
        document.getElementById('valBanco').innerText = "$" + b.toLocaleString();
        document.getElementById('valEfectivo').innerText = "$" + e.toLocaleString();
        document.getElementById('valTotal').innerText = "$" + (b + e).toLocaleString();
    }
}

window.ajustarSaldo = async (tipo) => {
    const monto = prompt("Nuevo monto para " + tipo + ":"); // Pronto cambiaremos este prompt también
    if(monto && !isNaN(monto)) {
        await setDoc(doc(db, "finanzas", "saldos"), { [tipo]: parseFloat(monto) }, { merge: true });
        cargarSaldos();
        showModal("Éxito", "Saldo actualizado correctamente.");
    }
};
