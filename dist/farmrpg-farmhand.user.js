// ==UserScript==
// @name Farm RPG Farmhand
// @description Your helper around the RPG Farm
// @version 1.0.2
// @author Ansel Santosa <568242+anstosa@users.noreply.github.com>
// @match https://farmrpg.com/*
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.setClipboard
// @icon https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @license MIT
// @namespace https://github.com/anstosa/farmrpg-farmhand
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 92:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.banker = exports.SETTING_BANKER = void 0;
const api_1 = __webpack_require__(903);
const page_1 = __webpack_require__(952);
const confirmation_1 = __webpack_require__(906);
const popup_1 = __webpack_require__(469);
const theme_1 = __webpack_require__(178);
exports.SETTING_BANKER = {
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
exports.banker = {
    settings: [exports.SETTING_BANKER],
    onPageChange: (settings, page) => {
        var _a, _b, _c, _d;
        // make sure the banker is enabled
        if (!settings[exports.SETTING_BANKER.id].value) {
            return;
        }
        // make sure we are on the bank page
        if (page !== page_1.Page.BANK) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // get parameters
        const aboutCard = (0, page_1.getCardByTitle)("About the bank");
        if (!aboutCard) {
            console.error("About card not found");
            return;
        }
        const parameters = aboutCard.querySelectorAll("strong");
        const interestRate = Number((_a = parameters[0].textContent) === null || _a === void 0 ? void 0 : _a.replaceAll("%", "")) / 100;
        const maxInterest = Number((_b = parameters[1].textContent) === null || _b === void 0 ? void 0 : _b.replaceAll(",", ""));
        const balanceCard = aboutCard.nextElementSibling;
        if (!balanceCard) {
            console.error("balance card not found");
            return;
        }
        const balanceParameters = balanceCard.querySelectorAll("strong");
        const balance = Number((_c = balanceParameters[0].textContent) === null || _c === void 0 ? void 0 : _c.replaceAll(",", "").replaceAll(" Silver", ""));
        const formatter = new Intl.NumberFormat();
        // calculate target balance
        const targetBalance = Math.ceil(maxInterest / interestRate);
        const targetBalanceDiv = document.createElement("div");
        targetBalanceDiv.classList.add("card-content-inner");
        targetBalanceDiv.innerHTML = `
      Target Balance: <strong style="color: ${targetBalance === balance ? theme_1.TEXT_SUCCESS : theme_1.TEXT_WARNING}">${formatter.format(targetBalance)} Silver</strong>
    `;
        (_d = balanceCard.firstElementChild) === null || _d === void 0 ? void 0 : _d.append(targetBalanceDiv);
        const availableInterest = Math.max(0, balance - targetBalance);
        console.debug(interestRate, maxInterest, balance);
        // use title to find the bulk options section
        const bulkOptionsList = (0, page_1.getListByTitle)("Bulk Options");
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
            <div class="item-after">${formatter.format(missingFromTarget)} Silver</div>
          </div>
        </div>
      </a>
    `;
        depositTargetLi.addEventListener("click", (event) => {
            event.preventDefault();
            if (missingFromTarget === 0) {
                return;
            }
            (0, confirmation_1.showConfirmation)(`Deposit ${formatter.format(missingFromTarget)} Silver?`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, api_1.depositSilver)(missingFromTarget);
                yield (0, popup_1.showPopup)("Success!", "You deposited Silver!");
                window.location.reload();
            }));
        });
        bulkOptionsList.insertBefore(depositTargetLi, 
        // eslint-disable-next-line unicorn/prefer-at
        bulkOptionsList.children[bulkOptionsList.children.length - 1]);
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
            <div class="item-after">${formatter.format(availableInterest)} Silver</div>
          </div>
        </div>
      </a>
    `;
        withdrawInterestLi.addEventListener("click", (event) => {
            event.preventDefault();
            if (availableInterest === 0) {
                return;
            }
            (0, confirmation_1.showConfirmation)(`Withdraw ${formatter.format(availableInterest)} Silver?`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, api_1.withdrawSilver)(availableInterest);
                yield (0, popup_1.showPopup)("Success!", "You withdrew Silver!");
                window.location.reload();
            }));
        });
        bulkOptionsList.insertBefore(withdrawInterestLi, 
        // eslint-disable-next-line unicorn/prefer-at
        bulkOptionsList.children[bulkOptionsList.children.length - 1]);
    },
};


/***/ }),

/***/ 273:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buddyFarm = exports.SETTING_BUDDY_FARM = void 0;
const page_1 = __webpack_require__(952);
exports.SETTING_BUDDY_FARM = {
    id: "buddyFarm",
    title: "Buddy's Almanac",
    description: "Add shortcut to look up items on buddy.farm",
    type: "boolean",
    defaultValue: true,
};
exports.buddyFarm = {
    settings: [exports.SETTING_BUDDY_FARM],
    onPageChange: (settings, page) => {
        var _a;
        // make sure setting is enabled
        if (!settings[exports.SETTING_BUDDY_FARM.id].value) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // make sure we are on an item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        // find header to get item data
        const itemHeader = document.querySelector(".sharelink");
        if (!itemHeader) {
            console.error("Item header not found");
            return;
        }
        // get name and link for item
        const itemName = (_a = itemHeader.textContent) !== null && _a !== void 0 ? _a : "";
        const itemLink = `https://buddy.farm/i/${itemName
            .toLowerCase()
            .replaceAll(/[\s']/g, "-")}`;
        // use title to find item details section
        const titles = currentPage.querySelectorAll(".content-block-title");
        const itemDetailsTitle = [...titles].find((title) => title.textContent === "Item Details");
        const itemDetailsCard = itemDetailsTitle === null || itemDetailsTitle === void 0 ? void 0 : itemDetailsTitle.nextElementSibling;
        const itemDetailsList = itemDetailsCard === null || itemDetailsCard === void 0 ? void 0 : itemDetailsCard.querySelector("ul");
        if (!itemDetailsList) {
            console.error("Item Details list not found");
            return;
        }
        // create a new item detail for buddy.farm link
        const buddyFarmLinkLi = document.createElement("li");
        buddyFarmLinkLi.classList.add("close-panel");
        buddyFarmLinkLi.innerHTML = `
      <div class="item-content">
        <div class="item-media">
          <a
            href="https://buddy.farm"
            onclick="window.open('https://buddy.farm', '_blank');return false;"
          >
            <img src="https://buddy.farm/icons/icon-256x256.png" class="itemimg">
          </a>
        </div>
        <div class="item-inner">
          <div class="item-title">
            Buddy's Almanac
            <br><span style="font-size: 11px">Lookup item on buddy.farm</span>
          </div>
          <div class="item-after">
            <a
              href="${itemLink}"
              onclick="window.open('${itemLink}', '_blank');return false;"
              class="button btngreen"
              style="height:28px"
            >OPEN</a>
          </div>
        </div>
      </div>
    `;
        // insert at top
        itemDetailsList.insertBefore(buddyFarmLinkLi, itemDetailsList.firstChild);
    },
};


/***/ }),

/***/ 223:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compressChat = exports.SETTING_CHAT_COMPRESS = void 0;
exports.SETTING_CHAT_COMPRESS = {
    id: "compressChat",
    title: "Compress chat",
    description: "Compress chat messages to make more visible at once",
    type: "boolean",
    defaultValue: true,
};
exports.compressChat = {
    settings: [exports.SETTING_CHAT_COMPRESS],
    onInitialize: (settings) => {
        // move spacing from panel margin to message padding regardless of setting
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        #mobilechatpanel .content-block,
        #desktopchatpanel .content-block {
          padding: 0 !important;
        }
        #mobilechatpanel .card,
        #desktopchatpanel .card {
          margin: 0 !important;
        }
        .chat-txt {
          margin: 0 !important;
          padding: 8px !important
        }
      <style>
    `);
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_COMPRESS.id].value) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* Reduce chat spacing */
        .chat-txt {
          margin: 0 !important;
          padding: 4px !important
        }

        /* Hide timestamp */
        .chat-txt span:first-of-type,
        .chat-txt br:first-of-type {
          display: none !important;
        }
      <style>
    `);
    },
};


/***/ }),

/***/ 827:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compressNavigation = exports.SETTING_NAVIGATION_HIDE_LOGO = exports.SETTING_NAVIGATION_COMPRESS = void 0;
exports.SETTING_NAVIGATION_COMPRESS = {
    id: "compressNav",
    title: "Compress Navigation",
    description: `Reduces whitespace in navigation to make space for more items`,
    type: "boolean",
    defaultValue: false,
};
exports.SETTING_NAVIGATION_HIDE_LOGO = {
    id: "noLogoNav",
    title: "Hide Navigation Logo",
    description: `Hides Farm RPG logo in Navigation`,
    type: "boolean",
    defaultValue: true,
};
exports.compressNavigation = {
    settings: [exports.SETTING_NAVIGATION_COMPRESS, exports.SETTING_NAVIGATION_HIDE_LOGO],
    onInitialize: (settings) => {
        if (settings[exports.SETTING_NAVIGATION_COMPRESS.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Reduce nav item spacing */
            .panel-left .item-inner {
              padding-top: 4px !important;
              padding-bottom: 4px !important;
            }
            .panel-left .item-content,
            .panel-left .item-inner {
              min-height: 0 !important;
            }
          <style>
        `);
        }
        if (settings[exports.SETTING_NAVIGATION_HIDE_LOGO.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide nav logo */
            .panel-left .page-content div[align="center"] {
              display: none !important;
            }
            
            /* Hide extra padding */
            .panel-left .page,
            .panel-left .page-content {
              padding-bottom: 0 !important;
            }
          <style>
        `);
        }
    },
};


/***/ }),

/***/ 224:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.customNavigation = exports.SETTING_CUSTOM_NAVIGATION = void 0;
const theme_1 = __webpack_require__(178);
const farmhandSettings_1 = __webpack_require__(973);
const confirmation_1 = __webpack_require__(906);
exports.SETTING_CUSTOM_NAVIGATION = {
    id: "customNav",
    title: "Customize Navigation",
    description: `
    Enables customization of the Navigation menu<br>
    (click the gear in the navigation menu to configure)
  `,
    type: "boolean",
    defaultValue: true,
    dataKey: "customNav_data",
};
const state = {
    isEditing: false,
};
const DEFAULT_NAVIGATION = [
    { icon: "home", text: "Home", path: "index.php" },
    { icon: "user", text: "My Profile", path: "profile.php" },
    { icon: "list", text: "My Inventory", path: "inventory.php" },
    { icon: "wrench", text: "My Workshop", path: "workshop.php" },
    { icon: "spoon", text: "My Kitchen", path: "kitchen.php" },
    { icon: "inbox", text: "My Mailbox", path: "postoffice.php" },
    { icon: "envelope", text: "My Messages", path: "messages.php" },
    { icon: "users", text: "My Friends", path: "friends.php" },
    { icon: "gear", text: "My Settings", path: "settings.php" },
    { icon: "building", text: "Town", path: "town.php" },
    { icon: "book", text: "Library", path: "wiki.php" },
    { icon: "info-circle", text: "About / Updates", path: "about.php" },
    { icon: "close", text: "Logout", path: "logout.php" },
];
const icons = (() => {
    const stylesheet = [...document.styleSheets].find(({ href }) => href === null || href === void 0 ? void 0 : href.includes("fontawesome"));
    const icons = [];
    if (!stylesheet) {
        console.error("Could not find fontawesome stylesheet");
        return icons;
    }
    for (const rule of stylesheet.cssRules) {
        if (!(rule instanceof CSSStyleRule)) {
            continue;
        }
        if (rule.style.length !== 1) {
            continue;
        }
        if (!rule.style.content) {
            continue;
        }
        const selector = rule.selectorText;
        const aliases = selector.split(", ");
        icons.push(aliases[0].slice(4, -8));
    }
    return icons.sort();
})();
const renderNavigation = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const navigationData = yield (0, farmhandSettings_1.getData)(exports.SETTING_CUSTOM_NAVIGATION, DEFAULT_NAVIGATION);
    const navigationList = document.querySelector(".panel-left ul");
    if (!navigationList) {
        console.error("Could not find navigation list");
        return;
    }
    const navigationTitleLeft = document.querySelector(".panel-left .navbar .left");
    if (!navigationTitleLeft) {
        console.error("Could not find navigation title");
        return;
    }
    navigationTitleLeft.innerHTML = "";
    if (state.isEditing) {
        const resetButton = document.createElement("i");
        resetButton.style.cursor = "pointer";
        resetButton.classList.add("fa");
        resetButton.classList.add("fa-fw");
        resetButton.classList.add("fa-arrow-left-rotate");
        resetButton.addEventListener("click", () => {
            (0, confirmation_1.showConfirmation)("Reset Navigation?", () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, DEFAULT_NAVIGATION);
                state.isEditing = false;
                renderNavigation();
            }));
        });
        navigationTitleLeft.append(resetButton);
    }
    navigationList.innerHTML = "";
    for (const item of navigationData) {
        const currentIndex = navigationData.indexOf(item);
        const navigationItem = document.createElement("li");
        navigationItem.innerHTML = `
      <a
        href="${item.path}"
        data-view=".view-main"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-${item.icon}"></i>
              <span class="fh-item">${item.text}</span>
            </div>
            ${state.isEditing
            ? `
                  <div>
                    <i class="fa fa-fw ${state.editingIndex === currentIndex
                ? "fa-check"
                : "fa-pencil"} fh-edit"></i>
                    <i class="fa fa-fw fa-trash fh-delete"></i>
                  </div>
                `
            : '<i class="fa fa-fw fa-chevron-right"></i>'}
          </div>
          ${state.isEditing && state.editingIndex === currentIndex
            ? `
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-text"
                    value="${item.text}"
                    style="
                      flex: 1;
                      border: 1px solid ${theme_1.BORDER_GRAY};
                      margin-left: 20px;
                      margin-right: 10px;
                      height: 30px;
                      padding: 10px;
                    "
                  >
                  <i class="fa fa-fw fa-arrow-down fh-down"></i>
                  <i class="fa fa-fw fa-arrow-up fh-up"></i>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-right: 15px;
                  "
                >
                  <input
                    type="text"
                    class="fh-path"
                    value="${item.path}"
                    style="
                      flex: 1;
                      border: 1px solid ${theme_1.BORDER_GRAY};
                      margin-left: 20px;
                      height: 30px;
                      padding: 10px;
                      font-family: monospace;
                    "
                  >
                </div>
                <div
                  style="
                    display: flex;
                    gap: 4px;
                    margin-top: 10px;
                    height: 200px;
                    width: 100%;
                    overflow-y: scroll;
                    flex-wrap: wrap;
                  "
                  class="fh-icons"
                >
                  ${icons
                .map((icon) => `
                        <i
                          class="fa fa-fw fa-${icon}"
                          data-icon="${icon}"
                        ></i>
                      `)
                .join("")}
                </div>
              `
            : ""}
        </div>
      </a>
    `;
        (_a = navigationItem
            .querySelector(".fh-icons")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _l;
            event.preventDefault();
            event.stopPropagation();
            if (!event.target) {
                return;
            }
            item.icon = (_l = event.target.dataset.icon) !== null && _l !== void 0 ? _l : "";
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        (_b = navigationItem
            .querySelector(".fh-text")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        (_c = navigationItem
            .querySelector(".fh-text")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            item.text = event.target.value;
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        (_d = navigationItem
            .querySelector(".fh-text")) === null || _d === void 0 ? void 0 : _d.addEventListener("keyup", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const itemText = navigationItem.querySelector(".fh-item");
            if (!itemText) {
                return;
            }
            itemText.textContent = event.target.value;
        });
        (_e = navigationItem
            .querySelector(".fh-path")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        (_f = navigationItem
            .querySelector(".fh-path")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            item.path = event.target.value;
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        (_g = navigationItem
            .querySelector(".fh-up")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (currentIndex === 0) {
                return;
            }
            navigationData.splice(currentIndex, 1);
            navigationData.splice(currentIndex - 1, 0, item);
            state.editingIndex = currentIndex - 1;
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        (_h = navigationItem
            .querySelector(".fh-down")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            if (currentIndex === navigationData.length - 1) {
                return;
            }
            navigationData.splice(currentIndex, 1);
            navigationData.splice(currentIndex + 1, 0, item);
            state.editingIndex = currentIndex + 1;
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        (_j = navigationItem
            .querySelector(".fh-edit")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (state.editingIndex === currentIndex) {
                delete state.editingIndex;
            }
            else {
                state.editingIndex = currentIndex;
            }
            renderNavigation();
        });
        (_k = navigationItem
            .querySelector(".fh-delete")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            navigationData.splice(currentIndex, 1);
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation();
        }));
        navigationList.append(navigationItem);
    }
    if (state.isEditing) {
        const addNavigationItem = document.createElement("li");
        addNavigationItem.innerHTML = `
      <a
        href="#"
        class="item-link close-panel"
      >
        <div
          class="item-content"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
          "
        >
          <div
            class="item-inner"
            style="
              background-image: none;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              width: 100%;
            "
          >
            <div class="item-title">
              <i class="fa fa-fw fa-plus"></i>
              <span class="fh-item">Add Navigation Item</span>
            </div>
          </div>
        </div>
      </a>
    `;
        addNavigationItem.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            navigationData.push({
                icon: "sack-dollar",
                text: "Tip anstosa",
                path: "profile.php?user_name=anstosa",
            });
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            state.editingIndex = navigationData.length - 1;
            renderNavigation();
        }));
        navigationList.append(addNavigationItem);
    }
});
exports.customNavigation = {
    settings: [exports.SETTING_CUSTOM_NAVIGATION],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_CUSTOM_NAVIGATION.id].value) {
            return;
        }
        // add configuration icon
        const navigationTitleRight = document.querySelector(".panel-left .navbar .right");
        if (!navigationTitleRight) {
            console.error("Could not find navigation title");
            return;
        }
        const configurationButton = document.createElement("i");
        configurationButton.style.cursor = "pointer";
        configurationButton.classList.add("fa");
        configurationButton.classList.add("fa-fw");
        configurationButton.classList.add("fa-cog");
        configurationButton.addEventListener("click", () => {
            state.isEditing = !state.isEditing;
            if (state.isEditing) {
                configurationButton.classList.remove("fa-cog");
                configurationButton.classList.add("fa-check");
            }
            else {
                configurationButton.classList.remove("fa-check");
                configurationButton.classList.add("fa-cog");
            }
            renderNavigation();
        });
        navigationTitleRight.append(configurationButton);
        renderNavigation();
    },
};


/***/ }),

/***/ 164:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dismissableChatBanners = exports.SETTING_CHAT_DISMISSABLE_BANNERS = void 0;
exports.SETTING_CHAT_DISMISSABLE_BANNERS = {
    id: "dismissableChatBanners",
    title: "Dismissable Chat Banners",
    description: `
    Adds × in chat banners to dismiss them<br>
    Disable this to show dismissed banners again
  `,
    type: "boolean",
    defaultValue: true,
};
// https://stackoverflow.com/a/7616484/714282
const hashBanner = (banner) => {
    var _a, _b;
    const string = (_a = banner.textContent) !== null && _a !== void 0 ? _a : "";
    let hash = 0;
    if (string.length === 0) {
        return hash;
    }
    for (let index = 0; index < string.length; index++) {
        const code = (_b = string.codePointAt(index)) !== null && _b !== void 0 ? _b : 0;
        hash = (hash << 5) - hash + code;
        hash = Math.trunc(hash);
    }
    return hash;
};
exports.dismissableChatBanners = {
    settings: [exports.SETTING_CHAT_DISMISSABLE_BANNERS],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_DISMISSABLE_BANNERS.id].value) {
            return;
        }
        const chatWatcher = new MutationObserver(() => __awaiter(void 0, void 0, void 0, function* () {
            const banners = document.querySelectorAll("#desktopchatpanel .card, #mobilechatpanel .card");
            for (const banner of banners) {
                const bannerKey = `${exports.SETTING_CHAT_DISMISSABLE_BANNERS.id}_${hashBanner(banner)}`;
                // hide banner if dismissed
                const isDismissed = yield GM.getValue(bannerKey, false);
                if (isDismissed) {
                    banner.remove();
                    continue;
                }
                // skip adding close button if it already exists
                if (banner.querySelector(".fh-close")) {
                    continue;
                }
                // add close button
                const closeButton = document.createElement("div");
                closeButton.classList.add("fh-close");
                closeButton.textContent = "×";
                closeButton.style.position = "absolute";
                closeButton.style.top = "2px";
                closeButton.style.right = "2px";
                closeButton.style.cursor = "pointer";
                closeButton.addEventListener("click", () => {
                    banner.remove();
                    GM.setValue(bannerKey, true);
                });
                banner.append(closeButton);
            }
        }));
        const mobileChat = document.querySelector("#mobilechatpanel");
        if (!mobileChat) {
            console.error("Could not find mobile panel");
            return;
        }
        const desktopChat = document.querySelector("#desktopchatpanel");
        if (!desktopChat) {
            console.error("Could not find desktop panel");
            return;
        }
        chatWatcher.observe(mobileChat, { childList: true, subtree: true });
        chatWatcher.observe(desktopChat, { childList: true, subtree: true });
    },
};


/***/ }),

/***/ 973:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.farmhandSettings = exports.SETTING_IMPORT = exports.SETTING_EXPORT = exports.setSetting = exports.setData = exports.getData = exports.getSetting = exports.getSettings = void 0;
const page_1 = __webpack_require__(952);
const popup_1 = __webpack_require__(469);
const getSettings = (features) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const settings = {};
    for (const feature of features) {
        for (const setting of (_a = feature.settings) !== null && _a !== void 0 ? _a : []) {
            setting.value = (yield GM.getValue(setting.id, setting.defaultValue));
            settings[setting.id] = setting;
        }
    }
    return settings;
});
exports.getSettings = getSettings;
const getSetting = (setting) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, setting), { value: (yield GM.getValue(setting.id, setting.defaultValue)) }));
});
exports.getSetting = getSetting;
const getData = (setting, defaultValue) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!setting.dataKey) {
        return defaultValue;
    }
    return ((_b = JSON.parse(yield GM.getValue(setting.dataKey, ""))) !== null && _b !== void 0 ? _b : defaultValue);
});
exports.getData = getData;
const setData = (setting, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!setting.dataKey) {
        return;
    }
    yield GM.setValue(setting.dataKey, JSON.stringify(data));
});
exports.setData = setData;
const setSetting = (setting) => { var _a; return GM.setValue(setting.id, (_a = setting.value) !== null && _a !== void 0 ? _a : ""); };
exports.setSetting = setSetting;
const getWrapper = ({ id, type, value }, children) => {
    switch (type) {
        case "boolean": {
            return `
        <div
          class="item-inner"
          role="checkbox"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-checked="${value ? "true" : "false"}"
        >
          ${children}
        </div>
      `;
        }
        case "number": {
            return `
        <div
          class="item-inner"
          role="spinbutton"
          id="${id}-aria"
          aria-labelledby="${id}"
          aria-valuenow="${value}"
        >
          ${children}
        </div>
      `;
        }
        case "string": {
            return `
        <div
          class="item-inner"
          role="textbox"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
        }
        default: {
            return `
        <div
          class="item-inner"
          id="${id}-aria"
          aria-labelledby="${id}"
        >
          ${children}
        </div>
      `;
        }
    }
};
const getField = (setting, children) => {
    var _a;
    switch (setting.type) {
        case "boolean": {
            return `
        <label class="label-switch">
          <input
            type="checkbox"
            class="settings_checkbox"
            id="${setting.id}"
            name="${setting.id}"
            value="${setting.value ? 1 : 0}"
            ${setting.value ? 'checked=""' : ""}"
          >
          <div class="checkbox"></div>
          ${children}
        </label>
      `;
        }
        case "string":
        case "number": {
            return `
        <div class="item-after">
          <input
            type="text"
            name="${setting.id}"
            placeholder="${(_a = setting.placeholder) !== null && _a !== void 0 ? _a : ""}"
            value="${setting.value}"
            class="inlineinputsm fh-input"
            style="
              width: 100px !important;
            "
          >
          ${children}
        </div>
      `;
        }
        default: {
            return "";
        }
    }
};
const getValue = ({ id, type }, currentPage) => {
    const input = currentPage.querySelector(`[name=${id}]`);
    switch (type) {
        case "boolean": {
            const wrapper = currentPage.querySelector(`[id=${id}-aria]`);
            return wrapper.getAttribute("aria-checked") === "true";
        }
        case "number": {
            return Number(input.value);
        }
        case "string": {
            return input.value;
        }
        default: {
            return input.value;
        }
    }
};
exports.SETTING_EXPORT = {
    id: "export",
    title: "Export",
    description: "Exports Farmhand Settings to sync to other device",
    type: "string",
    defaultValue: "",
    buttonText: "Export",
    buttonAction: (settings, settingWrapper) => __awaiter(void 0, void 0, void 0, function* () {
        const exportedSettings = Object.values(settings);
        for (const setting of exportedSettings) {
            setting.data = yield (0, exports.getData)(setting, "");
        }
        const exportString = JSON.stringify(exportedSettings);
        GM.setClipboard(exportString);
        (0, popup_1.showPopup)("Settings Exported to clipboard", "Open Farm RPG on another device with Farmhand installed to import");
        const input = settingWrapper.querySelector(".fh-input");
        if (input) {
            input.value = exportString;
        }
    }),
};
exports.SETTING_IMPORT = {
    id: "import",
    title: "Import",
    description: "Paste export into box and click Import",
    type: "string",
    defaultValue: "",
    placeholder: "Paste Here",
    buttonText: "Import",
    buttonAction: (settings, settingWrapper) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const input = (_c = settingWrapper.querySelector(".fh-input")) === null || _c === void 0 ? void 0 : _c.value;
        const importedSettings = JSON.parse(input !== null && input !== void 0 ? input : "[]");
        for (const setting of importedSettings) {
            yield (0, exports.setSetting)(setting);
            if (setting.data) {
                yield (0, exports.setData)(setting, setting.data);
            }
        }
        yield (0, popup_1.showPopup)("Farmhand Settings Imported!", "Page will reload to apply");
        window.location.reload();
    }),
};
exports.farmhandSettings = {
    settings: [exports.SETTING_EXPORT, exports.SETTING_IMPORT],
    onPageChange: (settings, page) => {
        var _a;
        // make sure we are on the settings page
        if (page !== page_1.Page.SETTINGS_OPTIONS) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // insert at end of first card
        const settingsList = currentPage.querySelector("#settingsform_options ul");
        if (!settingsList) {
            console.error("Settings list not found");
            return;
        }
        // add section
        const farmhandSettingsLi = document.createElement("li");
        farmhandSettingsLi.classList.add("list-group-title");
        farmhandSettingsLi.classList.add("item-divider");
        farmhandSettingsLi.textContent = "Farmhand Settings";
        settingsList.append(farmhandSettingsLi);
        // add settings
        for (const setting of Object.values(settings)) {
            const hasButton = setting.buttonText && setting.buttonAction;
            const settingLi = document.createElement("li");
            settingLi.innerHTML = `
        <div
          class="item-content"
          style="
            display: flex;
            gap: 15px;
            justify-content: space-between;
          "
        >
          ${getWrapper(setting, `
            <div
              class="item-title label"
              style="
                flex: 1;
                white-space: normal;
              "
            >
              <label
                id="${setting.id}"
                for="${setting.id}">
                  ${setting.title}
              </label>
              <br>
              <div style="font-size: 11px">${setting.description}</div>
            </div>
            ${getField(setting, hasButton
                ? `
                  <button
                    class="button btngreen fh-action"
                    style="margin-left: 8px"
                  >${setting.buttonText}</button>
                `
                : "")}
            `)}
      </div>
      `;
            (_a = settingLi.querySelector(".fh-action")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                var _a;
                (_a = setting.buttonAction) === null || _a === void 0 ? void 0 : _a.call(setting, settings, settingLi);
            });
            settingsList.append(settingLi);
        }
        // hook into save button
        const saveButton = currentPage.querySelector("#settings_options");
        if (!saveButton) {
            console.error("Save button not found");
            return;
        }
        saveButton.addEventListener("click", () => {
            for (const setting of Object.values(settings)) {
                setting.value = getValue(setting, currentPage);
                (0, exports.setSetting)(setting);
            }
            setTimeout(() => window.location.reload(), 1000);
        });
    },
};


/***/ }),

/***/ 454:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.highlightSelfInChat = exports.SETTING_CHAT_HIGHLIGHT_SELF = void 0;
const theme_1 = __webpack_require__(178);
exports.SETTING_CHAT_HIGHLIGHT_SELF = {
    id: "highlightSelfInChat",
    title: "Highlight self in chat",
    description: "Highlight messages in chat where you are @mentioned",
    type: "boolean",
    defaultValue: true,
};
exports.highlightSelfInChat = {
    settings: [exports.SETTING_CHAT_HIGHLIGHT_SELF],
    onInitialize: (settings) => {
        var _a;
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_HIGHLIGHT_SELF.id].value) {
            return;
        }
        const username = (_a = document.querySelector("#logged_in_username")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!username) {
            console.error("Could not find username");
            return;
        }
        const chatWatcher = new MutationObserver(() => {
            var _a;
            const tags = document.querySelectorAll(`span a[href='profile.php?user_name=${username}']`);
            for (const tag of tags) {
                tag.style.color = theme_1.TEXT_WARNING;
                const message = (_a = tag.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
                if (!message) {
                    console.error("Could not find message");
                    continue;
                }
                message.style.backgroundColor = theme_1.ALERT_YELLOW_BACKGROUND;
                message.style.border = `1px solid ${theme_1.ALERT_YELLOW_BORDER}`;
            }
        });
        const mobileChat = document.querySelector("#mobilechatpanel");
        if (!mobileChat) {
            console.error("Could not find mobile panel");
            return;
        }
        const desktopChat = document.querySelector("#desktopchatpanel");
        if (!desktopChat) {
            console.error("Could not find desktop panel");
            return;
        }
        chatWatcher.observe(mobileChat, { childList: true, subtree: true });
        chatWatcher.observe(desktopChat, { childList: true, subtree: true });
    },
};


/***/ }),

/***/ 217:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const banker_1 = __webpack_require__(92);
const buddyfarm_1 = __webpack_require__(273);
const compressChat_1 = __webpack_require__(223);
const compressNavigation_1 = __webpack_require__(827);
const customNavigation_1 = __webpack_require__(224);
const dismissableChatBanners_1 = __webpack_require__(164);
const farmhandSettings_1 = __webpack_require__(973);
const page_1 = __webpack_require__(952);
const highlightSelfInChat_1 = __webpack_require__(454);
const FEATURES = [
    // almanac
    buddyfarm_1.buddyFarm,
    // bank
    banker_1.banker,
    // chat
    compressChat_1.compressChat,
    dismissableChatBanners_1.dismissableChatBanners,
    highlightSelfInChat_1.highlightSelfInChat,
    // nav
    compressNavigation_1.compressNavigation,
    customNavigation_1.customNavigation,
    // settings
    farmhandSettings_1.farmhandSettings,
];
const onPageChange = (page, parameters) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield (0, farmhandSettings_1.getSettings)(FEATURES);
    for (const { onPageChange } of FEATURES) {
        if (onPageChange) {
            onPageChange(settings, page, parameters);
        }
    }
});
// eslint-disable-next-line unicorn/prefer-top-level-await
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line unicorn/prefer-module
        "use strict";
        console.info("STARTING Farmhand by Ansel Santosa");
        // initialize
        const settings = yield (0, farmhandSettings_1.getSettings)(FEATURES);
        for (const { onInitialize } of FEATURES) {
            if (onInitialize) {
                onInitialize(settings);
            }
        }
        // listen for location changes
        let oldHref = document.location.href;
        const { body } = document;
        const observer = new MutationObserver(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                const [page, parameters] = (0, page_1.getPage)();
                console.debug("Page Change", page, parameters);
                onPageChange(page, parameters);
            }
        });
        observer.observe(body, { childList: true, subtree: true });
        // process first page
        setTimeout(() => onPageChange(...(0, page_1.getPage)()));
    });
})();


/***/ }),

/***/ 903:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.withdrawSilver = exports.depositSilver = exports.getStats = exports.sendRequest = void 0;
const sendRequest = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://farmrpg.com/worker.php?${query.toString()}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const htmlString = yield response.text();
    return new DOMParser().parseFromString(htmlString, "text/html");
});
exports.sendRequest = sendRequest;
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const response = yield (0, exports.sendRequest)(new URLSearchParams({ go: "getstats" }));
    const parameters = response.querySelectorAll("span");
    const silver = Number((_b = (_a = parameters[0].textContent) === null || _a === void 0 ? void 0 : _a.trim().replaceAll(",", "")) !== null && _b !== void 0 ? _b : "0");
    const gold = Number((_d = (_c = parameters[1].textContent) === null || _c === void 0 ? void 0 : _c.trim().replaceAll(",", "")) !== null && _d !== void 0 ? _d : "0");
    const ancientCoins = Number((_f = (_e = parameters[2].textContent) === null || _e === void 0 ? void 0 : _e.trim().replaceAll(",", "")) !== null && _f !== void 0 ? _f : "0");
    return { silver, gold, ancientCoins };
});
exports.getStats = getStats;
const depositSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(new URLSearchParams({ go: "depositsilver", amt: amount.toString() }));
});
exports.depositSilver = depositSilver;
const withdrawSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(new URLSearchParams({ go: "withdrawalsilver", amt: amount.toString() }));
});
exports.withdrawSilver = withdrawSilver;


/***/ }),

/***/ 906:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showConfirmation = void 0;
const showConfirmation = (message, onYes, onNo) => {
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
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        onYes();
    });
    const noButton = buttons[1];
    noButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        onNo === null || onNo === void 0 ? void 0 : onNo();
    });
    document.body.append(modal);
};
exports.showConfirmation = showConfirmation;


/***/ }),

/***/ 952:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getListByTitle = exports.getCardByTitle = exports.setTitle = exports.getCurrentPage = exports.getPreviousPage = exports.getPage = exports.Page = void 0;
var Page;
(function (Page) {
    Page["ITEM"] = "item";
    Page["BANK"] = "bank";
    Page["SETTINGS"] = "settings";
    Page["SETTINGS_OPTIONS"] = "settings_options";
})(Page || (exports.Page = Page = {}));
// get page and parameters if any
const getPage = () => {
    const match = window.location.hash.match(/#!\/(\w+).php\?{0,1}(.*)/);
    if (!match) {
        return [undefined, new URLSearchParams()];
    }
    const page = match[1];
    const parameters = new URLSearchParams(match[2]);
    return [page, parameters];
};
exports.getPage = getPage;
const getPreviousPage = () => document.querySelector(".page-on-left");
exports.getPreviousPage = getPreviousPage;
const getCurrentPage = () => document.querySelector(".page-on-center, .page-from-right-to-center");
exports.getCurrentPage = getCurrentPage;
const setTitle = (title) => {
    const nav = document.querySelector(".navbar-on-center");
    if (!nav) {
        console.error("Navbar not found");
        return;
    }
    const text = nav === null || nav === void 0 ? void 0 : nav.querySelector("center");
    if (!text) {
        console.error("Center text not found");
        return;
    }
    text.textContent = title;
};
exports.setTitle = setTitle;
const getCardByTitle = (searchTitle) => {
    const currentPage = (0, exports.getCurrentPage)();
    if (!currentPage) {
        console.error("Current page not found");
        return null;
    }
    const titles = currentPage.querySelectorAll(".content-block-title");
    const targetTitle = [...titles].find((title) => title.textContent === searchTitle);
    if (!targetTitle) {
        console.error(`${searchTitle} title not found`);
        return null;
    }
    return targetTitle.nextElementSibling;
};
exports.getCardByTitle = getCardByTitle;
const getListByTitle = (searchTitle) => {
    const targetCard = (0, exports.getCardByTitle)(searchTitle);
    if (!targetCard) {
        console.error(`${searchTitle} card not found`);
        return null;
    }
    return targetCard.querySelector("ul");
};
exports.getListByTitle = getListByTitle;


/***/ }),

/***/ 469:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showPopup = void 0;
const showPopup = (title, description) => new Promise((resolve) => {
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
    okButton === null || okButton === void 0 ? void 0 : okButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        resolve();
    });
    document.body.append(modal);
});
exports.showPopup = showPopup;


/***/ }),

/***/ 178:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BUTTON_BLUE_BORDER = exports.BUTTON_BLUE_BACKGROUND = exports.BUTTON_ORANGE_BORDER = exports.BUTTON_ORANGE_BACKGROUND = exports.BUTTON_GREEN_DARK_BORDER = exports.BUTTON_GREEN_DARK_BACKGROUND = exports.BUTTON_GREEN_BORDER = exports.BUTTON_GREEN_BACKGROUND = exports.BORDER_GRAY = exports.TEXT_SUCCESS = exports.TEXT_WARNING = exports.TEXT_ERROR = exports.ALERT_YELLOW_BORDER = exports.ALERT_YELLOW_BACKGROUND = exports.LINK_RED = exports.LINK_GREEN = void 0;
// links
exports.LINK_GREEN = "#90EE90";
exports.LINK_RED = "#ED143D";
// alerts
exports.ALERT_YELLOW_BACKGROUND = "#351C04";
exports.ALERT_YELLOW_BORDER = "#41260D";
// text
exports.TEXT_ERROR = "#FF0000";
exports.TEXT_WARNING = "#FFA500";
exports.TEXT_SUCCESS = "#30D611";
// borders
exports.BORDER_GRAY = "#393939";
// buttons
exports.BUTTON_GREEN_BACKGROUND = "#003300";
exports.BUTTON_GREEN_BORDER = "#006600";
exports.BUTTON_GREEN_DARK_BACKGROUND = "#001900";
exports.BUTTON_GREEN_DARK_BORDER = "#003300";
exports.BUTTON_ORANGE_BACKGROUND = "#351C04";
exports.BUTTON_ORANGE_BORDER = "#41260D";
exports.BUTTON_BLUE_BACKGROUND = "#000040";
exports.BUTTON_BLUE_BORDER = "#00007F";


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(217);
/******/ 	
/******/ })()
;
//# sourceMappingURL=farmrpg-farmhand.user.js.map