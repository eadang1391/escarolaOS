import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "escarolaos-e8ee8.firebaseapp.com",
    projectId: "escarolaos-e8ee8",
    storageBucket: "escarolaos-e8ee8.appspot.com",
    messagingSenderId: "TU_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentPin = "";
const dots = document.querySelectorAll('.dot');

window.press = async (n) => {
    if(currentPin.length < 4) {
        currentPin += n;
        updateDots();
        if(currentPin.length === 4) {
            const q = query(collection(db, "usuarios"), where("pin", "==", currentPin));
            const snap = await getDocs(q);
            if(!snap.empty) {
                const user = snap.docs[0].data();
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                document.getElementById('userName').innerText = "Hola, " + user.nombre;
                cargarSaldos();
            } else {
                alert("PIN Incorrecto");
                reset();
            }
        }
    }
};

window.reset = () => { currentPin = ""; updateDots(); };
window.backspace = () => { currentPin = currentPin.slice(0, -1); updateDots(); };
function updateDots() { dots.forEach((d, i) => i < currentPin.length ? d.classList.add('filled') : d.classList.remove('filled')); }

async function cargarSaldos() {
    const snap = await getDoc(doc(db, "finanzas", "saldos"));
    if(snap.exists()) {
        const d = snap.data();
        document.getElementById('valBanco').innerText = "$" + (d.banco || 0).toLocaleString();
        document.getElementById('valEfectivo').innerText = "$" + (d.efectivo || 0).toLocaleString();
        document.getElementById('valTotal').innerText = "$" + ((d.banco || 0) + (d.efectivo || 0)).toLocaleString();
    }
}

window.ajustarSaldo = async (tipo) => {
    const monto = prompt("Nuevo monto para " + tipo + ":");
    if(monto && !isNaN(monto)) {
        await setDoc(doc(db, "finanzas", "saldos"), { [tipo]: parseFloat(monto) }, { merge: true });
        cargarSaldos();
    }
};