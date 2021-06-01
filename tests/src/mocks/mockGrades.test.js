"use strict";

const { join } = require("path");
const csvParser = require("csvtojson");
const { existsSync, unlinkSync } = require("fs");
const {
    getUserGrades,
    getLastCallGrade,
    generateCsv,
} = require("../../../src/mocks/mockGrades");

describe("mockGradesData tests", () => {
    test("should calculate last call if student average is less than 5", () => {
        expect(typeof getLastCallGrade("n/p", 8)).toBe("number");
        expect(getLastCallGrade("n/p", 7)).toBeGreaterThanOrEqual(0);
        expect(getLastCallGrade("n/p", 6)).toBeLessThanOrEqual(10);
        expect(typeof getLastCallGrade(3, "n/p")).toBe("number");
        expect(getLastCallGrade(2, "n/p")).toBeGreaterThanOrEqual(0);
        expect(getLastCallGrade(1, "n/p")).toBeLessThanOrEqual(10);
        expect(typeof getLastCallGrade(1, 2)).toBe("number");
        expect(getLastCallGrade(2, 3)).toBeGreaterThanOrEqual(0);
        expect(getLastCallGrade(3, 4)).toBeLessThanOrEqual(10);
    });

    test("should return n/a if student average is greater than 5", () => {
        expect(getLastCallGrade(5, 9)).toBe("n/a");
    });

    test("should generate a user grade data", () => {
        const userGrades = getUserGrades();
        expect(typeof userGrades).toBe("object");
        expect(Object.keys(userGrades)).toEqual([
            "id",
            "name",
            "lastname",
            "grades",
        ]);
        expect(userGrades.grades.length).toBe(9);
        expect(userGrades.grades[0].subject).toBe("chemistry");
    });

    test("should generate a csv with 2 student grades", async () => {
        const path = join(__dirname, "..", "..", "..", "output", "test.csv");
        await generateCsv(2, "test.csv");
        expect(existsSync(path)).toBeTruthy();
        const content = await csvParser().fromFile(path);
        expect(content.length).toBe(18);
        expect(Object.keys(content[0])).toStrictEqual([
            "ID",
            "Name",
            "Lastname",
            "Subject",
            "1º Call Grade",
            "2º Call Grade",
            "Last Call Grade",
        ]);
        const gradeSchema = {
            ID: expect.any(String),
            Name: expect.any(String),
            Lastname: expect.any(String),
            Subject: expect.any(String),
            "1º Call Grade": expect.any(String),
            "2º Call Grade": expect.any(String),
            "Last Call Grade": expect.any(String),
        };
        expect(content[0]).toEqual(gradeSchema);
        expect(content[0].Subject).toBe("chemistry");
        unlinkSync(path);
    });
});
