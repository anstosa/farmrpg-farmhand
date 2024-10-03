# Farm RPG Farmhand

Farmhand is an add-on that helps you all around Redbrook in [Farm RPG](https://farmrpg.com)

All features are configurable and optional.

## Usage

Note that Farmhand is designed to make navigating Redbrook and your FarmRPG life easier *in ways that do not violate the [Code of Conduct](https://farmrpg.com/index.php#!/coc.php)*.

> ### Botting, Scripting, Macros, Etc
>
> **Don't do it.**
>
> While Farm RPG is non-competitive, using any sort of script, bot, macro, etc to play the game in an automated fashion is strictly forbidden. Discussions involving this topic are also not allowed.
>
> The reason for this is that automating the game causes a large amount of server requests and bandwidth usage that is not ideal as the game grows.

Farmhand purposefully avoids any features that would violate the letter or spirit of these rules (such as auto-fish, auto-explore, auto-farm, etc). Usage of Farmhand should not result in a ban and has been unofficially okayed by admins *but is not explicitly endorsed by Magic & Wires LLC*. [@anstosa](https://farmrpg.com/#!/profile.php?user_name=anstosa) makes no warranties with regard to its use.

## Install

### Desktop

1. Install a browser that supports extensions (including [Firefox](https://www.mozilla.org/en-US/firefox/new) on mobile)
2. [Install Tampermonkey](https://www.tampermonkey.net/) or another Greasemonkey script manager like [Userscripts on iOS](https://apps.apple.com/us/app/userscripts/id1463298887)
3. Install Farmhand via [Greasy Fork](https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand) (or [directly from this repository](https://github.com/anstosa/farmrpg-farmhand/blob/main/dist/farmrpg-farmhand.user.js))
4. If you're on mobile, you can use your browser to add <https://farmrpg.com> to your homescreen so it feels like an app

### Mobile

1. Install [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)
2. Install Farmhand via [Greasy Fork](https://greasyfork.org/en/scripts/497660-farm-rpg-farmhand) (or [directly from this repository](https://github.com/anstosa/farmrpg-farmhand/blob/main/dist/farmrpg-farmhand.user.js))
3. Use the browser menu when visiting <https://farmrpg.com> to add it to you your homescreen so it feels like an app

## Features

### Farmhand Settings

All features are configurable via new settings in [My Settings > Change Game Options](https://farmrpg.com/#!/settings_options.php)

### Items

* Adds shortcut to view page in [Buddy's Almanac](https://buddy.farm)
* Shows Exploring, Fishing, and Mining sections right under Item Details
* Locks Quick Sell and Quick Donate for locked items
* Make missing ingredients in Quick Carft links
* Show ongoing notifications for meals

### Quests

* Adds shortcut to view page in [Buddy's Almanac](https://buddy.farm)
* Remember quest detail collapse state globally instead of per-quest

### Banker

* Automatically calculates your target balance (minimum balance required to maximize your daily interest)
* Adds an option *Deposit Target Balance* which deposits up to your target balance
* Adds an option to *Withdraw Interest* which withdraws any earnings on top of your target balance

### Vault

* Prefills vault code with recommended guess
* Custom vault code keyboard with hints built-in
* Floating "recommended action" button that clicks submit guess, get more guesses, or get new vault for you

### Mining

* Floating "recommended action" button that clicks the recommended action for you
  * Next floor
  * Use bomb (disabled by default)
  * Use explosives
  * Make more picks (if none left)
  * Dig recommended location on board

### Chat

* Compress chat view so more messages are visible
* Dismissable chat banners
* Highlight messages tagging you in chat
* Autocomplete ((item)) tags in chat
* Autocomplete usernames when @mentioning: in chat
* Add refresh button to chat

### Menu

* Customize menu (icon, name, order, URL)
* Compressed menu view so more items are visible
* Align menu to bottom so it's easier to reach on mobile
* Hide logo from menu
* Add menu button to bottom bar so it's easier to reach on mobile

### Perk set management

If you have a perk set named "Default" and perk sets with the names "Crafting", "Fishing", "Exploring", "Selling", "Friendship", "Temple", "Locksmish", or "Wheel", they will be automatically activated before doing the relevant activities, and deactivated after.

Supports Quick Craft for "Crafting", Quick Sell for "Selling", and Quick Give for "Friendship"

This frees up points from many activity specific perks to be re-invested in perks that need to be on all the time.

### Fishing

* Fish always appear in middle of pond
* Larger results display with consistent ordering for nets

### Exploring

* Larger results display with consistent ordering

### Farming

* Crop ready notifications
* Field empty notifications
* Popup showing items harvested with Replant button
* Buy and sell max animals by default (instead of 1)

### Flea Market

* Disabled (can be re-enabled in settings)

### Locksmith

* Open max containers by default (instead of 1)

### Cooking

* Ovens empty notification
* Meals ready notification

### UI Cleanup

* Home: hide players section
* Home: hide theme switcher
* Home: home footer
* Home: moves updates to top if there is a new one
* Home: compress skills section
* Quests: Styled border
* Quests: Minimizable
* Popups: Click outside to close
* Inputs: Cleaner and more consistent
* Buttons: Cleaner and more consistent
* Dropdowns: Cleaner, more consistent, and show item icons
* Wallet: compact money over 1M

### Export

All settings can be exported and imported on other devices

## Roadmap

Future features under consideration or development

* Desktop notifications
* Grape juice button after replant popup if available
* Fix notifications page bouncing issue
* Use again functionality for meals
* Ctrl+K quick go to popup for quickly going to any page, item, etc from anywhere
* Show collected items in success popup when collecting from pets
* Quick collect link in mailbox notification like with pets that shows collected items in success popup
* Contextual status information in custom navigation items (e.g. crops growing for farm, chores completed for Chores, items exchanged for exchange, etc)
* Notification for wine at max value
* Compressed view for home and town pages (square tiles)

## Tip

Do you like Farmhand? Tip me at [@anstosa in-game](https://farmrpg.com/#!/profile.php?user_name=anstosa)

## Changelog

### 1.0.27

* Fixed: Oven notification settings interference
* Fixed: First page loaded not being parsed

### 1.0.26

* Fixed: low-noise oven notifications triggering at 2 actions instead of 3

### 1.0.25

* Added: Option to notify on ovens for every action (now defaults to only if all actions are available for all ovens)
* Fixed: Remove field-related notifications while on the farm page to avoid jumpiness
* Fixed: Mega Cotton breaking dropdown item rendering

### 1.0.24

* Fixed: Fix vault suggestion edge case

### 1.0.23

* Added: On item pages, move Exploring, Fishing, and Mining sections above Crafting and Cooking Sections

### 1.0.22

* Fixed: Version notification Update button actually updates
* Fixed: Vault button will ask for more tries and new vaults again

### 1.0.21

* Added: Vault now has custom keyboard with hints built-in
* Fixed: Miner will now correctly count pickaxes > 1000
* Fixed: Miner will now click Try Again if attempts left is 0
* Fixed: Miner will now prioritize candidates in alignment with hits
* Fixed: Miner will now prioritize the most promising candidates if there are no hits

### 1.0.20

* Added: Miner. Static button in bottom right to take the next suggested action on board
* Added: Static button for Vault like Miner above
* Fixed: Overlap when fishing on improved explore layout
* Fixed: Containers not maxing after the first one is opened
* Fixed: Improved inputs vault field

### 1.0.19

* Fixed: Select not selecting

### 1.0.18

* Added: Consistent, cleaner UI elements for buttons and text/number inputs
* Added: Improved item selector for seeds, kitchen, and well
* Fixed: Compact silver not working with tracked mastery or quest
* Fixed: Stabilized size of improved explore results so buttons don't bounce
* Fixed: Broken Buddy.Farm links

### 1.0.17

* Added: Improved explore view applies to fishing as well
* Added: Select maximum animals to buy or sell by default (instead of 1)
* Fixed: Clicking outside to close harvest popup replanted
* Fixed: "NaNM" silver

### 1.0.16

* Added: Disable Flea Market by default (because it's a waste of gold)
* Added: Disable Quick Give if sell is locked
* Added: Added Buddy's Almanac link to quests
* Added: Remember quest details collapse globally instead of per-quest
* Added: Made silver display compact numbers over 1M
* Added: Open max containers by default
* Added: Improved exploration results (larger icons, stable sort)
* Fixed: Notifications not rendering reliably

### 1.0.15

* Added: Harvest popup has re-plant option
* Added: Option to disable Harvest popup
* Added: Option to disable vault code suggestions

### 1.0.14

* Added: Click outside popups to close
* Fixed: Quest minimize button from overlapping
* Fixed: Fully black popup backgrounds
* Fixed: Perk managment not working in some cases

### 1.0.13

* Fixed: Remove meal notification after meal expires
* Fixed: Don't query farm or kitchen if notifications are enabled

### 1.0.12

* Added: Refresh button in chat

### 1.0.11

* Fixed: Sending messages with user tags
* Fixed: Stable notification sort

### 1.0.10

* Added: Crops ready notification
* Added: Field empty notification
* Added: Ovens empty notification
* Added: Meals ready notification
* Added: Ongoing meal effect notifications
* Added: Popup listing all items harvested
* Added: Pre-fills vault code with recommended guess
* Fixed: Some perk categories not visible
* Fixed: Perk sets chaning on perks screen
* Fixed: Missing ingredient links broke for multiple ingredients

### 1.0.9

* Added: Farmhand version checking and update notifications
* Added: Support for alpha
* Added: Make quests minimizable
* Fixed: Updated caching infrastructure to significantly reduce any load impact on farmrpg.com or buddy.farm

### 1.0.8

* Added: Make missing ingredients in Quick Craft links
* Added: Collapsed item view
* Added: Fish always appear in middle of pond
* Added: Nicer chat navigation
* Fixed: Autocomplete not closing on Esc
* Fixed: Rendering modded elements was sometimes delayed or missed

### 1.0.7

* Added: Locks Quick Sell button if item is locked

### 1.0.6

* Added: Reset button for dismissed chat banners
* Fixed: Bottom menu buttons go under tracked quest on small screens
* Fixed: Duplicate quick buttons on items
* Fixed: Friendship perks didn't apply to mailbox pages
* Fixed: Enter doesn't send messages in chat
* Fixed: Settings action buttons cause page reload
* Fixed: Compress skills inconsistent

### 1.0.5

* Added: Home: hide players section
* Added: Home: hide theme switcher
* Added: Home: home footer
* Added: Home: moves updates to top if there is a new one
* Added: Home: compress skills section

### 1.0.4

* Added: Home: hide players section
* Added: Home: hide theme switcher
* Added: Home: home footer
* Added: Home: moves updates to top if there is a new one
* Added: Home: compress skills section

### 1.0.3

* Added: Add perks management

### 1.0.2

* Added: Export/Import farmhand settings
* Added: Compressed navigation view so more items are visible
* Added: Hide logo from navigation
* Added: Customize navigation (icon, name, order, URL)

### 1.0.1

* Added: Compress chat view so more messages are visible
* Added: Dismissable chat banners
* Added: Highlight messages tagging you

### 1.0.0

Initial version 🎉

* Added: Basic infrastructure
* Added: Buddy's Almanac integration
* Added: Banker
