import { setWithExpiry, getWithExpiry } from "./modules/localStorageHelpers.js";

const key = "pb3WbIQux4hi9ZGGD38jXNA1K5gjBt6j";
const API = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${key}`;
const storagePrefix = "nyt-autosave";

function getStories() {
  const stories = getWithExpiry(storagePrefix);
  if (!stories) {
    console.warn(" stories expired - fetching again ");
    fetch(API)
      .then((response) => response.json())
      .then((data) => showData(data.results));
  } else {
    console.warn(" stories not expired - no fetching ");
    document.querySelector(".stories").innerHTML = stories;
  }
}

function showData(stories) {
  const looped = stories
    .map(
      (story) => `
    <div class="item">
    <img src="${story.multimedia ? story.multimedia[2].url : ""}" alt="${
        story.multimedia ? story.multimedia[2]?.caption : ""
      }" />
    <figcaption>${
      story.multimedia ? story.multimedia[2]?.caption : ""
    }</figcaption>
      <h3><a href="${story.url}">${story.title}</a></h3>
      <p>${story.abstract}</p>
    </div>
  `
    )
    .join("");

  document.querySelector(".stories").innerHTML = looped;
  setWithExpiry(storagePrefix, looped, 1000 * 60);
}

if (document.querySelector(".home")) {
  getStories();
}

// ===

document.addEventListener("click", clickHandlers);

function clickHandlers(event) {
  if (event.target.matches("#pull")) {
    showMenu(event);
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    videoSwitch(event);
    event.preventDefault();
  }
  if (event.target.matches(".image-tn img")) {
    runCarousel(event);
    event.preventDefault();
  }
}

function runCarousel(event) {
  const imageHref = event.target.parentNode.getAttribute("href");
  const titleText = event.target.title;
  document.querySelector("figure img").setAttribute("src", imageHref);
  // document.querySelector("figure img").src = imageHref;
  document.querySelector("figcaption").innerHTML = titleText;
}

function showMenu() {
  document.querySelector("body").classList.toggle("show-nav");
}

function videoSwitch(event) {
  const iFrame = document.querySelector("iframe");
  const videoLinks = document.querySelectorAll(".content-video a");
  videoLinks.forEach((videoLink) => videoLink.classList.remove("active"));
  event.target.classList.add("active");
  const videoToPlay = event.target.getAttribute("href");
  iFrame.setAttribute("src", videoToPlay);
}
