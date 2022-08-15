<h1 align="center">
  BIC test case
</h1>

## Description

Need to make a function code that will download the file http://www.cbr.ru/s/newbik, unzip zip, parse XML, prepare and return an array of objects for writing to DB.

There can be multiple Accounts in a **BICDirectoryEntry**. Each **Accounts** needs its own object in the returned array. If there are no **Accounts**, then such a **BICDirectoryEntry** is not of interest.

## Installation

```bash
$ yarn install
```

## Running the app

### Build

```bash
$ yarn build
```

### Run

```bash
$ yarn start
```

Result will be saved in source folder into `result.json` in `result` element as array.