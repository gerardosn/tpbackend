async function fetchNews() {
    try {
      const response = await fetch('/noticias');
      const noticias = await response.json();
      

      renderNews(noticias);
    } catch (error) {
      console.error('Error al obtener las noticias:', error);
    }
  }
  
  function renderNews(noticias) {
    const seccionNews = document.getElementById('seccionNews');
    seccionNews.innerHTML = ''; 
  
    noticias.forEach(noticia => {
      const noticiaElement = document.createElement('div');
      noticiaElement.innerHTML = `
        <h2>${noticia.titulo}</h2>
        <img src="${noticia.imagen}" alt="" class="styled">
        <div class="txt">
          <p>${noticia.cuerpo}</p>
        </div>
        <div class="button" onclick="alert('Estas leyendo una nota')">Leer</div>
      `;
      seccionNews.appendChild(noticiaElement);
    });
  }

  document.addEventListener('DOMContentLoaded', fetchNews);
  