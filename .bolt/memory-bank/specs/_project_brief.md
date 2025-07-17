Time Vault – Detailed Project Plan
📌 Project Overview
Project Name: Time Vault – Lọ Tiết Kiệm Thời GianPrimary Goal: Help users reduce mindless social media usage (especially TikTok) by gamifying self-control and turning "non-usage" into a rewarding, dopamine-driven experience. Instead of banning social media, the app transforms TikTok into a reward for disciplined behavior, fostering a clean dopamine loop and self-improvement.

🎯 Core Objectives

Reduce Mindless Social Media Usage: Encourage users to consciously limit time spent on TikTok through a gamified system.
Reward Self-Control: Leverage behavioral psychology to make self-discipline fun and rewarding.
Engage Users Long-Term: Create a sustainable habit loop using streaks, rewards, and variable outcomes to maintain user engagement.
Ethical Dopamine Loop: Replace addictive social media scrolling with a sense of progress, pride, and achievement.


🧠 Behavioral Psychology Principles
Time Vault is built on the following psychological principles to drive user engagement and behavior change:

Loss Aversion: Users fear losing their streaks or collected time cards, motivating them to stay consistent.
Delayed Gratification: Encourage self-control by rewarding users for saving time instead of using it immediately.
IKEA Effect: Users value the time they’ve "earned" and saved, increasing their attachment to the app.
Variable Reward: Random time card outcomes (like a slot machine) create excitement and anticipation.
Sunk Cost Fallacy: Users who’ve invested time in saving are motivated to maintain their progress to avoid "wasting" it.
Ethical Dopamine Loop: Replace the addictive dopamine from social media with a rewarding sense of achievement and control.


📱 User Flow
1. Start of Day – Check-In

Notification: App sends a morning push notification inviting users to spin for time cards.
Main Interface:
Displays daily spin quota (15 spins).
Shows yesterday’s savings, weekly/monthly totals, and current streak (consecutive days of saving).
Highlights daily goal (e.g., “Save 60 minutes today”).


Purpose: Set a positive tone for the day and encourage users to engage with their goals.

2. Spin for Time Cards

Mechanism:
Each spin yields a time card with values like 5, 10, 15, 20, or 30 minutes.
Rare outcomes include:
Troll Card: Removes one card from the user’s storage.
Boost Card: Protects storage or increases chances of getting higher-value cards.


Animation lasts 5–7 seconds to create a light dopamine hit without being addictive.


Limitations:
Maximum 3 consecutive spins, followed by a 10-minute cooldown to prevent overuse.


Purpose: Gamify the allocation of social media time to make it exciting and controlled.

3. Post-Spin Choices
After spinning a time card, users choose one of three options:

Use Immediately:
Opens TikTok, with a timer counting down the allocated time.
App blocks TikTok once the time is up.


Store in Inventory:
Saves the time card for later use within the same day.
Risk: Troll cards can wipe out stored cards, adding strategic depth.


Save to Vault:
Permanently locks the time into the vault, making it unusable but contributing to long-term goals.
Vault savings accumulate toward milestones (500, 1000, 2000 minutes) for rewards.




Purpose: Empower users to make strategic decisions, balancing instant gratification with long-term rewards.

4. Mid-Day Interaction

Users can:
Access stored cards to use remaining time.
Spin again if spins are available.
Check progress (time saved, TikTok usage, vault totals).


Purpose: Maintain engagement throughout the day without overwhelming the user.

5. End of Day Summary

Summary Screen:
Displays total time saved, TikTok usage, and vault progress.
Awards points for achieving daily goals.
Updates streak count if the goal was met.
Suggests boosts (e.g., extra spins or protection) for the next day.


Purpose: Reinforce progress, celebrate achievements, and set up for the next day.


🎁 Reward System
1. Vault Milestones

Virtual Vault accumulates saved time, unlocking rewards at specific thresholds:
500 minutes: 1 Boost Card (e.g., protects inventory or increases high-value card odds).
1000 minutes: Unlock special features (e.g., app themes, virtual pets).
2000 minutes: Real-world rewards (e.g., online learning vouchers).


Purpose: Provide tangible incentives for long-term commitment.

2. Streaks

Mechanism: Maintaining consecutive days of meeting daily goals builds a streak.
7-day streak: Unlocks a significant reward (e.g., premium theme or extra spins).
Breaking a streak: Resets to zero, leveraging loss aversion to encourage consistency.


Purpose: Create a sense of urgency and commitment to daily engagement.


👤 Target Audience

Demographics:
Gen Z (15–25 years old): High school/college students.
Young Professionals: Early-career individuals who overuse TikTok.


Psychographics:
Aware of negative social media habits but lack tools to regulate them.
Motivated by gamification, rewards, and self-improvement.


Purpose: Tailor the app to users who are tech-savvy, dopamine-driven, and open to behavioral change.


💡 Unique Selling Points (USPs)
Compared to apps like One Sec, Time Vault stands out by:

Rewarding Self-Control: Instead of just delaying app access, it provides tangible, accumulative rewards.
Gamifying TikTok Usage: Turns TikTok into a controlled reward rather than a blocked app.
Clean Dopamine Loop: Fosters pride, progress, and achievement rather than mindless scrolling.
Strategic Depth: Choices (use, store, save) and risks (troll cards) add engagement and replayability.


🔮 Future Vision

Partnerships: Collaborate with online learning platforms to convert saved time into course discounts.
Marketplace: Allow users to exchange saved time for virtual items (themes, pets), boosts, or real-world rewards.
AI Personalization: Analyze user behavior to tailor goals, rewards, and notifications for individual preferences.
Scalability: Expand to other addictive apps (e.g., Instagram, YouTube) with similar mechanics.


🛠️ Current Product Status

UI Design: Completed by the founder, with a polished and user-friendly interface.
Development: Dedicated developer working on the Minimum Viable Product (MVP).
Stage: Preparing to launch MVP and test initial marketing campaigns.
Goals:
Acquire 1000–5000 initial users to validate user behavior.
Monetize through boost cards, feature unlocks, premium themes, and vault aesthetics.


Needs:
Front-End/Back-End Development:
Build core features (spinning, time tracking, vault, rewards).
Ensure smooth UI/UX integration.


Onboarding Optimization:
Streamline first-time user experience to maximize retention.
Create intuitive tutorials and prompts.


Marketing Content:
Generate test ad content (videos, banners, social posts) emphasizing gamification and rewards.


Behavioral Tracking & Analytics:
Implement tracking for user actions (spins, card choices, vault savings, TikTok usage).
Analyze data to refine features and improve engagement.






📝 Technical Requirements
Front-End

Tech Stack: React Native or Flutter for cross-platform mobile app (iOS/Android).
Features:
Interactive spin wheel with animations (5–7 seconds per spin).
Real-time display of vault, streaks, and progress.
Smooth transitions for onboarding, daily summaries, and reward unlocks.


UI Components:
Main dashboard (spins, vault, streak, goals).
Card selection interface (use, store, save).
Notification system for daily check-ins and reminders.



Back-End

Tech Stack: Node.js with Express or Django for API, MongoDB or PostgreSQL for database.
Features:
User authentication and profile management.
Time card generation with randomized outcomes (weighted probabilities for balance).
Storage and vault management (securely track saved time and rewards).
Integration with TikTok API (or equivalent) for time tracking and blocking.


Analytics:
Track spins, card choices, time usage, and vault progress.
Generate reports for user retention, engagement, and monetization potential.



Onboarding Optimization

Tutorial Flow:
Interactive guide explaining spins, card choices, and vault system.
Gamified onboarding (e.g., first spin is guaranteed a high-value card).


Retention Hooks:
Immediate reward for completing onboarding (e.g., free boost card).
Personalized daily goals based on user input during setup.



Marketing Content

Ad Types:
Short videos (15–30s) showcasing the spin wheel and rewards.
Social media posts highlighting user success stories (e.g., “Saved 1000 minutes and earned a voucher!”).
Banners emphasizing “Turn TikTok into a reward” and “Master your time”.


Channels:
TikTok, Instagram Reels, and YouTube Shorts for Gen Z reach.
Student-focused forums and communities (e.g., Reddit, Discord).



Behavioral Tracking

Data Points:
Spin frequency and outcomes.
Card choice distribution (use vs. store vs. save).
TikTok usage time vs. saved time.
Streak maintenance and breaks.
Reward redemption rates.


Tools:
Use Mixpanel or Amplitude for event tracking.
Build dashboards for real-time user behavior insights.


Purpose: Identify drop-off points, optimize engagement loops, and refine monetization strategies.


🚀 Next Steps

MVP Development:
Finalize front-end/back-end code for core features (spins, card choices, vault, rewards).
Test TikTok integration for accurate time tracking and blocking.


User Testing:
Launch beta with 100–500 users to gather feedback on UX and engagement.
Iterate based on user behavior data.


Marketing Rollout:
Launch initial ad campaign targeting Gen Z on TikTok and Instagram.
Monitor acquisition costs and user retention.


Analytics Setup:
Implement tracking for all user actions.
Analyze data to refine features and prioritize development for v2.




💸 Monetization Plan

In-App Purchases:
Boost cards (e.g., $0.99 for 3 boosts).
Premium themes or vault aesthetics ($1.99–$4.99).
Feature unlocks (e.g., custom goals or advanced analytics for $2.99).


Subscription Model (Future):
Monthly plan for unlimited spins, exclusive themes, and priority rewards.


Partnerships:
Convert saved time into real-world rewards (e.g., learning platform vouchers).






