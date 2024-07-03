import { Feature } from "~/features/feature";

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
    let overlay = document.querySelector(".modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.classList.add("modal-overlay");
      document.body.append(overlay);
    }
    overlay.classList.add("modal-overlay-visible");

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

export const popups: Feature = {
  onInitialize: () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
        <style>
          /* hide duplicate modal overlays */
          .modal-overlay-visible ~ .modal-overlay-visible {
            opacity: 0;
          }
        <style>
      `
    );
    // click outside to close
    document.body.addEventListener("click", (event) => {
      if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
        document
          .querySelector<HTMLSpanElement>(".modal .modal-button")
          ?.click();
      }
    });
  },
};
