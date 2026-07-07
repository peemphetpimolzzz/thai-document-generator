// Thai Document Generator — Azure infrastructure (deployment-ready).
//
// Provisions the PDF-rendering service as an Azure Container App. The image
// (which bundles Chromium for Puppeteer) is pulled from Azure Container
// Registry using a user-assigned managed identity — no registry passwords. The
// service is stateless and needs no database.
//
// Deploy:
//   az deployment group create -g <rg> -f infra/main.bicep -p infra/main.bicepparam
//
// See docs/deployment.md for the full walkthrough (identity, OIDC, first push).

targetScope = 'resourceGroup'

@description('Base name used to derive resource names. Lowercase letters and numbers.')
@minLength(3)
@maxLength(20)
param appName string = 'thaidocgen'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Container image reference for the service. Leave as the placeholder for the first infra-only deploy; the deploy workflow updates it on each release.')
// Bootstrap note: the placeholder image listens on :80, while ingress and the
// probes below target 8080, so the first (infra-only) revision stays unhealthy
// until the deploy workflow pushes the real image. That is expected.
param apiImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

var suffix = uniqueString(resourceGroup().id, appName)
var acrName = toLower('${appName}acr${suffix}')
var identityName = '${appName}-id'
var envName = '${appName}-cae'
var logName = '${appName}-logs'
var appServiceName = '${appName}-svc'

var acrPullRoleId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false
  }
}

resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, identity.id, acrPullRoleId)
  scope: acr
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', acrPullRoleId)
  }
}

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: envName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logs.properties.customerId
        sharedKey: logs.listKeys().primarySharedKey
      }
    }
  }
}

resource app 'Microsoft.App/containerApps@2024-03-01' = {
  name: appServiceName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity.id}': {}
    }
  }
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
        allowInsecure: false
      }
      registries: [
        {
          server: acr.properties.loginServer
          identity: identity.id
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: apiImage
          // Chromium needs headroom — give the renderer 1 vCPU / 2 GiB.
          resources: {
            cpu: json('1.0')
            memory: '2Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '8080'
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/health'
                port: 8080
              }
              initialDelaySeconds: 15
              periodSeconds: 15
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/ready'
                port: 8080
              }
              initialDelaySeconds: 10
              periodSeconds: 15
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
  dependsOn: [
    acrPull
  ]
}

@description('Login server of the container registry (used by the deploy workflow).')
output acrLoginServer string = acr.properties.loginServer

@description('Name of the container registry.')
output acrName string = acr.name

@description('Name of the container app (used by the deploy workflow).')
output appName string = app.name

@description('Public URL of the service.')
output appUrl string = 'https://${app.properties.configuration.ingress.fqdn}'
