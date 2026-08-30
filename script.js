const eventList = document.getElementById('events-list');
const status = document.getElementById('status');

function setStatus(message) {
  if (status) {
    status.textContent = message;
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return 'Unknown date';
  }

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function createEventItem(event) {
  const listItem = document.createElement('li');
  listItem.className = 'event-item';

  const header = document.createElement('div');
  header.className = 'event-header';

  const repoName = document.createElement('span');
  repoName.className = 'repo-name';
  repoName.textContent = event.repo || 'Unknown repository';

  const eventDate = document.createElement('span');
  eventDate.className = 'event-date';
  eventDate.textContent = formatDate(event.date);

  const description = document.createElement('p');
  description.className = 'event-description';
  description.textContent = event.description || 'No description provided.';

  header.append(repoName, eventDate);
  listItem.append(header, description);

  return listItem;
}

if (!eventList) {
  console.error('The events list element was not found.');
} else {
  setStatus('Loading starred repositories...');

  fetch('events.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new TypeError('Expected events.json to contain an array of events.');
      }

      eventList.replaceChildren();

      if (data.length === 0) {
        setStatus('No starred repositories available yet.');
        return;
      }

      data.forEach((event) => {
        if (!event || typeof event !== 'object') {
          return;
        }

        eventList.appendChild(createEventItem(event));
      });

      setStatus(`Loaded ${data.length} starred repositories.`);
    })
    .catch((error) => {
      eventList.replaceChildren();
      const errorItem = document.createElement('li');
      errorItem.className = 'error';
      errorItem.textContent = 'Unable to load starred repositories.';
      eventList.appendChild(errorItem);

      setStatus('Unable to load starred repositories.');
      console.error('Error loading events:', error);
    });
}
