# Atlassian Marketplace Connector for Google Sheets

Bring your Atlassian Marketplace data to Google Sheets and create reports and charts to visualize your sales
performance, licensing data or, conversion events.

🗄️️ Available datasets:

* [Transactions](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-sales-transactions-export-get)
* [Licenses](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-licenses-export-get)
* [Feedback](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-feedback-details-export-get)
* [Churn events](https://developer.atlassian.com/platform/marketplace/rest/api-group-reporting/#api-vendors-vendorid-reporting-sales-metrics-salemetric-details-export-get)
* [Conversion events](https://developer.atlassian.com/platform/marketplace/rest/api-group-reporting/#api-vendors-vendorid-reporting-sales-metrics-salemetric-details-export-get)
* [Renewal events](https://developer.atlassian.com/platform/marketplace/rest/api-group-reporting/#api-vendors-vendorid-reporting-sales-metrics-salemetric-details-export-get)
* [Evaluation benchmark](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-benchmark-evaluations-get)
* [Sales benchmark](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-benchmark-sales-get)
* [Churn benchmark](https://developer.atlassian.com/platform/marketplace/rest/v2/api-group-reporting/#api-vendors-vendorid-reporting-sales-metrics-churn-benchmark-get)

## Get started

### Build and deploy the connector to App Script

1. Clone the repository and install dependencies.

        git clone https://github.com/toolsplus/atlassian-marketplace-sheets-connector
        cd atlassian-marketplace-sheets-connector
        npm install
        
1. Enable the Google Apps Script API: https://script.google.com/home/usersettings

1. Log in to Google clasp and authorize using your Google account.

        npx clasp login
        
1. Create a new Google Script in your Google Drive.

        npx clasp create --type sheets --title "Atlassian Marketplace Sheets Connector" --rootDir ./dist
        
1. Deploy the project (production or development build).

        // Production build
        npm run deploy:prod
        
        // Development build
        npm run deploy
   
### Setting up the connector

Once you have deployed the connector script go to the associated **Google Sheet > Add-ons > Atlassian Marketplace Sheets Connector > Login**.

You will be asked to enter your Atlassian account email and API token. If you do not have an API token you can generate
one at https://id.atlassian.com/manage/api-tokens. Refer to the [Atlassian documentation](https://developer.atlassian.com/platform/marketplace/rest/intro/#auth) for further details on how to generate API tokens.

Currently, the script will check the list of available vendors for the logged-in user and select the first one.

### Import data

Once you have successfully logged in you can import data into the Google Sheet by clicking **Add-ons > Atlassian Marketplace Sheets Connector > Load datasets**
