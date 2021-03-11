# Simple Component Generator

![Node](https://img.shields.io/static/v1?label=NodeJS&message=v14.16.0&color=blue)
![NPM](https://img.shields.io/static/v1?label=NPM&message=v6.14.11&color=orange)

> Simple Component Generator helps you to kickstart your new components, by removing the cumbersome process of creating and configuring each file individually.

[![Video](https://s4.gifyu.com/images/Screen-Recording-2021-03-08-at-1.gif)](https://s4.gifyu.com/images/Screen-Recording-2021-03-08-at-1.gif)

## Requirements

This tool is built on top of Node, so you don't need to install much tooling. It will basically work with any front-end setup just make sure to provide this tool with the instructions (blueprint folder) to fit your requirements. To get started you'll need the following:

- Node LTS
- Terminal
- Front-end setup

## Installation

For the best experience install this package globally with `yarn` or `npm` by this running this command in your terminal:

```
yarn global @remcolakens/simple-component-generator
```

That's it! You've successfully installed the Simple Component Generator.

### Configuration

Now all that's left is to create a new folder in your project like `@blueprint` and add all the files you need.
As the name suggest, this folder will act as the blueprint for all of your generated components, the blueprint folder is **NOT** restricted to any file type.

When creating the blueprint folder you'll have two new variables at your disposal: `FILENAME` && `COMPONENTTYPE`.
These variables are case-sensitive and reserved names, under the hood the Simple Component Generator just replaces these names with the data you provide in the terminal.

Last but not least, it's highly recommended creating a new config file. In this file you can define the `component` and `blueprint` path so it will integrate in any front-end setup.

In the root of your project create a new file with the name `.blueprint.json` using the following example and change the paths.

#### .blueprint.json

```json
{
  "componentDir": "./components/",
  "blueprintDir": "./blueprint/"
}
```

## How to Use

It's very simple to get started just run the following command in your terminal:

```shell
generate
```

You will get a simple questionnaire and that’s it your component has been generated.

## Bugs

Found a bug? Please verify your Node version with the versions listed above.

Still not working, or do you have other questions / feedback?
Please post an issue in the Github repository, and I will have a look at it.

## List of contributers

- [Remco Lakens](info@remcolakens.nl)

## License

[MIT](LICENSE)
