// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyCCgBmxUaqH-5EWo6O83imC81RXVZcZaH8",
  authDomain: "panchayat-bill-system.firebaseapp.com",
  projectId: "panchayat-bill-system",
  storageBucket: "panchayat-bill-system.firebasestorage.app",
  messagingSenderId: "9498305655",
  appId: "1:9498305655:web:9f86a8eff58ef5bb8e5272"
};

/* ============================================================
FIREBASE INITIALIZATION
============================================================ */

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();

console.log("Firebase connected successfully!");

/* ============================================================
        LOGIN SYSTEM
============================================================ */

const loginScreen =
    document.getElementById("loginScreen");

const loginButton =
    document.getElementById("loginButton");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        async function () {

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;


            if (!email || !password) {

                loginMessage.textContent =
                    "Please enter email and password.";

                loginMessage.style.color =
                    "red";

                return;

            }


            loginButton.disabled =
                true;


            loginButton.textContent =
                "Logging in...";


            try {

                await auth
                    .signInWithEmailAndPassword(
                        email,
                        password
                    );


                console.log(
                    "Login successful"
                );


                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "green";


                // Hide login screen
                loginScreen.style.display =
                    "none";


                // Show dashboard
                dashboardView.style.display =
                    "block";


                // Load dashboard data
                loadDashboardStats();

                loadRecentBills();


            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginMessage.textContent =
                    error.message;

                loginMessage.style.color =
                    "red";


                loginButton.disabled =
                    false;


                loginButton.textContent =
                    "Login to Dashboard";

            }

        }

    );

}


/* ============================================================
        AUTHENTICATION STATE
============================================================ */

auth.onAuthStateChanged((user) => {

    if (user) {

        console.log(
            "User is logged in:",
            user.email
        );


        // Hide login screen

        if (loginScreen) {

            loginScreen.style.display =
                "none";

        }


        // Show dashboard

        showDashboard();


        // Load Firebase data ONLY after login

        loadDashboardStats();

        loadRecentBills();

        loadRecentActivity();

    }

    else {

        console.log(
            "No user logged in"
        );


        // Hide all application views

        hideAllViews();


        // Show login screen

        if (loginScreen) {

            loginScreen.style.display =
                "flex";

        }

    }

});

/* ==================================================
        PAGE ELEMENTS
================================================== */

const dashboardView =
    document.getElementById("dashboardView");

const invoiceView =
    document.getElementById("invoiceView");

const mainBillsView =
    document.getElementById("mainBillsView");

const mainBillSystemCard =
    document.getElementById("mainBillSystemCard");

const dashboardNav =
    document.getElementById("dashboardNav");

const mainBillNav =
    document.getElementById("mainBillNav");

const newMainBillButton =
    document.getElementById("newMainBillButton");

const createBillButton =
    document.getElementById("createBillButton");

/* ============================================================
        VIEW MANAGEMENT
============================================================ */

function hideAllViews() {

    document.body.classList.remove(
        "talapatrakFullscreen"
    );
  
    if (dashboardView) {

        dashboardView.style.display =
            "none";

    }


    if (mainBillsView) {

        mainBillsView.style.display =
            "none";

    }


    if (invoiceView) {

        invoiceView.style.display =
            "none";

    }


    if (talapatrakView) {

        talapatrakView.style.display =
            "none";

    }

}


function showDashboard() {

    hideAllViews();

    dashboardView.style.display =
        "block";


    dashboardNav.classList.add(
        "active"
    );

    mainBillNav.classList.remove(
        "active"
    );

}


function showMainBills() {

    hideAllViews();

    mainBillsView.style.display =
        "block";


    dashboardNav.classList.remove(
        "active"
    );

    mainBillNav.classList.add(
        "active"
    );


    loadAllMainBills();


    window.scrollTo(
        0,
        0
    );

}


function showInvoice() {

    hideAllViews();

    invoiceView.style.display =
        "block";


    dashboardNav.classList.remove(
        "active"
    );

    mainBillNav.classList.remove(
        "active"
    );

}

dashboardNav.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        showDashboard();

    }
);


mainBillNav.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        showMainBills();

    }
);


createBillButton.addEventListener(
    "click",
    function() {

        showInvoice();

    }
);


/* ==================================================
        DASHBOARD DATE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const today = new Date();

        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };

        const currentDate =
            today.toLocaleDateString(
                "en-IN",
                options
            );

        const dateElement =
            document.getElementById(
                "currentDate"
            );

        if (dateElement) {

            dateElement.textContent =
                currentDate;

        }

    }
);


/* ==================================================
        DYNAMIC DASHBOARD WELCOME
================================================== */

function updateWelcomeMessage() {


    const currentHour =
        new Date().getHours();


    let greeting;


    if (currentHour < 12) {

        greeting = "Good morning";

    }

    else if (currentHour < 17) {

        greeting = "Good afternoon";

    }

    else {

        greeting = "Good evening";

    }


    const creativeMessages = [

        "Let's make today productive! ✨",

        "Your ideas are ready to become reality. 🚀",

        "One step at a time. You've got this! 🌱",

        "Let's create something amazing today! 🎨",

        "A fresh day, a fresh start. ☀️",

        "Your business is growing, one bill at a time. 📈",

        "Small progress is still progress. 💫",

        "Let's turn today's work into tomorrow's success. 🌟",

        "Ready to make things happen? 💪",

        "Your dashboard is ready for you. Let's go! 🚀",

        "Today is a great day to get things done. ✨",

        "Organized work. Clear mind. Better results. 🧠",

        "Let's make your workflow smoother today. ⚡",

        "Another day to build something wonderful. 🌻",

        "Your next great idea might start today. 💡"

    ];


    const randomMessage =
        creativeMessages[
            Math.floor(
                Math.random()
                *
                creativeMessages.length
            )
        ];


    const welcomeElement =
        document.getElementById(
            "welcomeMessage"
        );


    if (welcomeElement) {

        welcomeElement.textContent =
            `${greeting}, Admin! 👋`;

    }


    const messageElement =
        document.getElementById(
            "welcomeSubtitle"
        );


    if (messageElement) {

        messageElement.textContent =
            randomMessage;

    }

}


updateWelcomeMessage();


/* ==================================================
        CURRENT MONTH
================================================== */

function updateCurrentMonth() {

    const today = new Date();


    const currentMonth =
        today.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    const monthElement =
        document.getElementById(
            "currentMonth"
        );


    if (monthElement) {

        monthElement.textContent =
            currentMonth;

    }

}


updateCurrentMonth();


/* ==================================================
        LOAD DASHBOARD STATISTICS
================================================== */

async function loadDashboardStats() {

    try {

        const snapshot =
            await db
                .collection("bills")
                .get();


        let totalBills =
            snapshot.size;
            
        updateMainBillCount(
                totalBills
            );


        let monthlyBills =
            0;


        let savedToday =
            0;


        let totalAmount =
            0;


        const today =
            new Date();


        const currentYear =
            today.getFullYear();


        const currentMonth =
            today.getMonth();


        const todayString =
            today.toDateString();


        snapshot.forEach(
            function (document) {


                const bill =
                    document.data();


                /* ==================================
                        TOTAL AMOUNT
                ================================== */

                totalAmount +=
                    Number(
                        bill.grandTotal
                    )
                    || 0;


                /* ==================================
                        BILL DATE
                ================================== */

                let billDate;


                if (
                    bill.billDate
                ) {

                    billDate =
                        new Date(
                            bill.billDate
                        );

                }


                /* ==================================
                        THIS MONTH
                ================================== */

                if (

                    billDate

                    &&

                    billDate.getFullYear()
                    ===
                    currentYear

                    &&

                    billDate.getMonth()
                    ===
                    currentMonth

                ) {

                    monthlyBills++;

                }


                /* ==================================
                        SAVED TODAY
                ================================== */

                if (

                    bill.createdAt
                    &&
                    bill.createdAt.toDate

                ) {


                    const createdDate =
                        bill.createdAt
                            .toDate();


                    if (

                        createdDate
                            .toDateString()
                        ===
                        todayString

                    ) {

                        savedToday++;

                    }

                }

            }
        );


        updateDashboardStats(

            totalBills,

            monthlyBills,

            totalAmount,

            savedToday

        );


    }

    catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

    }

}

/* ==================================================
        UPDATE DASHBOARD CARDS
================================================== */

function updateDashboardStats(

    totalBills,

    monthlyBills,

    totalAmount,

    savedToday

) {


    document
        .getElementById(
            "totalBillsCount"
        )
        .textContent =

        totalBills.toLocaleString(
            "en-IN"
        );


    document
        .getElementById(
            "monthlyBillsCount"
        )
        .textContent =

        monthlyBills.toLocaleString(
            "en-IN"
        );


    document
        .getElementById(
            "totalAmount"
        )
        .textContent =

        "₹ " +

        totalAmount.toLocaleString(
            "en-IN"
        );


    document
        .getElementById(
            "savedTodayCount"
        )
        .textContent =

        savedToday.toLocaleString(
            "en-IN"
        );

}

/* ==================================================
        UPDATE MAIN BILL COUNT
================================================== */

function updateMainBillCount(totalBills) {

    const mainBillCount =
        document.querySelector(
            ".orangeSystem .systemContent span"
        );


    if (mainBillCount) {

        mainBillCount.textContent =
            `${totalBills} bills`;

    }

}


async function loadRecentBills() {

    const recentBillsBody =
        document.getElementById(
            "recentBillsBody"
        );


    try {

        const snapshot =
            await db
                .collection("bills")
                .orderBy(
                    "createdAt",
                    "desc"
                )
                .limit(5)
                .get();


        recentBillsBody.innerHTML = "";


        if (snapshot.empty) {

            recentBillsBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="loadingBills"
                    >

                        No bills saved yet.

                    </td>

                </tr>

            `;

            return;

        }


        snapshot.forEach(function(doc) {

            const bill =
                doc.data();


            let billDate =
                "N/A";


            if (bill.createdAt) {

                billDate =
                    bill.createdAt
                        .toDate()
                        .toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );

            }


            const billAmount =
                Number(
                    bill.grandTotal || 0
                ).toLocaleString(
                    "en-IN"
                );


            const row = `

                <tr>

                    <td>

                        <strong
                            class="billNumber"
                        >

                            ${bill.billNo || "N/A"}

                        </strong>

                    </td>


                    <td>

                        <span
                            class="typeBadge orangeBadge"
                        >

                            Main Bill

                        </span>

                    </td>


                    <td>

                        ${bill.customerName || "N/A"}

                    </td>


                    <td>

                        ${billDate}

                    </td>


                    <td>

                        <strong>

                            ₹ ${billAmount}

                        </strong>

                    </td>


                    <td>

                        <span
                            class="statusBadge saved"
                        >

                            Saved

                        </span>

                    </td>

                </tr>

            `;


            recentBillsBody
                .insertAdjacentHTML(
                    "beforeend",
                    row
                );

        });


    } catch(error) {

        console.error(
            "Error loading recent bills:",
            error
        );


        recentBillsBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loadingBills"
                >

                    Unable to load bills.

                </td>

            </tr>

        `;

    }

}
function showMainBills() {

    hideAllViews();

    mainBillsView.style.display =
        "block";

    loadAllMainBills();

}


/* ==========================================
        LOAD ALL MAIN BILLS
========================================== */

async function loadAllMainBills(searchTerm = "") {

    const mainBillsBody =
        document.getElementById(
            "mainBillsBody"
        );


    if (!mainBillsBody) return;


    mainBillsBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="loadingBills">

                Loading bills...

            </td>

        </tr>

    `;


    try {

        const snapshot =
            await db
                .collection("bills")
                .orderBy(
                    "createdAt",
                    "desc"
                )
                .get();


        mainBillsBody.innerHTML = "";


        const search =
            searchTerm
                .trim()
                .toLowerCase();


        let foundBills = 0;


        snapshot.forEach(
            function(doc) {

                const bill =
                    doc.data();


                const billNumber =
                    String(
                        bill.billNo || ""
                    )
                    .toLowerCase();


                const customerName =
                    String(
                        bill.customerName || ""
                    )
                    .toLowerCase();


                /*
                ==========================================
                    SEARCH BY BILL NUMBER OR CUSTOMER NAME
                ==========================================
                */

                if (

                    search

                    &&

                    !billNumber.includes(search)

                    &&

                    !customerName.includes(search)

                ) {

                    return;

                }


                foundBills++;


                const billDate =
                    bill.billDate
                        ? formatIndianDate(
                            bill.billDate
                        )
                        : "N/A";


                const amount =
                    Number(
                        bill.grandTotal || 0
                    ).toLocaleString(
                        "en-IN"
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.dataset.billId =
                    doc.id;


                row.innerHTML = `

                    <td>

                        <strong
                            class="billNumber">

                            ${bill.billNo || doc.id}

                        </strong>

                    </td>


                    <td>

                        ${bill.customerName || "N/A"}

                    </td>


                    <td>

                        ${bill.village || "N/A"}

                    </td>


                    <td>

                        ${billDate}

                    </td>


                    <td>

                        <strong>

                            ₹ ${amount}

                        </strong>

                    </td>


                    <td>

                        <div
                            class="billActionButtons">

                            <button
                                class="editBillButton"
                                type="button"
                                data-id="${doc.id}">

                                <i
                                    class="fa-solid fa-pen">

                                </i>

                                Edit

                            </button>


                            <button
                                class="deleteBillButton"
                                type="button"
                                data-id="${doc.id}">

                                <i
                                    class="fa-solid fa-trash">

                                </i>

                                Delete

                            </button>

                        </div>

                    </td>

                `;


                mainBillsBody.appendChild(
                    row
                );

            }
        );


        /*
        ==========================================
                NO SEARCH RESULTS
        ==========================================
        */

        if (foundBills === 0) {

            mainBillsBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="loadingBills">

                        No bills found for:

                        <strong>
                            "${searchTerm}"
                        </strong>

                    </td>

                </tr>

            `;

            return;

        }


        attachBillActionListeners();


    }

    catch(error) {

        console.error(
            "Error loading all bills:",
            error
        );


        mainBillsBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="loadingBills">

                    Unable to load bills.

                </td>

            </tr>

        `;

    }

}


const mainBillSearch =
    document.getElementById(
        "mainBillSearch"
    );


if (mainBillSearch) {

    mainBillSearch.addEventListener(
        "input",
        function() {

            loadAllMainBills(
                this.value
            );

        }
    );

}
/* ==================================================
        BILL ACTION BUTTONS
================================================== */

function attachBillActionListeners() {


    document
        .querySelectorAll(
            ".editBillButton"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const billId =
                            this.dataset.id;


                        editBill(
                            billId
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".deleteBillButton"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const billId =
                            this.dataset.id;


                        deleteBill(
                            billId
                        );

                    }
                );

            }
        );

}


/* ==================================================
        EDIT BILL
================================================== */

async function editBill(billId) {

    try {

        const billDocument =
            await db
                .collection("bills")
                .doc(billId)
                .get();


        if (!billDocument.exists) {

            alert(
                "Bill not found."
            );

            return;

        }


        const bill =
            billDocument.data();


        /* ==============================
                OPEN BILL FORM
        ============================== */

        mainBillsView.style.display =
            "none";


        invoiceView.style.display =
            "block";


        mainBillNav.classList.remove(
            "active"
        );


        /* ==============================
                LOAD BILL DETAILS
        ============================== */

        document
            .getElementById(
                "customerName"
            )
            .value =
            bill.customerName || "";


        document
            .getElementById(
                "village"
            )
            .value =
            bill.village || "";


        document
            .getElementById(
                "taluka"
            )
            .value =
            bill.taluka || "";


        document
            .getElementById(
                "district"
            )
            .value =
            bill.district || "";


        document
            .getElementById(
                "mobileNumber"
            )
            .value =
            bill.mobileNumber || "";


        document
            .getElementById(
                "billNo"
            )
            .value =
            bill.billNo || billId;


        document
            .getElementById(
                "billDate"
            )
            .value =
            bill.billDate || "";


        document
            .getElementById(
                "paymentDetails"
            )
            .value =
            bill.paymentDetails || "";


        document
            .getElementById(
                "numberToGujaratiWords"
            )
            .value =
            bill.numberToGujaratiWords || "";


        /* ==============================
                LOAD GRAND TOTAL
        ============================== */

        document
            .getElementById(
                "grandTotal"
            )
            .value =
            bill.grandTotal || 0;


        /* ==============================
                LOAD ITEMS
        ============================== */

        loadBillItems(
            bill.items || []
        );


        calculateGrandTotal();


        window.scrollTo(
            0,
            0
        );


    }

    catch(error) {

        console.error(
            "Error loading bill:",
            error
        );


        alert(
            "Unable to load bill."
        );

    }

}

/* ==================================================
        LOAD BILL ITEMS
================================================== */

function loadBillItems(items) {

    const tbody =
        document.getElementById(
            "itemBody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        !items
        ||
        items.length === 0
    ) {

        addItemRow();

        return;

    }


    items.forEach(
        function(item) {

            const row =
                document.createElement(
                    "tr"
                );


            row.className =
                "data-row";


            row.innerHTML = `

                <td>

                    <input
                        class="table-input srno"
                        type="number"
                        readonly
                        value="${item.srno || ""}">

                </td>


                <td>

                    <textarea
                        class="description"
                        rows="1">${item.description || ""}</textarea>

                </td>


                <td>

                    <input
                        class="table-input pages"
                        type="number"
                        value="${item.pages || ""}"
                        oninput="calculateRow(this)">

                </td>


                <td>

                    <input
                        class="table-input price"
                        type="number"
                        step="0.01"
                        value="${item.price || ""}"
                        oninput="calculateRow(this)">

                </td>


                <td>

                    <input
                        class="table-input total"
                        type="number"
                        readonly
                        value="${item.total || ""}">

                </td>


                <td>

                    <button
                        class="delete-btn"
                        type="button"
                        onclick="deleteCurrentRow(this)">

                        🗑

                    </button>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    updateSerialNumbers();


    tbody
        .querySelectorAll(
            ".description"
        )
        .forEach(
            autoResizeDescription
        );

}

/* ==================================================
        DELETE BILL
================================================== */

async function deleteBill(billId) {


    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this bill?"
        );


    if (!confirmed) return;


    try {

        await db
            .collection("bills")
            .doc(billId)
            .delete();


        alert(
            "Bill deleted successfully."
        );


        await loadAllMainBills();


        await loadDashboardStats();


        await loadRecentBills();


    }

    catch(error) {

        console.error(
            "Error deleting bill:",
            error
        );


        alert(
            "Unable to delete bill."
        );

    }

}

/* ==================================================
        CREATE NEW BILL
================================================== */

if (newMainBillButton) {

    newMainBillButton.addEventListener(
        "click",
        function() {


            mainBillsView.style.display =
                "none";


            invoiceView.style.display =
                "block";


            mainBillNav.classList.remove(
                "active"
            );


            dashboardNav.classList.remove(
                "active"
            );


            setInitialBillNumber();


            window.scrollTo(
                0,
                0
            );

        }
    );

}


/* ==================================================
        THEME SWITCHER
================================================== */

const themeButtons =
    document.querySelectorAll(
        ".themeButton"
    );


function applyTheme(theme) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    themeButtons.forEach(
        function(button) {

            button.classList.toggle(

                "active",

                button.dataset.theme === theme

            );

        }
    );


    localStorage.setItem(
        "selectedTheme",
        theme
    );

}


themeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const selectedTheme =
                    this.dataset.theme;


                applyTheme(
                    selectedTheme
                );

            }
        );

    }
);


const savedTheme =
    localStorage.getItem(
        "selectedTheme"
    ) || "light";


applyTheme(
    savedTheme
);

/* ==================================================
        PAGE NAVIGATION
================================================== */


dashboardNav.addEventListener(
    "click",
    function(event) {

        event.preventDefault();


        dashboardView.style.display =
            "block";


        invoiceView.style.display =
            "none";


        dashboardNav.classList.add(
            "active"
        );


        window.scrollTo(
            0,
            0
        );

    }
);


if (createBillButton) {

    createBillButton.addEventListener(
        "click",
        function() {

            dashboardView.style.display =
                "none";

            invoiceView.style.display =
                "block";

            dashboardNav.classList.remove(
                "active"
            );

            window.scrollTo(
                0,
                0
            );

        }
    );

}

function autoGrow(textarea) {

    textarea.style.height = "40px";

    textarea.style.height =
        textarea.scrollHeight + "px";

}



// ==========================================================================



// ==========================================
// GENERATE BILL NUMBER
// ==========================================

async function generateBillNumber() {

    const currentYear =
        new Date().getFullYear();


    let billNumber;

    let exists = true;


    while (exists) {

        const digitCount =
            Math.random() < 0.5
                ? 6
                : 7;


        const min =
            digitCount === 6
                ? 100000
                : 1000000;


        const max =
            digitCount === 6
                ? 999999
                : 9999999;


        const randomNumber =
            Math.floor(
                Math.random() *
                (max - min + 1)
            ) + min;


        billNumber =
            `${currentYear}-${randomNumber}`;


        const existingBill =
            await db
                .collection("bills")
                .doc(billNumber)
                .get();


        exists =
            existingBill.exists;

    }


    return billNumber;

}


// ==========================================
// SET INITIAL BILL NUMBER
// ==========================================

async function setInitialBillNumber() {

    const billNumber =
        await generateBillNumber();


    const billNo =
        document.getElementById(
            "billNo"
        );


    if (billNo) {

        billNo.value =
            billNumber;

    }

}


// ==========================================
// CALCULATE ROW
// ==========================================

function calculateRow(input) {

    const row =
        input.closest("tr");


    const pages =
        parseFloat(
            row.querySelector(
                ".pages"
            ).value
        ) || 0;


    const price =
        parseFloat(
            row.querySelector(
                ".price"
            ).value
        ) || 0;


    const total =
        pages * price;


    row.querySelector(
        ".total"
    ).value =
        total.toFixed(2);


    calculateGrandTotal();

}


// Make available to inline HTML
window.calculateRow =
    calculateRow;


// ==========================================
// CALCULATE GRAND TOTAL
// ==========================================

function calculateGrandTotal() {

    let sum = 0;


    document
        .querySelectorAll(
            "#itemBody .total"
        )
        .forEach(function(input) {

            sum +=
                parseFloat(
                    input.value
                ) || 0;

        });


    const grandTotal =
        document.getElementById(
            "grandTotal"
        );


    if (grandTotal) {

        grandTotal.value =
            sum.toFixed(2);

    }

}


// ==========================================
// ADD NEW ITEM ROW
// ==========================================

function addItemRow() {

    const tbody =
        document.getElementById(
            "itemBody"
        );


    if (!tbody) return;


    const row =
        document.createElement(
            "tr"
        );


    row.className =
        "data-row";


    row.innerHTML = `

        <td>

            <input
                class="table-input srno"
                type="number"
                readonly>

        </td>


        <td>

            <textarea
                class="description"
                rows="2"></textarea>

        </td>


        <td>

            <input
                class="table-input pages"
                type="number"
                oninput="calculateRow(this)">

        </td>


        <td>

            <input
                class="table-input price"
                type="number"
                step="0.01"
                oninput="calculateRow(this)">

        </td>


        <td>

            <input
                class="table-input total"
                type="number"
                readonly>

        </td>


        <td>

            <button
                class="delete-btn"
                type="button"
                onclick="deleteCurrentRow(this)">

                🗑

            </button>

        </td>

    `;


    tbody.appendChild(
        row
    );


    updateSerialNumbers();


    autoResizeDescription(
        row.querySelector(
            ".description"
        )
    );

}


// ==========================================
// ADD ROW BUTTON
// ==========================================

const addRowBtn =
    document.getElementById(
        "addRow"
    );


if (addRowBtn) {

    addRowBtn.addEventListener(
        "click",
        addItemRow
    );

}


// ==========================================
// DELETE ROW
// ==========================================

function deleteCurrentRow(button) {

    const tbody =
        document.getElementById(
            "itemBody"
        );


    if (
        tbody.rows.length === 1
    ) {

        alert(
            "At least one row is required."
        );

        return;

    }


    button
        .closest("tr")
        .remove();


    updateSerialNumbers();


    calculateGrandTotal();

}


window.deleteCurrentRow =
    deleteCurrentRow;


// ==========================================
// UPDATE SERIAL NUMBERS
// ==========================================

function updateSerialNumbers() {

    const rows =
        document.querySelectorAll(
            "#itemBody tr"
        );


    rows.forEach(
        function(row, index) {

            const srno =
                row.querySelector(
                    ".srno"
                );


            if (srno) {

                srno.value =
                    index + 1;

            }

        }
    );

}


// ==========================================
// AUTO-RESIZE DESCRIPTION
// ==========================================

function autoResizeDescription(textarea) {

    if (!textarea) return;


    textarea.style.height =
        "auto";


    textarea.style.height =
        textarea.scrollHeight +
        "px";

}


// ==========================================
// DESCRIPTION INPUT LISTENER
// ==========================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.classList
                .contains(
                    "description"
                )
        ) {

            autoResizeDescription(
                event.target
            );

        }

    }
);


// ==========================================
// FORM FIELD LIVE SYNC
// ==========================================

const formFields = [

    "customerName",

    "village",

    "taluka",

    "district",

    "mobileNumber",

    "billNo",

    "billDate",

    "paymentDetails",

    "grandTotal",

    "numberToGujaratiWords"

];


formFields.forEach(
    function(id) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.addEventListener(
                "input",
                function() {

                    // Reserved for
                    // next-page syncing

                    console.log(
                        `${id} updated`
                    );

                }
            );

        }

    }
);


// ==========================================
// INITIALIZE FORM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setInitialBillNumber();


        updateSerialNumbers();


        const firstDescription =
            document.querySelector(
                ".description"
            );


        if (
            firstDescription
        ) {

            autoResizeDescription(
                firstDescription
            );

        }

    }
);



// ==========================================================================

// ==========================================
// FORMAT DATE IN INDIAN FORMAT
// ==========================================

function formatIndianDate(dateValue) {

    if (!dateValue) return "";

    const date =
        new Date(
            dateValue + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}
// ==========================================
// GENERATE RECEIPT BUTTON
// ==========================================

const generateReceiptBtn =
    document.getElementById(
        "generateReceiptBtn"
    );


if (generateReceiptBtn) {

    generateReceiptBtn.addEventListener(
        "click",
        generateReceipt
    );

}


function generateReceipt() {

    try {

        /*
        ==========================================
            GENERATE PAVTI NUMBER
        ==========================================
        */

        const billNo =
            document
                .getElementById(
                    "billNo"
                )
                .value
                .trim();


        const billDate =
            document
                .getElementById(
                    "billDate"
                )
                .value;


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        if (!billNo) {

            alert(
                "Please enter Bill Number first."
            );

            return;

        }


        if (!customerName) {

            alert(
                "Please enter Customer Name first."
            );

            return;

        }


        /*
        ==========================================
            CREATE RECEIPT NUMBER
        ==========================================
        */

        const receiptNumber =
            "P-" + billNo;


        /*
        ==========================================
            SET DUPLICATE RECEIPT DETAILS
        ==========================================
        */

        document
            .getElementById(
                "dPavtiNo"
            )
            .value =
            receiptNumber;


        document
            .getElementById(
                "dPavtiDate"
            )
            .value =
            formatIndianDate(
                billDate
            );


        /*
        ==========================================
            GENERATE MAIN + DUPLICATE BILL
        ==========================================
        */

        generatePrintableBills();


        /*
        ==========================================
            SHOW RECEIPT BELOW FORM
        ==========================================
        */

        document.body.classList.add(
            "receiptGeneratedMode"
        );


        const printableBills =
            document.getElementById(
                "printableBills"
            );


        printableBills.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


        console.log(
            "Receipt generated successfully."
        );


    } catch(error) {

        console.error(
            "Error generating receipt:",
            error
        );


        alert(
            "Error generating receipt: " +
            error.message
        );

    }

}


// ==========================================
// FORMAT DATE IN INDIAN FORMAT
// ==========================================

function formatIndianDate(dateValue) {

    if (!dateValue) return "";

    const date =
        new Date(
            dateValue + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}
// ==========================================
// GENERATE RECEIPT ITEMS
// ==========================================


function generatePrintableBills() {


    /*
    ==========================================
        MAIN BILL DETAILS
    ==========================================
    */

    document
        .getElementById("pCustomerName")
        .textContent =
        document
            .getElementById("customerName")
            .value;


    document
        .getElementById("pBillNo")
        .textContent =
        document
            .getElementById("billNo")
            .value;


    document
        .getElementById("pVillage")
        .textContent =
        document
            .getElementById("village")
            .value;


    document
        .getElementById("pTaluka")
        .textContent =
        document
            .getElementById("taluka")
            .value;


    document
        .getElementById("pDistrict")
        .textContent =
        document
            .getElementById("district")
            .value;


    document
        .getElementById("pBillDate")
        .textContent =
        formatIndianDate(
            document
                .getElementById("billDate")
                .value
        );


    document
        .getElementById("pMobileNumber")
        .textContent =
        document
            .getElementById("mobileNumber")
            .value;


    document
        .getElementById("pAmountWords")
        .textContent =
        document
            .getElementById(
                "numberToGujaratiWords"
            )
            .value;


    document
        .getElementById("pGrandTotal")
        .textContent =
        document
            .getElementById("grandTotal")
            .value;


    document
        .getElementById("pPaymentDetails")
        .textContent =
        document
            .getElementById("paymentDetails")
            .value;


    /*
    ==========================================
        DUPLICATE BILL DETAILS
    ==========================================
    */

    document
        .getElementById("dCustomerName")
        .textContent =
        document
            .getElementById("customerName")
            .value;


    document
        .getElementById("dVillage")
        .textContent =
        document
            .getElementById("village")
            .value;


    document
        .getElementById("dTaluka")
        .textContent =
        document
            .getElementById("taluka")
            .value;


    document
        .getElementById("dDistrict")
        .textContent =
        document
            .getElementById("district")
            .value;


    document
        .getElementById("dGrandTotal")
        .textContent =
        document
            .getElementById("grandTotal")
            .value;


    document
        .getElementById("dAmountWords")
        .textContent =
        document
            .getElementById(
                "numberToGujaratiWords"
            )
            .value;


    document
        .getElementById("dPaymentDetails")
        .textContent =
        document
            .getElementById("paymentDetails")
            .value;


    /*
    ==========================================
        MAIN BILL ITEMS
    ==========================================
    */

    const printItems =
        document.getElementById(
            "printMainItems"
        );


    printItems.innerHTML = "";


    document
        .querySelectorAll(
            "#itemBody tr"
        )
        .forEach(function(row) {


            const printRow =
                document.createElement(
                    "tr"
                );


            const srno =
                row
                    .querySelector(
                        ".srno"
                    )
                    .value;


            const description =
                row
                    .querySelector(
                        ".description"
                    )
                    .value;


            const pages =
                row
                    .querySelector(
                        ".pages"
                    )
                    .value;


            const price =
                row
                    .querySelector(
                        ".price"
                    )
                    .value;


            const total =
                row
                    .querySelector(
                        ".total"
                    )
                    .value;


            printRow.innerHTML = `

                <td>
                    ${srno}
                </td>

                <td class="printDescription">
                    ${description}
                </td>

                <td>
                    ${pages}
                </td>

                <td>
                    ₹ ${price}
                </td>

                <td>
                    ₹ ${total}
                </td>

            `;


            printItems.appendChild(
                printRow
            );

        });


}


// ==========================================
// CREATE RECENT ACTIVITY
// ==========================================

async function createActivity(activityData) {

    await db
        .collection("activities")
        .add({

            ...activityData,

            createdAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()

        });

}
// ==========================================
// SAVE CURRENT BILL
// ==========================================

async function saveCurrentBill() {

    const billNo =
        document
            .getElementById("billNo")
            .value
            .trim();


    if (!billNo) {

        throw new Error(
            "Bill number is missing."
        );

    }


    /*
    ==========================================
        COLLECT BILL ITEMS
    ==========================================
    */

    const items = [];


    document
        .querySelectorAll(
            "#itemBody tr"
        )
        .forEach(function(row) {

            const description =
                row
                    .querySelector(
                        ".description"
                    )
                    .value
                    .trim();


            const pages =
                parseFloat(
                    row
                        .querySelector(
                            ".pages"
                        )
                        .value
                )
                || 0;


            const price =
                parseFloat(
                    row
                        .querySelector(
                            ".price"
                        )
                        .value
                )
                || 0;


            const total =
                parseFloat(
                    row
                        .querySelector(
                            ".total"
                        )
                        .value
                )
                || 0;


            items.push({

                srno:
                    row
                        .querySelector(
                            ".srno"
                        )
                        .value,

                description,

                pages,

                price,

                total

            });

        });


    /*
    ==========================================
        BILL DATA
    ==========================================
    */

    const billData = {

        billNo:

            billNo,


        customerName:

            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim(),


        village:

            document
                .getElementById(
                    "village"
                )
                .value
                .trim(),


        taluka:

            document
                .getElementById(
                    "taluka"
                )
                .value
                .trim(),


        district:

            document
                .getElementById(
                    "district"
                )
                .value
                .trim(),


        mobileNumber:

            document
                .getElementById(
                    "mobileNumber"
                )
                .value
                .trim(),


        billDate:

            document
                .getElementById(
                    "billDate"
                )
                .value,


        paymentDetails:

            document
                .getElementById(
                    "paymentDetails"
                )
                .value
                .trim(),


        numberToGujaratiWords:

            document
                .getElementById(
                    "numberToGujaratiWords"
                )
                .value
                .trim(),


        grandTotal:

            Number(
                document
                    .getElementById(
                        "grandTotal"
                    )
                    .value
            )
            || 0,


        items:

            items,


        updatedAt:

            firebase.firestore.FieldValue
                .serverTimestamp()

    };


    /*
    ==========================================
        CHECK IF BILL ALREADY EXISTS
    ==========================================
    */

    const billReference =
        db
            .collection("bills")
            .doc(billNo);


    const existingBill =
        await billReference.get();


    /*
    ==========================================
        UPDATE EXISTING BILL
    ==========================================
    */

    if (existingBill.exists) {

    await billReference.update(

        billData

    );


    await createActivity({

        type:
            "updated",

        title:
            "Bill updated",

        message:
            "Bill " + billNo,

        billNo:
            billNo,

        amount:
            billData.grandTotal,

        customerName:
            billData.customerName

    });


    console.log(
        "Bill updated successfully:",
        billNo
    );

}


    /*
    ==========================================
        CREATE NEW BILL
    ==========================================
    */

    else {

    await billReference.set({

        ...billData,


        createdAt:

            firebase.firestore.FieldValue
                .serverTimestamp()

    });


    await createActivity({

        type:
            "created",

        title:
            "New bill created",

        message:
            `Main Bill • ₹${Number(
                billData.grandTotal
            ).toLocaleString(
                "en-IN"
            )}`,

        billNo:
            billNo,

        amount:
            billData.grandTotal,

        customerName:
            billData.customerName

    });


    console.log(
        "New bill saved successfully:",
        billNo
    );

}


    /*
    ==========================================
        REFRESH DASHBOARD DATA
    ==========================================
    */

    await loadDashboardStats();
    
    await loadRecentBills();
    
    await loadRecentActivity();

}

// ==========================================================================

// ==========================================
// BACK TO EDIT
// ==========================================

const backToEditBtn =
    document.getElementById(
        "backToEditBtn"
    );


if (backToEditBtn) {

    backToEditBtn.addEventListener(
        "click",
        function () {

            document.body.classList.remove(
                "receiptGeneratedMode"
            );

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// ==========================================================================


// ==========================================
// PRINT BILL
// ==========================================

const printBillBtn =
    document.getElementById(
        "printBillBtn"
    );


if (printBillBtn) {

    printBillBtn.addEventListener(
        "click",
        function() {

            generatePrintableBills();


            document.body.classList.add(
                "showCutLine"
            );


            window.print();

        }

    );

}


// ==========================================
// AFTER PRINT
// ==========================================

window.addEventListener(
    "afterprint",
    async function() {

        try {

            await saveCurrentBill();


            console.log(
                "Bill automatically saved after printing."
            );


        }

        catch(error) {

            console.error(
                "Error automatically saving bill:",
                error
            );

            alert(
                "Bill could not be saved: " +
                error.message
            );

        }


        document.body.classList.remove(
            "showCutLine"
        );

    }

);

/* ============================================================
        LOGOUT SYSTEM
============================================================ */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await auth.signOut();

                console.log("User logged out successfully");

                // Hide all application views
                hideAllViews();

                // Show login screen
                if (loginScreen) {

                    loginScreen.style.display =
                        "flex";

                }

                // Clear login fields
                if (loginEmail) {

                    loginEmail.value =
                        "";

                }

                if (loginPassword) {

                    loginPassword.value =
                        "";

                }

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }

    );

}


/* ===========================================================================

/* ============================================================
        RECENT ACTIVITY SYSTEM
============================================================ */

const activityList =
    document.getElementById(
        "recentActivityList"
    );


const activityMoreButton =
    document.getElementById(
        "activityMoreButton"
    );


const activityCard =
    document.querySelector(
        ".activityCard"
    );


/* ============================================================
        ACTIVITY ICONS
============================================================ */

function getActivityIcon(type) {

    if (type === "created") {

        return `
            <div class="activityIcon orangeActivity">

                <i class="fa-solid fa-plus"></i>

            </div>
        `;

    }


    if (type === "updated") {

        return `
            <div class="activityIcon blueActivity">

                <i class="fa-solid fa-pen"></i>

            </div>
        `;

    }


    if (type === "saved") {

        return `
            <div class="activityIcon greenActivity">

                <i class="fa-solid fa-check"></i>

            </div>
        `;

    }

}


/* ============================================================
        ACTIVITY MESSAGE
============================================================ */

function getActivityTitle(type) {

    if (type === "created") {

        return "New bill created";

    }


    if (type === "updated") {

        return "Bill updated";

    }


    if (type === "saved") {

        return "Bill saved";

    }

}


/* ============================================================
        ACTIVITY TIME
============================================================ */

function getRelativeTime(timestamp) {

    if (!timestamp) {

        return "";

    }


    const activityDate =
        timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);


    const now =
        new Date();


    const difference =
        now - activityDate;


    const seconds =
        Math.floor(
            difference / 1000
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const hours =
        Math.floor(
            minutes / 60
        );


    const days =
        Math.floor(
            hours / 24
        );


    if (seconds < 60) {

        return "Just now";

    }


    if (minutes < 60) {

        return `${minutes} min`;

    }


    if (hours < 24) {

        return `${hours} hr`;

    }


    if (days === 1) {

        return "Yesterday";

    }


    return `${days} days`;

}


/* ============================================================
        LOAD RECENT ACTIVITY
============================================================ */


// ==========================================
// LOAD RECENT ACTIVITY
// ==========================================

async function loadRecentActivity() {

    const activityList =
        document.getElementById(
            "recentActivityList"
        );


    if (!activityList) return;


    try {

        const snapshot =
            await db
                .collection("activities")
                .orderBy(
                    "createdAt",
                    "desc"
                )
                .limit(3)
                .get();


        activityList.innerHTML = "";


        if (snapshot.empty) {

            activityList.innerHTML = `

                <div class="activityEmpty">

                    No recent activity yet.

                </div>

            `;

            return;

        }


        snapshot.forEach(function(doc) {

            const activity =
                doc.data();


            const activityTime =
                activity.createdAt
                    ? formatActivityTime(
                        activity.createdAt
                    )
                    : "Just now";


            let icon =
                "fa-plus";


            let iconClass =
                "orangeActivity";


            if (
                activity.type ===
                "updated"
            ) {

                icon =
                    "fa-pen";

                iconClass =
                    "blueActivity";

            }


            if (
                activity.type ===
                "saved"
            ) {

                icon =
                    "fa-check";

                iconClass =
                    "greenActivity";

            }


            const activityItem = `

                <div
                    class="activityItem"
                    data-id="${doc.id}"
                >

                    <div
                        class="activityIcon ${iconClass}"
                    >

                        <i
                            class="fa-solid ${icon}"
                        ></i>

                    </div>


                    <div
                        class="activityText"
                    >

                        <strong>

                            ${activity.title}

                        </strong>


                        <span>

                            ${activity.message}

                        </span>

                    </div>


                    <time>

                        ${activityTime}

                    </time>

                </div>

            `;


            activityList
                .insertAdjacentHTML(
                    "beforeend",
                    activityItem
                );

        });


    }

    catch(error) {

        console.error(
            "Error loading recent activity:",
            error
        );


        activityList.innerHTML = `

            <div class="activityEmpty">

                Unable to load recent activity.

            </div>

        `;

    }

}

// ==========================================
// FORMAT ACTIVITY TIME
// ==========================================

function formatActivityTime(timestamp) {

    const activityDate =
        timestamp.toDate();


    const now =
        new Date();


    const difference =
        now - activityDate;


    const seconds =
        Math.floor(
            difference / 1000
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const hours =
        Math.floor(
            minutes / 60
        );


    const days =
        Math.floor(
            hours / 24
        );


    if (seconds < 60) {

        return "Just now";

    }


    if (minutes < 60) {

        return minutes +
            (
                minutes === 1
                    ? " min"
                    : " mins"
            );

    }


    if (hours < 24) {

        return hours +
            (
                hours === 1
                    ? " hr"
                    : " hrs"
            );

    }


    if (days < 7) {

        return days +
            (
                days === 1
                    ? " day"
                    : " days"
            );

    }


    return activityDate
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        );

}

/* ============================================================
   RECENT ACTIVITY MENU
============================================================ */


let activityMenu =
    null;


/* ============================================================
   CREATE MENU
============================================================ */

function createActivityMenu() {

    if (activityMenu) return;


    activityMenu =
        document.createElement("div");


    activityMenu.className =
        "activityMenu";


    activityMenu.innerHTML = `

        <button
            type="button"
            class="activityMenuItem"
            id="refreshActivityButton">

            <i class="fa-solid fa-arrows-rotate"></i>

            <span>
                Refresh activity
            </span>

        </button>


        <button
            type="button"
            class="activityMenuItem"
            id="viewAllActivityButton">

            <i class="fa-solid fa-list"></i>

            <span>
                View all activity
            </span>

        </button>


        <button
            type="button"
            class="activityMenuItem danger"
            id="hideActivityButton">

            <i class="fa-solid fa-eye-slash"></i>

            <span>
                Hide activity
            </span>

        </button>

    `;


    activityCard.appendChild(
        activityMenu
    );


    setupActivityMenuActions();

}


/* ============================================================
   TOGGLE MENU
============================================================ */

if (activityMoreButton) {

    activityMoreButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            createActivityMenu();

            activityMenu.classList.toggle(
                "show"
            );

        }
    );

}


/* ============================================================
   CLOSE MENU OUTSIDE
============================================================ */

document.addEventListener(
    "click",
    function(event) {

        if (

            activityMenu &&

            !activityMenu.contains(
                event.target
            ) &&

            !activityMoreButton.contains(
                event.target
            )

        ) {

            activityMenu.classList.remove(
                "show"
            );

        }

    }
);


/* ============================================================
   MENU ACTIONS
============================================================ */

function setupActivityMenuActions() {


    /* --------------------------------------------------------
       REFRESH
    -------------------------------------------------------- */

    const refreshButton =
        document.getElementById(
            "refreshActivityButton"
        );


    refreshButton.addEventListener(
        "click",
        async function() {

            activityMenu.classList.remove(
                "show"
            );


            activityList.innerHTML = `

                <div class="activityLoading">

                    Refreshing activity...

                </div>

            `;


            /*
             * Replace this function name
             * with your existing activity
             * loading function.
             */

            if (
                typeof loadRecentActivity ===
                "function"
            ) {

                await loadRecentActivity();

            }

        }
    );


    /* --------------------------------------------------------
       VIEW ALL
    -------------------------------------------------------- */

    const viewAllButton =
        document.getElementById(
            "viewAllActivityButton"
        );


    viewAllButton.addEventListener(
        "click",
        function() {

            activityMenu.classList.remove(
                "show"
            );


            /*
             * If you already have an
             * All Bills page, navigate there.
             */

            const allBillsButton =
                document.querySelector(
                    "#allBillsNav"
                );


            if (allBillsButton) {

                allBillsButton.click();

            }

            else {

                console.log(
                    "View all activity clicked"
                );

            }

        }
    );


    /* --------------------------------------------------------
       HIDE ACTIVITY
    -------------------------------------------------------- */

    const hideButton =
        document.getElementById(
            "hideActivityButton"
        );


    hideButton.addEventListener(
        "click",
        function() {

            activityMenu.classList.remove(
                "show"
            );


            activityList.classList.add(
                "activityHidden"
            );


            showActivityHiddenState();

        }
    );

}

/* ============================================================
   HIDDEN ACTIVITY STATE
============================================================ */

function showActivityHiddenState() {

    let hiddenState =
        activityCard.querySelector(
            ".activityHiddenState"
        );


    if (!hiddenState) {

        hiddenState =
            document.createElement("div");


        hiddenState.className =
            "activityHiddenState";


        hiddenState.innerHTML = `

            <i class="fa-solid fa-eye-slash"></i>

            <span>
                Recent activity is hidden
            </span>


            <button
                type="button"
                class="activityMenuItem"
                id="showActivityButton">

                <i class="fa-solid fa-eye"></i>

                Show activity

            </button>

        `;


        activityCard.appendChild(
            hiddenState
        );


        document
            .getElementById(
                "showActivityButton"
            )
            .addEventListener(
                "click",
                showActivityAgain
            );

    }


    hiddenState.classList.add(
        "show"
    );

}


/* ============================================================
   SHOW ACTIVITY AGAIN
============================================================ */

function showActivityAgain() {

    const hiddenState =
        document.querySelector(
            ".activityHiddenState"
        );


    hiddenState.classList.remove(
        "show"
    );


    activityList.classList.remove(
        "activityHidden"
    );


    if (
        typeof loadRecentActivity ===
        "function"
    ) {

        loadRecentActivity();

    }

}





/* ===========================================================================


/* ============================================================
        TALAPATRAK NAVIGATION
============================================================ */

/* ============================================================
        TALAPATRAK FULL-SCREEN NAVIGATION
============================================================ */

const talapatrakNav =
    document.getElementById(
        "talapatrakNav"
    );


const talapatrakView =
    document.getElementById(
        "talapatrakView"
    );


if (

    talapatrakNav &&

    talapatrakView

) {


    talapatrakNav.addEventListener(

        "click",

        function(event) {


            event.preventDefault();


            /*
               Hide all normal views
            */

            hideAllViews();


            /*
               Show Talapatrak
            */

            talapatrakView.style.display =
                "block";


            /*
               Activate full-screen mode
            */

            document.body.classList.add(

                "talapatrakFullscreen"

            );


            /*
               Make Talapatrak active
            */

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


            talapatrakNav.classList.add(
                "active"
            );


        }

    );

}


/* ============================================================
        BACK TO DASHBOARD
============================================================ */

const backToDashboardButton =
    document.getElementById(
        "backToDashboardFromTalapatrak"
    );


if (backToDashboardButton) {

    backToDashboardButton.addEventListener(

        "click",

        function() {


            /*
               Exit fullscreen mode
            */

            document.body.classList.remove(

                "talapatrakFullscreen"

            );


            /*
               Hide Talapatrak
            */

            talapatrakView.style.display =
                "none";


            /*
               Show Dashboard
            */

            if (dashboardView) {

                dashboardView.style.display =
                    "block";

            }


            /*
               Remove active state
               from all navigation items
            */

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


            /*
               Activate Dashboard navigation
            */

            const dashboardNav =
                document.getElementById(
                    "dashboardNav"
                );


            if (dashboardNav) {

                dashboardNav.classList.add(
                    "active"
                );

            }


            /*
               Scroll dashboard to top
            */

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    );

}
/* ============================================================
        TALAPATRAK ROW SYSTEM
============================================================ */

const talapatrakBody =
    document.getElementById(
        "talapatrakBody"
    );


const addTalapatrakRowButton =
    document.getElementById(
        "addTalapatrakRow"
    );


/* ============================================================
        ADD NEW ROW
============================================================ */

if (addTalapatrakRowButton) {

    addTalapatrakRowButton.addEventListener(
        "click",
        function () {

            const rows =
                talapatrakBody.querySelectorAll(
                    ".talapatrakRow"
                );


            const lastRow =
                rows[rows.length - 1];


            const newRow =
                lastRow.cloneNode(true);


            /*
             * Find last sequence number
             */

            const lastSequenceInput =
                lastRow.querySelector(
                    ".columnA"
                );


            const lastSequence =
                Number(
                    lastSequenceInput.value
                ) || 0;


            /*
             * Clear all inputs
             */

            newRow
                .querySelectorAll("input")
                .forEach(function(input) {

                    if (
                        input.classList.contains(
                            "columnA"
                        )
                    ) {

                        input.value =
                            lastSequence + 1;

                    }

                    else {

                        input.value =
                            "";

                    }

                });


            /*
             * Add new row
             */

            talapatrakBody.appendChild(
                newRow
            );

            formatTalapatrakNumberInputs();


            /*
             * Focus first editable field
             */

            const firstInput =
                newRow.querySelector(
                    ".columnB"
                );


            if (firstInput) {

                firstInput.focus();

            }


            /*
             * Recalculate all rows
             */

            calculateAllTalapatrakRows();

        }

    );

}


/* ============================================================
        DELETE ROW
============================================================ */

function deleteTalapatrakRow(button) {

    const rows =
        talapatrakBody.querySelectorAll(
            ".talapatrakRow"
        );


    /*
     * Never delete the final row
     */

    if (rows.length === 1) {

        alert(
            "At least one row is required."
        );

        return;

    }


    const row =
        button.closest(
            ".talapatrakRow"
        );


    row.remove();


    renumberTalapatrakRows();


    calculateAllTalapatrakRows();

}


/* ============================================================
        AUTOMATIC SEQUENCE NUMBERS
============================================================ */

function renumberTalapatrakRows() {

    const rows =
        talapatrakBody.querySelectorAll(
            ".talapatrakRow"
        );


    rows.forEach(function(row, index) {

        const sequenceInput =
            row.querySelector(
                ".columnA"
            );


        if (sequenceInput) {

            sequenceInput.value =
                index + 1;

        }

    });

}

/* ============================================================
        CALCULATE TALAPATRAK ROW
============================================================ */

function calculateTalapatrakRow(input) {

    const row =
        input.closest(
            ".talapatrakRow"
        );


    if (!row) return;


    const getValue =
        function(column) {

            const element =
                row.querySelector(
                    "." + column
                );


            return Number(
                element.value
            ) || 0;

        };


    const setValue =
    function(column, value) {

        const element =
            row.querySelector(
                "." + column
            );


        element.value =
            Number(value).toFixed(2);

    };


    /*
     * H = C + D + E + F + G
     */

    const C =
        getValue("columnC");

    const D =
        getValue("columnD");

    const E =
        getValue("columnE");

    const F =
        getValue("columnF");

    const G =
        getValue("columnG");


    const H =
        C + D + E + F + G;


    setValue(
        "columnH",
        H
    );


    /*
     * I = D
     */

    const I =
        D;


    setValue(
        "columnI",
        I
    );


    /*
     * J = H - I
     */

    const J =
        H - I;


    setValue(
        "columnJ",
        J
    );


    /*
     * O = K + N
     */

    const K =
        getValue("columnK");

    const N =
        getValue("columnN");


    const O =
        K + N;


    setValue(
        "columnO",
        O
    );


    /*
     * T = H - I - O
     */

    const T =
        H - I - O;


    setValue(
        "columnT",
        T
    );


    /*
     * U = IF(T < O, T, O)
     */

    const U =
        T < O
            ? T
            : O;


    setValue(
        "columnU",
        U
    );


    /*
     * R = -(U)
     */

    const R =
        -U;


    setValue(
        "columnR",
        R
    );


    /*
     * P = O - R
     */

    const P =
        O - R;


    setValue(
        "columnP",
        P
    );


    /*
     * Q = IF(T > O, T, O)
     */

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

    const rows =
        talapatrakBody.querySelectorAll(
            ".talapatrakRow"
        );


    rows.forEach(function(row) {

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
        FORMAT USER-ENTERED NUMBERS TO 2 DECIMAL PLACES
============================================================ */

function formatTalapatrakNumberInputs() {

    talapatrakBody
        .querySelectorAll(
            "input[type='number']"
        )
        .forEach(function(input) {

            /*
             * Prevent adding the same event listener
             * multiple times
             */

            if (
                input.dataset.decimalFormatterAttached
            ) {

                return;

            }


            input.dataset.decimalFormatterAttached =
                "true";


            input.addEventListener(
                "blur",
                function() {

                    if (
                        this.value !== ""
                    ) {

                        this.value =
                            Number(
                                this.value
                            ).toFixed(2);

                    }

                }

            );

        });

}

formatTalapatrakNumberInputs();

/* ============================================================
        PRINT TALAPATRAK
============================================================ */

const printTalapatrakButton =
    document.getElementById(
        "printTalapatrakButton"
    );


if (printTalapatrakButton) {

    printTalapatrakButton.addEventListener(
        "click",
        async function() {

            try {

                await saveTalapatrak();


                console.log(
                    "Talapatrak saved before printing."
                );


                window.print();

            }

            catch(error) {

                console.error(
                    "Error saving Talapatrak before print:",
                    error
                );


                alert(
                    "Talapatrak could not be saved."
                );

            }

        }

    );

}

/* ============================================================
        SAVE TALAPATRAK TO FIREBASE
============================================================ */

async function saveTalapatrak() {

    try {

        if (!auth.currentUser) {

            alert(
                "Please login before saving the Talapatrak."
            );

            return;

        }


        const rows =
            talapatrakBody.querySelectorAll(
                ".talapatrakRow"
            );


        const talapatrakRows =
            [];


        rows.forEach(function(row) {

            const rowData = {

                A: row.querySelector(
                    ".columnA"
                ).value || "",


                B: row.querySelector(
                    ".columnB"
                ).value || "",


                C: row.querySelector(
                    ".columnC"
                ).value || "",


                D: row.querySelector(
                    ".columnD"
                ).value || "",


                E: row.querySelector(
                    ".columnE"
                ).value || "",


                F: row.querySelector(
                    ".columnF"
                ).value || "",


                G: row.querySelector(
                    ".columnG"
                ).value || "",


                H: row.querySelector(
                    ".columnH"
                ).value || "",


                I: row.querySelector(
                    ".columnI"
                ).value || "",


                J: row.querySelector(
                    ".columnJ"
                ).value || "",


                K: row.querySelector(
                    ".columnK"
                ).value || "",


                L: row.querySelector(
                    ".columnL"
                ).value || "",


                M: row.querySelector(
                    ".columnM"
                ).value || "",


                N: row.querySelector(
                    ".columnN"
                ).value || "",


                O: row.querySelector(
                    ".columnO"
                ).value || "",


                P: row.querySelector(
                    ".columnP"
                ).value || "",


                Q: row.querySelector(
                    ".columnQ"
                ).value || "",


                R: row.querySelector(
                    ".columnR"
                ).value || "",


                S: row.querySelector(
                    ".columnS"
                ).value || "",


                T: row.querySelector(
                    ".columnT"
                ).value || "",


                U: row.querySelector(
                    ".columnU"
                ).value || ""

            };


            talapatrakRows.push(
                rowData
            );

        });


        const talapatrakData = {

            type:
                "talapatrak",


            rows:
                talapatrakRows,


            rowCount:
                talapatrakRows.length,


            userId:
                auth.currentUser.uid,


            userEmail:
                auth.currentUser.email,


            updatedAt:
                firebase.firestore.FieldValue.serverTimestamp(),


            createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

        };


        const savedDocument =
            await db
                .collection(
                    "talapatraks"
                )
                .add(
                    talapatrakData
                );


        console.log(
            "Talapatrak saved successfully:",
            savedDocument.id
        );


        alert(
            "Talapatrak saved successfully."
        );


    }

    catch(error) {

        console.error(
            "Error saving Talapatrak:",
            error
        );


        alert(
            "Talapatrak could not be saved: " +
            error.message
        );

    }

}

/* ============================================================
        SAVE BUTTON
============================================================ */

const saveTalapatrakButton =
    document.getElementById(
        "saveTalapatrakButton"
    );


if (saveTalapatrakButton) {

    saveTalapatrakButton.addEventListener(
        "click",
        async function() {

            saveTalapatrakButton.disabled =
                true;


            saveTalapatrakButton.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Saving...

            `;


            await saveTalapatrak();


            saveTalapatrakButton.disabled =
                false;


            saveTalapatrakButton.innerHTML = `

                <i class="fa-solid fa-floppy-disk"></i>

                Save

            `;

        }

    );

}
