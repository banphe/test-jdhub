/**
 * Używane przez index.html jako pierwsza rzecz przed załadowaniem aplikacji.
 * Firebase Auth z Google OAuth - wymusza logowanie i sprawdza whitelist emaili.
 * Jeśli użytkownik nie jest zalogowany lub nie ma dostępu - wyświetla ekran logowania.
 * Po zalogowaniu ładuje Router i resztę aplikacji.
 */
import { auth } from '../config/firebase-init.js';
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Whitelist emaili z dostępem do aplikacji
const ALLOWED_EMAILS = [
  'kuba5000@gmail.com'
];

// Odbierz wynik po powrocie z redirect
getRedirectResult(auth).then((result) => {
  if (result && result.user) {
    const email = result.user.email;
    if (!ALLOWED_EMAILS.includes(email)) {
      auth.signOut();
      alert('Brak dostępu. Twój email: ' + email);
    }
  }
}).catch((error) => {
  console.error('Redirect error:', error);
  if (error.code === 'auth/unauthorized-domain') {
    alert('Błąd: localhost nie jest autoryzowany w Firebase.\nDodaj 127.0.0.1:5500 do Authorized domains w Firebase Console.\nAlbo użyj test.jdhub.shop');
  }
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showLoginScreen();
  } else {
    if (!ALLOWED_EMAILS.includes(user.email)) {
      auth.signOut();
      alert('Brak dostępu. Twój email: ' + user.email);
      return;
    }
    loadApp();
  }
});

function showLoginScreen() {
  document.getElementById('app').innerHTML = `
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 class="text-2xl font-bold mb-4">Thairapy</h1>
        <p class="text-gray-600 mb-6">Zaloguj się aby kontynuować</p>
        <button id="login-btn" class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center gap-2 mx-auto">
          <i class="fab fa-google"></i>
          Zaloguj przez Google
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('login-btn').addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithRedirect(auth, provider);
      // Po powrocie z Google onAuthStateChanged automatycznie się wykona
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('Błąd: localhost nie jest autoryzowany w Firebase.\n\nMusisz dodać "127.0.0.1:5500" do Authorized domains w Firebase Console:\nhttps://console.firebase.google.com/project/thairapy/authentication/settings\n\nLub użyj test.jdhub.shop zamiast localhost.');
      } else {
        alert('Błąd logowania: ' + error.message);
      }
    }
  });
}

function loadApp() {
  if (!window.appLoaded) {
    const timestamp = Date.now();
    import(`../../app.js?v=${timestamp}`).then(() => {
      // app.js sam inicjalizuje wszystko
    });
    window.appLoaded = true;
  }
}
