"use strict";

const { join } = require("path");
const { Transform } = require("stream");
const { createReadStream, existsSync } = require("fs");
const { Workbook } = require("exceljs");
const toJson = require("csvtojson");

const processFile = (csvPath, key = "Subject", colorized = false) => {
    const existsFile = existsSync(csvPath);
    if (!existsFile) throw new Error(`File not found in path "${csvPath}"`);
    const csvStream = createReadStream(csvPath);

    const wb = new Workbook();
    const xlsxPath = join(__dirname, "..", "..", "output", "data.xlsx");

    const validateObjectKey = (json, key) => {
        const isValidKey = Object.keys(json).includes(key);
        if (!isValidKey) throw new Error(`Key "${key}" do not exists`);
    };

    const getObjectByKey = new Transform({
        objectMode: true,
        transform(obj, enc, cb) {
            let parsed = {};
            const json = JSON.parse(obj);
            validateObjectKey(json, key);
            parsed[json[key]] = json;
            this.push(JSON.stringify(parsed));
            cb();
        },
    });

    const getColumns = (obj) => {
        return Object.keys(obj).reduce((acc, col) => {
            acc.push({
                header: col,
                key: col,
                style: { font: { name: "Arial" } },
            });
            return acc;
        }, []);
    };

    let columns = [];
    const writeOnXlsx = new Transform({
        objectMode: true,
        transform(obj, enc, cb) {
            const [entries] = Object.entries(JSON.parse(obj));
            const [key, val] = entries;
            const wsOnWB = wb.getWorksheet(key);
            const ws = wsOnWB ? wsOnWB : wb.addWorksheet(key);
            ws.columns = columns.length ? columns : getColumns(val);
            ws.addRow(val);
            this.push(".");
            cb();
        },
    });

    csvStream
        .pipe(toJson())
        .pipe(getObjectByKey)
        .pipe(writeOnXlsx)
        .pipe(process.stdout);

    const colorizeCell = (cell, color) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color },
        };
    };

    const colorizeSheet = (ws) => {
        ws.columns.forEach((column) => {
            column.eachCell({ includeEmpty: false }, (cell) => {
                if (cell.value < 5) {
                    colorizeCell(cell, "FF32CD32");
                } else if (cell.value >= 5) {
                    colorizeCell(cell, "FFFF0000");
                }
            });
        });
    };

    csvStream.on("end", async () => {
        wb.eachSheet((ws, sid) => {
            ws.getRow(1).font = { name: "Arial", bold: true };
            if (colorized) {
                colorizeSheet(ws);
            }
        });
        await wb.xlsx.writeFile(xlsxPath);
        console.log("Done!");
    });
};

module.exports = { processFile };
