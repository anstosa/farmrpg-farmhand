import { BORDER_GRAY } from "~/utils/theme";
import { Feature, FeatureSetting } from "./feature";

export const SETTING_CHAT_COMPRESS: FeatureSetting = {
  id: "compressChat",
  title: "Chat: Compress messages",
  description: "Compress chat messages to make more visible at once",
  type: "boolean",
  defaultValue: true,
};

export const compressChat: Feature = {
  settings: [SETTING_CHAT_COMPRESS],
  onInitialize: (settings) => {
    // move spacing from panel margin to message padding regardless of setting
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        .page-content {
          padding-right: 0 !important; 
          margin-right: -2px !important;
        }
        #desktopchatpanel {
          border-color: ${BORDER_GRAY};
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
    `
    );

    // make sure setting is enabled
    if (!settings[SETTING_CHAT_COMPRESS.id].value) {
      return;
    }

    document.head.insertAdjacentHTML(
      "beforeend",
      `
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
    `
    );
  },
};
