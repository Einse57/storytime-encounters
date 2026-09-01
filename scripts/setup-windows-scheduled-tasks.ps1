# Setup Windows Scheduled Tasks for Storytime Encounters
# Registers:
# 1. StorytimeEncounters_DailyRepoCheck (Runs once daily at 9:00 AM)
# 2. StorytimeEncounters_WeeklyRoadmap (Runs once weekly on Mondays at 10:00 AM)

$DailyScript = (Resolve-Path "$PSScriptRoot\daily-repo-monitor.ps1").Path
$WeeklyScript = (Resolve-Path "$PSScriptRoot\weekly-roadmap-proposals.ps1").Path

Write-Host "Registering Windows Scheduled Tasks..."

# Task 1: Daily Repo Monitor (Daily at 9:00 AM)
$ActionDaily = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$DailyScript`""
$TriggerDaily = New-ScheduledTaskTrigger -Daily -At "09:00"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "StorytimeEncounters_DailyRepoCheck" `
    -Action $ActionDaily `
    -Trigger $TriggerDaily `
    -Settings $Settings `
    -Description "Daily check of Storytime Encounters GitHub repo for new issues or PR updates" `
    -Force | Out-Null

Write-Host "Registered: StorytimeEncounters_DailyRepoCheck (Daily at 9:00 AM)"

# Task 2: Weekly Roadmap (Mondays at 10:00 AM)
$ActionWeekly = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$WeeklyScript`""
$TriggerWeekly = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "10:00"

Register-ScheduledTask -TaskName "StorytimeEncounters_WeeklyRoadmap" `
    -Action $ActionWeekly `
    -Trigger $TriggerWeekly `
    -Settings $Settings `
    -Description "Weekly roadmap proposals for Storytime Encounters features, infrastructure, and UI" `
    -Force | Out-Null

Write-Host "Registered: StorytimeEncounters_WeeklyRoadmap (Weekly on Mondays at 10:00 AM)"
Write-Host "`nAll Windows Scheduled Tasks have been created successfully in Windows Task Scheduler."
