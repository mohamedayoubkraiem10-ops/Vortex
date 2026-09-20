document.addEventListener("DOMContentLoaded", () => {

   

    const loader = document.querySelector(".loader");

  
    setTimeout(() => {
        if (loader) {
            loader.classList.add("hide");

            setTimeout(() => {
                loader.style.display = "none";
            }, 700);
        }
    }, 1500);


    

    const menu = document.querySelector(".menu");
    const nav = document.querySelector(".nav");

    if (menu && nav) {

        menu.addEventListener("click", () => {
            nav.classList.toggle("open");
        });

        document.querySelectorAll(".nav a").forEach(link => {

            link.addEventListener("click", () => {
                nav.classList.remove("open");
            });

        });

    }
    


    

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    
    const sections =
        document.querySelectorAll("section[id]");

    const links =
        document.querySelectorAll(".nav a");


    function updateNavigation() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 250;

            if (window.scrollY >= sectionTop) {
                currentSection = section.id;
            }

        });


        links.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (href === "#" + currentSection) {
                link.classList.add("active");
            }

        });

    }


    window.addEventListener(
        "scroll",
        updateNavigation
    );

    updateNavigation();


   

    const playButton =
        document.querySelector(".play");

    if (playButton) {

        playButton.addEventListener("click", () => {

            if (playButton.textContent.trim() === "▶") {

                playButton.textContent = "Ⅱ";

            } else {

                playButton.textContent = "▶";

            }

        });

    }

});


/* =========================================================
   VORTEX SHOP — CART + FILTERS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const shopFilters =
        document.querySelectorAll(".shop-filter");

    const shopProducts =
        document.querySelectorAll(".shop-product");

    const addButtons =
        document.querySelectorAll(".add-cart");

    const cartItems =
        document.getElementById("shopCartItems");

    const cartCount =
        document.getElementById("shopCartCount");

    const cartTotal =
        document.getElementById("shopCartTotal");

    const checkoutButton =
        document.getElementById("shopCheckout");


    /* -----------------------------------------------------
       STOP IF SHOP IS NOT ON THIS PAGE
    ----------------------------------------------------- */

    if (!cartItems) {
        return;
    }


    /* -----------------------------------------------------
       CART STORAGE
    ----------------------------------------------------- */

    const CART_STORAGE_KEY =
        "vortexShopCart";


    let shopCart = [];


    /* -----------------------------------------------------
       LOAD CART
    ----------------------------------------------------- */

    try {

        const savedCart =
            localStorage.getItem(
                CART_STORAGE_KEY
            );


        if (savedCart) {

            shopCart =
                JSON.parse(savedCart);

        }

    } catch (error) {

        console.error(
            "VORTEX Cart Load Error:",
            error
        );

        shopCart = [];

    }


    /* -----------------------------------------------------
       SAVE CART
    ----------------------------------------------------- */

    function saveCart() {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(shopCart)
            );

        } catch (error) {

            console.error(
                "VORTEX Cart Save Error:",
                error
            );

        }

    }


    /* =====================================================
       SHOP FILTERS
    ===================================================== */

    shopFilters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                shopFilters.forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });


                filter.classList.add(
                    "active"
                );


                const category =
                    filter.dataset.category;


                shopProducts.forEach(product => {

                    const productCategory =
                        product.dataset.category;


                    if (
                        category === "all" ||
                        productCategory === category
                    ) {

                        product.classList.remove(
                            "shop-product-hidden"
                        );

                    } else {

                        product.classList.add(
                            "shop-product-hidden"
                        );

                    }

                });

            }
        );

    });


    /* =====================================================
       ADD TO CART
    ===================================================== */

    addButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    button.dataset.id;

                const name =
                    button.dataset.name;

                const price =
                    Number(
                        button.dataset.price
                    );

                const image =
                    button.dataset.image;


                if (!id || !name || !price) {
                    return;
                }


                /* FIND EXISTING PRODUCT */

                const existingProduct =
                    shopCart.find(
                        item =>
                            item.id === id
                    );


                if (existingProduct) {

                    existingProduct.quantity += 1;

                } else {

                    shopCart.push({

                        id: id,

                        name: name,

                        price: price,

                        image: image,

                        quantity: 1

                    });

                }


                saveCart();

                updateShopCart();


                /* BUTTON FEEDBACK */

                const originalText =
                    button.textContent;


                button.textContent =
                    "ADDED ✓";


                button.classList.add(
                    "cart-added"
                );


                setTimeout(() => {

                    button.textContent =
                        originalText;

                    button.classList.remove(
                        "cart-added"
                    );

                }, 900);

            }
        );

    });


    /* =====================================================
       UPDATE CART
    ===================================================== */

    function updateShopCart() {

        if (!shopCart.length) {

            cartItems.innerHTML = `

                <div class="cart-empty">

                    <span class="cart-empty-icon">
                        🛒
                    </span>

                    <strong>
                        YOUR CART IS EMPTY
                    </strong>

                    <p>
                        Add products to your cart.
                    </p>

                </div>

            `;


            cartCount.textContent =
                "0 ITEMS";


            cartTotal.textContent =
                "€0.00";


            checkoutButton.disabled =
                true;


            checkoutButton.classList.add(
                "checkout-disabled"
            );


            return;

        }


        cartItems.innerHTML = "";


        let total =
            0;

        let totalQuantity =
            0;


        shopCart.forEach(
            (item, index) => {

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(item.price) || 0;


                const itemTotal =
                    price * quantity;


                total +=
                    itemTotal;


                totalQuantity +=
                    quantity;


                const cartElement =
                    document.createElement(
                        "div"
                    );


                cartElement.className =
                    "shop-cart-item";


                cartElement.innerHTML = `

                    <div class="cart-product-image">

                        ${
                            item.image
                            ?
                            `
                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >
                            `
                            :
                            `
                            <span>V</span>
                            `
                        }

                    </div>


                    <div class="cart-product-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <span class="cart-unit-price">
                            €${price.toFixed(2)} each
                        </span>


                        <div class="cart-product-bottom">

                            <div class="cart-quantity">

                                <button
                                    type="button"
                                    class="cart-quantity-btn"
                                    data-action="decrease"
                                    data-index="${index}">
                                    −
                                </button>


                                <strong>
                                    ${quantity}
                                </strong>


                                <button
                                    type="button"
                                    class="cart-quantity-btn"
                                    data-action="increase"
                                    data-index="${index}">
                                    +
                                </button>

                            </div>


                            <strong class="cart-item-price">
                                €${itemTotal.toFixed(2)}
                            </strong>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="remove-cart"
                        data-index="${index}"
                        aria-label="Remove ${item.name}">
                        ×
                    </button>

                `;


                cartItems.appendChild(
                    cartElement
                );

            }
        );


        /* CART TOTAL */

        cartCount.textContent =
            `${totalQuantity} ${
                totalQuantity === 1
                ? "ITEM"
                : "ITEMS"
            }`;


        cartTotal.textContent =
            `€${total.toFixed(2)}`;


        checkoutButton.disabled =
            false;


        checkoutButton.classList.remove(
            "checkout-disabled"
        );


        bindCartButtons();

    }


    /* =====================================================
       CART BUTTONS
    ===================================================== */

    function bindCartButtons() {

        /* PLUS / MINUS */

        document
            .querySelectorAll(
                ".cart-quantity-btn"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const action =
                            button.dataset.action;


                        if (
                            !shopCart[index]
                        ) {
                            return;
                        }


                        if (
                            action ===
                            "increase"
                        ) {

                            shopCart[index]
                                .quantity += 1;

                        }


                        if (
                            action ===
                            "decrease"
                        ) {

                            shopCart[index]
                                .quantity -= 1;


                            if (
                                shopCart[index]
                                    .quantity <= 0
                            ) {

                                shopCart.splice(
                                    index,
                                    1
                                );

                            }

                        }


                        saveCart();

                        updateShopCart();

                    }
                );

            });


        /* REMOVE */

        document
            .querySelectorAll(
                ".remove-cart"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (
                            !shopCart[index]
                        ) {
                            return;
                        }


                        shopCart.splice(
                            index,
                            1
                        );


                        saveCart();

                        updateShopCart();

                    }
                );

            });

    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            () => {

                if (!shopCart.length) {

                    return;

                }


                const total =
                    shopCart.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            (
                                item.price *
                                item.quantity
                            ),
                        0
                    );


                const itemCount =
                    shopCart.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            item.quantity,
                        0
                    );


                alert(
                    `VORTEX CHECKOUT\n\n` +
                    `Items: ${itemCount}\n` +
                    `Total: €${total.toFixed(2)}\n\n` +
                    `Checkout system will be connected in the next phase.`
                );

            }
        );

    }


    /* =====================================================
       INITIAL CART RENDER
    ===================================================== */

    updateShopCart();

});
/* =====================================================
   VORTEX AI SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const uploadZone =
        document.getElementById("aiUploadZone");

    const videoInput =
        document.getElementById("aiVideoInput");

    const chooseButton =
        document.getElementById("aiChooseVideo");

    const selectedFile =
        document.getElementById("aiSelectedFile");

    const fileName =
        document.getElementById("aiFileName");

    const fileSize =
        document.getElementById("aiFileSize");

    const removeButton =
        document.getElementById("aiRemoveVideo");

    const analyzeButton =
        document.getElementById("aiAnalyzeButton");

    const processing =
        document.getElementById("aiProcessing");

    const progressBar =
        document.getElementById("aiProgressBar");

    const progressText =
        document.getElementById("aiProgressText");

    const processingStatus =
        document.getElementById("aiProcessingStatus");

    const results =
        document.getElementById("aiResults");

    const clipsContainer =
        document.getElementById("aiClips");

    const clipCount =
        document.getElementById("aiClipCount");


    /* =================================================
       CHECK ELEMENTS
    ================================================= */

    if (!uploadZone || !videoInput) {
        return;
    }


    let selectedVideo = null;

    let videoObjectURL = null;


    /* =================================================
       OPEN FILE SELECTOR
    ================================================= */

    chooseButton.addEventListener(
        "click",
        () => {

            videoInput.click();

        }
    );


    uploadZone.addEventListener(
        "click",
        (event) => {

            if (
                event.target === uploadZone ||
                event.target.classList.contains("ai-upload-icon") ||
                event.target.tagName === "H4" ||
                event.target.tagName === "P"
            ) {

                videoInput.click();

            }

        }
    );


    /* =================================================
       FILE SELECTED
    ================================================= */

    videoInput.addEventListener(
        "change",
        (event) => {

            const files =
                event.target.files;

            if (!files || !files.length) {
                return;
            }

            handleVideo(files[0]);

        }
    );


    /* =================================================
       DRAG ENTER
    ================================================= */

    uploadZone.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            uploadZone.classList.add(
                "dragging"
            );

        }
    );


    /* =================================================
       DRAG LEAVE
    ================================================= */

    uploadZone.addEventListener(
        "dragleave",
        () => {

            uploadZone.classList.remove(
                "dragging"
            );

        }
    );


    /* =================================================
       DROP
    ================================================= */

    uploadZone.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();

            uploadZone.classList.remove(
                "dragging"
            );

            const files =
                event.dataTransfer.files;

            if (!files || !files.length) {
                return;
            }

            handleVideo(files[0]);

        }
    );


    /* =================================================
       HANDLE VIDEO
    ================================================= */

    function handleVideo(file) {

        if (!file.type.startsWith("video/")) {

            alert(
                "Please select a video file."
            );

            return;

        }


        selectedVideo = file;


        /* FORMAT SIZE */

        const size =
            formatFileSize(
                file.size
            );


        fileName.textContent =
            file.name;

        fileSize.textContent =
            size;


        selectedFile.classList.add(
            "show"
        );


        /* CREATE LOCAL PREVIEW URL */

        if (videoObjectURL) {

            URL.revokeObjectURL(
                videoObjectURL
            );

        }

        videoObjectURL =
            URL.createObjectURL(
                file
            );


        /* RESET */

        results.classList.remove(
            "show"
        );

        processing.classList.remove(
            "show"
        );

        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0%";

        processingStatus.textContent =
            "Preparing AI engine...";

    }


    /* =================================================
       REMOVE VIDEO
    ================================================= */

    removeButton.addEventListener(
        "click",
        () => {

            selectedVideo = null;

            videoInput.value = "";

            selectedFile.classList.remove(
                "show"
            );

            results.classList.remove(
                "show"
            );

            processing.classList.remove(
                "show"
            );


            if (videoObjectURL) {

                URL.revokeObjectURL(
                    videoObjectURL
                );

                videoObjectURL = null;

            }

        }
    );


    /* =================================================
       ANALYZE
    ================================================= */

    analyzeButton.addEventListener(
        "click",
        () => {

            if (!selectedVideo) {

                alert(
                    "Please upload a gameplay video first."
                );

                return;

            }


            startAnalysis();

        }
    );


    /* =================================================
       FAKE AI PROCESSING
       
       This is FRONTEND DEMO ONLY.
       
       Later:
       fetch("/api/analyze")
    ================================================= */

    function startAnalysis() {

        analyzeButton.disabled = true;

        processing.classList.add(
            "show"
        );

        results.classList.remove(
            "show"
        );


        let progress = 0;


        const statuses = [

            "Preparing AI engine...",

            "Reading gameplay frames...",

            "Analyzing visual events...",

            "Detecting important moments...",

            "Scoring gameplay events...",

            "Generating clips...",

            "Optimizing output...",

            "Finalizing results..."

        ];


        const interval =
            setInterval(
                () => {

                    progress +=
                        Math.floor(
                            Math.random() * 8
                        ) + 4;


                    if (progress >= 100) {

                        progress = 100;

                    }


                    progressBar.style.width =
                        progress + "%";


                    progressText.textContent =
                        progress + "%";


                    const index =
                        Math.min(
                            statuses.length - 1,
                            Math.floor(
                                progress /
                                (100 /
                                statuses.length)
                            )
                        );


                    processingStatus.textContent =
                        statuses[index];


                    if (progress >= 100) {

                        clearInterval(
                            interval
                        );


                        setTimeout(
                            () => {

                                showResults();

                                analyzeButton.disabled =
                                    false;

                            },
                            500
                        );

                    }

                },
                350
            );

    }


    /* =================================================
       RESULTS
    ================================================= */

    function showResults() {

        const game =
            document.getElementById(
                "aiGame"
            ).value;

        const format =
            document.getElementById(
                "aiFormat"
            ).value;


        const gameName =
            getGameName(game);


        const clips = [

            {
                title: "INSANE PLAY",
                score: "98%",
                duration: "00:17"
            },

            {
                title: "BEST MOMENT",
                score: "94%",
                duration: "00:14"
            },

            {
                title: "CLUTCH DETECTED",
                score: "91%",
                duration: "00:21"
            }

        ];


        clipsContainer.innerHTML = "";


        clips.forEach(
            (clip, index) => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "ai-clip";


                card.innerHTML = `

                    <div class="ai-clip-preview">

                        ${
                            videoObjectURL
                            ?
                            `
                            <video
                                src="${videoObjectURL}"
                                muted
                                preload="metadata"
                            ></video>
                            `
                            :
                            `
                            <div class="ai-clip-placeholder">
                                V
                            </div>
                            `
                        }

                        <span class="ai-clip-number">
                            CLIP ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="ai-clip-score">
                            AI ${clip.score}
                        </span>

                    </div>


                    <div class="ai-clip-info">

                        <h4>
                            ${clip.title}
                        </h4>

                        <p>
                            ${gameName}
                            ·
                            ${format === "vertical" ? "9:16" : "16:9"}
                            ·
                            ${clip.duration}
                        </p>


                        <div class="ai-clip-actions">

                            <button
                                type="button"
                                class="ai-preview-button"
                            >
                                PREVIEW
                            </button>

                            <button
                                type="button"
                                class="ai-download-button"
                            >
                                DOWNLOAD
                            </button>

                        </div>

                    </div>

                `;


                clipsContainer.appendChild(
                    card
                );


                /* PREVIEW */

                const preview =
                    card.querySelector(
                        ".ai-preview-button"
                    );

                preview.addEventListener(
                    "click",
                    () => {

                        const video =
                            card.querySelector(
                                "video"
                            );

                        if (!video) {

                            alert(
                                "Preview available after the real AI backend is connected."
                            );

                            return;

                        }


                        if (video.paused) {

                            video.play();

                        } else {

                            video.pause();

                        }

                    }
                );


                /* DOWNLOAD */

                const download =
                    card.querySelector(
                        ".ai-download-button"
                    );

                download.addEventListener(
                    "click",
                    () => {

                        if (!videoObjectURL) {

                            return;

                        }


                        const link =
                            document.createElement(
                                "a"
                            );

                        link.href =
                            videoObjectURL;

                        link.download =
                            `VORTEX-AI-${index + 1}.mp4`;

                        link.click();

                    }
                );

            }
        );


        clipCount.textContent =
            clips.length;


        results.classList.add(
            "show"
        );


        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =================================================
       GAME NAME
    ================================================= */

    function getGameName(game) {

        const games = {

            valorant: "VALORANT",

            fortnite: "FORTNITE",

            pubg: "PUBG",

            cs2: "CS2",

            other: "GAMING"

        };


        return games[game] ||
            "GAMING";

    }


    /* =================================================
       FILE SIZE
    ================================================= */

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }


        const units = [

            "Bytes",
            "KB",
            "MB",
            "GB"

        ];


        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );


        return (
            parseFloat(
                (
                    bytes /
                    Math.pow(
                        1024,
                        index
                    )
                ).toFixed(2)
            )
            +
            " "
            +
            units[index]
        );

    }

});

document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";


    document.querySelectorAll(".nav a").forEach(link => {

        const href =
            link.getAttribute("href")
                .split("#")[0]
                .toLowerCase();


        link.classList.remove("active");


        if (href === currentPage) {
            link.classList.add("active");
        }


        link.addEventListener("click", () => {

            const nav =
                document.querySelector(".nav");

            if (nav) {
                nav.classList.remove("open");
            }

        });

    });

});
/* =========================================================
   VORTEX AI DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       AI SIDEBAR PANELS
    ----------------------------------------------------- */

    const aiSideItems =
        document.querySelectorAll(".ai-side-item");

    const aiPanels =
        document.querySelectorAll(".ai-panel");


    aiSideItems.forEach(item => {

        item.addEventListener("click", () => {

            const panelName =
                item.dataset.panel;


            aiSideItems.forEach(button => {
                button.classList.remove("active");
            });


            aiPanels.forEach(panel => {
                panel.classList.remove("active");
            });


            item.classList.add("active");


            const targetPanel =
                document.getElementById(
                    "panel-" + panelName
                );


            if (targetPanel) {
                targetPanel.classList.add("active");
            }

        });

    });


    /* -----------------------------------------------------
       VIDEO UPLOAD
    ----------------------------------------------------- */

    const gameplayInput =
        document.getElementById("gameplayInput");

    const selectVideo =
        document.getElementById("selectVideo");

    const uploadZone =
        document.getElementById("uploadZone");

    const selectedVideo =
        document.getElementById("selectedVideo");

    const videoName =
        document.getElementById("videoName");

    const videoSize =
        document.getElementById("videoSize");

    const removeVideo =
        document.getElementById("removeVideo");


    if (
        gameplayInput &&
        selectVideo &&
        uploadZone &&
        selectedVideo
    ) {


        selectVideo.addEventListener(
            "click",
            () => {

                gameplayInput.click();

            }
        );


        gameplayInput.addEventListener(
            "change",
            () => {

                if (
                    gameplayInput.files &&
                    gameplayInput.files.length > 0
                ) {

                    handleVideo(
                        gameplayInput.files[0]
                    );

                }

            }
        );


        /* DRAG & DROP */

        uploadZone.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                uploadZone.classList.add(
                    "dragover"
                );

            }
        );


        uploadZone.addEventListener(
            "dragleave",
            () => {

                uploadZone.classList.remove(
                    "dragover"
                );

            }
        );


        uploadZone.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                uploadZone.classList.remove(
                    "dragover"
                );


                const files =
                    event.dataTransfer.files;


                if (
                    files &&
                    files.length > 0
                ) {

                    const file =
                        files[0];


                    if (
                        file.type.startsWith(
                            "video/"
                        )
                    ) {

                        handleVideo(file);

                    }

                }

            }
        );


        /* REMOVE */

        removeVideo.addEventListener(
            "click",
            () => {

                gameplayInput.value = "";

                selectedVideo.classList.remove(
                    "show"
                );

                uploadZone.style.display =
                    "flex";

            }
        );

    }


    function handleVideo(file) {

        videoName.textContent =
            file.name;


        const sizeMB =
            file.size /
            (1024 * 1024);


        videoSize.textContent =
            sizeMB.toFixed(1) +
            " MB · READY FOR ANALYSIS";


        selectedVideo.classList.add(
            "show"
        );


        uploadZone.style.display =
            "none";

    }


    /* -----------------------------------------------------
       AI ANALYSIS DEMO
    ----------------------------------------------------- */

    const analyzeButton =
        document.getElementById(
            "analyzeButton"
        );

    const aiProcessing =
        document.getElementById(
            "aiProcessing"
        );

    const processingBar =
        document.getElementById(
            "processingBar"
        );

    const processingPercent =
        document.getElementById(
            "processingPercent"
        );

    const processingText =
        document.getElementById(
            "processingText"
        );


    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            () => {

                startAIAnalysis();

            }
        );

    }


    function startAIAnalysis() {

        if (
            !gameplayInput ||
            !gameplayInput.files ||
            gameplayInput.files.length === 0
        ) {

            alert(
                "Please select a gameplay video first."
            );

            return;

        }


        aiProcessing.classList.add(
            "show"
        );


        analyzeButton.disabled =
            true;


        analyzeButton.style.opacity =
            "0.5";


        let progress = 0;


        const messages = [

            "Uploading gameplay...",
            "Reading video frames...",
            "Detecting gameplay events...",
            "Analyzing kills and actions...",
            "Finding high-value moments...",
            "Calculating clip scores...",
            "Preparing your clips...",
            "Analysis complete."

        ];


        const interval =
            setInterval(() => {

                progress +=
                    Math.floor(
                        Math.random() * 8
                    ) + 3;


                if (progress >= 100) {

                    progress = 100;

                }


                processingBar.style.width =
                    progress + "%";


                processingPercent.textContent =
                    progress + "%";


                const messageIndex =
                    Math.min(
                        Math.floor(
                            progress / 14
                        ),
                        messages.length - 1
                    );


                processingText.textContent =
                    messages[
                        messageIndex
                    ];


                if (progress >= 100) {

                    clearInterval(interval);


                    setTimeout(() => {

                        showAIResults();

                    }, 500);

                }

            }, 350);

    }


    function showAIResults() {

        const results =
            document.getElementById(
                "aiResults"
            );


        if (results) {

            results.classList.add(
                "ai-results-ready"
            );


            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


        analyzeButton.disabled =
            false;


        analyzeButton.style.opacity =
            "1";

    }


    /* -----------------------------------------------------
       THUMBNAIL STYLE BUTTONS
    ----------------------------------------------------- */

    const styleOptions =
        document.querySelectorAll(
            ".style-option"
        );


    styleOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                styleOptions.forEach(
                    button => {
                        button.classList.remove(
                            "active"
                        );
                    }
                );


                option.classList.add(
                    "active"
                );

            }
        );

    });


});
/* =====================================================
   VORTEX ADVANCED SHOP CART
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const addButtons =
        document.querySelectorAll(".add-cart");

    const cartDrawer =
        document.getElementById("cartDrawer");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const closeCart =
        document.getElementById("closeCart");

    const drawerItems =
        document.getElementById("drawerItems");

    const drawerSubtotal =
        document.getElementById("drawerSubtotal");

    const drawerShipping =
        document.getElementById("drawerShipping");

    const drawerDiscount =
        document.getElementById("drawerDiscount");

    const drawerTotal =
        document.getElementById("drawerTotal");

    const openCheckout =
        document.getElementById("openCheckout");

    const checkoutOverlay =
        document.getElementById("checkoutOverlay");

    const closeCheckout =
        document.getElementById("closeCheckout");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const checkoutForm =
        document.getElementById("checkoutForm");

    const promoInput =
        document.getElementById("promoInput");

    const applyPromo =
        document.getElementById("applyPromo");

    const notification =
        document.getElementById("shopNotification");

    const notificationText =
        document.getElementById("notificationText");

    const cartCount =
        document.getElementById("shopCartCount");

    const cartTotal =
        document.getElementById("shopCartTotal");


    if (!drawerItems) return;


    /* =================================================
       LOAD CART
    ================================================= */

    let cart = JSON.parse(
        localStorage.getItem("vortexCart")
    ) || [];


    let discount = 0;


    /* =================================================
       SAVE
    ================================================= */

    function saveCart() {

        localStorage.setItem(
            "vortexCart",
            JSON.stringify(cart)
        );

    }


    /* =================================================
       NOTIFICATION
    ================================================= */

    function showNotification(message) {

        if (!notification) return;

        notificationText.textContent =
            message;

        notification.classList.add("show");

        setTimeout(() => {

            notification.classList.remove("show");

        }, 2200);

    }


    /* =================================================
       OPEN CART
    ================================================= */

    function openCartDrawer() {

        cartDrawer.classList.add("show");

        cartOverlay.classList.add("show");

        document.body.style.overflow = "hidden";

    }


    /* =================================================
       CLOSE CART
    ================================================= */

    function closeCartDrawer() {

        cartDrawer.classList.remove("show");

        cartOverlay.classList.remove("show");

        document.body.style.overflow = "";

    }


    closeCart?.addEventListener(
        "click",
        closeCartDrawer
    );


    cartOverlay?.addEventListener(
        "click",
        closeCartDrawer
    );


    /* =================================================
       ADD PRODUCT
    ================================================= */

    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            const product =
                button.closest(".shop-product");

            const name =
                button.dataset.name;

            const price =
                Number(button.dataset.price);

            const image =
                product?.querySelector("img")?.getAttribute("src")
                || "";


            const existing =
                cart.find(item =>
                    item.name === name
                );


            if (existing) {

                existing.quantity++;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    image: image,

                    quantity: 1

                });

            }


            saveCart();

            updateCart();

            openCartDrawer();

            showNotification(
                `${name} added to cart`
            );


            const original =
                button.textContent;

            button.textContent =
                "ADDED ✓";

            button.style.background =
                "#19a463";


            setTimeout(() => {

                button.textContent =
                    original;

                button.style.background =
                    "";

            }, 900);

        });

    });


    /* =================================================
       UPDATE CART
    ================================================= */

    function updateCart() {

        drawerItems.innerHTML = "";


        if (cart.length === 0) {

            drawerItems.innerHTML = `

                <div class="drawer-empty">

                    <div class="empty-icon">
                        🛒
                    </div>

                    <h4>
                        YOUR CART IS EMPTY
                    </h4>

                    <p>
                        Add some VORTEX gear to continue.
                    </p>

                </div>

            `;

        }


        let subtotal = 0;

        let itemCount = 0;


        cart.forEach((item, index) => {

            subtotal +=
                item.price *
                item.quantity;

            itemCount +=
                item.quantity;


            const element =
                document.createElement("div");


            element.className =
                "drawer-item";


            element.innerHTML = `

                <div class="drawer-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="drawer-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <strong>
                        €${item.price.toFixed(2)}
                    </strong>


                    <div class="quantity-control">

                        <button
                            data-action="minus"
                            data-index="${index}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            data-action="plus"
                            data-index="${index}"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="drawer-remove"
                    data-remove="${index}"
                >
                    ×
                </button>

            `;


            drawerItems.appendChild(
                element
            );

        });


        /* SHIPPING */

        let shipping = 0;

        if (subtotal > 0 && subtotal < 100) {
            shipping = 7;
        }


        /* DISCOUNT */

        const discountAmount =
            subtotal * discount;


        const total =
            subtotal +
            shipping -
            discountAmount;


        drawerSubtotal.textContent =
            `€${subtotal.toFixed(2)}`;


        drawerShipping.textContent =
            shipping === 0
                ? "FREE"
                : `€${shipping.toFixed(2)}`;


        drawerDiscount.textContent =
            `-€${discountAmount.toFixed(2)}`;


        drawerTotal.textContent =
            `€${Math.max(total, 0).toFixed(2)}`;


        if (cartCount) {

            cartCount.textContent =
                `${itemCount} ITEMS`;

        }


        if (cartTotal) {

            cartTotal.textContent =
                `€${Math.max(total, 0).toFixed(2)}`;

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                `€${Math.max(total, 0).toFixed(2)}`;

        }


        addCartEvents();

    }


    /* =================================================
       CART BUTTONS
    ================================================= */

    function addCartEvents() {

        drawerItems
            .querySelectorAll(
                "[data-action]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        const action =
                            button.dataset.action;


                        if (action === "plus") {

                            cart[index].quantity++;

                        }


                        if (
                            action === "minus"
                        ) {

                            cart[index].quantity--;

                            if (
                                cart[index].quantity <= 0
                            ) {

                                cart.splice(
                                    index,
                                    1
                                );

                            }

                        }


                        saveCart();

                        updateCart();

                    }
                );

            });


        drawerItems
            .querySelectorAll(
                "[data-remove]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.remove
                            );


                        const removed =
                            cart[index];


                        cart.splice(
                            index,
                            1
                        );


                        saveCart();

                        updateCart();


                        showNotification(
                            `${removed.name} removed`
                        );

                    }
                );

            });

    }


    /* =================================================
       PROMO CODE
    ================================================= */

    applyPromo?.addEventListener(
        "click",
        () => {

            const code =
                promoInput.value
                    .trim()
                    .toUpperCase();


            if (code === "VORTEX10") {

                discount = 0.10;

                showNotification(
                    "10% discount applied!"
                );

                updateCart();

            }

            else if (code === "VORTEX20") {

                discount = 0.20;

                showNotification(
                    "20% discount applied!"
                );

                updateCart();

            }

            else {

                discount = 0;

                showNotification(
                    "Invalid promo code"
                );

            }

        }
    );


    /* =================================================
       CHECKOUT
    ================================================= */

    openCheckout?.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showNotification(
                    "Your cart is empty"
                );

                return;

            }


            checkoutOverlay.classList.add(
                "show"
            );

        }
    );


    closeCheckout?.addEventListener(
        "click",
        () => {

            checkoutOverlay.classList.remove(
                "show"
            );

        }
    );


    checkoutOverlay?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                checkoutOverlay
            ) {

                checkoutOverlay.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =================================================
       PLACE ORDER
    ================================================= */

    checkoutForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (cart.length === 0) {

                return;

            }


            const customerName =
                document.getElementById(
                    "customerName"
                ).value;


            /*
                FRONTEND DEMO

                Later you can connect this
                to your real backend.
            */


            const orderNumber =
                "VTX-" +
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            alert(
                `THANK YOU ${customerName}!\n\n` +
                `ORDER: ${orderNumber}\n\n` +
                `Your VORTEX order has been received.`
            );


            cart = [];

            discount = 0;

            saveCart();

            updateCart();


            checkoutForm.reset();

            checkoutOverlay.classList.remove(
                "show"
            );

            closeCartDrawer();


            showNotification(
                "Order completed successfully!"
            );

        }
    );


    /* =================================================
       INITIALIZE
    ================================================= */

    updateCart();

});
/* =====================================================
   VORTEX CHECKOUT SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Only run on checkout page */

    if (
        !document.body.classList.contains(
            "checkout-page"
        )
    ) {
        return;
    }


    /* =================================================
       ELEMENTS
    ================================================= */

    const productsContainer =
        document.getElementById(
            "checkoutProducts"
        );

    const itemCount =
        document.getElementById(
            "checkoutItemCount"
        );

    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );

    const shippingElement =
        document.getElementById(
            "checkoutShipping"
        );

    const discountElement =
        document.getElementById(
            "checkoutDiscount"
        );

    const grandTotalElement =
        document.getElementById(
            "checkoutGrandTotal"
        );

    const promoInput =
        document.getElementById(
            "checkoutPromo"
        );

    const promoButton =
        document.getElementById(
            "checkoutApplyPromo"
        );

    const promoMessage =
        document.getElementById(
            "promoMessage"
        );

    const placeOrder =
        document.getElementById(
            "placeOrderButton"
        );

    const successOverlay =
        document.getElementById(
            "orderSuccess"
        );

    const successNumber =
        document.getElementById(
            "successOrderNumber"
        );


    /* =================================================
       CART
    ================================================= */

    let cart =
        JSON.parse(
            localStorage.getItem(
                "vortexCart"
            )
        ) || [];


    let discountRate = 0;


    /* =================================================
       SAVE
    ================================================= */

    function saveCart() {

        localStorage.setItem(
            "vortexCart",
            JSON.stringify(cart)
        );

    }


    /* =================================================
       CALCULATE
    ================================================= */

    function calculateTotals() {

        let subtotal = 0;

        let count = 0;


        cart.forEach(item => {

            subtotal +=
                item.price *
                item.quantity;

            count +=
                item.quantity;

        });


        let shipping = 0;


        if (
            subtotal > 0 &&
            subtotal < 100
        ) {

            shipping = 7;

        }


        const discount =
            subtotal *
            discountRate;


        const total =
            Math.max(
                0,
                subtotal +
                shipping -
                discount
            );


        return {
            subtotal,
            shipping,
            discount,
            total,
            count
        };

    }


    /* =================================================
       RENDER
    ================================================= */

    function renderCheckout() {

        const totals =
            calculateTotals();


        itemCount.textContent =
            totals.count;


        subtotalElement.textContent =
            `€${totals.subtotal.toFixed(2)}`;


        shippingElement.textContent =
            totals.shipping === 0
                ? (
                    totals.subtotal > 0
                        ? "FREE"
                        : "€0.00"
                )
                : `€${totals.shipping.toFixed(2)}`;


        discountElement.textContent =
            `-€${totals.discount.toFixed(2)}`;


        grandTotalElement.textContent =
            `€${totals.total.toFixed(2)}`;


        productsContainer.innerHTML = "";


        if (cart.length === 0) {

            productsContainer.innerHTML = `

                <div class="checkout-empty">

                    <span>
                        🛒
                    </span>

                    <p>
                        Your cart is empty.
                    </p>

                    <a href="shop.html">
                        RETURN TO SHOP →
                    </a>

                </div>

            `;


            placeOrder.disabled =
                true;


            return;

        }


        placeOrder.disabled =
            false;


        cart.forEach(
            (item, index) => {

                const product =
                    document.createElement(
                        "div"
                    );


                product.className =
                    "checkout-product";


                product.innerHTML = `

                    <div class="checkout-product-image">

                        <img
                            src="${item.image || ""}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="checkout-product-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            QTY: ${item.quantity}
                        </p>

                    </div>


                    <div class="checkout-product-price">

                        €${(
                            item.price *
                            item.quantity
                        ).toFixed(2)}

                    </div>

                `;


                productsContainer.appendChild(
                    product
                );

            }
        );

    }


    /* =================================================
       PROMO
    ================================================= */

    promoButton?.addEventListener(
        "click",
        () => {

            const code =
                promoInput.value
                    .trim()
                    .toUpperCase();


            if (code === "VORTEX10") {

                discountRate = 0.10;

                promoMessage.textContent =
                    "10% discount applied.";

                promoMessage.style.color =
                    "#28c76f";


                renderCheckout();

            }

            else if (code === "VORTEX20") {

                discountRate = 0.20;

                promoMessage.textContent =
                    "20% discount applied.";

                promoMessage.style.color =
                    "#28c76f";


                renderCheckout();

            }

            else {

                discountRate = 0;

                promoMessage.textContent =
                    "Invalid promo code.";

                promoMessage.style.color =
                    "#e50914";


                renderCheckout();

            }

        }
    );


    /* =================================================
       PAYMENT METHOD
    ================================================= */

    const paymentMethods =
        document.querySelectorAll(
            ".payment-method"
        );


    paymentMethods.forEach(
        method => {

            method.addEventListener(
                "click",
                () => {

                    paymentMethods.forEach(
                        item => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    method.classList.add(
                        "active"
                    );


                    const radio =
                        method.querySelector(
                           ("input")
                        );


                    if (radio) {

                        radio.checked =
                            true;

                    }

                }
            );

        }
    );


    /* =================================================
       PLACE ORDER
    ================================================= */

    placeOrder?.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                return;

            }


            /* Validate customer fields */

            const requiredFields = [

                "firstName",
                "lastName",
                "email",
                "address",
                "city",
                "country"

            ];


            for (
                const id of requiredFields
            ) {

                const field =
                    document.getElementById(
                        id
                    );


                if (
                    !field ||
                    !field.value.trim()
                ) {

                    field?.focus();

                    alert(
                        "Please complete all required fields."
                    );

                    return;

                }

            }


            const orderNumber =
                "VTX-" +
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            successNumber.textContent =
                orderNumber;


            /*
                FRONTEND DEMO ONLY.

                No real payment is processed.
            */


            successOverlay.classList.add(
                "show"
            );


            cart = [];

            discountRate = 0;

            saveCart();

            renderCheckout();

        }
    );


    /* =================================================
       INITIALIZE
    ================================================= */

    renderCheckout();

});