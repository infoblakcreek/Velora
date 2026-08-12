/* ============================================================
   KHATA PARSER

   Responsible for:
   - Finding Khata sections
   - Reading Khata numbers
   - Extracting the first holder name
   - Normalizing Gujarati digits
   - Handling common OCR number corruption

   NOT responsible for:
   - Creating editor rows
   - Filling column A/B directly
   - Printing
   ============================================================ */

console.log(
    "Khata Parser module loaded"
);


/* ============================================================
   GUJARATI DIGIT MAP
============================================================ */

const KHATA_GUJARATI_DIGITS = {

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


/* ============================================================
   NORMALIZE DIGITS
============================================================ */

function normalizeKhataDigits(value) {

    if (!value) {

        return "";

    }


    return value
        .split("")
        .map(
            function(character) {

                return (
                    KHATA_GUJARATI_DIGITS[
                        character
                    ] ||
                    character
                );

            }
        )
        .join("");

}


/* ============================================================
   NORMALIZE KHATA NUMBER
============================================================ */

function normalizeKhataNumber(rawNumber) {

    if (!rawNumber) {

        return null;

    }


    let value =
        normalizeKhataDigits(
            rawNumber
        );


    value =
        value
            .replace(
                /\s+/g,
                ""
            )
            .trim();


            /*
         IMPORTANT:
      
         Do NOT remove X.
      
         X means PDF.js could not correctly
         decode one of the digits.
      
         Examples:
      
         ૬X૪
         ૭૪X
         ૭XX
      
         These must remain unresolved until
         we have enough information to determine
         the missing digit safely.
      */
      
      
      if (
          !/^[\dXx]+$/.test(value)
      ) {
      
          return null;
      
      }
      
      
      return value;

}


/* ============================================================
   CLEAN HOLDER NAME
============================================================ */

function cleanKhataHolderName(
    rawName
) {

    if (!rawName) {

        return "";

    }


    let name =
        rawName.trim();


    /*
       Remove excessive whitespace.
    */

    name =
        name.replace(
            /\s+/g,
            " "
        );


    /*
       Remove trailing Khata metadata
       when possible.
    */

    name =
        name.replace(
            /\s+કુલ\s+ખાતેદાર.*$/i,
            ""
        );


    return name.trim();

}


/* ============================================================
   EXTRACT FIRST HOLDER
============================================================ */

function extractFirstKhataHolder(
    sectionText
) {

    if (!sectionText) {

        return "";

    }


    /*
       Holder lines normally begin with:

       ૧.
       1.
       ૨.
       2.

       We specifically want the FIRST
       numbered holder.
    */


    const lines =
        sectionText
            .split(/\r?\n/)
            .map(
                function(line) {

                    return line.trim();

                }
            )
            .filter(
                function(line) {

                    return line.length > 0;

                }
            );


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i];


        /*
           Gujarati or ASCII "1."
        */

        if (
            /^૧\.\s*/.test(line) ||
            /^1\.\s*/.test(line)
        ) {

            return cleanKhataHolderName(
                line.replace(
                    /^૧\.\s*/,
                    ""
                ).replace(
                    /^1\.\s*/,
                    ""
                )
            );

        }

    }


    return "";

}


/* ============================================================
   FIND KHATA HEADERS
============================================================ */

function findKhataHeaders(text) {

    const headers = [];

    if (!text) {
        return headers;
    }

    /*
       PDF.js currently gives us one long line
       because KHATA SCANNER joins all text items
       with spaces.

       Example:

       ખાતા નંબર  ૬૪૭  ૩. ...
       ખાતા નંબર  ૬X૪  ૧. ...
    */

    const pattern =
        /ખાતા\s*નંબર\s*[^\d૦-૯Xx]*([૦-૯0-9Xx]{2,})/g;

    let match;

    while (
        (match = pattern.exec(text)) !== null
    ) {

        const rawNumber =
            match[1];

        const khataNumber =
            normalizeKhataNumber(
                rawNumber
            );

        if (
            khataNumber === null
        ) {
            continue;
        }

        headers.push({

            index:
                match.index,

            khataNumber:
                khataNumber,

            rawNumber:
                rawNumber

        });

    }

    return headers;
}


/* ============================================================
   RESOLVE OCR KHATA NUMBERS
   ============================================================ */

/*
   Resolves Khata numbers containing X by looking at
   the surrounding Khata numbers.

   Example:

   633
   6X4
   635

   → 634


   Another example:

   673
   6X4
   675

   → 674
*/

// function resolveKhataNumbers(records) {

//     if (
//         !Array.isArray(records) ||
//         records.length === 0
//     ) {

//         return records;

//     }


//     for (
//         let i = 0;
//         i < records.length;
//         i++
//     ) {

//         const current =
//             records[i];


//         if (
//             typeof current.khataNumber !== "string"
//         ) {

//             continue;

//         }


//         if (
//             !/[Xx]/.test(
//                 current.khataNumber
//             )
//         ) {

//             continue;

//         }


//         /*
//            Look backwards for a valid numeric Khata.
//         */

//         let previousNumber = null;

//         for (
//             let p = i - 1;
//             p >= 0;
//             p--
//         ) {

//             const value =
//                 records[p].khataNumber;

//             if (
//                 typeof value === "string" &&
//                 /^\d+$/.test(value)
//             ) {

//                 previousNumber =
//                     Number(value);

//                 break;

//             }

//         }


//         /*
//            Look forwards for a valid numeric Khata.
//         */

//         let nextNumber = null;

//         for (
//             let n = i + 1;
//             n < records.length;
//             n++
//         ) {

//             const value =
//                 records[n].khataNumber;

//             if (
//                 typeof value === "string" &&
//                 /^\d+$/.test(value)
//             ) {

//                 nextNumber =
//                     Number(value);

//                 break;

//             }

//         }


//         /*
//            If both surrounding numbers exist,
//            check whether they form a normal sequence.
//         */

//         if (
//             previousNumber !== null &&
//             nextNumber !== null
//         ) {

//             const expected =
//                 previousNumber + 1;


//             if (
//                 expected === nextNumber - 1
//             ) {

//                 current.khataNumber =
//                     expected;

//                 console.log(
//                     "KHATA OCR corrected:",
//                     current.rawNumber ||
//                     current.khataNumber,
//                     "→",
//                     expected,
//                     "| previous:",
//                     previousNumber,
//                     "| next:",
//                     nextNumber
//                 );

//                 continue;

//             }

//         }


//         /*
//            If only the previous number is available,
//            use previous + 1.
//         */

//         if (
//             previousNumber !== null &&
//             nextNumber === null
//         ) {

//             current.khataNumber =
//                 previousNumber + 1;

//             console.log(
//                 "KHATA OCR corrected from previous:",
//                 current.rawNumber,
//                 "→",
//                 current.khataNumber
//             );

//             continue;

//         }


//         /*
//            If only the next number is available,
//            use next - 1.
//         */

//         if (
//             previousNumber === null &&
//             nextNumber !== null
//         ) {

//             current.khataNumber =
//                 nextNumber - 1;

//             console.log(
//                 "KHATA OCR corrected from next:",
//                 current.rawNumber,
//                 "→",
//                 current.khataNumber
//             );

//         }

//     }


//     return records;
// }


/* ============================================================
   PARSE ONE PAGE
   ============================================================ */

function parseKhataPage(page) {

    if (
        !page ||
        !page.text
    ) {

        return [];

    }

    const text =
        page.text;

    const headers =
        findKhataHeaders(
            text
        );

    const results = [];

    headers.forEach(
        function(header, index) {

            const start =
                header.index;

            const end =
                index + 1 < headers.length
                    ? headers[index + 1].index
                    : text.length;

            const section =
                text.slice(
                    start,
                    end
                );

            /*
               Find first holder.

               Because PDF.js may not preserve
               line breaks, search directly for:

               ૧.
               1.
            */

            let name = "";

            const holderMatch =
                section.match(
                    /(?:^|\s)(?:૧|1)\.\s*(.+?)(?=\s+(?:૨|2)\.\s|$)/
                );

            if (
                holderMatch
            ) {

                name =
                    cleanKhataHolderName(
                        holderMatch[1]
                    );

            }

            results.push({

                khataNumber:
                    header.khataNumber,

                name:
                    name,

                pageNumber:
                    page.pageNumber

            });

        }
    );

    return results;
}


/* ============================================================
   PARSE COMPLETE SCAN
============================================================ */

function parseKhataScan(
    scanResult
) {

    if (
        !scanResult ||
        !Array.isArray(
            scanResult.pages
        )
    ) {

        throw new Error(
            "Invalid Khata scan result."
        );

    }


    const records = [];


    scanResult.pages.forEach(
        function(page) {

            const pageRecords =
                parseKhataPage(
                    page
                );


            records.push(
                ...pageRecords
            );

        }
    );

  
    /*
       Resolve OCR-corrupted Khata numbers
       using surrounding Khata sequence.
    */
    
    resolveKhataNumbers(
        records
    );

    console.log(
        "KHATA PARSER COMPLETE"
    );


    console.log(
        "Khata records found:",
        records.length
    );


    console.log(
        "Parsed Khata records:",
        records
    );


    return records;

}

/* ============================================================
   RESOLVE CORRUPTED KHATA NUMBERS
   ============================================================ */

function resolveKhataNumbers(records) {

    if (!Array.isArray(records)) {
        return records;
    }

    for (let i = 0; i < records.length; i++) {

        const current =
            records[i].khataNumber;

        if (!current || !/[Xx]/.test(current)) {
            continue;
        }

        /*
           Find previous valid Khata number
        */

        let previous = null;

        for (let p = i - 1; p >= 0; p--) {

            const value =
                records[p].khataNumber;

            if (
                value &&
                /^\d+$/.test(value)
            ) {
                previous = Number(value);
                break;
            }
        }


        /*
           Find next valid Khata number
        */

        let next = null;

        for (
            let n = i + 1;
            n < records.length;
            n++
        ) {

            const value =
                records[n].khataNumber;

            if (
                value &&
                /^\d+$/.test(value)
            ) {
                next = Number(value);
                break;
            }
        }


        /*
           If both sides are available,
           check whether the corrupted number
           is exactly between them.
        */

        if (
            previous !== null &&
            next !== null
        ) {

            const expected =
                previous + 1;

            /*
               Only resolve when the next
               number confirms the sequence.
            */

            if (expected === next) {

                records[i].khataNumber =
                    String(expected);

                console.log(
                    "KHATA X RESOLVED:",
                    current,
                    "→",
                    expected,
                    "| previous:",
                    previous,
                    "| next:",
                    next
                );

            }

        }

    }

    return records;
}