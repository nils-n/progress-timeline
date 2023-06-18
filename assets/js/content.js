import { getDocs, collection, firebaseDB } from "./firebase";

const contentContainer = document.getElementById("demo-content-container");
const filterBtn = document.getElementById("filter");
const sortBtn = document.getElementById("sort-btn");

// filter content

// sort content
export function sortContent() {
  const isAscending = sortBtn.classList.contains("asc");

  const order = isAscending ? "ascending" : "descending";
  isAscending ? sortBtn.classList.remove("asc") : sortBtn.classList.add("asc");

  const content = Array.from(contentContainer.querySelectorAll(".content-box"));

  content.sort((a, b) => {
    const dateA = parseInt(a.querySelector(".content-decade").textContent);
    const dateB = parseInt(b.querySelector(".content-decade").textContent);

    if (order === "ascending") {
      return dateA - dateB;
    } else if (order === "descending") {
      return dateB - dateA;
    }
  });

  contentContainer.innerHTML = "";

  content.forEach((data) => contentContainer.appendChild(data));
}
