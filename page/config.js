const searchInput = document.getElementById('search');
const searchSuggestions = document.getElementById('searchSuggestions');
const suggestionList = document.getElementById('suggestionList');
const searchHistory = document.getElementById('searchHistory');
const openHistoryButton = document.getElementById('openHistoryButton');
const historyModal = document.getElementById('historyModal');
const closeHistoryButton = document.getElementById('closeHistoryButton');
const clearHistoryButton = document.getElementById('clearHistoryButton');
let suggestions = []; // Array de sugestões da tabela

clearHistoryButton.addEventListener('click', () => {
    const confirmDelete = confirm('Deseja realmente apagar todo o histórico de pesquisa?');
    if (confirmDelete) {
        clearSearchHistory();
    }
});

function clearSearchHistory() {
    localStorage.removeItem('searchHistory'); // Remove o histórico do localStorage
    searchHistory.innerHTML = ''; // Limpa a lista de histórico exibida na página
    hideHistoryModal(); // Fecha o modal de histórico de pesquisa
}

// Extrai sugestões da tabela
const tableRows = document.querySelectorAll('table tbody tr');
tableRows.forEach(row => {
    const campo = row.querySelector('td:nth-child(1)').textContent.trim();
    const descricao = row.querySelector('td:nth-child(2)').textContent.trim();
    suggestions.push(`${campo} - ${descricao}`);
});

searchInput.addEventListener('input', () => {
    displaySearchSuggestions();
});

searchInput.addEventListener('click', () => {
    displaySearchSuggestions();
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede que o formulário seja enviado, se houver algum
        const query = searchInput.value.trim();
        if (query !== '') {
            addToSearchHistory(query);
            scrollToTableRow(query);
        }
        searchInput.value = ''; // Limpa o valor da barra de pesquisa
        searchSuggestions.classList.add('hidden'); // Fecha a barra de sugestões ao pressionar Enter
    }
});

function scrollToTableRow(query) {
    const tableRow = document.getElementById(query);
    if (tableRow) {
        tableRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
openHistoryButton.addEventListener('click', () => {
    showHistoryModal();
});

closeHistoryButton.addEventListener('click', () => {
    hideHistoryModal();
});


function displaySearchSuggestions() {
    const userQuery = searchInput.value.toLowerCase();
    suggestionList.innerHTML = '';

    if (userQuery === '') {
        searchSuggestions.classList.add('hidden');
        return;
    }

    let found = false;

    suggestions.forEach(suggestion => {
        const suggestionLC = suggestion.toLowerCase();
        if (suggestionLC.includes(userQuery)) {
            found = true;
            const li = document.createElement('li');
            const highlightedSuggestion = highlightMatch(suggestion, userQuery);
            li.innerHTML = highlightedSuggestion;
            li.addEventListener('click', () => {
                searchInput.value = suggestion; // Preenche a barra de pesquisa com a sugestão completa
                searchSuggestions.classList.add('hidden'); // Esconde as sugestões
                searchInput.focus(); // Move o foco de volta para a barra de pesquisa
        });
            suggestionList.appendChild(li);
        }
    });

    if (!found) {
        searchSuggestions.classList.add('hidden');
        return;
    }

    searchSuggestions.classList.remove('hidden');
}

    searchSuggestions.classList.remove('hidden');

function highlightMatch(suggestion, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return suggestion.replace(regex, '<span class="bg-yellow-300">$1</span>');
}

function addToSearchHistory(query) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // Apenas a data, sem a hora

    const historyItem = {
        query: query,
        date: formattedDate,
    };

    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push(historyItem);
    localStorage.setItem('searchHistory', JSON.stringify(history));

    const li = document.createElement('li');
    li.textContent = `${formattedDate}: ${query}`;
    searchHistory.appendChild(li);
}

function showHistoryModal() {
    historyModal.classList.remove('hidden');
}

function hideHistoryModal() {
    historyModal.classList.add('hidden');
}

// Recupera e exibe o histórico de pesquisa ao carregar a página
const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
savedHistory.forEach(historyItem => {
    const li = document.createElement('li');
    li.textContent = `${historyItem.date}: ${historyItem.query}`;
    searchHistory.appendChild(li);
});