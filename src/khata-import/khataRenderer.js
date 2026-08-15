/* ============================================================
   KHATA RENDERER
   ============================================================

   Responsible for:

   - Receiving parsed Khata records
   - Detecting the active editor
   - Mapping Khata number → Column A
   - Mapping first holder name → Column B
   - Creating rows using the correct editor function
   - Keeping missing Khata names blank

   NOT responsible for:

   - File selection
   - PDF reading
   - OCR
   - Parsing Khata numbers
   - Extracting names
   - Saving to Firebase
============================================================ */


/* ============================================================
   MODULE LOADED
============================================================ */

console.log(
    "Khata Renderer module loaded"
);


/* ============================================================
   DETECT ACTIVE EDITOR
============================================================ */

function getActiveKhataEditor() {

    /*
       --------------------------------------------------------
       TALAPATRAK
       --------------------------------------------------------
    */

    const talapatrakEditor =
        document.getElementById(
            "talapatrakEditorView"
        );


    if (
        talapatrakEditor &&
        isKhataEditorVisible(
            talapatrakEditor
        )
    ) {

        return "talapatrak";

    }


    /*
       --------------------------------------------------------
       SHIKSHANUPAKARAN
       --------------------------------------------------------
    */

    const shikshanupakaranEditor =
        document.getElementById(
            "shikshanupakaranEditorView"
        );


    if (
        shikshanupakaranEditor &&
        isKhataEditorVisible(
            shikshanupakaranEditor
        )
    ) {

        return "shikshanupakaran";

    }


    /*
       --------------------------------------------------------
       NO ACTIVE EDITOR
       --------------------------------------------------------
    */

    return null;

}


/* ============================================================
   CHECK EDITOR VISIBILITY
============================================================ */

function isKhataEditorVisible(element) {

    if (!element) {
        return false;
    }


    /*
       Explicit inline display:none
    */

    if (
        element.style.display === "none"
    ) {

        return false;

    }


    /*
       Computed display
    */

    const computedStyle =
        window.getComputedStyle(
            element
        );


    if (
        computedStyle.display === "none"
    ) {

        return false;

    }


    return true;

}


/* ============================================================
   NORMALIZE KHATA NUMBER
============================================================ */

function normalizeRendererKhataNumber(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .trim();

}


/* ============================================================
   NORMALIZE HOLDER NAME
============================================================ */

function normalizeRendererKhataName(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/\s+/g, " ")
        .trim();

}


/* ============================================================
   ESCAPE HTML

   Used when inserting values into
   input.value through innerHTML.
============================================================ */

function escapeKhataRendererHTML(
    value
) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ============================================================
   CREATE TALAPATRAK KHATA ROW
============================================================ */

function createKhataTalapatrakRow(
    khata
) {

    if (
        typeof createTalapatrakRow !==
        "function"
    ) {

        console.error(
            "createTalapatrakRow() is not available."
        );

        return null;

    }


    const row =
        createTalapatrakRow({

            A:
                normalizeRendererKhataNumber(
                    khata.khataNumber
                ),

            B:
                normalizeRendererKhataName(
                    khata.name
                )

        });


    return row;

}


/* ============================================================
   CREATE SHIKSHANUPAKARAN KHATA ROW
============================================================ */

function createKhataShikshanupakaranRow(
    khata
) {

    if (
        typeof createShikshanupakaranRow !==
        "function"
    ) {

        console.error(
            "createShikshanupakaranRow() is not available."
        );

        return null;

    }


    const row =
        createShikshanupakaranRow({

            A:
                normalizeRendererKhataNumber(
                    khata.khataNumber
                ),

            B:
                normalizeRendererKhataName(
                    khata.name
                )

        });


    return row;

}


/* ============================================================
   MAP KHATA RECORD TO EXISTING ROW

   This is useful when rows already exist.

   It ONLY changes A and B.
============================================================ */

function mapKhataToRow(
    row,
    khata,
    editorType
) {

    if (
        !row ||
        !khata
    ) {

        return false;

    }


    const khataNumber =
        normalizeRendererKhataNumber(
            khata.khataNumber
        );


    const name =
        normalizeRendererKhataName(
            khata.name
        );


    /*
       --------------------------------------------------------
       TALAPATRAK
       --------------------------------------------------------
    */

    if (
        editorType ===
        "talapatrak"
    ) {

        const numberInput =
            row.querySelector(
                ".columnA"
            );


        const nameInput =
            row.querySelector(
                ".columnB"
            );


        if (numberInput) {

            numberInput.value =
                khataNumber;

        }


        if (nameInput) {

            nameInput.value =
                name;

        }


        return true;

    }


    /*
       --------------------------------------------------------
       SHIKSHANUPAKARAN
       --------------------------------------------------------
    */

    if (
        editorType ===
        "shikshanupakaran"
    ) {

        const numberInput =
            row.querySelector(
                '[data-column="A"]'
            );


        const nameInput =
            row.querySelector(
                '[data-column="B"]'
            );


        if (numberInput) {

            numberInput.value =
                khataNumber;

        }


        if (nameInput) {

            nameInput.value =
                name;

        }


        return true;

    }


    return false;

}


/* ============================================================
   CLEAR EXISTING KHATA ROWS

   IMPORTANT:

   We clear only the table body.
   We do NOT touch the rest of the editor.
============================================================ */

function clearKhataEditorRows(
    editorType
) {

    if (
        editorType ===
        "talapatrak"
    ) {

        const body =
            document.getElementById(
                "talapatrakBody"
            );


        if (body) {

            body.innerHTML = "";

        }


        return;

    }


    if (
        editorType ===
        "shikshanupakaran"
    ) {

        const body =
            document.getElementById(
                "shikshanupakaranBody"
            );


        if (body) {

            body.innerHTML = "";

        }


        return;

    }

}


/* ============================================================
   MAP ALL KHATA RECORDS
============================================================ */

function mapKhataRecordsToEditor(
    parsedResult
) {

    console.log(
        "================================="
    );

    console.log(
        "KHATA → EDITOR MAPPING STARTED"
    );

    console.log(
        "================================="
    );


    /*
       --------------------------------------------------------
       VALIDATE PARSED DATA
       --------------------------------------------------------
    */

    if (
        !Array.isArray(parsedResult)
    ) {

        console.error(
            "Khata renderer expected an array.",
            parsedResult
        );

        return false;

    }


    /*
       --------------------------------------------------------
       FIND ACTIVE EDITOR
       --------------------------------------------------------
    */

    const editorType =
        getActiveKhataEditor();


    if (!editorType) {

        console.error(
            "No active Khata editor found."
        );

        alert(
            "Please open Talapatrak or Shikshanupakaran editor first."
        );

        return false;

    }


    console.log(
        "Active editor:",
        editorType
    );


    /*
       --------------------------------------------------------
       VALID KHATA RECORDS
       --------------------------------------------------------
    */

    const khatas =
        parsedResult.filter(
            function(khata) {

                return (
                    khata &&
                    khata.khataNumber
                );

            }
        );


    if (
        khatas.length === 0
    ) {

        console.warn(
            "No valid Khata records found."
        );

        return false;

    }


    console.log(
        "Khata records to map:",
        khatas.length
    );


    /*
       --------------------------------------------------------
       CLEAR CURRENT TABLE
       
       Uploading Khata data should rebuild
       the editor rows from the parsed data.
       --------------------------------------------------------
    */

    clearKhataEditorRows(
        editorType
    );


    /*
       --------------------------------------------------------
       CREATE ROWS
       --------------------------------------------------------
    */

    let createdRows = 0;


    khatas.forEach(
        function(khata, index) {

            let row = null;


            /*
               -----------------------------------------------
               TALAPATRAK
               -----------------------------------------------
            */

            if (
                editorType ===
                "talapatrak"
            ) {

                row =
                    createKhataTalapatrakRow(
                        khata
                    );

            }


            /*
               -----------------------------------------------
               SHIKSHANUPAKARAN
               -----------------------------------------------
            */

            else if (
                editorType ===
                "shikshanupakaran"
            ) {

                row =
                    createKhataShikshanupakaranRow(
                        khata
                    );

            }


            if (row) {

                createdRows++;

            }


            console.log(
                "Mapped Khata:",
                index + 1,
                "→",
                khata.khataNumber,
                "→",
                khata.name ||
                    "(blank)"
            );

        }
    );


    /*
       --------------------------------------------------------
       RENUMBER
       
       For safety, make sure serial values
       remain sequential after rendering.
       --------------------------------------------------------
    */

    if (
        editorType ===
        "talapatrak" &&
        typeof renumberTalapatrakRows ===
        "function"
    ) {

        renumberTalapatrakRows();

    }


    if (
        editorType ===
        "shikshanupakaran" &&
        typeof renumberShikshanupakaranRows ===
        "function"
    ) {

        renumberShikshanupakaranRows();

    }


    /*
       --------------------------------------------------------
       RESULT
       --------------------------------------------------------
    */

    console.log(
        "================================="
    );

    console.log(
        "KHATA → EDITOR MAPPING COMPLETE"
    );

    console.log(
        "Editor:",
        editorType
    );

    console.log(
        "Rows created:",
        createdRows
    );

    console.log(
        "================================="
    );


    return true;

}


/* ============================================================
   CONVENIENCE FUNCTION

   This is the function the upload workflow
   will call later.

   Example:

       mapParsedKhataToEditor(records);
============================================================ */

function mapParsedKhataToEditor(
    parsedResult
) {

    return mapKhataRecordsToEditor(
        parsedResult
    );

}


/* ============================================================
   DEBUG FUNCTION

   Useful from browser console:

       testKhataEditorMapping(records)
============================================================ */

function testKhataEditorMapping(
    parsedResult
) {

    console.log(
        "TESTING KHATA EDITOR MAPPING..."
    );


    return mapKhataRecordsToEditor(
        parsedResult
    );

}


/* ============================================================
   EXPORT
============================================================ */

window.mapKhataRecordsToEditor =
    mapKhataRecordsToEditor;

window.mapParsedKhataToEditor =
    mapParsedKhataToEditor;

window.testKhataEditorMapping =
    testKhataEditorMapping;


/* ============================================================
   READY
============================================================ */

console.log(
    "Khata Renderer ready."
);