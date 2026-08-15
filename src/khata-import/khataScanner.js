/* ============================================================
   KHATA SCANNER

   Responsible for:

   - Reading uploaded PDF/image data
   - Extracting PDF text
   - Detecting bad/garbled PDF text
   - Falling back to Gujarati OCR
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
   KHATA SCAN PROGRESS UI
============================================================ */

function updateKhataScanProgress(
    percent,
    status = "",
    pageText = ""
) {

    const overlay =
        document.getElementById(
            "khataScanProgressOverlay"
        );

    const fill =
        document.getElementById(
            "khataScanProgressFill"
        );

    const percentText =
        document.getElementById(
            "khataScanProgressPercent"
        );

    const statusText =
        document.getElementById(
            "khataScanProgressStatus"
        );

    const pageElement =
        document.getElementById(
            "khataScanProgressPage"
        );


    if (!overlay) {
        return;
    }


    overlay.style.display = "flex";


    const safePercent =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(percent)
            )
        );


    if (fill) {

        fill.style.width =
            safePercent + "%";

    }


    if (percentText) {

        percentText.textContent =
            safePercent + "%";

    }


    if (statusText) {

        statusText.textContent =
            status;

    }


    if (pageElement) {

        pageElement.textContent =
            pageText;

    }

}


/* ============================================================
   SHOW SCANNER
============================================================ */

function showKhataScanProgress() {

    updateKhataScanProgress(
        0,
        "Preparing file...",
        ""
    );

}


/* ============================================================
   HIDE SCANNER
============================================================ */

function hideKhataScanProgress() {

    const overlay =
        document.getElementById(
            "khataScanProgressOverlay"
        );


    if (overlay) {

        overlay.style.display =
            "none";

    }

}

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
   OCR CONFIGURATION
   ============================================================ */

const KHATA_OCR_SCRIPT =
    "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";

const KHATA_OCR_LANG_PATH =
    "https://tessdata.projectnaptha.com/4.0.0/";

let khataOCRWorker = null;
let khataOCRLoading = null;


/* ============================================================
   LOAD TESSERACT.JS
   ============================================================ */

async function loadKhataOCRLibrary() {

    if (
        typeof Tesseract !== "undefined"
    ) {

        return Tesseract;

    }


    if (khataOCRLoading) {

        return await khataOCRLoading;

    }


    khataOCRLoading =
        new Promise(function(resolve, reject) {

            console.log(
                "Loading Gujarati OCR library..."
            );


            const script =
                document.createElement("script");


            script.src =
                KHATA_OCR_SCRIPT;


            script.async =
                true;


            script.onload =
                function() {

                    console.log(
                        "Gujarati OCR library loaded."
                    );

                    resolve(
                        window.Tesseract
                    );

                };


            script.onerror =
                function(error) {

                    console.error(
                        "Gujarati OCR library failed to load.",
                        error
                    );

                    reject(
                        new Error(
                            "Gujarati OCR library could not be loaded."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        });


    return await khataOCRLoading;
}


/* ============================================================
   CREATE GUJARATI OCR WORKER
   ============================================================ */

async function getKhataOCRWorker() {

    if (
        khataOCRWorker
    ) {

        return khataOCRWorker;

    }


    const Tesseract =
        await loadKhataOCRLibrary();


    if (
        !Tesseract
    ) {

        throw new Error(
            "Tesseract.js is unavailable."
        );

    }


    console.log(
        "Creating Gujarati OCR worker..."
    );


    khataOCRWorker =
        await Tesseract.createWorker(
            "guj",
            1,
            {

                langPath:
                    KHATA_OCR_LANG_PATH,

                logger:
                    function(message) {

                        if (
                            message &&
                            message.status
                        ) {

                            console.log(
                                "Gujarati OCR:",
                                message.status,
                                message.progress
                                    ? Math.round(
                                        message.progress * 100
                                    ) + "%"
                                    : ""
                            );

                        }

                    }

            }
        );


    console.log(
        "Gujarati OCR worker ready."
    );


    return khataOCRWorker;
}


/* ============================================================
   DETECT BAD / GARBLED PDF TEXT
   ============================================================ */

function isKhataTextGarbled(text) {

    if (!text || !text.trim()) {
        return true;
    }

    const cleaned = text.trim();

    const gujaratiCount =
        (cleaned.match(/[\u0A80-\u0AFF]/g) || []).length;

    const replacementCount =
        (cleaned.match(/�/g) || []).length;

    const badCharacters =
        cleaned.match(
            /[ƞƟƑƒƗƘƨƩƪƫƬƭƮƏƐƢƣƤƥƦƧ]/g
        ) || [];

    const badCount =
        badCharacters.length;

    /*
       Completely empty text
       → OCR
    */

    if (cleaned.length === 0) {
        return true;
    }

    /*
       Replacement characters
       → OCR
    */

    if (replacementCount > 0) {
        return true;
    }

    /*
       Strong evidence of broken PDF encoding
       → OCR
    */

    if (badCount >= 3) {
        return true;
    }

    /*
       No Gujarati at all on a Gujarati Khata page
       → OCR
    */

    if (gujaratiCount === 0) {
        return true;
    }

    /*
       Otherwise trust PDF.js.
    */

    return false;
}


/* ============================================================
   RENDER PDF PAGE TO CANVAS
   ============================================================ */

async function renderKhataPDFPage(
    page,
    scale = 2.0
) {

    const viewport =
        page.getViewport({
            scale: scale
        });


    const canvas =
        document.createElement(
            "canvas"
        );


    const context =
        canvas.getContext(
            "2d"
        );


    canvas.width =
        Math.ceil(
            viewport.width
        );


    canvas.height =
        Math.ceil(
            viewport.height
        );


    await page.render({

        canvasContext:
            context,

        viewport:
            viewport

    }).promise;


    return canvas;
}



/* ============================================================
   OCR ONE PDF PAGE
   ============================================================ */

async function ocrKhataPDFPage(
    page,
    pageNumber
) {

    console.log(
        "Starting Gujarati OCR for page:",
        pageNumber
    );


    const worker =
        await getKhataOCRWorker();


    let canvas = null;


    try {

        /*
           Render only this page.
        */

        canvas =
            await renderKhataPDFPage(
                page,
                2.0
            );


        console.log(
            "Canvas rendered for OCR:",
            pageNumber,
            canvas.width,
            "x",
            canvas.height
        );


        /*
           OCR the page.
        */

        const result =
            await worker.recognize(
                canvas
            );


        const text =
            result &&
            result.data &&
            result.data.text
                ? result.data.text.trim()
                : "";


        console.log(
            "Gujarati OCR completed:",
            pageNumber,
            "Characters:",
            text.length
        );


        return text;

    }
    finally {

        /*
           IMPORTANT:
           Release the canvas immediately after OCR.

           Do NOT keep large canvases in memory.
        */

        if (canvas) {

            canvas.width = 1;
            canvas.height = 1;

            if (canvas.parentNode) {

                canvas.parentNode.removeChild(
                    canvas
                );

            }

        }

        canvas = null;


        /*
           Give the browser a moment to
           release rendering resources.
        */

        await new Promise(
            function(resolve) {

                setTimeout(
                    resolve,
                    50
                );

            }
        );


        console.log(
            "OCR canvas released:",
            pageNumber
        );

    }

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

      showKhataScanProgress();


      for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber++
      ) {
      
          const progress =
              ((pageNumber - 1) / pdf.numPages) * 100;
      
      
          updateKhataScanProgress(
              progress,
              "Scanning Khata pages...",
              `Page ${pageNumber} of ${pdf.numPages}`
          );

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


        const extractedText =
            textContent.items
                .map(
                    function(item) {

                        return item.str || "";

                    }
                )
                .join(" ");


        console.log(
            "PDF text length:",
            extractedText.length
        );


        /* ----------------------------------------------------
           CHECK TEXT QUALITY
        ---------------------------------------------------- */

        const needsOCR =
            isKhataTextGarbled(
                extractedText
            );


        console.log(
            "Khata page:",
            pageNumber,
            "Needs Gujarati OCR:",
            needsOCR
        );


        let finalText =
            extractedText;


        /* ----------------------------------------------------
           GUJARATI OCR FALLBACK
        ---------------------------------------------------- */

        if (
            needsOCR
        ) {

            try {

                console.log(
                    "PDF text appears garbled."
                );

                console.log(
                    "Using Gujarati OCR fallback for page:",
                    pageNumber
                );

              updateKhataScanProgress(
                    ((pageNumber - 1) / pdf.numPages) * 100,
                    "Gujarati OCR is reading this page...",
                    `Page ${pageNumber} of ${pdf.numPages}`
                );
                

                const ocrText =
                    await ocrKhataPDFPage(
                        page,
                        pageNumber
                    );


              

                  if (
                        ocrText &&
                        ocrText.trim().length > 0
                    ) {
                    
                        /*
                           IMPORTANT:
                    
                           When OCR succeeds, use OCR text alone.
                    
                           Do NOT combine garbled PDF.js text
                           with OCR text.
                    
                           Combining both causes duplicate Khata
                           numbers and duplicate holder names.
                        */
                    
                        finalText =
                            ocrText.trim();
                    
                    
                        console.log(
                            "Gujarati OCR text used for page:",
                            pageNumber
                        );
                    
                    }
                    else {
                    
                        console.warn(
                            "Gujarati OCR returned empty text. Keeping PDF text."
                        );
                    
                    }

            }
            catch (ocrError) {

                console.error(
                    "Gujarati OCR failed for page:",
                    pageNumber,
                    ocrError
                );


                /*
                   IMPORTANT:

                   OCR failure must NOT destroy the original
                   PDF extraction.

                   We keep the PDF.js text as fallback.
                */

                finalText =
                    extractedText;

            }

        }


        /* ----------------------------------------------------
           SAVE PAGE
        ---------------------------------------------------- */

        pages.push({

            pageNumber:
                pageNumber,

            text:
                finalText

        });

      /*
         Release PDF.js page resources.
      */
      
      if (
          page &&
          typeof page.cleanup === "function"
      ) {
      
          page.cleanup();
      
      }

        updateKhataScanProgress(
              (pageNumber / pdf.numPages) * 100,
              needsOCR
                  ? "Reading page with Gujarati OCR..."
                  : "Reading Khata pages...",
              `Page ${pageNumber} of ${pdf.numPages}`
          );

    }


    console.log(
        "KHATA PDF TEXT EXTRACTION COMPLETE"
    );


    const result = {

        type:
            "pdf",

        fileName:
            file.name,

        pageCount:
            pdf.numPages,

        pages:
            pages

    };

      updateKhataScanProgress(
          100,
          "Khata scanning completed!",
          `${pdf.numPages} pages processed`
      );

        await new Promise(
          function(resolve) {
      
              setTimeout(
                  resolve,
                  500
              );
      
          }
      );
      
      hideKhataScanProgress();

  
    return result;
}


/* ============================================================
   SCAN IMAGE
   ============================================================ */

async function scanKhataImage(file) {

    console.log(
        "Khata image received."
    );


    /* --------------------------------------------------------
       IMAGE OCR
    -------------------------------------------------------- */

    try {

        const worker =
            await getKhataOCRWorker();


        const result =
            await worker.recognize(
                file
            );


        const text =
            result &&
            result.data &&
            result.data.text
                ? result.data.text.trim()
                : "";


        console.log(
            "Gujarati image OCR completed."
        );


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
                        text

                }

            ]

        };

    }
    catch (error) {

        console.error(
            "Gujarati image OCR failed:",
            error
        );


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

}


/* ============================================================
   EXPORT SCANNER
============================================================ */

window.scanKhataFile =
    scanKhataFile;


/* ============================================================
   SCANNER READY
============================================================ */

console.log(
    "Khata Scanner ready."
);