using './main.bicep'

// Base name used to derive resource names (lowercase letters/numbers).
param appName = 'thaidocgen'

// The deploy workflow overrides apiImage with the ACR image on each release;
// the placeholder default lets the first infra-only deploy succeed.
