// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
};

if (environment.production) {
    var url = 'https://dashboard.classdesign.us/';
} else {
    var url = 'http://localhost/';
}

export const urls = {
    url: url,
    urlctagories: url + 'classapi/api/apiCategories.php',
    urlusers: url + 'classapi/api/apiUsers.php',
    urlContact: url + 'classapi/api/apiContact.php',
    urlProducts: url + 'classapi/api/apiProducts.php',
    urlOrders: url + 'classapi/api/apiOrders.php',
    urlImages: url + 'classapi/api/apiImages.php',
    urlStripe: url + 'classapi/core/stripe.php',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
