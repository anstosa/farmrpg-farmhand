// ==UserScript==
// @name Farm RPG Farmhand
// @description Your helper around the RPG Farm
// @version 1.0.5
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

/***/ 477:
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
exports.autocompleteItems = exports.SETTING_AUTOCOMPLETE_ITEMS = void 0;
const buddyfarmApi_1 = __webpack_require__(651);
const autocomplete_1 = __webpack_require__(67);
exports.SETTING_AUTOCOMPLETE_ITEMS = {
    id: "autocompleteItems",
    title: "Chat Autocomplete: Items",
    description: "Auto-complete item names in chat",
    type: "boolean",
    defaultValue: true,
};
exports.autocompleteItems = {
    settings: [exports.SETTING_AUTOCOMPLETE_ITEMS],
    onInitialize: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        // make sure setting is enabled
        if (!settings[exports.SETTING_AUTOCOMPLETE_ITEMS.id].value) {
            return;
        }
        const items = yield (0, buddyfarmApi_1.getBasicItems)();
        (0, autocomplete_1.registerAutocomplete)({
            trigger: /\(\(([^]+)/,
            getItems: () => __awaiter(void 0, void 0, void 0, function* () { return yield items; }),
            prefix: "((",
            suffix: "))",
            bail: (text) => { var _a, _b; return ((_b = (_a = text.match(/(\(\(|\)\))/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) % 2 === 0; },
        });
    }),
};


/***/ }),

/***/ 881:
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
exports.autocompleteUsers = exports.getUsers = exports.SETTING_AUTOCOMPLETE_USERS = void 0;
const autocomplete_1 = __webpack_require__(67);
exports.SETTING_AUTOCOMPLETE_USERS = {
    id: "autocompleteUsers",
    title: "Chat Autocomplete: Users",
    description: "Auto-complete usernames in chat",
    type: "boolean",
    defaultValue: true,
};
const getUsers = () => {
    var _a, _b, _c;
    const users = {};
    const messages = document.querySelectorAll(".chat-txt");
    for (const message of messages) {
        const image = (_b = (_a = message.querySelector(".chip-media img")) === null || _a === void 0 ? void 0 : _a.src) !== null && _b !== void 0 ? _b : "";
        const username = (_c = message.querySelector(".chip-label a")) === null || _c === void 0 ? void 0 : _c.textContent;
        if (username && !users[username]) {
            users[username] = { name: username, image };
        }
    }
    return Object.values(users);
};
exports.getUsers = getUsers;
exports.autocompleteUsers = {
    settings: [exports.SETTING_AUTOCOMPLETE_USERS],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_AUTOCOMPLETE_USERS.id].value) {
            return;
        }
        (0, autocomplete_1.registerAutocomplete)({
            trigger: /@([^]+)/,
            getItems: () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, exports.getUsers)(); }),
            prefix: "@",
            suffix: ":",
        });
    },
};


/***/ }),

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
const farmrpgApi_1 = __webpack_require__(626);
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
                yield (0, farmrpgApi_1.depositSilver)(missingFromTarget);
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
                yield (0, farmrpgApi_1.withdrawSilver)(availableInterest);
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
const buddyfarmApi_1 = __webpack_require__(651);
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
        const itemLink = `https://buddy.farm/i/${(0, buddyfarmApi_1.nameToSlug)(itemName)}`;
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

/***/ 870:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanupHome = exports.SETTING_COMPRESS_SKILLS = exports.SETTING_HIDE_FOOTER = exports.SETTING_HIDE_THEME = exports.SETTING_HIDE_PLAYERS = void 0;
const page_1 = __webpack_require__(952);
exports.SETTING_HIDE_PLAYERS = {
    id: "homeHidePlayers",
    title: "Home: Hide players",
    description: "Hide Online, new, find players options",
    type: "boolean",
    defaultValue: false,
};
exports.SETTING_HIDE_THEME = {
    id: "homeHideTheme",
    title: "Home: Hide theme switcher",
    description: "Hide theme switcher on homepage",
    type: "boolean",
    defaultValue: false,
};
exports.SETTING_HIDE_FOOTER = {
    id: "homeHideFooter",
    title: "Home: Hide footer",
    description: "Hide footer (Privacy, CoC, T&C, Support) ",
    type: "boolean",
    defaultValue: false,
};
exports.SETTING_COMPRESS_SKILLS = {
    id: "homeCompressSkills",
    title: "Home: Compress Skills",
    description: "Hide Level 99 skills",
    type: "boolean",
    defaultValue: true,
};
exports.cleanupHome = {
    settings: [
        exports.SETTING_HIDE_PLAYERS,
        exports.SETTING_HIDE_THEME,
        exports.SETTING_HIDE_FOOTER,
        exports.SETTING_COMPRESS_SKILLS,
    ],
    onInitialize: (settings) => {
        var _a, _b;
        if (settings[exports.SETTING_HIDE_PLAYERS.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* Hide players card */
        .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title,
        .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title + .card {
          display: none !important;
        }
      <style>
    `);
        }
        if (settings[exports.SETTING_HIDE_THEME.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* Hide theme switcher */
        [data-page="index-1"] .page-content > p:nth-of-type(1),
        [data-page="index-1"] .page-content > p:nth-of-type(2) {
          display: none !important;
        }
      <style>
    `);
        }
        if (settings[exports.SETTING_HIDE_FOOTER.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
      <style>
        [data-page="index-1"] .page-content > p:last-of-type,
        [data-page="index-1"] .page-content > div:last-of-type {
          display: none !important;
        }
      <style>
    `);
        }
        if (settings[exports.SETTING_COMPRESS_SKILLS.id].value) {
            // get wrappers
            const skillsCard = (0, page_1.getCardByTitle)("My skills");
            const skillsTitle = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.previousElementSibling;
            const skillsCardInner = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.querySelector(".card-content-inner");
            if (skillsCard && skillsTitle && skillsCardInner) {
                // new row
                const newRow = document.createElement("div");
                newRow.classList.add("row");
                newRow.style.marginBottom = "0";
                newRow.style.display = "flex";
                newRow.style.justifyContent = "space-around";
                // get all skills
                const skills = skillsCard === null || skillsCard === void 0 ? void 0 : skillsCard.querySelectorAll(".col-33");
                let x99 = 0;
                for (const skill of skills) {
                    const progress = skill.querySelector("div");
                    if (!progress) {
                        continue;
                    }
                    if (progress.classList.contains("progressbar-infinite")) {
                        x99++;
                    }
                    else {
                        newRow.append(skill);
                    }
                }
                skillsCardInner.prepend(newRow);
                (_a = newRow.nextElementSibling) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = newRow.nextElementSibling) === null || _b === void 0 ? void 0 : _b.remove();
                skillsTitle.style.textTransform = "none";
                skillsTitle.textContent = `MY SKILLS (${x99}x99)`;
                const shinyBar = document.createElement("div");
                shinyBar.classList.add("progressbar-infinite");
                shinyBar.classList.add("color-multi");
                shinyBar.style.width = "100%";
                skillsTitle.after(shinyBar);
            }
        }
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
exports.navigationStyle = exports.SETTINGS_NAVIGATION_ADD_MENU = exports.SETTING_NAVIGATION_ALIGN_BOTTOM = exports.SETTING_NAVIGATION_HIDE_LOGO = exports.SETTING_NAVIGATION_COMPRESS = void 0;
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
exports.SETTING_NAVIGATION_ALIGN_BOTTOM = {
    id: "alignBottomNav",
    title: "Align Navigation to Bottom",
    description: `Aligns Navigation menu to bottom of screen for easier reach on mobile`,
    type: "boolean",
    defaultValue: false,
};
exports.SETTINGS_NAVIGATION_ADD_MENU = {
    id: "bottomMenu",
    title: "Add Bottom Menu Shortcut",
    description: `Adds navigation menu shortcut to bottom bar for easier reach on mobile`,
    type: "boolean",
    defaultValue: true,
};
exports.navigationStyle = {
    settings: [
        exports.SETTING_NAVIGATION_COMPRESS,
        exports.SETTING_NAVIGATION_HIDE_LOGO,
        exports.SETTINGS_NAVIGATION_ADD_MENU,
        exports.SETTING_NAVIGATION_ALIGN_BOTTOM,
    ],
    onInitialize: (settings) => {
        var _a;
        // align toolbar more consistently
        document.head.insertAdjacentHTML("beforeend", `
          <style>
            .toolbar-inner {
              display: flex !important;
              justify-content: end !important;
              gap: 10px !important;
            }

            @media (min-width: 768px) {
              .fh-menu {
                display: none !important;
              }
            }
          <style>
        `);
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
        if (settings[exports.SETTING_NAVIGATION_ALIGN_BOTTOM.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Align nav down */
            .panel-left .page-content .list-block {
              margin-top: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: end !important;
              height: 100% !important;
            }
          <style>
        `);
        }
        if (settings[exports.SETTINGS_NAVIGATION_ADD_MENU.id].value) {
            const homeButton = document.querySelector("#homebtn");
            if (!homeButton) {
                console.error("Home button not found");
                return;
            }
            const menuButton = document.createElement("a");
            menuButton.dataset.panel = "left";
            menuButton.classList.add("fh-menu");
            menuButton.classList.add("button");
            menuButton.classList.add("open-panel");
            menuButton.style.fontSize = "12px";
            menuButton.style.paddingLeft = "5px";
            menuButton.style.paddingRight = "8px";
            menuButton.style.display = "flex";
            menuButton.style.alignItems = "center";
            menuButton.style.gap = "2px";
            menuButton.innerHTML = `
        <i class="fa fa-fw fa-bars"></i>
        Menu
      `;
            (_a = homeButton.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(menuButton, homeButton);
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
    const key = typeof setting === "string" ? setting : setting.dataKey;
    if (!key) {
        return defaultValue;
    }
    const rawData = yield GM.getValue(key, "");
    if (!rawData) {
        return defaultValue;
    }
    return JSON.parse(rawData);
});
exports.getData = getData;
const setData = (setting, data) => __awaiter(void 0, void 0, void 0, function* () {
    const key = typeof setting === "string" ? setting : setting.dataKey;
    if (!key) {
        return;
    }
    yield GM.setValue(key, JSON.stringify(data));
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
        var _b;
        const input = (_b = settingWrapper.querySelector(".fh-input")) === null || _b === void 0 ? void 0 : _b.value;
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

/***/ 417:
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
exports.moveUpdateToTop = void 0;
const page_1 = __webpack_require__(952);
const KEY_RECENT = "recentUpdate";
exports.moveUpdateToTop = {
    onPageChange: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure we're on the home page
        if (page !== page_1.Page.HOME) {
            return;
        }
        // get the recent card and title
        const recentUpdatesCard = (0, page_1.getCardByTitle)("Most Recent Update");
        const recentUpdatesTitle = recentUpdatesCard === null || recentUpdatesCard === void 0 ? void 0 : recentUpdatesCard.previousElementSibling;
        if (!recentUpdatesCard || !recentUpdatesTitle) {
            return;
        }
        // get the latest title
        const latestUpdate = (_a = recentUpdatesCard.querySelector("strong")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!latestUpdate) {
            return;
        }
        // check if it's newer
        const latestRead = yield GM.getValue(KEY_RECENT, "");
        if (latestUpdate === latestRead) {
            return;
        }
        // move to top
        const home = (0, page_1.getCurrentPage)();
        if (!home) {
            return;
        }
        const firstTitle = home.querySelector(".content-block-title");
        if (!firstTitle) {
            return;
        }
        firstTitle.before(recentUpdatesTitle);
        firstTitle.before(recentUpdatesCard);
        // add hide button
        const hideButton = document.createElement("a");
        hideButton.style.marginLeft = "10px";
        hideButton.style.cursor = "pointer";
        hideButton.textContent = "Hide";
        hideButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            // mark current as read
            yield GM.setValue(KEY_RECENT, latestUpdate);
            window.location.reload();
        }));
        recentUpdatesTitle.append(hideButton);
    }),
};


/***/ }),

/***/ 682:
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
exports.perkManagment = exports.SETTING_PERK_MANAGER = void 0;
const farmrpgApi_1 = __webpack_require__(626);
const notifications_1 = __webpack_require__(783);
const page_1 = __webpack_require__(952);
exports.SETTING_PERK_MANAGER = {
    id: "perkManager",
    title: "Manage Perks",
    description: `
    1. Save your default perks set as "Default"<br>
    2. Save perks for "Crafting", "Fishing", "Exploring" activities<br>
    3. Activity perk sets will automatically be enabled for those activities and reverted to "Default" after
  `,
    type: "boolean",
    defaultValue: true,
};
const state = {
    perkSets: [],
};
const getNotification = (activity) => ({
    class: "btnorange",
    id: `activeperks`,
    text: `${activity} perks activated`,
});
exports.perkManagment = {
    settings: [exports.SETTING_PERK_MANAGER],
    onInitialize: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        if (!settings[exports.SETTING_PERK_MANAGER.id].value) {
            return;
        }
        state.perkSets = yield (0, farmrpgApi_1.getPerkSets)();
    }),
    onPageChange: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // make sure the setting is enabled
        if (!settings[exports.SETTING_PERK_MANAGER.id].value) {
            return;
        }
        const defaultPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.DEFAULT);
        // make sure we have a default perk set
        if (!defaultPerks) {
            console.warn("Default perk set not found");
            return;
        }
        const craftingPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.CRAFTING);
        if (craftingPerks && page === page_1.Page.WORKSHOP) {
            yield (0, farmrpgApi_1.activatePerkSet)(craftingPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.CRAFTING));
            return;
        }
        if (craftingPerks) {
            const quickcraftButton = document.querySelector(".quickcraftbtn");
            if (quickcraftButton) {
                quickcraftButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "CRAFT";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, farmrpgApi_1.activatePerkSet)(craftingPerks);
                    (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.CRAFTING));
                    quickcraftButton.click();
                    yield (0, farmrpgApi_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(getNotification());
                }));
                (_a = quickcraftButton.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(proxyButton, quickcraftButton);
            }
        }
        const fishingPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.FISHING);
        if (fishingPerks && page === page_1.Page.FISHING) {
            yield (0, farmrpgApi_1.activatePerkSet)(fishingPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.FISHING));
            return;
        }
        const exploringPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.EXPLORING);
        if (exploringPerks && page === page_1.Page.AREA) {
            yield (0, farmrpgApi_1.activatePerkSet)(exploringPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.EXPLORING));
            return;
        }
        const sellingPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.SELLING);
        if (sellingPerks && page === page_1.Page.FARMERS_MARKET) {
            yield (0, farmrpgApi_1.activatePerkSet)(sellingPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.SELLING));
            return;
        }
        if (sellingPerks) {
            const quicksellButton = document.querySelector(".quicksellbtn, .quicksellbtnnc");
            if (quicksellButton) {
                quicksellButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "SELL";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, farmrpgApi_1.activatePerkSet)(sellingPerks);
                    (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.SELLING));
                    quicksellButton.click();
                    yield (0, farmrpgApi_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(getNotification());
                }));
                (_b = quicksellButton.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(proxyButton, quicksellButton);
            }
        }
        const friendshipPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.WHEEL);
        if (friendshipPerks && page === page_1.Page.FRIENDSHIP) {
            yield (0, farmrpgApi_1.activatePerkSet)(friendshipPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.FRIENDSHIP));
            return;
        }
        if (friendshipPerks) {
            const quickgiveButton = document.querySelector(".quickgivebtn");
            if (quickgiveButton) {
                quickgiveButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "GIVE";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, farmrpgApi_1.activatePerkSet)(friendshipPerks);
                    (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.FRIENDSHIP));
                    quickgiveButton.click();
                    yield (0, farmrpgApi_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(getNotification());
                }));
                (_c = quickgiveButton.parentElement) === null || _c === void 0 ? void 0 : _c.insertBefore(proxyButton, quickgiveButton);
            }
        }
        const templePerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.TEMPLE);
        if (templePerks && page === page_1.Page.TEMPLE) {
            yield (0, farmrpgApi_1.activatePerkSet)(templePerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.TEMPLE));
            return;
        }
        const locksmithPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.LOCKSMITH);
        if (locksmithPerks && page === page_1.Page.LOCKSMITH) {
            yield (0, farmrpgApi_1.activatePerkSet)(locksmithPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.LOCKSMITH));
            return;
        }
        const wheelPerks = yield (0, farmrpgApi_1.getActivityPerksSet)(farmrpgApi_1.PerkActivity.WHEEL);
        if (wheelPerks && page === page_1.Page.WHEEL) {
            yield (0, farmrpgApi_1.activatePerkSet)(wheelPerks);
            (0, notifications_1.sendNotification)(getNotification(farmrpgApi_1.PerkActivity.WHEEL));
            return;
        }
        (0, farmrpgApi_1.activatePerkSet)(defaultPerks);
        (0, notifications_1.removeNotification)(getNotification());
    }),
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
const autocomplete_1 = __webpack_require__(67);
const autocompleteItems_1 = __webpack_require__(477);
const autocompleteUsers_1 = __webpack_require__(881);
const banker_1 = __webpack_require__(92);
const buddyfarm_1 = __webpack_require__(273);
const cleanupHome_1 = __webpack_require__(870);
const compressChat_1 = __webpack_require__(223);
const customNavigation_1 = __webpack_require__(224);
const dismissableChatBanners_1 = __webpack_require__(164);
const farmhandSettings_1 = __webpack_require__(973);
const page_1 = __webpack_require__(952);
const highlightSelfInChat_1 = __webpack_require__(454);
const moveUpdateToTop_1 = __webpack_require__(417);
const compressNavigation_1 = __webpack_require__(827);
const notifications_1 = __webpack_require__(783);
const perkManagement_1 = __webpack_require__(682);
const FEATURES = [
    // internal
    notifications_1.notifications,
    autocomplete_1.autocomplete,
    // home
    cleanupHome_1.cleanupHome,
    moveUpdateToTop_1.moveUpdateToTop,
    // almanac
    buddyfarm_1.buddyFarm,
    // bank
    banker_1.banker,
    // explore
    perkManagement_1.perkManagment,
    // chat
    compressChat_1.compressChat,
    dismissableChatBanners_1.dismissableChatBanners,
    highlightSelfInChat_1.highlightSelfInChat,
    autocompleteItems_1.autocompleteItems,
    autocompleteUsers_1.autocompleteUsers,
    // nav
    compressNavigation_1.navigationStyle,
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
        const pages = document.querySelector(".view-main .pages");
        if (!pages) {
            console.error("Pages not found");
            return;
        }
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // only respond to tree changes
                if (mutation.type !== "childList") {
                    continue;
                }
                // ignore removals
                if (mutation.addedNodes.length === 0) {
                    continue;
                }
                const [page, parameters] = (0, page_1.getPage)();
                console.debug("Page Load", page, parameters);
                onPageChange(page, parameters);
            }
        });
        observer.observe(pages, { childList: true });
    });
})();


/***/ }),

/***/ 67:
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
exports.autocomplete = exports.registerInputListeners = exports.registerAutocomplete = void 0;
const theme_1 = __webpack_require__(178);
const state = {
    currentIndex: 0,
    autocompletes: [],
};
const processInput = (input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let activeAutocomplete;
    const text = input.value;
    const processedInput = { text };
    for (const autocomplete of state.autocompletes) {
        // "@anstosa: LF ((or"
        if ((_a = autocomplete === null || autocomplete === void 0 ? void 0 : autocomplete.bail) === null || _a === void 0 ? void 0 : _a.call(autocomplete, text)) {
            continue;
        }
        // "@anstosa: LF ((or"
        const match = text.match(autocomplete.trigger);
        // "or"
        if (!match || match.length < 2) {
            continue;
        }
        const search = match[1];
        const items = yield autocomplete.getItems();
        const filteredItems = items.filter(({ name }) => { var _a; return name.toLowerCase().includes((_a = search.toLowerCase()) !== null && _a !== void 0 ? _a : ""); });
        activeAutocomplete = autocomplete;
        processedInput.search = search;
        processedInput.match = match;
        processedInput.items = items;
        processedInput.filteredItems = filteredItems;
    }
    state.activeAutocomplete = activeAutocomplete;
    return processedInput;
});
const applyInput = (input, item) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { filteredItems, search, match, text } = yield processInput(input);
    if (!state.activeAutocomplete) {
        return;
    }
    const { prefix, suffix } = state.activeAutocomplete;
    if (!search || !match || !filteredItems) {
        return;
    }
    // eslint-disable-next-line require-atomic-updates
    input.value = [
        text.slice(0, match.index),
        prefix,
        item.name,
        suffix,
        text.slice(((_b = match.index) !== null && _b !== void 0 ? _b : 0) + match[0].length),
    ].join("");
    closeAutocomplete();
});
const autocompleteSearchControlHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!event.target) {
        return;
    }
    if (!["Enter", "ArrowDown", "ArrowUp"].includes(event.key)) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const input = event.target;
    const { filteredItems, search, match } = yield processInput(input);
    if (!search || !match || !filteredItems) {
        closeAutocomplete();
        return;
    }
    // eslint-disable-next-line unicorn/prefer-switch
    if (event.key === "Enter") {
        closeAutocomplete();
        yield applyInput(input, filteredItems[state.currentIndex]);
    }
    else if (event.key === "ArrowDown") {
        state.currentIndex = Math.min(state.currentIndex + 1, filteredItems.length - 1);
        renderAutocomplete(input, filteredItems);
    }
    else if (event.key === "ArrowUp") {
        state.currentIndex = Math.max(state.currentIndex - 1, 0);
        renderAutocomplete(input, filteredItems);
    }
    else if (event.key === "Escape") {
        closeAutocomplete();
    }
});
const autocompleteSearchItemHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!event.target) {
        return;
    }
    const input = event.target;
    const { filteredItems, match } = yield processInput(input);
    if (!match || !filteredItems) {
        closeAutocomplete();
        return;
    }
    renderAutocomplete(input, filteredItems);
});
const closeAutocomplete = () => {
    var _a;
    (_a = document.querySelector(".fh-autocomplete")) === null || _a === void 0 ? void 0 : _a.remove();
};
const renderAutocomplete = (input, items) => {
    closeAutocomplete();
    const offset = input.getBoundingClientRect();
    const wrapper = document.createElement("div");
    wrapper.classList.add("fh-autocomplete");
    wrapper.style.position = "fixed";
    wrapper.style.top = `${offset.top + offset.height}px`;
    wrapper.style.left = `${offset.left}px`;
    wrapper.style.width = `${offset.width}px`;
    wrapper.style.maxHeight = `${window.innerHeight - offset.top - offset.height}px`;
    wrapper.style.zIndex = "99999";
    wrapper.innerHTML = `
    ${items
        .map(({ name, image }, index) => `
          <div
            class="fh-autocomplete-item"
            data-index="${index}"
            style="
              display: flex;
              align-items: center;
              color: white;
              gap: 5px;
              width: 100%;
              cursor: pointer;
              padding: 8px;
              background-color: ${index === state.currentIndex
        ? theme_1.BUTTON_BLUE_BACKGROUND
        : theme_1.BACKGROUND_DARK};
            "
          >
            <img
              src="${image}"
              style="
                width: 25px;
                height: 25px;
              ">
            ${name}
          </div>
        `)
        .join("")}
  `;
    for (const item of wrapper.querySelectorAll(".fh-autocomplete-item")) {
        wrapper.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            closeAutocomplete();
            yield applyInput(input, items[Number(item.dataset.index)]);
        }));
    }
    document.body.append(wrapper);
};
const registerAutocomplete = (autocomplete) => {
    state.autocompletes.push(autocomplete);
};
exports.registerAutocomplete = registerAutocomplete;
const registerInputListeners = (input) => {
    input.addEventListener("keypress", autocompleteSearchItemHandler);
    input.addEventListener("keydown", autocompleteSearchControlHandler);
};
exports.registerInputListeners = registerInputListeners;
exports.autocomplete = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        .fh-autocomplete-item:hover {
          background-color: ${theme_1.BUTTON_BLUE_BACKGROUND};
        }
      <style>
    `);
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
        const chatWatcher = new MutationObserver(() => {
            for (const chat of [mobileChat, desktopChat]) {
                const input = chat.querySelector("input[type='text']");
                if (!input) {
                    continue;
                }
                (0, exports.registerInputListeners)(input);
            }
        });
        chatWatcher.observe(mobileChat, { childList: true, subtree: true });
        chatWatcher.observe(desktopChat, { childList: true, subtree: true });
    },
};


/***/ }),

/***/ 651:
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
exports.getBasicItems = exports.getItemData = exports.getPageData = exports.nameToSlug = void 0;
const state = {
    itemData: {},
};
const nameToSlug = (name) => name.toLowerCase().replaceAll(/[\s']/g, "-");
exports.nameToSlug = nameToSlug;
const getPageData = () => __awaiter(void 0, void 0, void 0, function* () {
    if (state.pageData) {
        return state.pageData;
    }
    state.pageData = {
        townsfolk: [],
        questlines: [],
        quizzes: [],
        quests: [],
        items: [],
        pages: [],
    };
    const response = yield fetch("https://buddy.farm/search.json");
    const data = (yield response.json());
    for (const page of data) {
        // eslint-disable-next-line unicorn/prefer-switch
        if (page.type === "Townsfolk") {
            state.pageData.townsfolk.push(page);
        }
        else if (page.type === "Questline") {
            state.pageData.questlines.push(page);
        }
        else if (page.type === "Schoolhouse Quiz") {
            state.pageData.quizzes.push(page);
        }
        else if (page.href.startsWith("/q/")) {
            state.pageData.quests.push(page);
        }
        else if (page.href.startsWith("/i/")) {
            state.pageData.items.push(page);
        }
        else {
            state.pageData.pages.push(page);
        }
    }
    return state.pageData;
});
exports.getPageData = getPageData;
const getItemData = (itemName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (state.itemData[itemName]) {
        return state.itemData[itemName];
    }
    const response = yield fetch(`https://buddy.farm/page-data/i/${(0, exports.nameToSlug)(itemName)}/page-data.json`);
    const data = (yield response.json());
    const item = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.farmrpg) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d[0];
    if (!item) {
        console.error(`Item ${itemName} not found`);
        return;
    }
    // eslint-disable-next-line require-atomic-updates
    state.itemData[itemName] = item;
    return item;
});
exports.getItemData = getItemData;
const getBasicItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = yield (0, exports.getPageData)();
    return items.map(({ name, image }) => ({ name, image }));
});
exports.getBasicItems = getBasicItems;


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

/***/ 626:
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
exports.activatePerkSet = exports.resetPerks = exports.isActivePerkSet = exports.getCurrentPerkSet = exports.getActivityPerksSet = exports.getPerkSets = exports.PerkActivity = exports.collectMailbox = exports.getMailboxContents = exports.getMailboxCount = exports.withdrawSilver = exports.depositSilver = exports.getStats = exports.sendRequest = void 0;
const page_1 = __webpack_require__(952);
const state = {};
const sendRequest = (page, query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://farmrpg.com/${page}.php?${query ? query.toString() : ""}`, {
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
    const response = yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "getstats" }));
    const parameters = response.querySelectorAll("span");
    const silver = Number((_b = (_a = parameters[0].textContent) === null || _a === void 0 ? void 0 : _a.trim().replaceAll(",", "")) !== null && _b !== void 0 ? _b : "0");
    const gold = Number((_d = (_c = parameters[1].textContent) === null || _c === void 0 ? void 0 : _c.trim().replaceAll(",", "")) !== null && _d !== void 0 ? _d : "0");
    const ancientCoins = Number((_f = (_e = parameters[2].textContent) === null || _e === void 0 ? void 0 : _e.trim().replaceAll(",", "")) !== null && _f !== void 0 ? _f : "0");
    return { silver, gold, ancientCoins };
});
exports.getStats = getStats;
const depositSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "depositsilver", amt: amount.toString() }));
});
exports.depositSilver = depositSilver;
const withdrawSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "withdrawalsilver", amt: amount.toString() }));
});
exports.withdrawSilver = withdrawSilver;
const getMailboxCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "mbcount" }));
    return Number(response.body.textContent);
});
exports.getMailboxCount = getMailboxCount;
const getMailboxContents = () => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m, _o, _p;
    const response = yield (0, exports.sendRequest)(page_1.Page.POST_OFFICE);
    const mailboxList = (0, page_1.getListByTitle)("Your Mailbox", response.body);
    const itemWrappers = (_g = mailboxList === null || mailboxList === void 0 ? void 0 : mailboxList.querySelectorAll(".collectbtnnc")) !== null && _g !== void 0 ? _g : [];
    const mailboxContents = [];
    for (const itemWrapper of itemWrappers) {
        const from = (_j = (_h = itemWrapper.querySelector("span")) === null || _h === void 0 ? void 0 : _h.textContent) !== null && _j !== void 0 ? _j : "";
        const item = (_l = (_k = itemWrapper.querySelector("b")) === null || _k === void 0 ? void 0 : _k.textContent) !== null && _l !== void 0 ? _l : "";
        const count = Number((_p = (_o = (_m = itemWrapper.querySelector("font")) === null || _m === void 0 ? void 0 : _m.textContent) === null || _o === void 0 ? void 0 : _o.replaceAll(",", "")) !== null && _p !== void 0 ? _p : "0");
        mailboxContents.push({ from, item, count });
    }
    return mailboxContents;
});
exports.getMailboxContents = getMailboxContents;
const collectMailbox = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "collectallmailitems" }));
});
exports.collectMailbox = collectMailbox;
var PerkActivity;
(function (PerkActivity) {
    PerkActivity["DEFAULT"] = "Default";
    PerkActivity["CRAFTING"] = "Crafting";
    PerkActivity["FISHING"] = "Fishing";
    PerkActivity["EXPLORING"] = "Exploring";
    PerkActivity["SELLING"] = "Selling";
    PerkActivity["FRIENDSHIP"] = "Friendship";
    PerkActivity["TEMPLE"] = "Temple";
    PerkActivity["LOCKSMITH"] = "Locksmith";
    PerkActivity["WHEEL"] = "Wheel";
    PerkActivity["UNKNOWN"] = "Unknown";
})(PerkActivity || (exports.PerkActivity = PerkActivity = {}));
const getPerkSets = () => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r;
    if (state.perkSets) {
        return state.perkSets;
    }
    const response = yield (0, exports.sendRequest)(page_1.Page.PERKS);
    const setList = (0, page_1.getListByTitle)("My Perk Sets", response.body);
    const setWrappers = (_q = setList === null || setList === void 0 ? void 0 : setList.querySelectorAll(".item-title")) !== null && _q !== void 0 ? _q : [];
    const sets = [];
    for (const setWrapper of setWrappers) {
        const link = setWrapper.querySelector("a");
        const name = (_r = link === null || link === void 0 ? void 0 : link.textContent) !== null && _r !== void 0 ? _r : "";
        const id = Number(link === null || link === void 0 ? void 0 : link.dataset.id);
        sets.push({ name, id });
    }
    // eslint-disable-next-line require-atomic-updates
    state.perkSets = sets;
    return sets;
});
exports.getPerkSets = getPerkSets;
const getActivityPerksSet = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    const sets = yield (0, exports.getPerkSets)();
    return sets.find((set) => set.name === activity);
});
exports.getActivityPerksSet = getActivityPerksSet;
const getCurrentPerkSet = () => state.currentPerksSet;
exports.getCurrentPerkSet = getCurrentPerkSet;
const isActivePerkSet = (set) => state.currentPerksSet === set;
exports.isActivePerkSet = isActivePerkSet;
const resetPerks = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "resetperks" }));
});
exports.resetPerks = resetPerks;
const activatePerkSet = (set) => __awaiter(void 0, void 0, void 0, function* () {
    if (state.currentPerksSet === set) {
        return;
    }
    console.debug(`Activating ${set.name} Perks`);
    yield (0, exports.resetPerks)();
    yield (0, exports.sendRequest)(page_1.Page.WORKER, new URLSearchParams({ go: "activateperkset", id: set.id.toString() }));
    // eslint-disable-next-line require-atomic-updates
    state.currentPerksSet = set;
});
exports.activatePerkSet = activatePerkSet;


/***/ }),

/***/ 783:
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
exports.notifications = exports.removeNotification = exports.sendNotification = exports.registerNotificationHandler = void 0;
const page_1 = __webpack_require__(952);
const farmhandSettings_1 = __webpack_require__(973);
const KEY_NOTIFICATIONS = "notifications";
const state = {
    notifications: [],
};
const notificationHandlers = new Map();
const registerNotificationHandler = (handlerName, handler) => {
    notificationHandlers.set(handlerName, handler);
};
exports.registerNotificationHandler = registerNotificationHandler;
const sendNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    state.notifications = [
        ...state.notifications.filter(({ id }) => id !== notification.id),
        notification,
    ];
    yield (0, farmhandSettings_1.setData)(KEY_NOTIFICATIONS, state.notifications);
    renderNotifications();
});
exports.sendNotification = sendNotification;
const removeNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    state.notifications = state.notifications.filter(({ id }) => id !== notification.id);
    yield (0, farmhandSettings_1.setData)(KEY_NOTIFICATIONS, state.notifications);
    renderNotifications();
});
exports.removeNotification = removeNotification;
const renderNotifications = () => {
    var _a, _b, _c, _d;
    const pageContent = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".page-content");
    if (!pageContent) {
        console.error("Page content not found");
        return;
    }
    // remove existing notifications
    const notifications = document.querySelectorAll(".fh-notification");
    if (notifications.length === state.notifications.length) {
        return;
    }
    for (const notification of notifications) {
        notification.remove();
    }
    // add new notifications
    for (const notification of state.notifications) {
        if (notification.replacesHref) {
            (_c = (_b = (0, page_1.getCurrentPage)()) === null || _b === void 0 ? void 0 : _b.querySelector(`a[href="${notification.replacesHref}"]`)) === null || _c === void 0 ? void 0 : _c.remove();
        }
        const notificationElement = document.createElement(notification.handlerName ? "a" : "span");
        notificationElement.classList.add("fh-notification");
        notificationElement.classList.add("button");
        if (notification.class) {
            notificationElement.classList.add(notification.class);
        }
        notificationElement.textContent = notification.text;
        notificationElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            event.preventDefault();
            event.stopPropagation();
            const handler = notificationHandlers.get((_e = notification.handlerName) !== null && _e !== void 0 ? _e : "");
            if (handler) {
                yield handler(notification);
            }
            else {
                console.error(`Handler not found: ${notification.handlerName}`);
            }
            (0, exports.removeNotification)(notification);
            renderNotifications();
        }));
        if ((_d = pageContent.firstElementChild) === null || _d === void 0 ? void 0 : _d.classList.contains("pull-to-refresh-layer")) {
            pageContent.insertBefore(notificationElement, pageContent.children[1]);
        }
        else {
            pageContent.prepend(notificationElement);
        }
    }
};
exports.notifications = {
    onInitialize: () => __awaiter(void 0, void 0, void 0, function* () {
        const savedNotifications = yield (0, farmhandSettings_1.getData)(KEY_NOTIFICATIONS, []);
        state.notifications = savedNotifications;
        const observer = new MutationObserver(renderNotifications);
        const pages = document.querySelector(".view-main .pages");
        if (!pages) {
            console.error("Pages not found");
            return;
        }
        observer.observe(pages, { childList: true, subtree: true });
    }),
};


/***/ }),

/***/ 952:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getListByTitle = exports.getCardByTitle = exports.setTitle = exports.getCurrentPage = exports.getPreviousPage = exports.getPage = exports.Page = void 0;
var Page;
(function (Page) {
    Page["AREA"] = "area";
    Page["BANK"] = "bank";
    Page["FARMERS_MARKET"] = "market";
    Page["FISHING"] = "fishing";
    Page["FRIENDSHIP"] = "npclevels";
    Page["HOME"] = "index-1";
    Page["ITEM"] = "item";
    Page["LOCKSMITH"] = "locksmith";
    Page["PERKS"] = "perks";
    Page["POST_OFFICE"] = "postoffice";
    Page["SETTINGS"] = "settings";
    Page["SETTINGS_OPTIONS"] = "settings_options";
    Page["TEMPLE"] = "mailitems";
    Page["WHEEL"] = "spin";
    Page["WORKER"] = "worker";
    Page["WORKSHOP"] = "workshop";
})(Page || (exports.Page = Page = {}));
// get page and parameters if any
const getPage = () => {
    const currentPage = (0, exports.getCurrentPage)();
    const page = currentPage === null || currentPage === void 0 ? void 0 : currentPage.dataset.page;
    const parameters = new URLSearchParams(window.location.hash.split("?")[1]);
    return [page, parameters];
};
exports.getPage = getPage;
const getPreviousPage = () => document.querySelector(".page-on-left");
exports.getPreviousPage = getPreviousPage;
const getCurrentPage = () => document.querySelector(".page-on-center, .page-from-right-to-center, .view-main .page:only-child");
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
const getCardByTitle = (searchTitle, root) => {
    const currentPage = root !== null && root !== void 0 ? root : (0, exports.getCurrentPage)();
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
const getListByTitle = (searchTitle, root) => {
    const targetCard = (0, exports.getCardByTitle)(searchTitle, root);
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
exports.BACKGROUND_DARK = exports.BACKGROUND_BLACK = exports.BUTTON_BLUE_BORDER = exports.BUTTON_BLUE_BACKGROUND = exports.BUTTON_ORANGE_BORDER = exports.BUTTON_ORANGE_BACKGROUND = exports.BUTTON_GREEN_DARK_BORDER = exports.BUTTON_GREEN_DARK_BACKGROUND = exports.BUTTON_GREEN_BORDER = exports.BUTTON_GREEN_BACKGROUND = exports.BORDER_GRAY = exports.TEXT_SUCCESS = exports.TEXT_WARNING = exports.TEXT_ERROR = exports.ALERT_YELLOW_BORDER = exports.ALERT_YELLOW_BACKGROUND = exports.LINK_RED = exports.LINK_GREEN = void 0;
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
exports.BACKGROUND_BLACK = "#111111";
exports.BACKGROUND_DARK = "#161718";


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