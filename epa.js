async function carregarLivrosXML() {
    try {
        const response = await fetch('livros.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const livros = xml.getElementsByTagName('livro');
        const livrosArray = Array.from(livros).map(livro => ({
            titulo: livro.getElementsByTagName('titulo')[0].textContent,
            autor: livro.getElementsByTagName('autor')[0].textContent,
            ano: livro.getElementsByTagName('ano')[0].textContent,
            categoria: livro.getElementsByTagName('categoria')[0].textContent,
        }));

        exibirLivros(livrosArray);
    } catch (error) {
        mostrarMensagem('Erro ao carregar dados: ' + error.message);
    }
}

async function carregarLivrosJSON() {
    try {
        const response = await fetch('livros.json');
        const livros = await response.json();
        exibirLivros(livros);
    } catch (error) {
        mostrarMensagem('Erro ao carregar dados: ' + error.message);
    }
}

function exibirLivros(livros) {
    const tbody = document.querySelector('#books-table tbody');
    tbody.innerHTML = '';
    const titleSearch = document.getElementById('title-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    livros = livros.filter(livro => 
        (livro.titulo.toLowerCase().includes(titleSearch) || titleSearch === '') &&
        (livro.categoria === categoryFilter || categoryFilter === '')
    );

    livros.forEach(livro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.ano}</td>
            <td>${livro.categoria}</td>
        `;
        tbody.appendChild(tr);
    });

    mostrarMensagem(livros.length > 0 ? 'Livros carregados com sucesso' : 'Nenhum livro encontrado');
}

function mostrarMensagem(mensagem) {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = mensagem;
    feedback.style.display = 'block';
}

document.getElementById('title-search').addEventListener('input', () => {
    const livros = document.querySelectorAll('#books-table tbody tr');
    livros.forEach(livro => {
        const titulo = livro.cells[0].textContent.toLowerCase();
        const searchValue = document.getElementById('title-search').value.toLowerCase();
        livro.style.display = titulo.includes(searchValue) ? '' : 'none';
    });
});

document.getElementById('category-filter').addEventListener('change', () => {
    const livros = document.querySelectorAll('#books-table tbody tr');
    livros.forEach(livro => {
        const categoria = livro.cells[3].textContent;
        const filterValue = document.getElementById('category-filter').value;
        livro.style.display = filterValue === '' || categoria === filterValue ? '' : 'none';
    });
});
