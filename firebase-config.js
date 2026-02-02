// Importar las librerías necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqnPu5uInhoWBTwPs46asfm4ecotShfHY",
  authDomain: "escarolaos-ed7e8.firebaseapp.com",
  projectId: "escarolaos-ed7e8",
  storageBucket: "escarolaos-ed7e8.firebasestorage.app",
  messagingSenderId: "211000066025",
  appId: "1:211000066025:web:d71791f51acb571414d578"
};

// Inicializar Firebase y exportar para usar en el index
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, getDoc };
