/* ============================================================
   contact.js — Topic-driven form visibility,
   Formspree submission, inline thank-you state.
   ============================================================ */

const TOPIC_FIELDSET_MAP = {
  'suggest-store':    'fieldset-store',
  'suggest-course':   'fieldset-course',
  'suggest-pattern':  'fieldset-pattern',
  'suggest-inspo':    'fieldset-inspo',
  'add-glossary':     'fieldset-glossary',
  'report-issue':     'fieldset-issue',
  'general':          'fieldset-general',
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const topicSelect = document.getElementById('topic');
  const thankYou = document.getElementById('thank-you');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !topicSelect) return;

  /* ---- Show/hide fieldsets based on topic ---- */
  function updateFieldsets(value) {
    Object.values(TOPIC_FIELDSET_MAP).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });

    const targetId = TOPIC_FIELDSET_MAP[value];
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) target.hidden = false;
    }
  }

  topicSelect.addEventListener('change', (e) => {
    updateFieldsets(e.target.value);
  });

  // Initialize on load
  updateFieldsets(topicSelect.value);

  /* ---- Form submission to Formspree ---- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        // Show thank-you, hide form
        form.hidden = true;
        if (thankYou) {
          thankYou.classList.add('visible');
          thankYou.removeAttribute('hidden');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = (data.errors && data.errors[0] && data.errors[0].message) || 'Something went wrong. Please try again.';
        showFormError(msg);
        resetSubmitBtn();
      }
    } catch (err) {
      console.error('contact.js:', err);
      showFormError('Could not send your message. Please check your connection and try again.');
      resetSubmitBtn();
    }
  });

  function showFormError(message) {
    let errorEl = document.getElementById('form-submit-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.id = 'form-submit-error';
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      if (submitBtn) {
        submitBtn.parentNode.insertBefore(errorEl, submitBtn);
      } else {
        form.appendChild(errorEl);
      }
    }
    errorEl.textContent = message;
  }

  function resetSubmitBtn() {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  }
});
