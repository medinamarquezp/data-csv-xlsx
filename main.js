"use strict";

const chalk = require("chalk");
const figlet = require("figlet");
const argv = require("minimist")(process.argv.slice(2));
const { generateCsv } = require("./src/mocks/mockGrades");
const { processFile } = require("./src/csv2xlsx/processFile");

const APP_VERSION = "1.0.0";

const helpMenu = () => {
    console.log(
        chalk.blueBright(
            figlet.textSync("File processor", { horizontalLayout: "full" })
        )
    );
    const helpContent = `
        Usage: npm run app

        Options:
        --gm           Generates a csv file with students grades mock       [void]
            --sn       Number of students to generate grades                [number][required]
        --pf           Process CSV file and convert to XLSX                 [void]
            --p        Path to CSV file                                     [string][required]
            --k        Key to split content by XLSX sheets                  [string]
            --c        Colorize student grades                              [void]
        --h            Shows program help                                   [void]    
        --v            Shows version number                                 [void]

        Examples:
        Generate a mock with 5 students:                npm run app -- --gm --sn=5
        Process a CSV file by key and colorize grades:  npm run app -- --pf --p="./output/test.csv" --k="Subject" --c
    `;
    console.log(helpContent);
};

const generateCsvMock = async (number) => {
    const message = await generateCsv(number);
    console.log(message);
};

const processCsvFile = (path, key, colorized) => {
    processFile(path, key, colorized);
};

const run = () => {
    const { gm, sn, pf, p, k, c, v, h } = argv;
    if (gm && sn && typeof sn === "number") {
        generateCsvMock(sn);
    } else if (pf && p && k) {
        try {
            if (c) {
                processCsvFile(p, k, c);
            } else {
                processCsvFile(p, k);
            }
        } catch (error) {
            console.error(error.message);
        }
    } else if (v) {
        console.log(APP_VERSION);
    } else if (h) {
        helpMenu();
    } else {
        helpMenu();
    }
};

run();
