
/* =========================================================================== */

console.log("TALAPATRAK JS FILE RUNNING");

/* ============================================================
        TALAPATRAK SYSTEM
        STEP 1: NAVIGATION + MANAGEMENT + EDITOR
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */

const talapatrakNavElement =
    document.getElementById(
        "talapatrakNav"
    );


const dashboardViewElement =
    document.getElementById(
        "dashboardView"
    );


const talapatrakViewElement =
    document.getElementById(
        "talapatrakView"
    );


console.log(
    "TALAPATRAK VIEW DISPLAY:",
    talapatrakViewElement?.style.display,
    getComputedStyle(talapatrakViewElement).display
);


const talapatrakEditorViewElement =
    document.getElementById(
        "talapatrakEditorView"
    );


const backToDashboardButtonElement =
    document.getElementById(
        "backToDashboardFromTalapatrak"
    );


const backToTalapatrakManagementButton =
    document.getElementById(
        "backToTalapatrakManagement"
    );


const addTalapatrakButton =
    document.getElementById(
        "addTalapatrakButton"
    );


const emptyAddTalapatrakButton =
    document.getElementById(
        "emptyAddTalapatrakButton"
    );



if (talapatrakNavElement) {

    talapatrakNavElement.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();

            hideAllViews();

            talapatrakViewElement.style.display =
                "block";


          console.log(
                "NAV OPEN — TALAPATRAK DISPLAY:",
                getComputedStyle(talapatrakViewElement).display
            );
            
            console.log(
                "NAV OPEN — COUNT DISPLAY:",
                getComputedStyle(talapatrakRecordCountElement).display,
                getComputedStyle(talapatrakRecordCountElement).visibility,
                getComputedStyle(talapatrakRecordCountElement).opacity
            );

            clearNavigationActiveState();

            talapatrakNavElement.classList.add(
                "active"
            );

            await loadTalapatrakRecords();

            window.scrollTo(
                0,
                0
            );

        }
    );

}

let talapatrakRecords = [];

/* ============================================================
        BACK TO TALAPATRAK MANAGEMENT
============================================================ */

if (backToTalapatrakManagementButton) {

    backToTalapatrakManagementButton.addEventListener(

        "click",

        async function() {

            /*
                Cancel any pending autosave timer.
            */

            if (talapatrakAutoSaveTimer) {

                clearTimeout(
                    talapatrakAutoSaveTimer
                );

                talapatrakAutoSaveTimer =
                    null;

            }


            /*
                Save the latest changes before leaving.
            */

            const mojeInput =
                document.getElementById(
                    "talapatrakMoje"
                );


            const moje =
                mojeInput
                    ?.value
                    ?.trim()
                    || "";


            /*
                Only save if village name exists.
            */

            if (moje) {

                await saveTalapatrak(
                    false
                );

            }


            await openTalapatrakManagement();

        }

    );

}

/* ============================================================
        CLEAR ACTIVE NAVIGATION
============================================================ */

function clearNavigationActiveState() {

    document
        .querySelectorAll(
            ".navItem"
        )
        .forEach(
            function(item) {

                item.classList.remove(
                    "active"
                );

            }
        );

}


/* ============================================================
        SET DEFAULT TALAPATRAK VIEW
============================================================ */

function initializeTalapatrakViews() {

    /*
        Make sure Talapatrak pages
        are hidden when app loads
    */

    if (talapatrakViewElement) {

        talapatrakViewElement.style.display =
            "none";

    }


    if (talapatrakEditorViewElement) {

        talapatrakEditorViewElement.style.display =
            "none";

    }

}


initializeTalapatrakViews();


console.log(
    "Talapatrak navigation initialized successfully."
);



 /* ==========================================================================*/

/* ============================================================
        TALAPATRAK MANAGEMENT CONTROLS
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */

const talapatrakSearchInputElement =
    document.getElementById(
        "talapatrakSearchInput"
    );


const talapatrakSortButtonElement =
    document.getElementById(
        "talapatrakSortButton"
    );


const talapatrakSortMenuElement =
    document.getElementById(
        "talapatrakSortMenu"
    );


const talapatrakSortLabelElement =
    document.getElementById(
        "talapatrakSortLabel"
    );


const talapatrakGridViewButtonElement =
    document.getElementById(
        "talapatrakGridViewButton"
    );


const talapatrakListViewButtonElement =
    document.getElementById(
        "talapatrakListViewButton"
    );


const talapatrakRecordCountElement =
    document.getElementById(
        "talapatrakRecordCount"
    );


const talapatrakManagementRecordCountElement =
    document.getElementById(
        "talapatrakRecordCountDisplay"
    );

const talapatrakVillageGridElement =
    document.getElementById(
        "talapatrakVillageGrid"
    );


const talapatrakEmptyStateElement =
    document.getElementById(
        "talapatrakEmptyState"
    );

console.log(
    "COUNT ELEMENT:",
    talapatrakRecordCountElement
);

/* ============================================================
        STATE
============================================================ */

let talapatrakSearchTerm =
    "";


let talapatrakSortMode =
    "recent";


let talapatrakViewMode =
    "grid";



/* ============================================================
        LOAD TALAPATRAK RECORDS FROM FIREBASE
============================================================ */

async function loadTalapatrakRecords() {

    try {

        /*
            Make sure a user is logged in
        */

        if (
            !auth ||
            !auth.currentUser
        ) {

            console.warn(
                "No user logged in. Cannot load Talapatrak records."
            );

            talapatrakRecords =
                [];

            renderTalapatrakManagement();

            return;

        }


        /*
            Show loading message
        */

        if (
            talapatrakVillageGridElement
        ) {

            talapatrakVillageGridElement.innerHTML = `

                <div
                    class="talapatrakLoadingState">

                    <i
                        class="fa-solid fa-spinner fa-spin">
                    </i>

                    <p>
                        Loading Talapatrak records...
                    </p>

                </div>

            `;

        }


        /*
            Get records belonging
            to current user
        */

        const snapshot =
            await db
                .collection(
                    "talapatraks"
                )
                .where(
                    "userId",
                    "==",
                    auth.currentUser.uid
                )
                .get();


        /*
            Clear old records
        */

        talapatrakRecords =
            [];


        /*
            Convert Firestore documents
            into JavaScript objects
        */

        snapshot.forEach(

            function(doc) {

                talapatrakRecords.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }

        );

      await createNextYearTalapatrakCopies();


      /*
          Reload records after creating
          new financial year copies
      */
      
      const updatedSnapshot =
          await db
              .collection("talapatraks")
              .where(
                  "userId",
                  "==",
                  auth.currentUser.uid
              )
              .get();
      
      
      talapatrakRecords = [];
      
      
      updatedSnapshot.forEach(function(doc) {
      
          talapatrakRecords.push({
      
              id:
                  doc.id,
      
              ...doc.data()
      
          });
      
      });

      
      await loadTalapatrakCount();

      console.log(
          "LOADED TALAPATRAK RECORDS:",
          talapatrakRecords
      );


        console.log(
            "Talapatrak records loaded:",
            talapatrakRecords
        );


        /*
            Render management page
        */

        renderTalapatrakManagement();

    }

    catch(error) {

        console.error(
            "Error loading Talapatrak records:",
            error
        );


        if (
            talapatrakVillageGridElement
        ) {

            talapatrakVillageGridElement.innerHTML = `

                <div
                    class="talapatrakLoadingState">

                    <i
                        class="fa-solid fa-triangle-exclamation">
                    </i>

                    <p>
                        Unable to load Talapatrak records.
                    </p>

                </div>

            `;

        }

    }

}


/* ============================================================
        TALAPATRAK SORT DROPDOWN
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */

const talapatrakSortWrapperElement =
    document.querySelector(
        ".talapatrakSortWrapper"
    );


const talapatrakSortOptions =
    document.querySelectorAll(
        ".talapatrakSortOption"
    );

/* ============================================================
        SORT DROPDOWN OPEN / CLOSE
============================================================ */

if (
    talapatrakSortButtonElement &&
    talapatrakSortMenuElement
) {

    talapatrakSortButtonElement.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            talapatrakSortMenuElement.classList.toggle(
                "open"
            );

        }
    );

}

console.log(
    "SORT OPTIONS FOUND:",
    talapatrakSortOptions.length
);

talapatrakSortOptions.forEach(function(option) {

    option.addEventListener(
        "click",
        function() {

            talapatrakSortMode =
                this.dataset.sort;


            talapatrakSortOptions.forEach(function(btn){

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            renderTalapatrakManagement();

        }
    );

});

function sortTalapatrakRecords(records) {

    const sortedRecords = [
        ...records
    ];

    switch (talapatrakSortMode) {

        case "recent":

            sortedRecords.sort(function(a, b) {

                return getTimestamp(b.updatedAt)
                    -
                    getTimestamp(a.updatedAt);

            });

            break;


        case "oldest":

            sortedRecords.sort(function(a, b) {

                return getTimestamp(a.updatedAt)
                    -
                    getTimestamp(b.updatedAt);

            });

            break;


        case "az":

            sortedRecords.sort(function(a, b) {

                return String(a.moje || "")
                    .localeCompare(
                        String(b.moje || ""),
                        "gu"
                    );

            });

            break;


        case "za":

            sortedRecords.sort(function(a, b) {

                return String(b.moje || "")
                    .localeCompare(
                        String(a.moje || ""),
                        "gu"
                    );

            });

            break;

    }

    return sortedRecords;

}


/* ============================================================
        LIST VIEW
============================================================ */

if (
    talapatrakListViewButtonElement
) {

    talapatrakListViewButtonElement.addEventListener(

        "click",

        function() {

            talapatrakViewMode =
                "list";


            this.classList.add(
                "active"
            );


            if (
                talapatrakGridViewButtonElement
            ) {

                talapatrakGridViewButtonElement.classList.remove(
                    "active"
                );

            }


            if (
                talapatrakVillageGridElement
            ) {

                talapatrakVillageGridElement.classList.add(
                    "listView"
                );

            }

        }

    );

}

/* ============================================================
        GRID VIEW
============================================================ */

if (
    talapatrakGridViewButtonElement
) {

    talapatrakGridViewButtonElement.addEventListener(

        "click",

        function() {

            talapatrakViewMode =
                "grid";


            this.classList.add(
                "active"
            );


            if (
                talapatrakListViewButtonElement
            ) {

                talapatrakListViewButtonElement.classList.remove(
                    "active"
                );

            }


            if (
                talapatrakVillageGridElement
            ) {

                talapatrakVillageGridElement.classList.remove(
                    "listView"
                );

            }

        }

    );

}
/* ============================================================
        RENDER MANAGEMENT VIEW
============================================================ */

/* ============================================================
        RENDER TALAPATRAK VILLAGE CARDS
============================================================ */

function renderTalapatrakManagement() {

    console.log(
        "RENDER MANAGEMENT CALLED:",
        talapatrakRecords.length
    );
    /*
        Get filtered records
    */

    const filteredRecords =
        getFilteredTalapatrakRecords();


    /*
        Sort records
    */

    const sortedRecords =
        sortTalapatrakRecords(
            filteredRecords
        );

      console.log(
        "RECORDS TO CREATE CARDS:",
        sortedRecords.length
    );
    
    console.log(
        "GRID ELEMENT:",
        talapatrakVillageGridElement
    );

    /*
        Update village count
    */

    if (
        talapatrakRecordCountElement
    ) {

        talapatrakRecordCountElement.textContent =
            sortedRecords.length;


          console.log(
              "ACTUAL COUNT ELEMENT:",
              talapatrakRecordCountElement.outerHTML
          );
          
              console.log(
            "COUNT AFTER UPDATE:",
            talapatrakRecordCountElement.textContent
        );

    }


      if (
        talapatrakManagementRecordCountElement
    ) {
    
        talapatrakManagementRecordCountElement.textContent =
            sortedRecords.length;
    
    }

    /*
        Empty state
    */

    if (
        talapatrakEmptyStateElement
    ) {

        talapatrakEmptyStateElement.style.display =
            sortedRecords.length === 0
                ? "flex"
                : "none";

    }


    /*
        Stop if there are no records
    */

    if (
        !talapatrakVillageGridElement
    ) {

        return;

    }


    /*
        Remove old cards
        but keep empty state
    */

    const existingCards =
        talapatrakVillageGridElement.querySelectorAll(
            ".talapatrakVillageCard"
        );


    existingCards.forEach(

        function(card) {

            card.remove();

        }

    );


    const loadingState =
        talapatrakVillageGridElement.querySelector(
            ".talapatrakLoadingState"
        );
    
    
    if(loadingState){
    
        loadingState.remove();
    
    }
  
    console.log(
        "RECORDS BEING USED TO CREATE CARDS:",
        sortedRecords
    );

    console.log(
        "RECORDS TO CREATE CARDS:",
        sortedRecords
    );
    
    console.log(
        "GRID ELEMENT:",
        talapatrakVillageGridElement
    );


    if (talapatrakViewMode === "list") {
  
      talapatrakVillageGridElement.classList.add(
          "listView"
      );
      
      } else {
      
          talapatrakVillageGridElement.classList.remove(
              "listView"
          );
      
      }
  
    /*
        Create a card for every village
    */

    sortedRecords.forEach(

        function(record) {


            const card =
                createTalapatrakVillageCard(
                    record
                );


            talapatrakVillageGridElement.appendChild(
                card
            );

        }

    );


    console.log(
        "Talapatrak cards rendered:",
        sortedRecords.length
    );

}
/* ============================================================
        CREATE TALAPATRAK VILLAGE CARD
============================================================ */

function createTalapatrakVillageCard(
    record
) {


    /*
        Create card
    */

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "talapatrakVillageCard";

      card.dataset.id =
          record.id;


    /*
        Safely get values
    */

    const villageName =
        record.moje ||
        "Unnamed Village";


    const taluka =
        record.taluka ||
        "—";


    const jillo =
        record.jillo ||
        "—";


    const year =
        record.year ||
        "2025-2026";


    const rowCount =
        Array.isArray(
            record.rows
        )
            ? record.rows.length
            : 0;


    /*
        Format updated date
    */

    let updatedText =
        "Not updated yet";


    if (
        record.updatedAt
    ) {

        const updatedDate =
            record.updatedAt?.toDate
                ? record.updatedAt.toDate()
                : new Date(
                    record.updatedAt
                );


        if (
            !isNaN(
                updatedDate
            )
        ) {

            updatedText =
                updatedDate.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        }

    }


    /*
        Card HTML
    */

    card.innerHTML = `

        <!-- CARD HEADER -->

        <div
            class="talapatrakVillageCardHeader">


            <div
                class="talapatrakVillageIcon">

                <i
                    class="fa-solid fa-location-dot">
                </i>

            </div>


            <div
                class="talapatrakVillageTitle">

                <h3>
                    ${escapeTalapatrakHTML(
                        villageName
                    )}
                </h3>

                <span>
                    Talapatrak
                </span>

            </div>


            <!-- CARD MENU -->

            <div
                class="talapatrakCardMenuWrapper">
            
            
                <button
                    type="button"
                    class="talapatrakCardMenuButton"
                    title="More options">
            
                    <i
                        class="fa-solid fa-ellipsis-vertical">
                    </i>
            
                </button>

                
                <!-- DROPDOWN MENU -->
            
                <div class="talapatrakCardMenu">

                
                    <button
                        class="talapatrakCardMenuItem download"
                        data-action="download">
                
                
                        <i class="fa-solid fa-download"></i>
                
                
                        Download
                
                
                    </button>
                
                
                
                    <button
                        class="talapatrakCardMenuItem delete"
                        data-action="delete">
                
                
                        <i class="fa-solid fa-trash"></i>
                
                
                        Delete
                
                
                    </button>
                
                
                </div>

        </div>


        <!-- CARD DETAILS -->

        <div
            class="talapatrakVillageDetails">


            <div
                class="talapatrakVillageDetail">


                <strong>
                    ${escapeTalapatrakHTML(
                        year
                    )}
                </strong>


            </div>


            <div
                class="talapatrakVillageDetail">


                <span>
                    Records
                </span>


                <strong>
                    ${rowCount}
                </strong>


            </div>


        </div>


        <!-- CARD FOOTER -->

        <div
            class="talapatrakVillageCardFooter">


            <span
                class="talapatrakLastUpdated">


                <i
                    class="fa-regular fa-clock">
                </i>


                Updated ${updatedText}


            </span>



        </div>

    `;


    /*
        Open card when clicking
    */

      card.addEventListener(

    "click",

    function(event) {


        /*
            Do not open card when
            clicking menu area
        */

        if (

            event.target.closest(
                ".talapatrakCardMenuWrapper"
            )

        ) {

            return;

        }


          openTalapatrakRecord(
            record.id
          );

    }

);


      /* ============================================================
        CARD MENU
============================================================ */

const menuButton =
    card.querySelector(
        ".talapatrakCardMenuButton"
    );


const cardMenu =
    card.querySelector(
        ".talapatrakCardMenu"
    );


const deleteButton =
    card.querySelector(
        '[data-action="delete"]'
    );


const downloadButton =
    card.querySelector(
        '[data-action="download"]'
    );


/* ============================================================
        OPEN / CLOSE THREE-DOT MENU
============================================================ */

if (
    menuButton &&
    cardMenu
) {

    menuButton.addEventListener(

        "click",

        function(event) {

            /*
                VERY IMPORTANT
                Prevent card click
                and document click
            */

            event.preventDefault();

            event.stopPropagation();


            /*
                Close every other menu
            */

            document
                .querySelectorAll(
                    ".talapatrakCardMenu.open"
                )
                .forEach(

                    function(menu) {

                        if (
                            menu !== cardMenu
                        ) {

                            menu.classList.remove(
                                "open"
                            );

                        }

                    }

                );


            /*
                Toggle this menu
            */

            cardMenu.classList.toggle(
                "open"
            );


            console.log(
                "Talapatrak menu clicked"
            );

        }

    );

}


/* ============================================================
        DELETE BUTTON
============================================================ */

if (
    deleteButton
) {

    deleteButton.addEventListener(

        "click",

        async function(event) {

            event.preventDefault();

            event.stopPropagation();


            /*
                Close menu immediately
            */

            if (
                cardMenu
            ) {

                cardMenu.classList.remove(
                    "open"
                );

            }


            /*
                Delete record
            */

            await deleteTalapatrakRecord(
                record
            );

        }

    );

}

if(downloadButton){

    downloadButton.addEventListener(

        "click",

        async function(event){

            event.preventDefault();

            event.stopPropagation();


            cardMenu.classList.remove(
                "open"
            );


            await downloadTalapatrakPDF(
                record
            );


        }

    );

}
    return card;

}

/* ============================================================
        DELETE TALAPATRAK RECORD
============================================================ */

async function deleteTalapatrakRecord(record) {

    if (!record || !record.id) {

        console.error(
            "Talapatrak document ID missing."
        );

        alert(
            "Unable to delete this Talapatrak."
        );

        return;

    }

    const villageName =
        record.moje ||
        "this village";


    const confirmed =
        confirm(
            `Are you sure you want to delete "${villageName}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        await db
            .collection(
                "talapatraks"
            )
            .doc(
                record.id
            )
            .delete();


        talapatrakRecords =
            talapatrakRecords.filter(

                function(item) {

                    return item.id !==
                        record.id;

                }

            );


        renderTalapatrakManagement();

          await loadTalapatrakCount();

        await addTalapatrakActivity(
              "talapatrak_deleted",
              "Talapatrak deleted",
              `${villageName} Talapatrak deleted`,
              villageName
          );
      
        console.log(
            "Talapatrak deleted:",
            record.id
        );


    }

    catch (error) {

        console.error(
            "Error deleting Talapatrak:",
            error
        );


        alert(
            "Error deleting Talapatrak. Please try again."
        );

    }

}

/* ============================================================
        CLOSE CARD MENUS WHEN CLICKING OUTSIDE
============================================================ */

document.addEventListener(

    "click",

    function(event) {


        /*
            If click happened inside
            a card menu wrapper,
            do nothing
        */

        if (

            event.target.closest(
                ".talapatrakCardMenuWrapper"
            )

        ) {

            return;

        }


        /*
            Otherwise close all menus
        */

        document
            .querySelectorAll(
                ".talapatrakCardMenu.open"
            )
            .forEach(

                function(menu) {

                    menu.classList.remove(
                        "open"
                    );

                }

            );

    }

);

/* ============================================================
        ESCAPE HTML
============================================================ */

function escapeTalapatrakHTML(
    value
) {

    return String(
        value
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ============================================================
        INITIAL RENDER
============================================================ */

renderTalapatrakManagement();



/*============================================================================*/

/* ============================================================
        TALAPATRAK SYSTEM
        DYNAMIC FINANCIAL YEAR + MANAGEMENT + EDITOR
============================================================ */


/* ============================================================
        GLOBAL STATE
============================================================ */

let currentTalapatrakRecord = null;

let currentTalapatrakDocumentId = null;

/* ============================================================
        DYNAMIC FINANCIAL YEAR
        YEAR CHANGES EVERY 1 AUGUST
============================================================ */

function getCurrentTalapatrakYear() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        today.getMonth();

    if (month >= 7) {

        return `${year}-${year + 1}`;

    }

    return `${year - 1}-${year}`;

}


/* ============================================================
        GET PREVIOUS YEAR
============================================================ */

function getPreviousTalapatrakYear(year) {

    const startYear =
        Number(
            String(year)
                .split("-")[0]
        );

    return `${startYear - 1}-${startYear}`;

}

/* ============================================================
        CREATE NEW YEAR TALAPATRAK DUPLICATES
============================================================ */

async function createNextYearTalapatrakCopies() {

    try {

        if (!auth.currentUser) {

            return;

        }


        const currentYear =
            getCurrentTalapatrakYear();


        const previousYear =
            getPreviousTalapatrakYear(
                currentYear
            );


        console.log(
            "Checking Talapatrak yearly copies:",
            previousYear,
            "→",
            currentYear
        );


        const previousSnapshot =
            await db
                .collection("talapatraks")
                .where(
                    "userId",
                    "==",
                    auth.currentUser.uid
                )
                .where(
                    "year",
                    "==",
                    previousYear
                )
                .get();



        for (
            const doc of previousSnapshot.docs
        ) {


            const oldData =
                doc.data();


            const villageName =
                oldData.moje;


            const newDocumentId =
                getTalapatrakDocumentId(
                    villageName,
                    currentYear
                );


            const newDocumentRef =
                db
                .collection("talapatraks")
                .doc(
                    newDocumentId
                );


            const existing =
                await newDocumentRef.get();



            // Already created
            if (
                existing.exists
            ) {

                continue;

            }



            const newRows =
                (oldData.rows || [])
                .map(function(row) {


                    return {

                        ...row,


                        // NEW YEAR TRANSFER RULE

                        C:
                            row.Q || "",


                        K:
                            row.R || ""

                    };


                });



            const newData = {

                ...oldData,


                year:
                    currentYear,


                rows:
                    newRows,


                rowCount:
                    newRows.length,


                updatedAt:
                    firebase.firestore.FieldValue
                    .serverTimestamp()

            };



            await newDocumentRef.set(
                newData
            );


            console.log(
                "Created new Talapatrak:",
                newDocumentId
            );


        }


    }

    catch(error) {

        console.error(
            "Error creating yearly Talapatrak copies:",
            error
        );

    }

}


/* ============================================================
        FIREBASE DOCUMENT ID
============================================================ */

function getTalapatrakDocumentId(
    moje,
    year
) {

    return `${moje}_${year}`;

}


/* ============================================================
        ELEMENT REFERENCES
============================================================ */


const addTalapatrakRowButton =
    document.getElementById(
        "addTalapatrakRow"
    );


const saveTalapatrakButton =
    document.getElementById(
        "saveTalapatrakButton"
    );


const printTalapatrakButton =
    document.getElementById(
        "printTalapatrakButton"
    );


const talapatrakBody =
    document.getElementById(
        "talapatrakBody"
    );

/* ============================================================
        HIDE ALL VIEWS
============================================================ */

function hideAllTalapatrakViews() {

    if (dashboardViewElement) {

        dashboardViewElement.style.display =
            "none";

    }

    if (talapatrakViewElement) {

        talapatrakViewElement.style.display =
            "none";

    }

    if (talapatrakEditorViewElement) {

        talapatrakEditorViewElement.style.display =
            "none";

    }

    /*
        Hide the print container during
        normal application use.
    */

    const printContainer =
        document.getElementById(
            "talapatrakPrintContainer"
        );

    if (printContainer) {

        printContainer.style.display =
            "none";

    }

}


/* ============================================================
        START NEW TALAPATRAK
============================================================ */

function startNewTalapatrak() {

    currentTalapatrakRecord =
        null;

    currentTalapatrakDocumentId =
        null;


    const editorVillageName =
      document.getElementById(
          "talapatrakEditorVillageName"
      );
  
      if (editorVillageName) {
      
          editorVillageName.textContent =
              "New Talapatrak";
      
      }
  
    openTalapatrakEditor();

    const mojeInput =
        document.getElementById(
            "talapatrakMoje"
        );

    if (mojeInput) {

        mojeInput.value =
            "";

    }

    const talukaInput =
        document.getElementById(
            "talapatrakTaluka"
        );

    if (talukaInput) {

        talukaInput.value =
            "";

    }

    const jilloInput =
        document.getElementById(
            "talapatrakJillo"
        );

    if (jilloInput) {

        jilloInput.value =
            "";

    }

    updateTalapatrakYearDisplay();

    clearTalapatrakRows();

    addInitialTalapatrakRow();

}


/* ============================================================
        UPDATE YEAR DISPLAY
============================================================ */

function updateTalapatrakYearDisplay(
    year = getCurrentTalapatrakYear()
) {

    const yearElements =
        document.querySelectorAll(
            "#talapatrakYear, #talapatrakEditorYear"
        );

    yearElements.forEach(function(element) {

        element.textContent =
            year;

    });

}


/* ============================================================
        ADD NEW TALAPATRAK BUTTONS
============================================================ */

if (addTalapatrakButton) {

    addTalapatrakButton.addEventListener(

        "click",

        function() {

            startNewTalapatrak();

        }

    );

}


if (emptyAddTalapatrakButton) {

    emptyAddTalapatrakButton.addEventListener(

        "click",

        function() {

            startNewTalapatrak();

        }

    );

}


/* ============================================================
        OPEN TALAPATRAK MANAGEMENT
============================================================ */

async function openTalapatrakManagement() {

    /*
        Hide editor + dashboard + print.
    */

    hideAllTalapatrakViews();


    /*
        Show ONLY management.
    */

    if (talapatrakViewElement) {

        talapatrakViewElement.style.display =
            "block";

                console.log(
              "TALAPATRAK VIEW AFTER OPEN:",
              getComputedStyle(talapatrakViewElement).display
          );
          
          console.log(
              "COUNT VISIBILITY:",
              getComputedStyle(talapatrakRecordCountElement).display,
              getComputedStyle(talapatrakRecordCountElement).visibility,
              getComputedStyle(talapatrakRecordCountElement).opacity
          );

    }


    /*
        Exit fullscreen editor mode.
    */

    document.body.classList.remove(
        "talapatrakFullscreen"
    );


    /*
        Make absolutely sure
        print container is hidden.
    */

    const printContainer =
        document.getElementById(
            "talapatrakPrintContainer"
        );

    if (printContainer) {

        printContainer.style.display =
            "none";

    }


    clearNavigationActiveState();


    if (talapatrakNavElement) {

        talapatrakNavElement.classList.add(
            "active"
        );

    }


    await loadTalapatrakRecords();

}


/* ============================================================
        CLEAR ROWS
============================================================ */

function clearTalapatrakRows() {

    if (!talapatrakBody) return;

    talapatrakBody.innerHTML =
        "";

}


function formatTalapatrakInputDate(date) {

    if (!date) {

        return "";

    }


    const parsedDate =
        new Date(date);


    if (isNaN(parsedDate)) {

        console.warn(
            "Invalid Talapatrak date:",
            date
        );

        return "";

    }


    const day =
        String(
            parsedDate.getDate()
        ).padStart(2,"0");


    const month =
        String(
            parsedDate.getMonth() + 1
        ).padStart(2,"0");


    const year =
        parsedDate.getFullYear();


    return `${day}/${month}/${year}`;

}

function setupIndianDatePicker() {

    flatpickr(
        ".indianDatePicker",
        {
            dateFormat: "d/m/Y",
            allowInput: true
        }
    );

}


/* ============================================================
        CREATE ROW
============================================================ */

function createTalapatrakRow(
    rowData = {}
) {

    if (!talapatrakBody) {

        console.error(
            "Talapatrak body not found."
        );

        return null;

    }


    const row =
        document.createElement(
            "tr"
        );

    row.className =
        "talapatrakRow";


    /* --------------------------------------------------------
       ROW NUMBER

       Used only when the row is created manually.

       Imported Khata data can provide its own
       Khata number through rowData.A.
    -------------------------------------------------------- */

    const rowNumber =
        talapatrakBody
            .querySelectorAll(
                ".talapatrakRow"
            )
            .length + 1;


    /* --------------------------------------------------------
       KHATA NUMBER

       IMPORTED:
           rowData.A → use imported Khata number

       MANUAL:
           no rowData.A → use sequential row number
    -------------------------------------------------------- */

    const khataNumber =
        rowData.A !== undefined &&
        rowData.A !== null &&
        String(rowData.A).trim() !== ""
            ? String(rowData.A).trim()
            : String(rowNumber);


    /* --------------------------------------------------------
       HOLDER NAME

       IMPORTED:
           rowData.B → use imported name

       MANUAL:
           no rowData.B → blank
    -------------------------------------------------------- */

    const holderName =
        rowData.B !== undefined &&
        rowData.B !== null
            ? String(rowData.B).trim()
            : "";

    row.innerHTML = `

        <td>
            <input
                type="number"
                class="columnA"
                value="${escapeTalapatrakHTML(khataNumber)}"
                readonly>
        </td>

        <td>
            <input
                type="text"
                class="columnB"
                value="${escapeTalapatrakHTML(holderName)}">
        </td>

        <td>
            <input
                type="number"
                class="columnC"
                value="${rowData.C || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnD"
                value="${rowData.D || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnE"
                value="${rowData.E || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnF"
                value="${rowData.F || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnG"
                value="${rowData.G || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnH"
                value="${rowData.H || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnI"
                value="${rowData.I || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnJ"
                value="${rowData.J || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnK"
                value="${rowData.K || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnL"
                value="${rowData.L || ""}">
        </td>

        <td>
            <input
                type="text"
                class="columnM indianDatePicker"
                placeholder="DD/MM/YYYY"
                value="${formatTalapatrakInputDate(rowData.M)}">
        </td>

        <td>
            <input
                type="number"
                class="columnN"
                value="${rowData.N || ""}">
        </td>

        <td>
            <input
                type="number"
                class="columnO"
                value="${rowData.O || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnP"
                value="${rowData.P || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnQ"
                value="${rowData.Q || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnR"
                value="${rowData.R || ""}"
                readonly>
        </td>

        <td>
            <input
                type="number"
                class="columnS"
                value="${rowData.S || ""}">
        </td>

        <td class="printHide">
            <input
                type="number"
                class="columnT"
                value="${rowData.T || ""}"
                readonly>
        </td>

        <td class="printHide">
            <input
                type="number"
                class="columnU"
                value="${rowData.U || ""}"
                readonly>
        </td>

        <td class="talapatrakDeleteCell printHide">
        
            <button
                type="button"
                class="addTalapatrakRowButton"
                title="Add Row"
                onclick="addTalapatrakRowAfter(this)">
        
                <i class="fa-solid fa-plus"></i>
        
            </button>
        
            <button
                type="button"
                class="deleteTalapatrakRowButton"
                onclick="deleteTalapatrakRow(this)"
                title="Delete Row">
        
                <i class="fa-solid fa-trash"></i>
        
            </button>
        
        </td>

    `;

    talapatrakBody.appendChild(
        row
    );

    setupIndianDatePicker();
  
    return row;

}

function addTalapatrakRowAfter(button){

    const currentRow =
        button.closest(".talapatrakRow");

    if(!currentRow){

        return;

    }


    const newRow =
        createTalapatrakRow({});


    if(!newRow){

        return;

    }


    currentRow.after(newRow);


    renumberTalapatrakRows();

}
/* ============================================================
        INITIAL ROW
============================================================ */

function addInitialTalapatrakRow() {

    createTalapatrakRow();

}


/* ============================================================
        ADD ROW
============================================================ */

if (addTalapatrakRowButton) {

    addTalapatrakRowButton.addEventListener(

        "click",

        function() {

            addTalapatrakRow();

        }

    );

}


function addTalapatrakRow() {

    if (!talapatrakBody) {

        return null;

    }

    const newRow =
        createTalapatrakRow();

    renumberTalapatrakRows();

    calculateAllTalapatrakRows();

    formatTalapatrakNumberInputs();

    setupTalapatrakExcelNavigation();

    const firstInput =
        newRow.querySelector(
            "input:not([readonly])"
        );

    if (firstInput) {

        firstInput.focus();

    }

    return newRow;

}


/* ============================================================
        DELETE ROW
============================================================ */

function deleteTalapatrakRow(button) {

    if (!talapatrakBody) return;

    const rows =
        talapatrakBody.querySelectorAll(
            ".talapatrakRow"
        );

    if (rows.length <= 1) {

        alert(
            "At least one row is required."
        );

        return;

    }

    const row =
        button.closest(
            ".talapatrakRow"
        );

    if (row) {

        row.remove();

    }

    renumberTalapatrakRows();

    calculateAllTalapatrakRows();

}


/* ============================================================
        RENUMBER ROWS
============================================================ */

function renumberTalapatrakRows() {

    if (!talapatrakBody) return;

    talapatrakBody
        .querySelectorAll(
            ".talapatrakRow"
        )
        .forEach(function(row, index) {

            const input =
                row.querySelector(
                    ".columnA"
                );

            if (input) {

                input.value =
                    index + 1;

            }

        });

}


/* ============================================================
        CALCULATE ROW
============================================================ */

function calculateTalapatrakRow(input) {

    const row =
        input.closest(
            ".talapatrakRow"
        );

    if (!row) return;

    function getValue(column) {

        return Number(
            row.querySelector(
                "." + column
            )?.value
        ) || 0;

    }

    function setValue(
        column,
        value
    ) {

        const element =
            row.querySelector(
                "." + column
            );

        if (element) {

            element.value =
                Number(
                    value
                ).toFixed(2);

        }

    }

    const C =
        getValue(
            "columnC"
        );

    const D =
        getValue(
            "columnD"
        );

    const E =
        getValue(
            "columnE"
        );

    const F =
            (D + E) * 3;
        
        setValue(
            "columnF",
            F
        );

    const G =
        getValue(
            "columnG"
        );

    const H =
        C + D + E + F + G;

    setValue(
        "columnH",
        H
    );

    const I =
        D;

    setValue(
        "columnI",
        I
    );

    const J =
        H - I;

    setValue(
        "columnJ",
        J
    );

    const K =
        getValue(
            "columnK"
        );

    const N =
        getValue(
            "columnN"
        );

    const O =
        K + N;

    setValue(
        "columnO",
        O
    );

    const T =
        H - I - O;

    setValue(
        "columnT",
        T
    );

    const U =
        T < O
            ? T
            : O;

    setValue(
        "columnU",
        U
    );

    const R =
        -U;

    setValue(
        "columnR",
        R
    );

    const P =
        O - R;

    setValue(
        "columnP",
        P
    );

    const Q =
        T > O
            ? T
            : O;

    setValue(
        "columnQ",
        Q
    );

}


/* ============================================================
        CALCULATE ALL ROWS
============================================================ */

function calculateAllTalapatrakRows() {

    if (!talapatrakBody) return;

    talapatrakBody
        .querySelectorAll(
            ".talapatrakRow"
        )
        .forEach(function(row) {

            const input =
                row.querySelector(
                    ".columnC"
                );

            if (input) {

                calculateTalapatrakRow(
                    input
                );

            }

        });

}


/* ============================================================
        NUMBER FORMAT + LIVE CALCULATION
============================================================ */

function formatTalapatrakNumberInputs() {

    if (!talapatrakBody) return;

    talapatrakBody
        .querySelectorAll(
            "input[type='number']"
        )
        .forEach(function(input) {

            if (
                !input.dataset
                    .decimalFormatterAttached
            ) {

                input.dataset
                    .decimalFormatterAttached =
                    "true";

                input.addEventListener(
                      "blur",
                      function() {
                  
                          if (
                              this.value !== ""
                          ) {
                  
                              // પાવતી નંબર (L) should be normal number
                              if (
                                  this.classList.contains(
                                      "columnL"
                                  )
                              ) {
                  
                                  this.value =
                                      Number(
                                          this.value
                                      ).toString();
                  
                              }
                  
                              else {
                  
                                  this.value =
                                      Number(
                                          this.value
                                      ).toFixed(2);
                  
                              }
                  
                          }
                  
                      }
                  );

            }

            if (
                !input.dataset
                    .calculationAttached
            ) {

                input.dataset
                    .calculationAttached =
                    "true";

                input.addEventListener(

                    "input",

                    function() {

                        calculateTalapatrakRow(
                            this
                        );

                    }

                );

            }

        });

}


/* ============================================================
        EXCEL STYLE ENTER NAVIGATION
============================================================ */

function setupTalapatrakExcelNavigation() {

    if (!talapatrakBody) return;

    talapatrakBody
        .querySelectorAll(
            "input:not([readonly])"
        )
        .forEach(function(input) {

            if (
                input.dataset
                    .enterNavigationAttached
            ) {

                return;

            }

            input.dataset
                .enterNavigationAttached =
                "true";

            input.addEventListener(

                "keydown",

                function(event) {

                    if (
                        event.key !==
                        "Enter"
                    ) {

                        return;

                    }

                    event.preventDefault();

                    const row =
                        this.closest(
                            ".talapatrakRow"
                        );

                    const editableInputs =
                        Array.from(
                            row.querySelectorAll(
                                "input:not([readonly])"
                            )
                        );

                    const currentIndex =
                        editableInputs.indexOf(
                            this
                        );

                    const nextInput =
                        editableInputs[
                            currentIndex + 1
                        ];

                    if (nextInput) {

                        nextInput.focus();

                        nextInput.select();

                        return;

                    }

                    const newRow =
                        addTalapatrakRow();

                    if (newRow) {

                        const firstInput =
                            newRow.querySelector(
                                "input:not([readonly])"
                            );

                        if (firstInput) {

                            firstInput.focus();

                        }

                    }

                }

            );

        });

}


/* ============================================================
        COLLECT ROW DATA
============================================================ */

function collectTalapatrakRows() {

    const rows =
        [];

    if (!talapatrakBody) {

        return rows;

    }

    talapatrakBody
        .querySelectorAll(
            ".talapatrakRow"
        )
        .forEach(function(row) {

            const rowData = {

                A: row.querySelector(".columnA")?.value || "",

                B: row.querySelector(".columnB")?.value || "",

                C: row.querySelector(".columnC")?.value || "",

                D: row.querySelector(".columnD")?.value || "",

                E: row.querySelector(".columnE")?.value || "",

                F: row.querySelector(".columnF")?.value || "",

                G: row.querySelector(".columnG")?.value || "",

                H: row.querySelector(".columnH")?.value || "",

                I: row.querySelector(".columnI")?.value || "",

                J: row.querySelector(".columnJ")?.value || "",

                K: row.querySelector(".columnK")?.value || "",

                L: row.querySelector(".columnL")?.value || "",

                M: row.querySelector(".columnM")?.value || "",

                N: row.querySelector(".columnN")?.value || "",

                O: row.querySelector(".columnO")?.value || "",

                P: row.querySelector(".columnP")?.value || "",

                Q: row.querySelector(".columnQ")?.value || "",

                R: row.querySelector(".columnR")?.value || "",

                S: row.querySelector(".columnS")?.value || "",

                T: row.querySelector(".columnT")?.value || "",

                U: row.querySelector(".columnU")?.value || ""

            };

            rows.push(
                rowData
            );

        });

    return rows;

}


/* ============================================================
        SAVE TALAPATRAK
============================================================ */

async function saveTalapatrak(
    showSuccessMessage = true
) {

    try {

        if (!auth.currentUser) {

            alert(
                "Please login before saving the Talapatrak."
            );

            return false;

        }


        const mojeInput =
            document.getElementById(
                "talapatrakMoje"
            );


        const talukaInput =
            document.getElementById(
                "talapatrakTaluka"
            );


        const jilloInput =
            document.getElementById(
                "talapatrakJillo"
            );


        const moje =
            mojeInput
                ? mojeInput.value.trim()
                : "";


        const taluka =
            talukaInput
                ? talukaInput.value.trim()
                : "";


        const jillo =
            jilloInput
                ? jilloInput.value.trim()
                : "";


        if (!moje) {

            alert(
                "Please enter મોજે before saving."
            );

            if (mojeInput) {

                mojeInput.focus();

            }

            return false;

        }


        const currentYear =
            getCurrentTalapatrakYear();


        updateTalapatrakYearDisplay(
            currentYear
        );


        const rows =
            collectTalapatrakRows();


        if (!rows.length) {

            alert(
                "At least one row is required."
            );

            return false;

        }


        /*
        ========================================================
            DOCUMENT ID
        ========================================================
        */

        const documentId =
            getTalapatrakDocumentId(
                moje,
                currentYear
            );


        console.log(
            "Saving Talapatrak with document ID:",
            documentId
        );


        const documentReference =
            db
                .collection(
                    "talapatraks"
                )
                .doc(
                    documentId
                );


        const talapatrakData = {

            type:
                "talapatrak",

            moje:
                moje,

            taluka:
                taluka,

            jillo:
                jillo,

            year:
                currentYear,

            rows:
                rows,

            rowCount:
                rows.length,

            userId:
                auth.currentUser.uid,

            userEmail:
                auth.currentUser.email,

            updatedAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        };


        /*
        ========================================================
            MERGE SAVE
            This updates the document without accidentally
            deleting other fields.
        ========================================================
        */

        await documentReference.set(

            talapatrakData,

            {
                merge:
                    true
            }

        );


      /*
      ========================================================
          AUTO CREATE / UPDATE SHIKSHANUPAKARAN
      ========================================================
      */
      
      await createShikshanupakaranFromTalapatrak(
          talapatrakData
      );

      await loadTalapatrakCount();
      
        // ========================================================
          // ADD TALAPATRAK ACTIVITY
          // ========================================================
          
          await addTalapatrakActivity(
              currentTalapatrakRecord
                  ? "talapatrak_updated"
                  : "talapatrak_added",
          
              currentTalapatrakRecord
                  ? "Talapatrak updated"
                  : "New Talapatrak added",
          
              currentTalapatrakRecord
                  ? `${moje} Talapatrak details updated`
                  : `${moje} Talapatrak created successfully`,
          
              moje
          );


        /*
        ========================================================
            UPDATE CURRENT STATE
        ========================================================
        */

        currentTalapatrakDocumentId =
            documentId;


        currentTalapatrakRecord = {

            id:
                documentId,

            ...talapatrakData

        };


        console.log(
            "Talapatrak saved successfully:",
            documentId
        );


        if (
            showSuccessMessage
        ) {

            alert(
                `Talapatrak for "${moje}" (${currentYear}) saved successfully.`
            );

        }


        return true;

    }

    catch(error) {

        console.error(
            "Error saving Talapatrak:",
            error
        );


        if (
            showSuccessMessage
        ) {

            alert(
                "Talapatrak could not be saved: " +
                error.message
            );

        }


        return false;

    }

}


/* ============================================================
   TALAPATRAK AUTO SAVE
   Saves the current editor automatically after changes.
   Uses the existing saveTalapatrak() function so all
   existing save functionality remains unchanged.
============================================================ */

let talapatrakAutoSaveTimer = null;

let talapatrakAutoSaveInProgress = false;


/* ============================================================
   SCHEDULE AUTO SAVE
============================================================ */

function scheduleTalapatrakAutoSave() {

    /*
        Do not start multiple timers.
    */

    if (talapatrakAutoSaveTimer) {

        clearTimeout(
            talapatrakAutoSaveTimer
        );

    }


    /*
        Wait until the user stops typing/editing.
    */

    talapatrakAutoSaveTimer =
        setTimeout(
            async function() {

                /*
                    Do not autosave while another
                    autosave is already running.
                */

                if (
                    talapatrakAutoSaveInProgress
                ) {

                    return;

                }


                /*
                    Only autosave when the
                    Talapatrak editor is visible.
                */

                const editor =
                    document.getElementById(
                        "talapatrakEditorView"
                    );


                if (
                    !editor ||
                    editor.style.display === "none"
                ) {

                    return;

                }


                /*
                    Do not autosave an empty
                    village record.
                */

                const mojeInput =
                    document.getElementById(
                        "talapatrakMoje"
                    );


                const moje =
                    mojeInput
                        ?.value
                        ?.trim()
                        || "";


                if (!moje) {

                    return;

                }


                /*
                    Prevent overlapping saves.
                */

                talapatrakAutoSaveInProgress =
                    true;


                try {

                    /*
                        IMPORTANT:

                        Use the EXISTING save function.

                        false = no success alert.

                        This means all existing
                        Talapatrak functionality,
                        including:

                        Firebase save
                        Shikshanupakaran sync
                        activity
                        count update
                        current record update

                        continues to work.
                    */

                    await saveTalapatrak(
                        false
                    );


                    console.log(
                        "Talapatrak autosaved."
                    );

                }

                catch(error) {

                    console.error(
                        "Talapatrak autosave error:",
                        error
                    );

                }

                finally {

                    talapatrakAutoSaveInProgress =
                        false;

                }

            },

            1000
        );

}


/* ============================================================
   ATTACH AUTO SAVE LISTENERS
============================================================ */

function setupTalapatrakAutoSave() {

    const editor =
        document.getElementById(
            "talapatrakEditorView"
        );


    if (!editor) {

        return;

    }


    /*
        Prevent duplicate listeners.
    */

    if (
        editor.dataset
            .autosaveAttached === "true"
    ) {

        return;

    }


    editor.dataset
        .autosaveAttached =
        "true";


    /*
        Listen for changes to:

        - Moje
        - Taluka
        - Jillo
        - Table inputs
    */

    editor.addEventListener(
        "input",
        function() {

            scheduleTalapatrakAutoSave();

        }
    );


    /*
        Date picker / programmatic changes
        may trigger change instead of input.
    */

    editor.addEventListener(
        "change",
        function() {

            scheduleTalapatrakAutoSave();

        }
    );


    /*
        Save when an input loses focus.
        This is useful for date fields and
        number fields.
    */

    editor.addEventListener(
        "blur",
        function() {

            scheduleTalapatrakAutoSave();

        },
        true
    );


    console.log(
        "Talapatrak autosave initialized."
    );

}
/* ============================================================
        SAVE BUTTON
============================================================ */

if (saveTalapatrakButton) {

    saveTalapatrakButton.onclick =
        async function() {

            if (
                saveTalapatrakButton.disabled
            ) {

                return;

            }


            saveTalapatrakButton.disabled =
                true;


            saveTalapatrakButton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Saving...

            `;


            try {

                await saveTalapatrak(
                    true
                );

            }

            finally {

                saveTalapatrakButton.disabled =
                    false;


                saveTalapatrakButton.innerHTML = `

                    <i class="fa-solid fa-floppy-disk"></i>

                    Save

                `;

            }

        };

}

/* ============================================================
        OPEN TALAPATRAK EDITOR VIEW
============================================================ */

function openTalapatrakEditor() {

    /*
        Hide every Talapatrak view first.
    */

    hideAllTalapatrakViews();


    /*
        Show ONLY the editor.
    */

    if (talapatrakEditorViewElement) {

        talapatrakEditorViewElement.style.display =
            "block";

    }


    /*
        Fullscreen editor mode.
    */

    document.body.classList.add(
        "talapatrakFullscreen"
    );


    /*
        Make sure print container
        is hidden during editing.
    */

    const printContainer =
        document.getElementById(
            "talapatrakPrintContainer"
        );

    if (printContainer) {

        printContainer.style.display =
            "none";

    }


    window.scrollTo(
        0,
        0
    );


    console.log(
        "Talapatrak editor opened"
    );

}
/* ============================================================
        OPEN EXISTING RECORD
============================================================ */

async function openTalapatrakRecord(documentId) {

    try {

        const snapshot =
            await db
                .collection("talapatraks")
                .doc(documentId)
                .get();

        if (!snapshot.exists) {

            alert("Talapatrak record not found.");

            return;

        }

        const data =
            snapshot.data();

        const editorVillageName =
                document.getElementById(
                    "talapatrakEditorVillageName"
                );
            
            if (editorVillageName) {
            
                editorVillageName.textContent =
                    data.moje || "Talapatrak";
            
            }

        currentTalapatrakRecord = {

            id: documentId,

            ...data

        };

        currentTalapatrakDocumentId =
            documentId;

        openTalapatrakEditor();

        document.getElementById(
            "talapatrakMoje"
        ).value =
            data.moje || "";

        document.getElementById(
            "talapatrakTaluka"
        ).value =
            data.taluka || "";

        document.getElementById(
            "talapatrakJillo"
        ).value =
            data.jillo || "";

        updateTalapatrakYearDisplay(
            data.year ||
            getCurrentTalapatrakYear()
        );

        clearTalapatrakRows();

        const rows =
            data.rows || [];

        if (rows.length) {

            rows.forEach(function(rowData) {

                createTalapatrakRow(
                    rowData
                );

            });

        }

        else {

            addInitialTalapatrakRow();

        }

        formatTalapatrakNumberInputs();

        setupTalapatrakExcelNavigation();

        calculateAllTalapatrakRows();

    }

    catch(error) {

        console.error(
            "Error opening Talapatrak:",
            error
        );

        alert(
            "Could not open Talapatrak."
        );

    }

}


// /* ============================================================
//         PRINT TALAPATRAK
// ============================================================ */
// if (printTalapatrakButton) {

//     printTalapatrakButton.onclick =
//     async function() {


//         await addTalapatrakActivity(
//             "talapatrak_printed",
//             "Talapatrak printed",
//             `${currentTalapatrakRecord?.moje || "Talapatrak"} printed`,
//             currentTalapatrakRecord?.moje || ""
//         );


//         document.body.classList.add(
//             "printingTalapatrak"
//         );


//         setTimeout(function(){

//             window.print();

//         },100);

// };

// }

/* ============================================================
        PRINT CLEANUP
============================================================ */

window.addEventListener(
    "afterprint",
    function() {

        document.body.classList.remove(
            "printingTalapatrak"
        );

        console.log(
            "Talapatrak print completed."
        );

    }
);

/* ============================================================
        SEARCH
============================================================ */

if (
    talapatrakSearchInputElement
) {

    talapatrakSearchInputElement.addEventListener(

        "input",

        function() {

            talapatrakSearchTerm =
                this.value
                    .trim()
                    .toLowerCase();


            renderTalapatrakManagement();

        }

    );

}


/* ============================================================
        FILTER
============================================================ */

function getFilteredTalapatrakRecords() {

    if (!talapatrakSearchTerm) {

        return [
            ...talapatrakRecords
        ];

    }

    return talapatrakRecords.filter(

        function(record) {

            const searchableText = `

                ${record.moje || ""}

                ${record.year || ""}

                ${record.taluka || ""}

                ${record.jillo || ""}

            `
            .toLowerCase();

            return searchableText.includes(
                talapatrakSearchTerm
            );

        }

    );

}


/* ============================================================
        TIMESTAMP
============================================================ */

function getTimestamp(timestamp) {

    if (!timestamp) {

        return 0;

    }

    if (timestamp.toDate) {

        return timestamp
            .toDate()
            .getTime();

    }

    if (timestamp instanceof Date) {

        return timestamp.getTime();

    }

    return new Date(
        timestamp
    ).getTime() || 0;

}


/* ============================================================
        FORMAT DATE
============================================================ */

function formatTalapatrakDate(timestamp) {

    if (!timestamp) {

        return "—";

    }

    const date =
        timestamp.toDate
            ? timestamp.toDate()
            : new Date(
                timestamp
            );

    return date.toLocaleDateString(

        "en-IN",

        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }

    );

}



const talapatrakSystemCard =
    document.getElementById(
        "talapatrakSystemCard"
    );


if (talapatrakSystemCard) {

    talapatrakSystemCard.addEventListener(

        "click",

        async function() {

            await openTalapatrakManagement();

        }

    );

}

document
    .getElementById("mainBillSystemCard")
    .addEventListener("click", function () {

        showMainView("mainBillsView");

    });

/* ============================================================
        DOWNLOAD TALAPATRAK PDF
============================================================ */

async function downloadTalapatrakPDF(record){


    try{


        if(!record){

            alert(
                "No Talapatrak record available."
            );

            return;

        }



        const { jsPDF } =
            window.jspdf;



        const pdf =
            new jsPDF(
                "landscape",
                "mm",
                "a4"
            );



        const villageName =
            record.moje || "Village";


        const year =
            record.year || "";



        pdf.setFontSize(
            16
        );


        pdf.text(
            `Talapatrak - ${villageName}`,
            15,
            15
        );



        pdf.setFontSize(
            11
        );


        pdf.text(
            `Year: ${year}`,
            15,
            23
        );



        const rows =
            record.rows || [];



        const tableRows =
            rows.map(
                function(row){

                    return [

                        row.A || "",
                        row.B || "",
                        row.C || "",
                        row.D || "",
                        row.E || "",
                        row.F || "",
                        row.G || "",
                        row.H || "",
                        row.I || "",
                        row.J || "",
                        row.K || "",
                        row.L || "",
                        row.M || "",
                        row.N || "",
                        row.O || "",
                        row.P || "",
                        row.Q || "",
                        row.R || "",
                        row.S || "",
                        row.T || "",
                        row.U || ""

                    ];

                }
            );



        pdf.autoTable({

            startY: 30,


            head: [[

                "No",
                "Name",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "Date",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U"

            ]],


            body:
                tableRows,


            styles: {

                fontSize: 6

            },


            theme:
                "grid"


        });



        pdf.save(
            `${villageName}_${year}_Talapatrak.pdf`
        );



        console.log(
            "Talapatrak PDF downloaded:",
            villageName,
            year
        );


    }


    catch(error){


        console.error(
            "Talapatrak PDF error:",
            error
        );


        alert(
            "Unable to create Talapatrak PDF."
        );


    }


}



/* ============================================================
   TALAPATRAK INITIALIZATION
============================================================ */

updateTalapatrakYearDisplay();

formatTalapatrakNumberInputs();

setupTalapatrakExcelNavigation();

setupTalapatrakAutoSave();

console.log(
    "Dynamic Talapatrak system initialized."
);


/* ============================================================
   TALAPATRAK PRINT SYSTEM
   EXACTLY 20 USER ROWS PER PAGE
   SAME LOGIC AS SHIKSHANUPAKARAN
   ============================================================ */



function prepareTalapatrakPrint(sourceRows) {

    const table =
        document.getElementById(
            "talapatrakTable"
        );

    const tbody =
        document.getElementById(
            "talapatrakBody"
        );

    const container =
        document.getElementById(
            "talapatrakPrintContainer"
        );


    if (
        !table ||
        !tbody ||
        !container
    ) {

        console.warn(
            "Talapatrak print elements not found."
        );

        return;

    }


    /* --------------------------------------------------------
       REMOVE OLD PRINT PAGES
       -------------------------------------------------------- */

    container
        .querySelectorAll(
            ".talapatrakPrintPage"
        )
        .forEach(
            function(page) {

                page.remove();

            }
        );


    /* --------------------------------------------------------
       GET ONLY REAL USER ROWS
       -------------------------------------------------------- */

    const userRows =
        Array.from(
            tbody.querySelectorAll(
                "tr.talapatrakRow"
            )
        );


    console.log(
        "TALAPATRAK PRINT ROWS FOUND:",
        userRows.length
    );


    /* --------------------------------------------------------
       EXACTLY 20 ROWS PER PAGE
       -------------------------------------------------------- */

    const rowsPerPage =
        20;


    /* --------------------------------------------------------
       EMPTY TABLE
       -------------------------------------------------------- */

    if (
        userRows.length === 0
    ) {

        createTalapatrakPrintPage(
            [],
            1,
            container,
            table
        );

        return;

    }


    /* --------------------------------------------------------
       TOTAL PAGES
       -------------------------------------------------------- */

    const totalPages =
        Math.ceil(
            userRows.length /
            rowsPerPage
        );


    console.log(
        "TALAPATRAK TOTAL PRINT PAGES:",
        totalPages
    );


    /* --------------------------------------------------------
       CREATE EACH PRINT PAGE
       -------------------------------------------------------- */

    for (
        let pageNumber = 0;
        pageNumber < totalPages;
        pageNumber++
    ) {

        const start =
            pageNumber *
            rowsPerPage;


        const end =
            Math.min(
                start + rowsPerPage,
                userRows.length
            );


        const pageRows =
            userRows.slice(
                start,
                end
            );


        console.log(
            "TALAPATRAK PRINT PAGE",
            pageNumber + 1,
            "ROWS:",
            pageRows.length
        );


        createTalapatrakPrintPage(
            pageRows,
            pageNumber + 1,
            container,
            table
        );

    }

}


/* ============================================================
   CREATE ONE TALAPATRAK PRINT PAGE
   ============================================================ */

/* ============================================================
   CREATE ONE TALAPATRAK PRINT PAGE
   SAME PAGE NUMBER STRUCTURE AS SHIKSHANUPAKARAN
   ============================================================ */

function createTalapatrakPrintPage(
    pageRows,
    pageNumber,
    container,
    sourceTable
) {

    /* --------------------------------------------------------
       CREATE PRINT PAGE
       -------------------------------------------------------- */

    const printPage =
        document.createElement(
            "div"
        );


    printPage.className =
        "talapatrakPrintPage";


    printPage.dataset.page =
        pageNumber;


    /* --------------------------------------------------------
       GET CURRENT TALAPATRAK INFORMATION
       -------------------------------------------------------- */

    const mojeElement =
        document.getElementById(
            "talapatrakMoje"
        );

    const talukaElement =
        document.getElementById(
            "talapatrakTaluka"
        );

    const jilloElement =
        document.getElementById(
            "talapatrakJillo"
        );

    const yearElement =
        document.getElementById(
            "talapatrakYear"
        );


    const moje =
        mojeElement
            ? mojeElement.value.trim()
            : "";


    const taluka =
        talukaElement
            ? talukaElement.value.trim()
            : "";


    const jillo =
        jilloElement
            ? jilloElement.value.trim()
            : "";


    const year =
        yearElement
            ? yearElement.textContent.trim()
            : "";


    /* --------------------------------------------------------
       CREATE PRINT HEADER
       -------------------------------------------------------- */

    const printHeader =
        document.createElement(
            "div"
        );


    printHeader.className =
        "talapatrakPrintHeader";


    printHeader.innerHTML = `

        <div class="talapatrakPrintHeaderItem">
            <strong>મોજે :</strong>
            <span>${moje}</span>
        </div>

        <div class="talapatrakPrintHeaderItem">
            <strong>તાલુકા :</strong>
            <span>${taluka}</span>
        </div>

        <div class="talapatrakPrintHeaderItem">
            <strong>જિલ્લો :</strong>
            <span>${jillo}</span>
        </div>

        <div class="talapatrakPrintHeaderItem">
            <strong>ગામના નમૂના નંબર-૧૧ :</strong>
            <span>તાળાપત્રક</span>
        </div>

        <div class="talapatrakPrintHeaderItem">
            <strong>વર્ષ :</strong>
            <span>${year}</span>
        </div>

    `;


    /* --------------------------------------------------------
       ADD HEADER TO PAGE
       -------------------------------------------------------- */

    printPage.appendChild(
        printHeader
    );


    /* --------------------------------------------------------
       CLONE TABLE STRUCTURE
       -------------------------------------------------------- */

    const printTable =
        sourceTable.cloneNode(
            true
        );


      printTable.classList.add(
          "talapatrakPrintTable"
      );
      
      printTable.removeAttribute(
          "id"
      );
      
      
      /* --------------------------------------------------------
         REMOVE ORIGINAL COLUMN WIDTH DEFINITIONS
         PRINT TABLE MUST USE NATURAL AUTO WIDTHS
         -------------------------------------------------------- */
      
      const printColgroup =
          printTable.querySelector(
              "colgroup"
          );
      
      if (printColgroup) {
      
          printColgroup.remove();
      
      }
      
      
      /* --------------------------------------------------------
         FORCE NATURAL TABLE LAYOUT
         -------------------------------------------------------- */
      
      printTable.style.tableLayout =
          "auto";
      
      printTable.style.width =
          "100%";
      
      printTable.style.maxWidth =
          "100%";


    /* --------------------------------------------------------
       REMOVE ORIGINAL DATA ROWS
       -------------------------------------------------------- */

    printTable
        .querySelectorAll(
            "tbody tr.talapatrakRow"
        )
        .forEach(
            function(row) {

                row.remove();

            }
        );


    /* --------------------------------------------------------
       GET PRINT TBODY
       -------------------------------------------------------- */

    const printTbody =
        printTable.querySelector(
            "tbody"
        );


    if (
        !printTbody
    ) {

        console.error(
            "Talapatrak print tbody not found."
        );

        return;

    }


    /* --------------------------------------------------------
       ADD ONLY THIS PAGE'S ROWS
       -------------------------------------------------------- */

    pageRows.forEach(
        function(originalRow) {

            const clonedRow =
                originalRow.cloneNode(
                    true
                );


            /* --------------------------------------------
               COPY LIVE INPUT VALUES
               -------------------------------------------- */

            const originalInputs =
                originalRow.querySelectorAll(
                    "input, textarea"
                );


            const clonedInputs =
                clonedRow.querySelectorAll(
                    "input, textarea"
                );


            originalInputs.forEach(
                function(
                    originalInput,
                    index
                ) {

                    const clonedInput =
                        clonedInputs[index];


                    if (
                        !clonedInput
                    ) {

                        return;

                    }


                    clonedInput.value =
                        originalInput.value;


                    clonedInput.setAttribute(
                        "value",
                        originalInput.value
                    );


                    if (
                        originalInput.tagName ===
                        "TEXTAREA"
                    ) {

                        clonedInput.textContent =
                            originalInput.value;

                    }

                }
            );


            /* --------------------------------------------
               REMOVE PRINT-HIDDEN ELEMENTS
               -------------------------------------------- */

            clonedRow
                .querySelectorAll(
                    ".printHide"
                )
                .forEach(
                    function(element) {

                        element.remove();

                    }
                );


            printTbody.appendChild(
                clonedRow
            );

        }
    );


    /* --------------------------------------------------------
       REMOVE ALL PRINT-HIDDEN ELEMENTS FROM TABLE
       -------------------------------------------------------- */

    printTable
        .querySelectorAll(
            ".printHide"
        )
        .forEach(
            function(element) {

                element.remove();

            }
        );


    /* --------------------------------------------------------
       REMOVE PRINT-HIDDEN COLUMNS
       -------------------------------------------------------- */

    printTable
        .querySelectorAll(
            "col.colT, " +
            "col.colU, " +
            "col.colV, " +
            "col.colAction"
        )
        .forEach(
            function(col) {

                col.remove();

            }
        );


    /* --------------------------------------------------------
       ADD TABLE TO PAGE
       -------------------------------------------------------- */

    printPage.appendChild(
        printTable
    );


    /* ========================================================
       PAGE NUMBER
       SAME SYSTEM AS SHIKSHANUPAKARAN
       ======================================================== */

    const pageNumberElement =
        document.createElement(
            "div"
        );


    pageNumberElement.className =
        "talapatrakPrintPageNumber";


    pageNumberElement.textContent =
        `Page ${pageNumber}`;


    /* --------------------------------------------------------
       PAGE FOOTER
       -------------------------------------------------------- */

    const pageFooter =
        document.createElement(
            "div"
        );


    pageFooter.className =
        "talapatrakPrintFooter";


    pageFooter.appendChild(
        pageNumberElement
    );


    /* --------------------------------------------------------
       ADD FOOTER TO PAGE
       -------------------------------------------------------- */

    printPage.appendChild(
        pageFooter
    );


    /* --------------------------------------------------------
       DEBUG
       -------------------------------------------------------- */

    console.log(
        "TALAPATRAK PRINT PAGE",
        pageNumber,
        "ROWS:",
        printTbody.querySelectorAll(
            "tr"
        ).length
    );


    /* --------------------------------------------------------
       ADD PAGE TO PRINT CONTAINER
       -------------------------------------------------------- */

    container.appendChild(
        printPage
    );

}



/* ============================================================
   TALAPATRAK PRINT
   ============================================================ */

// function printTalapatrak() {

//     console.log(
//         "TALAPATRAK PRINT STARTED"
//     );


//     /* --------------------------------------------------------
//        GET TABLE
//        -------------------------------------------------------- */

//     const table =
//         document.getElementById(
//             "talapatrakTable"
//         );


//     if (
//         !table
//     ) {

//         console.error(
//             "Talapatrak table not found."
//         );

//         alert(
//             "Talapatrak table not found."
//         );

//         return;

//     }


//     /* --------------------------------------------------------
//        REMOVE OLD PRINT CONTAINER
//        -------------------------------------------------------- */

//     const oldContainer =
//         document.getElementById(
//             "talapatrakPrintContainer"
//         );


//     if (
//         oldContainer
//     ) {

//         oldContainer.remove();

//     }


//     /* --------------------------------------------------------
//        CREATE NEW PRINT CONTAINER
//        -------------------------------------------------------- */

//     const printContainer =
//         document.createElement(
//             "div"
//         );


//     printContainer.id =
//         "talapatrakPrintContainer";


//     /* --------------------------------------------------------
//        HIDE DURING NORMAL EDITOR VIEW
//        -------------------------------------------------------- */

//     printContainer.style.display =
//         "none";


//     /* --------------------------------------------------------
//        ADD CONTAINER TO BODY
//        -------------------------------------------------------- */

//     document.body.appendChild(
//         printContainer
//     );


//     /* --------------------------------------------------------
//        PREPARE 20-ROW PAGES
//        -------------------------------------------------------- */

//     prepareTalapatrakPrint();


//     /* --------------------------------------------------------
//        ACTIVATE PRINT MODE
//        -------------------------------------------------------- */

//     document.body.classList.add(
//         "printingTalapatrak"
//     );


//     printContainer.style.display =
//         "block";


//     /* --------------------------------------------------------
//        PRINT
//        -------------------------------------------------------- */

//     setTimeout(
//         function() {

//             window.print();

//         },
//         100
//     );


//     console.log(
//         "TALAPATRAK PRINT READY"
//     );

// }




function printTalapatrak() {

    console.log(
        "TALAPATRAK PRINT STARTED"
    );


    /* ========================================================
       GET TABLE
    ======================================================== */

    const table =
        document.getElementById(
            "talapatrakTable"
        );


    if (!table) {

        console.error(
            "Talapatrak table not found."
        );

        alert(
            "Talapatrak table not found."
        );

        return;

    }


    /* ========================================================
       REMOVE OLD CONTAINER
    ======================================================== */

    const oldContainer =
        document.getElementById(
            "talapatrakPrintContainer"
        );


    if (oldContainer) {

        oldContainer.remove();

    }


    /* ========================================================
       CREATE TEMPORARY PRINT CONTAINER
    ======================================================== */

    const printContainer =
        document.createElement(
            "div"
        );


    printContainer.id =
        "talapatrakPrintContainer";


    printContainer.style.display =
        "none";


    document.body.appendChild(
        printContainer
    );


    /* ========================================================
       CREATE 20-ROW PRINT PAGES
    ======================================================== */

    prepareTalapatrakPrint();


    /* ========================================================
       GET ONLY TALAPATRAK PRINT CSS
    ======================================================== */

    const printStyles =
        Array.from(
            document.querySelectorAll(
                'style[data-talapatrak-print]'
            )
        )
        .map(function(style) {

            return style.outerHTML;

        })
        .join("");


    /* ========================================================
       GET GENERATED PRINT PAGES
    ======================================================== */

    const pages =
        Array.from(
            printContainer.querySelectorAll(
                ".talapatrakPrintPage"
            )
        )
        .map(function(page) {

            return page.outerHTML;

        })
        .join("");


    if (!pages) {

        console.error(
            "No Talapatrak print pages generated."
        );

        printContainer.remove();

        return;

    }


    console.log(
        "TALAPATRAK PAGES READY:",
        printContainer.querySelectorAll(
            ".talapatrakPrintPage"
        ).length
    );


    /* ========================================================
       CREATE ISOLATED IFRAME
    ======================================================== */

    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.style.position =
        "fixed";

    iframe.style.right =
        "0";

    iframe.style.bottom =
        "0";

    iframe.style.width =
        "0";

    iframe.style.height =
        "0";

    iframe.style.border =
        "0";


    document.body.appendChild(
        iframe
    );


    /* ========================================================
       IFRAME DOCUMENT
    ======================================================== */

    const iframeDocument =
        iframe.contentDocument ||
        iframe.contentWindow.document;


    /* ========================================================
       WRITE TALAPATRAK ONLY
    ======================================================== */

    iframeDocument.open();


    iframeDocument.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Talapatrak Print
            </title>

            ${printStyles}

        </head>


        <body>

            <div
                id="talapatrakPrintContainer"
                style="display:block !important;"
            >

                ${pages}

            </div>

        </body>

        </html>
    `);


    iframeDocument.close();


    /* ========================================================
       WAIT FOR IFRAME TO RENDER
    ======================================================== */

    setTimeout(
        function() {

            console.log(
                "TALAPATRAK IFRAME READY"
            );


            iframe.contentWindow.focus();


            iframe.contentWindow.print();


            /* =================================================
               CLEANUP
            ================================================= */

            setTimeout(
                function() {

                    iframe.remove();

                    printContainer.remove();


                    console.log(
                        "TALAPATRAK PRINT CLEANUP COMPLETE"
                    );

                },
                1000
            );

        },
        500
    );

}


// function printTalapatrak() {

//     console.log(
//         "TALAPATRAK PRINT STARTED"
//     );


//     /* ========================================================
//        GET TABLE
//     ======================================================== */

//     const table =
//         document.getElementById(
//             "talapatrakTable"
//         );


//     if (!table) {

//         console.error(
//             "Talapatrak table not found."
//         );

//         alert(
//             "Talapatrak table not found."
//         );

//         return;

//     }


//     /* ========================================================
//        REMOVE OLD PRINT CONTAINER
//     ======================================================== */

//     const oldContainer =
//         document.getElementById(
//             "talapatrakPrintContainer"
//         );


//     if (oldContainer) {

//         oldContainer.remove();

//     }


//     /* ========================================================
//        CREATE PRINT CONTAINER
//     ======================================================== */

//     const printContainer =
//         document.createElement(
//             "div"
//         );


//     printContainer.id =
//         "talapatrakPrintContainer";


//     printContainer.style.display =
//         "none";


//     document.body.appendChild(
//         printContainer
//     );


//     /* ========================================================
//        PREPARE PRINT PAGES
//     ======================================================== */

//     prepareTalapatrakPrint();


//     /* ========================================================
//        GET TALAPATRAK PRINT CSS ONLY
//     ======================================================== */

//     const printStyles =
//         Array.from(
//             document.querySelectorAll(
//                 'style[data-talapatrak-print]'
//             )
//         )
//         .map(function(style) {

//             return style.outerHTML;

//         })
//         .join("");


//     /* ========================================================
//        GET GENERATED PRINT PAGES
//     ======================================================== */

//     const pages =
//         Array.from(
//             printContainer.querySelectorAll(
//                 ".talapatrakPrintPage"
//             )
//         )
//         .map(function(page) {

//             return page.outerHTML;

//         })
//         .join("");


//     if (!pages) {

//         console.error(
//             "No Talapatrak print pages were generated."
//         );

//         printContainer.remove();

//         return;

//     }


//     console.log(
//         "Talapatrak print pages:",
//         printContainer.querySelectorAll(
//             ".talapatrakPrintPage"
//         ).length
//     );


//     /* ========================================================
//        CREATE TEMPORARY IFRAME
//     ======================================================== */

//     const iframe =
//         document.createElement(
//             "iframe"
//         );


//     iframe.style.position =
//         "fixed";

//     iframe.style.right =
//         "0";

//     iframe.style.bottom =
//         "0";

//     iframe.style.width =
//         "0";

//     iframe.style.height =
//         "0";

//     iframe.style.border =
//         "0";


//     document.body.appendChild(
//         iframe
//     );


//     /* ========================================================
//        GET IFRAME DOCUMENT
//     ======================================================== */

//     const iframeDocument =
//         iframe.contentDocument ||
//         iframe.contentWindow.document;


//     /* ========================================================
//        WRITE ISOLATED TALAPATRAK DOCUMENT
//     ======================================================== */

//     iframeDocument.open();


//     iframeDocument.write(`
//         <!DOCTYPE html>

//         <html>

//         <head>

//             <meta charset="UTF-8">

//             <title>
//                 Talapatrak Print
//             </title>

//             ${printStyles}

//         </head>


//         <body>

//             ${pages}

//         </body>

//         </html>
//     `);


//     iframeDocument.close();


//     /* ========================================================
//        PRINT AFTER IFRAME HAS RENDERED
//     ======================================================== */

//     setTimeout(
//         function() {

//             console.log(
//                 "TALAPATRAK IFRAME READY"
//             );


//             iframe.contentWindow.focus();


//             iframe.contentWindow.print();


//             /* =================================================
//                REMOVE IFRAME
//             ================================================= */

//             setTimeout(
//                 function() {

//                     iframe.remove();


//                     const currentContainer =
//                         document.getElementById(
//                             "talapatrakPrintContainer"
//                         );


//                     if (
//                         currentContainer
//                     ) {

//                         currentContainer.remove();

//                     }


//                     console.log(
//                         "TALAPATRAK PRINT CLEANUP COMPLETE"
//                     );

//                 },
//                 1000
//             );

//         },
//         500
//     );

// }


/* ============================================================
   PRINT CLEANUP
   IMPORTANT:
   REMOVE PRINT PAGES AFTER PRINT
   ============================================================ */

window.addEventListener(
    "afterprint",
    function() {


        console.log(
            "TALAPATRAK PRINT COMPLETED"
        );


        /* --------------------------------------------
           REMOVE PRINT MODE
           -------------------------------------------- */

        document.body.classList.remove(
            "printingTalapatrak"
        );


        /* --------------------------------------------
           REMOVE GENERATED PRINT CONTAINER
           -------------------------------------------- */

        const printContainer =
            document.getElementById(
                "talapatrakPrintContainer"
            );


        if (
            printContainer
        ) {

            printContainer.remove();

        }


        /* --------------------------------------------
           RESTORE EDITOR
           -------------------------------------------- */

        if (
            talapatrakEditorViewElement
        ) {

            talapatrakEditorViewElement.style.display =
                "block";

        }


        /* --------------------------------------------
           KEEP MANAGEMENT VIEW HIDDEN
           -------------------------------------------- */

        if (
            talapatrakViewElement
        ) {

            talapatrakViewElement.style.display =
                "none";

        }


        console.log(
            "Talapatrak print container removed."
        );

    }
);


/* ============================================================
   PRINT BUTTON
   ============================================================ */

if (
    printTalapatrakButton
) {

    printTalapatrakButton.onclick =
        function() {

            printTalapatrak();

        };

}











