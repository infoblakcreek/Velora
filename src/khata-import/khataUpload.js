/* ============================================================
   KHATA UPLOAD
   ============================================================
   Handles file selection only.

   This file does NOT:
   - scan the document
   - perform OCR
   - find Khata numbers
   - extract names
   - modify the editor

   Those responsibilities will come later.
   ============================================================ */


/* ------------------------------------------------------------
   SUPPORTED FILE TYPES
------------------------------------------------------------ */

const KHATA_SUPPORTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* ------------------------------------------------------------
   OPEN FILE PICKER
------------------------------------------------------------ */

/**
 * Opens the user's file picker.
 *
 * @param {Function} onFileSelected
 * Callback that receives the selected File object.
 */

function openKhataFilePicker(onFileSelected) {

    const fileInput = document.createElement("input");

    fileInput.type = "file";

    fileInput.accept = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp"
    ].join(",");

    fileInput.style.display = "none";

    document.body.appendChild(fileInput);


    fileInput.addEventListener("change", function () {

        const file = fileInput.files[0];

        if (!file) {
            fileInput.remove();
            return;
        }


        /* ----------------------------------------------------
           CHECK FILE TYPE
        ---------------------------------------------------- */

        if (
            !KHATA_SUPPORTED_FILE_TYPES.includes(
                file.type
            )
        ) {

            console.error(
                "Unsupported Khata file type:",
                file.type
            );

            alert(
                "Please select a PDF, JPG, PNG or WEBP file."
            );

            fileInput.remove();

            return;
        }


        /* ----------------------------------------------------
           FILE SELECTED SUCCESSFULLY
        ---------------------------------------------------- */

        console.log(
            "Khata file selected:",
            file.name
        );

        console.log(
            "Khata file type:",
            file.type
        );

        console.log(
            "Khata file size:",
            file.size,
            "bytes"
        );


        /* ----------------------------------------------------
           SEND FILE TO CALLER
        ---------------------------------------------------- */

        if (
            typeof onFileSelected === "function"
        ) {

            onFileSelected(file);

        }


        /* ----------------------------------------------------
           CLEAN UP TEMPORARY INPUT
        ---------------------------------------------------- */

        fileInput.remove();

    });


    /* --------------------------------------------------------
       OPEN FILE PICKER
    -------------------------------------------------------- */

    fileInput.click();

}


/* ------------------------------------------------------------
   READ FILE AS ARRAY BUFFER
------------------------------------------------------------ */

/**
 * Reads a selected file as an ArrayBuffer.
 *
 * Useful later for PDF processing.
 *
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */

function readKhataFileAsArrayBuffer(file) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();


        reader.onload = function () {

            resolve(
                reader.result
            );

        };


        reader.onerror = function () {

            reject(
                new Error(
                    "Unable to read Khata file."
                )
            );

        };


        reader.readAsArrayBuffer(file);

    });

}


/* ------------------------------------------------------------
   READ FILE AS DATA URL
------------------------------------------------------------ */

/**
 * Reads an image file as a Data URL.
 *
 * Useful later for OCR/image processing.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */

function readKhataFileAsDataURL(file) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();


        reader.onload = function () {

            resolve(
                reader.result
            );

        };


        reader.onerror = function () {

            reject(
                new Error(
                    "Unable to read Khata image."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


/* ============================================================
   KHATA UPLOAD LOADED
============================================================ */

console.log(
    "Khata Upload module loaded successfully"
);


/* ============================================================
   CONNECT KHATA UPLOAD BUTTON
============================================================ */

function initializeKhataUpload() {

    const uploadButton =
        document.getElementById(
            "talapatrakKhataUploadButton"
        );


    if (!uploadButton) {

        console.warn(
            "Khata Upload button not found."
        );

        return;

    }


    uploadButton.addEventListener(
        "click",
        function() {

            console.log(
                "================================="
            );

            console.log(
                "KHATA UPLOAD BUTTON CLICKED"
            );

            console.log(
                "================================="
            );


            openKhataFilePicker(
                handleKhataFileSelected
            );

        }
    );


    console.log(
        "Khata Upload button connected."
    );

}



/* ============================================================
   HANDLE SELECTED KHATA FILE
============================================================ */

async function handleKhataFileSelected(
    file
) {

    console.log(
        "Khata file received:",
        file.name
    );


    try {

        /*
           Scanner will receive the File.

           Scanner is responsible for:

           PDF/image reading
           ↓
           page extraction
           ↓
           raw page text
        */

        if (
            typeof scanKhataFile !==
            "function"
        ) {

            console.error(
                "scanKhataFile() is not available."
            );

            return;

        }


        console.log(
            "Starting Khata scanner..."
        );


        const scanResult =
            await scanKhataFile(
                file
            );


        console.log(
            "Khata scanner completed."
        );


        console.log(
            "Scanner result:",
            scanResult
        );


        /*
           ----------------------------------------------------
           SEND SCANNER RESULT TO PARSER
           ----------------------------------------------------
        */

        if (
            typeof parseKhataResult !==
            "function"
        ) {

            console.error(
                "parseKhataResult() is not available."
            );

            return;

        }


        console.log(
            "Starting Khata parser..."
        );


        const khataRecords =
            parseKhataResult(
                scanResult
            );


        console.log(
            "Khata parser completed."
        );


        console.log(
            "Parsed Khata records:",
            khataRecords
        );


        /*
           ----------------------------------------------------
           SEND PARSED DATA TO EDITOR
           ----------------------------------------------------
        */

        if (
            typeof mapKhataRecordsToEditor !==
            "function"
        ) {

            console.error(
                "mapKhataRecordsToEditor() is not available."
            );

            return;

        }


        console.log(
            "Starting editor mapping..."
        );


        mapKhataRecordsToEditor(
            khataRecords
        );


        console.log(
            "================================="
        );

        console.log(
            "KHATA IMPORT COMPLETE"
        );

        console.log(
            "================================="
        );

    }
    catch (error) {

        console.error(
            "KHATA IMPORT FAILED:",
            error
        );


        alert(
            "Khata import failed. Please check the console."
        );

    }

}



/* ============================================================
   INITIALIZE
============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeKhataUpload
    );

}
else {

    initializeKhataUpload();

}


/* ============================================================
   KHATA UPLOAD → SCAN → PARSE → RENDER
============================================================ */

async function handleKhataUploadForEditor() {

    console.log(
        "================================="
    );

    console.log(
        "KHATA EDITOR UPLOAD STARTED"
    );

    console.log(
        "================================="
    );


    /*
       --------------------------------------------------------
       OPEN FILE PICKER
       --------------------------------------------------------
    */

    openKhataFilePicker(
        async function(file) {

            try {

                console.log(
                    "Selected Khata file:",
                    file.name
                );


                /*
                   ------------------------------------------------
                   STEP 1
                   SCAN
                   ------------------------------------------------
                */

                console.log(
                    "STEP 1 → KHATA SCANNER"
                );


                const scanResult =
                    await scanKhataFile(
                        file
                    );


                console.log(
                    "Khata scanner result:",
                    scanResult
                );


                /*
                   ------------------------------------------------
                   STEP 2
                   PARSE
                   ------------------------------------------------
                */

                console.log(
                    "STEP 2 → KHATA PARSER"
                );


                const parsedResult =
                    parseKhataResult(
                        scanResult
                    );


                console.log(
                    "Khata parser result:",
                    parsedResult
                );


                /*
                   ------------------------------------------------
                   DEBUG SUMMARY
                   ------------------------------------------------
                */

                if (
                    typeof logKhataSummary ===
                    "function"
                ) {

                    logKhataSummary(
                        parsedResult
                    );

                }


                /*
                   ------------------------------------------------
                   STEP 3
                   RENDER
                   ------------------------------------------------
                */

                console.log(
                    "STEP 3 → KHATA RENDERER"
                );


                const mapped =
                    mapParsedKhataToEditor(
                        parsedResult
                    );


                if (!mapped) {

                    console.error(
                        "Khata data could not be mapped to editor."
                    );

                    return;

                }


                /*
                   ------------------------------------------------
                   COMPLETE
                   ------------------------------------------------
                */

                console.log(
                    "================================="
                );

                console.log(
                    "KHATA EDITOR UPLOAD COMPLETE"
                );

                console.log(
                    "================================="
                );

            }
            catch (error) {

                console.error(
                    "KHATA EDITOR UPLOAD FAILED:",
                    error
                );


                alert(
                    "Khata data could not be imported. Please check the console."
                );

            }

        }
    );

}


/* ============================================================
   CONNECT TALAPATRAK UPLOAD BUTTON
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const talapatrakButton =
            document.getElementById(
                "talapatrakKhataUploadButton"
            );


        if (
            talapatrakButton
        ) {

            talapatrakButton.addEventListener(
                "click",
                function() {

                    console.log(
                        "Talapatrak Khata Upload clicked."
                    );


                    handleKhataUploadForEditor();

                }
            );

        }


        /*
           ----------------------------------------------------
           CONNECT SHIKSHANUPAKARAN UPLOAD BUTTON
           ----------------------------------------------------
        */

        const shikshanupakaranButton =
            document.getElementById(
                "shikshanupakaranKhataUploadButton"
            );


        if (
            shikshanupakaranButton
        ) {

            shikshanupakaranButton.addEventListener(
                "click",
                function() {

                    console.log(
                        "Shikshanupakaran Khata Upload clicked."
                    );


                    handleKhataUploadForEditor();

                }
            );

        }

    }
);