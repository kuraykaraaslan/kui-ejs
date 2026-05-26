/* ── FormRenderer client-side validation (M1) ──────────────────────────
 * Mirrors modules/app/FormBuilder/renderer/useFormState.ts in 01_NextJS_Components.
 *
 * Built-in checks:
 *   - required (any field type, including unchecked checkbox / empty multi-)
 *   - email format (basic single-line regex)
 *
 * Listens for submit and bubbles `KuiFormRenderer:<id>:submit` with the values
 * on success, or `:invalid` with the error map on failure.
 * TODO M2: min / max length, regex, file size / type extensions.
 * TODO M3: skip hidden fields based on logic-eval.js visibility map.
 */
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readValues() {
  var fd = new FormData(form);
  var out = {};
  schema.fields.forEach(function (f) {
    if (f.type === 'checkbox') {
      var box = form.querySelector('[name="' + cssEscape(f.name) + '"]');
      out[f.name] = !!(box && box.checked);
    } else if (['multiselect','signature','rating'].indexOf(f.type) !== -1) {
      // M3/M5 stubs — not collected in M1.
      return;
    } else {
      var v = fd.get(f.name);
      out[f.name] = v == null ? '' : v;
    }
  });
  return out;
}

function cssEscape(s) {
  return String(s).replace(/(["\\\[\]:\.])/g, '\\$1');
}

function validate(values) {
  var errors = {};
  schema.fields.forEach(function (f) {
    var v = values[f.name];
    if (f.required) {
      var empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0) || (f.type === 'checkbox' && v === false);
      if (empty) { errors[f.name] = 'This field is required.'; return; }
    }
    if (f.type === 'email' && typeof v === 'string' && v.length > 0) {
      if (!EMAIL_RE.test(v)) errors[f.name] = 'Enter a valid email address.';
    }
  });
  return errors;
}

function showErrors(errors) {
  // Remove previous inline errors.
  Array.prototype.forEach.call(form.querySelectorAll('[data-fb-error="1"]'), function (n) { n.remove(); });
  Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid="true"]'), function (n) { n.removeAttribute('aria-invalid'); });
  Object.keys(errors).forEach(function (name) {
    var input = form.querySelector('[name="' + cssEscape(name) + '"]');
    if (!input) return;
    input.setAttribute('aria-invalid', 'true');
    var p = document.createElement('p');
    p.setAttribute('role', 'alert');
    p.setAttribute('data-fb-error', '1');
    p.className = 'text-xs text-error';
    p.textContent = errors[name];
    var wrapper = input.closest('.fb-field') || input.parentElement;
    if (wrapper) wrapper.appendChild(p);
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var values = readValues();
  var errors = validate(values);
  showErrors(errors);
  var ok = Object.keys(errors).length === 0;
  var detail = ok ? { values: values } : { values: values, errors: errors };
  var evtName = ok ? 'KuiFormRenderer:' + FR_ID + ':submit' : 'KuiFormRenderer:' + FR_ID + ':invalid';
  form.dispatchEvent(new CustomEvent(evtName, { detail: detail, bubbles: true }));
});
