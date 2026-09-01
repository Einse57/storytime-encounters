# Weekly Roadmap Proposal Generator for Storytime Encounters
# Proposes 2-3 prioritized roadmap items across infrastructure, features, and UI.

param(
    [string]$OutputDir = "$PSScriptRoot\..\docs\roadmap-proposals"
)

$DateStr = Get-Date -Format "yyyy-MM-dd"
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$OutputFile = Join-Path $OutputDir "roadmap-$DateStr.md"

$Proposals = @"
# Storytime Encounters - Weekly Roadmap Proposal ($DateStr)

Here are 3 prioritized recommendations addressing infrastructure, features, and UI/UX improvements:

## 1. Infrastructure: Progressive Web App (PWA) Offline Caching
- **Category:** Infrastructure / Reliability
- **Goal:** Enable full offline storytelling for outdoor adventures, bedtime reading without Wi-Fi, and road trips.
- **Implementation:**
  - Add `vite-plugin-pwa` with CacheFirst strategy for audio sound effects, WebP art assets, and font files.
  - Add Web App Manifest with portrait orientation lock and home screen installation badges.

## 2. Feature: Custom Story Pack Creator
- **Category:** Core Feature / Personalization
- **Goal:** Empower parents and game masters to create custom story packs featuring their children's real names, favorite toys, or fantasy themes.
- **Implementation:**
  - Simple modal form to add custom Settings, Conflicts, Hooks, Loot, and Creatures.
  - Store custom packs in browser `localStorage` with JSON export/import capability.

## 3. UI/UX: Bedtime Theater Mode (Immersive Presentation)
- **Category:** User Interface & Immersion
- **Goal:** Provide a darkened, distraction-free reading experience that puts the illustrated comic panel and story text front and center.
- **Implementation:**
  - Single-click toggle to enter Bedtime Mode: dims controls, enlarges the comic panel, and displays large, high-contrast serif story text.
  - Gentle audio ambiance loop option for background immersion.
"@

$Proposals | Out-File -FilePath $OutputFile -Encoding utf8
Write-Host "Generated weekly roadmap proposal at: $OutputFile"
Write-Host $Proposals
