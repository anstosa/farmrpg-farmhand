export const showPopup = (title: string, description: string): Promise<void> =>
  new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.classList.add("modal-overlay-visible");
    document.body.append(overlay);

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("modal-in");
    modal.style.display = "block";
    modal.style.marginTop = "-62px";
    modal.innerHTML = `
    <div class="modal-inner">
      <div class="modal-title">${title}</div>
      <div class="modal-text">${description}</div>
    </div>
    <div class="modal-buttons modal-buttons-1">
      <span class="modal-button modal-button-bold">OK</span>
    </div>
  `;
    const okButton = modal.querySelector(".modal-button");
    okButton?.addEventListener("click", () => {
      overlay?.classList.remove("modal-overlay-visible");
      modal.remove();
      resolve();
    });
    document.body.append(modal);
  });
