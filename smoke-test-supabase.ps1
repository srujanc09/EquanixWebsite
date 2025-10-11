# Smoke test: Supabase signup -> backend /api/users/profile
# Update these values:
$proj = 'dahfglewyoeflcalzice.supabase.co'  # e.g. xyz.supabase.co (no https://)
$anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGZnbGV3eW9lZmxjYWx6aWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjc2NTcsImV4cCI6MjA3NTcwMzY1N30.EdYIv3gGxZefprPHO4EPT28aohA3oQxVPJ_FnuYNRdM'                 # anon/public key (frontend)
$email = 'anish.talla99@gmail.com'
$password = 'JSNJSN'

# Signup via Supabase REST
$body = @{ email = $email; password = $password } | ConvertTo-Json
Write-Host "Signing up $email via Supabase..."
try {
  $signup = Invoke-RestMethod -Uri "https://$proj/auth/v1/signup" -Method Post `
    -Headers @{ 'apikey' = $anon; 'Authorization' = "Bearer $anon"; 'Content-Type' = 'application/json' } `
    -Body $body -ErrorAction Stop
} catch {
  Write-Host "Signup request failed:" $_.Exception.Message
  exit 1
}

Write-Host "Signup response:"
$signup | Format-List

$accessToken = $signup.session.access_token
if (-not $accessToken) {
  Write-Host "No access token returned. If Supabase requires email confirmation, confirm the account in the email then run the login step instead."
  exit 1
}

Write-Host "Calling backend /api/users/profile with Supabase access token..."
try {
  $profile = Invoke-RestMethod -Uri 'http://localhost:5001/api/users/profile' -Method Get -Headers @{ Authorization = "Bearer $accessToken" } -ErrorAction Stop
  Write-Host "Backend response:"
  $profile | ConvertTo-Json -Depth 5 | Write-Host
} catch {
  Write-Host "Profile request failed:" $_.Exception.Message
  exit 1
}

Write-Host "Smoke test completed successfully."