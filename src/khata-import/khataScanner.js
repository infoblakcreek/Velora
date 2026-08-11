/* ============================================================
   KHATA SCANNER

   Responsible for:
   - Reading uploaded PDF/image data
   - Extracting PDF text
   - Returning raw page-level text

   NOT responsible for:
   - Finding Khata numbers
   - Selecting names
   - Generating sequences
   - Filling editor fields
   ============================================================ */

console.log(
    "Khata Scanner module loaded"
);

/* ============================================================
   PDF.JS WORKER CONFIGURATION
   ============================================================ */

if (
    typeof pdfjsLib !== "undefined"
) {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}

/* ============================================================
   SCAN KHATA FILE
   ============================================================ */

async function scanKhataFile(file) {

    if (!file) {

        throw new Error(
            "No Khata file was provided."
        );

    }


    console.log(
        "KHATA SCANNER STARTED"
    );

    console.log(
        "File:",
        file.name
    );

    console.log(
        "Type:",
        file.type
    );

    console.log(
        "Size:",
        file.size,
        "bytes"
    );


    /* --------------------------------------------------------
       PDF
    -------------------------------------------------------- */

    if (
        file.type ===
        "application/pdf"
    ) {

        return await scanKhataPDF(
            file
        );

    }


    /* --------------------------------------------------------
       IMAGE
    -------------------------------------------------------- */

    if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
    ) {

        return await scanKhataImage(
            file
        );

    }


    throw new Error(
        "Unsupported Khata file type."
    );

}


/* ============================================================
   SCAN PDF
   ============================================================ */

async function scanKhataPDF(file) {

    if (
        typeof pdfjsLib ===
        "undefined"
    ) {

        throw new Error(
            "PDF.js is not loaded."
        );

    }


    console.log(
        "Reading Khata PDF..."
    );


    const arrayBuffer =
        await readKhataFileAsArrayBuffer(
            file
        );


    const pdf =
        await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;


    console.log(
        "Khata PDF pages:",
        pdf.numPages
    );


    const pages = [];


    /* --------------------------------------------------------
       READ EVERY PAGE
    -------------------------------------------------------- */

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        console.log(
            "Extracting Khata page:",
            pageNumber,
            "/",
            pdf.numPages
        );


        const page =
            await pdf.getPage(
                pageNumber
            );


        const textContent =
            await page.getTextContent();


        const text =
            textContent.items
                .map(
                    function(item) {

                        return item.str || "";

                    }
                )
                .join(" ");


        pages.push({

            pageNumber:
                pageNumber,

            text:
                text

        });

    }


    console.log(
        "KHATA PDF TEXT EXTRACTION COMPLETE"
    );


    return {

        type:
            "pdf",

        fileName:
            file.name,

        pageCount:
            pdf.numPages,

        pages:
            pages

    };

}


/* ============================================================
   SCAN IMAGE
   ============================================================ */

async function scanKhataImage(file) {

    console.log(
        "Khata image received."
    );


    /*
       OCR will be added here.

       For now we deliberately do NOT
       pretend image text has been extracted.
    */

    return {

        type:
            "image",

        fileName:
            file.name,

        pageCount:
            1,

        pages: [

            {
                pageNumber:
                    1,

                text:
                    ""

            }

        ]

    };

}