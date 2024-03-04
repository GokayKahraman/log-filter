document.getElementById('addFilter').addEventListener('click', function() {
    const newInputDiv = document.createElement('div');
    newInputDiv.className = 'filter-item';
    newInputDiv.innerHTML = `
        <input type="text" class="searchTerm" placeholder="Aranacak kelime...">
        <button type="button" class="removeFilter">-</button>
    `;

    newInputDiv.querySelector('.removeFilter').addEventListener('click', function() {
        newInputDiv.remove();
    });

    document.querySelector('.filters').appendChild(newInputDiv);
});


function filterLogs() {
    document.getElementById('results').innerHTML = ''
    const logFiles = document.getElementById('logFile').files;
    if (logFiles.length === 0 || document.querySelectorAll('.searchTerm').length === 0) {
        alert('Tüm alanları doldur knk');
        return;
    }

    let totalContent = '';
    let filesCount = logFiles.length;
    let filterButton = document.querySelector(".filter-button")

    filterButton.innerText = "..."

    Array.from(logFiles).forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            let logContent = e.target.result;
            document.querySelectorAll('.searchTerm').forEach(input => {
                const searchTerm = input.value;
                if (searchTerm) {
                    logContent = logContent.split('\n').filter(line => line.includes(searchTerm)).join('\n')
                }
            });

            if (logContent) {
                totalContent += logContent + '\n';
            }

            filesCount--;
            if (filesCount === 0) {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';
                filterButton.innerText = "Filter"

                if (!totalContent) {
                    resultsDiv.innerHTML = '<p>No results found.</p>';
                    return;
                }

                const blob = new Blob([totalContent], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'filtered_all_logs.log';
                link.textContent = 'Download Filtered Logs';
                resultsDiv.appendChild(link);

                console.log(totalContent.split("\n").map(el => el !== "" ? JSON.parse(el) : el))
            }
        };

        fileReader.readAsText(file);
    });
}
