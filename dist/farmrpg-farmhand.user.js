// ==UserScript==
// @name Farm RPG Farmhand
// @description Your helper around the RPG Farm
// @version 1.0.20
// @author Ansel Santosa <568242+anstosa@users.noreply.github.com>
// @match https://farmrpg.com/*
// @match https://alpha.farmrpg.com/*
// @connect greasyfork.org
// @connect github.com
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.setClipboard
// @grant GM.xmlHttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @license MIT
// @namespace https://github.com/anstosa/farmrpg-farmhand
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3413:
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
exports.pageDataState = exports.getBasicItems = exports.getItemByName = void 0;
const state_1 = __webpack_require__(4456);
const state_2 = __webpack_require__(4619);
const itemDataState = new state_2.CachedState(state_2.StorageKey.ITEM_DATA, () => Promise.resolve({}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {},
});
const getItemByName = (itemName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const items = yield itemDataState.get();
    if (items === null || items === void 0 ? void 0 : items[itemName]) {
        return items[itemName];
    }
    const response = yield fetch(`https://buddy.farm/page-data/i/${(0, state_1.nameToSlug)(itemName)}/page-data.json`);
    const data = (yield response.json());
    const item = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.farmrpg) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d[0];
    if (!item) {
        console.error(`Item ${itemName} not found`);
        return;
    }
    itemDataState.set(Object.assign(Object.assign({}, items), { [itemName]: item }));
    return item;
});
exports.getItemByName = getItemByName;
const getBasicItems = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { items } = (_a = (yield exports.pageDataState.get())) !== null && _a !== void 0 ? _a : {};
    return (_b = items === null || items === void 0 ? void 0 : items.map(({ name, image }) => ({ name, image }))) !== null && _b !== void 0 ? _b : [];
});
exports.getBasicItems = getBasicItems;
exports.pageDataState = new state_2.CachedState(state_2.StorageKey.PAGE_DATA, () => __awaiter(void 0, void 0, void 0, function* () {
    const pages = {
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
            pages.townsfolk.push(page);
        }
        else if (page.type === "Questline") {
            pages.questlines.push(page);
        }
        else if (page.type === "Schoolhouse Quiz") {
            pages.quizzes.push(page);
        }
        else if (page.href.startsWith("/q/")) {
            pages.quests.push(page);
        }
        else if (page.href.startsWith("/i/")) {
            pages.items.push(page);
        }
        else {
            pages.pages.push(page);
        }
    }
    return pages;
}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {
        townsfolk: [],
        questlines: [],
        quizzes: [],
        quests: [],
        items: [],
        pages: [],
    },
});


/***/ }),

/***/ 4456:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nameToSlug = void 0;
const NAME_OVERRIDES = {
    "Gold Pea": "Gold Peas",
    "Gold Pepper": "Gold Peppers",
    "Mega Beet": "Mega Beet Seeds",
    "Mega Sunflower": "Mega Sunflower Seeds",
    Pea: "Peas",
    Pepper: "Peppers",
    Pine: "Pine Tree",
};
const nameToSlug = (name) => {
    var _a;
    let slug = (_a = NAME_OVERRIDES[name]) !== null && _a !== void 0 ? _a : name;
    // delete item markings
    slug = slug.replaceAll("*", "");
    // trim whitespace
    slug = slug.trim();
    // lowercase
    slug = slug.toLowerCase();
    // replace punctuation and whitespace with hyphens
    slug = slug.replaceAll(/[ ',.]/g, "-");
    return slug;
};
exports.nameToSlug = nameToSlug;


/***/ }),

/***/ 126:
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
exports.chatState = exports.musicState = exports.darkModeState = exports.betaState = exports.userIdState = exports.usernameState = exports.timestampToDate = exports.requestJSON = exports.requestHTML = void 0;
const state_1 = __webpack_require__(4619);
const index_1 = __webpack_require__(6217);
const utils_1 = __webpack_require__(7683);
const farmhandSettings_1 = __webpack_require__(8973);
const requestHTML = (page, query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch((0, state_1.toUrl)(page, query), {
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    return (0, utils_1.getDocument)(response);
});
exports.requestHTML = requestHTML;
const requestJSON = (page, query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch((0, state_1.toUrl)(page, query), {
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
    const settings = yield (0, farmhandSettings_1.getSettings)(index_1.FEATURES);
    (0, state_1.onFetchResponse)(settings, response);
    return yield response.json();
});
exports.requestJSON = requestJSON;
const timestampToDate = (timestamp) => new Date(`${timestamp}-05:00`);
exports.timestampToDate = timestampToDate;
//   let skills = state.get("skills");
//   const skillsCard = getCardByTitle("My skills", root);
//   if (!skillsCard) {
//     console.error("failed to find skills card");
//     return;
//   }
//   let cookingSkill = 0;
//   let craftingSkill = 0;
//   let exploringSkill = 0;
//   let farmingSkill = 0;
//   let fishingSkill = 0;
//   let miningSkill = 0;
//   for (const skillBlock of skillsCard.querySelectorAll(".col-33")) {
//     let level = Number(skillBlock.textContent?.match(/Level (\d+)/)?.[1] ?? 0);
//     if (!level) {
//       console.error(`failed to read skill level ${skillBlock.textContent}`);
//       return;
//     }
//     // add incremental level based on progress
//     level +=
//       Number(
//         skillBlock.querySelector<HTMLDivElement>(".progressbar")?.dataset
//           .progress || "0"
//       ) / 100;
//     if (skillBlock.textContent?.includes("Cooking")) {
//       cookingSkill = level;
//     } else if (skillBlock.textContent?.includes("Crafting")) {
//       craftingSkill = level;
//     } else if (skillBlock.textContent?.includes("Exploring")) {
//       exploringSkill = level;
//     } else if (skillBlock.textContent?.includes("Farming")) {
//       farmingSkill = level;
//     } else if (skillBlock.textContent?.includes("Fishing")) {
//       fishingSkill = level;
//     } else if (skillBlock.textContent?.includes("Mining")) {
//       miningSkill = level;
//     }
//     skills = {
//       cooking: cookingSkill,
//       crafting: craftingSkill,
//       exploring: exploringSkill,
//       farming: farmingSkill,
//       fishing: fishingSkill,
//       mining: miningSkill,
//     };
//   }
exports.usernameState = new state_1.CachedState(state_1.StorageKey.USERNAME, () => {
    var _a;
    return Promise.resolve(((_a = document.querySelector("#logged_in_username")) === null || _a === void 0 ? void 0 : _a.textContent) || undefined);
}, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: "",
});
exports.userIdState = new state_1.CachedState(state_1.StorageKey.USERNAME, () => {
    var _a;
    const userIdRaw = (_a = document.querySelector("#logged_in_userid")) === null || _a === void 0 ? void 0 : _a.textContent;
    return Promise.resolve(userIdRaw ? Number(userIdRaw) : undefined);
}, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: -1,
});
exports.betaState = new state_1.CachedState(state_1.StorageKey.IS_BETA, () => { var _a; return Promise.resolve(((_a = document.querySelector("#is_beta")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
});
exports.darkModeState = new state_1.CachedState(state_1.StorageKey.IS_DARK_MODE, () => { var _a; return Promise.resolve(((_a = document.querySelector("#dark_mode")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: false,
});
exports.musicState = new state_1.CachedState(state_1.StorageKey.IS_MUSIC_ENABLED, () => { var _a; return Promise.resolve(((_a = document.querySelector("#dark_mode")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
});
exports.chatState = new state_1.CachedState(state_1.StorageKey.IS_CHAT_ENABLED, () => { var _a; return Promise.resolve(((_a = document.querySelector("#chat")) === null || _a === void 0 ? void 0 : _a.textContent) === "1"); }, {
    timeout: Number.POSITIVE_INFINITY, // never expire
    persist: false,
    defaultState: true,
});


/***/ }),

/***/ 9022:
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
exports.withdrawSilver = exports.depositSilver = exports.statsState = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(126);
const processStats = (root) => {
    var _a;
    const matches = (_a = root.body.textContent) === null || _a === void 0 ? void 0 : _a.match(/[^\d,]+([\d,]+)[^\d,]+([\d,]+)[^\d,]+([\d,]+)/);
    if (!matches || matches.length < 4) {
        return { silver: 0, gold: 0, ancientCoins: 0 };
    }
    const [_, silverMatch, goldMatch, ancientCoinsMatch] = matches;
    const silver = Number(silverMatch.replaceAll(",", ""));
    const gold = Number(goldMatch.replaceAll(",", ""));
    const ancientCoins = Number(ancientCoinsMatch.replaceAll(",", ""));
    return { silver, gold, ancientCoins };
};
exports.statsState = new state_1.CachedState(state_1.StorageKey.STATS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.GET_STATS }));
    return processStats(response);
}), {
    interceptors: [
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.GET_STATS })],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                state.set(processStats(yield (0, utils_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.DEPOSIT_SILVER }),
            ],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, state_1.parseUrl)(response.url);
                if (!previous) {
                    return;
                }
                yield state.set(Object.assign(Object.assign({}, previous), { silver: previous.silver - Number(query.get("amt")) }));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.WITHDRAW_SILVER }),
            ],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, state_1.parseUrl)(response.url);
                if (!previous) {
                    return;
                }
                yield state.set(Object.assign(Object.assign({}, previous), { silver: previous.silver + Number(query.get("amt")) }));
            }),
        },
    ],
    defaultState: {
        silver: 0,
        gold: 0,
        ancientCoins: 0,
    },
});
const depositSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.DEPOSIT_SILVER, amt: amount.toString() }));
});
exports.depositSilver = depositSilver;
const withdrawSilver = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({
        go: page_1.WorkerGo.WITHDRAW_SILVER,
        amt: amount.toString(),
    }));
});
exports.withdrawSilver = withdrawSilver;


/***/ }),

/***/ 9888:
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
exports.harvestAll = exports.farmIdState = exports.farmStatusState = exports.CropStatus = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(126);
const harvestNotifications_1 = __webpack_require__(4894);
const popup_1 = __webpack_require__(469);
var CropStatus;
(function (CropStatus) {
    CropStatus["EMPTY"] = "empty";
    CropStatus["GROWING"] = "growing";
    CropStatus["READY"] = "ready";
})(CropStatus || (exports.CropStatus = CropStatus = {}));
const processFarmStatus = (root) => {
    const statusText = root.textContent;
    if (!statusText) {
        return {
            status: CropStatus.EMPTY,
            count: 0,
            readyAt: Number.POSITIVE_INFINITY,
        };
    }
    // 36 READY!
    const count = Number(statusText.split(" ")[0]);
    let status = CropStatus.EMPTY;
    let readyAt = Number.POSITIVE_INFINITY;
    if (statusText.toLowerCase().includes("growing")) {
        status = CropStatus.GROWING;
        // new sure when ready, check again in a minute
        readyAt = Date.now() + 60 * 1000;
    }
    else if (statusText.toLowerCase().includes("ready")) {
        status = CropStatus.READY;
        readyAt = Date.now();
    }
    return { status, count, readyAt };
};
const processFarmPage = (root) => {
    var _a;
    const plots = root.querySelectorAll("#croparea #crops .col-25");
    const count = plots.length;
    let status = CropStatus.EMPTY;
    let readyAt = Number.POSITIVE_INFINITY;
    for (const plot of plots) {
        const image = plot.querySelector("img");
        if ((image === null || image === void 0 ? void 0 : image.style.opacity) === "1") {
            status = CropStatus.READY;
            readyAt = Date.now();
        }
        else if (status === CropStatus.EMPTY) {
            status = CropStatus.GROWING;
            readyAt = Math.min(readyAt, Date.now() + Number((_a = image === null || image === void 0 ? void 0 : image.dataset.seconds) !== null && _a !== void 0 ? _a : "60") * 1000);
        }
    }
    return { status, count, readyAt };
};
const scheduledUpdates = {};
exports.farmStatusState = new state_1.CachedState(state_1.StorageKey.FARM_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.FARM, new URLSearchParams());
    return processFarmPage(response.body);
}), {
    timeout: 5,
    defaultState: {
        status: CropStatus.EMPTY,
        count: 4,
        readyAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.READY_COUNT })],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                state.set(processFarmStatus(root.body));
            }),
        },
        {
            match: [page_1.Page.FARM, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                yield state.set(processFarmPage(root.body));
            }),
        },
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                const linkStatus = root.body.querySelector("a[href^='xfarm.php'] .item-after");
                if (!linkStatus) {
                    return;
                }
                yield state.set(processFarmStatus(linkStatus));
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.FARM_STATUS })],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const raw = yield response.text();
                const rawPlots = raw.split(";");
                if (rawPlots.length < ((_a = previous === null || previous === void 0 ? void 0 : previous.count) !== null && _a !== void 0 ? _a : 4)) {
                    yield state.set({ status: CropStatus.EMPTY });
                    return;
                }
                let status = CropStatus.EMPTY;
                for (const plot of rawPlots) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [plotId, percent, secondsLeft, secondsSince] = plot.split("-");
                    const percentReady = Number(percent);
                    if (percentReady === 100) {
                        status = CropStatus.READY;
                        break;
                    }
                    else if (percentReady > 0) {
                        status = CropStatus.GROWING;
                    }
                }
                yield state.set({ status });
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.HARVEST_ALL })],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set({ status: CropStatus.EMPTY });
                const { drops } = (yield response.json());
                const [page] = (0, page_1.getPage)();
                if (page !== page_1.Page.FARM || settings[harvestNotifications_1.SETTING_HARVEST_POPUP.id].value) {
                    (0, popup_1.showPopup)({
                        title: "Harvested Crops",
                        contentHTML: `
              ${Object.values(drops)
                            .map((drop) => `
                    <img
                      src="${drop.img}"
                      style="
                        vertical-align: middle;
                        width: 18px;
                      "
                    >
                    (x${drop.qty})
                  `)
                            .join("&nbsp;")}
            `,
                        actions: [
                            {
                                name: "Replant",
                                buttonClass: "btnblue",
                                callback: () => __awaiter(void 0, void 0, void 0, function* () {
                                    var _a;
                                    const farmId = yield exports.farmIdState.get();
                                    if (!farmId) {
                                        console.error("No farm id found");
                                        return;
                                    }
                                    if (page === page_1.Page.FARM) {
                                        (_a = document
                                            .querySelector(".plantallbtn")) === null || _a === void 0 ? void 0 : _a.click();
                                    }
                                    else {
                                        yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({
                                            go: page_1.WorkerGo.PLANT_ALL,
                                            id: String(farmId),
                                        }));
                                    }
                                }),
                            },
                        ],
                    });
                }
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.PLANT_ALL })],
            callback: (settings, state) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set({ status: CropStatus.GROWING });
            }),
        },
    ],
});
const updateStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.farmStatusState.get({ doNotFetch: true });
    if (!state) {
        return;
    }
    if (state.readyAt < Date.now()) {
        yield exports.farmStatusState.set({ status: CropStatus.READY });
    }
});
// automatically update crops when finished
exports.farmStatusState.onUpdate((state) => {
    if (!state) {
        return;
    }
    if (scheduledUpdates[state.readyAt]) {
        return;
    }
    scheduledUpdates[state.readyAt] = setTimeout(updateStatus, state.readyAt - Date.now());
});
const processFarmId = (root) => {
    var _a;
    const farmIdRaw = (_a = root.querySelector("#farm")) === null || _a === void 0 ? void 0 : _a.textContent;
    return farmIdRaw ? Number(farmIdRaw) : undefined;
};
exports.farmIdState = new state_1.CachedState(state_1.StorageKey.FARM_ID, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.FARM, new URLSearchParams());
    return processFarmId(response.body);
}), {
    timeout: Number.POSITIVE_INFINITY,
    defaultState: -1,
    interceptors: [
        {
            match: [page_1.Page.FARM, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                yield state.set(processFarmId(root.body));
            }),
        },
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                const status = root.body.querySelector("a[href^='xfarm.php'] .item-after span");
                if (!status) {
                    return;
                }
                yield state.set(Number(status.dataset.id));
            }),
        },
    ],
});
const harvestAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const farmId = yield exports.farmIdState.get();
    yield (0, api_1.requestJSON)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.HARVEST_ALL, id: String(farmId) }));
});
exports.harvestAll = harvestAll;


/***/ }),

/***/ 182:
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
exports.collectAll = exports.kitchenStatusState = exports.OvenStatus = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(126);
const popup_1 = __webpack_require__(469);
var OvenStatus;
(function (OvenStatus) {
    OvenStatus["EMPTY"] = "empty";
    OvenStatus["COOKING"] = "cooking";
    OvenStatus["ATTENTION"] = "attention";
    OvenStatus["READY"] = "complete";
})(OvenStatus || (exports.OvenStatus = OvenStatus = {}));
const processKitchenStatus = (root) => {
    const statusText = root === null || root === void 0 ? void 0 : root.textContent;
    if (!statusText) {
        return {
            status: OvenStatus.EMPTY,
            count: 0,
            checkAt: Number.POSITIVE_INFINITY,
        };
    }
    // 36 READY!
    const count = Number(statusText.split(" ")[0]);
    let status = OvenStatus.EMPTY;
    let checkAt = Number.POSITIVE_INFINITY;
    if (statusText.toLowerCase().includes("cooking")) {
        status = OvenStatus.COOKING;
        checkAt = Date.now() + 60 * 1000;
    }
    else if (statusText.toLowerCase().includes("attention")) {
        status = OvenStatus.ATTENTION;
        checkAt = Date.now() + 60 * 1000;
    }
    else if (statusText.toLowerCase().includes("ready")) {
        status = OvenStatus.READY;
        checkAt = Number.POSITIVE_INFINITY;
    }
    return { status, count, checkAt };
};
const processKitchenPage = (root) => {
    const ovens = root.querySelectorAll("a[href^='oven.php']");
    const count = ovens.length;
    let status = OvenStatus.EMPTY;
    let checkAt = Number.POSITIVE_INFINITY;
    for (const oven of ovens) {
        const statusText = oven.querySelector(".item-after span");
        if (!(statusText === null || statusText === void 0 ? void 0 : statusText.dataset.countdownTo)) {
            continue;
        }
        const doneDate = (0, api_1.timestampToDate)(statusText.dataset.countdownTo);
        const now = new Date();
        if (doneDate < now) {
            status = OvenStatus.READY;
            checkAt = Math.min(checkAt, Number.POSITIVE_INFINITY);
            break;
        }
        const images = oven.querySelectorAll("img");
        if (images.length > 1 &&
            [OvenStatus.EMPTY, OvenStatus.COOKING].includes(status)) {
            status = OvenStatus.ATTENTION;
        }
        else if (status === OvenStatus.EMPTY) {
            status = OvenStatus.COOKING;
        }
        checkAt = Math.min(checkAt, Date.now() + 60 * 1000);
    }
    return { status, count, checkAt };
};
const scheduledUpdates = {};
exports.kitchenStatusState = new state_1.CachedState(state_1.StorageKey.KITHCEN_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.KITCHEN, new URLSearchParams());
    return processKitchenPage(response.body);
}), {
    timeout: 5,
    defaultState: {
        status: OvenStatus.EMPTY,
        count: 0,
        checkAt: Number.POSITIVE_INFINITY,
    },
    interceptors: [
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                const kitchenStatus = root === null || root === void 0 ? void 0 : root.querySelector("a[href='kitchen.php'] .item-after span");
                yield state.set(processKitchenStatus(kitchenStatus || undefined));
            }),
        },
        {
            match: [page_1.Page.KITCHEN, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                yield state.set(processKitchenPage(root.body));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MEALS }),
            ],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c;
                const root = yield (0, utils_1.getDocument)(response);
                const successCount = (_c = (_b = (_a = root.body.textContent) === null || _a === void 0 ? void 0 : _a.match(/success/g)) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                if (successCount) {
                    (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: `${successCount} meal${successCount === 1 ? "" : "s"} collected`,
                    });
                }
                yield state.set({
                    status: OvenStatus.EMPTY,
                    checkAt: Number.POSITIVE_INFINITY,
                });
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COOK_ALL })],
            callback: (settings, state) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set({
                    status: OvenStatus.COOKING,
                    checkAt: Date.now() + 60 * 1000,
                });
            }),
        },
    ],
});
const updateStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.kitchenStatusState.get({ doNotFetch: true });
    if (!state) {
        return;
    }
    if (state.checkAt < Date.now()) {
        yield exports.kitchenStatusState.get();
    }
});
// automatically update crops when finished
exports.kitchenStatusState.onUpdate((state) => {
    if (!state) {
        return;
    }
    if (scheduledUpdates[state.checkAt]) {
        return;
    }
    scheduledUpdates[state.checkAt] = setTimeout(updateStatus, state.checkAt - Date.now());
});
const collectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.COLLECT_ALL_MEALS }));
});
exports.collectAll = collectAll;


/***/ }),

/***/ 5250:
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
exports.mealsStatusState = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(126);
const scheduledUpdates = {};
const processMealStatus = (root) => {
    var _a;
    const mealList = (0, page_1.getListByTitle)(/Time-based Effects/, root);
    if (!mealList) {
        return { meals: [] };
    }
    const meals = [];
    for (const mealWrapper of mealList.children) {
        const mealName = (_a = mealWrapper.querySelector("strong")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!mealName) {
            continue;
        }
        const meal = mealName;
        const countdown = mealWrapper.querySelector("[data-countdown-to]");
        const finishedAt = (countdown === null || countdown === void 0 ? void 0 : countdown.dataset.countdownTo)
            ? (0, api_1.timestampToDate)(countdown.dataset.countdownTo).getTime()
            : Date.now();
        meals.push({ meal, finishedAt });
    }
    return { meals };
};
exports.mealsStatusState = new state_1.CachedState(state_1.StorageKey.MEALS_STATUS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.HOME_PATH);
    return processMealStatus(response.body);
}), {
    defaultState: {
        meals: [],
    },
    interceptors: [
        {
            match: [page_1.Page.HOME_PATH, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const root = yield (0, utils_1.getDocument)(response);
                yield state.set(processMealStatus(root.body));
            }),
        },
        {
            match: [page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.USE_ITEM })],
            callback: () => __awaiter(void 0, void 0, void 0, function* () {
                // request homepage to trigger meals state update
                yield (0, api_1.requestHTML)(page_1.Page.HOME_PATH);
            }),
        },
    ],
});
const removeFinishedMeals = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const state = yield exports.mealsStatusState.get({ doNotFetch: true });
    yield exports.mealsStatusState.set({
        meals: (_a = state === null || state === void 0 ? void 0 : state.meals.filter((meal) => meal.finishedAt < Date.now())) !== null && _a !== void 0 ? _a : [],
    });
});
// automatically remove meals when finished
exports.mealsStatusState.onUpdate((state) => {
    var _a;
    for (const meal of (_a = state === null || state === void 0 ? void 0 : state.meals) !== null && _a !== void 0 ? _a : []) {
        const { finishedAt } = meal;
        if (scheduledUpdates[finishedAt]) {
            continue;
        }
        scheduledUpdates[finishedAt] = setTimeout(removeFinishedMeals, finishedAt - Date.now());
    }
});


/***/ }),

/***/ 771:
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
exports.activatePerkSet = exports.resetPerks = exports.isActivePerkSet = exports.getCurrentPerkSet = exports.getActivityPerksSet = exports.perksState = exports.PerkActivity = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(126);
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
const processPerks = (root) => {
    var _a, _b;
    const perkSets = [];
    const setList = (0, page_1.getListByTitle)("My Perk Sets", root.body);
    const setWrappers = (_a = setList === null || setList === void 0 ? void 0 : setList.querySelectorAll(".item-title")) !== null && _a !== void 0 ? _a : [];
    let currentPerkSetId;
    for (const setWrapper of setWrappers) {
        const link = setWrapper.querySelector("a");
        const name = (_b = link === null || link === void 0 ? void 0 : link.textContent) !== null && _b !== void 0 ? _b : "";
        const id = Number(link === null || link === void 0 ? void 0 : link.dataset.id);
        const isActive = setWrapper.querySelector(".fa-check");
        if (isActive) {
            currentPerkSetId = id;
        }
        perkSets.push({ name, id });
    }
    return { perkSets, currentPerkSetId };
};
exports.perksState = new state_1.CachedState(state_1.StorageKey.PERKS_SETS, () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.requestHTML)(page_1.Page.PERKS);
    return processPerks(response);
}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: {
        perkSets: [],
        currentPerkSetId: undefined,
    },
    interceptors: [
        {
            match: [page_1.Page.PERKS, new URLSearchParams()],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                yield state.set(processPerks(yield (0, utils_1.getDocument)(response)));
            }),
        },
        {
            match: [
                page_1.Page.WORKER,
                new URLSearchParams({ go: page_1.WorkerGo.ACTIVATE_PERK_SET }),
            ],
            callback: (settings, state, previous, response) => __awaiter(void 0, void 0, void 0, function* () {
                const [_, query] = (0, state_1.parseUrl)(response.url);
                yield state.set({
                    currentPerkSetId: Number(query.get("id")),
                });
            }),
        },
    ],
});
const getActivityPerksSet = (activity, options) => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.perksState.get(options);
    return state === null || state === void 0 ? void 0 : state.perkSets.find(({ name }) => name === activity);
});
exports.getActivityPerksSet = getActivityPerksSet;
const getCurrentPerkSet = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const state = yield exports.perksState.get(options);
    return state === null || state === void 0 ? void 0 : state.perkSets.find(({ id }) => id === (state === null || state === void 0 ? void 0 : state.currentPerkSetId));
});
exports.getCurrentPerkSet = getCurrentPerkSet;
const isActivePerkSet = (set, options) => __awaiter(void 0, void 0, void 0, function* () {
    const current = yield (0, exports.getCurrentPerkSet)(options);
    return Boolean(current && current.id === set.id);
});
exports.isActivePerkSet = isActivePerkSet;
const resetPerks = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const state = yield exports.perksState.get();
    yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({ go: page_1.WorkerGo.RESET_PERKS }));
    exports.perksState.set({
        perkSets: (_a = state === null || state === void 0 ? void 0 : state.perkSets) !== null && _a !== void 0 ? _a : [],
        currentPerkSetId: undefined,
    });
});
exports.resetPerks = resetPerks;
const activatePerkSet = (set, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, exports.isActivePerkSet)(set, options)) {
        return;
    }
    console.debug(`Activating ${set.name} Perks`);
    yield (0, exports.resetPerks)();
    yield (0, api_1.requestHTML)(page_1.Page.WORKER, new URLSearchParams({
        go: page_1.WorkerGo.ACTIVATE_PERK_SET,
        id: set.id.toString(),
    }));
});
exports.activatePerkSet = activatePerkSet;


/***/ }),

/***/ 1604:
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
exports.latestVersionState = exports.SCRIPT_URL = void 0;
const state_1 = __webpack_require__(4619);
const utils_1 = __webpack_require__(7683);
exports.SCRIPT_URL = "https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand";
exports.latestVersionState = new state_1.CachedState(state_1.StorageKey.LATEST_VERSION, () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield (0, utils_1.corsFetch)(exports.SCRIPT_URL);
    const htmlString = yield response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    return (((_a = document.querySelector("dd.script-show-version")) === null || _a === void 0 ? void 0 : _a.textContent) || "1.0.0");
}), {
    timeout: 60 * 60 * 24, // 1 day
    defaultState: "1.0.0",
});


/***/ }),

/***/ 4619:
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
exports.CachedState = exports.watchQueries = exports.onFetchResponse = exports.queryInterceptors = exports.StorageKey = exports.toUrl = exports.urlMatches = exports.parseUrl = void 0;
const object_1 = __webpack_require__(7968);
const parseUrl = (url) => {
    // https://farmrpg.com/worker.php?cachebuster=271544&go=getchat&room=giveaways
    const truncatedUrl = url.replace("https://farmrpg.com/", "");
    // worker.php?cachebuster=271544&go=getchat&room=giveaways
    const [pageRaw, queryRaw] = truncatedUrl.split("?");
    const page = pageRaw.replace(".php", "");
    // worker
    const query = new URLSearchParams(queryRaw);
    // cachebuster=271544&go=getchat&room=giveaways
    return [page, query];
};
exports.parseUrl = parseUrl;
const urlMatches = (url, targetPage, targetQuery) => {
    const [page, query] = (0, exports.parseUrl)(url);
    if (page !== targetPage) {
        return false;
    }
    for (const key of targetQuery.keys()) {
        if (query.get(key) !== targetQuery.get(key)) {
            return false;
        }
    }
    return true;
};
exports.urlMatches = urlMatches;
const toUrl = (page, query) => {
    query = query !== null && query !== void 0 ? query : new URLSearchParams();
    query.set("cachebuster", Date.now().toString());
    return `https://farmrpg.com/${page}.php?${query.toString()}`;
};
exports.toUrl = toUrl;
var StorageKey;
(function (StorageKey) {
    StorageKey["CHAT_BANNERS"] = "chatBanners";
    StorageKey["CURRENT_PERKS_SET_ID"] = "currentPerksSetId";
    StorageKey["FARM_ID"] = "farmId";
    StorageKey["FARM_STATE"] = "farmState";
    StorageKey["FARM_STATUS"] = "farmStatus";
    StorageKey["IS_BETA"] = "isBeta";
    StorageKey["IS_CHAT_ENABLED"] = "isChatEnabled";
    StorageKey["IS_DARK_MODE"] = "isDarkMode";
    StorageKey["IS_MUSIC_ENABLED"] = "isMusicEnabled";
    StorageKey["ITEM_DATA"] = "itemData";
    StorageKey["KITHCEN_STATUS"] = "kitchenStatus";
    StorageKey["LATEST_VERSION"] = "latestVersion";
    StorageKey["MAILBOX"] = "mailbox";
    StorageKey["MEALS_STATUS"] = "mealsStatus";
    StorageKey["PAGE_DATA"] = "pageData";
    StorageKey["PERKS_SETS"] = "perkSets";
    StorageKey["RECENT_UPDATE"] = "recentUpdate";
    StorageKey["STATS"] = "stats";
    StorageKey["USERNAME"] = "username";
    StorageKey["USER_ID"] = "userId";
})(StorageKey || (exports.StorageKey = StorageKey = {}));
const generateEmptyRootState = () => {
    const state = {};
    for (const [_, value] of Object.entries(StorageKey)) {
        state[value] = JSON.stringify(undefined);
    }
    return state;
};
const rootState = generateEmptyRootState();
exports.queryInterceptors = [];
const onFetchResponse = (settings, response) => __awaiter(void 0, void 0, void 0, function* () {
    // only check farmrpg URLs
    if (!response.url.startsWith("https://farmrpg.com")) {
        return;
    }
    for (const [state, interceptor] of exports.queryInterceptors) {
        if ((0, exports.urlMatches)(response.url, ...interceptor.match)) {
            console.debug(`[STATE] fetch intercepted ${response.url}`, interceptor);
            const previous = yield state.get({ doNotFetch: true });
            interceptor.callback(settings, state, previous, response);
        }
    }
});
exports.onFetchResponse = onFetchResponse;
const watchQueries = (settings) => {
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.readyState !== 4) {
                        return;
                    }
                    // only check farmrpg URLs
                    if (!this.responseURL.startsWith("https://farmrpg.com")) {
                        return;
                    }
                    for (const [state, interceptor] of exports.queryInterceptors) {
                        if ((0, exports.urlMatches)(this.responseURL, ...interceptor.match)) {
                            console.debug(`[STATE] XMLHttpRequest intercepted ${this.responseURL}`, interceptor);
                            const previous = yield state.get({ doNotFetch: true });
                            interceptor.callback(settings, state, previous, {
                                headers: new Headers(),
                                ok: this.status >= 200 && this.status < 300,
                                redirected: false,
                                status: this.status,
                                statusText: this.statusText,
                                type: "default",
                                url: this.responseURL,
                                text: () => Promise.resolve(this.responseText),
                                json: () => Promise.resolve(JSON.parse(this.responseText)),
                                formData: () => Promise.resolve(new FormData()),
                                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                                blob: () => Promise.resolve(new Blob([this.responseText])),
                            });
                        }
                    }
                });
            }, false);
            // eslint-disable-next-line prefer-rest-params
            Reflect.apply(open, this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
    const originalFetch = window.fetch;
    window.fetch = (input, init) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield originalFetch(input, init);
        if (!response.hasBeenIntercepted) {
            response.hasBeenIntercepted = true;
            (0, exports.onFetchResponse)(settings, response.clone());
        }
        return response;
    });
    const originalFetchWorker = fetchWorker;
    fetchWorker = (action, parameters) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield originalFetchWorker(action, parameters);
        if (!response.hasBeenIntercepted) {
            response.hasBeenIntercepted = true;
            (0, exports.onFetchResponse)(settings, response.clone());
        }
        return response;
    });
};
exports.watchQueries = watchQueries;
class CachedState {
    constructor(key, fetch, { defaultState, timeout, updatedAt, interceptors = [], persist = true, }) {
        this.key = key;
        this.defaultState = defaultState;
        this.updatedAt = updatedAt !== null && updatedAt !== void 0 ? updatedAt : new Date(0);
        this.timeout = timeout !== null && timeout !== void 0 ? timeout : 60;
        this.fetch = fetch;
        this.updateListeners = [];
        this.persist = persist;
        for (const interceptor of interceptors) {
            exports.queryInterceptors.push([this, interceptor]);
        }
        rootState[this.key] = JSON.stringify(defaultState || undefined);
        this.load();
    }
    onUpdate(callback) {
        this.updateListeners.push(callback);
    }
    get() {
        return __awaiter(this, arguments, void 0, function* ({ ignoreCache, doNotFetch } = {}) {
            if (this.getting) {
                console.debug(`[STATE] Waiting for ${this.key} fetch`, this.getting);
                return yield this.getting;
            }
            this.getting = new Promise((resolve) => {
                if (!doNotFetch &&
                    (!rootState[this.key] ||
                        ignoreCache ||
                        this.updatedAt.getTime() + this.timeout * 1000 < Date.now())) {
                    console.debug(`[STATE] %cFetching ${this.key}`, {
                        ignoreCache,
                        updatedAt: this.updatedAt,
                        timeout: this.timeout,
                        previous: rootState[this.key],
                    }, "background-color: red; color: white;");
                    this.fetch().then((result) => {
                        this.set(result);
                        resolve(result);
                    });
                }
                else {
                    // console.debug(`[STATE] Returning cached ${this.key}`, {
                    //   ignoreCache,
                    //   updatedAt: this.updatedAt,
                    //   timeout: this.timeout,
                    //   previous: rootState[this.key],
                    // });
                    const raw = rootState[this.key];
                    resolve(raw ? JSON.parse(raw) : undefined);
                }
            });
            const result = yield this.getting;
            this.getting = undefined;
            return result;
        });
    }
    set(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const previous = yield this.get({ doNotFetch: true });
            const value = (0, object_1.isObject)(this.defaultState)
                ? Object.assign(Object.assign(Object.assign({}, this.defaultState), previous), input) : ((_a = input !== null && input !== void 0 ? input : previous) !== null && _a !== void 0 ? _a : this.defaultState);
            console.debug(`[STATE] Setting ${this.key}`, value);
            const encoded = JSON.stringify(value);
            this.updatedAt = value === undefined ? new Date(0) : new Date();
            rootState[this.key] = encoded;
            for (const listener of this.updateListeners) {
                listener(value);
            }
            if (this.persist) {
                yield GM.setValue(this.key, JSON.stringify([this.updatedAt.getTime(), encoded]));
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.persist) {
                return;
            }
            const raw = (yield GM.getValue(this.key));
            if (!raw) {
                return;
            }
            const result = JSON.parse(raw);
            if (!Array.isArray(result) ||
                result.length !== 2 ||
                typeof result[0] !== "number" ||
                typeof result[1] !== "string") {
                yield this.set(this.defaultState);
                return;
            }
            const [timestamp, encoded] = result;
            this.updatedAt = new Date(timestamp);
            rootState[this.key] = encoded;
        });
    }
    reset() {
        return this.set(this.defaultState);
    }
}
exports.CachedState = CachedState;


/***/ }),

/***/ 7683:
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
exports.getDocument = exports.corsFetch = void 0;
const corsFetch = (url, options) => new Promise((resolve, reject) => {
    var _a;
    GM.xmlHttpRequest(Object.assign(Object.assign({}, options), { method: (_a = options === null || options === void 0 ? void 0 : options.method) !== null && _a !== void 0 ? _a : "GET", url, onload: (response) => {
            resolve({
                headers: new Headers(),
                ok: response.status >= 200 && response.status < 300,
                redirected: url !== response.finalUrl,
                status: response.status,
                statusText: response.statusText,
                type: "default",
                url: response.finalUrl,
                text: () => Promise.resolve(response.responseText),
                json: () => Promise.resolve(JSON.parse(response.responseText)),
                formData: () => Promise.resolve(new FormData()),
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob([response.responseText])),
            });
        }, onerror: reject, onabort: reject, ontimeout: reject }));
});
exports.corsFetch = corsFetch;
const getDocument = (response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const htmlString = yield response.text();
    return new DOMParser().parseFromString(htmlString, "text/html");
});
exports.getDocument = getDocument;


/***/ }),

/***/ 8477:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autocompleteItems = exports.SETTING_AUTOCOMPLETE_ITEMS = void 0;
const api_1 = __webpack_require__(3413);
const autocomplete_1 = __webpack_require__(4067);
exports.SETTING_AUTOCOMPLETE_ITEMS = {
    id: "autocompleteItems",
    title: "Chat: Autocomplete ((items))",
    description: "Auto-complete item names in chat",
    type: "boolean",
    defaultValue: true,
};
exports.autocompleteItems = {
    settings: [exports.SETTING_AUTOCOMPLETE_ITEMS],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_AUTOCOMPLETE_ITEMS.id].value) {
            return;
        }
        (0, autocomplete_1.registerAutocomplete)({
            trigger: /\(\(([^]+)/,
            getItems: api_1.getBasicItems,
            prefix: "((",
            suffix: "))",
            bail: (text) => { var _a, _b; return ((_b = (_a = text.match(/(\(\(|\)\))/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) % 2 === 0; },
        });
    },
};


/***/ }),

/***/ 5881:
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
const autocomplete_1 = __webpack_require__(4067);
exports.SETTING_AUTOCOMPLETE_USERS = {
    id: "autocompleteUsers",
    title: "Chat: Autocomplete @Users:",
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
            bail: (text) => { var _a, _b; return ((_b = (_a = text.match(/(@|:)/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) % 2 === 0; },
        });
    },
};


/***/ }),

/***/ 8092:
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
const bank_1 = __webpack_require__(9022);
const page_1 = __webpack_require__(7952);
const confirmation_1 = __webpack_require__(3906);
const popup_1 = __webpack_require__(469);
const theme_1 = __webpack_require__(1178);
exports.SETTING_BANKER = {
    id: "banker",
    title: "Bank: Banker",
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
    onPageLoad: (settings, page) => {
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
        let targetBalanceDiv = document.querySelector(".fh-banker-target-balance");
        if (!targetBalanceDiv) {
            targetBalanceDiv = document.createElement("div");
            targetBalanceDiv.classList.add("card-content-inner");
            targetBalanceDiv.classList.add("fh-banker-target-balance");
            targetBalanceDiv.innerHTML = `
      Target Balance: <strong style="color: ${targetBalance === balance ? theme_1.TEXT_SUCCESS : theme_1.TEXT_WARNING}">${formatter.format(targetBalance)} Silver</strong>
    `;
            (_d = balanceCard.firstElementChild) === null || _d === void 0 ? void 0 : _d.append(targetBalanceDiv);
        }
        const availableInterest = Math.max(0, balance - targetBalance);
        // use title to find the bulk options section
        const bulkOptionsList = (0, page_1.getListByTitle)("Bulk Options");
        if (!bulkOptionsList) {
            console.error("Bulk Options list not found");
            return;
        }
        // deposit target balance button
        let depositTargetLi = document.querySelector(".fh-banker-deposit-target");
        if (!depositTargetLi) {
            const missingFromTarget = Math.max(0, targetBalance - balance);
            depositTargetLi = document.createElement("li");
            depositTargetLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel fh-banker-deposit-target"
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
                    yield (0, bank_1.depositSilver)(missingFromTarget);
                    yield (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: "You deposited Silver!",
                    });
                    window.location.reload();
                }));
            });
            bulkOptionsList.insertBefore(depositTargetLi, 
            // eslint-disable-next-line unicorn/prefer-at
            bulkOptionsList.children[bulkOptionsList.children.length - 1]);
        }
        // withdraw interest button
        let withdrawInterestLi = document.querySelector(".fh-banker-withdraw-interest");
        if (!withdrawInterestLi) {
            withdrawInterestLi = document.createElement("li");
            withdrawInterestLi.innerHTML = `
      <a
        href="#"
        data-view=".view-main"
        class="item-link close-panel fh-banker-withdraw-interest"
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
                    yield (0, bank_1.withdrawSilver)(availableInterest);
                    yield (0, popup_1.showPopup)({
                        title: "Success!",
                        contentHTML: "You withdrew Silver!",
                    });
                    window.location.reload();
                }));
            });
            bulkOptionsList.insertBefore(withdrawInterestLi, 
            // eslint-disable-next-line unicorn/prefer-at
            bulkOptionsList.children[bulkOptionsList.children.length - 1]);
        }
    },
};


/***/ }),

/***/ 2273:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buddyFarm = exports.SETTING_BUDDY_FARM = void 0;
const page_1 = __webpack_require__(7952);
const state_1 = __webpack_require__(4456);
exports.SETTING_BUDDY_FARM = {
    id: "buddyFarm",
    title: "Item: Buddy's Almanac",
    description: "Add shortcut to look up items and quests on buddy.farm",
    type: "boolean",
    defaultValue: true,
};
exports.buddyFarm = {
    settings: [exports.SETTING_BUDDY_FARM],
    onPageLoad: (settings, page) => {
        var _a, _b, _c, _d, _e;
        // make sure setting is enabled
        if (!settings[exports.SETTING_BUDDY_FARM.id].value) {
            return;
        }
        // make sure page content has loaded
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        // handle item pages
        if (page === page_1.Page.ITEM) {
            // find header to get item data
            const itemHeader = document.querySelector(".sharelink");
            if (!itemHeader) {
                console.error("Item header not found");
                return;
            }
            // get name and link for item
            const itemName = (_a = itemHeader.textContent) !== null && _a !== void 0 ? _a : "";
            const itemLink = `https://buddy.farm/i/${(0, state_1.nameToSlug)(itemName)}`;
            // use title to find item details section
            const titles = currentPage.querySelectorAll(".content-block-title");
            const itemDetailsTitle = [...titles].find((title) => title.textContent === "Item Details");
            const itemDetailsCard = itemDetailsTitle === null || itemDetailsTitle === void 0 ? void 0 : itemDetailsTitle.nextElementSibling;
            const itemDetailsList = itemDetailsCard === null || itemDetailsCard === void 0 ? void 0 : itemDetailsCard.querySelector("ul");
            if (!itemDetailsList) {
                console.error("Item Details list not found");
                return;
            }
            // remove existing link
            (_b = document.querySelector(".fh-buddyshortcut")) === null || _b === void 0 ? void 0 : _b.remove();
            // create a new item detail for buddy.farm link
            const buddyFarmLinkLi = document.createElement("li");
            buddyFarmLinkLi.classList.add("close-panel");
            buddyFarmLinkLi.classList.add("fh-buddyshortcut");
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
        }
        // handle quest pages
        if (page === page_1.Page.QUEST) {
            // find header to get item data
            const questHeader = currentPage.querySelector(".item-title");
            if (!questHeader) {
                console.error("Quest header not found");
                return;
            }
            // get name and link for item
            const questName = (_c = questHeader.textContent) !== null && _c !== void 0 ? _c : "";
            const questLink = `https://buddy.farm/q/${(0, state_1.nameToSlug)(questName)}`;
            // find last card to insert
            const card = (_d = (0, page_1.getCardByTitle)("This Help Request is Visible")) !== null && _d !== void 0 ? _d : (0, page_1.getCardByTitle)("This Help Request is Hidden");
            if (!card) {
                console.error("last card not found");
                return;
            }
            // remove existing link
            (_e = document.querySelector(".fh-buddyshortcut")) === null || _e === void 0 ? void 0 : _e.remove();
            // create a new item detail for buddy.farm link
            const buddyFarmLink = document.createElement("div");
            buddyFarmLink.classList.add("list-block");
            buddyFarmLink.classList.add("fh-buddyshortcut");
            buddyFarmLink.innerHTML = `
        <ul>
          <li>
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
                    href="${questLink}"
                    onclick="window.open('${questLink}', '_blank');return false;"
                    class="button btngreen"
                    style="height:28px"
                  >OPEN</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      `;
            // insert at top
            card.insertBefore(buddyFarmLink, card.firstChild);
        }
    },
};


/***/ }),

/***/ 6922:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chatNav = void 0;
const theme_1 = __webpack_require__(1178);
const openAutocomplete = (dropdown) => {
    const currentLink = document.querySelector(".cclinkselected");
    const links = [
        ...document.querySelectorAll("#desktopchatpanel .cclink"),
    ];
    if (!links || !currentLink) {
        return;
    }
    links.sort((a, b) => { var _a, _b, _c; return (_c = (_a = a.textContent) === null || _a === void 0 ? void 0 : _a.localeCompare((_b = b.textContent) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : 0; });
    const menu = document.createElement("div");
    menu.classList.add("fh-chatdropdown-menu");
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.position = "absolute";
    menu.style.top = "100%";
    menu.style.left = "0";
    menu.style.width = "100%";
    menu.style.background = theme_1.BACKGROUND_DARK;
    menu.style.zIndex = "9999";
    for (const link of links) {
        if (link.dataset.channel === currentLink.dataset.channel) {
            continue;
        }
        const option = document.createElement("div");
        option.textContent = link.textContent;
        option.style.cursor = "pointer";
        option.style.padding = "10px";
        option.addEventListener("click", () => {
            link.click();
            closeAutocomplete();
        });
        menu.append(option);
    }
    dropdown.append(menu);
};
const closeAutocomplete = () => {
    var _a;
    (_a = document.querySelector(".fh-chatdropdown-menu")) === null || _a === void 0 ? void 0 : _a.remove();
};
exports.chatNav = {
    onInitialize: () => {
        document.head.insertAdjacentHTML(`beforeend`, `
      <style>
        /* Hide original chat nav */
        .cclink {
          display: none !important;
        }
      <style>
    `);
    },
    onChatLoad: () => {
        const currentLink = document.querySelector(".cclinkselected");
        if (!currentLink) {
            return;
        }
        const dropdowns = [
            ...document.querySelectorAll(".fh-chatdropdown"),
        ];
        // create dropdowns if we haven't
        if (dropdowns.length === 0) {
            for (const title of document.querySelectorAll(".content-block-title.item-input")) {
                title.style.margin = "0";
                title.style.marginTop = "-5px";
                title.style.overflow = "visible";
                title.style.display = "flex";
                const dropdown = document.createElement("div");
                dropdown.classList.add("fh-chatdropdown");
                dropdown.style.cursor = "pointer";
                dropdown.style.textTransform = "titlecase";
                dropdown.style.width = "calc(100% - 44px)";
                dropdown.style.height = "44px";
                dropdown.style.display = "flex";
                dropdown.style.alignContent = "center";
                dropdown.style.justifyContent = "center";
                dropdown.style.flexWrap = "wrap";
                dropdowns.push(dropdown);
                dropdown.addEventListener("click", () => {
                    const menu = document.querySelector(".fh-chatdropdown-menu");
                    if (menu) {
                        closeAutocomplete();
                    }
                    else {
                        openAutocomplete(title);
                    }
                });
                title.append(dropdown);
                const refresh = document.createElement("i");
                refresh.classList.add("fa");
                refresh.classList.add("fw");
                refresh.classList.add("fa-refresh");
                refresh.style.cursor = "pointer";
                refresh.style.width = "44px";
                refresh.style.height = "44px";
                refresh.style.display = "flex";
                refresh.style.alignItems = "center";
                refresh.style.justifyContent = "center";
                refresh.addEventListener("click", () => {
                    var _a;
                    (_a = document.querySelector(".cclinkselected")) === null || _a === void 0 ? void 0 : _a.click();
                });
                title.append(refresh);
            }
        }
        // update dropdown content
        for (const dropdown of dropdowns) {
            if (dropdown.dataset.channel !== currentLink.dataset.channel) {
                dropdown.innerHTML = `
          ${currentLink.textContent}
          <i class="fa fw fa-caret-down" style="margin-left: 5px;"></i>
        `;
                dropdown.dataset.channel = currentLink.dataset.channel;
            }
        }
    },
};


/***/ }),

/***/ 2742:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanupExplore = exports.SETTING_EXPLORE_RESULTS = void 0;
const page_1 = __webpack_require__(7952);
exports.SETTING_EXPLORE_RESULTS = {
    id: "",
    title: "Explore: Improved Layout",
    description: "Larger icons and stable sort",
    type: "boolean",
    defaultValue: true,
};
let maxHeight = 0;
exports.cleanupExplore = {
    settings: [exports.SETTING_EXPLORE_RESULTS],
    onPageLoad: (settings, page) => {
        if (!page || ![page_1.Page.AREA, page_1.Page.FISHING].includes(page)) {
            return;
        }
        if (!settings[exports.SETTING_EXPLORE_RESULTS.id].value) {
            return;
        }
        // get console
        const console = document.querySelector("#consoletxt");
        if (!console || !console.parentElement) {
            return;
        }
        console.parentElement.style.height = "200px";
        const observer = new MutationObserver(() => {
            const results = console.querySelector("span[style='font-size:11px']");
            if (!results) {
                return;
            }
            const icons = results.querySelectorAll("img");
            if (!icons) {
                return;
            }
            const sortedIcons = [...icons].sort((a, b) => a.src.localeCompare(b.src));
            const improvedLayout = document.createElement("div");
            improvedLayout.style.display = "flex";
            improvedLayout.style.flexWrap = "wrap";
            improvedLayout.style.justifyContent = "center";
            improvedLayout.style.alignItems = "center";
            improvedLayout.style.gap = "10px";
            improvedLayout.style.width = "100%";
            improvedLayout.style.marginTop = "10px";
            improvedLayout.innerHTML = `
      ${sortedIcons
                .map((icon) => {
                var _a, _b;
                return `
            <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
              <img src="${icon.src}" style="${icon.getAttribute("style")};width:36px!important">
              <span style="text-size:13px;">${(_b = (_a = icon.nextSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()}</span>
            </div>
          `;
            })
                .join("")}
    `;
            results.style.display = "none";
            setTimeout(() => {
                maxHeight = Math.max(console.offsetHeight, maxHeight);
                console.style.minHeight = `${maxHeight}px`;
                console.style.display = "block";
            });
            results.after(improvedLayout);
        });
        observer.observe(console, { childList: true });
    },
};


/***/ }),

/***/ 5870:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanupHome = exports.SETTING_COMPRESS_SKILLS = exports.SETTING_HIDE_FOOTER = exports.SETTING_HIDE_THEME = exports.SETTING_HIDE_PLAYERS = void 0;
const page_1 = __webpack_require__(7952);
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
        if (settings[exports.SETTING_HIDE_PLAYERS.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide players card */
            [data-page="${page_1.Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title,
            [data-page="${page_1.Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title + .card {
              display: none !important;
            }
          <style>
        `);
        }
        if (settings[exports.SETTING_HIDE_THEME.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide theme switcher */
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:nth-of-type(1),
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:nth-of-type(2) {
              display: none !important;
            }
          <style>
        `);
        }
        if (settings[exports.SETTING_HIDE_FOOTER.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > p:last-of-type,
            [data-page="${page_1.Page.HOME_PAGE}"] .page-content > div:last-of-type {
              display: none !important;
            }
          <style>
        `);
        }
    },
    onPageLoad: (settings, page) => {
        var _a, _b;
        if (page !== page_1.Page.HOME_PAGE) {
            return;
        }
        if (!settings[exports.SETTING_COMPRESS_SKILLS.id].value) {
            return;
        }
        // get wrappers
        const skillsCard = (0, page_1.getCardByTitle)(/my skills/i);
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
    },
};


/***/ }),

/***/ 4056:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.collapseItemImage = exports.SETTING_COLLAPSE_ITEM = void 0;
const page_1 = __webpack_require__(7952);
exports.SETTING_COLLAPSE_ITEM = {
    id: "collapseItem",
    title: "Item: Collapse Item Image",
    description: "Move item image in header to save space",
    type: "boolean",
    defaultValue: false,
};
exports.collapseItemImage = {
    settings: [exports.SETTING_COLLAPSE_ITEM],
    onInitialize: (settings) => {
        if (settings[exports.SETTING_COLLAPSE_ITEM.id].value) {
            document.head.insertAdjacentHTML("beforeend", `
          <style>
            /* Hide item image and description */
            [data-page="item"] #img {
              display: none !important;
            }
            
            /* Hide first section title */
            [data-page="item"] #img + .content-block-title {
              display: none !important;
            }
          </style>
        `);
        }
    },
    onPageLoad: (settings, page) => {
        // make sure we're on the item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const itemImage = document.querySelector("#img img");
        if (!itemImage) {
            console.error("Item image not found");
            return;
        }
        // wait for animations
        const sharelink = document.querySelector(".view-main .center .sharelink");
        if (!sharelink) {
            return;
        }
        let smallImage = sharelink.querySelector("img");
        if (!smallImage) {
            smallImage = document.createElement("img");
        }
        sharelink.style.display = "flex";
        sharelink.style.alignItems = "center";
        sharelink.style.gap = "10px";
        smallImage.src = itemImage.src;
        smallImage.style.width = "30px";
        sharelink.prepend(smallImage);
    },
};


/***/ }),

/***/ 8181:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compactSilver = exports.SETTING_COMPACT_SILVER = void 0;
exports.SETTING_COMPACT_SILVER = {
    id: "compactSilver",
    title: "Wallet: Compact silver",
    description: "Display compact numbers for silver over 1M",
    type: "boolean",
    defaultValue: true,
};
exports.compactSilver = {
    onQuestLoad: () => {
        var _a, _b, _c;
        for (const silver of document.querySelectorAll("#statszone span:first-child")) {
            if (!silver || silver.dataset.compactSilver) {
                continue;
            }
            const icon = silver.querySelector("img");
            const amount = Number((_b = (_a = icon === null || icon === void 0 ? void 0 : icon.nextSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().replaceAll(",", ""));
            if (Number.isNaN(amount)) {
                continue;
            }
            if (amount < 1000000) {
                continue;
            }
            (_c = icon === null || icon === void 0 ? void 0 : icon.nextSibling) === null || _c === void 0 ? void 0 : _c.replaceWith(amount > 1000000000
                ? // eslint-disable-next-line no-irregular-whitespace
                    ` ${(amount / 1000000000).toFixed(1)}B  `
                : // eslint-disable-next-line no-irregular-whitespace
                    ` ${(amount / 1000000).toFixed(1)}M  `);
            silver.dataset.compactSilver = "true";
        }
    },
};


/***/ }),

/***/ 223:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compressChat = exports.SETTING_CHAT_COMPRESS = void 0;
const theme_1 = __webpack_require__(1178);
exports.SETTING_CHAT_COMPRESS = {
    id: "compressChat",
    title: "Chat: Compress messages",
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
          .page-content {
            padding-right: 0 !important; 
            margin-right: -2px !important;
          }
          #desktopchatpanel {
            border-color: ${theme_1.BORDER_GRAY};
            border-top: 0 !important;
          }
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

/***/ 2827:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.navigationStyle = exports.SETTINGS_NAVIGATION_ADD_MENU = exports.SETTING_NAVIGATION_ALIGN_BOTTOM = exports.SETTING_NAVIGATION_HIDE_LOGO = exports.SETTING_NAVIGATION_COMPRESS = void 0;
exports.SETTING_NAVIGATION_COMPRESS = {
    id: "compressNav",
    title: "Menu: Reduce Whitespace",
    description: `Reduces whitespace in navigation to make space for more items`,
    type: "boolean",
    defaultValue: false,
};
exports.SETTING_NAVIGATION_HIDE_LOGO = {
    id: "noLogoNav",
    title: "Menu: Hide Logo",
    description: `Hides Farm RPG logo in Navigation`,
    type: "boolean",
    defaultValue: true,
};
exports.SETTING_NAVIGATION_ALIGN_BOTTOM = {
    id: "alignBottomNav",
    title: "Menu: Align to Bottom",
    description: `Aligns Navigation menu to bottom of screen for easier reach on mobile`,
    type: "boolean",
    defaultValue: false,
};
exports.SETTINGS_NAVIGATION_ADD_MENU = {
    id: "bottomMenu",
    title: "Menu: Add Shortcut to Bottom",
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
        // hide buttons until we can replace them
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .icon.icon-bars,
          .refreshbtn .f7-icons {
            display: none !important;
          }
        <style>
      `);
        // align toolbar more consistently
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .toolbar-inner {
            display: flex !important;
            justify-content: end !important;
            padding: 0 !important;
          }

          .toolbar-inner .link {
            display: none !important;
          }

          @media (min-width: 768px) {
            .fh-menu {
              display: none !important;
            }
          }

          .toolbar-inner a {
            height: 100%;
            border: 0;
            background: transparent;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 15px !important;
            border-radius: 0 !important;
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
        // responsive bottom links
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* responsive bottom links */
          @media (max-width: 420px) {
          .toolbar-inner > .button i {
            margin-right: 50px !important;
          }
          .toolbar-inner > .button {
            display: block !important;
            width: 28px !important;
          }
        <style>
      `);
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
    onPageLoad: () => {
        for (const icon of document.querySelectorAll(".icon.icon-bars")) {
            icon.style.color = "white";
            icon.classList.remove("icon");
            icon.classList.remove("icon-bars");
            icon.classList.add("fa");
            icon.classList.add("fw");
            icon.classList.add("fa-bars");
        }
        for (const refresh of document.querySelectorAll(".refreshbtn")) {
            refresh.style.color = "white";
            refresh.classList.remove("fv-icons");
            refresh.textContent = "";
            refresh.classList.add("fa");
            refresh.classList.add("fw");
            refresh.classList.add("fa-refresh");
        }
    },
};


/***/ }),

/***/ 2224:
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
const theme_1 = __webpack_require__(1178);
const farmhandSettings_1 = __webpack_require__(8973);
const confirmation_1 = __webpack_require__(3906);
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
const renderNavigation = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (force = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const navigationData = yield (0, farmhandSettings_1.getData)(exports.SETTING_CUSTOM_NAVIGATION, DEFAULT_NAVIGATION);
    const navigationList = document.querySelector(".panel-left ul");
    if (!navigationList) {
        console.error("Could not find navigation list");
        return;
    }
    if (!force && navigationList.dataset.isCustomized) {
        // already rendered
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
                renderNavigation(true);
            }));
        });
        navigationTitleLeft.append(resetButton);
    }
    navigationList.innerHTML = "";
    navigationList.dataset.isCustomized = "true";
    navigationList.dataset.isEditing = String(state.isEditing);
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
            var _a;
            event.preventDefault();
            event.stopPropagation();
            if (!event.target) {
                return;
            }
            item.icon = (_a = event.target.dataset.icon) !== null && _a !== void 0 ? _a : "";
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation(true);
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
            renderNavigation(true);
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
            renderNavigation(true);
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
            renderNavigation(true);
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
            renderNavigation(true);
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
            renderNavigation(true);
        });
        (_k = navigationItem
            .querySelector(".fh-delete")) === null || _k === void 0 ? void 0 : _k.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            navigationData.splice(currentIndex, 1);
            yield (0, farmhandSettings_1.setData)(exports.SETTING_CUSTOM_NAVIGATION, navigationData);
            renderNavigation(true);
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
            renderNavigation(true);
        }));
        navigationList.append(addNavigationItem);
    }
});
exports.customNavigation = {
    settings: [exports.SETTING_CUSTOM_NAVIGATION],
    onMenuLoad: (settings) => {
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
        if (navigationTitleRight.children.length === 0) {
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
                renderNavigation(true);
            });
            navigationTitleRight.append(configurationButton);
        }
        renderNavigation();
    },
};


/***/ }),

/***/ 5164:
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
exports.dismissableChatBanners = exports.SETTING_CHAT_DISMISSABLE_BANNERS = void 0;
const popup_1 = __webpack_require__(469);
const state_1 = __webpack_require__(4619);
exports.SETTING_CHAT_DISMISSABLE_BANNERS = {
    id: "dismissableChatBanners",
    title: "Chat: Dismissable Banners",
    description: `
    Adds × in chat banners to dismiss them<br>
    Disable this to show dismissed banners again
  `,
    buttonText: "Reset",
    buttonAction: () => __awaiter(void 0, void 0, void 0, function* () {
        const keys = yield GM.listValues();
        for (const key of keys) {
            if (key.startsWith(state_1.StorageKey.CHAT_BANNERS)) {
                yield GM.deleteValue(key);
            }
        }
        yield (0, popup_1.showPopup)({
            title: "Chat banners reset",
            contentHTML: "Previously dismissed chat banners will be shown again",
        });
    }),
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
    onChatLoad: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_DISMISSABLE_BANNERS.id].value) {
            return;
        }
        const banners = document.querySelectorAll("#desktopchatpanel .card, #mobilechatpanel .card");
        for (const banner of banners) {
            const bannerKey = `${state_1.StorageKey.CHAT_BANNERS}_${hashBanner(banner)}`;
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
    }),
};


/***/ }),

/***/ 8973:
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
const page_1 = __webpack_require__(7952);
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
    title: "Settings: Export",
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
        (0, popup_1.showPopup)({
            title: "Settings Exported to clipboard",
            contentHTML: "Open Farm RPG on another device with Farmhand installed to import",
        });
        const input = settingWrapper.querySelector(".fh-input");
        if (input) {
            input.value = exportString;
        }
    }),
};
exports.SETTING_IMPORT = {
    id: "import",
    title: "Settings: Import",
    description: "Paste export into box and click Import",
    type: "string",
    defaultValue: "",
    placeholder: "Paste Here",
    buttonText: "Import",
    buttonAction: (settings, settingWrapper) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const input = (_a = settingWrapper.querySelector(".fh-input")) === null || _a === void 0 ? void 0 : _a.value;
        const importedSettings = JSON.parse(input !== null && input !== void 0 ? input : "[]");
        for (const setting of importedSettings) {
            yield (0, exports.setSetting)(setting);
            if (setting.data) {
                yield (0, exports.setData)(setting, setting.data);
            }
        }
        yield (0, popup_1.showPopup)({
            title: "Farmhand Settings Imported!",
            contentHTML: "Page will reload to apply",
        });
        window.location.reload();
    }),
};
exports.farmhandSettings = {
    settings: [exports.SETTING_EXPORT, exports.SETTING_IMPORT],
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* Allow action buttons next to switches */
        .label-switch {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          width: auto !important; 
        }
      <style>
    `);
    },
    onPageLoad: (settings, page) => {
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
        let farmhandSettingsLi = settingsList.querySelector(".fh-settings-title");
        if (farmhandSettingsLi) {
            // already rendered
            return;
        }
        farmhandSettingsLi = document.createElement("li");
        farmhandSettingsLi.classList.add("list-group-title");
        farmhandSettingsLi.classList.add("item-divider");
        farmhandSettingsLi.classList.add("fh-settings-title");
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
            (_a = settingLi
                .querySelector(".fh-action")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
                var _a;
                event.preventDefault();
                event.stopPropagation();
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

/***/ 2100:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fishinInBarrel = exports.SETTING_FISH_IN_BARREL = void 0;
exports.SETTING_FISH_IN_BARREL = {
    id: "fishInBarrel",
    title: "Fishing: Barrel Mode",
    description: "Fish always appear in middle of pond",
    type: "boolean",
    defaultValue: true,
};
exports.fishinInBarrel = {
    settings: [exports.SETTING_FISH_IN_BARREL],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_FISH_IN_BARREL.id].value) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* Move fish to middle */
          .fish {
            position: absolute;
            top: calc(50% - 30px);
            left: calc(50% - 30px);
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 9361:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fleaMarket = exports.SETTING_FLEA_MARKET = void 0;
exports.SETTING_FLEA_MARKET = {
    id: "fleaMarket",
    title: "Flea Market: Disable",
    description: "Flea Market is disabled because it's a waste of gold",
    type: "boolean",
    defaultValue: true,
};
exports.fleaMarket = {
    settings: [exports.SETTING_FLEA_MARKET],
    onInitialize: (settings) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_FLEA_MARKET.id].value) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* Hide Flea Market in Town */
          a[href="flea.php"] {
            display: none;
          }

          /* Hide Flea Market Page */
          .page[page="flea"] {
            display: none;
          }

          /* Hide Flea Market in Inventory */
          .close-panel:has(a[href="flea.php"]) {
            display: none;
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 4894:
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
exports.fieldNotifications = exports.SETTING_HARVEST_POPUP = void 0;
const farm_1 = __webpack_require__(9888);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const state_1 = __webpack_require__(4619);
const SETTING_HARVEST_NOTIFICATIONS = {
    id: "harvestNotifications",
    title: "Farm: Harvest Notifications",
    description: `
    Show notification when crops are ready to harvest
  `,
    type: "boolean",
    defaultValue: true,
};
exports.SETTING_HARVEST_POPUP = {
    id: "harvestPopup",
    title: "Farm: Harvest Popup",
    description: `
    Show popup on Farm page when crops are harvested with the harvest results including bonuses</br>
    (popup is always shown if havesting from other pages via the notification)
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_EMPTY_NOTIFICATIONS = {
    id: "emptyNotifications",
    title: "Farm: Empty Notifications",
    description: `
    Show notification when fields are empty
  `,
    type: "boolean",
    defaultValue: true,
};
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.HARVEST, farm_1.harvestAll);
const renderFields = (settings, state) => __awaiter(void 0, void 0, void 0, function* () {
    const farmId = yield farm_1.farmIdState.get();
    if (!state) {
        return;
    }
    if (state.status === farm_1.CropStatus.EMPTY &&
        settings[SETTING_EMPTY_NOTIFICATIONS.id].value) {
        (0, notifications_1.sendNotification)({
            class: "btnorange",
            id: notifications_1.NotificationId.FIELD,
            text: "Fields are empty!",
            href: (0, state_1.toUrl)(page_1.Page.FARM, new URLSearchParams({ id: String(farmId) })),
        });
    }
    else if (state.status === farm_1.CropStatus.READY &&
        settings[SETTING_HARVEST_NOTIFICATIONS.id].value) {
        const farmUrl = (0, state_1.toUrl)(page_1.Page.FARM, new URLSearchParams({ id: String(farmId) }));
        (0, notifications_1.sendNotification)({
            class: "btngreen",
            id: notifications_1.NotificationId.FIELD,
            text: "Crops are ready!",
            href: farmUrl,
            actions: [
                { text: "View", href: farmUrl },
                {
                    text: "Harvest",
                    handler: notifications_1.Handler.HARVEST,
                },
            ],
        });
    }
    else {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.FIELD);
    }
});
exports.fieldNotifications = {
    settings: [
        SETTING_HARVEST_NOTIFICATIONS,
        exports.SETTING_HARVEST_POPUP,
        SETTING_EMPTY_NOTIFICATIONS,
    ],
    onInitialize: (settings) => {
        farm_1.farmStatusState.onUpdate((state) => renderFields(settings, state));
    },
};


/***/ }),

/***/ 5454:
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
exports.highlightSelfInChat = exports.SETTING_CHAT_HIGHLIGHT_SELF = void 0;
const theme_1 = __webpack_require__(1178);
const api_1 = __webpack_require__(126);
exports.SETTING_CHAT_HIGHLIGHT_SELF = {
    id: "highlightSelfInChat",
    title: "Chat: Highlight self",
    description: "Highlight messages in chat where you are @mentioned",
    type: "boolean",
    defaultValue: true,
};
exports.highlightSelfInChat = {
    settings: [exports.SETTING_CHAT_HIGHLIGHT_SELF],
    onChatLoad: (settings) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure setting is enabled
        if (!settings[exports.SETTING_CHAT_HIGHLIGHT_SELF.id].value) {
            return;
        }
        const username = yield api_1.usernameState.get();
        if (!username) {
            console.error("Could not find username");
            return;
        }
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
    }),
};


/***/ }),

/***/ 1108:
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
exports.improvedInputs = exports.SETTING_IMPROVED_INPUTS = void 0;
const theme_1 = __webpack_require__(1178);
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(3413);
const dropdown_1 = __webpack_require__(9946);
exports.SETTING_IMPROVED_INPUTS = {
    id: "improvedInputs",
    title: "UI: Improved Inputs",
    description: "Consistent button and field styling and improved item selector UI",
    type: "boolean",
    defaultValue: true,
};
exports.improvedInputs = {
    settings: [exports.SETTING_IMPROVED_INPUTS],
    onInitialize: (settings) => {
        if (!settings[exports.SETTING_IMPROVED_INPUTS.id].value) {
            return;
        }
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          .newinput,
          input[type="number"]:not(#vaultcode),
          input[type="text"]:not(#chat_txt_desktop) {
            ${(0, theme_1.toCSS)(theme_1.INPUT_STYLES)}
          }

          .modal {
            border-radius: 0;
            border: 2px solid #c5c5c5;
            border-bottom: 0;
            overflow: visible;
          }

          .list-block .item-after {
            max-height: initial;
          }

          .pages .button:not([class*=".btn"]),
          .modal-button,
          .button.btngreen,
          .tosswellbtn,
          .cookallbtn {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GREEN_STYLES)}
          }

          .modal-button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 -2px;
            height: 44px !important;
            width: calc(100% + 4px) !important;
          }
          
          .modal-button:last-child {
            margin-bottom: -2px;
          }

          select, .inlineinputlg {
            ${(0, theme_1.toCSS)(theme_1.INPUT_STYLES)}
          }
          
          .button.btnred[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_RED_STYLES)} 
          }

          .button.btnorange[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_ORANGE_STYLES)}
          }
          
          .button.btnblue[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_BLUE_STYLES)}
          }

          button[class*="qty"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GRAY_DARK_STYLES)}
          }
          
          .button.btnpurple[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_PURPLE_STYLES)}
          }

          .button.btngray[class*="btn"] {
            ${(0, theme_1.toCSS)(theme_1.BUTTON_GRAY_STYLES)}
          }

          .buttons-row .button[class*="btn"] {
            height: inherit !important;
            width: inherit !important;
            flex: 1 !important;
          }
        </style>
      `);
    },
    onPageLoad: (settings) => {
        var _a;
        if (!settings[exports.SETTING_IMPROVED_INPUTS.id].value) {
            return;
        }
        const selector = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector("select[class*='id']:not(.locide):not(.type_id)");
        if (!selector) {
            return;
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const options = yield Promise.all([...selector.options].map((option) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                if (option.dataset.name === "Shovel") {
                    const shovel = yield (0, api_1.getItemByName)("Shovel");
                    return {
                        name: "Dig Up",
                        quantity: Number(option.dataset.amt),
                        icon: (_a = shovel === null || shovel === void 0 ? void 0 : shovel.image) !== null && _a !== void 0 ? _a : "",
                        value: option.value,
                        proxyOption: option,
                    };
                }
                const match = (_b = option.textContent) === null || _b === void 0 ? void 0 : _b.match(/^(.*) \(([\d,]+)\)$/);
                if (!match) {
                    console.error("Failed to parse option", option);
                    return;
                }
                const [, name, quantity] = match;
                const item = yield (0, api_1.getItemByName)(name);
                if (!item) {
                    console.error("Failed to get item", name);
                    return;
                }
                return {
                    name,
                    quantity: Number(quantity.replaceAll(",", "")),
                    icon: item.image,
                    value: option.value,
                    proxyOption: option,
                };
            })));
            (0, dropdown_1.replaceSelect)(selector, options.filter((option) => option !== undefined));
        }))();
    },
};


/***/ }),

/***/ 9737:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kitchenNotifications = void 0;
const kitchen_1 = __webpack_require__(182);
const notifications_1 = __webpack_require__(6783);
const page_1 = __webpack_require__(7952);
const state_1 = __webpack_require__(4619);
const SETTING_COMPLETE_NOTIFICATIONS = {
    id: "harvestNotifications",
    title: "Kitchen: Meals ready notification",
    description: `
    Show notification when meals are ready to collect
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_ATTENTION_NOTIFICATIONS = {
    id: "attentionNotifications",
    title: "Kitchen: Ovens attention notification",
    description: `
    Show notification when ovens need attention
  `,
    type: "boolean",
    defaultValue: true,
};
const SETTING_EMPTY_NOTIFICATIONS = {
    id: "emptyNotifications",
    title: "Kitchen: Ovens empty notification",
    description: `
    Show notification when ovens are empty
  `,
    type: "boolean",
    defaultValue: true,
};
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.COLLECT_MEALS, kitchen_1.collectAll);
const renderOvens = (settings, state) => {
    if (!state) {
        return;
    }
    if (state.status === kitchen_1.OvenStatus.EMPTY &&
        settings[SETTING_EMPTY_NOTIFICATIONS.id].value) {
        (0, notifications_1.sendNotification)({
            class: "btnorange",
            id: notifications_1.NotificationId.OVEN,
            text: "Ovens are empty!",
            href: (0, state_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
        });
    }
    else if (state.status === kitchen_1.OvenStatus.ATTENTION &&
        settings[SETTING_ATTENTION_NOTIFICATIONS.id].value) {
        (0, notifications_1.sendNotification)({
            class: "btnorange",
            id: notifications_1.NotificationId.OVEN,
            text: "Ovens need attention",
            href: (0, state_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
        });
    }
    else if (state.status === kitchen_1.OvenStatus.READY &&
        settings[SETTING_COMPLETE_NOTIFICATIONS.id].value) {
        (0, notifications_1.sendNotification)({
            class: "btngreen",
            id: notifications_1.NotificationId.OVEN,
            text: "Meals are ready!",
            href: (0, state_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()),
            actions: [
                { text: "View", href: (0, state_1.toUrl)(page_1.Page.KITCHEN, new URLSearchParams()) },
                {
                    text: "Collect",
                    handler: notifications_1.Handler.COLLECT_MEALS,
                },
            ],
        });
    }
    else {
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.OVEN);
    }
};
exports.kitchenNotifications = {
    settings: [
        SETTING_COMPLETE_NOTIFICATIONS,
        SETTING_ATTENTION_NOTIFICATIONS,
        SETTING_EMPTY_NOTIFICATIONS,
    ],
    onInitialize: (settings) => {
        kitchen_1.kitchenStatusState.onUpdate((state) => renderOvens(settings, state));
    },
};


/***/ }),

/***/ 7092:
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
exports.linkifyQuickCraft = void 0;
const page_1 = __webpack_require__(7952);
const api_1 = __webpack_require__(3413);
exports.linkifyQuickCraft = {
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure we're on the item page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const missingIngredientsWrapper = currentPage.querySelector("span[style='color:red']");
        if (!missingIngredientsWrapper) {
            return;
        }
        const missingIngredients = (_a = missingIngredientsWrapper.textContent) === null || _a === void 0 ? void 0 : _a.split(", ");
        missingIngredientsWrapper.textContent = "";
        for (const ingredient of missingIngredients !== null && missingIngredients !== void 0 ? missingIngredients : []) {
            const data = yield (0, api_1.getItemByName)(ingredient);
            if (!data) {
                console.error(`No data for ${ingredient}`);
                continue;
            }
            const link = document.createElement("a");
            link.dataset.view = ".view-main";
            link.href = `item.php?id=${data.id}`;
            link.textContent = ingredient;
            link.style.color = "red";
            link.style.marginRight = "5px";
            link.style.display = "block";
            missingIngredientsWrapper.append(link);
        }
    }),
};


/***/ }),

/***/ 9735:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxContainers = exports.SETTING_MAX_CONTAINERS = void 0;
const debounce_1 = __webpack_require__(4276);
const page_1 = __webpack_require__(7952);
exports.SETTING_MAX_CONTAINERS = {
    id: "maxContainers",
    title: "Locksmith: Max containers",
    description: "Open max containers by default (instead of 1)",
    type: "boolean",
    defaultValue: true,
};
exports.maxContainers = {
    settings: [exports.SETTING_MAX_CONTAINERS],
    onPageLoad: (settings, page) => {
        if (!settings[exports.SETTING_MAX_CONTAINERS.id].value) {
            return;
        }
        if (page !== page_1.Page.LOCKSMITH) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const observer = new MutationObserver((0, debounce_1.debounce)(() => {
            // get inputs
            const inputs = document.querySelectorAll("input.qty[type='number']");
            // if we only have 1 input, we can't be sure whether the user or the app changed it
            if (inputs.length <= 1) {
                return;
            }
            // if any of them are not 1, the app didn't do it
            if ([...inputs].some((input) => ["0", "1"].includes(input.value))) {
                return;
            }
            // get buttons
            const buttons = document.querySelectorAll("button.lsmaxqty");
            for (const button of buttons) {
                button.click();
            }
        }));
        observer.observe(currentPage, { childList: true, subtree: true });
    },
};


/***/ }),

/***/ 1103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxCows = void 0;
const page_1 = __webpack_require__(7952);
const maxPigs_1 = __webpack_require__(2934);
exports.maxCows = {
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.PASTURE) {
            return;
        }
        if (!settings[maxPigs_1.SETTING_MAX_ANIMALS.id].value) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        // max buy cows
        (() => {
            var _a;
            const pigTitle = (0, page_1.getTitle)(/Cows/);
            const match = (_a = pigTitle === null || pigTitle === void 0 ? void 0 : pigTitle.textContent) === null || _a === void 0 ? void 0 : _a.match(/(\d+) \/ (\d+)/);
            if (!match) {
                return;
            }
            const [_, current, max] = match;
            if (!current || !max) {
                return;
            }
            const maxBuy = Number(max) - Number(current);
            const buyField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".addamt");
            if (!buyField) {
                return;
            }
            buyField.value = maxBuy.toString();
        })();
        // max slaughter
        (() => {
            var _a;
            const slaughterSelector = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelid");
            if (!slaughterSelector) {
                return;
            }
            if (slaughterSelector.options.length > 1) {
                slaughterSelector.selectedIndex = 1;
            }
            const match = (_a = slaughterSelector.options[1].textContent) === null || _a === void 0 ? void 0 : _a.match(/\((\d+)\)/);
            if (!match) {
                return;
            }
            const maxSlaughter = Number(match[1]);
            const amountField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelamt");
            if (!amountField) {
                return;
            }
            amountField.value = maxSlaughter.toString();
        })();
    },
};


/***/ }),

/***/ 2934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxPigs = exports.SETTING_MAX_ANIMALS = void 0;
const page_1 = __webpack_require__(7952);
exports.SETTING_MAX_ANIMALS = {
    id: "maxAnimals",
    title: "Farm: Buy Max Animals",
    description: "Buy max animals by default (instead of 1)",
    type: "boolean",
    defaultValue: true,
};
exports.maxPigs = {
    settings: [exports.SETTING_MAX_ANIMALS],
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.PIG_PEN) {
            return;
        }
        if (!settings[exports.SETTING_MAX_ANIMALS.id].value) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        // max buy pigs
        (() => {
            var _a;
            const pigTitle = (0, page_1.getTitle)(/Pigs/);
            const match = (_a = pigTitle === null || pigTitle === void 0 ? void 0 : pigTitle.textContent) === null || _a === void 0 ? void 0 : _a.match(/(\d+) \/ (\d+)/);
            if (!match) {
                return;
            }
            const [_, current, max] = match;
            if (!current || !max) {
                return;
            }
            const maxBuy = Number(max) - Number(current);
            const buyField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".addamt");
            if (!buyField) {
                return;
            }
            buyField.value = maxBuy.toString();
        })();
        // max slaughter
        (() => {
            var _a;
            const slaughterSelector = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelid");
            if (!slaughterSelector) {
                return;
            }
            if (slaughterSelector.options.length > 1) {
                slaughterSelector.selectedIndex = 1;
            }
            const match = (_a = slaughterSelector.options[1].textContent) === null || _a === void 0 ? void 0 : _a.match(/\((\d+)\)/);
            if (!match) {
                return;
            }
            const maxSlaughter = Number(match[1]);
            const amountField = currentPage === null || currentPage === void 0 ? void 0 : currentPage.querySelector(".levelamt");
            if (!amountField) {
                return;
            }
            amountField.value = maxSlaughter.toString();
        })();
    },
};


/***/ }),

/***/ 5792:
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
exports.mealNotifications = void 0;
const meals_1 = __webpack_require__(5250);
const notifications_1 = __webpack_require__(6783);
const SETTING_MEAL_NOTIFICATIONS = {
    id: "mealNotifications",
    title: "Meal Notifications",
    description: `
    Show notification when meals are active with their countdowns
  `,
    type: "boolean",
    defaultValue: true,
};
let mealInterval;
const renderMeals = () => __awaiter(void 0, void 0, void 0, function* () {
    const mealStatus = yield meals_1.mealsStatusState.get();
    if (!mealStatus || mealStatus.meals.length === 0) {
        clearInterval(mealInterval);
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.MEAL);
        return;
    }
    (0, notifications_1.sendNotification)({
        class: "btnorange",
        id: notifications_1.NotificationId.MEAL,
        text: `${mealStatus.meals.length} meal${mealStatus.meals.length === 1 ? "" : "s"} active: ${mealStatus.meals
            .map((active) => {
            const now = new Date();
            const diffSeconds = active.finishedAt / 1000 - now.getTime() / 1000;
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = Math.floor(diffSeconds % 60);
            if (minutes < 0 && seconds < 0) {
                meals_1.mealsStatusState.set({
                    meals: mealStatus.meals.filter((meal) => meal.meal !== active.meal),
                });
                return `${active.meal} (EXPIRED!)`;
            }
            const timeRemaining = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
            return `${active.meal} (${timeRemaining})`;
        })
            .join(", ")}`,
    });
    if (!mealInterval) {
        mealInterval = setInterval(renderMeals, 1 * 1000);
    }
});
exports.mealNotifications = {
    settings: [SETTING_MEAL_NOTIFICATIONS],
    onInitialize: (settings) => {
        if (!settings[SETTING_MEAL_NOTIFICATIONS.id].value) {
            return;
        }
        meals_1.mealsStatusState.onUpdate(renderMeals);
    },
};


/***/ }),

/***/ 4414:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.miner = void 0;
const theme_1 = __webpack_require__(1178);
const page_1 = __webpack_require__(7952);
const SETTING_MINER = {
    id: "miner",
    title: "Mining: Auto Miner",
    description: "Adds button to take the next suggested action",
    type: "boolean",
    defaultValue: true,
};
const SETTING_MINER_EXPLOSIVES = {
    id: "minerExplosives",
    title: "Mining: Use Explosives",
    description: "Use explosives as suggested action",
    type: "boolean",
    defaultValue: true,
};
const SETTING_MINER_BOMBS = {
    id: "minerBombs",
    title: "Mining: Use Bombs",
    description: "Use bombs as suggested action",
    type: "boolean",
    defaultValue: false,
};
const getStatus = (cell) => {
    var _a, _b, _c;
    if (!cell.classList.contains("marked")) {
        return "unexplored";
    }
    const icon = cell.firstElementChild;
    if (!icon) {
        return "unknown";
    }
    if (icon.tagName === "IMG") {
        return "discovered";
    }
    if ((_a = icon.getAttribute("style")) === null || _a === void 0 ? void 0 : _a.includes("color:yellow")) {
        return "miss";
    }
    if ((_b = cell.getAttribute("style")) === null || _b === void 0 ? void 0 : _b.includes("background-color:#cc0000;")) {
        return "trap";
    }
    if ((_c = icon.getAttribute("style")) === null || _c === void 0 ? void 0 : _c.includes("color:black")) {
        return "hit";
    }
    if (icon.classList.contains("fa-pickaxe")) {
        return "extra";
    }
    if (icon.classList.contains("fa-sparkles")) {
        return "xp";
    }
    return "unknown";
};
const getCellAt = (board, x, y) => {
    const rowIndex = y - 1;
    if (rowIndex < 0 || rowIndex >= board.length) {
        return undefined;
    }
    const columnIndex = x - 1;
    if (columnIndex < 0 || columnIndex >= board[rowIndex].length) {
        return undefined;
    }
    return board[rowIndex][columnIndex];
};
const fillHints = (board) => {
    // loop over all cells
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const row = board[rowIndex];
        for (const cell of row) {
            if (cell.status !== "unexplored") {
                cell.isCandidate = false;
                continue;
            }
            let hasDirection = false;
            let isNextToHit = false;
            const left = getCellAt(board, cell.x - 1, cell.y);
            if (left && ["unexplored", "hit"].includes(left.status)) {
                hasDirection = true;
                if (left.status === "hit") {
                    isNextToHit = true;
                }
            }
            const right = getCellAt(board, cell.x + 1, cell.y);
            if (right && ["unexplored", "hit"].includes(right.status)) {
                hasDirection = true;
                if (right.status === "hit") {
                    isNextToHit = true;
                }
            }
            const top = getCellAt(board, cell.x, cell.y - 1);
            if (top && ["unexplored", "hit"].includes(top.status)) {
                hasDirection = true;
                if (top.status === "hit") {
                    isNextToHit = true;
                }
            }
            const bottom = getCellAt(board, cell.x, cell.y + 1);
            if (bottom && ["unexplored", "hit"].includes(bottom.status)) {
                hasDirection = true;
                if (bottom.status === "hit") {
                    isNextToHit = true;
                }
            }
            cell.isNextToHit = isNextToHit;
            cell.isCandidate = hasDirection;
        }
    }
};
const tryCell = (cell) => {
    cell.element.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
};
exports.miner = {
    settings: [SETTING_MINER, SETTING_MINER_EXPLOSIVES, SETTING_MINER_BOMBS],
    onPageLoad: (settings, page) => {
        if (page !== page_1.Page.MINING) {
            return;
        }
        if (!settings[SETTING_MINER.id].value) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const magicButton = document.createElement("div");
        magicButton.style.position = "absolute";
        magicButton.style.right = "20px";
        magicButton.style.bottom = "80px";
        magicButton.style.cursor = "pointer";
        magicButton.style.zIndex = "999999";
        magicButton.style.height = "60px";
        magicButton.style.width = "60px";
        magicButton.style.borderRadius = "100%";
        magicButton.style.backgroundColor = theme_1.BUTTON_GREEN_BACKGROUND;
        magicButton.style.borderWidth = "2px";
        magicButton.style.borderColor = theme_1.BUTTON_GREEN_BORDER;
        magicButton.style.borderStyle = "solid";
        magicButton.style.color = theme_1.TEXT_WHITE;
        magicButton.style.display = "flex";
        magicButton.style.justifyContent = "center";
        magicButton.style.alignItems = "center";
        magicButton.innerHTML = `<i class="fa fa-wand-sparkles fa-2x fa-fw" />`;
        magicButton.addEventListener("click", () => {
            // go to next level if available
            const nextLevelButton = currentPage.querySelector(".nextlevelbtn");
            if (nextLevelButton && nextLevelButton.style.display !== "none") {
                nextLevelButton.click();
                return;
            }
            // use explosives if available
            const explosivesButton = currentPage.querySelector(".useexplosivebtn:not(.disabled)");
            if (explosivesButton) {
                explosivesButton.click();
                return;
            }
            // otherwise use pickaxe
            const picks = currentPage.querySelector("#pickaxes");
            if (!picks) {
                return;
            }
            const pickCount = Number(picks.textContent || "0");
            // no picks, make more
            if (!pickCount) {
                picks.click();
            }
            // get boared state
            const board = [];
            const cells = currentPage.querySelectorAll(".checkCell");
            const size = Math.sqrt(cells.length);
            for (let rowIndex = 0; rowIndex < size; rowIndex++) {
                board.push([]);
                for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                    const cell = cells[rowIndex * size + columnIndex];
                    board[rowIndex].push({
                        element: cell,
                        isMarked: cell.classList.contains("marked"),
                        x: Number(cell.dataset.x),
                        y: Number(cell.dataset.y),
                        status: getStatus(cell),
                    });
                }
            }
            // fill in deductions
            fillHints(board);
            // get candidates
            const candidates = board.flat().filter((cell) => cell.isCandidate);
            // get candidates next to hits
            const nextToHits = candidates.filter((cell) => cell.isNextToHit);
            // if there are any, click the first one
            // TODO: prioritize based on alignment
            if (nextToHits.length > 0) {
                tryCell(nextToHits[0]);
                return;
            }
            // click a random candidate
            // TODO: prioritize based on checkerboard pattern from center
            tryCell(candidates[Math.floor(Math.random() * candidates.length) || 0]);
        });
        currentPage.append(magicButton);
    },
};


/***/ }),

/***/ 4417:
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
const page_1 = __webpack_require__(7952);
const state_1 = __webpack_require__(4619);
exports.moveUpdateToTop = {
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // make sure we're on the home page
        if (page !== page_1.Page.HOME_PAGE) {
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
        const latestRead = yield GM.getValue(state_1.StorageKey.RECENT_UPDATE, "");
        if (latestUpdate === latestRead) {
            return;
        }
        // move to top
        const home = (0, page_1.getCurrentPage)();
        if (!home) {
            return;
        }
        const firstTitle = (0, page_1.getTitle)("Where do you want to go?");
        if (!firstTitle) {
            return;
        }
        firstTitle.before(recentUpdatesTitle);
        firstTitle.before(recentUpdatesCard);
        // add hide button
        let hideButton = recentUpdatesTitle.querySelector(".fh-hide-update");
        if (!hideButton) {
            hideButton = document.createElement("a");
            hideButton.classList.add("fh-hide-update");
            hideButton.style.marginLeft = "10px";
            hideButton.style.cursor = "pointer";
            hideButton.textContent = "Hide";
            hideButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                // mark current as read
                yield GM.setValue(state_1.StorageKey.RECENT_UPDATE, latestUpdate);
                window.location.reload();
            }));
            recentUpdatesTitle.append(hideButton);
        }
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
const perks_1 = __webpack_require__(771);
const page_1 = __webpack_require__(7952);
const notifications_1 = __webpack_require__(6783);
const quickSellSafely_1 = __webpack_require__(8760);
exports.SETTING_PERK_MANAGER = {
    id: "perkManager",
    title: "Perks: Auto manage",
    description: `
    1. Save your default perks set as "Default"<br>
    2. Save perks for "Crafting", "Fishing", "Exploring", "Selling", "Friendship", "Temple", "Locksmish", or "Wheel" activities<br>
    3. Activity perk sets will automatically be enabled for those activities and reverted to "Default" after
  `,
    type: "boolean",
    defaultValue: true,
};
const getNotification = (activity) => ({
    class: "btnorange",
    id: notifications_1.NotificationId.PERKS,
    text: `${activity} perks activated`,
});
exports.perkManagment = {
    settings: [exports.SETTING_PERK_MANAGER],
    onPageLoad: (settings, page) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // make sure the setting is enabled
        if (!settings[exports.SETTING_PERK_MANAGER.id].value) {
            return;
        }
        // don't change anything on perks page so you can edit
        if (page === page_1.Page.PERKS) {
            return;
        }
        const defaultPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.DEFAULT);
        // make sure we have a default perk set
        if (!defaultPerks) {
            console.warn("Default perk set not found");
            return;
        }
        const craftingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.CRAFTING);
        if (craftingPerks && page === page_1.Page.WORKSHOP) {
            yield (0, perks_1.activatePerkSet)(craftingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.CRAFTING));
            return;
        }
        if (craftingPerks) {
            const quickcraftButton = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".quickcraftbtn");
            if (quickcraftButton && !quickcraftButton.style.display) {
                quickcraftButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "CRAFT";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(craftingPerks);
                    (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.CRAFTING));
                    quickcraftButton.click();
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }));
                (_b = quickcraftButton.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(proxyButton, quickcraftButton);
            }
        }
        const fishingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.FISHING);
        if (fishingPerks && page === page_1.Page.FISHING) {
            yield (0, perks_1.activatePerkSet)(fishingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FISHING));
            return;
        }
        const exploringPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.EXPLORING);
        if (exploringPerks && page === page_1.Page.AREA) {
            yield (0, perks_1.activatePerkSet)(exploringPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.EXPLORING));
            return;
        }
        const sellingPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.SELLING);
        if (sellingPerks && page === page_1.Page.FARMERS_MARKET) {
            yield (0, perks_1.activatePerkSet)(sellingPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.SELLING));
            return;
        }
        if (sellingPerks) {
            (0, quickSellSafely_1.onQuicksellClick)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, perks_1.activatePerkSet)(sellingPerks);
                (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.SELLING));
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }), 1000);
                return true;
            }));
        }
        const friendshipPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.FRIENDSHIP);
        if (friendshipPerks &&
            (page === page_1.Page.FRIENDSHIP || page === page_1.Page.MAILBOX)) {
            yield (0, perks_1.activatePerkSet)(friendshipPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FRIENDSHIP));
            return;
        }
        if (friendshipPerks) {
            const quickgiveButton = (_c = (0, page_1.getCurrentPage)()) === null || _c === void 0 ? void 0 : _c.querySelector(".quickgivebtn");
            if (quickgiveButton && !quickgiveButton.style.display) {
                quickgiveButton.style.display = "none";
                const proxyButton = document.createElement("button");
                proxyButton.classList.add("button");
                proxyButton.classList.add("btngreen");
                proxyButton.style.height = "28px;";
                proxyButton.textContent = "GIVE";
                proxyButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, perks_1.activatePerkSet)(friendshipPerks);
                    (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.FRIENDSHIP));
                    quickgiveButton.click();
                    yield (0, perks_1.activatePerkSet)(defaultPerks);
                    (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
                }));
                (_d = quickgiveButton.parentElement) === null || _d === void 0 ? void 0 : _d.insertBefore(proxyButton, quickgiveButton);
            }
        }
        const templePerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.TEMPLE);
        if (templePerks && page === page_1.Page.TEMPLE) {
            yield (0, perks_1.activatePerkSet)(templePerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.TEMPLE));
            return;
        }
        const locksmithPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.LOCKSMITH);
        if (locksmithPerks && page === page_1.Page.LOCKSMITH) {
            yield (0, perks_1.activatePerkSet)(locksmithPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.LOCKSMITH));
            return;
        }
        const wheelPerks = yield (0, perks_1.getActivityPerksSet)(perks_1.PerkActivity.WHEEL);
        if (wheelPerks && page === page_1.Page.WHEEL) {
            yield (0, perks_1.activatePerkSet)(wheelPerks);
            (0, notifications_1.sendNotification)(getNotification(perks_1.PerkActivity.WHEEL));
            return;
        }
        (0, perks_1.activatePerkSet)(defaultPerks);
        (0, notifications_1.removeNotification)(notifications_1.NotificationId.PERKS);
    }),
};


/***/ }),

/***/ 1768:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.questCollapse = exports.SETTING_QUEST_COLLAPSE = void 0;
const page_1 = __webpack_require__(7952);
exports.SETTING_QUEST_COLLAPSE = {
    id: "questCollapse",
    title: "Quest: Global collapse status",
    description: "Remember the quest details collapse status globally instead of per-quest",
    type: "boolean",
    defaultValue: true,
};
exports.questCollapse = {
    settings: [exports.SETTING_QUEST_COLLAPSE],
    onPageLoad: (settings, page) => {
        // make sure setting is enabled
        if (!settings[exports.SETTING_QUEST_COLLAPSE.id].value) {
            return;
        }
        // make sure we're on a quest page
        if (page !== page_1.Page.QUEST) {
            return;
        }
        // find accordion item
        const accordion = document.querySelector(".accordion-helprequest");
        if (!accordion) {
            console.error("Item header not found");
            return;
        }
        const isCollapsed = !accordion.classList.contains("accordion-item-expanded");
        const link = accordion.querySelector("a");
        if (!link) {
            return;
        }
        link.addEventListener("click", () => {
            setTimeout(() => {
                localStorage.questCollapse = !accordion.classList.contains("accordion-item-expanded");
            }, 500);
        });
        if (isCollapsed && localStorage.questCollapse === "false") {
            accordion.classList.add("accordion-item-expanded");
        }
        if (!isCollapsed && localStorage.questCollapse === "true") {
            accordion.classList.remove("accordion-item-expanded");
        }
    },
};


/***/ }),

/***/ 3710:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.quests = void 0;
const theme_1 = __webpack_require__(1178);
exports.quests = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        /* make room for minimize button */
        #statszone > div {
          padding-right: 15px !important;
        }
        /* make line prettier */
        #statszone hr {
          height: 1px;
          background-color: ${theme_1.BORDER_GRAY};
          border: none;
        }
      <style>
    `);
    },
    onQuestLoad: () => {
        var _a;
        const popup = document.querySelector(".aqp");
        if (!popup) {
            return;
        }
        popup.dataset.isMinimized = (_a = popup.dataset.isMinimized) !== null && _a !== void 0 ? _a : "false";
        // skip adding close button if it already exists
        if (popup.querySelector(".fh-minimize")) {
            return;
        }
        const minimizeButton = document.createElement("i");
        minimizeButton.classList.add("fh-minimize");
        minimizeButton.classList.add("fa");
        minimizeButton.classList.add("fw");
        minimizeButton.classList.add("fa-chevron-down");
        minimizeButton.style.position = "absolute";
        minimizeButton.style.top = "10px";
        minimizeButton.style.right = "10px";
        minimizeButton.style.cursor = "pointer";
        minimizeButton.addEventListener("click", () => {
            if (popup.dataset.isMinimized === "true") {
                minimizeButton.classList.remove("fa-chevron-up");
                minimizeButton.classList.add("fa-chevron-down");
                popup.style.top = "auto";
                popup.dataset.isMinimized = "false";
            }
            else {
                minimizeButton.classList.remove("fa-chevron-down");
                minimizeButton.classList.add("fa-chevron-up");
                popup.style.top = "70px";
                popup.dataset.isMinimized = "true";
            }
        });
        popup.append(minimizeButton);
    },
};


/***/ }),

/***/ 8760:
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
exports.quicksellSafely = exports.onQuicksellClick = exports.SETTING_QUICKSELL_SAFELY = void 0;
const page_1 = __webpack_require__(7952);
exports.SETTING_QUICKSELL_SAFELY = {
    id: "quicksellSafely",
    title: "Item: Safe Quick Sell",
    description: "If item is locked, also lock the Quick Sell and Quick Give buttons",
    type: "boolean",
    defaultValue: true,
};
const state = {
    onQuicksellClick: [],
};
const onQuicksellClick = (callback) => {
    state.onQuicksellClick.push(callback);
};
exports.onQuicksellClick = onQuicksellClick;
exports.quicksellSafely = {
    settings: [exports.SETTING_QUICKSELL_SAFELY],
    onPageLoad: (settings, page) => {
        var _a, _b, _c, _d, _e, _f;
        // make sure we're on the right page
        if (page !== page_1.Page.ITEM) {
            return;
        }
        const isSafetyOn = settings[exports.SETTING_QUICKSELL_SAFELY.id].value;
        const lockButton = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".lockbtn");
        const unlockButton = (_b = (0, page_1.getCurrentPage)()) === null || _b === void 0 ? void 0 : _b.querySelector(".unlockbtn");
        const isLocked = unlockButton && !lockButton;
        const quicksellButton = (_c = (0, page_1.getCurrentPage)()) === null || _c === void 0 ? void 0 : _c.querySelector(".quicksellbtn, .quicksellbtnnc");
        if (quicksellButton && !quicksellButton.style.display) {
            quicksellButton.style.display = "none";
            const proxyButton = document.createElement("button");
            proxyButton.classList.add("button");
            proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
            proxyButton.style.height = "28px;";
            if (!isSafetyOn || !isLocked) {
                proxyButton.textContent = "SELL";
            }
            if (isSafetyOn && isLocked) {
                const lock = document.createElement("i");
                lock.classList.add("f7-icons");
                lock.style.fontSize = "17px";
                lock.textContent = "unlock_fill";
                proxyButton.append(lock);
            }
            proxyButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                if (isSafetyOn && isLocked) {
                    unlockButton.click();
                    return;
                }
                for (const callback of state.onQuicksellClick) {
                    if (!(yield callback(event))) {
                        return;
                    }
                }
                quicksellButton.click();
            }));
            (_d = quicksellButton.parentElement) === null || _d === void 0 ? void 0 : _d.insertBefore(proxyButton, quicksellButton);
        }
        const quickgiveButton = (_e = (0, page_1.getCurrentPage)()) === null || _e === void 0 ? void 0 : _e.querySelector(".quickgivebtn");
        if (quickgiveButton && !quickgiveButton.style.display) {
            quickgiveButton.style.display = "none";
            const proxyButton = document.createElement("button");
            proxyButton.classList.add("button");
            proxyButton.classList.add(isSafetyOn && isLocked ? "btnred" : "btngreen");
            proxyButton.style.height = "28px;";
            if (!isSafetyOn || !isLocked) {
                proxyButton.textContent = "GIVE";
            }
            if (isSafetyOn && isLocked) {
                const lock = document.createElement("i");
                lock.classList.add("f7-icons");
                lock.style.fontSize = "17px";
                lock.textContent = "unlock_fill";
                proxyButton.append(lock);
            }
            proxyButton.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                if (isSafetyOn && isLocked) {
                    unlockButton.click();
                    return;
                }
                for (const callback of state.onQuicksellClick) {
                    if (!(yield callback(event))) {
                        return;
                    }
                }
                quickgiveButton.click();
            }));
            (_f = quickgiveButton.parentElement) === null || _f === void 0 ? void 0 : _f.insertBefore(proxyButton, quickgiveButton);
        }
    },
};


/***/ }),

/***/ 3026:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.vaultSolver = void 0;
const vault_1 = __webpack_require__(2279);
const theme_1 = __webpack_require__(1178);
const page_1 = __webpack_require__(7952);
const SETTING_VAULT_SOLVER = {
    id: "vaultSolver",
    title: "Vault: Auto Solver",
    description: "Auto-fill solution suggestions in the vault input box",
    type: "boolean",
    defaultValue: true,
};
exports.vaultSolver = {
    settings: [SETTING_VAULT_SOLVER],
    onPageLoad: (settings, page) => {
        var _a;
        if (page !== page_1.Page.VAULT) {
            return;
        }
        if (!settings[SETTING_VAULT_SOLVER.id].value) {
            return;
        }
        const currentPage = (0, page_1.getCurrentPage)();
        if (!currentPage) {
            return;
        }
        const magicButton = document.createElement("div");
        magicButton.style.position = "absolute";
        magicButton.style.right = "20px";
        magicButton.style.bottom = "80px";
        magicButton.style.cursor = "pointer";
        magicButton.style.zIndex = "999999";
        magicButton.style.height = "60px";
        magicButton.style.width = "60px";
        magicButton.style.borderRadius = "100%";
        magicButton.style.backgroundColor = theme_1.BUTTON_GREEN_BACKGROUND;
        magicButton.style.borderWidth = "2px";
        magicButton.style.borderColor = theme_1.BUTTON_GREEN_BORDER;
        magicButton.style.borderStyle = "solid";
        magicButton.style.color = theme_1.TEXT_WHITE;
        magicButton.style.display = "flex";
        magicButton.style.justifyContent = "center";
        magicButton.style.alignItems = "center";
        magicButton.innerHTML = `<i class="fa fa-wand-sparkles fa-2x fa-fw" />`;
        magicButton.addEventListener("click", () => {
            var _a;
            // click new vault button if available
            const newVaultButton = currentPage.querySelector(".resetbtn");
            if (newVaultButton) {
                newVaultButton.click();
                return;
            }
            // click more guesses button if available
            const moreTriesButton = currentPage.querySelector(".moretriesbtn");
            if (moreTriesButton) {
                moreTriesButton.click();
            }
            // otherwise, submit the current guess
            (_a = currentPage.querySelector(".vcbtn")) === null || _a === void 0 ? void 0 : _a.click();
        });
        currentPage.append(magicButton);
        const input = document.querySelector("#vaultcode");
        if (!input) {
            console.error("Input not found");
            return;
        }
        let info = (0, vault_1.generateDigitInfo)();
        const guessElements = document.querySelectorAll("[data-page='crack'] .row");
        const guesses = [];
        for (const [, guessElement] of guessElements.entries()) {
            const digitElements = guessElement.querySelectorAll(".col-25");
            if (digitElements.length > 0) {
                const guess = [0, 0, 0, 0];
                const hints = [vault_1.Hint.NONE, vault_1.Hint.NONE, vault_1.Hint.NONE, vault_1.Hint.NONE];
                for (const [position, digitElement] of digitElements.entries()) {
                    guess[position] = Number((_a = digitElement.textContent) === null || _a === void 0 ? void 0 : _a.slice(-1));
                    hints[position] =
                        // eslint-disable-next-line no-nested-ternary
                        digitElement.dataset.type === "B"
                            ? vault_1.Hint.CORRECT
                            : digitElement.dataset.type === "Y"
                                ? vault_1.Hint.CLOSE
                                : vault_1.Hint.NONE;
                }
                guesses.push(guess);
                info = (0, vault_1.applyGuess)(info, guess, hints);
            }
        }
        input.value = (0, vault_1.generateGuess)(info, guesses.length).join("");
    },
};


/***/ }),

/***/ 70:
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
exports.versionManager = void 0;
const utils_1 = __webpack_require__(7683);
const notifications_1 = __webpack_require__(6783);
const api_1 = __webpack_require__(1604);
const popup_1 = __webpack_require__(469);
const isVersion = (version) => version.split(".").length === 3;
const normalizeVersion = (version) => version.split("-")[0];
const isVersionHigher = (test, current) => {
    const testParts = test.split(".");
    const currentParts = current.split(".");
    for (const [index, testPart] of testParts.entries()) {
        if (Number.parseInt(currentParts[index]) < Number.parseInt(testPart)) {
            return true;
        }
    }
    return false;
};
const currentVersion = normalizeVersion( true && "1.0.20" !== void 0 ? "1.0.20" : "1.0.0");
const README_URL = "https://github.com/anstosa/farmrpg-farmhand/blob/main/README.md";
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.CHANGES, () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const response = yield (0, utils_1.corsFetch)(README_URL);
    const htmlString = yield response.text();
    const document = new DOMParser().parseFromString(htmlString, "text/html");
    const body = document.querySelector(".markdown-body");
    if (!body) {
        console.error("Failed to get README body");
        return;
    }
    let contentHTML = "";
    for (const child of body.children) {
        if (child.classList.contains("markdown-heading")) {
            const version = normalizeVersion((_a = child.textContent) !== null && _a !== void 0 ? _a : "1.0.0");
            if (isVersion(version) && isVersionHigher(version, currentVersion)) {
                contentHTML += `
          <h2>${version}</h2>
          <ul>${(_b = child.nextElementSibling) === null || _b === void 0 ? void 0 : _b.innerHTML}</ul>
        `;
            }
        }
    }
    (0, popup_1.showPopup)({ title: "Farmhand Changelog", contentHTML, align: "left" });
}));
(0, notifications_1.registerNotificationHandler)(notifications_1.Handler.UPDATE, () => window.open(api_1.SCRIPT_URL));
exports.versionManager = {
    onInitialize: () => __awaiter(void 0, void 0, void 0, function* () {
        const latestVersion = yield api_1.latestVersionState.get();
        if (!latestVersion) {
            console.error("Failed to get latest version");
            return;
        }
        if (isVersionHigher(latestVersion, currentVersion)) {
            (0, notifications_1.sendNotification)({
                class: "btnblue",
                id: notifications_1.NotificationId.UPDATE,
                text: `Farmhand update available: ${currentVersion} → ${latestVersion}`,
                actions: [
                    {
                        text: "View Changes",
                        handler: notifications_1.Handler.CHANGES,
                    },
                    {
                        text: "Update",
                        handler: notifications_1.Handler.CHANGES,
                    },
                ],
            });
        }
        else {
            (0, notifications_1.removeNotification)(notifications_1.NotificationId.UPDATE);
        }
    }),
};


/***/ }),

/***/ 6217:
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
exports.FEATURES = void 0;
const autocomplete_1 = __webpack_require__(4067);
const autocompleteItems_1 = __webpack_require__(8477);
const autocompleteUsers_1 = __webpack_require__(5881);
const banker_1 = __webpack_require__(8092);
const buddyfarm_1 = __webpack_require__(2273);
const chatNav_1 = __webpack_require__(6922);
const cleanupExplore_1 = __webpack_require__(2742);
const cleanupHome_1 = __webpack_require__(5870);
const collapseItemImage_1 = __webpack_require__(4056);
const compactSilver_1 = __webpack_require__(8181);
const compressChat_1 = __webpack_require__(223);
const confirmation_1 = __webpack_require__(3906);
const customNavigation_1 = __webpack_require__(2224);
const dismissableChatBanners_1 = __webpack_require__(5164);
const farmhandSettings_1 = __webpack_require__(8973);
const harvestNotifications_1 = __webpack_require__(4894);
const fishInBarrel_1 = __webpack_require__(2100);
const fleaMarket_1 = __webpack_require__(9361);
const page_1 = __webpack_require__(7952);
const highlightSelfInChat_1 = __webpack_require__(5454);
const improvedInputs_1 = __webpack_require__(1108);
const kitchenNotifications_1 = __webpack_require__(9737);
const linkifyQuickCraft_1 = __webpack_require__(7092);
const maxContainers_1 = __webpack_require__(9735);
const maxCows_1 = __webpack_require__(1103);
const maxPigs_1 = __webpack_require__(2934);
const mealNotifications_1 = __webpack_require__(5792);
const miner_1 = __webpack_require__(4414);
const moveUpdateToTop_1 = __webpack_require__(4417);
const compressNavigation_1 = __webpack_require__(2827);
const notifications_1 = __webpack_require__(6783);
const perkManagement_1 = __webpack_require__(682);
const popup_1 = __webpack_require__(469);
const questCollapse_1 = __webpack_require__(1768);
const quests_1 = __webpack_require__(3710);
const quickSellSafely_1 = __webpack_require__(8760);
const vaultSolver_1 = __webpack_require__(3026);
const versionManager_1 = __webpack_require__(70);
const state_1 = __webpack_require__(4619);
exports.FEATURES = [
    // internal
    notifications_1.notifications,
    confirmation_1.confirmations,
    popup_1.popups,
    autocomplete_1.autocomplete,
    versionManager_1.versionManager,
    // UI
    improvedInputs_1.improvedInputs,
    // home
    cleanupHome_1.cleanupHome,
    moveUpdateToTop_1.moveUpdateToTop,
    // kitchen
    kitchenNotifications_1.kitchenNotifications,
    mealNotifications_1.mealNotifications,
    // farm,
    harvestNotifications_1.fieldNotifications,
    maxPigs_1.maxPigs,
    maxCows_1.maxCows,
    // flea market
    fleaMarket_1.fleaMarket,
    // items
    buddyfarm_1.buddyFarm,
    collapseItemImage_1.collapseItemImage,
    quickSellSafely_1.quicksellSafely,
    linkifyQuickCraft_1.linkifyQuickCraft,
    // quests
    quests_1.quests,
    questCollapse_1.questCollapse,
    compactSilver_1.compactSilver,
    // bank
    banker_1.banker,
    // vault
    vaultSolver_1.vaultSolver,
    // mining
    miner_1.miner,
    // locksmith
    maxContainers_1.maxContainers,
    // fishing
    fishInBarrel_1.fishinInBarrel,
    // explore
    perkManagement_1.perkManagment,
    cleanupExplore_1.cleanupExplore,
    // chat
    chatNav_1.chatNav,
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
const watchSubtree = (selector, handler, filter) => {
    const target = document.querySelector(selector);
    if (!target) {
        console.error(`${selector} not found`);
        return;
    }
    const handle = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const settings = yield (0, farmhandSettings_1.getSettings)(exports.FEATURES);
        const [page, parameters] = (0, page_1.getPage)();
        // console.debug(`${selector} Load`, page, parameters);
        for (const feature of exports.FEATURES) {
            (_a = feature[handler]) === null || _a === void 0 ? void 0 : _a.call(feature, settings, page, parameters);
        }
    });
    const observer = new MutationObserver((mutations) => {
        var _a, _b;
        for (const mutation of mutations) {
            // only respond to tree changes
            if (mutation.type !== "childList") {
                continue;
            }
            if (mutation.addedNodes.length === 0) {
                continue;
            }
            if (filter) {
                for (const node of mutation.addedNodes) {
                    if ((_b = (_a = node).matches) === null || _b === void 0 ? void 0 : _b.call(_a, filter)) {
                        handle();
                    }
                }
            }
            else {
                handle();
            }
        }
    });
    observer.observe(target, { childList: true, subtree: true });
    handle();
};
// eslint-disable-next-line unicorn/prefer-top-level-await
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line unicorn/prefer-module
        "use strict";
        console.info("STARTING Farmhand by Ansel Santosa");
        // initialize
        const settings = yield (0, farmhandSettings_1.getSettings)(exports.FEATURES);
        for (const { onInitialize } of exports.FEATURES) {
            if (onInitialize) {
                onInitialize(settings);
            }
        }
        yield (0, state_1.watchQueries)(settings);
        // double watches because the page and nav load at different times but
        // separating the handlers makes everything harder
        watchSubtree(".view-main .pages", "onPageLoad", ".page");
        watchSubtree(".view-main .navbar", "onPageLoad", ".navbar-inner");
        // watch quest popup
        watchSubtree(".view-main .toolbar", "onQuestLoad");
        // watch menu
        watchSubtree(".view-left", "onMenuLoad");
        // watch desktop and mobile versions of chat
        watchSubtree("#mobilechatpanel", "onChatLoad");
        watchSubtree("#desktopchatpanel", "onChatLoad");
    });
})();


/***/ }),

/***/ 5818:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandom = void 0;
const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
exports.getRandom = getRandom;


/***/ }),

/***/ 4067:
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
const theme_1 = __webpack_require__(1178);
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
    var _a;
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
        text.slice(((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length),
    ].join("");
    closeAutocomplete();
});
const autocompleteSearchControlHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!event.target) {
        return;
    }
    if (!state.activeAutocomplete) {
        return;
    }
    if (!["Enter", "ArrowDown", "ArrowUp", "Escape"].includes(event.key)) {
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
    },
    onChatLoad: () => {
        for (const input of document.querySelectorAll(`
      #mobilechatpanel input[type="text"],
      #desktopchatpanel input[type='text']
    `)) {
            (0, exports.registerInputListeners)(input);
        }
    },
};


/***/ }),

/***/ 3906:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.confirmations = exports.showConfirmation = void 0;
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
exports.confirmations = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* fix confirmation position */
          .actions-modal-group {
            margin-bottom: 0 !important;
          }
        <style>
      `);
    },
};


/***/ }),

/***/ 4276:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debounce = void 0;
const debounce = (callback, timeout = 300) => {
    let timer;
    return (...parameters) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            Reflect.apply(callback, this, parameters);
        }, timeout);
    };
};
exports.debounce = debounce;


/***/ }),

/***/ 9946:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceSelect = void 0;
const theme_1 = __webpack_require__(1178);
const replaceSelect = (proxySelect, options) => {
    var _a, _b, _c;
    (_b = (_a = proxySelect.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".fh-item-selector")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = document === null || document === void 0 ? void 0 : document.querySelector(".fh-item-selector-menu")) === null || _c === void 0 ? void 0 : _c.remove();
    const formatter = new Intl.NumberFormat();
    proxySelect.style.display = "none";
    const selector = document.createElement("div");
    selector.classList.add("fh-item-selector");
    (0, theme_1.applyStyles)(selector, theme_1.INPUT_STYLES);
    selector.style.display = "flex";
    selector.style.alignItems = "center";
    selector.style.justifyContent = "center";
    selector.style.gap = "4px";
    const menu = document.createElement("div");
    menu.classList.add("fh-item-selector-menu");
    menu.style.padding = "10px 0";
    menu.style.display = "none";
    menu.style.position = "fixed";
    menu.style.zIndex = "9999";
    menu.style.background = theme_1.BACKGROUND_DARK;
    menu.style.border = `2px solid ${theme_1.BORDER_GRAY}`;
    menu.style.overflowY = "auto";
    menu.style.maxHeight = "406px";
    menu.style.fontSize = "17px";
    menu.style.color = theme_1.TEXT_GRAY;
    menu.style.marginTop = "-2px";
    const selectedOption = options.find((option) => option.value === proxySelect.value);
    selector.innerHTML = `
    ${selectedOption
        ? `<img src="${selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.icon}" style="width:16px; "/>`
        : ""}
    ${selectedOption
        ? `${selectedOption.name} (${formatter.format(selectedOption.quantity)})`
        : "Select an item"}
  `;
    selector.addEventListener("click", () => {
        const offset = selector.getBoundingClientRect();
        menu.style.top = `${offset.y + offset.height}px`;
        menu.style.right = `${window.innerWidth - offset.right}px`;
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
    for (const option of options) {
        const optionElement = document.createElement("div");
        optionElement.textContent = `${option.name} (${option.quantity})`;
        optionElement.style.textAlign = "left";
        optionElement.style.padding = "2px 10px";
        optionElement.style.display = "flex";
        optionElement.style.alignItems = "center";
        optionElement.style.gap = "4px";
        optionElement.style.cursor = "pointer";
        optionElement.innerHTML = `
      <img src="${option.icon}" style="width:16px;"/>
      ${option.name} (${formatter.format(option.quantity)})
    `;
        optionElement.addEventListener("click", () => {
            proxySelect.value = option.value;
            proxySelect.dispatchEvent(new Event("change"));
            // proxySelect.selectedIndex = option.proxyOption.index;
            // option.proxyOption.click();
            (0, exports.replaceSelect)(proxySelect, options);
        });
        menu.append(optionElement);
    }
    proxySelect.after(selector);
    document.body.append(menu);
    proxySelect.dataset.hasProxied = "true";
};
exports.replaceSelect = replaceSelect;


/***/ }),

/***/ 6783:
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
exports.notifications = exports.removeNotification = exports.sendNotification = exports.registerNotificationHandler = exports.Handler = exports.NotificationId = void 0;
const page_1 = __webpack_require__(7952);
const object_1 = __webpack_require__(7968);
const farmhandSettings_1 = __webpack_require__(8973);
const KEY_NOTIFICATIONS = "notifications";
var NotificationId;
(function (NotificationId) {
    NotificationId["FIELD"] = "field";
    NotificationId["MEAL"] = "meal";
    NotificationId["OVEN"] = "oven";
    NotificationId["PERKS"] = "perks";
    NotificationId["UPDATE"] = "update";
})(NotificationId || (exports.NotificationId = NotificationId = {}));
var Handler;
(function (Handler) {
    Handler["CHANGES"] = "updateChanges";
    Handler["COLLECT_MEALS"] = "collectMeals";
    Handler["HARVEST"] = "harvest";
    Handler["UPDATE"] = "update";
})(Handler || (exports.Handler = Handler = {}));
const isHandlerNotificationAction = (action) => "handler" in action;
const isHandlerNotification = (notification) => "handler" in notification;
const isLinkNotification = (notification) => "href" in notification;
const isTextNotification = (notification) => !isHandlerNotification(notification) && !isLinkNotification(notification);
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
    renderNotifications(true);
});
exports.sendNotification = sendNotification;
const removeNotification = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = (0, object_1.isObject)(notification)
        ? notification.id
        : notification;
    state.notifications = state.notifications.filter(({ id }) => id !== notificationId);
    yield (0, farmhandSettings_1.setData)(KEY_NOTIFICATIONS, state.notifications);
    renderNotifications();
});
exports.removeNotification = removeNotification;
const renderNotifications = (force = false) => {
    var _a, _b, _c, _d, _e, _f;
    const pageContent = (_a = (0, page_1.getCurrentPage)()) === null || _a === void 0 ? void 0 : _a.querySelector(".page-content");
    if (!pageContent) {
        console.error("Page content not found");
        return;
    }
    // remove existing notifications
    const notifications = pageContent.querySelectorAll(".fh-notification");
    if (!force && notifications.length === state.notifications.length) {
        return;
    }
    for (const notification of notifications) {
        notification.remove();
    }
    // add new notifications
    for (const notification of state.notifications.toSorted((a, b) => a.id.localeCompare(b.id) || 0)) {
        if (notification.replacesHref) {
            (_c = (_b = (0, page_1.getCurrentPage)()) === null || _b === void 0 ? void 0 : _b.querySelector(`a[href="${notification.replacesHref}"]`)) === null || _c === void 0 ? void 0 : _c.remove();
        }
        const notificationElement = document.createElement(isTextNotification(notification) ? "span" : "a");
        notificationElement.classList.add("button");
        notificationElement.classList.add("fh-notification");
        notificationElement.style.cursor = isTextNotification(notification)
            ? "default"
            : "pointer";
        if (notification.class) {
            notificationElement.classList.add(notification.class);
        }
        notificationElement.textContent = notification.text;
        if (isHandlerNotification(notification)) {
            notificationElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                event.preventDefault();
                event.stopPropagation();
                const handler = notificationHandlers.get(notification.handler);
                if (handler) {
                    yield handler(notification);
                }
                else {
                    console.error(`Handler not found: ${notification.handler}`);
                }
                (0, exports.removeNotification)(notification);
                renderNotifications();
            }));
        }
        else if (isLinkNotification(notification)) {
            notificationElement.setAttribute("href", notification.href);
        }
        for (const action of (_d = notification.actions) !== null && _d !== void 0 ? _d : []) {
            notificationElement.append(document.createTextNode(((_e = notification.actions) === null || _e === void 0 ? void 0 : _e.indexOf(action)) === 0 ? " " : " / "));
            const actionElement = document.createElement("a");
            actionElement.classList.add("fh-notification-action");
            actionElement.style.cursor = "pointer";
            actionElement.textContent = action.text;
            if (isHandlerNotificationAction(action)) {
                actionElement.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
                    event.preventDefault();
                    event.stopPropagation();
                    const handler = notificationHandlers.get(action.handler);
                    if (handler) {
                        yield handler(notification);
                    }
                    else {
                        console.error(`Handler not found: ${action.handler}`);
                    }
                    renderNotifications();
                }));
            }
            else {
                actionElement.href = action.href;
            }
            notificationElement.append(actionElement);
        }
        if ((_f = pageContent.firstElementChild) === null || _f === void 0 ? void 0 : _f.classList.contains("pull-to-refresh-layer")) {
            pageContent.insertBefore(notificationElement, pageContent.children[1]);
        }
        else {
            pageContent.prepend(notificationElement);
        }
    }
};
exports.notifications = {
    onInitialize: () => __awaiter(void 0, void 0, void 0, function* () {
        // const savedNotifications = await getData<Notification<any>[]>(
        //   KEY_NOTIFICATIONS,
        //   []
        // );
        // state.notifications = savedNotifications;
    }),
    onPageLoad: () => {
        setTimeout(renderNotifications, 500);
    },
};


/***/ }),

/***/ 7968:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isObject = void 0;
const isObject = (value) => typeof value === "object" && !Array.isArray(value) && value !== null;
exports.isObject = isObject;


/***/ }),

/***/ 7952:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getListByTitle = exports.getCardByTitle = exports.getTitle = exports.setTitle = exports.getCurrentPage = exports.getPreviousPage = exports.getPage = exports.WorkerGo = exports.Page = void 0;
var Page;
(function (Page) {
    Page["AREA"] = "area";
    Page["BANK"] = "bank";
    Page["FARM"] = "xfarm";
    Page["FARMERS_MARKET"] = "market";
    Page["FISHING"] = "fishing";
    Page["FRIENDSHIP"] = "npclevels";
    Page["HOME_PAGE"] = "index-1";
    Page["HOME_PATH"] = "index";
    Page["ITEM"] = "item";
    Page["KITCHEN"] = "kitchen";
    Page["LOCKSMITH"] = "locksmith";
    Page["MAILBOX"] = "mailbox";
    Page["MINING"] = "mining";
    Page["PASTURE"] = "pasture";
    Page["PERKS"] = "perks";
    Page["PIG_PEN"] = "pigpen";
    Page["POST_OFFICE"] = "postoffice";
    Page["QUEST"] = "quest";
    Page["SETTINGS"] = "settings";
    Page["SETTINGS_OPTIONS"] = "settings_options";
    Page["TEMPLE"] = "mailitems";
    Page["VAULT"] = "crack";
    Page["WELL"] = "well";
    Page["WHEEL"] = "spin";
    Page["WORKER"] = "worker";
    Page["WORKSHOP"] = "workshop";
})(Page || (exports.Page = Page = {}));
var WorkerGo;
(function (WorkerGo) {
    WorkerGo["ACTIVATE_PERK_SET"] = "activateperkset";
    WorkerGo["COLLECT_ALL_MAIL_ITEMS"] = "collectallmailitems";
    WorkerGo["COLLECT_ALL_MEALS"] = "cookreadyall";
    WorkerGo["COOK_ALL"] = "cookitemall";
    WorkerGo["DEPOSIT_SILVER"] = "depositsilver";
    WorkerGo["FARM_STATUS"] = "farmstatus";
    WorkerGo["GET_STATS"] = "getstats";
    WorkerGo["HARVEST_ALL"] = "harvestall";
    WorkerGo["PLANT_ALL"] = "plantall";
    WorkerGo["READY_COUNT"] = "readycount";
    WorkerGo["RESET_PERKS"] = "resetperks";
    WorkerGo["USE_ITEM"] = "useitem";
    WorkerGo["WITHDRAW_SILVER"] = "withdrawalsilver";
})(WorkerGo || (exports.WorkerGo = WorkerGo = {}));
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
const getTitle = (searchTitle, root) => {
    var _a;
    const currentPage = root !== null && root !== void 0 ? root : (0, exports.getCurrentPage)();
    if (!currentPage) {
        console.error("Current page not found");
        return null;
    }
    const titles = currentPage.querySelectorAll(".content-block-title");
    const targetTitle = [...titles].find((title) => searchTitle instanceof RegExp
        ? searchTitle.test(title.textContent || "")
        : title.textContent === searchTitle);
    return (_a = targetTitle) !== null && _a !== void 0 ? _a : null;
};
exports.getTitle = getTitle;
const getCardByTitle = (searchTitle, root) => {
    const targetTitle = (0, exports.getTitle)(searchTitle, root);
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
exports.popups = exports.showPopup = void 0;
const showPopup = ({ title, contentHTML, align, okText, actions, }) => new Promise((resolve) => {
    var _a;
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
          text-align: ${align !== null && align !== void 0 ? align : "center"};
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
      <div
        class="
          modal-buttons
          modal-buttons-vertical
          modal-buttons-${((_a = actions === null || actions === void 0 ? void 0 : actions.length) !== null && _a !== void 0 ? _a : 0) + 1}
        ">
        ${actions
        ? actions
            .map(({ name, buttonClass }, index) => `
              <span
                class="modal-button modal-button-bold fh-action button ${buttonClass}"
                data-index="${index}"
              >
                ${name}
              </span>`)
            .join("")
        : ""}
        <span class="modal-button fh-ok">${okText !== null && okText !== void 0 ? okText : "OK"}</span>
      </div>
    `;
    if (actions) {
        for (const [index, { callback }] of actions.entries()) {
            const button = modal.querySelector(`.fh-action[data-index='${index}']`);
            button === null || button === void 0 ? void 0 : button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                button.textContent = "Loading...";
                yield callback();
                overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
                modal.remove();
                resolve();
            }));
        }
    }
    const okButton = modal.querySelector(".fh-ok");
    okButton === null || okButton === void 0 ? void 0 : okButton.addEventListener("click", () => {
        overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("modal-overlay-visible");
        modal.remove();
        resolve();
    });
    document.body.append(modal);
    const offset = modal.getBoundingClientRect();
    modal.style.marginTop = `-${offset.height / 2}px`;
    modal.style.marginLeft = `-${offset.width / 2}px`;
});
exports.showPopup = showPopup;
exports.popups = {
    onInitialize: () => {
        document.head.insertAdjacentHTML("beforeend", `
        <style>
          /* hide duplicate modal overlays */
          .modal-overlay-visible ~ .modal-overlay-visible {
            opacity: 0;
          }
        <style>
      `);
        // click outside to close
        document.body.addEventListener("click", (event) => {
            var _a, _b;
            if (event.target.classList.contains("modal-overlay")) {
                const buttons = document.querySelectorAll(".modal .modal-button");
                (_b = (_a = [...buttons]) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.click();
            }
        });
    },
};


/***/ }),

/***/ 1178:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BUTTON_GRAY_DARK_STYLES = exports.BUTTON_GRAY_STYLES = exports.BUTTON_PURPLE_STYLES = exports.BUTTON_RED_STYLES = exports.BUTTON_GREEN_DARK_STYLES = exports.BUTTON_ORANGE_STYLES = exports.BUTTON_BLUE_STYLES = exports.BUTTON_GREEN_STYLES = exports.BUTTON_GRAY_BORDER = exports.BUTTON_GRAY_BACKGROUND = exports.BUTTON_PURPLE_BORDER = exports.BUTTON_PURPLE_BACKGROUND = exports.BUTTON_RED_BORDER = exports.BUTTON_RED_BACKGROUND = exports.BUTTON_BLUE_BORDER = exports.BUTTON_BLUE_BACKGROUND = exports.BUTTON_ORANGE_BORDER = exports.BUTTON_ORANGE_BACKGROUND = exports.BUTTON_GREEN_DARK_BORDER = exports.BUTTON_GREEN_DARK_BACKGROUND = exports.BUTTON_GREEN_BORDER = exports.BUTTON_GREEN_BACKGROUND = exports.INPUT_STYLES = exports.INPUT_BORDER = exports.INPUT_PADDING = exports.BACKGROUND_DARK = exports.BACKGROUND_BLACK = exports.BACKGROUND_WHITE = exports.BORDER_GRAY = exports.TEXT_BLACK = exports.TEXT_SUCCESS = exports.TEXT_WARNING = exports.TEXT_ERROR = exports.TEXT_GRAY = exports.TEXT_WHITE = exports.ALERT_YELLOW_BORDER = exports.ALERT_YELLOW_BACKGROUND = exports.LINK_RED = exports.LINK_GREEN = exports.toCSS = exports.camelToKebab = exports.applyStyles = exports.important = void 0;
const important = (style) => `${style} !important`;
exports.important = important;
const applyStyles = (element, styles) => {
    for (const [key, input] of Object.entries(styles)) {
        const [value, priority] = input.split("!");
        element.style.setProperty(key, value, priority);
    }
};
exports.applyStyles = applyStyles;
const camelToKebab = (input) => input.replaceAll(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
exports.camelToKebab = camelToKebab;
const toCSS = (style) => Object.entries(style)
    .map(([key, value]) => `${(0, exports.camelToKebab)(key)}: ${value}`)
    .join(";\n");
exports.toCSS = toCSS;
// links
exports.LINK_GREEN = "#90EE90";
exports.LINK_RED = "#ED143D";
// alerts
exports.ALERT_YELLOW_BACKGROUND = "#351C04";
exports.ALERT_YELLOW_BORDER = "#41260D";
// text
exports.TEXT_WHITE = "#FFFFFF";
exports.TEXT_GRAY = "#BBBBBB";
exports.TEXT_ERROR = "#FF0000";
exports.TEXT_WARNING = "#FFA500";
exports.TEXT_SUCCESS = "#30D611";
exports.TEXT_BLACK = "#000000";
// borders
exports.BORDER_GRAY = "#393939";
// backgrounds
exports.BACKGROUND_WHITE = "#FFFFFF";
exports.BACKGROUND_BLACK = "#111111";
exports.BACKGROUND_DARK = "#161718";
exports.INPUT_PADDING = "9px 12px";
exports.INPUT_BORDER = `2px solid ${exports.BORDER_GRAY}`;
exports.INPUT_STYLES = {
    background: (0, exports.important)(exports.BACKGROUND_DARK),
    border: (0, exports.important)(exports.INPUT_BORDER),
    borderRadius: (0, exports.important)("0"),
    fontSize: (0, exports.important)("14px"),
    boxShadow: (0, exports.important)("none"),
    color: (0, exports.important)(exports.TEXT_WHITE),
    height: (0, exports.important)("36px"),
    padding: (0, exports.important)(exports.INPUT_PADDING),
};
// buttons
exports.BUTTON_GREEN_BACKGROUND = "#003300";
exports.BUTTON_GREEN_BORDER = "#006600";
exports.BUTTON_GREEN_DARK_BACKGROUND = "#001900";
exports.BUTTON_GREEN_DARK_BORDER = "#003300";
exports.BUTTON_ORANGE_BACKGROUND = "#532A02";
exports.BUTTON_ORANGE_BORDER = "#8B4A0D";
exports.BUTTON_BLUE_BACKGROUND = "#101059";
exports.BUTTON_BLUE_BORDER = "#19199B";
exports.BUTTON_RED_BACKGROUND = "#330000";
exports.BUTTON_RED_BORDER = "#660000";
exports.BUTTON_PURPLE_BACKGROUND = "#3A204C";
exports.BUTTON_PURPLE_BORDER = "#4A315C";
exports.BUTTON_GRAY_BACKGROUND = "#444444";
exports.BUTTON_GRAY_BORDER = "#666666";
const generateButton = (background, border) => ({
    background: (0, exports.important)(background),
    border: (0, exports.important)(`2px solid ${border}`),
    borderRadius: (0, exports.important)("0"),
    boxShadow: (0, exports.important)("none"),
    color: (0, exports.important)(exports.TEXT_WHITE),
    fontSize: (0, exports.important)("14px"),
    cursor: (0, exports.important)("pointer"),
    lineHeight: (0, exports.important)("1"),
    height: (0, exports.important)("36px"),
    padding: (0, exports.important)(exports.INPUT_PADDING),
    width: (0, exports.important)("auto"),
});
exports.BUTTON_GREEN_STYLES = generateButton(exports.BUTTON_GREEN_BACKGROUND, exports.BUTTON_GREEN_BORDER);
exports.BUTTON_BLUE_STYLES = generateButton(exports.BUTTON_BLUE_BACKGROUND, exports.BUTTON_BLUE_BORDER);
exports.BUTTON_ORANGE_STYLES = generateButton(exports.BUTTON_ORANGE_BACKGROUND, exports.BUTTON_ORANGE_BORDER);
exports.BUTTON_GREEN_DARK_STYLES = generateButton(exports.BUTTON_GREEN_DARK_BACKGROUND, exports.BUTTON_GREEN_DARK_BORDER);
exports.BUTTON_RED_STYLES = generateButton(exports.BUTTON_RED_BACKGROUND, exports.BUTTON_RED_BORDER);
exports.BUTTON_PURPLE_STYLES = generateButton(exports.BUTTON_PURPLE_BACKGROUND, exports.BUTTON_PURPLE_BORDER);
exports.BUTTON_GRAY_STYLES = generateButton(exports.BUTTON_GRAY_BACKGROUND, exports.BUTTON_GRAY_BORDER);
exports.BUTTON_GRAY_DARK_STYLES = generateButton(exports.BORDER_GRAY, exports.BORDER_GRAY);


/***/ }),

/***/ 2279:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateGuess = exports.applyGuess = exports.getPossibleDigits = exports.couldHaveDigit = exports.hasDigit = exports.canSolve = exports.generateDigitInfo = exports.isCorrect = exports.Hint = void 0;
const array_1 = __webpack_require__(5818);
var Hint;
(function (Hint) {
    Hint["NONE"] = "\u274C";
    Hint["CORRECT"] = "\u2705";
    Hint["CLOSE"] = "\uD83D\uDFE7";
})(Hint || (exports.Hint = Hint = {}));
const isCorrect = (hints) => hints.every((h) => h === Hint.CORRECT);
exports.isCorrect = isCorrect;
const generateDigitInfo = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => ({
    correctPositions: [],
    possiblePositions: [0, 1, 2, 3],
    digit,
}));
exports.generateDigitInfo = generateDigitInfo;
const canSolve = (info) => {
    const correctPositions = [];
    for (const digitInfo of info) {
        if (digitInfo.correctPositions.length > 0) {
            correctPositions.push(...digitInfo.correctPositions);
        }
    }
    return correctPositions.length === 4;
};
exports.canSolve = canSolve;
const hasDigit = (info) => info.correctPositions.length > 0 ||
    (info.possiblePositions.length > 0 && info.possiblePositions.length < 4);
exports.hasDigit = hasDigit;
const couldHaveDigit = (info) => info.correctPositions.length > 0 || info.possiblePositions.length > 0;
exports.couldHaveDigit = couldHaveDigit;
const getPossibleDigits = (info, position) => {
    const uncalledDigits = [];
    const calledDigits = [];
    for (const digitInfo of info) {
        if (digitInfo.correctPositions.includes(position)) {
            return [digitInfo.digit];
        }
        if ((0, exports.couldHaveDigit)(digitInfo) &&
            digitInfo.possiblePositions.includes(position)) {
            if (digitInfo.correctPositions.length === 0) {
                uncalledDigits.push(digitInfo.digit);
            }
            else {
                calledDigits.push(digitInfo.digit);
            }
        }
    }
    return [...uncalledDigits, ...calledDigits];
};
exports.getPossibleDigits = getPossibleDigits;
const applyGuess = (info, guess, hints) => {
    for (const [position, digit] of guess.entries()) {
        const digitInfo = info[digit];
        switch (hints[position]) {
            case Hint.CORRECT: {
                digitInfo.correctPositions.push(position);
                digitInfo.possiblePositions = digitInfo.possiblePositions.filter((p) => p !== position);
                break;
            }
            case Hint.CLOSE: {
                digitInfo.possiblePositions = digitInfo.possiblePositions.filter((p) => p !== position);
                break;
            }
            case Hint.NONE: {
                digitInfo.correctPositions = [];
                digitInfo.possiblePositions = [];
                break;
            }
        }
    }
    const confirmedDigits = [];
    for (const digitInfo of info) {
        if (confirmedDigits.length === 4) {
            digitInfo.correctPositions = [];
            digitInfo.possiblePositions = [];
        }
        else if ((0, exports.hasDigit)(digitInfo)) {
            confirmedDigits.push(digitInfo.digit);
        }
    }
    return info;
};
exports.applyGuess = applyGuess;
const generateGuess = (info, guessIndex) => {
    if (guessIndex === 0) {
        return [0, 1, 2, 3];
    }
    if (guessIndex === 1) {
        return [4, 5, 6, 7];
    }
    const guess = guessIndex === 2 ? [8, 9] : [];
    while (guess.length < 4) {
        const position = guess.length;
        const possibilities = (0, exports.getPossibleDigits)(info, position);
        guess[position] = (() => {
            for (const digit of possibilities) {
                if (!guess.includes(digit)) {
                    return digit;
                }
            }
            return (0, array_1.getRandom)(possibilities);
        })();
    }
    return guess;
};
exports.generateGuess = generateGuess;


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
/******/ 	var __webpack_exports__ = __webpack_require__(6217);
/******/ 	
/******/ })()
;
//# sourceMappingURL=farmrpg-farmhand.user.js.map