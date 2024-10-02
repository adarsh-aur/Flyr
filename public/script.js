document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bannerForm');
  const modal = document.getElementById('outputModal');
  const closeBtn = document.querySelector('.close');
  const outputDetails = document.getElementById('outputDetails');
  const tryAgainBtn = document.querySelector('.try-again-btn');

  // Handle form submission
  form.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Get form values
      const theme = document.getElementById('theme').value;
      const message = document.getElementById('message').value;
      const colorPalette = document.getElementById('colorPalette').value;
      const aspectRatio = document.getElementById('aspectRatio').value;
      const resolution = document.getElementById('resolution').value;
      const format = document.getElementById('format').value;

      // Send form data to the backend
      const response = await fetch('/generate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              theme,
              message,
              colorPalette,
              aspectRatio,
              resolution,
              format,
          }),
      });

      // Check if the response is OK
      if (response.ok) {
          const result = await response.text(); // Get the response text

          // Populate modal with the response
          outputDetails.innerHTML = result;
          modal.style.display = 'block';
      } else {
          // Handle error
          outputDetails.innerHTML = `<p>Error occurred while generating the banner. Please try again.</p>`;
          modal.style.display = 'block';
      }
  });

  // Close the modal when the user clicks the 'X'
  closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
  });

  // Close the modal if the user clicks outside the modal content
  window.addEventListener('click', function (event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  });

  // Reset form and close modal on "Try Again" click
  tryAgainBtn.addEventListener('click', function () {
      form.reset();
      modal.style.display = 'none';
  });
});
