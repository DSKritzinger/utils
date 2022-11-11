/**
 * This function aims to provide pdf splitting functionality.
 * 
 * version: 1.0
 * functionality: split pdf into single pages from provided page ranges.
 * 
 * @param {string} pathToPdf The path to the pdf to be split.
 * @param {number} startPageNum Starting position for page splitting.
 * @param {number} endPageNum Ending position for page splitting.
 */

const fs = require('fs');
const PDFDocument = require('pdf-lib').PDFDocument;

async function singleSplitPdf(pathToPdf, startPageNum, endPageNum) {
    const documentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(documentAsBytes);
    
    const numberOfPages = pdfDoc.getPageCount();

    for (let i = startPageNum - 1; i <= endPageNum -1; i++) {
        // Create a new "sub" document
        const subDocument = await PDFDocument.create();
        // Copy the page at the current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
        subDocument.addPage(copiedPage);

        const pdfBytes = await subDocument.save();
        await writePdfBytesToFile(`page-${ i+1 }.pdf`, pdfBytes);
    };
};

function writePdfBytesToFile(fileName, pdfBytes) {
    fs.mkdir('output', { recursive: true }, (err) => {
        if (err)
            throw err;
        else
            return fs.promises.writeFile(`./output/${fileName}`, pdfBytes);
    })
};

(async () => {
    await singleSplitPdf("./example.pdf", 7, 35);
})();