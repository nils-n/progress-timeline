export const generateUniqueID = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

export function renderStoryDiv(doc) {
  return `
  <div class="home-testimonial">
    <svg viewBox="0 0 1024 1024" class="home-icon08">
      <path
        d="M225 448c123.712 0 224 100.29 224 224 0 123.712-100.288 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.634 11.636-22.252 24.016-31.83 37.020 11.438-1.8 23.16-2.746 35.104-2.746zM801 448c123.71 0 224 100.29 224 224 0 123.712-100.29 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.636 11.636-22.254 24.016-31.832 37.020 11.44-1.8 23.16-2.746 35.106-2.746z"
      ></path>
    </svg>
    <span class="home-text09">
      ${doc.content}
    </span>
    <div class="home-like-container">
      <div class="home-container13">
        <span id="your-stories-like-count" class="home-text10">
          <span class="home-text11">15</span>
          <span></span>
          <br />
        </span>
        <span class="home-text14">Likes</span>
      </div>
      <div class="home-container14">
        <button
          id="your-stories-like-btn"
          type="button"
          class="home-button5 button"
        >
          Like
        </button>
      </div>
    </div>
  </div>
  <div class="home-container15">
    <div class="home-container16">
      <img
        alt="profile"
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDE0fHxwb3J0cmFpdHxlbnwwfHx8fDE2MjYzNzg5NzI&amp;ixlib=rb-1.2.1&amp;w=200"
        id="your-user-image"
        class="home-image3"
      />
      <span id="your-stories-username" class="home-text15">
      ${doc.author}
      </span>
    </div>
  </div>`;
}
