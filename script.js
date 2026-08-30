const eventList = document.getElementById('events-list');

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    data.forEach((event) => {
      const listItem = document.createElement('li');
      listItem.className = 'event-item';

      const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      listItem.innerHTML = `
        <div class="event-header">
          <span class="repo-name">${event.repo}</span>
          <span class="event-date">${formattedDate}</span>
        </div>
        <p class="event-description">${event.description}</p>
      `;

      eventList.appendChild(listItem);
    });
  })
  .catch((error) => {
    eventList.innerHTML = '<li class="error">Unable to load starred repositories.</li>';
    console.error('Error loading events:', error);
  });
