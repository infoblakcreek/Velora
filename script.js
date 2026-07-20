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

auth.onAuthStateChanged(
    function (user) {

        if (user) {

            console.log(
                "User is logged in:",
                user.email
            );


            loginScreen.style.display =
                "none";


            dashboardView.style.display =
                "block";


            loadDashboardStats();

            loadRecentBills();

        }

        else {

            console.log(
                "No user logged in"
            );


            loginScreen.style.display =
                "flex";


            dashboardView.style.display =
                "none";

        }

    }
);

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

loadDashboardStats();

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

loadRecentBills();

/* ==========================================
        OPEN MAIN BILL DATABASE
========================================== */

if (mainBillNav) {

    mainBillNav.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            dashboardView.style.display =
                "none";


            invoiceView.style.display =
                "none";


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
    );

}


/* ==========================================
        LOAD ALL MAIN BILLS
========================================== */

async function loadAllMainBills() {

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


        if (snapshot.empty) {

            mainBillsBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="loadingBills">

                        No bills saved yet.

                    </td>

                </tr>

            `;

            return;

        }


        snapshot.forEach(
            function(doc) {

                const bill =
                    doc.data();


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


printBillBtn.addEventListener(
    "click",
    function(){

        /*
        ==========================================
            UPDATE PRINTABLE BILL
        ==========================================
        */

        generatePrintableBills();


        /*
        ==========================================
            SHOW CUT LINE FOR PRINTING
        ==========================================
        */

        document.body.classList.add(
            "showCutLine"
        );


        /*
        ==========================================
            PRINT
        ==========================================
        */

        window.print();

    }
);


// ==========================================
// AFTER PRINT
// ==========================================

window.addEventListener(
    "afterprint",
    async function(){

        /*
        ==========================================
            SAVE ENTIRE FORM AFTER PRINT
        ==========================================
        */

        try {

            await saveCurrentBill();


            console.log(
                "Bill automatically saved after printing."
            );


        } catch(error) {

            console.error(
                "Error automatically saving bill:",
                error
            );

        }


        /*
        ==========================================
            REMOVE PRINT-ONLY STYLES
        ==========================================
        */

        document.body.classList.remove(
            "showCutLine"
        );

    }
);
