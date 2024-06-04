document.addEventListener('DOMContentLoaded', function() {
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

    async function readFileContentInChunks(file, chunkSize = 1024 * 1024) { // 1 MB chunk size
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            let offset = 0;
            let filteredContent = '';

            fileReader.onload = function(e) {
                const content = e.target.result;
                document.querySelectorAll('.searchTerm').forEach(input => {
                    const searchTerm = input.value;
                    if (searchTerm) {
                        filteredContent += content.split('\n').filter(line => {
                            return line.includes(searchTerm.toString());
                        }).join('\n');
                    }
                });

                offset += chunkSize;
                updateProgressBar(offset, file.size);

                if (offset < file.size) {
                    readNextChunk();
                } else {
                    resolve(filteredContent);
                }
            };

            fileReader.onerror = function(e) {
                console.error("Error reading file:", e);
                reject(new Error("File could not be read! Code " + fileReader.error.code));
            };

            function readNextChunk() {
                const slice = file.slice(offset, offset + chunkSize);
                fileReader.readAsText(slice);
            }

            readNextChunk();
        });
    }
    
    function updateProgressBar(loaded, total) {
        const progressBar = document.getElementById('progress-bar');
        const percentLoaded = Math.round((loaded / total) * 100);
        progressBar.style.width = percentLoaded + '%';
        //progressBar.textContent = percentLoaded + '%';
    }

    async function filterLogs() {
        document.getElementById('progress-container').style.display = 'block'
        document.getElementById('results').innerHTML = '';
        const logFiles = document.getElementById('logFile').files;

        console.log("Selected files:", logFiles);

        if (logFiles.length === 0 || document.querySelectorAll('.searchTerm').length === 0) {
            alert('Tüm alanları doldur knk');
            return;
        }

        let totalContent = '';
        let filterButton = document.querySelector(".filter-button");

        filterButton.innerText = "...";

        try {
            for (const file of logFiles) {
                console.log("File size:", file.size);

                if (file.size === 0) {
                    console.error("File is empty!");
                    continue;
                }

                const logContent = await readFileContentInChunks(file);
                console.log("Filtered content length:", logContent.length);

                if (logContent.length === 0) {
                    console.error("Filtered content is empty!");
                    continue;
                }

                totalContent += logContent;
            }

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            filterButton.innerText = "Filter";

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

            document.getElementById('progress-container').style.display = 'none'

        } catch (error) {
            console.error("Error filtering logs:", error);
            alert("An error occurred while reading the file.");
        } finally {
            // Reset the progress bar after operation is completed
            updateProgressBar(0, 1);
        }
    }

    document.querySelector(".filter-button").addEventListener('click', filterLogs);
});
