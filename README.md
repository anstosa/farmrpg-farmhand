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
* Locks Quick Sell for locked items

### Banker

* Automatically calculates your target balance (minimum balance required to maximize your daily interest)
* Adds an option *Deposit Target Balance* which deposits up to your target balance
* Adds an option to *Withdraw Interest* which withdraws any earnings on top of your target balance

### Chat

* Compress chat view so more messages are visible
* Dismissable chat banners
* Highlight messages tagging you in chat
* Autocomplete ((item)) tags in chat
* Autocomplete usernames when @mentioning: in chat

### Navigation

* Customize navigation (icon, name, order, URL)
* Compressed navigation view so more items are visible
* Align navigation to bottom so it's easier to reach on mobile
* Hide logo from navigation
* Add menu button to bottom bar so it's easier to reach on mobile

### Perk set management

If you have a perk set named "Default" and perk sets with the names "Crafting", "Fishing", "Exploring", "Selling", "Friendship", "Temple", "Locksmish", or "Wheel", they will be automatically activated before doing the relevant activities, and deactivated after.

Supports Quick Craft for "Crafting", Quick Sell for "Selling", and Quick Give for "Friendship"

This frees up points from many activity specific perks to be re-invested in perks that need to be on all the time.

### UI Cleanup

* Home: hide players section
* Home: hide theme switcher
* Home: home footer
* Home: moves updates to top if there is a new one
* Home: compress skills section

### Export

All settings can be exported and imported on other devices

## Roadmap

Future features under consideration or development

* Ctrl+K quick go to popup for quickly going to any page, item, etc from anywhere
* Show collected items in success popup when collecting from pets
* Quick collect link in mailbox notification like with pets that shows collected items in success popup
* Contextual status information in custom navigation items (e.g. crops growing for farm, chores completed for Chores, items exchanged for exchange, etc)
* Persistent notification for meal countdowns
* Notification for wine and max value
* Notification for crops complete that allows you to harvest and/or replant without going to farm page
* Disable Quick Sell and Quick Give for locked items
* Compressed view for home and town pages (square tiles)
* Shortcut on missing materials to link without scrolling down

## Tip

Do you like Farmhand? Tip me at [@anstosa in-game](https://farmrpg.com/#!/profile.php?user_name=anstosa)

## Changelog

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
