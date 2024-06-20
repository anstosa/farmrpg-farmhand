export interface Popup {
  title: string;
  contentHTML: string;
  align?: "left" | "center" | "right";
  okText?: string;
}

export const showPopup = ({
  title,
  contentHTML,
  align,
  okText,
}: Popup): Promise<void> =>
  new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.classList.add("modal-overlay-visible");
    document.body.append(overlay);

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("modal-in");
    modal.style.display = "block";
    modal.style.width = "auto";
    modal.style.maxWidth = "75vw";
    modal.style.maxHeight = "75vh";
    modal.innerHTML = `
      <div
        class="modal-inner"
        style="
          text-align: ${align ?? "center"};
          display: flex;
          flex-direction: column;
          height: 100%;
        "
      >
        <div class="modal-title">${title}</div>
        <div
          class="modal-text"
          style="
            overflow-y: auto;
            flex: 1;
          "
        >${contentHTML}</div>
      </div>
      <div class="modal-buttons modal-buttons-1">
        <span class="modal-button modal-button-bold">${okText ?? "OK"}</span>
      </div>
    `;
    const okButton = modal.querySelector(".modal-button");
    okButton?.addEventListener("click", () => {
      overlay?.classList.remove("modal-overlay-visible");
      modal.remove();
      resolve();
    });
    document.body.append(modal);
    const offset = modal.getBoundingClientRect();
    modal.style.marginTop = `-${offset.height / 2}px`;
    modal.style.marginLeft = `-${offset.width / 2}px`;
  });
