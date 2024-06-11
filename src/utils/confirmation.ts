export const showConfirmation = (
  message: string,
  onYes: () => void,
  onNo?: () => void
): void => {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.classList.add("modal-overlay-visible");
  document.body.append(overlay);

  const modal = document.createElement("div");
  modal.classList.add("actions-modal");
  modal.classList.add("modal-in");
  modal.innerHTML = `
      <div class="actions-modal-group">
        <div class="actions-modal-label">${message}</div>
        <div class="actions-modal-button">Yes</div>
        <div class="actions-modal-button color-red">Cancel</div>
      </div>
    `;
  const buttons = modal.querySelectorAll(".actions-modal-button");
  const yesButton = buttons[0];
  yesButton.addEventListener("click", () => {
    overlay?.classList.remove("modal-overlay-visible");
    modal.remove();
    onYes();
  });
  const noButton = buttons[1];
  noButton.addEventListener("click", () => {
    overlay?.classList.remove("modal-overlay-visible");
    modal.remove();
    onNo?.();
  });
  document.body.append(modal);
};
