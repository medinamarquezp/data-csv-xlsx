"use strict";

const { join } = require("path");
const { Readable } = require("stream");
const { createWriteStream } = require("fs");
const faker = require("faker");
const json2csv = require("../utils/json2csv");
const { gradesList, subjects } = require("./staticData");

const generateGrades = (numStudens) => {
    const readable = new Readable({ objectMode: true });
    for (let i = 0; i < numStudens; i++) {
        readable.push(getUserGrades());
    }
    readable.push(null);
    return readable;
};

const getUserGrades = () => {
    let student = {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        grades: [],
    };
    subjects.forEach((subject) => {
        const glnp = [...gradesList, "n/p"];
        const firstCallGrade = faker.random.arrayElement(glnp);
        const secondCallGrade = faker.random.arrayElement(glnp);
        student.grades.push({
            subject,
            firstCallGrade,
            secondCallGrade,
            lastCallGrade: getLastCallGrade(firstCallGrade, secondCallGrade),
        });
    });
    return student;
};

const getLastCallGrade = (firstCallGrade, secondCallGrade) => {
    if (
        (firstCallGrade === "n/p" && secondCallGrade < 10) ||
        (secondCallGrade === "n/p" && firstCallGrade < 10) ||
        (firstCallGrade + secondCallGrade) / 2 < 5
    ) {
        return faker.random.arrayElement(gradesList);
    }
    return "n/a";
};

const generateCsv = (numStudens, filename = null) => {
    filename = filename ? filename : "grades.csv";
    const grades = generateGrades(numStudens);
    const path = join(__dirname, "..", "..", "output", filename);

    grades.pipe(json2csv()).pipe(createWriteStream(path));

    return new Promise((resolve, reject) => {
        grades.on("end", () => {
            resolve(`File has been created and saved in "${path}"`);
        });
        grades.on("error", (err) => {
            reject(err);
        });
    });
};

module.exports = {
    generateGrades,
    getUserGrades,
    getLastCallGrade,
    generateCsv,
};
