document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var actionButton = document.getElementById('actionButton');
    var downloadCsvButton = document.getElementById('downloadCsvButton');
    var resultsTable = document.getElementById('resultsTable');
    var filenameInput = document.getElementById('filenameInput');
    var messageElement = document.getElementById('message');
    var emptyState = document.getElementById('emptyState');

    if (
      currentTab &&
      currentTab.url.includes('://www.google.com/maps/search')
    ) {
      messageElement.innerHTML =
        '<i class="fas fa-bullseye" style="margin-right: 8px; color: #2d5a41;"></i>All set! The spell is in place. Start revealing the hidden places.';
      messageElement.className = 'success';
      actionButton.disabled = false;
      actionButton.classList.add('enabled');
    } else {
      messageElement.innerHTML =
        '<i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #8b5a00;"></i>Please apparate to <a href="https://www.google.com/maps/search/" target="_blank" style="color: #667eea; font-weight: 600;">Google Maps Search</a> to begin the ritual.';
      messageElement.className = 'warning';

      actionButton.style.display = 'none';
      downloadCsvButton.style.display = 'none';
      if (filenameInput) {
        filenameInput.style.display = 'none';
      }
    }

    actionButton.addEventListener('click', function () {
      actionButton.disabled = true;
      actionButton.classList.add('loading');
      actionButton.innerHTML =
        '<i class="fas fa-spinner fa-spin icon"></i>Casting Locator Charm...';
      messageElement.innerHTML =
        '<i class="fas fa-sync fa-spin" style="margin-right: 8px;"></i>Gathering enchanted data from the map...';
      messageElement.className = '';

      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: scrapeData,
        },
        function (results) {
          actionButton.disabled = false;
          actionButton.classList.remove('loading');
          actionButton.innerHTML =
            '<i class="fas fa-wand-magic-sparkles icon"></i>Reveal Hidden Places';

          while (resultsTable.firstChild) {
            resultsTable.removeChild(resultsTable.firstChild);
          }

          if (
            !results ||
            !results[0] ||
            !results[0].result ||
            results[0].result.length === 0
          ) {
            messageElement.innerHTML =
              '<i class="fas fa-times-circle" style="margin-right: 8px; color: #8b5a00;"></i>No traces detected. Try scrolling through the map realm, then cast again.';
            messageElement.className = 'warning';
            emptyState.style.display = 'block';
            resultsTable.style.display = 'none';
            return;
          }

          emptyState.style.display = 'none';
          resultsTable.style.display = 'table';

          const thead = document.createElement('thead');
          const headers = [
            'Title',
            'Rating',
            'Reviews',
            'Phone',
            'Industry',
            'Address',
            'Website',
            'Google Maps Link',
          ];
          const headerRow = document.createElement('tr');
          headers.forEach((headerText) => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
          });
          thead.appendChild(headerRow);
          resultsTable.appendChild(thead);

          const tbody = document.createElement('tbody');
          resultsTable.appendChild(tbody);

          results[0].result.forEach(function (item) {
            var row = document.createElement('tr');
            [
              'title',
              'rating',
              'reviewCount',
              'phone',
              'industry',
              'address',
              'companyUrl',
              'href',
            ].forEach(function (key) {
              var cell = document.createElement('td');

              if (key === 'reviewCount' && item[key]) {
                item[key] = item[key].replace(/\(|\)/g, '');
              }

              if (key === 'companyUrl' || key === 'href') {
                if (item[key]) {
                  const link = document.createElement('a');
                  link.href = item[key];
                  link.textContent =
                    key === 'companyUrl' ? 'Visit Website' : 'View on Maps';
                  link.target = '_blank';
                  link.style.color = '#667eea';
                  link.style.textDecoration = 'none';
                  cell.appendChild(link);
                }
              } else {
                cell.textContent = item[key] || '';
              }

              row.appendChild(cell);
            });
            tbody.appendChild(row);
          });

          const resultCount = results[0].result.length;
          messageElement.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px; color: #2d5a41;"></i>Success! ${resultCount} enchanted entr${
            resultCount !== 1 ? 'ies' : 'y'
          } revealed.`;
          messageElement.className = 'success';
          downloadCsvButton.disabled = false;
        }
      );
    });

    downloadCsvButton.addEventListener('click', function () {
      downloadCsvButton.disabled = true;
      downloadCsvButton.classList.add('loading');
      const originalText = downloadCsvButton.innerHTML;
      downloadCsvButton.innerHTML =
        '<i class="fas fa-spinner fa-spin icon"></i>Enchanting your scroll...';

      setTimeout(() => {
        var csv = tableToCsv(resultsTable);
        var filename =
          filenameInput && filenameInput.value
            ? filenameInput.value.trim()
            : '';
        if (!filename) {
          filename = 'marauders-map-data.csv';
        } else {
          filename = filename.replace(/[^a-z0-9\-_.]/gi, '_').toLowerCase();
          if (!filename.endsWith('.csv')) {
            filename += '.csv';
          }
        }
        downloadCsv(csv, filename);

        downloadCsvButton.disabled = false;
        downloadCsvButton.classList.remove('loading');
        downloadCsvButton.innerHTML = originalText;

        messageElement.innerHTML = `<i class="fas fa-download" style="margin-right: 8px; color: #2d5a41;"></i>Scroll saved as <strong>${filename}</strong>`;
        messageElement.className = 'success';
      }, 500);
    });
  });
});

function scrapeData() {
  var links = Array.from(
    document.querySelectorAll('a[href^="https://www.google.com/maps/place"]')
  );
  return links.map((link) => {
    var container = link.closest('[jsaction*="mouseover:pane"]');
    var titleText = container
      ? container.querySelector('.fontHeadlineSmall').textContent
      : '';
    var rating = '';
    var reviewCount = '';
    var phone = '';
    var industry = '';
    var address = '';
    var companyUrl = '';

    if (container) {
      var roleImgContainer = container.querySelector('[role="img"]');

      if (roleImgContainer) {
        var ariaLabel = roleImgContainer.getAttribute('aria-label');

        if (ariaLabel && ariaLabel.includes('stars')) {
          var parts = ariaLabel.split(' ');
          var rating = parts[0];
          var reviewCount = '(' + parts[2] + ')';
        } else {
          rating = '0';
          reviewCount = '0';
        }
      }
    }

    if (container) {
      var containerText = container.textContent || '';
      var addressRegex = /\d+ [\w\s]+(?:#\s*\d+|Suite\s*\d+|Apt\s*\d+)?/;
      var addressMatch = containerText.match(addressRegex);

      if (addressMatch) {
        address = addressMatch[0];
        var textBeforeAddress = containerText
          .substring(0, containerText.indexOf(address))
          .trim();
        var ratingIndex = textBeforeAddress.lastIndexOf(rating + reviewCount);
        if (ratingIndex !== -1) {
          var rawIndustryText = textBeforeAddress
            .substring(ratingIndex + (rating + reviewCount).length)
            .trim()
            .split(/[\r\n]+/)[0];
          industry = rawIndustryText.replace(/[·.,#!?]/g, '').trim();
        }
        var filterRegex = /\b(Closed|Open 24 hours|24 hours)|Open\b/g;
        address = address.replace(filterRegex, '').trim();
        address = address.replace(/(\d+)(Open)/g, '$1').trim();
        address = address.replace(/(\w)(Open)/g, '$1').trim();
        address = address.replace(/(\w)(Closed)/g, '$1').trim();
      } else {
        address = '';
      }
    }

    if (container) {
      var allLinks = Array.from(container.querySelectorAll('a[href]'));
      var filteredLinks = allLinks.filter(
        (a) => !a.href.startsWith('https://www.google.com/maps/place/')
      );
      if (filteredLinks.length > 0) {
        companyUrl = filteredLinks[0].href;
      }
    }

    if (container) {
      var containerText = container.textContent || '';
      var phoneRegex = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
      var phoneMatch = containerText.match(phoneRegex);
      phone = phoneMatch ? phoneMatch[0] : '';
    }

    return {
      title: titleText,
      rating: rating,
      reviewCount: reviewCount,
      phone: phone,
      industry: industry,
      address: address,
      companyUrl: companyUrl,
      href: link.href,
    };
  });
}

function tableToCsv(table) {
  var csv = [];
  var rows = table.querySelectorAll('tr');

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll('td, th');

    for (var j = 0; j < cols.length; j++) {
      var cellContent = '';

      var link = cols[j].querySelector('a');
      if (link) {
        cellContent = link.href;
      } else {
        cellContent = cols[j].innerText;
      }

      row.push('"' + cellContent + '"');
    }
    csv.push(row.join(','));
  }
  return csv.join('\n');
}

function downloadCsv(csv, filename) {
  var csvFile;
  var downloadLink;

  csvFile = new Blob([csv], { type: 'text/csv' });
  downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
