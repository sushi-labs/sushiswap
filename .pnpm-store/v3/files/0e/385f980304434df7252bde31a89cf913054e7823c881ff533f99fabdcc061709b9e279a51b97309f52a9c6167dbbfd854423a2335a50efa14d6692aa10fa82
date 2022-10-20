# React Image File Resizer

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Build Status](https://travis-ci.org/onurzorluer/react-image-file-resizer.svg?branch=master)](https://travis-ci.org/onurzorluer/react-image-file-resizer.svg?branch=master) [![npm version](https://badge.fury.io/js/react-image-file-resizer.svg)](https://badge.fury.io/js/react-image-file-resizer)

`react-image-file-resizer` is a react module that can rescaled local images.

- You can change image's width, height, format, rotation and quality.
- It returns resized image's new base64 URI or Blob. The URI can be used as the source of an `<Image>` component.

## Setup

Install the package:

```
npm i react-image-file-resizer
```

or

```
yarn add react-image-file-resizer
```

## Usage

```javascript
import Resizer from "react-image-file-resizer";

Resizer.imageFileResizer(
  file, // Is the file of the image which will resized.
  maxWidth, // Is the maxWidth of the resized new image.
  maxHeight, // Is the maxHeight of the resized new image.
  compressFormat, // Is the compressFormat of the resized new image.
  quality, // Is the quality of the resized new image.
  rotation, // Is the degree of clockwise rotation to apply to uploaded image.
  responseUriFunc, // Is the callBack function of the resized new image URI.
  outputType, // Is the output type of the resized new image.
  minWidth, // Is the minWidth of the resized new image.
  minHeight // Is the minHeight of the resized new image.
);
```

## Example 1

First, wrap the resizer:

```javascript
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
```

And then use it in your async function:

```javascript
const onChange = async (event) => {
  try {
    const file = event.target.files[0];
    const image = await resizeFile(file);
    console.log(image);
  } catch (err) {
    console.log(err);
  }
};
```

## Example 2

```javascript
import React, { Component } from "react";
import Resizer from "react-image-file-resizer";

class App extends Component {
  constructor(props) {
    super(props);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.state = {
      newImage: "",
    };
  }

  fileChangedHandler(event) {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            this.setState({ newImage: uri });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <input type="file" onChange={this.fileChangedHandler} />
        <img src={this.state.newImage} alt="" />
      </div>
    );
  }
}

export default App;
```

| Option            | Description                                                                                                                                                            | Type       | Required |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| `file`            | Path of image file                                                                                                                                                     | `object`   | Yes      |
| `maxWidth`        | New image max width (ratio is preserved)                                                                                                                               | `number`   | Yes      |
| `maxHeight`       | New image max height (ratio is preserved)                                                                                                                              | `number`   | Yes      |
| `compressFormat`  | Can be either **JPEG**, **PNG** or **WEBP**.                                                                                                                           | `string`   | Yes      |
| `quality`         | A number between 0 and 100. Used for the JPEG compression.(if no compress is needed, just set it to 100)                                                               | `number`   | Yes      |
| `rotation`        | Degree of clockwise rotation to apply to the image. Rotation is limited to multiples of 90 degrees.(if no rotation is needed, just set it to 0) (0, 90, 180, 270, 360) | `number`   | Yes      |
| `responseUriFunc` | Callback function of URI. Returns URI of resized image's base64 format. ex: `uri => {console.log(uri)});`                                                              | `function` | Yes      |
| `outputType`      | Can be either **base64**, **blob** or **file**.(Default type is base64)                                                                                                | `string`   | No       |
| `minWidth`        | New image min width (ratio is preserved, defaults to null)                                                                                                             | `number`   | No       |
| `minHeight`       | New image min height (ratio is preserved, defaults to null)                                                                                                            | `number`   | No       |

## License

[MIT](https://opensource.org/licenses/mit-license.html)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/AhmadMaleki"><img src="https://avatars2.githubusercontent.com/u/26637638?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ahmad Maleki</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=AhmadMaleki" title="Code">💻</a> <a href="#maintenance-AhmadMaleki" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://www.vysnovsky.sk/"><img src="https://avatars1.githubusercontent.com/u/5657185?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin Vyšňovský</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=martinvysnovsky" title="Code">💻</a> <a href="#maintenance-martinvysnovsky" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/nadunc"><img src="https://avatars2.githubusercontent.com/u/22863180?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nadun Chamikara</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=nadunc" title="Code">💻</a> <a href="#maintenance-nadunc" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://shubhamzanwar.github.io/"><img src="https://avatars0.githubusercontent.com/u/15626155?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shubham Zanwar</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=shubhamzanwar" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/onderonur/"><img src="https://avatars0.githubusercontent.com/u/50423574?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Onur Önder</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=onderonur" title="Code">💻</a> <a href="#maintenance-onderonur" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://emreaybey.com/"><img src="https://avatars1.githubusercontent.com/u/45988990?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yunus Emre</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=YemreAybey" title="Code">💻</a> <a href="#maintenance-YemreAybey" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/velascojuan/"><img src="https://avatars.githubusercontent.com/u/4591845?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Juan</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=OverStruck" title="Code">💻</a> <a href="#maintenance-OverStruck" title="Maintenance">🚧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.facebook.com/sreang.rathanak"><img src="https://avatars.githubusercontent.com/u/12246079?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sreang Rathanak</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=RathanakSreang" title="Code">💻</a> <a href="#maintenance-RathanakSreang" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/andresriveratoro"><img src="https://avatars.githubusercontent.com/u/36863582?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andres Rivera</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=andresriveratoro" title="Code">💻</a> <a href="#maintenance-andresriveratoro" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/mmmulani"><img src="https://avatars.githubusercontent.com/u/192928?v=4?s=100" width="100px;" alt=""/><br /><sub><b>mmmulani</b></sub></a><br /><a href="https://github.com/onurzorluer/react-image-file-resizer/commits?author=mmmulani" title="Code">💻</a> <a href="#maintenance-mmmulani" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
