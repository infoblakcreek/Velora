console.log("SHIKSHANUPAKARAN JS FILE RUNNING");

/* ============================================================
        SHIKSHANUPAKARAN SYSTEM
        STEP 1: NAVIGATION + MANAGEMENT + EDITOR
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */


const shikshanupakaranNavElement =
    document.getElementById(
        "shikshanupakaranNav"
    );


const shikshanupakaranViewElement =
    document.getElementById(
        "shikshanupakaranView"
    );


const shikshanupakaranEditorViewElement =
    document.getElementById(
        "shikshanupakaranEditorView"
    );


const backToShikshanupakaranManagementButton =
    document.getElementById(
        "backToShikshanupakaranManagement"
    );


const addShikshanupakaranButton =
    document.getElementById(
        "addShikshanupakaranButton"
    );


const emptyAddShikshanupakaranButton =
    document.getElementById(
        "emptyAddShikshanupakaranButton"
    );



/* ============================================================
        GLOBAL STATE
============================================================ */


let shikshanupakaranRecords = [];


let currentShikshanupakaranRecord = null;


let currentShikshanupakaranDocumentId = null;

function openShikshanupakaran(){

    const dashboard =
        document.getElementById("dashboardView");


    const shikshanupakaran =
        document.getElementById("shikshanupakaranContainer");


    if(dashboard){
        dashboard.style.display = "none";
    }


    if(shikshanupakaran){
        shikshanupakaran.style.display = "block";
    }

}

/* ============================================================
        NAVIGATION ACTIVE STATE
============================================================ */


function clearShikshanupakaranNavigationActiveState(){

    document
        .querySelectorAll(
            ".navItem"
        )
        .forEach(
            function(item){

                item.classList.remove(
                    "active"
                );

            }
        );

}



/* ============================================================
        HIDE SHIKSHANUPAKARAN VIEWS
============================================================ */


function hideAllShikshanupakaranViews(){


    if(shikshanupakaranViewElement){

        shikshanupakaranViewElement.style.display =
            "none";

    }


    if(shikshanupakaranEditorViewElement){

        shikshanupakaranEditorViewElement.style.display =
            "none";

    }


}



/* ============================================================
        OPEN SHIKSHANUPAKARAN MANAGEMENT
============================================================ */


async function openShikshanupakaranManagement(){

    if(typeof hideAllViews === "function"){
          hideAllViews();
      }        // Hide Dashboard, Invoice, Talapatrak, etc.
      

      console.log(
        "Shikshanupakaran element:",
        shikshanupakaranViewElement
    );

  
    hideAllShikshanupakaranViews(); // Hide Shikshanupakaran views


    if(shikshanupakaranViewElement){

        shikshanupakaranViewElement.style.display =
            "block";

    }

    clearShikshanupakaranNavigationActiveState();

    if(shikshanupakaranNavElement){

        shikshanupakaranNavElement.classList.add(
            "active");

    }

  console.log(
    "Opening Shikshanupakaran"
);

console.log(
    "Dashboard element:",
    document.getElementById("dashboardView")
);

console.log(
    "Dashboard display before:",
    document.getElementById("dashboardView").style.display
);

    await createNewYearShikshanupakaranRecords();

    await loadShikshanupakaranRecords();

}


console.log(
    "Shikshanupakaran nav:",
    shikshanupakaranNavElement
);

/* ============================================================
        SIDEBAR CLICK
============================================================ */


if(shikshanupakaranNavElement){


       shikshanupakaranNav.addEventListener("click", function (event) {
      
              event.preventDefault();
      
              document.getElementById("dashboardView").style.display = "none";
              document.getElementById("mainBillsView").style.display = "none";
              document.getElementById("invoiceView").style.display = "none";
              document.getElementById("talapatrakView").style.display = "none";
      
              document.getElementById("shikshanupakaranView").style.display = "block";

             console.log(
                "Shikshanupakaran sidebar clicked"
            );


            openShikshanupakaranManagement();
      
          });
      

}



/* ============================================================
        INITIAL VIEW
============================================================ */


function initializeShikshanupakaranViews(){


    if(shikshanupakaranViewElement){

        shikshanupakaranViewElement.style.display =
            "none";

    }


    if(shikshanupakaranEditorViewElement){

        shikshanupakaranEditorViewElement.style.display =
            "none";

    }


}



initializeShikshanupakaranViews();



console.log(
    "Shikshanupakaran navigation initialized"
);


/* ============================================================
        SHIKSHANUPAKARAN MANAGEMENT
        FIREBASE LOAD + SEARCH + SORT STATE
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */


const shikshanupakaranSearchInputElement =
    document.getElementById(
        "shikshanupakaranSearchInput"
    );


const shikshanupakaranSortButtonElement =
    document.getElementById(
        "shikshanupakaranSortButton"
    );


const shikshanupakaranSortMenuElement =
    document.getElementById(
        "shikshanupakaranSortMenu"
    );


const shikshanupakaranSortOptions =
    document.querySelectorAll(
        ".shikshanupakaranSortOption"
    );


const shikshanupakaranGridViewButtonElement =
    document.getElementById(
        "shikshanupakaranGridViewButton"
    );


const shikshanupakaranListViewButtonElement =
    document.getElementById(
        "shikshanupakaranListViewButton"
    );


const shikshanupakaranRecordCountElement =
    document.getElementById(
        "shikshanupakaranRecordCount"
    );

const shikshanupakaranManagementRecordCountElement =
    document.getElementById(
        "shikshanupakaranManagementRecordCount"
    );

const shikshanupakaranVillageGridElement =
    document.getElementById(
        "shikshanupakaranVillageGrid"
    );


const shikshanupakaranEmptyStateElement =
    document.getElementById(
        "shikshanupakaranEmptyState"
    );



/* ============================================================
        STATE
============================================================ */


let shikshanupakaranSearchTerm =
    "";


let shikshanupakaranSortMode =
    "recent";


let shikshanupakaranViewMode =
    "grid";

if(shikshanupakaranGridViewButtonElement){

    shikshanupakaranGridViewButtonElement.addEventListener(
        "click",
        function(){

            shikshanupakaranViewMode = "grid";

            shikshanupakaranVillageGridElement.classList.remove(
                "listView"
            );

            shikshanupakaranGridViewButtonElement.classList.add(
                "active"
            );

            shikshanupakaranListViewButtonElement.classList.remove(
                "active"
            );

        }
    );

}



if(shikshanupakaranListViewButtonElement){

    shikshanupakaranListViewButtonElement.addEventListener(
        "click",
        function(){

            shikshanupakaranViewMode = "list";

            shikshanupakaranVillageGridElement.classList.add(
                "listView"
            );

            shikshanupakaranListViewButtonElement.classList.add(
                "active"
            );

            shikshanupakaranGridViewButtonElement.classList.remove(
                "active"
            );

        }
    );

}


/* ============================================================
        LOAD RECORDS FROM FIREBASE
============================================================ */


async function loadShikshanupakaranRecords(){


    try{


        if(
            !auth ||
            !auth.currentUser
        ){


            console.warn(
                "No user logged in."
            );


            shikshanupakaranRecords =
                [];


            renderShikshanupakaranManagement();


            return;

        }



        if(
            shikshanupakaranVillageGridElement
        ){

            shikshanupakaranVillageGridElement.innerHTML = `


                <div class="shikshanupakaranLoadingState">


                    <i class="fa-solid fa-spinner fa-spin"></i>


                    <p>
                        Loading Shikshanupakaran records...
                    </p>


                </div>


            `;

        }




        const snapshot =

            await db

                .collection(
                    "shikshanupakarans"
                )

                .where(
                    "userId",
                    "==",
                    auth.currentUser.uid
                )

                .get();




        shikshanupakaranRecords = [];




        snapshot.forEach(

            function(doc){


                shikshanupakaranRecords.push({

                    id:
                        doc.id,

                    ...doc.data()

                });


            }

        );




        console.log(
            "SHIKSHANUPAKARAN RECORDS:",
            shikshanupakaranRecords
        );



        renderShikshanupakaranManagement();



    }


    catch(error){


        console.error(
            "Error loading Shikshanupakaran:",
            error
        );


    }


}


/* ============================================================
        DASHBOARD SHIKSHANUPAKARAN COUNT
============================================================ */


async function loadShikshanupakaranDashboardCount(){

    try{


        if(
            !auth.currentUser
        ){

            return;

        }



        const snapshot =

            await db
            .collection(
                "shikshanupakarans"
            )
            .where(
                "userId",
                "==",
                auth.currentUser.uid
            )
            .get();





        if(
            shikshanupakaranDashboardCountElement
        ){

            shikshanupakaranDashboardCountElement.textContent =
                snapshot.size;


        }



    }

    catch(error){


        console.error(
            "Shikshanupakaran dashboard count error:",
            error
        );


    }


}

/* ============================================================
        SEARCH
============================================================ */


if(
    shikshanupakaranSearchInputElement
){


    shikshanupakaranSearchInputElement.addEventListener(

        "input",

        function(){


            shikshanupakaranSearchTerm =

                this.value
                    .trim()
                    .toLowerCase();



            renderShikshanupakaranManagement();


        }

    );

}


/* ============================================================
        FILTER RECORDS
============================================================ */


function getFilteredShikshanupakaranRecords(){


    if(
        !shikshanupakaranSearchTerm
    ){

        return [
            ...shikshanupakaranRecords
        ];

    }



    return shikshanupakaranRecords.filter(

        function(record){


            const text = `

                ${record.moje || ""}

                ${record.year || ""}

                ${record.taluka || ""}

                ${record.jillo || ""}

            `
            .toLowerCase();



            return text.includes(
                shikshanupakaranSearchTerm
            );


        }

    );


}


/* ============================================================
        SORT DROPDOWN
============================================================ */


if(

    shikshanupakaranSortButtonElement &&
    shikshanupakaranSortMenuElement

){


    shikshanupakaranSortButtonElement.addEventListener(

        "click",

        function(event){


            event.stopPropagation();


            shikshanupakaranSortMenuElement.classList.toggle(
                "open"
            );


        }

    );

}




shikshanupakaranSortOptions.forEach(

    function(option){


        option.addEventListener(

            "click",

            function(){


                shikshanupakaranSortMode =
                    this.dataset.sort;



                shikshanupakaranSortOptions.forEach(

                    function(btn){


                        btn.classList.remove(
                            "active"
                        );


                    }

                );



                this.classList.add(
                    "active"
                );



                renderShikshanupakaranManagement();


            }

        );


    }

);

/* ============================================================
        SORT FUNCTION
============================================================ */


function sortShikshanupakaranRecords(records){


    const sortedRecords =
        [
            ...records
        ];



    switch(
        shikshanupakaranSortMode
    ){


        case "recent":


            sortedRecords.sort(

                function(a,b){

                    return getTimestamp(b.updatedAt)
                    -
                    getTimestamp(a.updatedAt);

                }

            );


        break;




        case "oldest":


            sortedRecords.sort(

                function(a,b){

                    return getTimestamp(a.updatedAt)
                    -
                    getTimestamp(b.updatedAt);

                }

            );


        break;




        case "az":


            sortedRecords.sort(

                function(a,b){

                    return String(a.moje || "")
                    .localeCompare(
                        String(b.moje || ""),
                        "gu"
                    );

                }

            );


        break;




        case "za":


            sortedRecords.sort(

                function(a,b){

                    return String(b.moje || "")
                    .localeCompare(
                        String(a.moje || ""),
                        "gu"
                    );

                }

            );


        break;


    }



    return sortedRecords;


}

/* ============================================================
        SHIKSHANUPAKARAN RENDER MANAGEMENT
============================================================ */


function renderShikshanupakaranManagement(){


    console.log(
        "RENDER SHIKSHANUPAKARAN:",
        shikshanupakaranRecords.length
    );



    const filteredRecords =
        getFilteredShikshanupakaranRecords();



    const sortedRecords =
        sortShikshanupakaranRecords(
            filteredRecords
        );




    if(
        shikshanupakaranRecordCountElement
    ){

        shikshanupakaranRecordCountElement.textContent =
            sortedRecords.length;

    }


    if (
        shikshanupakaranManagementRecordCountElement
    ) {
    
        shikshanupakaranManagementRecordCountElement.textContent =
            sortedRecords.length;
    
    }



    if(
        shikshanupakaranEmptyStateElement
    ){

        shikshanupakaranEmptyStateElement.style.display =
            sortedRecords.length === 0
            ? "flex"
            : "none";

    }





    if(
        !shikshanupakaranVillageGridElement
    ){

        return;

    }





    const oldCards =
        shikshanupakaranVillageGridElement.querySelectorAll(
            ".shikshanupakaranVillageCard"
        );


    oldCards.forEach(

        function(card){

            card.remove();

        }

    );


  const loadingState =
    shikshanupakaranVillageGridElement.querySelector(
        ".shikshanupakaranLoadingState"
    );


if(loadingState){

    loadingState.remove();

}



    sortedRecords.forEach(

        function(record){


            const card =
                createShikshanupakaranVillageCard(
                    record
                );


            shikshanupakaranVillageGridElement.appendChild(
                card
            );


        }

    );



    console.log(
        "Shikshanupakaran cards created:",
        sortedRecords.length
    );


}


/* ============================================================
        CREATE CARD
============================================================ */


function createShikshanupakaranVillageCard(
    record
){



    const card =
        document.createElement(
            "article"
        );



    card.className =
        "shikshanupakaranVillageCard";



    card.dataset.id =
        record.id;




    const villageName =
        record.moje ||
        "Unnamed Village";



    const year =
        record.year ||
        "2025-2026";



    const rowCount =
        Array.isArray(
            record.rows
        )
        ?
        record.rows.length
        :
        0;




    let updatedText =
        "Not updated yet";



    if(record.updatedAt){


        const date =
            record.updatedAt.toDate
            ?
            record.updatedAt.toDate()
            :
            new Date(
                record.updatedAt
            );



        if(!isNaN(date)){


            updatedText =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day:"numeric",
                        month:"short",
                        year:"numeric"
                    }
                );

        }

    }





    card.innerHTML = `


        <div class="shikshanupakaranVillageCardHeader">


            <div class="shikshanupakaranVillageIcon">

                <i class="fa-solid fa-location-dot"></i>

            </div>



            <div class="shikshanupakaranVillageTitle">


                <h3>

                    ${escapeShikshanupakaranHTML(
                        villageName
                    )}

                </h3>


                <span>
                    Shikshanupakaran
                </span>


            </div>




            <div class="shikshanupakaranCardMenuWrapper">


                <button
                    class="shikshanupakaranCardMenuButton">


                    <i class="fa-solid fa-ellipsis-vertical"></i>


                </button>




                <div class="shikshanupakaranCardMenu">


                  <button
                      class="shikshanupakaranCardMenuItem download"
                      data-action="download">
              
              
                      <i class="fa-solid fa-download"></i>
              
              
                      Download
              
              
                  </button>
              
              
              
                  <button
                      class="shikshanupakaranCardMenuItem delete"
                      data-action="delete">
              
              
                      <i class="fa-solid fa-trash"></i>
              
              
                      Delete
              
              
                  </button>
              
              
              </div>


            </div>


        </div>





        <div class="shikshanupakaranVillageDetails">


            <div class="shikshanupakaranVillageDetail">


                <strong>

                    ${escapeShikshanupakaranHTML(
                        year
                    )}

                </strong>


            </div>




            <div class="shikshanupakaranVillageDetail">


                <span>
                    Records
                </span>


                <strong>
                    ${rowCount}
                </strong>


            </div>



        </div>






        <div class="shikshanupakaranVillageCardFooter">


            <span>


                <i class="fa-regular fa-clock"></i>


                Updated ${updatedText}


            </span>


        </div>



    `;





    card.addEventListener(

        "click",

        function(event){


            if(
                event.target.closest(
                    ".shikshanupakaranCardMenuWrapper"
                )
            ){

                return;

            }


            openShikshanupakaranRecord(
                record.id
            );


        }

    );





    setupShikshanupakaranCardMenu(
        card,
        record
    );



    return card;


}


/* ============================================================
        CARD MENU SETUP
============================================================ */


function setupShikshanupakaranCardMenu(
    card,
    record
){


    const menuButton =
        card.querySelector(
            ".shikshanupakaranCardMenuButton"
        );


    const menu =
        card.querySelector(
            ".shikshanupakaranCardMenu"
        );


    const deleteButton =
        card.querySelector(
            '[data-action="delete"]'
        );

    const downloadButton =
      card.querySelector(
          '[data-action="download"]'
      );



    if(menuButton){


        menuButton.addEventListener(

            "click",

            function(event){


                event.preventDefault();

                event.stopPropagation();



                document
                .querySelectorAll(
                    ".shikshanupakaranCardMenu.open"
                )
                .forEach(

                    function(item){

                        item.classList.remove(
                            "open"
                        );

                    }

                );



                menu.classList.toggle(
                    "open"
                );


            }

        );


    }





    if(deleteButton){


        deleteButton.addEventListener(

            "click",

            async function(event){


                event.preventDefault();

                event.stopPropagation();



                menu.classList.remove(
                    "open"
                );



                await deleteShikshanupakaranRecord(
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


            menu.classList.remove(
                "open"
            );


            await downloadShikshanupakaranPDF(
                record
            );


        }

    );


}

}


/* ============================================================
        ESCAPE HTML
============================================================ */


function escapeShikshanupakaranHTML(value){


    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");


}


/* ============================================================
   DELETE SHIKSHANUPAKARAN RECORD
   ============================================================ */

async function deleteShikshanupakaranRecord(record){

    if(
        !record ||
        !record.id
    ){

        alert(
            "Unable to delete record."
        );

        return;

    }


    const villageName =
        record.moje ||
        "this village";


    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${villageName}"?`
        );


    if(!confirmDelete){

        return;

    }


    try{

        console.log(
            "DELETE START:",
            record.id
        );


        /*
            ------------------------------------------------
            DELETE DIRECTLY FROM FIRESTORE
            ------------------------------------------------
        */

        await db
            .collection("shikshanupakarans")
            .doc(record.id)
            .delete();


        console.log(
            "FIRESTORE DELETE SUCCESS:",
            record.id
        );


        /*
            ------------------------------------------------
            REMOVE FROM LOCAL ARRAY
            ------------------------------------------------
        */

        shikshanupakaranRecords =
            shikshanupakaranRecords.filter(
                function(item){

                    return item.id !== record.id;

                }
            );


        /*
            ------------------------------------------------
            CLEAR CURRENT RECORD IF IT WAS THE SAME ONE
            ------------------------------------------------
        */

        if(
            currentShikshanupakaranDocumentId ===
            record.id
        ){

            currentShikshanupakaranDocumentId =
                null;

            currentShikshanupakaranRecord =
                null;

        }


        /*
            ------------------------------------------------
            RE-RENDER CARDS
            ------------------------------------------------
        */

        renderShikshanupakaranManagement();


        console.log(
            "SHIKSHANUPAKARAN DELETED:",
            record.id
        );


    }

    catch(error){

        console.error(
            "SHIKSHANUPAKARAN DELETE ERROR:",
            error
        );


        alert(
            "Unable to delete Shikshanupakaran."
        );

    }

}




/* ============================================================
        CLOSE CARD MENUS OUTSIDE CLICK
============================================================ */


document.addEventListener(

    "click",

    function(event){


        if(
            event.target.closest(
                ".shikshanupakaranCardMenuWrapper"
            )
        ){

            return;

        }



        document
        .querySelectorAll(
            ".shikshanupakaranCardMenu.open"
        )
        .forEach(

            function(menu){

                menu.classList.remove(
                    "open"
                );

            }

        );


    }

);

/* ============================================================
        START NEW SHIKSHANUPAKARAN
============================================================ */

function startNewShikshanupakaran(){

    currentShikshanupakaranRecord = null;

    currentShikshanupakaranDocumentId = null;


    const currentYear =
        getCurrentShikshanupakaranYear();


    const editorYear =
        document.getElementById(
            "shikshanupakaranEditorYear"
        );


    if(editorYear){

        editorYear.textContent =
            currentYear;

    }


    const printYear =
        document.getElementById(
            "printYear"
        );


    if(printYear){

        printYear.textContent =
            currentYear;

    }


    const title =
        document.getElementById(
            "shikshanupakaranEditorVillageName"
        );


    if(title){

        title.textContent =
            "New Shikshanupakaran";

    }


    /*
        IMPORTANT:

        Your HTML uses:

        #printMoje
        #printTaluka
        #printJillo

        There are no #shikshanupakaranMoje
        input elements.
    */


    const moje =
        document.getElementById(
            "printMoje"
        );


    const taluka =
        document.getElementById(
            "printTaluka"
        );


    const jillo =
        document.getElementById(
            "printJillo"
        );


    if(moje){

        moje.textContent = "";

    }


    if(taluka){

        taluka.textContent = "";

    }


    if(jillo){

        jillo.textContent = "";

    }


    clearShikshanupakaranRows();


    addInitialShikshanupakaranRow();


    openShikshanupakaranEditor();


    /*
        Start watching this new record
        for automatic saving.
    */

    initializeShikshanupakaranAutoSave();

}

/* ============================================================
        OPEN EDITOR
============================================================ */


function openShikshanupakaranEditor(){


    hideAllShikshanupakaranViews();



    if(
        shikshanupakaranEditorViewElement
    ){


        shikshanupakaranEditorViewElement.style.display =
            "block";


    }



    window.scrollTo(
        0,
        0
    );



    console.log(
        "Shikshanupakaran editor opened"
    );


}


/* ============================================================
        BACK BUTTON
============================================================ */


if(
    backToShikshanupakaranManagementButton
){


    backToShikshanupakaranManagementButton.addEventListener(

        "click",

        async function(){


            await openShikshanupakaranManagement();


        }

    );


}



/* ============================================================
        ADD BUTTONS
============================================================ */


if(
    addShikshanupakaranButton
){


    addShikshanupakaranButton.addEventListener(

        "click",

        function(){


            startNewShikshanupakaran();


        }

    );


}



if(
    emptyAddShikshanupakaranButton
){


    emptyAddShikshanupakaranButton.addEventListener(

        "click",

        function(){


            startNewShikshanupakaran();


        }

    );


}

/* ============================================================
        SHIKSHANUPAKARAN EDITOR SYSTEM
        ROW MANAGEMENT
============================================================ */


/* ============================================================
        ELEMENT REFERENCES
============================================================ */


const shikshanupakaranBody =
    document.getElementById(
        "shikshanupakaranBody"
    );


const addShikshanupakaranRowButton =
    document.getElementById(
        "addShikshanupakaranRow"
    );



const saveShikshanupakaranButton =
    document.getElementById(
        "saveShikshanupakaranButton"
    );


const printShikshanupakaranButton =
    document.getElementById(
        "printShikshanupakaranButton"
    );


/* ============================================================
        SHIKSHANUPAKARAN PRINT
============================================================ */

/* ============================================================
   SHIKSHANUPAKARAN PRINT PREPARATION
   EXACT EDITOR LOOK
   20 USER ROWS PER PAGE
   LAST ACTION / DELETE COLUMN HIDDEN
============================================================ */

function prepareShikshanupakaranPrint(sourceRows){

    const table =
        document.getElementById(
            "shikshanupakaranTable"
        );

    const tbody =
        document.getElementById(
            "shikshanupakaranBody"
        );

    const container =
        document.getElementById(
            "shikshanupakaranPrintContainer"
        );


    if(
        !table ||
        !tbody ||
        !container
    ){

        console.warn(
            "Shikshanupakaran print elements not found."
        );

        return;

    }


    /*
        ----------------------------------------
        REMOVE OLD PRINT PAGES
        ----------------------------------------
    */

    container
        .querySelectorAll(
            ".shikshanupakaranPrintPage"
        )
        .forEach(function(page){

            page.remove();

        });


    /*
        ----------------------------------------
        GET ONLY REAL USER ROWS
        ----------------------------------------
    */

    const userRows =
        Array.from(
            tbody.querySelectorAll(
                "tr.shikshanupakaranRow"
            )
        );

      console.log(
        "PRINT ROWS FOUND:",
        userRows.length,
        userRows
    );

    /*
        ----------------------------------------
        EXACTLY 20 ROWS PER PAGE
        ----------------------------------------
    */

    const rowsPerPage = 20;


    /*
        ----------------------------------------
        EVEN IF EMPTY,
        CREATE ONE PRINT PAGE
        ----------------------------------------
    */

    if(userRows.length === 0){

        createShikshanupakaranPrintPage(
            [],
            1,
            container,
            table
        );

        return;

    }


    const totalPages =
        Math.ceil(
            userRows.length /
            rowsPerPage
        );


    /*
        ----------------------------------------
        CREATE EACH PRINT PAGE
        ----------------------------------------
    */

    for(
        let pageNumber = 0;
        pageNumber < totalPages;
        pageNumber++
    ){

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


        createShikshanupakaranPrintPage(
            pageRows,
            pageNumber + 1,
            container,
            table
        );

    }

}




/* ============================================================
   CREATE ONE SHIKSHANUPAKARAN PRINT PAGE
   SAME STRUCTURE AS EDITOR
   ACTION / DELETE COLUMN REMOVED
============================================================ */

function createShikshanupakaranPrintPage(
    sourceRows,
    pageNumber,
    container,
    originalTable
){

    /*
        ----------------------------------------
        CREATE PRINT PAGE
        ----------------------------------------
    */

    const page =
        document.createElement("div");


    page.className =
        "shikshanupakaranPrintPage";


    page.dataset.page =
        pageNumber;


    /*
        ----------------------------------------
        CLONE ONLY THE TABLE STRUCTURE
        ----------------------------------------
    */

    const printTable =
        originalTable.cloneNode(true);


    printTable.removeAttribute("id");


    printTable.classList.add(
        "shikshanupakaranPrintTable"
    );

        /* ----------------------------------------
         REMOVE ALL PRINT-HIDDEN COLUMNS
      ---------------------------------------- */
      
      printTable
          .querySelectorAll(
              ".printHide"
          )
          .forEach(function(element){
      
              element.remove();
      
          });
    
    /*
        ----------------------------------------
        GET TBODY
        ----------------------------------------
    */

    const printTbody =
        printTable.querySelector("tbody");


    if(!printTbody){

        console.error(
            "Print tbody not found."
        );

        return;

    }


    /*
        ----------------------------------------
        REMOVE ALL EXISTING EDITOR ROWS
        ----------------------------------------
    */

    printTbody.innerHTML = "";


    /*
        ----------------------------------------
        ADD ONLY THE 20 ROWS FOR THIS PAGE
        ----------------------------------------
    */

    sourceRows.forEach(function(sourceRow){

        const clonedRow =
            sourceRow.cloneNode(true);

          
          console.log(
              "PRINT CLONED INPUT VALUES:",
              Array.from(
                  clonedRow.querySelectorAll("input")
              ).map(function(input){
                  return input.value;
              })
          );


      const actionCell =
            clonedRow.querySelector(
                ".shikshanupakaranActionCell"
            );
        
        if(actionCell){
            actionCell.remove();
        }

                
                        
        /* ------------------------------------
           REMOVE BAKI + FAJAL CELLS
           BEFORE INPUTS ARE CONVERTED
        ------------------------------------ */
        
        clonedRow
            .querySelectorAll(
                'input[data-column="R"], input[data-column="S"]'
            )
            .forEach(function(input){
        
                const cell =
                    input.closest("td");
        
                if(cell){
                    cell.remove();
                }
        
            });
        
        
        /*
            ------------------------------------
            CONVERT INPUTS TO PRINTABLE TEXT
            ------------------------------------
        */
        
        clonedRow
            .querySelectorAll("input")
            .forEach(function(input){
        
                const td =
                    input.closest("td");
        
                if(td){
        
                    td.textContent =
                        input.value || "";
        
                }
        
            });
      

      

        clonedRow
            .querySelectorAll("button")
            .forEach(function(button){

                button.remove();

            });

        printTbody.appendChild(
            clonedRow
        );

      });

      /* ----------------------------------------
         PAGE NUMBER
      ---------------------------------------- */
      
      const pageNumberElement =
          document.createElement("div");
      
      pageNumberElement.className =
          "shikshanupakaranPrintPageNumber";
      
      pageNumberElement.textContent =
          `Page ${pageNumber}`;
      
      
      /* ----------------------------------------
         PAGE FOOTER
      ---------------------------------------- */
      
      const pageFooter =
          document.createElement("div");
      
      pageFooter.className =
          "shikshanupakaranPrintFooter";
      
      pageFooter.appendChild(
          pageNumberElement
      );
      
      
      /* ----------------------------------------
         ADD TABLE + FOOTER
      ---------------------------------------- */
      
      page.appendChild(
          printTable
      );
      
      page.appendChild(
          pageFooter
      );
      
      
      /* ----------------------------------------
         DEBUG
      ---------------------------------------- */
      
      console.log(
          "PRINT PAGE",
          pageNumber,
          "ROWS:",
          printTbody.querySelectorAll("tr").length
      );
      
      
      /* ----------------------------------------
         ADD PAGE TO CONTAINER
      ---------------------------------------- */
      
      container.appendChild(
          page
      );
}



if(printShikshanupakaranButton){

    printShikshanupakaranButton.addEventListener(

        "click",

        async function(){

            /*
                ----------------------------------------
                STOP PENDING AUTOSAVE TIMER
                ----------------------------------------
            */

            if(shikshanupakaranAutoSaveTimer){

                clearTimeout(
                    shikshanupakaranAutoSaveTimer
                );

                shikshanupakaranAutoSaveTimer =
                    null;

            }


            /*
                ----------------------------------------
                WAIT FOR ANY CURRENT AUTOSAVE
                TO FINISH
                ----------------------------------------
            */

            while(shikshanupakaranIsSaving){

                await new Promise(
                    function(resolve){

                        setTimeout(
                            resolve,
                            50
                        );

                    }
                );

            }


    

            /*
                  ----------------------------------------
                  PREPARE PRINT PAGES
                  BEFORE SAVE RE-RENDERS THE EDITOR
                  ----------------------------------------
              */
              
              prepareShikshanupakaranPrint();
              
              
            /*
                ----------------------------------------
                GET PRINT CONTAINER
                ----------------------------------------
            */

            const printContainer =
                document.getElementById(
                    "shikshanupakaranPrintContainer"
                );


            if(!printContainer){

                console.error(
                    "Shikshanupakaran print container not found."
                );

                return;

            }


            /*
                ----------------------------------------
                CREATE TEMPORARY IFRAME
                ----------------------------------------
            */

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


            /*
                ----------------------------------------
                GET IFRAME DOCUMENT
                ----------------------------------------
            */

            const iframeDocument =
                iframe.contentDocument ||
                iframe.contentWindow.document;


            /*
                ----------------------------------------
                COPY PRINT CSS
                ----------------------------------------
            */

            const printStyles =
                Array.from(
                    document.querySelectorAll(
                        'style[data-shikshanupakaran-print]'
                    )
                )
                .map(function(style){

                    return style.outerHTML;

                })
                .join("");


            iframe.onload =
            function(){

                setTimeout(
                    function(){

                        iframe.contentWindow.focus();

                        iframe.contentWindow.print();


                        setTimeout(
                            function(){

                                iframe.remove();

                            },
                            1000
                        );

                    },
                    300
                );

            };


            iframeDocument.open();


            iframeDocument.write(`
                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <title>
                        Shikshanupakaran Print
                    </title>

                    ${printStyles}

                </head>

                <body>

                    ${Array.from(
                        printContainer.querySelectorAll(
                            ".shikshanupakaranPrintPage"
                        )
                    )
                    .map(function(page){

                        return page.outerHTML;

                    })
                    .join("")}

                </body>

                </html>
            `);


            iframeDocument.close();

        }

    );

}



/* ============================================================
        CLEAR ROWS
============================================================ */


function clearShikshanupakaranRows(){


    if(!shikshanupakaranBody){

        return;

    }


    shikshanupakaranBody.innerHTML =
        "";

}

/* ============================================================
   CREATE SHIKSHANUPAKARAN FROM TALAPATRAK
============================================================ */


async function createShikshanupakaranFromTalapatrak(
    talapatrakData
){

    try{


        if(!auth.currentUser){

            console.warn(
                "User not logged in"
            );

            return;

        }



        const moje =
            talapatrakData.moje || "";


        const taluka =
            talapatrakData.taluka || "";


        const jillo =
            talapatrakData.jillo || "";


        const year =
            talapatrakData.year ||
            getCurrentShikshanupakaranYear();




        if(!moje){

            console.warn(
                "Village name missing"
            );

            return;

        }




        const documentId =
            getShikshanupakaranDocumentId(
                moje,
                year
            );





        const shikshanupakaranRef =
            db
            .collection(
                "shikshanupakarans"
            )
            .doc(
                documentId
            );





        const existing =
            await shikshanupakaranRef.get();





        let rows = [];



        /*
            If already exists,
            keep existing rows
        */

        if(existing.exists){


            rows =
                existing.data().rows || [];


        }







        /*
            Add Talapatrak rows
            into Shikshanupakaran
        */


        const talapatrakRows =
            talapatrakData.rows || [];





        talapatrakRows.forEach(
            function(tRow){



                const alreadyExists =
                    rows.some(
                        function(sRow){


                            return (

                                sRow.B === tRow.B

                            );


                        }
                    );





                if(!alreadyExists){



                    rows.push({

                        A:
                        rows.length + 1,


                        B:
                        tRow.B || "",


                        C:"",
                        D:"",
                        E:"",
                        F:"",
                        G:"0.00",
                        H:"",
                        I:"",
                        J:"",
                        K:"",
                        L:"",
                        M:"0.00",
                        N:"0.00",
                        O:"0.00",
                        P:"0.00",
                        Q:"",
                        R:"0.00",
                        S:"0.00",
                        T:""

                    });



                }



            }
        );









        await shikshanupakaranRef.set(

            {


                type:
                "shikshanupakaran",



                moje:
                moje,



                taluka:
                taluka,



                jillo:
                jillo,



                year:
                year,



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


            },

            {
                merge:true
            }

        );






        console.log(
            "Shikshanupakaran auto created:",
            documentId
        );



    }



    catch(error){


        console.error(
            "Auto Shikshanupakaran creation error:",
            error
        );


    }


}

/* ============================================================
ADD ROW BUTTON
============================================================ */
if(addShikshanupakaranRowButton){

    addShikshanupakaranRowButton.addEventListener(

        "click",

        function(){

            const row =
                createShikshanupakaranRow();


            if(!row){

                return;

            }


            const serialInput =
                row.querySelector(
                    '[data-column="A"]'
                );


            if(serialInput){

                serialInput.value =
                    getNextShikshanupakaranSerial();

            }


            /*
                Save after row is added.
            */

            scheduleShikshanupakaranAutoSave();

        }

    );

}
  
/* ============================================================
        SHIKSHANUPAKARAN SAVE SYSTEM
============================================================ */


/* ============================================================
        DYNAMIC YEAR
============================================================ */


function getCurrentShikshanupakaranYear(){


    const today =
        new Date();



    const year =
        today.getFullYear();



    const month =
        today.getMonth();



    if(month >= 7){

        return `${year}-${year + 1}`;

    }


    return `${year - 1}-${year}`;


}


/* ============================================================
        AUTO CREATE NEW YEAR SHIKSHANUPAKARAN
============================================================ */


async function createNewYearShikshanupakaranRecords(){

    try{

        /*
            ----------------------------------------
            CHECK LOGIN
            ----------------------------------------
        */

        if(
            !auth ||
            !auth.currentUser
        ){

            return;

        }


        /*
            ----------------------------------------
            ONLY RUN ON AUGUST 1
            ----------------------------------------
        */

        const today =
            new Date();

        const month =
            today.getMonth(); // August = 7

        const date =
            today.getDate();


        if(
            month !== 7 ||
            date !== 1
        ){

            console.log(
                "New year Shikshanupakaran creation skipped. Today is not August 1."
            );

            return;

        }


        /*
            ----------------------------------------
            CURRENT FINANCIAL YEAR
           
            On August 1, 2026:
            currentYear = 2026-2027
            nextYear    = 2027-2028
            ----------------------------------------
        */

        const currentCalendarYear =
            today.getFullYear();


        const currentYear =
            `${currentCalendarYear}-${currentCalendarYear + 1}`;


        const nextYear =
            `${currentCalendarYear + 1}-${currentCalendarYear + 2}`;


        console.log(
            "Year rollover:",
            currentYear,
            "→",
            nextYear
        );


        /*
            ----------------------------------------
            LOAD USER RECORDS
            ----------------------------------------
        */

        const snapshot =
            await db
            .collection("shikshanupakarans")
            .where(
                "userId",
                "==",
                auth.currentUser.uid
            )
            .get();


        const records = [];


        snapshot.forEach(function(doc){

            records.push({

                id:
                    doc.id,

                ...doc.data()

            });

        });


        /*
            ----------------------------------------
            IMPORTANT:
            ONLY USE THE CURRENT YEAR RECORDS.
            
            We DO NOT loop through every old year.
            
            This prevents:
            
            2026-2027
                ↓
            2027-2028
                ↓
            2028-2029
            
            from being created accidentally.
            ----------------------------------------
        */

        const currentYearRecords =
            records.filter(function(record){

                return record.year === currentYear;

            });


        /*
            ----------------------------------------
            CREATE NEXT YEAR ONLY IF MISSING
            ----------------------------------------
        */

        for(
            const record of currentYearRecords
        ){

            const moje =
                String(
                    record.moje || ""
                ).trim();


            if(!moje){

                continue;

            }


            /*
                ------------------------------------
                NEXT YEAR DOCUMENT ID
                ------------------------------------
            */

            const nextDocumentId =
                getShikshanupakaranDocumentId(
                    moje,
                    nextYear
                );


            const nextYearRef =
                db
                .collection(
                    "shikshanupakarans"
                )
                .doc(
                    nextDocumentId
                );


            /*
                ------------------------------------
                CHECK:
                IF NEXT YEAR ALREADY EXISTS,
                DO ABSOLUTELY NOTHING.
                ------------------------------------
            */

            const existingNextYear =
                await nextYearRef.get();


            if(existingNextYear.exists){

                console.log(
                    "Next year already exists. Skipping:",
                    moje,
                    nextYear
                );

                continue;

            }


            /*
                ------------------------------------
                CREATE DUPLICATE FROM CURRENT YEAR
                ------------------------------------
            */

            const newRows =
                Array.isArray(record.rows)
                ?
                record.rows.map(function(row){

                    return {

                        ...row,

                        /*
                            Old O → New C
                        */

                        C:
                            row.O || "",


                        /*
                            Old P → New L
                        */

                        L:
                            row.P || ""

                    };

                })
                :
                [];


            /*
                ------------------------------------
                NEW RECORD
                ------------------------------------
            */

            const newData = {

                type:
                    "shikshanupakaran",


                moje:
                    record.moje || "",


                taluka:
                    record.taluka || "",


                jillo:
                    record.jillo || "",


                year:
                    nextYear,


                rows:
                    newRows,


                rowCount:
                    newRows.length,


                userId:
                    auth.currentUser.uid,


                userEmail:
                    auth.currentUser.email,


                updatedAt:
                    firebase.firestore.FieldValue
                    .serverTimestamp()

            };


            /*
                ------------------------------------
                CREATE ONLY IF IT DOES NOT EXIST
                ------------------------------------
            */

            await nextYearRef.set(
                newData
            );


            console.log(
                "Created next year:",
                moje,
                `${currentYear} → ${nextYear}`
            );

        }


    }

    catch(error){

        console.error(
            "Year rollover error:",
            error
        );

    }

}

/* ============================================================
        DOCUMENT ID
============================================================ */


function getShikshanupakaranDocumentId(
    moje,
    year
){


    return `${moje}_${year}`;

}


/* ============================================================
        SAVE FUNCTION
============================================================ */
async function saveShikshanupakaran(
    showMessage = true
){

    shikshanupakaranSaveAttemptCount++;

    console.log(
        "========================================"
    );

    console.log(
        "SAVE ATTEMPT:",
        shikshanupakaranSaveAttemptCount
    );

    console.log(
        "Manual Save:",
        showMessage
    );

    console.log(
        "Is Saving:",
        shikshanupakaranIsSaving
    );

    console.log(
        "========================================"
    );


    try{

        /*
            ----------------------------------------
            CHECK LOGIN
            ----------------------------------------
        */

        if(
            !auth ||
            !auth.currentUser
        ){

            if(showMessage){

                alert(
                    "Please login first."
                );

            }

            return false;

        }


        /*
            ----------------------------------------
            GET HEADER FIELDS

            IMPORTANT:
            These are CONTENTEDITABLE spans
            in your HTML.
            ----------------------------------------
        */

        const mojeElement =
            document.getElementById(
                "printMoje"
            );


        const talukaElement =
            document.getElementById(
                "printTaluka"
            );


        const jilloElement =
            document.getElementById(
                "printJillo"
            );


        /*
            ----------------------------------------
            SAFETY CHECK
            ----------------------------------------
        */

        if(!mojeElement){

            console.error(
                "printMoje element not found."
            );

            return false;

        }


        if(!talukaElement){

            console.error(
                "printTaluka element not found."
            );

            return false;

        }


        if(!jilloElement){

            console.error(
                "printJillo element not found."
            );

            return false;

        }


        /*
            ----------------------------------------
            READ VALUES
            ----------------------------------------
        */

        const moje =
            mojeElement.textContent
                .trim();


        const taluka =
            talukaElement.textContent
                .trim();


        const jillo =
            jilloElement.textContent
                .trim();


        /*
            ----------------------------------------
            VILLAGE IS REQUIRED
            ----------------------------------------
        */

        if(!moje){

            if(showMessage){

                alert(
                    "Please enter મોજે."
                );

                mojeElement.focus();

            }

            return false;

        }


        /*
            ----------------------------------------
            YEAR
            ----------------------------------------
        */

        const year =
            currentShikshanupakaranRecord?.year
            ||
            getCurrentShikshanupakaranYear();


        /*
            ----------------------------------------
            COLLECT TABLE ROWS
            ----------------------------------------
        */

        const rows =
            collectShikshanupakaranRows();




      // ============================================================
        // CHECK WHETHER EXACT SAME DATA WAS ALREADY SAVED
        // ============================================================
        
        const saveSignature =
            getShikshanupakaranSaveSignature(
                moje,
                taluka,
                jillo,
                year,
                rows
            );
        
        
        console.log(
            "CURRENT SAVE SIGNATURE:",
            saveSignature
        );
        
        
        console.log(
            "LAST SAVED SIGNATURE:",
            shikshanupakaranLastSavedSignature
        );
        
        
        // ------------------------------------------------------------
        // SAME DATA ALREADY SAVED
        // ------------------------------------------------------------
        
        if(
            shikshanupakaranLastSavedSignature ===
            saveSignature
        ){
        
            shikshanupakaranSkippedSaveCount++;
        
            console.log(
                "🟡 SAVE SKIPPED — NOTHING CHANGED"
            );
        
            console.log(
                "Skipped save count:",
                shikshanupakaranSkippedSaveCount
            );
        
            return true;
        
        }
        /*
            ----------------------------------------
            DOCUMENT ID
            ----------------------------------------
        */

        const documentId =
            getShikshanupakaranDocumentId(
                moje,
                year
            );


        /*
            ----------------------------------------
            DETERMINE WHETHER THIS IS NEW
            ----------------------------------------
        */

        const wasExistingRecord =
            !!currentShikshanupakaranRecord;


        /*
            ----------------------------------------
            DATA
            ----------------------------------------
        */

        const data = {

            type:
                "shikshanupakaran",

            moje:
                moje,

            taluka:
                taluka,

            jillo:
                jillo,

            year:
                year,

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
            ----------------------------------------
            SAVE TO FIRESTORE
            ----------------------------------------
        */

        await db

            .collection(
                "shikshanupakarans"
            )

            .doc(
                documentId
            )

            .set(
                data,
                {
                    merge: true
                }
            );
            
            // ============================================================
            // FIRESTORE SAVE SUCCESS FLAG
            // ============================================================
            
            shikshanupakaranActualFirestoreSaveCount++;
            
            shikshanupakaranLastSavedSignature =
                saveSignature;
            
            
            console.log(
                "🟢 ACTUAL FIRESTORE SAVE COMPLETED"
            );
            
            console.log(
                "Firestore save count:",
                shikshanupakaranActualFirestoreSaveCount
            );
            
            console.log(
                "Saved document:",
                documentId
            );

      
        /*
            ----------------------------------------
            UPDATE CURRENT STATE
            ----------------------------------------
        */

        currentShikshanupakaranDocumentId =
            documentId;


        currentShikshanupakaranRecord = {

            id:
                documentId,

            ...data

        };


        /*
            ----------------------------------------
            UPDATE EDITOR TITLE
            ----------------------------------------
        */

        const title =
            document.getElementById(
                "shikshanupakaranEditorVillageName"
            );


        if(title){

            title.textContent =
                moje;

        }


        /*
            ----------------------------------------
            UPDATE MANAGEMENT ARRAY

            This makes the card update immediately
            without needing a full page refresh.
            ----------------------------------------
        */

        const existingIndex =
            shikshanupakaranRecords.findIndex(
                function(record){

                    return record.id === documentId;

                }
            );


        const savedRecord = {

            id:
                documentId,

            ...data

        };


        if(existingIndex >= 0){

            shikshanupakaranRecords[
                existingIndex
            ] =
                savedRecord;

        }
        else{

            shikshanupakaranRecords.push(
                savedRecord
            );

        }


        /*
            ----------------------------------------
            ACTIVITY

            ONLY CREATE ACTIVITY FOR EXPLICIT
            USER SAVE / FIRST CREATION.

            Autosave will NOT spam activities.
            ----------------------------------------
        */

        if(showMessage){

            await addShikshanupakaranActivity(

                wasExistingRecord
                    ? "shikshanupakaran_updated"
                    : "shikshanupakaran_added",

                wasExistingRecord
                    ? "Shikshanupakaran updated"
                    : "New Shikshanupakaran created",

                `${moje} Shikshanupakaran saved successfully`,

                moje

            );

        }


        /*
            ----------------------------------------
            REFRESH MANAGEMENT
            ----------------------------------------
        */

        renderShikshanupakaranManagement();


        /*
            ----------------------------------------
            USER MESSAGE ONLY FOR MANUAL SAVE
            ----------------------------------------
        */

        if(showMessage){

            alert(
                `${moje} Shikshanupakaran saved successfully.`
            );

        }


        console.log(
            "Shikshanupakaran saved:",
            documentId
        );


        return true;


    }

    catch(error){

        console.error(
            "Shikshanupakaran save error:",
            error
        );


        if(showMessage){

            alert(
                "Unable to save Shikshanupakaran."
            );

        }


        return false;

    }

}



/* ============================================================
   SHIKSHANUPAKARAN AUTO SAVE SYSTEM
   ============================================================ */

let shikshanupakaranAutoSaveTimer = null;

let shikshanupakaranAutoSaveInitialized = false;

let shikshanupakaranIsSaving = false;

let shikshanupakaranJustManuallySaved = false;

// ============================================================
// SAVE DEBUG FLAGS
// ============================================================

let shikshanupakaranLastSavedSignature = null;

let shikshanupakaranSaveAttemptCount = 0;

let shikshanupakaranActualFirestoreSaveCount = 0;

let shikshanupakaranSkippedSaveCount = 0;

/* ============================================================
   SCHEDULE AUTO SAVE
   ============================================================ */

function scheduleShikshanupakaranAutoSave(){

    /*
        Clear previous timer.
    */

    if(
        shikshanupakaranAutoSaveTimer
    ){

        clearTimeout(
            shikshanupakaranAutoSaveTimer
        );

    }


    /*
        Wait 1 second after the user's
        last change before saving.
    */

    shikshanupakaranAutoSaveTimer =
        setTimeout(

            async function(){

                await autoSaveShikshanupakaran();

            },

            1000

        );

}


// ============================================================
// CREATE SAVE SIGNATURE
// Used to detect whether data has actually changed.
// ============================================================

function getShikshanupakaranSaveSignature(
    moje,
    taluka,
    jillo,
    year,
    rows
){

    return JSON.stringify({

        moje: moje,

        taluka: taluka,

        jillo: jillo,

        year: year,

        rows: rows

    });

}


/* ============================================================
   AUTO SAVE
   ============================================================ */

async function autoSaveShikshanupakaran(){
    
      if(shikshanupakaranJustManuallySaved){
    
        shikshanupakaranJustManuallySaved = false;
    
        console.log(
            "Autosave skipped after manual save."
        );
    
        return;
    
    }
    /*
        Prevent simultaneous saves.
    */

    if(
        shikshanupakaranIsSaving
    ){

        return;

    }


    /*
        No logged-in user.
    */

    if(
        !auth ||
        !auth.currentUser
    ){

        return;

    }


    /*
        Get village name.

        A new document cannot be created
        until the village name exists.
    */

    const mojeElement =
        document.getElementById(
            "printMoje"
        );


    if(!mojeElement){

        return;

    }


    const moje =
        mojeElement.textContent
            .trim();


    /*
        Don't autosave an unnamed
        new record.
    */

    if(!moje){

        return;

    }


    try{

        shikshanupakaranIsSaving =
            true;


        console.log(
            "Shikshanupakaran AUTO SAVE..."
        );


        /*
            false = NO alert
            false = NO activity entry
        */

        await saveShikshanupakaran(
            false
        );


        console.log(
            "Shikshanupakaran AUTO SAVED."
        );


    }

    catch(error){

        console.error(
            "Shikshanupakaran autosave error:",
            error
        );

    }

    finally{

        shikshanupakaranIsSaving =
            false;

    }

}


/* ============================================================
   INITIALIZE AUTO SAVE
   ============================================================ */

function initializeShikshanupakaranAutoSave(){

    if(
        shikshanupakaranAutoSaveInitialized
    ){

        return;

    }


    shikshanupakaranAutoSaveInitialized =
        true;


    /*
        ----------------------------------------
        HEADER FIELDS
        ----------------------------------------
    */

    const headerFields = [

        document.getElementById(
            "printMoje"
        ),

        document.getElementById(
            "printTaluka"
        ),

        document.getElementById(
            "printJillo"
        )

    ];


    headerFields.forEach(
        function(field){

            if(!field){

                return;

            }


            field.addEventListener(
                "input",
                function(){

                    scheduleShikshanupakaranAutoSave();

                }
            );


            field.addEventListener(
                "blur",
                function(){

                    scheduleShikshanupakaranAutoSave();

                }
            );

        }
    );


    /*
        ----------------------------------------
        TABLE
        ----------------------------------------
    */

    if(
        shikshanupakaranBody
    ){

        shikshanupakaranBody.addEventListener(

            "input",

            function(event){

                if(
                    event.target.matches(
                        "input"
                    )
                ){

                    scheduleShikshanupakaranAutoSave();

                }

            }

        );


        /*
            Catch row deletion.
        */

        shikshanupakaranBody.addEventListener(

            "click",

            function(event){

                if(
                    event.target.closest(
                        ".deleteShikshanupakaranRow"
                    )
                ){

                    /*
                        Wait until the row has
                        actually been removed.
                    */

                    setTimeout(

                        function(){

                            scheduleShikshanupakaranAutoSave();

                        },

                        50

                    );

                }

            }

        );

    }


    /*
        ----------------------------------------
        ADD ROW
        ----------------------------------------
    */

    if(
        addShikshanupakaranRowButton
    ){

        addShikshanupakaranRowButton.addEventListener(

            "click",

            function(){

                setTimeout(

                    function(){

                        scheduleShikshanupakaranAutoSave();

                    },

                    50

                );

            }

        );

    }


    console.log(
        "Shikshanupakaran auto-save initialized."
    );

}

/* ============================================================
        OPEN EXISTING RECORD
============================================================ */


async function openShikshanupakaranRecord(
    documentId
){


    try{


        const snapshot =

            await db

            .collection(
                "shikshanupakarans"
            )

            .doc(
                documentId
            )

            .get();





        if(
            !snapshot.exists
        ){


            alert(
                "Record not found."
            );


            return;


        }



        const data =
            snapshot.data();

      const title =
            document.getElementById(
                "shikshanupakaranEditorVillageName"
            );
        
        
        if(title){
        
            title.textContent =
                data.moje || "Shikshanupakaran";
        
        }
      
        document.getElementById(
            "shikshanupakaranEditorYear"
        ).textContent =
            data.year;
        
        const printYear =
            document.getElementById("printYear");
        
        if(printYear){
            printYear.textContent = data.year;
        }
            



        currentShikshanupakaranRecord = {


            id:
                documentId,


            ...data


        };


        currentShikshanupakaranDocumentId =
            documentId;


        openShikshanupakaranEditor();



            const mojeElement =
              document.getElementById(
                  "printMoje"
              );
          
          
          const talukaElement =
              document.getElementById(
                  "printTaluka"
              );
          
          
          const jilloElement =
              document.getElementById(
                  "printJillo"
              );
          
          
          if(mojeElement){
          
              mojeElement.textContent =
                  data.moje || "";
          
          }
          
          
          if(talukaElement){
          
              talukaElement.textContent =
                  data.taluka || "";
          
          }
          
          
          if(jilloElement){
          
              jilloElement.textContent =
                  data.jillo || "";
          
          }






        clearShikshanupakaranRows();


      console.log(
    "CLEARING EDITOR ROWS"
);




        const rows =
            data.rows || [];


console.log(
    "ROWS LOADED FROM FIREBASE:",
    rows.length,
    rows
);


        if(rows.length){


            rows.forEach(

                function(rowData){
            
            
                    const row =
                        createShikshanupakaranRow(
                            rowData
                        );
            
            
                    calculateShikshanupakaranRow(
                        row
                    );
            
            
                }
            
            );


        }

        else{


            addInitialShikshanupakaranRow();


        }

          initializeShikshanupakaranAutoSave();


    }


    catch(error){


        console.error(
            "Open error:",
            error
        );


        alert(
            "Unable to open record."
        );


    }


}



/* ============================================================
        CLOSE SHIKSHANUPAKARAN CARD MENUS
============================================================ */


document.addEventListener(

    "click",

    function(event){



        if(

            event.target.closest(
                ".shikshanupakaranCardMenuWrapper"
            )

        ){

            return;

        }




        document
        .querySelectorAll(
            ".shikshanupakaranCardMenu.open"
        )
        .forEach(

            function(menu){

                menu.classList.remove(
                    "open"
                );

            }

        );


    }

);


console.log(
    "Shikshanupakaran delete system initialized."
);

/* ============================================================
        SHIKSHANUPAKARAN EDITOR SYSTEM
        NEW + OPEN EXISTING RECORD
============================================================ */

function createShikshanupakaranRow(rowData = {}) {

console.log(
    "CREATE ROW CALLED:",
    rowData
);
  
    const row =
        document.createElement("tr");


    row.className =
        "shikshanupakaranRow";



    const columns = [
        "A","B","C","D","E",
        "F","G","H","I","J",
        "K","L","M","N","O",
        "P","Q","R","S"
    ];



    let html = "";



    columns.forEach(function(col){


        let value =
            rowData[col] || "";

          const autoColumns = [
              "G",
              "M",
              "N",
              "O",
              "P",
              "R",
              "S"
          ];
          
          
          if(
              autoColumns.includes(col)
          ){
          
              value = "";
          
          }


        let readonly = "";



        let inputClass =
            "";  


        if(autoColumns.includes(col)){


            readonly =
                "readonly";


            inputClass =
                "autoColumn";


        }



        // DATE COLUMN I

        if(col === "I"){


            html += `

            <td>

                <input

                    type="text"

                    class="shikshanupakaranInput dateInput"

                    data-column="${col}"

                    value="${value}"

                    placeholder="DD/MM/YYYY"

                    ${readonly}

                >

            </td>

            `;


        }

        else{


            html += `

            <td>

                <input

                    type="text"

                    class="
                    shikshanupakaranInput
                    ${inputClass}
                    column-${col}
                    "

                    data-column="${col}"

                    value="${value}"

                    ${readonly}

                >

            </td>

            `;


        }


    });


  // ACTION BUTTON

    html += `

      <td class="shikshanupakaranActionCell printHide">
      
          <button
              type="button"
              class="addShikshanupakaranRowAfter printHide"
              title="Add Row">
      
              <i class="fa-solid fa-plus"></i>
      
          </button>
      
          <button
              type="button"
              class="deleteShikshanupakaranRow printHide"
              title="Delete Row">
      
              <i class="fa-solid fa-trash"></i>
      
          </button>
      
      </td>
      
      `;

    row.innerHTML =
        html;



    shikshanupakaranBody.appendChild(row);



    setupShikshanupakaranRowEvents(
        row
    );
    
    
    initializeFlatpickr(
        row
    );
    
    
    
    if(rowData){
    
        calculateShikshanupakaranRow(
            row
        );
    
    }
    
    
    
    return row;

}


function autoFillNextSerialNumber(row){

    const serialInput =
        row.querySelector('[data-column="A"]');


    if(!serialInput){
        return;
    }


    const startNumber =
        Number(serialInput.value) || 0;


    if(startNumber <= 0){
        return;
    }


    const allRows =
        document.querySelectorAll(
            ".shikshanupakaranRow"
        );


    let currentNumber =
        startNumber;


    let foundRow = false;


    allRows.forEach(function(currentRow){


        if(currentRow === row){

            foundRow = true;

        }


        if(foundRow){


            const input =
                currentRow.querySelector(
                    '[data-column="A"]'
                );


            if(input){

                input.value =
                    currentNumber;

                currentNumber++;

            }


        }


    });


}

function setupShikshanupakaranRowEvents(row){

    const inputs =
        row.querySelectorAll(
            "input"
        );


    inputs.forEach(function(input){

        input.addEventListener(
            "input",
            function(){

                calculateShikshanupakaranRow(row);

            }
        );

    });


    const serialInput =
        row.querySelector(
            '[data-column="A"]'
        );


    if(serialInput){

        serialInput.addEventListener(
            "change",
            function(){

                autoFillNextSerialNumber(row);

            }
        );

    }

    
      const addRowButton =
        row.querySelector(
            ".addShikshanupakaranRowAfter"
        );
        
        
        if(addRowButton){
        
            addRowButton.addEventListener(
                "click",
                function(){
        
                    /*
                        ----------------------------------------
                        CREATE NEW EMPTY ROW
                        ----------------------------------------
                    */
        
                    const newRow =
                        createShikshanupakaranRow({});
        
        
                    /*
                        ----------------------------------------
                        MOVE NEW ROW DIRECTLY BELOW
                        THE CURRENT ROW
                        ----------------------------------------
                    */
        
                    row.after(newRow);

                  renumberShikshanupakaranRows();
                    /*
                        ----------------------------------------
                        FOCUS FIRST INPUT
                        ----------------------------------------
                    */
        
                    const firstInput =
                        newRow.querySelector(
                            "input[data-column]"
                        );
        
        
                    if(firstInput){
        
                        firstInput.focus();
        
                    }
        
                }
            );
        
        }
  

    const deleteButton =
        row.querySelector(
            ".deleteShikshanupakaranRow"
        );


    if(deleteButton){

        deleteButton.addEventListener(
            "click",
            function(){

                row.remove();

                renumberShikshanupakaranRows();

                scheduleShikshanupakaranAutoSave();

            }
        );

    }

}

function renumberShikshanupakaranRows(){

    document
        .querySelectorAll(".shikshanupakaranRow")
        .forEach(function(row,index){

            const serial =
                row.querySelector('[data-column="A"]');

            if(serial){

                serial.value = index + 1;

            }

        });

}

function calculateShikshanupakaranRow(row){


    function get(col){

        const el =
            row.querySelector(
                `[data-column="${col}"]`
            );


        return Number(el?.value) || 0;

    }



    function set(col,value){


        const el =
            row.querySelector(
                `[data-column="${col}"]`
            );


        if(el){

            el.value =
                value.toFixed(2);

        }

    }



    const C = get("C");
    const D = get("D");
    const E = get("E");
    const F = get("F");


    const J = get("J");
    const K = get("K");
    const L = get("L");


    const Rvalue =
        get("R");



    // G = C+D+E+F

    set(
        "G",
        C+D+E+F
    );



    // M = J+K+L

    set(
        "M",
        J+K+L
    );



    const G =
        C+D+E+F;


    const M =
        J+K+L;



    // N = M-P

    set(
        "N",
        M-get("P")
    );



    // O = IF(R>0,R,0)

    set(
        "O",
        Rvalue>0
        ?
        Rvalue
        :
        0
    );



    // P = -S

    set(
        "P",
        -get("S")
    );



    // R = G-M

    set(
        "R",
        G-M
    );



    // S = IF(R<0,R,0)

    set(
        "S",
        Rvalue<0
        ?
        Rvalue
        :
        0
    );


}

function getNextShikshanupakaranSerial(){


    const rows =
        document.querySelectorAll(
            ".shikshanupakaranRow"
        );



    let max = 0;



    rows.forEach(function(row){


        const value =
            Number(
                row.querySelector(
                    '[data-column="A"]'
                )?.value
            )
            ||
            0;



        if(value > max){

            max=value;

        }


    });



    return max + 1;


}

function addInitialShikshanupakaranRow(){


    const row =
        createShikshanupakaranRow();



    const serialInput =
    row.querySelector('[data-column="A"]');


    serialInput.value =
        getNextShikshanupakaranSerial();



}

function formatShikshanupakaranNumbers(row){


    row.querySelectorAll(
        "input"
    )
    .forEach(function(input){


        const col =
            input.dataset.column;



        if(
            ["A","H"].includes(col)
        ){

            input.value =
                parseInt(input.value)
                ||
                "";

        }


        else if(
            [
                "G",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
            ].includes(col)
        ){

            input.value =
                Number(input.value)
                .toFixed(2);

        }



    });


}

function initializeFlatpickr(row){


    const dateInputs =
        row.querySelectorAll(
            ".dateInput"
        );



    dateInputs.forEach(function(input){


        flatpickr(
            input,
            {
                dateFormat:"d/m/Y",
                allowInput:true
            }
        );


    });


}

function createShikshanupakaranRowFromTalapatrak(talapatrakRow){


    return createShikshanupakaranRow({

        B:
        talapatrakRow.B

    });


}

function collectShikshanupakaranRows(){

    const rows =
        document.querySelectorAll(
            ".shikshanupakaranRow"
        );

    const data = [];

    rows.forEach(function(row){

        const inputs =
            row.querySelectorAll(
                "input[data-column]"
            );

        const rowData = {};

        let hasUserData = false;


        inputs.forEach(function(input){

            const column =
                input.dataset.column;

            let value =
                input.value.trim();


            /*
                ----------------------------------------
                CHECK WHETHER THIS ROW ACTUALLY
                CONTAINS USER DATA

                Auto-calculated columns are ignored.
                ----------------------------------------
            */

            const autoColumns = [
                "G",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
            ];


            if(
                !autoColumns.includes(column) &&
                value !== ""
            ){

                hasUserData = true;

            }


            /*
                ----------------------------------------
                INTEGER COLUMNS
                ----------------------------------------
            */

            if(
                column === "A" ||
                column === "H"
            ){

                value =
                    value
                    ?
                    parseInt(value)
                    :
                    "";

            }


            /*
                ----------------------------------------
                FINANCIAL COLUMNS
                ----------------------------------------
            */

            else if(
                [
                    "E",
                    "F",
                    "G",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T"
                ].includes(column)
            ){

                value =
                    value
                    ?
                    Number(value).toFixed(2)
                    :
                    "0.00";

            }


            rowData[column] =
                value;

        });


        /*
            ----------------------------------------
            IGNORE COMPLETELY EMPTY ROWS
            ----------------------------------------
        */

        if(!hasUserData){

            console.log(
                "🟡 EMPTY ROW SKIPPED FROM SAVE:",
                rowData
            );

            return;

        }


        /*
            ----------------------------------------
            KEEP ONLY REAL DATA ROW
            ----------------------------------------
        */

        data.push(
            rowData
        );

    });


    console.log(
        "ROWS COLLECTED FOR SAVE:",
        data.length,
        data
    );


    return data;
}
/* ============================================================
        BUTTON EVENTS
============================================================ */

if(addShikshanupakaranButton){


    addShikshanupakaranButton.addEventListener(

        "click",

        function(){

            startNewShikshanupakaran();

        }

    );


}


if(emptyAddShikshanupakaranButton){


    emptyAddShikshanupakaranButton.addEventListener(

        "click",

        function(){

            startNewShikshanupakaran();

        }

    );


}


/* ============================================================
        SAVE BUTTON EVENT
============================================================ */

if(saveShikshanupakaranButton){

    saveShikshanupakaranButton.onclick =
    async function(){

        if(
            saveShikshanupakaranButton.disabled
        ){

            return;

        }


        saveShikshanupakaranButton.disabled =
            true;


        saveShikshanupakaranButton.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Saving...
            </span>

        `;


        try{

            shikshanupakaranJustManuallySaved = true;

              await saveShikshanupakaran(
                  true
              );

        }

        finally{

            saveShikshanupakaranButton.disabled =
                false;


            saveShikshanupakaranButton.innerHTML = `

                <i class="fa-solid fa-floppy-disk"></i>

                <span>
                    Save
                </span>

            `;

        }

    };

}

console.log(
    "Shikshanupakaran save system initialized."
);




/* ============================================================
        SHIKSHANUPAKARAN FINAL CONNECTIONS
============================================================ */


/* ============================================================
        BACK TO MANAGEMENT BUTTON
============================================================ */


if(
    backToShikshanupakaranManagementButton
){


    backToShikshanupakaranManagementButton.addEventListener(

        "click",

        async function(){


            await openShikshanupakaranManagement();


        }

    );


}



/* ============================================================
        SEARCH
============================================================ */


if(
    shikshanupakaranSearchInputElement
){



    shikshanupakaranSearchInputElement.addEventListener(

        "input",

        function(){



            shikshanupakaranSearchTerm =
                this.value
                .trim()
                .toLowerCase();





            renderShikshanupakaranManagement();



        }

    );


}


/* ============================================================
        TIMESTAMP HELPER
============================================================ */


function getShikshanupakaranTimestamp(
    timestamp
){



    if(!timestamp){

        return 0;

    }





    if(timestamp.toDate){


        return timestamp
        .toDate()
        .getTime();


    }





    if(timestamp instanceof Date){


        return timestamp.getTime();


    }





    return new Date(
        timestamp
    ).getTime() || 0;



}


/* ============================================================
        FORMAT DATE
============================================================ */


function formatShikshanupakaranDate(
    timestamp
){



    if(!timestamp){

        return "—";

    }






    const date =
        timestamp.toDate
        ?
        timestamp.toDate()
        :
        new Date(timestamp);





    return date.toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );



}


/* ============================================================
        INITIALIZE
============================================================ */


renderShikshanupakaranManagement();



console.log(
    "Complete Shikshanupakaran system initialized successfully."
);

/* ============================================================
        SHIKSHANUPAKARAN ACTIVITY
============================================================ */


async function addShikshanupakaranActivity(
    type,
    title,
    message,
    villageName = ""
){

    try{

        await db
        .collection("activities")
        .add({

            type: type,

            title: title,

            message: message,

            module: "shikshanupakaran",

            villageName: villageName,

            createdAt:
                firebase.firestore.FieldValue
                .serverTimestamp()

        });


        console.log(
            "Shikshanupakaran activity added:",
            title
        );


        // Refresh dashboard activity

        if(
            typeof loadRecentActivity === "function"
        ){

            loadRecentActivity();

        }


    }

    catch(error){

        console.error(
            "Error adding Shikshanupakaran activity:",
            error
        );

    }

}

/* ============================================================
        DOWNLOAD SHIKSHANUPAKARAN PDF
============================================================ */

async function downloadShikshanupakaranPDF(record){


    try{


        if(!record){

            alert(
                "No record available for download."
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
            `Shikshanupakaran - ${villageName}`,
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
                        row.T || ""

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
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T"

            ]],


            body:
                tableRows,


            styles: {

                fontSize: 7

            },


            theme:
                "grid"


        });



        pdf.save(
            `${villageName}_${year}_Shikshanupakaran.pdf`
        );



        console.log(
            "PDF downloaded:",
            villageName,
            year
        );


    }


    catch(error){


        console.error(
            "PDF download error:",
            error
        );


        alert(
            "Unable to create PDF."
        );


    }


}











/* ============================================================
   SHIKSHANUPAKARAN KHATA UPLOAD
============================================================ */

const shikshanupakaranKhataUploadButton =
    document.getElementById(
        "shikshanupakaranKhataUploadButton"
    );


if (shikshanupakaranKhataUploadButton) {

    shikshanupakaranKhataUploadButton.addEventListener(
        "click",
        function () {

            console.log(
                "Shikshanupakaran Khata Upload button clicked"
            );


            openKhataFilePicker(function (file) {

                console.log(
                    "Shikshanupakaran Khata file received:"
                );

                console.log(
                    "Name:",
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

            });

        }
    );

}
else {

    console.error(
        "Shikshanupakaran Khata Upload button not found"
    );

}