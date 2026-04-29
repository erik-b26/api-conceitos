const API_BASE = 'http://localhost:3000/items';
let allItems = [];
let codeToId = {};

async function loadAllItems() {
    try {
        const response = await fetch(API_BASE);
        allItems = await response.json();
        codeToId = {};
        allItems.forEach(item => {
            codeToId[item.codigo] = item.id;
        });
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
    }
}

function renderConcept(item) {
    return `
        <div class="concept">
            <h3>${item.titulo} (${item.codigo})</h3>
            <p><strong>Categoria:</strong> ${item.categoria}</p>
            ${item.subCategoria ? `<p><strong>Subcategoria:</strong> ${item.subCategoria}</p>` : ''}
            <p><strong>Descrição:</strong> ${item.descricao}</p>
            <p><strong>Descrição Curta:</strong> ${item.descricaoCurta}</p>
            <h4>Palavras-chave:</h4>
            <ul>${item.palavrasChave.map(k => `<li>${k}</li>`).join('')}</ul>
            <h4>Exemplos:</h4>
            <ul>${item.exemplos.map(e => `<li>${e}</li>`).join('')}</ul>
            <h4>Relacionados:</h4>
            <div class="related">${item.relacionados.map(r => `<a href="conceito.html?codigo=${r}">${r}</a>`).join(', ')}</div>
        </div>
    `;
}

// Para geral.html
if (document.getElementById('conceitos-list')) {
    loadAllItems().then(() => {
        const list = allItems.map(renderConcept).join('');
        document.getElementById('conceitos-list').innerHTML = list;
    });
}

// Para pesquisa.html
if (document.getElementById('search-btn')) {
    loadAllItems().then(() => {
        document.getElementById('search-btn').addEventListener('click', () => {
            const term = document.getElementById('search-input').value.toLowerCase();
            const results = allItems.filter(item =>
                item.titulo.toLowerCase().includes(term) ||
                item.descricao.toLowerCase().includes(term) ||
                item.palavrasChave.some(k => k.toLowerCase().includes(term))
            );
            const html = results.map(renderConcept).join('');
            document.getElementById('search-results').innerHTML = html;
        });
    });
}

// Para random.html
if (document.getElementById('random-btn')) {
    loadAllItems().then(() => {
        document.getElementById('random-btn').addEventListener('click', () => {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            document.getElementById('random-concept').innerHTML = renderConcept(randomItem);
        });
    });
}

// Para conceito.html
if (document.getElementById('concept-detail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const codigo = urlParams.get('codigo');
    if (codigo) {
        loadAllItems().then(() => {
            const id = codeToId[codigo];
            if (id) {
                fetch(`${API_BASE}/${id}`)
                    .then(res => res.json())
                    .then(item => {
                        document.getElementById('concept-detail').innerHTML = renderConcept(item);
                    });
            } else {
                document.getElementById('concept-detail').innerHTML = '<p>Conceito não encontrado.</p>';
            }
        });
    }
}