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