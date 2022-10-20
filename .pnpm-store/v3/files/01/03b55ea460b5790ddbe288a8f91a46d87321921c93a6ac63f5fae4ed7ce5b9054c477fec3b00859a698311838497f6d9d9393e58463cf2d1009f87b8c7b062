Cloudinary URL-Gen SDK
=========================
[![Build Status](https://api.travis-ci.com/cloudinary/js-url-gen.svg?branch=master)](https://app.travis-ci.com/github/cloudinary/js-url-gen)
## About
The Cloudinary URL-Gen SDK allows you to quickly and easily integrate your application with Cloudinary.
Effortlessly optimize and transform your cloud's assets.

This SDK can also be used with [popular frontend frameworks](https://cloudinary.com/documentation/sdks/js/frontend-frameworks/index.html).

### Additional documentation
This Readme provides basic installation and usage information.
For the complete documentation, see the [URL-Gen SDK Guide](https://cloudinary.com/documentation/javascript_integration) and the [URL-Gen Reference](https://cloudinary.com/documentation/sdks/js/url-gen/index.html).


## Table of Contents
- [Key Features](#key-features)
- [Version Support](#Version-Support)
- [Installation](#installation)
- [Usage](#usage)
    - [Setup](#Setup)
    - [Transform and Optimize Assets](#Transform-and-Optimize-Assets)
    - [Generate Image and Video URLs](#Generate-Image-and-Video-URLs)
    - [Transpilation](#Transpilation)
    - [Testing with Jest](#Testing-with-jest)
- [Contributions](#Contributions)
- [Get Help](#Get-Help)
- [Additional Resources](#Additional-Resources)

## Key Features
- [Transform image](https://cloudinary.com/documentation/javascript_image_transformations) assets (links to docs).
- [Transform video](https://cloudinary.com/documentation/javascript_video_transformations) assets (links to docs).


## Version Support

### Note!
This SDK is cross-platform, but only the Node.js versions are worth mentioning

| SDK Version   | Node.js 10    | Node.js 12  | Node.js 14   | Node.js 16  |
|---------------|------------|----------|----------|----------|
|  1.x          | V          | V        | V        | V        |



## Installation
### Install using your favorite package manager (yarn, npm)
```bash
npm install @cloudinary/url-gen
```
```bash
yarn add @cloudinary/url-gen 
```

## Usage
### Setup
```javascript
// Import the Cloudinary class
import {Cloudinary} from '@cloudinary/url-gen';

// Create your instance
const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo'
  },
  url: {
    secure: true // force https, set to false to force http
  }
});
```


### Transform and Optimize Assets
- [See full documentation](https://cloudinary.com/documentation/javascript_image_transformations)
```javascript
// Create a new instance if you haven't (see above for the details)
const cld = new Cloudinary({/*...*/})

// Let's create a new image
const myImage = cld.image('sample');

// Import the resize transformation and apply it to myImage
import {Resize} from '@cloudinary/url-gen/actions/resize';

// Resize the image to 100x100
myImage.resize(Resize.scale().width(100).height(100));

// When we're done, we can apply all our changes and create a URL.
const myURL = myImage.toURL();

// https://res.cloudinary.com/demo/image/upload/c_scale,w_100,h_100/sample
console.log(myURL);
```

### Generate Image and Video URLs
The library supports transformations on both images and videos. Please use the appropriate method, as per below:

    - Use `cld.image()` to generate image URLs and transformations
    - Use `cld.video()` to generate video URLs and transformations

Both the `image()` and `video()` methods allow you to use `toURL()` to generate the final, transformed asset URL.

### File upload
This SDK does not provide file upload functionality, however there are [several methods of uploading from the client side](https://cloudinary.com/documentation/javascript_image_and_video_upload).

### Transpilation
`@cloudinary/url-gen` is shipped as untranspiled ES6 code.
`@cloudinary/url-gen` is optimized around bundle size, as such we do not transpile our distributed modules,
we leave the decision of what browsers to support, and what transpilations to apply, to you, the user.

### Testing with Jest
As mentioned above, we're shipping `@cloudinary/url-gen` with ES6 code, as this provides great tree-shaking potential.
it also requires a few adjustments when testing.

In jest.config, you'll need to add these lines to allow babel to transpile our code.
```json
{
  "transform": {
    "node_modules/@cloudinary/url-gen": "babel-jest"
  },
  "transformIgnorePatterns": ["/node_modules/(?!@cloudinary/url-gen)"]
}
```
Make sure to install babel-jest:
`npm install babel-jest`

You'll also need to ensure you have a `babel.config.js` file (and not a `.babelrc`), and that
it's configured properly to transpile code,

*As an example*:
```js
module.exports = {
  "presets": [
    "@babel/preset-env"
  ]
};
```

## Contributions
- Clone this repository
- Create a fork
- Make your changes 
- Run tests locally `npm run test` 
- Build project locally `npm run build`
- Push your changes
- Await a review from the maintainers 


## Get Help
If you run into an issue or have a question, you can either:
- [Open a Github issue](https://github.com/cloudinary/js-url-gen/issues) (for issues related to the SDK)
- [Open a support ticket](https://cloudinary.com/contact) (for issues related to your account)

Additional resources can be found here:
- [Getting started](https://cloudinary.com/documentation/sdks/js/url-gen/tutorial-gettingStarted.html)
- [Annotated Code Examples](https://cloudinary.com/documentation/sdks/js/url-gen/tutorial-annotatedExamples.html)
- [Setup & Configuration](https://cloudinary.com/documentation/sdks/js/url-gen/tutorial-configuration_.html)


## About Cloudinary
Cloudinary is a powerful media API for websites and mobile apps alike, Cloudinary enables developers to efficiently manage, transform, optimize, and deliver images and videos through multiple CDNs. Ultimately, viewers enjoy responsive and personalized visual-media experiences—irrespective of the viewing device.


## Additional Resources
- [React SDK](https://www.npmjs.com/package/@cloudinary/react)
- [Angular SDK](https://www.npmjs.com/package/@cloudinary/angular)
- [Use with a Frontend Framework](https://cloudinary.com/documentation/sdks/js/frontend-frameworks/index.html)
- [Cloudinary Transformation and REST API References](https://cloudinary.com/documentation/cloudinary_references): Comprehensive references, including syntax and examples for all SDKs.
- [MediaJams.dev](https://mediajams.dev/): Bite-size use-case tutorials written by and for Cloudinary Developers
- [DevJams](https://www.youtube.com/playlist?list=PL8dVGjLA2oMr09amgERARsZyrOz_sPvqw): Cloudinary developer podcasts on YouTube.
- [Cloudinary Academy](https://training.cloudinary.com/): Free self-paced courses, instructor-led virtual courses, and on-site courses.
- [Code Explorers and Feature Demos](https://cloudinary.com/documentation/code_explorers_demos_index): A one-stop shop for all code explorers, Postman collections, and feature demos found in the docs.
- [Cloudinary Roadmap](https://cloudinary.com/roadmap): Your chance to follow, vote, or suggest what Cloudinary should develop next.
- [Cloudinary Facebook Community](https://www.facebook.com/groups/CloudinaryCommunity): Learn from and offer help to other Cloudinary developers.
- [Cloudinary Account Registration](https://cloudinary.com/users/register/free): Free Cloudinary account registration.
- [Cloudinary Website](https://cloudinary.com)


## Licence
Released under the MIT license.
