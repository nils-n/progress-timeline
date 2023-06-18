import { getDocs, collection, firebaseDB } from "./firebase";

const contentContainer = document.getElementById("demo-content-container");
const filterBtn = document.getElementById("filter");
const sortBtn = document.getElementById("sort-btn");

// filter content
export async function filterContent() {
  let category = filterBtn.value;

  try {
    const contentDocuments = [];
    const contentSnapshotRef = await getDocs(collection(firebaseDB, "content"));

    contentSnapshotRef.forEach((contentSnap) => {
      const contentDocument = contentSnap.data();
      contentDocuments.push(contentDocument);
    });

    const filteredDocuments = contentDocuments.filter((document) => {
      if (category === "all") {
        return document;
      }
      if (document.category !== category) {
        return document.decade.toString() === category;
      } else {
        return document.category === category;
      }
    });

    contentContainer.innerHTML = "";

    filteredDocuments.forEach((doc) => {
      const contentElement = document.createElement("div");

      contentElement.classList.add("content-box");

      const html = ` 
      <h2 class="content-header">${doc.title}</h2>
      <h3 class="content-decade">${doc.decade}</h3>
      <p class="content">
      ${doc.content}
      </p>
    `;

      contentElement.innerHTML = html;

      contentContainer.appendChild(contentElement);
    });
  } catch (error) {
    console.error("Error retrieving content:", error);
    alert("Failed to retrieve stories. Please try again.");
  }
}

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
