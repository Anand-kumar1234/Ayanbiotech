import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, update } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDFbjNunbVOUc3iLqAft-MpB426bNGA1u8",
  authDomain: "ayan-biotch.firebaseapp.com",
  databaseURL: "https://ayan-biotch-default-rtdb.firebaseio.com",
  projectId: "ayan-biotch",
  storageBucket: "ayan-biotch.firebasestorage.app",
  messagingSenderId: "456722744485",
  appId: "1:456722744485:web:d3fc7e9eb2cfa7b2fb794c",
  measurementId: "G-H9LTYGD23C"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Animate query form on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

// Observe form itself
const queryForm = document.getElementById('queryForm');
observer.observe(queryForm);

const queryList = document.getElementById('queryList');

// Form Submit
queryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const product = document.getElementById('product').value;
  const phone = document.getElementById('phone').value;
  const question = document.getElementById('question').value;

  const queryRef = ref(db, 'queries');
  await push(queryRef, {
    product,
    phone,
    question,
    time: new Date().toLocaleString(),
    status: 'Pending'
  });

  queryForm.reset();
});

// Listen for new queries
const queryRef = ref(db, 'queries');
onChildAdded(queryRef, snapshot => {
  const data = snapshot.val();
  const key = snapshot.key;

  const div = document.createElement('div');
  div.className = 'query-item animate-on-scroll';
  div.style.opacity = 0; // initial hidden for smooth fade

  const status = document.createElement('span');
  status.className = 'query-item-status';
  status.innerText = data.status;

  const btn = document.createElement('button');
  btn.className = 'mark-solved';
  btn.innerText = 'Mark as Solved';

  btn.addEventListener('click', () => {
    update(ref(db, 'queries/' + key), { status: 'Solved' });
    status.innerText = 'Solved';
    // Smooth background animation on solve
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => btn.style.transform = 'scale(1)', 150);
  });

  div.innerHTML = `
    <strong>${data.product}</strong>
    <p>${data.question}</p>
    <div>${data.phone}</div>
    <div style="font-size:0.85rem;color:#555;">${data.time}</div>
  `;

  div.appendChild(status);
  div.appendChild(btn);

  queryList.prepend(div);

  // Animate fade-in and slide
  setTimeout(() => div.style.opacity = 1, 50);
  observer.observe(div);
});



