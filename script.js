// Mobile navigation closes after a visitor chooses a page link.
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => { link.closest('details').open = false; }));
const form = document.getElementById('enquiry-form');
if (form) {
  setupContact();
}
function setupContact() {
  const email = (window.CALIFAX_CONFIG?.email || '').trim();
  const status = document.getElementById('form-status');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n]/.test(email);
  const chosen = new URLSearchParams(window.location.search).get('service');
  if ([...form.elements.service.options].some(option => option.value === chosen)) form.elements.service.value = chosen;
  if (valid) {
    form.querySelector('button').disabled = false;
    const link = document.createElement('a'); link.href = 'mailto:' + encodeURIComponent(email); link.textContent = email;
    document.getElementById('business-email').replaceChildren(link);
  } else {
    status.textContent = 'Online enquiries are not available yet. Please check back soon.';
    form.querySelector('button').disabled = true;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!valid || !form.reportValidity()) return;
    const values = new FormData(form);
    const service = form.elements.service.selectedOptions[0].textContent;
    const body = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nOrganisation: ${values.get('organisation') || 'Not specified'}\nService: ${service}\n\n${values.get('message')}`;
    window.location.href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Califax enquiry: ' + service) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Your email application has been requested. Review and send the message there. Nothing has been sent by this website.';
  });
}

// Gallery filters work with keyboard buttons and announce the visible count.
const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visible = 0;
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.hidden = filter !== 'all' && item.dataset.category !== filter;
    if (!item.hidden) visible++;
  });
  document.getElementById('gallery-status').textContent = `${visible} visuals shown`;
}));
