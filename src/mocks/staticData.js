"use strict";

const gradesList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const subjects = [
    "chemistry",
    "drawing",
    "history",
    "maths",
    "music",
    "physics",
    "science",
    "spanish",
    "technology",
];

const fields = [
    {
        label: "ID",
        value: "id",
    },
    {
        label: "Name",
        value: "name",
    },
    {
        label: "Lastname",
        value: "lastname",
    },
    {
        label: "Subject",
        value: "grades.subject",
    },
    {
        label: "1º Call Grade",
        value: "grades.firstCallGrade",
    },
    {
        label: "2º Call Grade",
        value: "grades.secondCallGrade",
    },
    {
        label: "Last Call Grade",
        value: "grades.lastCallGrade",
    },
];

module.exports = { gradesList, fields, subjects };
