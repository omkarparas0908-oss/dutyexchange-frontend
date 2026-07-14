document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // SELECT HTML ELEMENTS
    // ==========================================

    const sidebarLinks = document.querySelectorAll(".sidebar a");
    const main = document.querySelector(".main");
    const addClientButton = document.querySelector(".add-client-btn");

    // Save original Dashboard HTML
    const dashboardHTML = main.innerHTML;

    // Get clients from browser storage
    let clients = JSON.parse(localStorage.getItem("dutyExchangeClients")) || [];
    let sellScrips =
    JSON.parse(localStorage.getItem("dutyExchangeSellScrips")) || [];

       let buyDemands =
    JSON.parse(localStorage.getItem("dutyExchangeBuyDemands")) || [];
        let negotiations =
    JSON.parse(localStorage.getItem("dutyExchangeNegotiations")) || [];
    let transactions =
    JSON.parse(localStorage.getItem("dutyExchangeTransactions")) || [];
  
    // ==========================================
    // SAVE CLIENTS
    // ==========================================

    function saveClients() {

        localStorage.setItem(
            "dutyExchangeClients",
            JSON.stringify(clients)
        );

    }


    // ==========================================
    // SET ACTIVE SIDEBAR LINK
    // ==========================================

    function setActiveLink(clickedLink) {

        sidebarLinks.forEach(function (link) {
            link.classList.remove("active");
        });

        clickedLink.classList.add("active");

    }


    // ==========================================
    // UPDATE TOTAL CLIENT COUNT
    // ==========================================

    function updateTotalClients() {

        const cards = document.querySelectorAll(".card");

        cards.forEach(function (card) {

            const heading = card.querySelector("h3");
            const number = card.querySelector("h2");

            if (
                heading &&
                number &&
                heading.textContent.trim() === "Total Clients"
            ) {

                number.textContent = 50 + clients.length;

            }

        });

    }


    // ==========================================
    // CREATE ADD CLIENT FORM
    // ==========================================

    function createClientForm() {

        // Prevent duplicate forms

        const oldOverlay =
            document.querySelector("#clientFormOverlay");

        if (oldOverlay) {
            oldOverlay.remove();
        }


        const overlay = document.createElement("div");

        overlay.id = "clientFormOverlay";

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.45);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;


        overlay.innerHTML = `

            <div style="
                width: 380px;
                max-width: 85%;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.25);
            ">

                <h2 style="margin-bottom:25px;">
                    Add New Client
                </h2>


                <label>
                    Client Name
                </label>


                <input
                    id="clientName"
                    type="text"
                    placeholder="Enter client name"

                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:12px;
                        margin-top:7px;
                        margin-bottom:20px;
                    "
                >


                <label>
                    Client Type
                </label>


                <select
                    id="clientType"

                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:12px;
                        margin-top:7px;
                        margin-bottom:20px;
                    "
                >

                    <option value="">
                        Select Client Type
                    </option>

                    <option value="Importer">
                        Importer
                    </option>

                    <option value="Exporter">
                        Exporter
                    </option>

                </select>


                <button
                    id="saveClient"
                    type="button"
                    style="
                        padding:10px 18px;
                        cursor:pointer;
                    "
                >
                    Add Client
                </button>


                <button
                    id="cancelClient"
                    type="button"
                    style="
                        padding:10px 18px;
                        margin-left:10px;
                        cursor:pointer;
                    "
                >
                    Cancel
                </button>


                <p
                    id="clientMessage"
                    style="
                        margin-top:18px;
                    "
                ></p>

            </div>

        `;


        document.body.appendChild(overlay);


        const clientName =
            document.querySelector("#clientName");

        const clientType =
            document.querySelector("#clientType");

        const saveButton =
            document.querySelector("#saveClient");

        const cancelButton =
            document.querySelector("#cancelClient");

        const message =
            document.querySelector("#clientMessage");


        // Automatically focus Client Name

        clientName.focus();


        // SAVE CLIENT

        saveButton.addEventListener("click", function () {

            const name = clientName.value.trim();
            const type = clientType.value;


            if (name === "") {

                message.textContent =
                    "Please enter Client Name.";

                return;

            }


            if (type === "") {

                message.textContent =
                    "Please select Client Type.";

                return;

            }


            const newClient = {

                id: Date.now(),

                name: name,

                type: type

            };


            clients.push(newClient);


            saveClients();


            overlay.remove();


            showClientsPage();

        });


        // CANCEL BUTTON

        cancelButton.addEventListener("click", function () {

            overlay.remove();

        });


        // CLICK OUTSIDE FORM TO CLOSE

        overlay.addEventListener("click", function (event) {

            if (event.target === overlay) {

                overlay.remove();

            }

        });

    }


    // ==========================================
    // SHOW DASHBOARD
    // ==========================================

    function showDashboard() {

        main.innerHTML = dashboardHTML;


        updateTotalClients();
        updateDashboardTransactionCount();

        // Dashboard was recreated.
        // Select new Add Client button.

        const newAddClientButton =
            document.querySelector(".add-client-btn");


        if (newAddClientButton) {

            newAddClientButton.addEventListener(
                "click",
                createClientForm
            );

        }


        const viewAllButton =
            document.querySelector(".view-all-btn");


        if (viewAllButton) {

            viewAllButton.addEventListener(
                "click",
                showTransactionsPage
            );

        }

    }


    // ==========================================
    // SHOW CLIENTS PAGE
    // ==========================================

    function showClientsPage() {

        let clientRows = "";


        if (clients.length === 0) {

            clientRows = `

                <tr>

                    <td
                        colspan="4"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >

                        No clients added yet.

                    </td>

                </tr>

            `;

        } else {

            clients.forEach(function (client, index) {

                clientRows += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHTML(client.name)}
                        </td>

                        <td>
                            ${escapeHTML(client.type)}
                        </td>

                        <td>

                            <button
                                class="delete-client-btn"
                                data-id="${client.id}"
                                type="button"
                                style="
                                    cursor:pointer;
                                    padding:7px 12px;
                                "
                            >

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            });

        }


        main.innerHTML = `

            <div class="header">

                <div>

                    <h1>
                        Clients
                    </h1>

                    <p>
                        Manage DutyExchange Clients
                    </p>

                </div>


                <button
                    class="add-client-btn"
                    type="button"
                >

                    + Add Client

                </button>

            </div>


            <div class="table-container">

                <h2>
                    Client List
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Client Name
                            </th>

                            <th>
                                Client Type
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${clientRows}

                    </tbody>

                </table>

            </div>

        `;


        const newAddClientButton =
            document.querySelector(".add-client-btn");


        newAddClientButton.addEventListener(
            "click",
            createClientForm
        );


        // DELETE BUTTONS

        const deleteButtons =
            document.querySelectorAll(".delete-client-btn");


        deleteButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const clientId =
                    Number(this.dataset.id);


                clients = clients.filter(
                    function (client) {

                        return client.id !== clientId;

                    }
                );


                saveClients();


                showClientsPage();

            });

        });

    }


    // ==========================================
    // PLACEHOLDER PAGE
    // ==========================================
// ==========================================
// SAVE SELL SCRIPS
// ==========================================

function saveSellScrips() {
    localStorage.setItem(
        "dutyExchangeSellScrips",
        JSON.stringify(sellScrips)
    );
}


// ==========================================
// CREATE ADD SCRIP FORM
// ==========================================

function createSellScripForm() {

    const oldOverlay = document.querySelector("#sellScripFormOverlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }

    const overlay = document.createElement("div");

    overlay.id = "sellScripFormOverlay";

    overlay.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.45);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
    `;

    overlay.innerHTML = `
        <div style="
            width:400px;
            max-width:85%;
            background:white;
            padding:30px;
            border-radius:12px;
            box-shadow:0 10px 40px rgba(0,0,0,0.25);
        ">

            <h2 style="margin-bottom:25px;">
                Add Sell Scrip
            </h2>

            <label>Client</label>

            <select
                id="scripClient"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >
                <option value="">Select Client</option>

                ${clients.map(function (client) {
                    return `
                        <option value="${escapeHTML(client.name)}">
                            ${escapeHTML(client.name)}
                        </option>
                    `;
                }).join("")}

            </select>


            <label>Scrip Type</label>

            <select
                id="scripType"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >

                <option value="">Select Scrip Type</option>
                <option value="MEIS">MEIS</option>
                <option value="RoDTEP">RoDTEP</option>
                <option value="RoSCTL">RoSCTL</option>
                <option value="SEIS">SEIS</option>

            </select>


            <label>Face Value</label>

            <input
                id="scripAmount"
                type="number"
                min="1"
                placeholder="Enter face value"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >


            <label>Selling Price</label>

            <input
                id="scripPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter selling price"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:20px;
                "
            >


            <button
                id="saveSellScrip"
                type="button"
                style="
                    padding:10px 18px;
                    cursor:pointer;
                "
            >
                Add Scrip
            </button>


            <button
                id="cancelSellScrip"
                type="button"
                style="
                    padding:10px 18px;
                    margin-left:10px;
                    cursor:pointer;
                "
            >
                Cancel
            </button>


            <p
                id="sellScripMessage"
                style="margin-top:18px;"
            ></p>

        </div>
    `;

    document.body.appendChild(overlay);


    const saveButton = document.querySelector("#saveSellScrip");

    const cancelButton = document.querySelector("#cancelSellScrip");

    const message = document.querySelector("#sellScripMessage");


    saveButton.addEventListener("click", function () {

        const client =
            document.querySelector("#scripClient").value;

        const type =
            document.querySelector("#scripType").value;

        const amount =
            document.querySelector("#scripAmount").value;

        const price =
            document.querySelector("#scripPrice").value;


        if (client === "") {
            message.textContent = "Please select Client.";
            return;
        }


        if (type === "") {
            message.textContent = "Please select Scrip Type.";
            return;
        }


        if (amount === "" || Number(amount) <= 0) {
            message.textContent = "Please enter valid Face Value.";
            return;
        }


        if (price === "" || Number(price) < 0) {
            message.textContent = "Please enter valid Selling Price.";
            return;
        }


        const newScrip = {

            id: Date.now(),

            client: client,

            type: type,

            amount: Number(amount),

            price: Number(price)

        };


        sellScrips.push(newScrip);

        saveSellScrips();

        overlay.remove();

        showSellScripsPage();

    });


    cancelButton.addEventListener("click", function () {
        overlay.remove();
    });


    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            overlay.remove();
        }

    });

}


// ==========================================
// SHOW SELL SCRIPS PAGE
// ==========================================

function showSellScripsPage() {

    let rows = "";


    if (sellScrips.length === 0) {

        rows = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No sell scrips added yet.
                </td>
            </tr>
        `;

    } else {

        sellScrips.forEach(function (scrip, index) {

            rows += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${escapeHTML(scrip.client)}</td>

                    <td>${escapeHTML(scrip.type)}</td>

                    <td>
                        ₹${Number(scrip.amount).toLocaleString("en-IN")}
                    </td>

                    <td>
                        ₹${Number(scrip.price).toLocaleString("en-IN")}
                    </td>

                    <td>
                        <button
                            class="delete-scrip-btn"
                            data-id="${scrip.id}"
                            type="button"
                            style="
                                cursor:pointer;
                                padding:7px 12px;
                            "
                        >
                            Delete
                        </button>
                    </td>

                </tr>
            `;

        });

    }


    main.innerHTML = `

        <div class="header">

            <div>

                <h1>Sell Scrips</h1>

                <p>
                    Manage scrips available for sale
                </p>

            </div>


            <button
                class="add-scrip-btn"
                type="button"
            >
                + Add Scrip
            </button>

        </div>


        <div class="table-container">

            <h2>Available Sell Scrips</h2>


            <table>

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Client</th>

                        <th>Scrip Type</th>

                        <th>Face Value</th>

                        <th>Selling Price</th>

                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>
    `;


    document
        .querySelector(".add-scrip-btn")
        .addEventListener(
            "click",
            createSellScripForm
        );


    const deleteButtons =
        document.querySelectorAll(".delete-scrip-btn");


    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const scripId = Number(this.dataset.id);


            sellScrips = sellScrips.filter(
                function (scrip) {

                    return scrip.id !== scripId;

                }
            );


            saveSellScrips();

            showSellScripsPage();

        });

    });

}
// ==========================================
// SAVE NEGOTIATIONS
// ==========================================

function saveNegotiations() {
    localStorage.setItem(
        "dutyExchangeNegotiations",
        JSON.stringify(negotiations)
    );
}


// ==========================================
// CREATE NEGOTIATION FORM
// ==========================================

function createNegotiationForm() {

    const oldOverlay =
        document.querySelector("#negotiationFormOverlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }


    const overlay = document.createElement("div");

    overlay.id = "negotiationFormOverlay";

    overlay.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.45);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
    `;


    overlay.innerHTML = `

        <div style="
            width:450px;
            max-width:85%;
            background:white;
            padding:30px;
            border-radius:12px;
            box-shadow:0 10px 40px rgba(0,0,0,0.25);
        ">

            <h2 style="margin-bottom:25px;">
                Create Negotiation
            </h2>


            <label>Seller Scrip</label>

            <select
                id="negotiationScrip"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >

                <option value="">
                    Select Seller Scrip
                </option>

                ${sellScrips.map(function (scrip) {

                    return `

                        <option value="${scrip.id}">

                            ${escapeHTML(scrip.client)}
                            -
                            ${escapeHTML(scrip.type)}
                            -
                            ₹${Number(scrip.amount).toLocaleString("en-IN")}

                        </option>

                    `;

                }).join("")}

            </select>


            <label>Buyer Demand</label>

            <select
                id="negotiationDemand"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >

                <option value="">
                    Select Buyer Demand
                </option>

                ${buyDemands.map(function (demand) {

                    return `

                        <option value="${demand.id}">

                            ${escapeHTML(demand.client)}
                            -
                            ${escapeHTML(demand.type)}
                            -
                            ₹${Number(demand.amount).toLocaleString("en-IN")}

                        </option>

                    `;

                }).join("")}

            </select>


            <label>Negotiated Amount</label>

            <input
                id="negotiationAmount"
                type="number"
                min="1"
                placeholder="Enter negotiated amount"

                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >


            <button
                id="saveNegotiation"
                type="button"

                style="
                    padding:10px 18px;
                    cursor:pointer;
                "
            >

                Create Negotiation

            </button>


            <button
                id="cancelNegotiation"
                type="button"

                style="
                    padding:10px 18px;
                    margin-left:10px;
                    cursor:pointer;
                "
            >

                Cancel

            </button>


            <p
                id="negotiationMessage"
                style="margin-top:18px;"
            ></p>

        </div>

    `;


    document.body.appendChild(overlay);


    const saveButton =
        document.querySelector("#saveNegotiation");

    const cancelButton =
        document.querySelector("#cancelNegotiation");

    const message =
        document.querySelector("#negotiationMessage");


    saveButton.addEventListener("click", function () {

        const scripId =
            Number(
                document.querySelector("#negotiationScrip").value
            );


        const demandId =
            Number(
                document.querySelector("#negotiationDemand").value
            );


        const amount =
            Number(
                document.querySelector("#negotiationAmount").value
            );


        const selectedScrip =
            sellScrips.find(function (scrip) {
                return scrip.id === scripId;
            });


        const selectedDemand =
            buyDemands.find(function (demand) {
                return demand.id === demandId;
            });


        if (!selectedScrip) {

            message.textContent =
                "Please select Seller Scrip.";

            return;

        }


        if (!selectedDemand) {

            message.textContent =
                "Please select Buyer Demand.";

            return;

        }


        if (selectedScrip.type !== selectedDemand.type) {

            message.textContent =
                "Seller Scrip and Buyer Demand must have same Scrip Type.";

            return;

        }


        if (!amount || amount <= 0) {

            message.textContent =
                "Please enter valid Negotiated Amount.";

            return;

        }


        const newNegotiation = {

            id: Date.now(),

            seller: selectedScrip.client,

            buyer: selectedDemand.client,

            type: selectedScrip.type,

            amount: amount,

            status: "Pending"

        };


        negotiations.push(newNegotiation);


        saveNegotiations();


        overlay.remove();


        showNegotiationsPage();

    });


    cancelButton.addEventListener("click", function () {

        overlay.remove();

    });


    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {
            overlay.remove();
        }

    });

}


// ==========================================
// SHOW NEGOTIATIONS PAGE
// ==========================================

function showNegotiationsPage() {

    let rows = "";


    if (negotiations.length === 0) {

        rows = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No negotiations created yet.

                </td>

            </tr>

        `;

    } else {


        negotiations.forEach(function (negotiation, index) {


            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${escapeHTML(negotiation.seller)}
                    </td>


                    <td>
                        ${escapeHTML(negotiation.buyer)}
                    </td>


                    <td>
                        ${escapeHTML(negotiation.type)}
                    </td>


                    <td>

                        ₹${Number(
                            negotiation.amount
                        ).toLocaleString("en-IN")}

                    </td>


                    <td>

                        <select
                            class="negotiation-status"
                            data-id="${negotiation.id}"
                        >

                            <option
                                value="Pending"
                                ${
                                    negotiation.status === "Pending"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Pending
                            </option>


                            <option
                                value="Accepted"
                                ${
                                    negotiation.status === "Accepted"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Accepted
                            </option>


                            <option
                                value="Rejected"
                                ${
                                    negotiation.status === "Rejected"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Rejected
                            </option>

                        </select>

                    </td>


                    <td>

                        <button
                            class="delete-negotiation-btn"
                            data-id="${negotiation.id}"
                            type="button"
                        >

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    main.innerHTML = `

        <div class="header">

            <div>

                <h1>
                    Negotiations
                </h1>


                <p>
                    Manage seller and buyer negotiations
                </p>

            </div>


            <button
                class="add-negotiation-btn"
                type="button"
            >

                + Create Negotiation

            </button>

        </div>


        <div class="table-container">


            <h2>
                Negotiation List
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Seller</th>

                        <th>Buyer</th>

                        <th>Scrip Type</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;


    document
        .querySelector(".add-negotiation-btn")
        .addEventListener(
            "click",
            createNegotiationForm
        );


    // STATUS CHANGE

    const statusSelectors =
        document.querySelectorAll(".negotiation-status");


    statusSelectors.forEach(function (selector) {

        selector.addEventListener("change", function () {

            const negotiationId =
                Number(this.dataset.id);


            const negotiation =
                negotiations.find(function (item) {

                    return item.id === negotiationId;

                });


            if (negotiation) {

    negotiation.status = this.value;

    saveNegotiations();

    if (this.value === "Accepted") {

        createTransactionFromNegotiation(negotiation);

    }

}

        });

    });


    // DELETE NEGOTIATION

    const deleteButtons =
        document.querySelectorAll(
            ".delete-negotiation-btn"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const negotiationId =
                Number(this.dataset.id);


            negotiations =
                negotiations.filter(function (negotiation) {

                    return negotiation.id !== negotiationId;

                });


            saveNegotiations();


            showNegotiationsPage();

        });

    });

}
// ==========================================
// SAVE TRANSACTIONS
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "dutyExchangeTransactions",
        JSON.stringify(transactions)
    );

}


// ==========================================
// GENERATE TRANSACTION ID
// ==========================================

function generateTransactionId() {

    const year = new Date().getFullYear();

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return "DX-" + year + "-" + randomNumber;

}


// ==========================================
// CREATE TRANSACTION FROM NEGOTIATION
// ==========================================

function createTransactionFromNegotiation(negotiation) {

    // Prevent duplicate transaction

    const alreadyExists =
        transactions.some(function (transaction) {

            return (
                transaction.negotiationId === negotiation.id
            );

        });


    if (alreadyExists) {

        return;

    }


    const newTransaction = {

        id: Date.now(),

        transactionId: generateTransactionId(),

        negotiationId: negotiation.id,

        seller: negotiation.seller,

        buyer: negotiation.buyer,

        type: negotiation.type,

        amount: negotiation.amount,

        currentStep: "KYC Verification",

        status: "In Progress",

        createdAt: new Date().toLocaleString("en-IN")

    };


    transactions.push(newTransaction);


    saveTransactions();


    updateDashboardTransactionCount();

}


// ==========================================
// UPDATE DASHBOARD TRANSACTION COUNT
// ==========================================

function updateDashboardTransactionCount() {

    const cards =
        document.querySelectorAll(".card");


    cards.forEach(function (card) {

        const heading =
            card.querySelector("h3");


        const number =
            card.querySelector("h2");


        if (
            heading &&
            number &&
            heading.textContent.trim() === "Total Transactions"
        ) {

            number.textContent =
                transactions.length;

        }

    });

}


// ==========================================
// UPDATE TRANSACTION
// ==========================================

function updateTransaction(
    transactionId,
    newStep,
    newStatus
) {

    const transaction =
        transactions.find(function (item) {

            return item.id === transactionId;

        });


    if (!transaction) {

        return;

    }


    transaction.currentStep = newStep;

    transaction.status = newStatus;


    saveTransactions();


    showTransactionsPage();

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(transactionId) {

    transactions =
        transactions.filter(function (transaction) {

            return transaction.id !== transactionId;

        });


    saveTransactions();


    showTransactionsPage();

}


// ==========================================
// SHOW TRANSACTIONS PAGE
// ==========================================

function showTransactionsPage() {

    let rows = "";


    if (transactions.length === 0) {

        rows = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No transactions created yet.

                </td>

            </tr>

        `;

    } else {


        transactions.forEach(function (
            transaction,
            index
        ) {


            rows += `

                <tr>


                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        ${escapeHTML(
                            transaction.transactionId
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            transaction.seller
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            transaction.buyer
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            transaction.type
                        )}

                    </td>


                    <td>

                        ₹${Number(
                            transaction.amount
                        ).toLocaleString("en-IN")}

                    </td>


                    <td>


                        <select
                            class="transaction-step"
                            data-id="${transaction.id}"
                        >


                            <option
                                value="KYC Verification"

                                ${
                                    transaction.currentStep ===
                                    "KYC Verification"

                                    ? "selected"

                                    : ""
                                }
                            >

                                KYC Verification

                            </option>


                            <option
                                value="Escrow Account Creation"

                                ${
                                    transaction.currentStep ===
                                    "Escrow Account Creation"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Escrow Account Creation

                            </option>


                            <option
                                value="Agreement Generation"

                                ${
                                    transaction.currentStep ===
                                    "Agreement Generation"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Agreement Generation

                            </option>


                            <option
                                value="Invoice Generated"

                                ${
                                    transaction.currentStep ===
                                    "Invoice Generated"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Invoice Generated

                            </option>


                            <option
                                value="Buyer Funding Escrow"

                                ${
                                    transaction.currentStep ===
                                    "Buyer Funding Escrow"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Buyer Funding Escrow

                            </option>


                            <option
                                value="Scrip Transfer"

                                ${
                                    transaction.currentStep ===
                                    "Scrip Transfer"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Scrip Transfer

                            </option>


                            <option
                                value="Fund Release"

                                ${
                                    transaction.currentStep ===
                                    "Fund Release"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Fund Release

                            </option>


                            <option
                                value="Completed"

                                ${
                                    transaction.currentStep ===
                                    "Completed"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Completed

                            </option>


                        </select>


                    </td>


                    <td>


                        <select
                            class="transaction-status"
                            data-id="${transaction.id}"
                        >


                            <option
                                value="In Progress"

                                ${
                                    transaction.status ===
                                    "In Progress"

                                    ? "selected"

                                    : ""
                                }
                            >

                                In Progress

                            </option>


                            <option
                                value="On Hold"

                                ${
                                    transaction.status ===
                                    "On Hold"

                                    ? "selected"

                                    : ""
                                }
                            >

                                On Hold

                            </option>


                            <option
                                value="Success"

                                ${
                                    transaction.status ===
                                    "Success"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Success

                            </option>


                            <option
                                value="Failed"

                                ${
                                    transaction.status ===
                                    "Failed"

                                    ? "selected"

                                    : ""
                                }
                            >

                                Failed

                            </option>


                        </select>


                    </td>


                    <td>


                        <button
                            class="delete-transaction-btn"
                            data-id="${transaction.id}"
                            type="button"
                        >

                            Delete

                        </button>


                    </td>


                </tr>

            `;

        });

    }


    main.innerHTML = `


        <div class="header">


            <div>


                <h1>

                    Transactions

                </h1>


                <p>

                    Track DutyExchange transaction lifecycle

                </p>


            </div>


        </div>


        <div class="table-container">


            <h2>

                Transaction Tracker

            </h2>


            <table>


                <thead>


                    <tr>


                        <th>#</th>

                        <th>Transaction ID</th>

                        <th>Seller</th>

                        <th>Buyer</th>

                        <th>Scrip</th>

                        <th>Amount</th>

                        <th>Current Step</th>

                        <th>Status</th>

                        <th>Action</th>


                    </tr>


                </thead>


                <tbody>


                    ${rows}


                </tbody>


            </table>


        </div>


    `;


    // ==========================================
    // TRANSACTION STEP CHANGE
    // ==========================================


    const stepSelectors =
        document.querySelectorAll(
            ".transaction-step"
        );


    stepSelectors.forEach(function (selector) {


        selector.addEventListener(
            "change",
            function () {


                const transactionId =
                    Number(this.dataset.id);


                const transaction =
                    transactions.find(
                        function (item) {

                            return (
                                item.id ===
                                transactionId
                            );

                        }
                    );


                if (!transaction) {

                    return;

                }


                transaction.currentStep =
                    this.value;


                // Automatically complete transaction

                if (
                    this.value === "Completed"
                ) {

                    transaction.status =
                        "Success";

                }


                saveTransactions();


                showTransactionsPage();


            }
        );


    });


    // ==========================================
    // TRANSACTION STATUS CHANGE
    // ==========================================


    const statusSelectors =
        document.querySelectorAll(
            ".transaction-status"
        );


    statusSelectors.forEach(function (selector) {


        selector.addEventListener(
            "change",
            function () {


                const transactionId =
                    Number(this.dataset.id);


                const transaction =
                    transactions.find(
                        function (item) {

                            return (
                                item.id ===
                                transactionId
                            );

                        }
                    );


                if (!transaction) {

                    return;

                }


                transaction.status =
                    this.value;


                saveTransactions();


                showTransactionsPage();


            }
        );


    });


    // ==========================================
    // DELETE TRANSACTION
    // ==========================================


    const deleteButtons =
        document.querySelectorAll(
            ".delete-transaction-btn"
        );


    deleteButtons.forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                const transactionId =
                    Number(this.dataset.id);


                deleteTransaction(
                    transactionId
                );


            }
        );


    });

}
    function showPlaceholderPage(pageName, description) {

        main.innerHTML = `

            <div class="header">

                <div>

                    <h1>
                        ${pageName}
                    </h1>

                    <p>
                        ${description}
                    </p>

                </div>

            </div>


            <div class="table-container">

                <h2>
                    ${pageName}
                </h2>


                <p style="margin-top:20px;">

                    This section is ready for the next feature.

                </p>

            </div>

        `;

    }


    // ==========================================
    // TRANSACTIONS PAGE
    // ==========================================

    
      // ==========================================
// SAVE BUY DEMANDS
// ==========================================

function saveBuyDemands() {

    localStorage.setItem(
        "dutyExchangeBuyDemands",
        JSON.stringify(buyDemands)
    );

}


// ==========================================
// CREATE ADD DEMAND FORM
// ==========================================

function createBuyDemandForm() {

    const oldOverlay =
        document.querySelector("#buyDemandFormOverlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }


    const overlay = document.createElement("div");

    overlay.id = "buyDemandFormOverlay";


    overlay.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.45);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
    `;


    overlay.innerHTML = `

        <div style="
            width:400px;
            max-width:85%;
            background:white;
            padding:30px;
            border-radius:12px;
            box-shadow:0 10px 40px rgba(0,0,0,0.25);
        ">

            <h2 style="margin-bottom:25px;">
                Add Buy Demand
            </h2>


            <label>
                Client
            </label>


            <select
                id="demandClient"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >

                <option value="">
                    Select Client
                </option>


                ${clients.map(function (client) {

                    return `

                        <option value="${escapeHTML(client.name)}">

                            ${escapeHTML(client.name)}

                        </option>

                    `;

                }).join("")}

            </select>


            <label>
                Scrip Type
            </label>


            <select
                id="demandScripType"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >

                <option value="">
                    Select Scrip Type
                </option>

                <option value="MEIS">
                    MEIS
                </option>

                <option value="RoDTEP">
                    RoDTEP
                </option>

                <option value="RoSCTL">
                    RoSCTL
                </option>

                <option value="SEIS">
                    SEIS
                </option>

            </select>


            <label>
                Required Face Value
            </label>


            <input
                id="demandAmount"
                type="number"
                min="1"
                placeholder="Enter required face value"

                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:18px;
                "
            >


            <label>
                Buying Price
            </label>


            <input
                id="demandPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter buying price"

                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-top:7px;
                    margin-bottom:20px;
                "
            >


            <button
                id="saveBuyDemand"
                type="button"

                style="
                    padding:10px 18px;
                    cursor:pointer;
                "
            >

                Add Demand

            </button>


            <button
                id="cancelBuyDemand"
                type="button"

                style="
                    padding:10px 18px;
                    margin-left:10px;
                    cursor:pointer;
                "
            >

                Cancel

            </button>


            <p
                id="buyDemandMessage"
                style="margin-top:18px;"
            ></p>

        </div>

    `;


    document.body.appendChild(overlay);


    const saveButton =
        document.querySelector("#saveBuyDemand");

    const cancelButton =
        document.querySelector("#cancelBuyDemand");

    const message =
        document.querySelector("#buyDemandMessage");


    // ==========================================
    // SAVE DEMAND
    // ==========================================

    saveButton.addEventListener("click", function () {

        const client =
            document.querySelector("#demandClient").value;


        const type =
            document.querySelector("#demandScripType").value;


        const amount =
            document.querySelector("#demandAmount").value;


        const price =
            document.querySelector("#demandPrice").value;


        if (client === "") {

            message.textContent =
                "Please select Client.";

            return;

        }


        if (type === "") {

            message.textContent =
                "Please select Scrip Type.";

            return;

        }


        if (
            amount === "" ||
            Number(amount) <= 0
        ) {

            message.textContent =
                "Please enter valid Required Face Value.";

            return;

        }


        if (
            price === "" ||
            Number(price) < 0
        ) {

            message.textContent =
                "Please enter valid Buying Price.";

            return;

        }


        const newDemand = {

            id: Date.now(),

            client: client,

            type: type,

            amount: Number(amount),

            price: Number(price)

        };


        buyDemands.push(newDemand);


        saveBuyDemands();


        overlay.remove();


        showBuyDemandsPage();

    });


    // CANCEL

    cancelButton.addEventListener("click", function () {

        overlay.remove();

    });


    // CLICK OUTSIDE FORM

    overlay.addEventListener("click", function (event) {

        if (event.target === overlay) {

            overlay.remove();

        }

    });

}


// ==========================================
// SHOW BUY DEMANDS PAGE
// ==========================================

function showBuyDemandsPage() {

    let rows = "";


    if (buyDemands.length === 0) {

        rows = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No buy demands added yet.

                </td>

            </tr>

        `;

    } else {


        buyDemands.forEach(function (demand, index) {


            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${escapeHTML(demand.client)}
                    </td>


                    <td>
                        ${escapeHTML(demand.type)}
                    </td>


                    <td>

                        ₹${Number(
                            demand.amount
                        ).toLocaleString("en-IN")}

                    </td>


                    <td>

                        ₹${Number(
                            demand.price
                        ).toLocaleString("en-IN")}

                    </td>


                    <td>

                        <button
                            class="delete-demand-btn"
                            data-id="${demand.id}"
                            type="button"

                            style="
                                cursor:pointer;
                                padding:7px 12px;
                            "
                        >

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }


    main.innerHTML = `

        <div class="header">

            <div>

                <h1>
                    Buy Demands
                </h1>


                <p>
                    Manage buyer requirements and demands
                </p>

            </div>


            <button
                class="add-demand-btn"
                type="button"
            >

                + Add Demand

            </button>

        </div>


        <div class="table-container">


            <h2>
                Buy Demand List
            </h2>


            <table>


                <thead>

                    <tr>

                        <th>#</th>

                        <th>Client</th>

                        <th>Scrip Type</th>

                        <th>Required Face Value</th>

                        <th>Buying Price</th>

                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>


            </table>

        </div>

    `;


    // ADD DEMAND BUTTON

    document
        .querySelector(".add-demand-btn")
        .addEventListener(
            "click",
            createBuyDemandForm
        );


    // DELETE DEMAND BUTTONS

    const deleteButtons =
        document.querySelectorAll(".delete-demand-btn");


    deleteButtons.forEach(function (button) {


        button.addEventListener("click", function () {


            const demandId =
                Number(this.dataset.id);


            buyDemands = buyDemands.filter(

                function (demand) {

                    return demand.id !== demandId;

                }

            );


            saveBuyDemands();


            showBuyDemandsPage();

        });

    });

}

    // ==========================================
    // SECURITY FUNCTION
    // Prevent HTML code inside client name
    // ==========================================

    function escapeHTML(text) {

        const element =
            document.createElement("div");

        element.textContent = text;

        return element.innerHTML;

    }


    // ==========================================
    // SIDEBAR NAVIGATION
    // ==========================================

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();


            const pageName =
                this.textContent.trim();


            setActiveLink(this);


            if (pageName === "Dashboard") {

                showDashboard();

            }


            else if (pageName === "Clients") {

                showClientsPage();

            }


            else if (pageName === "Sell Scrips") {

    showSellScripsPage();

}


            else if (pageName === "Buy Demands") {

    showBuyDemandsPage();

}


           else if (pageName === "Negotiations") {

    showNegotiationsPage();

}

            else if (pageName === "Transactions") {

                showTransactionsPage();

            }

        });

    });


    // ==========================================
    // FIRST PAGE LOAD
    // ==========================================

    if (addClientButton) {

        addClientButton.addEventListener(
            "click",
            createClientForm
        );

    }


    updateTotalClients();

});