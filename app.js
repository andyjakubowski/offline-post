function loadImage(imageJSON) {
  return new Promise((resolve, reject) => {
    fetch(imageJSON.url).then((response) => {
      if (response.status == 200) {
        const arrayResponse = [];
        response.blob().then((imageBlob) => {
          arrayResponse[0] = imageBlob;
          arrayResponse[1] = imageJSON;
          resolve(arrayResponse);
        });
      } else {
        reject(
          Error(
            `Image did not load successfully; error code: ${response.status} ${response.statusText}`
          )
        );
      }
    });
  });
}

function renderImages() {
  const images = [
    {
      url: "images/sunflower.jpg",
      alt: "Sunflower",
      author: "Brigitte Tohm",
    },
    {
      url: "images/icyWaterfall.jpg",
      alt: "Icy Waterfall",
      author: "Rémy Penet",
    },
    {
      url: "images/cherryBlossom.jpg",
      alt: "Cherry Blossom",
      author: "The Miscellanista",
    },
    {
      url: "images/leaves.jpg",
      alt: "Leaves",
      author: "Vino Li",
    },
  ];
  const main = document.querySelector("main");
  images.forEach((image) => {
    loadImage(image).then((arrayResponse) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      const imageURL = window.URL.createObjectURL(arrayResponse[0]);
      img.src = imageURL;
      img.alt = arrayResponse[1].alt;
      figcaption.innerText = `${arrayResponse[1].alt} by ${arrayResponse[1].author}`;
      figure.append(img, figcaption);
      main.append(figure);
    });
  });
}

function updateOnlineStatus() {
  const heading = document.querySelector(".online-status");
  const isOnline = navigator.onLine;
  heading.innerText = isOnline ? "Online" : "Offline";
  heading.classList.toggle("online", isOnline);
  heading.classList.toggle("offline", !isOnline);
}

function addOnLineEventListeners() {
  window.addEventListener("offline", updateOnlineStatus);
  window.addEventListener("online", updateOnlineStatus);
}

function runApp() {
  renderImages();
  updateOnlineStatus();
  addOnLineEventListeners();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/offline-post/serviceWorker.js", {
      scope: "/offline-post/",
    })
    .then((registration) => {
      console.info(
        "%cService Worker%c Registered. Scope: ",
        `
    color: black;
    background-color: #FFC857;
    padding: 0 4px;
    font-weight: bold;
  
    `,
        "",
        registration.scope
      );

      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    })
    .catch((error) => {
      console.log("Service Worker registration failed:", error);
    });
}

if (document.readyState !== "loading") {
  runApp();
} else {
  document.addEventListener("DOMContentLoaded", runApp);
}
