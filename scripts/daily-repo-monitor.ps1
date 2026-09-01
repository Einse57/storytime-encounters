# Daily GitHub Repository Monitor for Storytime Encounters
# Checks issues, PRs, and comments over the last 24 hours.

param(
    [string]$Repo = "Einse57/storytime-encounters",
    [string]$Token = $env:GITHUB_TOKEN
)

$ErrorActionPreference = "Stop"
$Headers = @{
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "StorytimeEncountersMonitor"
}

if ($Token) {
    $Headers["Authorization"] = "Bearer $Token"
}

Write-Host "=== Checking GitHub Repository: $Repo ==="
$SinceDate = (Get-Date).AddDays(-1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

try {
    # 1. Fetch Issues
    $IssuesUri = "https://api.github.com/repos/$Repo/issues?state=all&since=$SinceDate"
    $Issues = Invoke-RestMethod -Uri $IssuesUri -Method Get -Headers $Headers

    $OpenIssues = $Issues | Where-Object { -not $_.pull_request -and $_.state -eq "open" }
    $ClosedIssues = $Issues | Where-Object { -not $_.pull_request -and $_.state -eq "closed" }
    $PullRequests = $Issues | Where-Object { $_.pull_request }

    Write-Host "Daily Status Report ($(Get-Date -Format 'yyyy-MM-dd HH:mm')):"
    Write-Host "  Open Issues:   $($OpenIssues.Count)"
    Write-Host "  Closed Issues: $($ClosedIssues.Count)"
    Write-Host "  Pull Requests: $($PullRequests.Count)"

    if ($OpenIssues.Count -gt 0) {
        Write-Host "`nOpen Issues:"
        foreach ($issue in $OpenIssues) {
            Write-Host "  #$($issue.number): $($issue.title) ($($issue.html_url))"
        }
    }

    if ($PullRequests.Count -gt 0) {
        Write-Host "`nRecent PR Activity:"
        foreach ($pr in $PullRequests) {
            Write-Host "  #$($pr.number): $($pr.title) [State: $($pr.state)] ($($pr.html_url))"
        }
    }

    if ($OpenIssues.Count -eq 0 -and $PullRequests.Count -eq 0) {
        Write-Host "`nNo new open issues or PR activity in the last 24 hours. Everything is clean!"
    }
} catch {
    Write-Error "Failed to fetch GitHub repository data: $_"
}
