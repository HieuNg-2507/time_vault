Time Vault – Interaction Flow
Overview
This document outlines the detailed user interaction flow for Time Vault, an app designed to regulate social media usage (specifically TikTok) by gamifying self-control. The app intercepts attempts to access TikTok, requiring users to spin a wheel to earn time-limited access or accumulate time for long-term rewards. The flow is built on behavioral psychology principles to encourage mindful usage and reward delayed gratification.

Core Mechanics

Spin-Based Access: Users must spin a wheel to earn "time balls" (2, 5, 10, 15, or 20 minutes) to access TikTok. A "no ball" outcome denies access.
Choice Mechanism: Each time ball can be used immediately to access TikTok or stored for later use within the same day.
Daily Storage: Stored time balls are held in a temporary daily inventory, usable only on the same day.
Long-Term Vault: Time balls not used by the end of the day automatically transfer to a permanent vault, contributing to long-term savings. Users can also manually transfer balls to the vault.
Spin Limits: Users are restricted to 3 consecutive spins, followed by a 5-minute cooldown to prevent overuse.
Daily Reset: Unused daily inventory balls are automatically transferred to the long-term vault at midnight.


User Interaction Flow
1. Initial Setup (First-Time Onboarding)

Trigger: User installs the app and attempts to access TikTok for the first time.
Screen: Onboarding tutorial.
Content:
Brief explanation of the app’s purpose: “Control your TikTok time with fun spins and rewards!”
Interactive guide showing:
How to spin the wheel.
Options to use or store time balls.
Daily inventory and long-term vault mechanics.


Prompt to grant permissions for app interception (to block TikTok) and notifications.


CTA: “Start Your First Spin!” button.
Outcome: User proceeds to the spin screen with a guaranteed high-value time ball (e.g., 10 minutes) for a positive first experience.


Purpose: Educate users on core mechanics and ensure a rewarding first interaction.

2. Accessing TikTok (App Interception)

Trigger: User attempts to open TikTok.
Screen: Time Vault home screen (intercepts TikTok).
Content:
Header: “Spin to Earn TikTok Time!”
Display:
Daily Spin Quota: Remaining spins (default: 15 per day).
Daily Inventory: List of stored time balls (e.g., “5 min, 10 min”).
Long-Term Vault Total: Total minutes saved (e.g., “250 minutes saved”).
Current Streak: Consecutive days of saving time (e.g., “3-day streak”).
Daily Goal: Suggested time to save (e.g., “Save 30 minutes today”).


Animated spin wheel graphic.
Prominent Spin Now button (CTA).


Purpose: Block TikTok access and funnel users into the spin mechanic.



3. Spinning the Wheel

Trigger: User taps Spin Now on the home screen.
Screen: Spin wheel animation.
Mechanics:
Wheel spins for 5–7 seconds with sound effects to create anticipation.
Possible outcomes (randomized with weighted probabilities):
Time Balls: 2, 5, 10, 15, or 20 minutes (e.g., 30% chance for 5 min, 10% for 20 min).
No Ball: Denies TikTok access (e.g., 20% chance).


If user has spun 3 times consecutively, the Spin Now button is disabled, showing a 5-minute countdown timer for the next spin.


Display:
Remaining spins for the day.
Cooldown timer (if applicable).


Purpose: Create excitement through variable rewards and enforce controlled engagement with spin limits.



4. Post-Spin Choice

Trigger: Wheel spin completes, revealing a time ball (or no ball).
Screen: Choice selection.
If Time Ball Received (e.g., 10 minutes):
Content:
Animated display of the time ball (e.g., “You got a 10-minute ball!”).
Three options:
Use Now:
Opens TikTok with a timer counting down (e.g., 10:00 → 0:00).
Once the timer expires, TikTok is blocked, and the user is redirected to the Time Vault home screen.
Time ball is consumed and removed.


Store in Daily Inventory:
Adds the time ball to the daily inventory (visible on the home screen).
Usable later in the day (see Section 5).


Save to Long-Term Vault:
Permanently transfers the time ball’s minutes to the vault.
Updates vault total (e.g., 250 min → 260 min).
Time ball is no longer usable for TikTok access.






CTA: Buttons for “Use Now,” “Store,” and “Save to Vault.”


If No Ball Received:
Content: Message like “Oops, no time ball this time! Try another spin.”
CTA: “Spin Again” (if spins remain) or “Back to Home” (if in cooldown or out of spins).


Purpose: Empower users with strategic choices, balancing instant gratification (use) with self-control (store/save).



5. Using Stored Time Balls (Mid-Day Access)

Trigger: User attempts to access TikTok later in the day and has time balls in the daily inventory.
Screen: Home screen with daily inventory highlighted.
Content:
List of stored time balls (e.g., “5 min, 10 min”).
Option to select a specific time ball for use.
CTA: “Use [X min] Ball” button for each stored ball.


Mechanics:
Selecting a time ball opens TikTok with a countdown timer for the chosen duration.
Once the timer expires, TikTok is blocked, and the user is redirected to the home screen.
The used time ball is removed from the daily inventory.


Alternative Action: User can choose to transfer a stored time ball to the long-term vault.
CTA: “Save to Vault” button next to each time ball.
Updates vault total and removes the ball from the daily inventory.


Purpose: Allow flexibility for users to use previously earned time while encouraging vault savings.



6. End-of-Day Processing

Trigger: Midnight daily reset.
Mechanics:
All unused time balls in the daily inventory are automatically transferred to the long-term vault.
Vault total updates to reflect the added minutes.
Daily spin quota resets to 15.
Daily inventory is cleared.
Streak updates:
If the user saved at least the daily goal (e.g., 30 minutes), the streak increments.
If the goal was not met, the streak resets to 0.




Notification:
Push notification summarizing:
Total time saved (vault contribution).
TikTok usage for the day.
Updated streak status.
Encouragement: “Great job saving 45 minutes today! Spin tomorrow to keep your 4-day streak!”




Purpose: Reinforce progress, maintain engagement, and leverage loss aversion to encourage streak continuation.

7. Long-Term Vault and Rewards

Screen: Vault dashboard (accessible from home screen).
Content:
Total minutes saved in the vault (e.g., “750 minutes saved”).
Progress bar toward milestones (e.g., 500, 1000, 2000 minutes).
Available rewards (locked/unlocked based on vault total):
500 minutes: Boost card (e.g., protects inventory or increases high-value ball odds).
1000 minutes: Special feature (e.g., app theme, virtual pet).
2000 minutes: Real-world reward (e.g., online learning voucher).




CTA: “Claim Reward” for unlocked rewards or “Save More Time” for locked ones.


Purpose: Motivate long-term engagement with tangible and aspirational rewards.

8. Spin Cooldown Management

Trigger: User attempts a fourth consecutive spin.
Screen: Home screen with disabled Spin Now button.
Content:
Countdown timer (e.g., “Next spin in 4:32”).
Message: “You’ve spun 3 times! Wait 5 minutes for your next spin.”
Option to view daily inventory or vault while waiting.


Mechanics:
Timer counts down in real-time.
Once the timer reaches 0, the Spin Now button reactivates.


Purpose: Prevent overuse of the spin mechanic and encourage mindful engagement.




Edge Cases

No Spins Remaining:
If the user has used all 15 daily spins and has no stored time balls, the home screen displays: “No spins left today! Check back tomorrow.”
TikTok remains blocked until the next day’s reset.


TikTok Already Open:
If TikTok is running in the background, Time Vault detects the attempt to switch to it and displays the home screen with the spin prompt.


App Permissions Denied:
If the user denies interception permissions, a prompt explains: “Time Vault needs permission to manage TikTok access. Grant now to continue.”
CTA: “Grant Permission” or “Skip” (limits functionality).


Network Issues:
Spins and time tracking are cached locally and synced when the network is available.
Offline mode allows use of stored time balls but disables new spins.




Visual and Animation Guidelines

Spin Wheel:
Colorful, engaging design with smooth 5–7 second animation.
Sound effects (e.g., ticking wheel, celebratory chime for time balls).


Time Ball Display:
Each time ball has a distinct color (e.g., 2 min = blue, 20 min = gold).
Pop-up animation when revealed (e.g., ball bounces into view).


Home Screen:
Clean, vibrant UI with clear sections for spins, inventory, vault, and streak.
Progress bars for daily goals and vault milestones.


Notifications:
Friendly, encouraging tone (e.g., “Time to spin and control your TikTok time!”).
Visual cues for rewards (e.g., confetti for milestone unlocks).




Technical Requirements
Front-End

Tech Stack: React Native or Flutter for cross-platform compatibility.
Features:
Spin wheel with randomized outcomes and animations.
Real-time timer for TikTok usage and cooldowns.
Dynamic home screen updating spin quota, inventory, vault, and streak.
Push notifications for daily resets and reminders.


Permissions:
App interception (e.g., Android Accessibility Service, iOS Screen Time API).
Local storage for offline caching.



Back-End

Tech Stack: Node.js/Express or Django, MongoDB/PostgreSQL.
Features:
User authentication and profile management.
Randomized time ball generation with weighted probabilities.
Daily inventory and long-term vault tracking.
Streak and reward system logic.
Analytics for spin frequency, time ball choices, and TikTok usage.


APIs:
TikTok integration for time tracking (if available) or app interception logic.
Push notification service integration.





