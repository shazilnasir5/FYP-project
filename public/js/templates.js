
// =========================================
// TEMPLATE GALLERY
// =========================================

// Check seller login
const token = localStorage.getItem("sellerToken");

if (!token) {
    window.location.href = "login.html";
}

// Read seller information
let sellerData = null;

try {
    sellerData = JSON.parse(
        localStorage.getItem("sellerData") || "null"
    );
} catch (error) {
    sellerData = null;
}

// Display seller information
const sellerNameElement = document.getElementById("sellerName");
const userAvatarElement = document.getElementById("userAvatar");

if (sellerData && sellerData.name) {
    if (sellerNameElement) {
        sellerNameElement.textContent = sellerData.name;
    }

    if (userAvatarElement) {
        userAvatarElement.textContent =
            sellerData.name.charAt(0).toUpperCase();
    }
}

// =========================================
// LOGOUT
// =========================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("sellerData");

        window.location.href = "login.html";
    });
}

// =========================================
// TEMPLATE SEARCH
// =========================================

const templateSearch = document.getElementById("templateSearch");
const templateCount = document.getElementById("templateCount");

const templateCards = document.querySelectorAll(".template-card");
const categorySections = document.querySelectorAll(
    ".template-category-section"
);

function filterTemplates() {
    const searchValue = templateSearch.value
        .trim()
        .toLowerCase();

    let visibleCount = 0;

    categorySections.forEach(section => {
        let sectionHasVisibleCard = false;

        const cards = section.querySelectorAll(".template-card");

        cards.forEach(card => {
            const name = (card.dataset.name || "").toLowerCase();
            const category = (card.dataset.category || "").toLowerCase();

            const matches =
                name.includes(searchValue) ||
                category.includes(searchValue);

            card.classList.toggle("hidden", !matches);

            if (matches) {
                visibleCount++;
                sectionHasVisibleCard = true;
            }
        });

        section.classList.toggle(
            "empty",
            !sectionHasVisibleCard
        );
    });

    if (templateCount) {
        templateCount.textContent =
            `${visibleCount} template${visibleCount === 1 ? "" : "s"} found`;
    }
}

if (templateSearch) {
    templateSearch.addEventListener("input", filterTemplates);
}

// =========================================
// TEMPLATE PREVIEW MODAL
// =========================================

const templateModal = document.getElementById("templateModal");
const modalPreview = document.getElementById("templateModalPreview");
const modalTemplateName = document.getElementById("modalTemplateName");

const closeTemplateModal = document.getElementById("closeTemplateModal");
const modalUseTemplate = document.getElementById("modalUseTemplate");

let currentPreviewTemplate = null;

function openTemplatePreview(card) {
    if (!card || !templateModal || !modalPreview) return;

    const preview = card.querySelector(".template-preview");

    if (!preview) return;

    currentPreviewTemplate = card;

    const templateName = card.dataset.name || "Store Template";

    // Copy the visual preview into the modal
    modalPreview.innerHTML = "";

    const previewCopy = preview.cloneNode(true);
    modalPreview.appendChild(previewCopy);

    modalTemplateName.textContent = templateName;

    modalUseTemplate.dataset.template =
        card.querySelector('[data-action="use"]').dataset.template;

    templateModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePreviewModal() {
    if (!templateModal) return;

    templateModal.classList.remove("active");
    document.body.style.overflow = "";

    currentPreviewTemplate = null;
}

if (closeTemplateModal) {
    closeTemplateModal.addEventListener(
        "click",
        closePreviewModal
    );
}

if (templateModal) {
    templateModal.addEventListener("click", event => {
        if (event.target === templateModal) {
            closePreviewModal();
        }
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closePreviewModal();
    }
});

// =========================================
// SELECT TEMPLATE
// =========================================

function useSelectedTemplate(templateId) {
    if (!templateId) return;

    // Save the exact selected category template.
    // The existing editor will be connected to these
    // category designs in the next integration step.
    localStorage.setItem("selectedStoreTemplate", templateId);

    window.location.href = "website-builder.html";
}

// Preview buttons
document.querySelectorAll(
    '[data-action="preview"]'
).forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".template-card");
        openTemplatePreview(card);
    });
});

// Use Template buttons
document.querySelectorAll(
    '[data-action="use"]'
).forEach(button => {
    button.addEventListener("click", () => {
        useSelectedTemplate(button.dataset.template);
    });
});

// Use Template from preview modal
if (modalUseTemplate) {
    modalUseTemplate.addEventListener("click", () => {
        useSelectedTemplate(
            modalUseTemplate.dataset.template
        );
    });
}
