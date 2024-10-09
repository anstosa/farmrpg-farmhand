import { Feature, FeatureSetting } from "../utils/feature";
import { getCardByTitle, Page } from "~/utils/page";
import { SettingId } from "~/utils/settings";

const SETTING_HIDE_PLAYERS: FeatureSetting = {
  id: SettingId.HOME_HIDE_PLAYERS,
  title: "Home: Hide players",
  description: "Hide Online, new, find players options",
  type: "boolean",
  defaultValue: false,
};

const SETTING_HIDE_THEME: FeatureSetting = {
  id: SettingId.HOME_HIDE_THEME,
  title: "Home: Hide theme switcher",
  description: "Hide theme switcher on homepage",
  type: "boolean",
  defaultValue: false,
};

const SETTING_HIDE_FOOTER: FeatureSetting = {
  id: SettingId.HOME_HIDE_FOOTER,
  title: "Home: Hide footer",
  description: "Hide footer (Privacy, CoC, T&C, Support) ",
  type: "boolean",
  defaultValue: false,
};

const SETTING_COMPRESS_SKILLS: FeatureSetting = {
  id: SettingId.HOME_COMPRESS_SKILLS,
  title: "Home: Compress Skills",
  description: "Hide Level 99 skills",
  type: "boolean",
  defaultValue: true,
};

export const cleanupHome: Feature = {
  settings: [
    SETTING_HIDE_PLAYERS,
    SETTING_HIDE_THEME,
    SETTING_HIDE_FOOTER,
    SETTING_COMPRESS_SKILLS,
  ],
  onInitialize: (settings) => {
    if (settings[SettingId.HOME_HIDE_PLAYERS]) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            /* Hide players card */
            [data-page="${Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title,
            [data-page="${Page.HOME_PAGE}"] .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title ~ .content-block-title + .card {
              display: none !important;
            }
          <style>
        `
      );
    }

    if (settings[SettingId.HOME_HIDE_THEME]) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            /* Hide theme switcher */
            [data-page="${Page.HOME_PAGE}"] .page-content > p:nth-of-type(1),
            [data-page="${Page.HOME_PAGE}"] .page-content > p:nth-of-type(2) {
              display: none !important;
            }
          <style>
        `
      );
    }

    if (settings[SettingId.HOME_HIDE_FOOTER]) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `
          <style>
            [data-page="${Page.HOME_PAGE}"] .page-content > p:last-of-type,
            [data-page="${Page.HOME_PAGE}"] .page-content > div:last-of-type {
              display: none !important;
            }
          <style>
        `
      );
    }
  },
  onPageLoad: (settings, page) => {
    if (page !== Page.HOME_PAGE) {
      return;
    }
    if (!settings[SettingId.HOME_COMPRESS_SKILLS]) {
      return;
    }

    // get wrappers
    const skillsCard = getCardByTitle(/my skills/i);
    const skillsTitle = skillsCard?.previousElementSibling as
      | HTMLDivElement
      | undefined;
    const skillsCardInner = skillsCard?.querySelector(".card-content-inner");
    if (skillsCard && skillsTitle && skillsCardInner) {
      // new row
      const newRow = document.createElement("div");
      newRow.classList.add("row");
      newRow.style.marginBottom = "0";
      newRow.style.display = "flex";
      newRow.style.justifyContent = "space-around";
      // get all skills
      const skills = skillsCard?.querySelectorAll(".col-33");
      let x99 = 0;
      for (const skill of skills) {
        const progress = skill.querySelector("div");
        if (!progress) {
          continue;
        }
        if (progress.classList.contains("progressbar-infinite")) {
          x99++;
        } else {
          newRow.append(skill);
        }
      }
      skillsCardInner.prepend(newRow);
      newRow.nextElementSibling?.remove();
      newRow.nextElementSibling?.remove();
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
