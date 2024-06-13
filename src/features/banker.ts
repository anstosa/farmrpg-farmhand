import { depositSilver, withdrawSilver } from "~/utils/farmrpgApi";
import { Feature, FeatureSetting } from "./feature";
import {
  getCardByTitle,
  getCurrentPage,
  getListByTitle,
  Page,
} from "~/utils/page";
import { showConfirmation } from "~/utils/confirmation";
import { showPopup } from "~/utils/popup";
import { TEXT_SUCCESS, TEXT_WARNING } from "~/utils/theme";

export const SETTING_BANKER: FeatureSetting = {
  id: "banker",
  title: "Banker",
  description: `
    * Automatically calculates your target balance (minimum balance required to maximize your daily interest)<br>
    * Adds an option *Deposit Target Balance* which deposits up to your target balance<br>
    * Adds an option to *Withdraw Interest* which withdraws any earnings on top of your target balance
  `,
  type: "boolean",
  defaultValue: true,
};

export const banker: Feature = {
  settings: [SETTING_BANKER],
  onPageChange: (settings, page) => {
    // make sure the banker is enabled
    if (!settings[SETTING_BANKER.id].value) {
      return;
    }

    // make sure we are on the bank page
    if (page !== Page.BANK) {
      return;
    }

    // make sure page content has loaded
    const currentPage = getCurrentPage();
    if (!currentPage) {
      return;
    }

    // get parameters
    const aboutCard = getCardByTitle("About the bank");
    if (!aboutCard) {
      console.error("About card not found");
      return;
    }
    const parameters = aboutCard.querySelectorAll("strong");
    const interestRate =
      Number(parameters[0].textContent?.replaceAll("%", "")) / 100;
    const maxInterest = Number(parameters[1].textContent?.replaceAll(",", ""));
    const balanceCard = aboutCard.nextElementSibling;
    if (!balanceCard) {
      console.error("balance card not found");
      return;
    }
    const balanceParameters = balanceCard.querySelectorAll("strong");
    const balance = Number(
      balanceParameters[0].textContent
        ?.replaceAll(",", "")
        .replaceAll(" Silver", "")
    );

    const formatter = new Intl.NumberFormat();

    // calculate target balance
    const targetBalance = Math.ceil(maxInterest / interestRate);
    const targetBalanceDiv = document.createElement("div");
    targetBalanceDiv.classList.add("card-content-inner");
    targetBalanceDiv.innerHTML = `
      Target Balance: <strong style="color: ${
        targetBalance === balance ? TEXT_SUCCESS : TEXT_WARNING
      }">${formatter.format(targetBalance)} Silver</strong>
    `;
    balanceCard.firstElementChild?.append(targetBalanceDiv);

    const availableInterest = Math.max(0, balance - targetBalance);

    console.debug(interestRate, maxInterest, balance);

    // use title to find the bulk options section
    const bulkOptionsList = getListByTitle("Bulk Options");
    if (!bulkOptionsList) {
      console.error("Bulk Options list not found");
      return;
    }

    // deposit target balance button
    const missingFromTarget = Math.max(0, targetBalance - balance);
    const depositTargetLi = document.createElement("li");
    depositTargetLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel"
      >
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title">
              <i class="fa fa-fw fa-arrow-right"></i>
              Deposit Target Balance
            </div>
            <div class="item-after">${formatter.format(
              missingFromTarget
            )} Silver</div>
          </div>
        </div>
      </a>
    `;
    depositTargetLi.addEventListener("click", (event) => {
      event.preventDefault();
      if (missingFromTarget === 0) {
        return;
      }
      showConfirmation(
        `Deposit ${formatter.format(missingFromTarget)} Silver?`,
        async () => {
          await depositSilver(missingFromTarget);
          await showPopup("Success!", "You deposited Silver!");
          window.location.reload();
        }
      );
    });
    bulkOptionsList.insertBefore(
      depositTargetLi,
      // eslint-disable-next-line unicorn/prefer-at
      bulkOptionsList.children[bulkOptionsList.children.length - 1]
    );

    // withdraw interest button
    const withdrawInterestLi = document.createElement("li");
    withdrawInterestLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel"
      >
        <div class="item-content">
          <div class="item-inner">
            <div class="item-title">
              <i class="fa fa-fw fa-arrow-left"></i>
              Withdraw Interest
            </div>
            <div class="item-after">${formatter.format(
              availableInterest
            )} Silver</div>
          </div>
        </div>
      </a>
    `;
    withdrawInterestLi.addEventListener("click", (event) => {
      event.preventDefault();
      if (availableInterest === 0) {
        return;
      }
      showConfirmation(
        `Withdraw ${formatter.format(availableInterest)} Silver?`,
        async () => {
          await withdrawSilver(availableInterest);
          await showPopup("Success!", "You withdrew Silver!");
          window.location.reload();
        }
      );
    });
    bulkOptionsList.insertBefore(
      withdrawInterestLi,
      // eslint-disable-next-line unicorn/prefer-at
      bulkOptionsList.children[bulkOptionsList.children.length - 1]
    );
  },
};
