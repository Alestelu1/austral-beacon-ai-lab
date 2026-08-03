import { renderAnswer } from "./renderAnswer.js";
import { renderError } from "./renderError.js";
/**
 * Validates that the question is not empty or whitespace-only.
 */
export function validateQuestion(text) {
    if (text.trim().length === 0) {
        return { valid: false, message: "Escribe una pregunta antes de consultar." };
    }
    return { valid: true };
}
/**
 * Client application entry point.
 * Attaches event listeners on DOMContentLoaded.
 */
function init() {
    const form = document.getElementById("query-form");
    const input = document.getElementById("question-input");
    const submitBtn = document.getElementById("submit-btn");
    const validationMsg = document.getElementById("validation-msg");
    const loading = document.getElementById("loading");
    const results = document.getElementById("results");
    if (!form || !input || !submitBtn || !validationMsg || !loading || !results) {
        return;
    }
    let isSubmitting = false;
    function showLoading() {
        loading.hidden = false;
    }
    function hideLoading() {
        loading.hidden = true;
    }
    function disableForm() {
        input.disabled = true;
        submitBtn.disabled = true;
    }
    function enableForm() {
        input.disabled = false;
        submitBtn.disabled = false;
    }
    function showValidation(msg) {
        validationMsg.textContent = msg;
        validationMsg.hidden = false;
    }
    function hideValidation() {
        validationMsg.textContent = "";
        validationMsg.hidden = true;
    }
    function displayResult(html) {
        results.innerHTML = html;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }
        hideValidation();
        const question = input.value;
        const validation = validateQuestion(question);
        if (!validation.valid) {
            showValidation(validation.message ?? "");
            return;
        }
        isSubmitting = true;
        disableForm();
        showLoading();
        try {
            const response = await fetch("/api/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
            if (response.ok) {
                const data = await response.json();
                displayResult(renderAnswer(data));
            }
            else {
                let errorInfo;
                if (response.status === 400) {
                    try {
                        const body = await response.json();
                        errorInfo = {
                            type: "http",
                            status: 400,
                            message: body?.error?.message ?? "Solicitud inválida.",
                        };
                    }
                    catch {
                        errorInfo = { type: "http", status: 400, message: "Solicitud inválida." };
                    }
                }
                else if (response.status === 500) {
                    errorInfo = { type: "http", status: 500 };
                }
                else {
                    errorInfo = {
                        type: "http",
                        status: response.status,
                        message: "Error inesperado.",
                    };
                }
                displayResult(renderError(errorInfo));
            }
        }
        catch {
            displayResult(renderError({ type: "network" }));
        }
        finally {
            hideLoading();
            enableForm();
            isSubmitting = false;
        }
    }
    form.addEventListener("submit", handleSubmit);
}
document.addEventListener("DOMContentLoaded", init);
