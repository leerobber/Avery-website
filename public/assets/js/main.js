document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending...';

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      status.textContent = "Thanks! We'll be in touch soon.";
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please email us directly for now.';
      console.error(err);
    }
  });
}
