// ==UserScript==
// @name Farm RPG Farmhand
// @description Your helper around the RPG Farm
// @version 1.0.0
// @author Ansel Santosa <568242+anstosa@users.noreply.github.com>
// @match https://farmrpg.com/*
// @grant GM.getValue
// @grant GM.setValue
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
const theme_1 = __webpack_require__(178);
const confirmation_1 = __webpack_require__(906);
const popup_1 = __webpack_require__(469);
exports.SETTING_BANKER = {
    id: "banker",
    title: "Banker",
    description: `
    * Automatically calculates your target balance (minimum balance required to maximize your daily interest)<br />
    * Adds an option *Deposit Target Balance* which deposits up to your target balance<br />
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
      Target Balance: <strong style="color: ${targetBalance === balance ? theme_1.GREEN_SUCCESS : theme_1.YELLOW_WARNING}">${formatter.format(targetBalance)} Silver</strong>
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
    Adds × in chat banners to dismiss them<br />
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
exports.farmhandSettings = exports.setSetting = exports.getSetting = exports.getSettings = void 0;
const page_1 = __webpack_require__(952);
const getSettings = (features) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const settings = {};
    for (const feature of features) {
        for (const setting of (_a = feature.settings) !== null && _a !== void 0 ? _a : []) {
            settings[setting.id] = Object.assign(Object.assign({}, setting), { value: (yield GM.getValue(setting.id, setting.defaultValue)) });
        }
    }
    return settings;
});
exports.getSettings = getSettings;
const getSetting = (setting) => __awaiter(void 0, void 0, void 0, function* () {
    return (Object.assign(Object.assign({}, setting), { value: (yield GM.getValue(setting.id, setting.defaultValue)) }));
});
exports.getSetting = getSetting;
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
const getField = ({ id, type, value }) => {
    switch (type) {
        case "boolean": {
            return `
        <label class="label-switch">
          <input
            type="checkbox"
            class="settings_checkbox"
            id="${id}"
            name="${id}"
            value="${value ? 1 : 0}"
            ${value ? 'checked=""' : ""}"
          />
          <div class="checkbox"></div>
        </label>
      `;
        }
        case "string":
        case "number": {
            return `
        <div class="item-after">
          <input
            type="text"
            name="${id}"
            value="${value}"
            class="inlineinputsm"
            style="width: 60px; font-family: -apple-system, &quot;SF UI Text&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Noto Color Emoji&quot;, EmojiNotoColor, &quot;Noto Emoji&quot;, EmojiNoto, &quot;Segoe UI&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Twitter Color Emoji&quot;, EmojiTwemColor, &quot;Twemoji Mozilla&quot;, EmojiTwem, &quot;EmojiOne Mozilla&quot;, &quot;Android Emoji&quot;, EmojiSymbols, Symbola, EmojiSymb !important;"
          />
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
exports.farmhandSettings = {
    onPageChange: (settings, page) => {
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
            const settingLi = document.createElement("li");
            settingLi.innerHTML = `
        <div class="item-content">
          ${getWrapper(setting, `
            <div class="item-title label" style="width:60%">
              <label
                id="${setting.id}"
                for="${setting.id}">
                  ${setting.title}
              </label>
              <br>
              <div style="font-size: 11px">${setting.description}</div>
            </div>
            ${getField(setting)}
            `)}
      </div>
      `;
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
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_HIGHLIGHT_SELF.id].value) {
            return;
        }
        const username = "Crimson";
        // const username = document.querySelector("#logged_in_username")?.textContent;
        if (!username) {
            console.error("Could not find username");
            return;
        }
        const chatWatcher = new MutationObserver(() => {
            var _a;
            const tags = document.querySelectorAll(`span a[href='profile.php?user_name=${username}']`);
            for (const tag of tags) {
                tag.style.color = theme_1.YELLOW_WARNING;
                const message = (_a = tag.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
                if (!message) {
                    console.error("Could not find message");
                    continue;
                }
                message.style.backgroundColor = theme_1.YELLOW_ALERT;
                message.style.border = `1px solid ${theme_1.YELLOW_ALERT_BORDER}`;
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
const dismissableChatBanners_1 = __webpack_require__(164);
const farmhandSettings_1 = __webpack_require__(973);
const page_1 = __webpack_require__(952);
const highlightSelfInChat_1 = __webpack_require__(454);
const FEATURES = [
    banker_1.banker,
    buddyfarm_1.buddyFarm,
    compressChat_1.compressChat,
    dismissableChatBanners_1.dismissableChatBanners,
    farmhandSettings_1.farmhandSettings,
    highlightSelfInChat_1.highlightSelfInChat,
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
exports.BLUE_BUTTON_BORDER = exports.BLUE_BUTTON = exports.ORANGE_BUTTON_BORDER = exports.ORANGE_BUTTON = exports.GREEN_DARK_BUTTON_BORDER = exports.GREEN_DARK_BUTTON = exports.GREEN_BUTTON_BORDER = exports.GREEN_BUTTON = exports.GREEN_SUCCESS = exports.YELLOW_WARNING = exports.RED_ERROR = exports.YELLOW_ALERT_BORDER = exports.YELLOW_ALERT = exports.RED_LINK = exports.GREEN_LINK = void 0;
// links
exports.GREEN_LINK = "#90EE90";
exports.RED_LINK = "#ED143D";
// alerts
exports.YELLOW_ALERT = "#351C04";
exports.YELLOW_ALERT_BORDER = "#41260D";
// text
exports.RED_ERROR = "#FF0000";
exports.YELLOW_WARNING = "#FFA500";
exports.GREEN_SUCCESS = "#30D611";
// buttons
exports.GREEN_BUTTON = "#003300";
exports.GREEN_BUTTON_BORDER = "#006600";
exports.GREEN_DARK_BUTTON = "#001900";
exports.GREEN_DARK_BUTTON_BORDER = "#003300";
exports.ORANGE_BUTTON = "#351C04";
exports.ORANGE_BUTTON_BORDER = "#41260D";
exports.BLUE_BUTTON = "#000040";
exports.BLUE_BUTTON_BORDER = "#00007F";


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