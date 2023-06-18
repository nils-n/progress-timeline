import {
    doc,
    setDoc,
    getDocs,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    firebaseAuth,
    firebaseDB
  } from "./firebase";
  
  // create story
  export const createStory = async (title, content, decade, publishDate) => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const storyRef = doc(firebaseDB, "stories", generateUniqueID());
        const newStory = {
          title,
          content,
          author: user.email,
          likeCounter: 0,
          decade,
          publishDate,
          createdAt: new Date(),
        };
        await setDoc(storyRef, newStory);
  
        alert("Story created successfully!");
      } catch (error) {
        console.error("Error creating story: ", error);
        alert("Failed to create story. Please try again.");
      }
    } else {
      alert("You need to be logged in to create a story.");
    }
  };
  
  // generate unique id
  const generateUniqueID = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };
  
  // display stories
  export const displayStories = async () => {
    const storiesContainer = document.getElementById("stories-container");

    try {
      const storiesSnapshot = await getDocs(collection(firebaseDB, "stories"));
      storiesSnapshot.forEach((storyDoc) => {
        const storyData = storyDoc.data();
        const user = firebaseAuth.currentUser;
        const isLikedByUser = user && storyData.likedBy && storyData.likedBy.includes(user.uid);
  
        const storyElement = document.createElement("div");
        storyElement.innerHTML = `
          <h2>${storyData.decade}</h2>
          <h2>${storyData.title}</h2>
          <p>${storyData.content}</p>
          <p>Author: ${storyData.author || "Unknown"}</p>
          <p class="like-counter">Like Count: ${storyData.likeCounter}</p>
          <button class="like-button" data-story-id="${storyDoc.id}">
            ${isLikedByUser ? "Unlike" : "Like"}
          </button>
        `;
        storiesContainer.appendChild(storyElement);
      });
  
      // Add event listeners for like buttons
      const likeButtons = document.querySelectorAll(".like-button");
      likeButtons.forEach((likeButton) => {
        likeButton.addEventListener("click", async (event) => {
          const storyId = event.target.getAttribute("data-story-id");
          await handleLikeButton(storyId);
        });
      });
    } catch (error) {
      console.error("Error retrieving stories:", error);
      alert("Failed to retrieve stories. Please try again.");
    }
  };
  
  // handle like button
  const handleLikeButton = async (storyId) => {
    const storyRef = doc(firebaseDB, "stories", storyId);

    try {
      const storySnapshot = await getDoc(storyRef);
      const storyData = storySnapshot.data();
      const user = firebaseAuth.currentUser;
  
      if (user && storyData.likedBy && storyData.likedBy.includes(user.uid)) {
        // User has already liked the story, perform unlike action
        await updateDoc(storyRef, {
          likeCounter: storyData.likeCounter - 1,
          likedBy: arrayRemove(user.uid)
        });
        alert("Unliked the story!");
      } else {
        // User has not liked the story, perform like action
        await updateDoc(storyRef, {
          likeCounter: storyData.likeCounter + 1,
          likedBy: arrayUnion(user.uid)
        });
        alert("Liked the story!");
      }
    } catch (error) {
      console.error("Error updating like counter:", error);
      alert("Failed to update like counter. Please try again.");
    }
  };
  