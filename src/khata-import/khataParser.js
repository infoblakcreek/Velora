/* ============================================================
   KHATA PARSER

   Responsible for:

   - Reading raw page-level text from Khata Scanner
   - Finding ALL Khata numbers
   - Normalizing extracted Khata numbers
   - Extracting Khata holder names
   - Returning structured Khata records

   NOT responsible for:

   - Reading PDF files
   - OCR
   - Selecting editor fields
   - Generating sequences
   - Saving to Firebase
============================================================ */

console.log(
    "Khata Parser module loaded"
);



/* ============================================================
   PARSE COMPLETE KHATA RESULT
   ============================================================ */

function parseKhataResult(result) {

    if (
        !result ||
        !Array.isArray(result.pages)
    ) {

        throw new Error(
            "Invalid Khata scanner result."
        );

    }


    console.log(
        "KHATA PARSER STARTED"
    );

    console.log(
        "Pages received:",
        result.pages.length
    );


    const records = [];


    /* --------------------------------------------------------
       PROCESS EACH PAGE
    -------------------------------------------------------- */

    result.pages.forEach(function(page) {

        const text =
            page.text || "";


        /*
           Keep the existing Khata number extraction.
           DO NOT CHANGE THIS.
        */

        const khataNumbers =
            extractKhataNumbers(text);


        khataNumbers.forEach(
            function(khataNumber) {

                /*
                   Extract holder names belonging
                   to this Khata.
                */

                const name =
                    extractKhataName(
                        text,
                        khataNumber
                    );


                records.push({

                    pageNumber:
                        page.pageNumber,

                    khataNumber:
                        khataNumber,

                    name:
                        name,

                    rawText:
                        text,

                    /*
                       Real extracted record.
                    */

                    isPlaceholder:
                        false

                });


                console.log(
                    "Khata name extracted:",
                    khataNumber,
                    "→",
                    name
                );

            }
        );


        console.log(
            "Page",
            page.pageNumber,
            "→",
            khataNumbers.length,
            "Khata numbers"
        );

    });


    /* ========================================================
       CREATE MISSING KHATA NUMBERS
       
       Example:

       971
       973

       becomes:

       971
       972 ← empty placeholder
       973
    ======================================================== */

    console.log(
        "Checking for missing Khata numbers..."
    );


    /*
       Convert Gujarati digits to normal numbers
       for sequence checking.
    */

    function gujaratiToEnglishNumber(value) {

        if (!value) {
            return null;
        }


        const map = {

            "૦": "0",
            "૧": "1",
            "૨": "2",
            "૩": "3",
            "૪": "4",
            "૫": "5",
            "૬": "6",
            "૭": "7",
            "૮": "8",
            "૯": "9"

        };


        const english =
            String(value)
                .replace(
                    /[૦-૯]/g,
                    function(digit) {

                        return map[digit];

                    }
                );


        /*
           Make sure the result is actually numeric.
        */

        if (!/^\d+$/.test(english)) {
            return null;
        }


        return Number(english);

    }


    /*
       Convert normal number back to Gujarati digits.
    */

    function englishToGujaratiNumber(value) {

        const map = [

            "૦",
            "૧",
            "૨",
            "૩",
            "૪",
            "૫",
            "૬",
            "૭",
            "૮",
            "૯"

        ];


        return String(value)
            .replace(
                /\d/g,
                function(digit) {

                    return map[
                        Number(digit)
                    ];

                }
            );

    }


    /*
       Collect all actual Khata numbers.
    */

    const existingNumbers =
        new Set();


    records.forEach(
        function(record) {

            const numeric =
                gujaratiToEnglishNumber(
                    record.khataNumber
                );


            if (numeric !== null) {

                existingNumbers.add(
                    numeric
                );

            }

        }
    );


    /*
       Only create placeholders if we
       have at least two valid numbers.
    */

    if (
        existingNumbers.size >= 2
    ) {

        const sortedNumbers =
            Array.from(
                existingNumbers
            ).sort(
                function(a, b) {
                    return a - b;
                }
            );


        const firstNumber =
            sortedNumbers[0];


        const lastNumber =
            sortedNumbers[
                sortedNumbers.length - 1
            ];


        console.log(
            "Khata sequence:",
            firstNumber,
            "→",
            lastNumber
        );


        /*
           Find every missing number.
        */

        for (
            let number = firstNumber;
            number <= lastNumber;
            number++
        ) {

            if (
                existingNumbers.has(
                    number
                )
            ) {

                continue;

            }


            const missingKhata =
                englishToGujaratiNumber(
                    number
                );


            /*
               Create EMPTY placeholder.
            */

            const placeholder = {

                pageNumber:
                    null,

                khataNumber:
                    missingKhata,

                name:
                    "",

                rawText:
                    "",

                isPlaceholder:
                    true

            };


            records.push(
                placeholder
            );


            console.log(
                "Missing Khata created:",
                missingKhata
            );

        }

    }


    /* ========================================================
       SORT ALL KHATAS NUMERICALLY
       
       This ensures:

       ૯૭૧
       ૯૭૨
       ૯૭૩
       ૯૭૪

       rather than insertion/page order.
    ======================================================== */

    records.sort(
        function(a, b) {

            const aNumber =
                gujaratiToEnglishNumber(
                    a.khataNumber
                );


            const bNumber =
                gujaratiToEnglishNumber(
                    b.khataNumber
                );


            if (
                aNumber === null &&
                bNumber === null
            ) {

                return 0;

            }


            if (
                aNumber === null
            ) {

                return 1;

            }


            if (
                bNumber === null
            ) {

                return -1;

            }


            return (
                aNumber -
                bNumber
            );

        }
    );


    console.log(
        "KHATA PARSER COMPLETE"
    );


    console.log(
        "Actual Khata records:",
        records.filter(
            function(record) {
                return !record.isPlaceholder;
            }
        ).length
    );


    console.log(
        "Empty Khata records:",
        records.filter(
            function(record) {
                return record.isPlaceholder;
            }
        ).length
    );


    console.log(
        "Total Khata records:",
        records.length
    );


    /*
       IMPORTANT:

       Return the ARRAY directly.

       The existing Khata Scanner code does:

           khataRecords.forEach(...)

       Therefore parseKhataResult()
       must return an array.
    */

    return records;

}



/* ============================================================
   EXTRACT ALL KHATA NUMBERS

   DO NOT CHANGE THIS LOGIC.
   It is currently working.
============================================================ */

function extractKhataNumbers(text) {

    if (!text) {
        return [];
    }


    /*
       PDF.js extraction pattern:

       ખાતા નંબર  ૨૮૬
       ખાતા નંબર  ૨૮X
       ખાતા નંબર  ૩X૦

       IMPORTANT:

       In this PDF, PDF.js extracts Gujarati digit ૫
       as the character "X".

       Therefore:

       X → ૫
    */

    const regex =
        /ખાતા\s*નંબર[\s\S]{0,20}?([૦-૯0-9Xx]+)/gi;


    const matches =
        text.matchAll(regex);


    const numbers = [];


    for (const match of matches) {

        if (!match[1]) {
            continue;
        }


        let khataNumber =
            match[1].trim();


        /*
           PDF.js character mapping:

           X = Gujarati ૫

           Examples:

           ૨૯X → ૨૯૫
           ૩X૦ → ૩૫૦
           X૦૦ → ૫૦૦
           XX૦ → ૫૫૦
           ૧૦X૪ → ૧૦૫૪
        */

        khataNumber =
            khataNumber.replace(
                /[Xx]/g,
                "૫"
            );


        numbers.push(
            khataNumber
        );

    }


    return numbers;

}

async function testGujaratiOCR(canvas) {

    console.log("=================================");
    console.log("GUJARATI OCR TEST STARTED");
    console.log("=================================");

    if (
        typeof Tesseract === "undefined"
    ) {

        console.error(
            "Tesseract.js is not loaded."
        );

        return "";
    }


    try {

        const result =
            await Tesseract.recognize(
                canvas,
                "guj",
                {

                    logger:
                        function(info) {

                            console.log(
                                "Gujarati OCR:",
                                info
                            );

                        }

                }
            );


        const text =
            result.data.text
                .replace(/\s+/g, " ")
                .trim();


        console.log(
            "GUJARATI OCR RESULT:",
            text
        );


        console.log(
            "================================="
        );
        console.log(
            "GUJARATI OCR TEST COMPLETE"
        );
        console.log(
            "================================="
        );


        return text;

    }
    catch (error) {

        console.error(
            "GUJARATI OCR FAILED:",
            error
        );

        return "";

    }

}


/* ============================================================
   EXTRACT KHATA HOLDER NAME(S)

   This does NOT change Khata-number extraction.

   For each Khata number, we:

   1. Find the corresponding Khata section
   2. Stop at "કુ_ ખાતેદાર"
   3. Extract:
         ૧. Name
         ૨. Name
         ૩. Name
   4. Return all names as one string
============================================================ */

// function extractKhataName(text, khataNumber) {

//     if (!text || !khataNumber) {
//         return "";
//     }

//     /*
//        --------------------------------------------------------
//        NORMALIZE TEXT
//        --------------------------------------------------------
//     */

//     const normalizedText =
//         text.replace(/\r\n/g, "\n");


//     /*
//        --------------------------------------------------------
//        FIND THIS KHATA SECTION
//        --------------------------------------------------------
//     */

//     const khataRegex =
//         new RegExp(
//             "ખાતા\\s*નંબર\\s*[:：]?\\s*" +
//             khataNumber
//         );


//     const khataMatch =
//         normalizedText.match(
//             khataRegex
//         );


//     if (!khataMatch) {

//         console.warn(
//             "Khata section not found:",
//             khataNumber
//         );

//         return "";
//     }


//     /*
//        Start immediately after:

//        ખાતા નંબર : ૧૭૯
//     */

//     const startIndex =
//         khataMatch.index +
//         khataMatch[0].length;


//     let section =
//         normalizedText.substring(
//             startIndex
//         );


//     /*
//        --------------------------------------------------------
//        STOP AT NEXT KHATA
//        --------------------------------------------------------
//     */

//     const nextKhataMatch =
//         section.match(
//             /ખાતા\s*નંબર\s*[:：]?/i
//         );


//     if (nextKhataMatch) {

//         section =
//             section.substring(
//                 0,
//                 nextKhataMatch.index
//             );

//     }


//     /*
//        --------------------------------------------------------
//        SPLIT INTO OCR LINES
//        --------------------------------------------------------
//     */

//     const lines =
//         section
//             .split("\n")
//             .map(function(line) {

//                 return line.trim();

//             })
//             .filter(function(line) {

//                 return line.length > 0;

//             });




//     /*
//        --------------------------------------------------------
//        FIND HOLDER ROWS
       
//        Example:

//        ૩. હજામ મુકેશભાઈ અમથાભાઈ (૬૪૬) ૭૫ ૧-૩૩-૧૯ ૩.૦૦

//        ૪. હજામ શારદાબેન અમથાભાઈ (૬૪૬) કુલ સરવે નંબરો...
//        --------------------------------------------------------
//     */

//     const holderLines = [];


//     const holderRegex =
//           /^[^\s.]+\.\s*(.+?\([૦-૯0-9]+\))/;


         
//       lines.forEach(function(line) {
      
//           /*
//              ----------------------------------------------------
//              FIND HOLDER ROW
             
//              Example:
             
//              ૩. હજામ મુકેશભાઈ અમથાભાઈ (૬૪૬) ૭૫ ૧-૩૩-૧૯ ૩.૦૦
             
//              ૪. હજામ શારદાબેન અમથાભાઈ (૬૪૬) કુલ સરવે નંબરો...
//              ----------------------------------------------------
//           */
      
//           const match =
//               line.match(
//                   holderRegex
//               );
      
      
//           if (!match) {
//               return;
//           }
      
      
//           let holderText =
//               match[1].trim();
      
      
//           if (!holderText) {
//               return;
//           }
      
      
//           /*
//              ----------------------------------------------------
//              REMOVE PROPERTY / SURVEY INFORMATION
             
//              The reliable boundary is the numeric holder ID
//              inside parentheses.
             
//              Example:
             
//              સુથાર ધના હીરા (૩૭૮૨) ૫૫૭/૫૨ પૈકી ૨ ૦-૦૦૨-૦૨ ૦.૦૯
             
//              becomes:
             
//              સુથાર ધના હીરા (૩૭૮૨)
             
//              This is safer than trying to understand every
//              possible survey-number format.
//              ----------------------------------------------------
//           */
      
//           const nameMatch =
//               holderText.match(
//                   /^(.+?\([૦-૯0-9]+\))/
//               );
      
      
//           if (nameMatch) {
      
//               holderText =
//                   nameMatch[1].trim();
      
//           }
      
      
//           /*
//              ----------------------------------------------------
//              FALLBACK:
             
//              If OCR did not give us a numeric ID in
//              parentheses, handle "કુલ સરવે નંબરો".
//              ----------------------------------------------------
//           */
      
//           if (
//               holderText.includes(
//                   "કુલ સરવે નંબરો"
//               )
//           ) {
      
//               holderText =
//                   holderText
//                       .split(
//                           "કુલ સરવે નંબરો"
//                       )[0]
//                       .trim();
      
//           }
      
      
//           /*
//              ----------------------------------------------------
//              CLEAN WHITESPACE
//              ----------------------------------------------------
//           */
      
//           holderText =
//               holderText
//                   .replace(
//                       /\s+/g,
//                       " "
//                   )
//                   .trim();
      
      
//           /*
//              ----------------------------------------------------
//              REMOVE ACCIDENTAL PUNCTUATION
//              ----------------------------------------------------
//           */
      
//           holderText =
//               holderText.replace(
//                   /^[,;:|]+|[,;:|]+$/g,
//                   ""
//               );
      
      
//           if (!holderText) {
//               return;
//           }
      
      
//           /*
//              ----------------------------------------------------
//              STORE CLEAN HOLDER NAME
//              ----------------------------------------------------
//           */
      
//           holderLines.push(
//               holderText
//           );
      
//       });



//           if (holderLines.length === 0) {

//             console.log(
//                 "========== KHATA NAME EXTRACTION FAILED =========="
//             );
        
//             console.log(
//                 "Khata:",
//                 khataNumber
//             );
        
//             console.log(
//                 "Raw section:",
//                 JSON.stringify(section, null, 2)
//             );
        
//             console.log(
//                 "OCR lines:",
//                 JSON.stringify(lines, null, 2)
//             );
        
//             console.log(
//                 "========== KHATA NAME EXTRACTION FAILED END =========="
//             );
        
//         }

//     /*
//        --------------------------------------------------------
//        REMOVE DUPLICATES
//        --------------------------------------------------------
//     */

//     const uniqueNames = [];


//     holderLines.forEach(function(name) {

//         if (
//             !uniqueNames.includes(name)
//         ) {

//             uniqueNames.push(name);

//         }

//     });


//     /*
//        --------------------------------------------------------
//        FINAL NAME
//        --------------------------------------------------------
//     */

//     const finalName =
//         uniqueNames.join(
//             ", "
//         );


//     console.log(
//         "Khata name extracted:",
//         khataNumber,
//         "→",
//         finalName
//     );


//     return finalName;
// }

/* ============================================================
   EXTRACT FIRST KHATA HOLDER NAME

   RULE:

   If a Khata contains:

       ૧. Name A (123)
       ૨. Name B (456)
       ૩. Name C (789)

   return ONLY:

       Name A (123)

   We intentionally ignore all later holder rows.

   This does NOT change Khata-number extraction.
============================================================ */

function extractKhataName(text, khataNumber) {

    if (!text || !khataNumber) {
        return "";
    }


    /*
       --------------------------------------------------------
       NORMALIZE TEXT
       --------------------------------------------------------
    */

    const normalizedText =
        text.replace(/\r\n/g, "\n");


    /*
       --------------------------------------------------------
       FIND THIS KHATA SECTION
       --------------------------------------------------------
    */

    const khataRegex =
        new RegExp(
            "ખાતા\\s*નંબર\\s*[:：]?\\s*" +
            khataNumber
        );


    const khataMatch =
        normalizedText.match(
            khataRegex
        );


    if (!khataMatch) {

        console.warn(
            "Khata section not found:",
            khataNumber
        );

        return "";
    }


    /*
       Start immediately after:

       ખાતા નંબર : ૧૮૬
    */

    const startIndex =
        khataMatch.index +
        khataMatch[0].length;


    let section =
        normalizedText.substring(
            startIndex
        );


    /*
       --------------------------------------------------------
       STOP AT NEXT KHATA
       --------------------------------------------------------
    */

    const nextKhataMatch =
        section.match(
            /ખાતા\s*નંબર\s*[:：]?/i
        );


    if (nextKhataMatch) {

        section =
            section.substring(
                0,
                nextKhataMatch.index
            );

    }


    /*
       --------------------------------------------------------
       SPLIT INTO OCR LINES
       --------------------------------------------------------
    */

    const lines =
        section
            .split("\n")
            .map(function(line) {

                return line.trim();

            })
            .filter(function(line) {

                return line.length > 0;

            });


    /*
       --------------------------------------------------------
       FIND FIRST HOLDER ROW ONLY
       
       Examples:

       ૬. સુથાર ધના હીરા (૩૭૮૨) ૫૫૭/૫૨ ...

       ૧. મોગલ આસબેગ નસરતબેગ (૧૧૮૧) ...

       ૨. મોગલ રહેમબેગ અમીરબેગ (૧૧૮૧) ...

       We deliberately take ONLY the first match.
       --------------------------------------------------------
    */

    const holderRegex =
        /^[^\s.]+\.\s*(.+?\([૦-૯0-9]+\))/;


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i];


        const match =
            line.match(
                holderRegex
            );


        /*
           Not a holder row.
           Continue searching.
        */

        if (!match) {
            continue;
        }


        let holderName =
            match[1].trim();


        /*
           ----------------------------------------------------
           CLEAN WHITESPACE
           ----------------------------------------------------
        */

        holderName =
            holderName
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        /*
           ----------------------------------------------------
           REMOVE ACCIDENTAL PUNCTUATION
           ----------------------------------------------------
        */

        holderName =
            holderName.replace(
                /^[,;:|]+|[,;:|]+$/g,
                ""
            );


        /*
           ----------------------------------------------------
           FIRST VALID HOLDER FOUND
           
           STOP HERE.

           DO NOT collect any more names.
           ----------------------------------------------------
        */

        if (holderName) {

            console.log(
                "Khata FIRST holder extracted:",
                khataNumber,
                "→",
                holderName
            );


            return holderName;

        }

    }


    /*
       --------------------------------------------------------
       NOTHING FOUND
       --------------------------------------------------------
    */

    console.log(
        "========== FIRST KHATA NAME EXTRACTION FAILED =========="
    );

    console.log(
        "Khata:",
        khataNumber
    );

    console.log(
        "Raw section:",
        JSON.stringify(
            section,
            null,
            2
        )
    );

    console.log(
        "OCR lines:",
        JSON.stringify(
            lines,
            null,
            2
        )
    );

    console.log(
        "========== FIRST KHATA NAME EXTRACTION FAILED END =========="
    );


    return "";
}



/* ============================================================
GET ONLY VALID KHATA RECORDS
============================================================ */

function getValidKhatas(parsedResult) {

    /*
       parseKhataResult() returns the records ARRAY directly.

       Therefore we must work with the array itself,
       not parsedResult.khatas.
    */

    if (!Array.isArray(parsedResult)) {

        return [];

    }


    return parsedResult.filter(
        function(khata) {

            return (
                khata &&
                khata.khataNumber
            );

        }
    );

}


/* ============================================================
DEBUG KHATA SUMMARY
============================================================ */

function logKhataSummary(parsedResult) {

    const khatas =
        getValidKhatas(
            parsedResult
        );


    console.log(
        "========== KHATA SUMMARY =========="
    );


    console.log(
        "Khata records:",
        khatas.length
    );


    khatas.forEach(
        function(khata) {

            console.log(
                "Page:",
                khata.pageNumber,
                "| Khata:",
                khata.khataNumber,
                "| Name:",
                khata.name,
                "| Placeholder:",
                khata.isPlaceholder
            );

        }
    );


    console.log(
        "========== KHATA SUMMARY END =========="
    );

}


/* ============================================================
   EXPORT PARSER
============================================================ */

window.parseKhataResult =
    parseKhataResult;


/* ============================================================
   EXPORT DEBUG HELPERS

   These are useful from the browser console.
============================================================ */

window.getValidKhatas =
    getValidKhatas;

window.logKhataSummary =
    logKhataSummary;