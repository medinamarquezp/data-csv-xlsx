"use strict";

const {
    Transform,
    transforms: { unwind },
} = require("json2csv");
const { fields } = require("../mocks/staticData");

const json2csv = (csvFields) => {
    csvFields = csvFields ? csvFields : fields;
    return new Transform(
        { fields: csvFields, transforms: [unwind({ paths: ["grades"] })] },
        { objectMode: true }
    );
};

module.exports = json2csv;
